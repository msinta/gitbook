import { createComponent, createIntegration } from '@gitbook/runtime';
import { ContentKitIcon } from '@gitbook/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type State = {
    search: string;
    category: string;
    price: string;
};

type AppPage = {
    id: string;
    title: string;
    description: string;
    emoji: string;
    pageUrl: string;
    version: string;
    publisher: string;
    category: string;
    price: number;
    status: string;
    verified: boolean;
    requiredProduct: string;
    supportedVersions: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const flattenPages = (pages: any[]): any[] =>
    pages.flatMap(p => [p, ...flattenPages(p.pages ?? [])]);

const str = (v: unknown) => (v != null ? String(v) : '');
const num = (v: unknown) => (v != null ? Number(v) : 0);
const bool = (v: unknown) => Boolean(v);

function formatPrice(price: number): string {
    return price === 0 ? 'Free' : `$${price.toLocaleString()}`;
}

function matchesPrice(price: number, filter: string): boolean {
    if (filter === 'All') return true;
    if (filter === 'free') return price === 0;
    if (filter === 'under500') return price > 0 && price < 500;
    if (filter === '500to2000') return price >= 500 && price <= 2000;
    if (filter === 'above2000') return price > 2000;
    return true;
}

function chunk<T>(arr: T[], n: number): T[][] {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += n) rows.push(arr.slice(i, i + n));
    return rows;
}

// ---------------------------------------------------------------------------
// Card renderer
// Mirrors the webframe card structure as closely as ContentKit allows:
//   title + hint (publisher · version) · icon for verified
//   children: meta rows → divider → description → divider → badges + price
//   buttons: View Details (top-right)
// ---------------------------------------------------------------------------

