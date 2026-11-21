// Renders the CV PDF, the Open Graph image and the favicons with headless Chromium.
// Run after build.mjs:  node scripts/render-assets.cjs
// Needs Playwright (npm i -g playwright, or any install it can require).
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/profile.json'), 'utf8'));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0E6B66"/><text x="32" y="45" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="40" fill="#FAF8F3">C</text><circle cx="49" cy="43" r="4" fill="#5FC9BF"/></svg>\n`;

const OG_HTML = b => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/css/site.css"><style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background-color:#FAF8F3;display:grid;grid-template-columns:1fr 330px;gap:56px;align-items:center;padding:0 80px;box-sizing:border-box}
h1{font:600 64px/1.05 'Fraunces',serif;letter-spacing:-.02em;color:#16181D;margin:18px 0 22px}
h1 em{font-style:italic;font-weight:400;color:#0E6B66}
.n{font:500 26px 'Inter';color:#4A4F5A}.u{font:500 22px 'Inter';color:#0E6B66;margin-top:26px}
img{width:330px;height:412px;object-fit:cover;border-radius:22px;border:1px solid #E3DED2}
</style></head><body><div><div class="n">${b.name}</div><h1>${b.headline.replace(b.headlineEmphasis, `<em>${b.headlineEmphasis}</em>`)}</h1><div class="n">${b.location} · ${b.availability}</div><div class="u">${b.links.site.replace(/^https:\/\//, '').replace(/\/$/, '')}</div></div><img src="/${b.photo.src2x}" alt=""></body></html>`;

function serve() {
  const server = http.createServer((req, res) => {
    if (req.url === '/__og') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(OG_HTML(d.basics)); }
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

// Minimal ICO writer: one embedded 32x32 PNG.
function pngToIco(png) {
  const h = Buffer.alloc(22);
  h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h.writeUInt8(32, 6); h.writeUInt8(32, 7); h.writeUInt8(0, 8); h.writeUInt8(0, 9);
  h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(png.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, png]);
}

(async () => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  try {
    // Favicons
    fs.writeFileSync(path.join(ROOT, 'assets/img/favicon.svg'), FAVICON_SVG);
    for (const [size, file] of [[32, null], [180, 'assets/img/apple-touch-icon.png']]) {
      const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      await p.setContent(`<html><body style="margin:0;background:#0E6B66">${FAVICON_SVG.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
      const buf = await p.screenshot({ type: 'png', omitBackground: false });
      if (file) fs.writeFileSync(path.join(ROOT, file), buf);
      else fs.writeFileSync(path.join(ROOT, 'favicon.ico'), pngToIco(buf));
      await p.close();
    }
    console.log('wrote favicon.ico, assets/img/favicon.svg, assets/img/apple-touch-icon.png');

    // Open Graph image 1200x630
    const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await og.goto(`${base}/__og`, { waitUntil: 'networkidle' });
    await og.evaluate(() => document.fonts.ready);
    await og.screenshot({ path: path.join(ROOT, 'assets/img/og-image.png') });
    await og.close();
    console.log('wrote assets/img/og-image.png');

    // CV PDF (A4, from cv/cv.html)
    const cv = await browser.newPage();
    await cv.goto(`${base}/cv/cv.html`, { waitUntil: 'networkidle' });
    await cv.evaluate(() => document.fonts.ready);
    await cv.emulateMedia({ media: 'print' });
    await cv.pdf({ path: path.join(ROOT, 'Chamod_Tharusha_Alwis.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: false });
    console.log('wrote Chamod_Tharusha_Alwis.pdf');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
