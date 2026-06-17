#!/usr/bin/env node
/**
 * Build static GitHub Pages site from docs/ and guides/ markdown.
 * Usage: node build-site.mjs [projectRoot]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', process.argv[2] || '.');

const siteDir = path.join(projectRoot, 'site');
const cssSource = path.join(__dirname, 'assets', 'site.css');
const cssDest = path.join(siteDir, 'assets', 'site.css');

marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

const NAV_SECTIONS = [
  {
    title: 'Pump and BLE',
    items: ['01-hardware', '02-ble-protocol', '03-encryption', '04-key-exchange'],
  },
  {
    title: 'Backend and security',
    items: ['05-backend-communication', '06-closed-loop-algorithm', '07-obfuscation', '08-security-findings', '09-bypass-options', '10-legal-analysis'],
  },
  {
    title: 'CamAPS FX',
    items: ['11-camaps-algorithm-analysis', '12-camaps-sideload-bypass', '13-play-integrity-bypass-success', '20-camaps-apk-189-vs-192', '21-camaps-liberty-availability', '22-cgm-error-codes-reference'],
  },
  {
    title: 'mylife app',
    items: ['14-mylife-app-overview', '15-mylife-app-security', '16-mylife-app-proregia-protocol', '17-mylife-app-components', '18-mylife-app-bypass-plan', '19-key-lifecycle-pump-rotation'],
  },
];

const LANG_ALT = {
  '20-camaps-apk-189-vs-192': {
    href: '20-camaps-apk-189-vs-192.nb.html',
    label: 'Norsk rapport',
  },
  '20-camaps-apk-189-vs-192.nb': {
    href: '20-camaps-apk-189-vs-192.html',
    label: 'English report',
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugFromHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/\s*\{#.+\}\s*$/, '').trim();
      headings.push({ level, text, id: slugFromHeading(text) });
    }
  }
  return headings;
}

function extractTitle(markdown) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Untitled';
}

function fixMarkdownLinks(html) {
  return html
    .replace(/href="([^"]+)\.md(#[^"]*)?"/g, (_, base, hash = '') => `href="${base}.html${hash || ''}"`)
    .replace(/href="\.\.\/data\//g, 'href="../data/');
}

function readMarkdownFiles(dir, prefix) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const base = f.replace(/\.md$/, '');
      const mdPath = path.join(dir, f);
      const markdown = fs.readFileSync(mdPath, 'utf8');
      return {
        id: base,
        title: extractTitle(markdown),
        markdown,
        headings: extractHeadings(markdown),
        htmlOut: path.join(siteDir, prefix, `${base}.html`),
        webPath: `${prefix}/${base}.html`,
        section: prefix,
      };
    });
}

function docHref(id, navContext) {
  if (navContext === 'docs') return `${id}.html`;
  return `../docs/${id}.html`;
}

function guideHref(id, navContext) {
  if (navContext === 'guides') return `${id}.html`;
  return `../guides/${id}.html`;
}

function buildSidebarNav(activeId, tocHeadings, navContext = 'docs') {
  let html = '';

  for (const section of NAV_SECTIONS) {
    html += `<h2>${escapeHtml(section.title)}</h2><ul>`;
    for (const id of section.items) {
      const cls = id === activeId || id === activeId?.replace(/\.nb$/, '') ? ' class="active"' : '';
      const label = id.replace(/^\d+-/, '').replace(/-/g, ' ');
      html += `<li><a href="${docHref(id, navContext)}"${cls}>${escapeHtml(id.split('-')[0] + ' — ' + label)}</a></li>`;
    }
    html += '</ul>';
  }

  html += '<h2>Guides</h2><ul>';
  for (const g of ['building-a-driver-app', 'frida-key-extraction', 'ble-sniffing-setup']) {
    const cls = g === activeId ? ' class="active"' : '';
    html += `<li><a href="${guideHref(g, navContext)}"${cls}>${escapeHtml(g.replace(/-/g, ' '))}</a></li>`;
  }
  html += '</ul>';

  const homeHref = navContext === 'root' ? 'index.html' : '../index.html';
  const dataHref = navContext === 'data' ? 'index.html' : '../data/index.html';

  html += '<h2>More</h2><ul>';
  html += `<li><a href="${homeHref}"${activeId === 'home' ? ' class="active"' : ''}>Home</a></li>`;
  html += `<li><a href="${dataHref}"${activeId === 'data' ? ' class="active"' : ''}>Data / CSV</a></li>`;
  html += '<li><a href="https://github.com/master3395/ypsopump-research">GitHub</a></li>';
  html += '</ul>';

  if (tocHeadings && tocHeadings.length) {
    html += '<h2>On this page</h2><ul class="toc">';
    for (const h of tocHeadings) {
      if (h.level > 3) continue;
      const pad = h.level === 2 ? '' : ' style="padding-left:1.25rem"';
      html += `<li><a href="#${escapeHtml(h.id)}"${pad}>${escapeHtml(h.text)}</a></li>`;
    }
    html += '</ul>';
  }

  return html;
}

function buildPage({ title, body, activeId, tocHeadings, breadcrumb, langAlt, lang = 'en', depth = 1, navContext = 'docs' }) {
  const cssHref = `${'../'.repeat(depth)}assets/site.css`;
  const homeHref = `${'../'.repeat(depth)}index.html`;
  const langSwitch = langAlt
    ? `<p class="lang-switch"><a href="${escapeHtml(langAlt.href)}">${escapeHtml(langAlt.label)}</a></p>`
    : '';

  const sidebar = buildSidebarNav(activeId, tocHeadings, navContext);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | YpsoPump Research</title>
  <link rel="stylesheet" href="${cssHref}">
</head>
<body>
  <header class="site-header">
    <a href="${homeHref}">YpsoPump Research</a>
    <span class="tagline">#WeAreNotWaiting</span>
  </header>
  <div class="layout">
    <nav class="sidebar" aria-label="Documentation">${sidebar}</nav>
    <div class="main">
      ${breadcrumb ? `<div class="breadcrumb">${breadcrumb}</div>` : ''}
      ${langSwitch}
      <article class="content">${body}</article>
      <footer class="site-footer">
        <p><strong>Research only.</strong> Not a medical device. Insulin dosing errors can cause severe harm or death.</p>
        <p>Based on <a href="https://github.com/SandraK82/ypsopump-research">SandraK82/ypsopump-research</a> (MIT). Enhanced fork by <a href="https://github.com/master3395/ypsopump-research">master3395</a>.</p>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

function buildHomePage() {
  const body = `
    <div class="home-hero">
      <h1>YpsoPump Research</h1>
      <p>Reverse engineering documentation and AndroidAPS driver research for the Ypsomed YpsoPump insulin pump and CamAPS FX companion app.</p>
      <p><a class="btn" href="https://github.com/master3395/ypsopump-research">View on GitHub</a></p>
    </div>
    <div class="card-grid">
      <div class="card">
        <h2>Pump and BLE</h2>
        <p>Hardware, protocol, encryption, and key exchange.</p>
        <ul>
          <li><a href="docs/01-hardware.html">01 Hardware</a></li>
          <li><a href="docs/02-ble-protocol.html">02 BLE protocol</a></li>
          <li><a href="docs/03-encryption.html">03 Encryption</a></li>
          <li><a href="docs/04-key-exchange.html">04 Key exchange</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>Backend and security</h2>
        <p>ProRegia gRPC, vulnerabilities, bypass strategies, legal basis.</p>
        <ul>
          <li><a href="docs/05-backend-communication.html">05 Backend</a></li>
          <li><a href="docs/08-security-findings.html">08 Security</a></li>
          <li><a href="docs/09-bypass-options.html">09 Bypass options</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>CamAPS FX</h2>
        <p>Algorithm, Play Integrity, and v2 APK comparison (189 vs 192).</p>
        <ul>
          <li><a href="docs/11-camaps-algorithm-analysis.html">11 Algorithm</a></li>
          <li><a href="docs/20-camaps-apk-189-vs-192.html">20 APK 189 vs 192</a></li>
          <li><a href="docs/21-camaps-liberty-availability.html">21 Liberty availability</a></li>
          <li><a href="docs/22-cgm-error-codes-reference.html">22 CGM error codes</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>mylife app</h2>
        <p>Xamarin app, ProRegia protocol, components.</p>
        <ul>
          <li><a href="docs/14-mylife-app-overview.html">14 Overview</a></li>
          <li><a href="docs/16-mylife-app-proregia-protocol.html">16 Protocol</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>Practical guides</h2>
        <p>Driver walkthrough, Frida, BLE sniffing.</p>
        <ul>
          <li><a href="guides/building-a-driver-app.html">Building a driver</a></li>
          <li><a href="guides/frida-key-extraction.html">Frida key extraction</a></li>
          <li><a href="guides/ble-sniffing-setup.html">BLE sniffing</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>Data</h2>
        <p>CGM error code CSV exports from CamAPS FX build 192.</p>
        <p><a class="btn" href="data/index.html">Browse data</a></p>
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>YpsoPump Research</title>
  <link rel="stylesheet" href="assets/site.css">
</head>
<body>
  <header class="site-header">
    <a href="index.html">YpsoPump Research</a>
    <span class="tagline">#WeAreNotWaiting</span>
  </header>
  <div class="layout">
    <nav class="sidebar" aria-label="Documentation">${buildSidebarNav('home', null, 'root')}</nav>
    <div class="main">${body}
      <footer class="site-footer">
        <p><strong>Research only.</strong> Not a medical device.</p>
        <p>Fork of <a href="https://github.com/SandraK82/ypsopump-research">SandraK82/ypsopump-research</a> by <a href="https://github.com/master3395">master3395</a>.</p>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function buildDataPage() {
  const dataDir = path.join(projectRoot, 'data');
  const files = fs.existsSync(dataDir) ? fs.readdirSync(dataDir).filter((f) => f.endsWith('.csv')) : [];
  let body = '<h1 class="page-title">Data files</h1><p>CGM error code exports from CamAPS FX build 1.4(192).101.</p>';

  for (const file of files) {
    const csvPath = path.join(dataDir, file);
    const dest = path.join(siteDir, 'data', file);
    fs.copyFileSync(csvPath, dest);
    const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
    const preview = rows.slice(0, 16);

    body += `<h2>${escapeHtml(file)}</h2>`;
    body += `<p><a class="btn" href="${escapeHtml(file)}" download>Download CSV</a> (${rows.length - 1} data rows)</p>`;
    body += '<div class="data-table-wrap"><table><thead><tr>';
    for (const h of preview[0] || []) body += `<th>${escapeHtml(h)}</th>`;
    body += '</tr></thead><tbody>';
    for (const r of preview.slice(1)) {
      body += '<tr>';
      for (const c of r) body += `<td>${escapeHtml(c)}</td>`;
      body += '</tr>';
    }
    body += '</tbody></table></div>';
    if (rows.length > 16) body += `<p><em>Showing first 15 rows. Download CSV for full list.</em></p>`;
  }

  return buildPage({
    title: 'Data files',
    body,
    activeId: 'data',
    breadcrumb: '<a href="../index.html">Home</a> / Data',
    depth: 1,
    navContext: 'data',
  });
}

function cleanSiteDir() {
  if (fs.existsSync(siteDir)) {
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(siteDir, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(siteDir, 'guides'), { recursive: true });
  fs.mkdirSync(path.join(siteDir, 'data'), { recursive: true });
  fs.mkdirSync(path.join(siteDir, 'assets'), { recursive: true });
}

function writeDocPage(doc, prefix) {
  let body = fixMarkdownLinks(marked.parse(doc.markdown));
  const lang = doc.id.endsWith('.nb') ? 'nb' : 'en';
  const langAlt = LANG_ALT[doc.id] || null;
  if (langAlt && prefix === 'docs') {
    langAlt.href = langAlt.href;
  }

  const html = buildPage({
    title: doc.title,
    body,
    activeId: doc.id.replace(/\.nb$/, ''),
    tocHeadings: doc.headings,
    breadcrumb: `<a href="../index.html">Home</a> / ${escapeHtml(doc.title)}`,
    langAlt: prefix === 'docs' ? langAlt : null,
    lang,
    depth: 1,
    navContext: prefix === 'guides' ? 'guides' : 'docs',
  });

  fs.writeFileSync(doc.htmlOut, html, 'utf8');
  console.log(`Wrote ${doc.htmlOut}`);
}

cleanSiteDir();
fs.copyFileSync(cssSource, cssDest);
fs.writeFileSync(path.join(siteDir, '.nojekyll'), '', 'utf8');
fs.writeFileSync(path.join(siteDir, 'index.html'), buildHomePage(), 'utf8');
console.log(`Wrote ${path.join(siteDir, 'index.html')}`);

const docs = readMarkdownFiles(path.join(projectRoot, 'docs'), 'docs');
const guides = readMarkdownFiles(path.join(projectRoot, 'guides'), 'guides');

for (const doc of docs) writeDocPage(doc, 'docs');
for (const doc of guides) writeDocPage(doc, 'guides');

fs.writeFileSync(path.join(siteDir, 'data', 'index.html'), buildDataPage(), 'utf8');
console.log(`Wrote ${path.join(siteDir, 'data', 'index.html')}`);

console.log(`Done. ${docs.length + guides.length + 2} HTML page(s) in site/`);
