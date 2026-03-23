import { App, getAvatarColor } from './data';

export const buildHtml = (apps: (App & { pageUrl: string; editorUrl: string })[]) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="color-scheme" content="light dark">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --surface: #ffffff;
    --border: #e8e8e8;
    --border-light: #f0f0f0;
    --text-primary: #111111;
    --text-secondary: #555555;
    --text-muted: #888888;
    --input-bg: #ffffff;
    --input-border: #e0e0e0;
    --badge-bg: #f0f0f0;
    --badge-text: #444444;
    --version-bg: #f0f0f0;
    --version-text: #555555;
    --shadow: 0 1px 4px rgba(0,0,0,0.06);
    --shadow-hover: 0 4px 12px rgba(0,0,0,0.1);
    --btn-bg: #f0f0f0;
    --btn-text: #333333;
    --btn-hover: #e0e0e0;
    --price-free: #2e7d32;
    --verified-bg: #fef3c7;
    --verified-color: #92400e;
    --verified-border: #fcd34d;
    --badge-beta-bg: #fce8ff;
    --badge-beta-color: #7b1fa2;
    --badge-stable-bg: #e6f4ea;
    --badge-stable-color: #2e7d32;
    --skeleton-bg: #e8e8e8;
    --skeleton-shine: #f5f5f5;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --surface: #232326;
      --border: #3a3a3f;
      --border-light: #2e2e33;
      --text-primary: #E6E6E6;
      --text-secondary: #aaaaaa;
      --text-muted: #777777;
      --input-bg: #2c2c30;
      --input-border: #3a3a3f;
      --badge-bg: #3a3a3f;
      --badge-text: #cccccc;
      --version-bg: #3a3a3f;
      --version-text: #aaaaaa;
      --shadow: 0 1px 4px rgba(0,0,0,0.4);
      --shadow-hover: 0 4px 12px rgba(0,0,0,0.5);
      --btn-bg: #3a3a3f;
      --btn-text: #E6E6E6;
      --btn-hover: #4a4a50;
      --price-free: #4ade80;
      --verified-bg: #422006;
      --verified-color: #fcd34d;
      --verified-border: #78350f;
      --badge-beta-bg: #3b0764;
      --badge-beta-color: #d8b4fe;
      --badge-stable-bg: #052e16;
      --badge-stable-color: #4ade80;
      --skeleton-bg: #2e2e33;
      --skeleton-shine: #3a3a3f;
    }
  }

  html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 0; margin: 0; overflow: hidden; color: var(--text-primary); }
  .container { padding: 16px; width: 100%; }

  .controls { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .controls input, .controls select { padding: 8px 12px; border: 1px solid var(--input-border); border-radius: 8px; font-size: 14px; outline: none; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
  .controls input::placeholder { color: var(--text-muted); }
  .controls input { flex: 1; min-width: 180px; }
  .controls select option { background: var(--input-bg); color: var(--text-primary); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr)); gap: 16px; }

  .card { position: relative; border: 1px solid var(--border); border-radius: 12px; padding: 16px; background: var(--surface); box-shadow: var(--shadow); transition: box-shadow 0.2s; display: flex; flex-direction: column; gap: 10px; }
  .card:hover { box-shadow: var(--shadow-hover); }

  .verified-badge { position: absolute; top: 12px; right: 12px; background: var(--verified-bg); color: var(--verified-color); font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 20px; border: 1px solid var(--verified-border); letter-spacing: 0.3px; }

  .card-header { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .card-title { flex: 1; }
  .card-name { font-size: 15px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px; }
  .version { font-size: 11px; font-weight: 500; padding: 2px 6px; border-radius: 6px; background: var(--version-bg); color: var(--version-text); }
  .card-publisher { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .card-meta-row { font-size: 12px; color: var(--text-secondary); }
  .card-meta-row span { font-weight: 500; color: var(--text-primary); }
  .card-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
  .divider { border: none; border-top: 1px solid var(--border-light); }
  .card-footer { display: flex; align-items: center; justify-content: space-between; }
  .card-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; background: var(--badge-bg); color: var(--badge-text); font-weight: 500; }
  .badge.beta   { background: var(--badge-beta-bg);   color: var(--badge-beta-color); }
  .badge.stable { background: var(--badge-stable-bg); color: var(--badge-stable-color); }
  .price { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .price.free { color: var(--price-free); }
  .details-btn { display: block; text-align: center; padding: 8px 12px; border-radius: 8px; background: var(--btn-bg); color: var(--btn-text); font-size: 13px; font-weight: 500; text-decoration: none; margin-top: 4px; transition: background 0.2s; border: none; cursor: pointer; width: 100%; }
  .details-btn:hover { background: var(--btn-hover); }

  .empty { text-align: center; padding: 48px 0; color: var(--text-muted); }
  .empty strong { display: block; font-size: 15px; margin-bottom: 6px; color: var(--text-secondary); }

  @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
  .sk { border-radius: 6px; background: linear-gradient(90deg, var(--skeleton-bg) 25%, var(--skeleton-shine) 50%, var(--skeleton-bg) 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite; }
  .sk-avatar { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
  .sk-name    { height: 15px; width: 55%; }
  .sk-version { height: 15px; width: 30px; border-radius: 6px; }
  .sk-publisher { height: 12px; width: 35%; margin-top: 2px; }
  .sk-meta-1  { height: 12px; width: 70%; }
  .sk-meta-2  { height: 12px; width: 55%; }
  .sk-divider { border: none; border-top: 1px solid var(--border-light); }
  .sk-desc-1  { height: 13px; width: 100%; }
  .sk-desc-2  { height: 13px; width: 75%; }
  .sk-footer  { display: flex; align-items: center; justify-content: space-between; }
  .sk-badges  { display: flex; gap: 6px; }
  .sk-badge   { height: 22px; width: 60px; border-radius: 20px; }
  .sk-price   { height: 14px; width: 40px; }
  .sk-btn     { height: 37px; width: 100%; border-radius: 8px; margin-top: 4px; }
</style>
</head>
<body>
<div class="container">
  <div class="controls">
    <input id="search" placeholder="Search apps..." oninput="render()" />
    <select id="category" onchange="render()">
      <option value="All">All Categories</option>
      <option value="Data">Data</option>
      <option value="Monitoring">Monitoring</option>
      <option value="Productivity">Productivity</option>
      <option value="Security">Security</option>
      <option value="Analytics">Analytics</option>
      <option value="DevOps">DevOps</option>
    </select>
    <select id="price" onchange="render()">
      <option value="All">All Prices</option>
      <option value="free">Free</option>
      <option value="under500">Under $500</option>
      <option value="500to2000">$500 – $2,000</option>
      <option value="above2000">$2,000+</option>
    </select>
  </div>
  <div id="result-count" style="display:none; font-size:12px; color:var(--text-muted); margin-bottom:12px;"></div>
  <div class="grid" id="grid"></div>
</div>

<script>
const apps = ${JSON.stringify(apps.map(a => ({ ...a, avatarColor: getAvatarColor(a.name) })))};

function sendAction(action) { window.parent.postMessage({ action }, '*'); }

function resizeFrame() {
  const height = document.body.scrollHeight + 32;
  const width = document.body.scrollWidth || 800;
  sendAction({ action: '@webframe.resize', size: { aspectRatio: width / height, height } });
}

function openPage(pageUrl, editorUrl) {
  const inEditor = window.location.ancestorOrigins?.[0]?.includes('app.gitbook.com') || document.referrer.includes('app.gitbook.com');
  window.top.location.href = inEditor ? editorUrl : pageUrl;
}

function matchesPrice(p, f) {
  if (f === 'All') return true;
  if (f === 'free') return p === 0;
  if (f === 'under500') return p > 0 && p < 500;
  if (f === '500to2000') return p >= 500 && p <= 2000;
  if (f === 'above2000') return p > 2000;
  return true;
}

function formatPrice(p) { return p === 0 ? 'Free' : '$' + p.toLocaleString(); }

const SKELETON_CARD = \`
  <div class="card">
    <div class="card-header">
      <div class="sk sk-avatar"></div>
      <div class="card-title">
        <div style="display:flex;align-items:center;gap:6px"><div class="sk sk-name"></div><div class="sk sk-version"></div></div>
        <div class="sk sk-publisher"></div>
      </div>
    </div>
    <div class="sk sk-meta-1"></div>
    <div class="sk sk-meta-2"></div>
    <div class="sk-divider"></div>
    <div style="display:flex;flex-direction:column;gap:6px"><div class="sk sk-desc-1"></div><div class="sk sk-desc-2"></div></div>
    <div class="sk-divider"></div>
    <div class="sk-footer"><div class="sk-badges"><div class="sk sk-badge"></div><div class="sk sk-badge"></div></div><div class="sk sk-price"></div></div>
    <div class="sk sk-btn"></div>
  </div>\`;

function showSkeleton() {
  document.getElementById('grid').innerHTML = Array(6).fill(SKELETON_CARD).join('');
  setTimeout(resizeFrame, 50);
}

function render() {
  const searchVal = document.getElementById('search').value.toLowerCase();
  const categoryVal = document.getElementById('category').value;
  const priceVal = document.getElementById('price').value;
  const filtered = apps.filter(app => {
    const matchSearch = !searchVal || app.name.toLowerCase().includes(searchVal) || app.description.toLowerCase().includes(searchVal);
    return matchSearch && (categoryVal === 'All' || app.category === categoryVal) && matchesPrice(app.price, priceVal);
  });

  const countEl = document.getElementById('result-count');
  const isFiltered = searchVal || categoryVal !== 'All' || priceVal !== 'All';
  countEl.textContent = isFiltered ? \`Showing \${filtered.length} of \${apps.length} apps\` : '';
  countEl.style.display = isFiltered ? 'block' : 'none';

  const grid = document.getElementById('grid');
  grid.innerHTML = filtered.length === 0
    ? '<div class="empty"><strong>No apps found</strong><p style="margin-top:8px;font-size:13px;">Try adjusting your search or filters.</p></div>'
    : filtered.map(app => \`
      <div class="card">
        \${app.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
        <div class="card-header">
          <div class="avatar" style="background:\${app.avatarColor}">\${app.name.charAt(0)}</div>
          <div class="card-title">
            <div class="card-name">\${app.name}<span class="version">\${app.version}</span></div>
            <div class="card-publisher">\${app.publisher}</div>
          </div>
        </div>
        <div class="card-meta-row">Supported versions: <span>\${app.supportedVersions.join(', ')}</span></div>
        <div class="card-meta-row">Required product: <span>\${app.requiredProduct}</span></div>
        <hr class="divider" />
        <div class="card-desc">\${app.description}</div>
        <hr class="divider" />
        <div class="card-footer">
          <div class="card-badges"><span class="badge">\${app.category}</span><span class="badge \${app.status.toLowerCase()}">\${app.status}</span></div>
          <div class="price \${app.price === 0 ? 'free' : ''}">\${formatPrice(app.price)}</div>
        </div>
        \${app.pageUrl ? \`<button class="details-btn" onclick="openPage('\${app.pageUrl}', '\${app.editorUrl}')">View Details →</button>\` : ''}
      </div>\`).join('');

  setTimeout(resizeFrame, 50);
  setTimeout(resizeFrame, 300);
}

if (document.readyState !== 'loading') {
  sendAction({ action: '@webframe.ready' });
} else {
  document.addEventListener('DOMContentLoaded', () => sendAction({ action: '@webframe.ready' }));
}

showSkeleton();
window.addEventListener('load', () => render());
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => render());
window.addEventListener('resize', () => render());
new ResizeObserver(() => resizeFrame()).observe(document.body);
</script>
</body>
</html>`;
