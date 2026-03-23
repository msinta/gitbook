import { createComponent, createIntegration, FetchEventCallback } from '@gitbook/runtime';
import { hardcodedApps } from './data';
import { buildHtml } from './html';


const flattenPages = (pages: any[]): any[] =>
    pages.flatMap(p => [p, ...flattenPages(p.pages ?? [])]);

const handleFetch: FetchEventCallback = async (request) => {
    const url = new URL(request.url);
    if (!url.pathname.endsWith('/iframe.html')) return new Response('Not found', { status: 404 });

    let apps = hardcodedApps.map(a => ({ ...a, pageUrl: '', editorUrl: '' }));
    const dataParam = url.searchParams.get('data');
    if (dataParam) {
        try {
            const parsed = JSON.parse(decodeURIComponent(dataParam));
            if (parsed.length > 0) apps = parsed;
        } catch {}
    }

    return new Response(buildHtml(apps), {
        headers: {
            'Content-Type': 'text/html',
            'X-Frame-Options': 'ALLOWALL',
            'Content-Security-Policy': 'frame-ancestors *',
        },
    });
};

const appCatalogueBlock = createComponent({
    componentId: 'mo-app-catalogue',
    render: async (element, context) => {
        const base = context.environment.installation?.urls.publicEndpoint
            ?? context.environment.integration.urls.publicEndpoint;
        const spaceId = context.environment.spaceInstallation?.space;
        const { apiEndpoint, apiTokens } = context.environment;
        const headers = { 'Authorization': `Bearer ${apiTokens.installation}` };


        let apps = hardcodedApps.map(a => ({ ...a, pageUrl: '', editorUrl: '' }));


        if (spaceId) {
            try {
                const [spaceRes, pagesRes] = await Promise.all([
                    fetch(`${apiEndpoint}/v1/spaces/${spaceId}`, { headers }),
                    fetch(`${apiEndpoint}/v1/spaces/${spaceId}/content/pages`, { headers }),
                ]);

                const { urls } = await spaceRes.json() as { urls?: { published?: string } };
                const { pages } = await pagesRes.json() as { pages?: any[] };
                const publishedBase = urls?.published ?? '';
                const allPages = flattenPages(pages ?? []);

                apps = apps.map(app => {
                    const match = allPages.find((p: any) => p.id === (app as any).pageId);
                    return {
                        ...app,
                        name: match?.title ?? app.name,
                        description: match?.description ?? app.description,
                        pageUrl: publishedBase && match?.path ? `${publishedBase}${match.path}` : match?.urls?.app ?? '',
                        editorUrl: match?.urls?.app ?? '',
                    };
                });
            } catch {}
        }

        const iframeUrl = `${base}/iframe.html?data=${encodeURIComponent(JSON.stringify(apps))}`;

        return (
            <block>
                <webframe source={{ url: iframeUrl }} aspectRatio={16 / 9} />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetch,
    components: [appCatalogueBlock],
});