function renderCard(app: AppPage) {
    // hint = subtitle line under title
    const hintParts = [app.publisher, app.version ? `v${app.version}` : ''].filter(Boolean);
    const hint = hintParts.length ? hintParts.join(' · ') : undefined;

    // Meta row: supported versions + required product
    const metaLines = [
        app.supportedVersions ? `**Supported versions:** ${app.supportedVersions}` : '',
        app.requiredProduct ? `**Required product:** ${app.requiredProduct}` : '',
    ].filter(Boolean);

    // Badge row: category + status as inline code, price as bold
    const badgeParts = [
        app.category ? `\`${app.category}\`` : '',
        app.status ? `\`${app.status}\`` : '',
    ].filter(Boolean).join('  ');

    const priceText = formatPrice(app.price);

    return (
        <box grow={1}>
            <card
                title={app.emoji ? `${app.emoji} ${app.title}` : app.title}
                hint={hint}
                icon={app.verified ? ContentKitIcon.CheckCircle : undefined}
                buttons={app.pageUrl ? [{
                    type: 'button' as const,
                    label: 'View Details',
                    icon: ContentKitIcon.LinkExternal,
                    onPress: { action: '@ui.url.open', url: app.pageUrl },
                }] : undefined}
            >
                {metaLines.length > 0 ? (
                    <markdown content={metaLines.join('  \n')} />
                ) : null}
                {metaLines.length > 0 ? (
                    <divider size="small" />
                ) : null}
                {app.description ? (
                    <markdown content={app.description} />
                ) : null}
                <divider size="small" />
                <hstack align="center">
                    <box grow={1}>
                        <markdown content={badgeParts || '\u200b'} />
                    </box>
                    <text style="bold">{priceText}</text>
                </hstack>
            </card>
        </box>
    );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const appCatalogueBlock = createComponent<{}, State>({
    componentId: 'mo-app-catalogue',

    initialState: { search: '', category: 'All', price: 'All' },

    render: async (element, context) => {
        const spaceId = context.environment.spaceInstallation?.space;
        const { apiEndpoint, apiTokens } = context.environment;
        const headers = { Authorization: `Bearer ${apiTokens.installation}` };

        const { search, category, price } = element.state;

        // ------------------------------------------------------------------
        // Fetch
        // ------------------------------------------------------------------
        let apps: AppPage[] = [];
        let fetchError: string | null = null;
        let rawPageCount = 0;
        let docPageCount = 0;

        if (!spaceId) {
            fetchError = 'No space installation found — add this block to a GitBook space.';
        } else {
            try {
                const [spaceRes, pagesRes] = await Promise.all([
                    fetch(`${apiEndpoint}/v1/spaces/${spaceId}`, { headers }),
                    fetch(`${apiEndpoint}/v1/spaces/${spaceId}/content/pages`, { headers }),
                ]);

                const spaceData = await spaceRes.json() as { urls?: { published?: string } };
                const pagesData = await pagesRes.json() as { pages?: any[] };

                const publishedBase = spaceData.urls?.published ?? '';
                const allPages = flattenPages(pagesData.pages ?? []);

                rawPageCount = allPages.length;
                docPageCount = allPages.filter(p => p.type === 'document').length;

                apps = allPages
                    .filter(p => p.type === 'document')
                    .map(p => ({
                        id: p.id,
                        title: str(p.title) || 'Untitled',
                        description: str(p.variables?.description),
                        emoji: str(p.emoji),
                        pageUrl:
                            publishedBase && p.path
                                ? `${publishedBase}${p.path}`
                                : str(p.urls?.app),
                        version: str(p.variables?.version),
                        publisher: str(p.variables?.publisher),
                        category: str(p.variables?.category) || 'Uncategorized',
                        price: num(p.variables?.price),
                        status: str(p.variables?.status),
                        verified: bool(p.variables?.verified),
                        requiredProduct: str(p.variables?.requiredProduct),
                        supportedVersions: str(p.variables?.supportedVersions),
                    }));
            } catch (err) {
                fetchError = String(err);
            }
        }

        // ------------------------------------------------------------------
        // Filter — server-side on every re-render.
        // textinput updates state silently; Search button triggers re-render.
        // Both selects have onValueChange for instant re-render on change.
        // ------------------------------------------------------------------
        const searchLower = search.toLowerCase();
        const filtered = apps.filter(app => {
            const matchSearch =
                !search ||
                app.title.toLowerCase().includes(searchLower) ||
                app.description.toLowerCase().includes(searchLower) ||
                app.publisher.toLowerCase().includes(searchLower);
            return matchSearch
                && (category === 'All' || app.category === category)
                && matchesPrice(app.price, price);
        });

        const categoryOptions = [
            { id: 'All', label: 'All Categories' },
            ...Array.from(new Set(apps.map(a => a.category).filter(Boolean)))
                .map(c => ({ id: c, label: c })),
        ];

        const priceOptions = [
            { id: 'All', label: 'All Prices' },
            { id: 'free', label: 'Free' },
            { id: 'under500', label: 'Under $500' },
            { id: '500to2000', label: '$500 – $2,000' },
            { id: 'above2000', label: '$2,000+' },
        ];

        // ------------------------------------------------------------------
        // Render
        // ------------------------------------------------------------------
        return (
            <block>
                {/* Controls */}
                <hstack align="center">
                    <box grow={1}>
                        <textinput
                            state="search"
                            placeholder="Search by name, description or publisher…"
                            initialValue={search}
                        />
                    </box>
                    <button
                        label="Search"
                        icon={ContentKitIcon.Search}
                        onPress={{ action: 'search' }}
                    />
                    <select
                        state="category"
                        initialValue={category}
                        placeholder="All Categories"
                        options={categoryOptions}
                        onValueChange={{ action: 'filter' }}
                    />
                    <select
                        state="price"
                        initialValue={price}
                        placeholder="All Prices"
                        options={priceOptions}
                        onValueChange={{ action: 'filter' }}
                    />
                </hstack>

                {/* Result count */}
                {!fetchError && apps.length > 0 ? (
                    <markdown content={
                        filtered.length === apps.length
                            ? `*${apps.length} apps*`
                            : `*Showing ${filtered.length} of ${apps.length} apps*`
                    } />
                ) : null}

                {/* Error */}
                {fetchError ? (
                    <markdown content={`> **Error:** ${fetchError}`} />
                ) : null}

                {/* Empty */}
                {!fetchError && filtered.length === 0 ? (
                    <markdown content={
                        apps.length === 0
                            ? `**No pages loaded.** Found ${rawPageCount} total pages, ${docPageCount} of type \`document\`. Pages need a \`category\` variable to appear here.`
                            : '**No apps match your search or filters.**'
                    } />
                ) : null}

                {/* Grid: vstack of 3-column rows */}
                {filtered.length > 0 ? (
                    <vstack>
                        {chunk(filtered, 3).map(row => (
                            <hstack>
                                {row.map(app => renderCard(app))}
                            </hstack>
                        ))}
                    </vstack>
                ) : null}
            </block>
        );
    },
});

// ---------------------------------------------------------------------------
// Integration
// ---------------------------------------------------------------------------

export default createIntegration({
    components: [appCatalogueBlock],
});
