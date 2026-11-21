// Generates every page and the CV from data/profile.json. No dependencies.
// Run: node scripts/build.mjs   (then: node scripts/render-assets.cjs  for the PDF, OG image, favicons)
// The generated files are committed. On Vercel, scripts/stage.mjs copies only the public files into dist/ (see vercel.json).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const d = JSON.parse(readFileSync('data/profile.json', 'utf8'));
const b = d.basics;
const SITE = b.links.site.replace(/\/$/, '');
const FILL = /^\[\[FILL/;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const out = (path, html) => { mkdirSync(dirname(path) || '.', { recursive: true }); writeFileSync(path, html); console.log('wrote', path, html.length, 'bytes'); };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = s => { if (!s) return 'Present'; const [y, m] = s.split('-'); return m ? `${MONTHS[+m - 1]} ${y}` : y; };
const range = (a, z) => `${ym(a)} – ${ym(z)}`;
const longDate = s => { const [y, m, dd] = s.split('-'); return `${+dd} ${MONTHS[+m - 1]} ${y}`; };
const ext = (href, text, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${text}<span class="sr-only"> (opens in new tab)</span></a>`;
const isLink = v => v && !FILL.test(v);
const chips = (items, labelledby = '') => `<ul class="chips"${labelledby ? ` aria-labelledby="${labelledby}"` : ''}>${items.map(i => `<li class="chip">${esc(i)}</li>`).join('')}</ul>`;
const placeholder = (img, extraCls = '') => `<!-- ${img.src} --><div class="shot-ph ${extraCls}" role="img" aria-label="${esc(img.alt)} (screenshot coming soon)"><div><b>${esc(img.alt)}</b>Screenshot coming soon</div></div>`;
const projects = d.projects;
const featured = projects.find(p => p.featured);
const grid = projects.filter(p => !p.featured && !p.otherWork);
const other = projects.filter(p => p.otherWork);
const lastUpdated = longDate(d.meta.lastUpdated);
const year = d.meta.lastUpdated.slice(0, 4);

const ICON = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.65-1.61-2.65-1.62 0-1.87 1.26-1.87 2.56v4.93h-4v-11Z"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16"/></svg>',
};

const CV_FILE = 'Chamod_Tharusha_Alwis.pdf';

function head({ title, description, path, base, extraHead = '', home = false }) {
  const url = SITE + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FAF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121417" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(b.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(b.name)} — ${esc(b.headline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/img/og-image.jpg">
<link rel="icon" href="${base}favicon.ico" sizes="32x32">
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">
<link rel="preload" href="${base}assets/fonts/inter-normal-400-600-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/fraunces-normal-600-latin.woff2" as="font" type="font/woff2" crossorigin>${home ? `
<link rel="preload" href="${base}assets/fonts/fraunces-italic-400-latin.woff2" as="font" type="font/woff2" crossorigin>` : ''}
<script>try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="${base}assets/css/site.css">
<script src="${base}assets/js/main.js" type="module"></script>
${extraHead}</head>`;
}

function nav(base, home) {
  const h = home ? '' : `${base}index.html`;
  const links = [['work', 'Work'], ['experience', 'Experience'], ['skills', 'Skills'], ['about', 'About'], ['contact', 'Contact']];
  const li = links.map(([id, t]) => `<li><a href="${h}#${id}">${t}</a></li>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="top">
  <div class="wrap">
    <a class="brand" href="${home ? '#top' : `${base}index.html`}" aria-label="${esc(b.name)} — home">Chamod<span>.</span></a>
    <nav aria-label="Primary">
      <ul class="nav-links">${li}<li><a class="btn btn-primary btn-sm" href="${base}${CV_FILE}" download>Download CV</a></li></ul>
    </nav>
    <div class="nav-tools">
      <button class="icon-btn" id="theme" type="button" aria-label="Switch theme">${ICON.moon}</button>
      <button class="icon-btn menu-btn" id="menu-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${ICON.menu}</button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="head">
    <span class="brand" aria-hidden="true">Chamod<span>.</span></span>
    <button class="icon-btn" id="menu-close" type="button" aria-label="Close menu">${ICON.close}</button>
  </div>
  <ul>${li}</ul>
  <a class="btn btn-primary" href="${base}${CV_FILE}" download>Download CV</a>
</div>`;
}

const footer = () => `<footer>
  <div class="wrap">
    <span>© ${year} ${esc(b.name)} · Last updated <time datetime="${d.meta.lastUpdated}">${lastUpdated}</time></span>
    <a href="#top">Back to top ↑</a>
  </div>
</footer>
</body>
</html>
`;

function projectLinks(p, base, small = false) {
  const cls = `btn btn-ghost${small ? ' btn-sm' : ''}`;
  const parts = [];
  if (p.links.caseStudy) parts.push(`<a class="btn btn-primary${small ? ' btn-sm' : ''}" href="${base}${p.links.caseStudy}">Read case study <span aria-hidden="true">→</span></a>`);
  if (isLink(p.links.live)) parts.push(ext(p.links.live, 'Live site', cls));
  if (isLink(p.links.repo)) parts.push(ext(p.links.repo, 'Code', cls));
  return parts.length ? `<div class="actions">${parts.join('\n')}</div>` : '';
}

const stats = s => `<dl class="stats">${s.map(x => `<div class="stat"><dt class="sr-only">${esc(x.label)}</dt><dd><b>${esc(x.value.replace(/ → /, '→'))}</b><span>${esc(x.label)}</span></dd></div>`).join('')}</dl>`;

const img = (i, cls = '') => FILL.test(i.src) ? placeholder(i, cls)
  : `<img src="${i.src}"${i.small ? ` srcset="${i.small} 480w, ${i.src} ${i.width}w" sizes="(min-width: 768px) 540px, 100vw"` : ''} width="${i.width}" height="${i.height}" loading="lazy" decoding="async" alt="${esc(i.alt)}">`;

// ---------- Home ----------
function home() {
  const base = '';
  const h1 = esc(b.headline).replace(esc(b.headlineEmphasis), `<em>${esc(b.headlineEmphasis)}</em>`);
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Person', name: b.name, url: SITE + '/', image: `${SITE}/${b.photo.src}`,
    jobTitle: d.experience[0].role, email: `mailto:${b.email}`,
    worksFor: { '@type': 'Organization', name: d.experience[0].org },
    address: { '@type': 'PostalAddress', addressLocality: 'Kandy', addressCountry: 'LK' },
    alumniOf: d.education.map(e => ({ '@type': 'EducationalOrganization', name: e.org })),
    sameAs: [b.links.github, b.links.linkedin],
    knowsAbout: ['Full-stack development', 'MERN stack', 'Data science', 'Machine learning'],
  };
  const f = featured;
  const card = p => `<article class="card reveal" data-cat="${p.category.join(' ')}">
          ${p.images[0] ? img(p.images[0]) : ''}
          <div class="card-body">
            <p class="meta">${esc(p.cardMeta)}</p>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.summary)}</p>
            ${chips(p.cardStack)}
            ${projectLinks(p, base, true)}
          </div>
        </article>`;
  return head({
    title: `${b.name} — Full-Stack Developer, Kandy`,
    description: `Full-stack developer in Kandy, Sri Lanka building secure, data-driven web apps with MERN, Python and Flask. Open to junior SE and data roles.`,
    path: '/', base, home: true,
    extraHead: `<link rel="preload" as="image" href="${b.photo.src}" type="image/webp">\n<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`,
  }) + `
<body>
${nav(base, true)}
<main id="main">
  <section class="hero" aria-labelledby="hero-h">
    <div class="wrap hero-grid">
      <div>
        <p class="status">
          <span class="pill"><span class="dot" aria-hidden="true"></span>${esc(b.availability)}</span>
          <span>${esc(b.location)}</span>
        </p>
        <h1 id="hero-h"><span class="name">${esc(b.name)}</span><br>${h1}</h1>
        <p class="lead">${esc(b.heroSub)}</p>
        <div class="cta">
          <a class="btn btn-primary" href="#work">View my work</a>
          <a class="btn btn-ghost" href="${CV_FILE}" download>${ICON.download}Download CV</a>
          <span class="socials">
            <a class="icon-btn" href="${b.links.github}" target="_blank" rel="noopener" aria-label="GitHub (opens in new tab)">${ICON.github}</a>
            <a class="icon-btn" href="${b.links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn (opens in new tab)">${ICON.linkedin}</a>
          </span>
        </div>
      </div>
      <figure class="portrait">
        <img src="${b.photo.src}" srcset="${b.photo.src} 480w, ${b.photo.src2x} 720w" sizes="(min-width: 880px) 340px, 220px" width="${b.photo.width}" height="${b.photo.height}" fetchpriority="high" alt="${esc(b.photo.alt)}">
        <figcaption><b>Now</b>SE intern · BSc Data Science</figcaption>
      </figure>
    </div>
  </section>

  <section id="work" aria-labelledby="work-h">
    <div class="wrap">
      <p class="eyebrow">Selected work</p>
      <h2 id="work-h">Projects</h2>
      <article class="featured reveal" aria-labelledby="f-h">
        ${img(f.images[0])}
        <div class="featured-body">
          <p class="meta">${esc(f.cardMeta)}</p>
          <h3 id="f-h">${esc(f.name)}</h3>
          <p>${esc(f.summary)}</p>
          ${stats(f.stats)}
          ${chips(f.cardStack)}
          ${projectLinks(f, base)}
        </div>
      </article>
      <div class="spacer"></div>
      <div class="filters" role="group" aria-label="Filter projects">
        <button class="filter" type="button" aria-pressed="true" data-f="all">All</button>
        <button class="filter" type="button" aria-pressed="false" data-f="full-stack">Full-Stack</button>
        <button class="filter" type="button" aria-pressed="false" data-f="data-ml">Data &amp; ML</button>
      </div>
      <div class="grid-2">
        ${grid.map(card).join('\n        ')}
      </div>
      ${other.map(p => `<div class="other reveal" data-cat="${p.category.join(' ')}">
        <p class="label">Other work</p>
        <div>
          <h3>${esc(p.name)} <span class="meta">· ${esc(p.cardMeta.toLowerCase())}</span></h3>
          <p class="meta">${esc(p.summary)}</p>
        </div>
      </div>`).join('\n')}
    </div>
  </section>

  <section id="experience" aria-labelledby="exp-h">
    <div class="wrap">
      <p class="eyebrow">Experience &amp; education</p>
      <h2 id="exp-h">Where I've worked and studied</h2>
      <ol class="timeline">
        ${d.experience.map(e => `<li class="reveal">
          <p class="when">${range(e.start, e.end)}</p>
          <h3>${esc(e.role)}</h3>
          <p class="org">${esc(e.org)} · ${esc(e.location.split(',')[0])}</p>
          <ul>${e.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </li>`).join('\n        ')}
        ${d.education.map(e => `<li class="edu reveal"><p class="when">${range(e.start, e.end)}</p><h3>${esc(e.degree)}</h3><p class="org">${esc(e.org)}${e.awarding ? ` — ${esc(e.awarding)}` : ''}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section id="skills" aria-labelledby="skills-h">
    <div class="wrap">
      <p class="eyebrow">Toolbox</p>
      <h2 id="skills-h">Skills</h2>
      <div class="skills">
        ${d.skills.map((g, i) => `<div class="skill-group"><h3 id="sk-${i}">${esc(g.group)}</h3>${chips(g.items, `sk-${i}`)}</div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section id="about" aria-labelledby="about-h">
    <div class="wrap about">
      <div><p class="eyebrow">About</p><h2 id="about-h">A bit about me</h2></div>
      <div>${b.about.map(p => `<p>${esc(p)}</p>`).join('\n        ')}</div>
    </div>
  </section>

  <section id="contact" class="flush-top" aria-labelledby="contact-h">
    <div class="wrap">
      <div class="contact-card">
        <h2 id="contact-h">Let's talk</h2>
        <p>${esc(b.contactBlurb)}</p>
        <div class="email-row">
          <a class="email" href="mailto:${b.email}">${esc(b.email)}</a>
          <button class="btn btn-ghost btn-sm" type="button" id="copy" data-email="${esc(b.email)}">Copy email</button>
          <span role="status" aria-live="polite" id="copy-msg" class="meta"></span>
        </div>
        <div class="contact-links">
          ${ext(b.links.linkedin, 'LinkedIn')}
          ${ext(b.links.github, 'GitHub')}
          <span>${esc(b.location)}</span>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}`;
}

// ---------- Case study ----------
function archSvg(a) {
  // Simple left-to-right diagram: client -> API -> ML engine, with the API's data stores below.
  const stores = a.stores;
  const sw = 150, gap = 14, total = stores.length * sw + (stores.length - 1) * gap, sx = (760 - total) / 2;
  return `<figure class="arch">
  <svg viewBox="0 0 760 300" role="img" aria-labelledby="arch-t arch-d">
    <title id="arch-t">MediSync architecture</title>
    <desc id="arch-d">The ${esc(a.client)} client talks to the ${esc(a.api)} API, which calls the ${esc(a.ml)} ML engine. The API uses ${esc(stores.join(', '))}.</desc>
    <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="currentColor"/></marker></defs>
    <g style="color: var(--ink-2)">
      <path class="ln" d="M210 70 H275" marker-end="url(#ar)" marker-start="url(#ar)"/>
      <path class="ln" d="M485 70 H550" marker-end="url(#ar)" marker-start="url(#ar)"/>
      <path class="ln" d="M380 112 V176"/>
      <path class="ln" d="M${sx + sw / 2} 176 H${sx + total - sw / 2}"/>
      ${stores.map((_, i) => `<path class="ln" d="M${sx + i * (sw + gap) + sw / 2} 176 V200" marker-end="url(#ar)"/>`).join('')}
    </g>
    <rect class="box" x="10" y="30" width="200" height="82" rx="10"/>
    <text class="t" x="110" y="66" text-anchor="middle">Web client</text><text class="s" x="110" y="88" text-anchor="middle">${esc(a.client)}</text>
    <rect class="box-key" x="280" y="30" width="200" height="82" rx="10"/>
    <text class="t" x="380" y="66" text-anchor="middle">API</text><text class="s" x="380" y="88" text-anchor="middle">${esc(a.api)}</text>
    <rect class="box" x="550" y="30" width="200" height="82" rx="10"/>
    <text class="t" x="650" y="66" text-anchor="middle">ML engine</text><text class="s" x="650" y="88" text-anchor="middle">${esc(a.ml)}</text>
    ${stores.map((s, i) => `<rect class="box" x="${sx + i * (sw + gap)}" y="204" width="${sw}" height="56" rx="10"/><text class="s" x="${sx + i * (sw + gap) + sw / 2}" y="237" text-anchor="middle">${esc(s)}</text>`).join('')}
  </svg>
  <figcaption>Three services. The Flask ML engine can scale and deploy independently of the web API.</figcaption>
</figure>`;
}

function caseStudy(p) {
  const base = '../';
  const cs = p.caseStudy;
  const sections = [['overview', 'Overview'], ['problem', 'Problem'], ['role', 'My role'], ['architecture', 'Architecture'], ['features', 'Key features'], ['decisions', 'Tech decisions'], ['challenges', 'Challenges & what I learned'], ['screenshots', 'Screenshots'], ['links', 'Links']];
  const imgCS = i => FILL.test(i.src) ? placeholder(i) : `<img src="${base}${i.src}" width="${i.width}" height="${i.height}" loading="lazy" decoding="async" alt="${esc(i.alt)}">`;
  const linkItems = [
    isLink(p.links.live) ? `<li>${ext(p.links.live, 'Live site', 'btn btn-primary')}</li>` : '',
    isLink(p.links.repo) ? `<li>${ext(p.links.repo, 'Source code on GitHub', 'btn btn-ghost')}</li>` : '',
    `<li><a class="btn btn-ghost" href="${base}index.html#work">All projects</a></li>`,
  ].join('');
  return head({
    title: `${p.name} case study — ${b.name}`,
    description: `How I built ${p.name}: React 19, Express 5 and a Flask ML engine with outbreak forecasting and AES-256 encrypted patient records.`,
    path: `/${p.links.caseStudy}`, base,
  }) + `
<body>
${nav(base, false)}
<main id="main">
  <div class="wrap cs-hero">
    <a class="back" href="${base}index.html#work"><span aria-hidden="true">←</span> Back to work</a>
    <p class="eyebrow">Case study · ${esc(p.context)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="lead">${esc(p.tagline)}.</p>
    <div class="actions">${isLink(p.links.live) ? ext(p.links.live, 'Live site', 'btn btn-primary') : ''}${isLink(p.links.repo) ? ext(p.links.repo, 'Code', 'btn btn-ghost') : ''}</div>
    ${stats(p.stats)}
    <div class="cs-shot">${imgCS(p.images[0])}</div>
  </div>
  <div class="wrap cs-body">
    <aside class="toc"><nav aria-label="On this page"><ol>${sections.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></nav></aside>
    <div class="prose">
      <section id="overview" aria-labelledby="overview-h"><h2 id="overview-h">Overview</h2><p>${esc(cs.overview)}</p></section>
      <section id="problem" aria-labelledby="problem-h"><h2 id="problem-h">Problem</h2><p>${esc(p.problem)}</p><p><strong>What I built.</strong> ${esc(p.solution)}</p></section>
      <section id="role" aria-labelledby="role-h"><h2 id="role-h">My role</h2><p>${esc(p.role)} That covered the React front end, the Node.js/Express API, the Flask ML engine, the security layer and the CI/CD pipeline.</p></section>
      <section id="architecture" aria-labelledby="architecture-h"><h2 id="architecture-h">Architecture</h2>${archSvg(cs.architecture)}</section>
      <section id="features" aria-labelledby="features-h"><h2 id="features-h">Key features</h2><ul>${p.highlights.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
      <section id="decisions" aria-labelledby="decisions-h"><h2 id="decisions-h">Tech decisions</h2><ul>${cs.techDecisions.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
      <section id="challenges" aria-labelledby="challenges-h"><h2 id="challenges-h">Challenges &amp; what I learned</h2><ul>${cs.challenges.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
      <section id="screenshots" aria-labelledby="screenshots-h"><h2 id="screenshots-h">Screenshots</h2><div class="shots">${p.images.slice(1).map(i => `<figure>${imgCS(i)}<figcaption>${esc(i.alt)}</figcaption></figure>`).join('')}</div></section>
      <section id="links" aria-labelledby="links-h"><h2 id="links-h">Links</h2><p>Stack: ${p.stack.map(esc).join(' · ')}</p><ul class="link-list">${linkItems}</ul></section>
    </div>
  </div>
</main>
${footer()}`;
}

function notFound() {
  return head({ title: `Page not found — ${b.name}`, description: 'This page does not exist.', path: '/404.html', base: '/' })
    .replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"') + `
<body>
${nav('/', false)}
<main id="main" class="wrap not-found">
  <h1>Page not found</h1>
  <p class="lead">That page doesn't exist. It may have moved in the redesign.</p>
  <p><a class="btn btn-primary" href="/">Go to the home page</a></p>
</main>
${footer()}`;
}

// ---------- CV ----------
const bare = u => u.replace(/^https?:\/\//, '').replace(/^www\.linkedin/, 'linkedin').replace(/\/$/, '');
function cvHtml() {
  const cvProjects = projects.filter(p => p.cvBullets && p.cvBullets.length);
  const contact = [
    `<a href="mailto:${b.email}">${esc(b.email)}</a>`, esc(b.phone), esc(b.location),
    `<a href="${b.links.linkedin}">${bare(b.links.linkedin)}</a>`, `<a href="${b.links.github}">${bare(b.links.github)}</a>`, `<a href="${b.links.site}">${bare(b.links.site)}</a>`,
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(b.name)} — CV</title>
<meta name="description" content="CV of ${esc(b.name)}, ${esc(b.cvTitle)}.">
<meta name="author" content="${esc(b.name)}">
<link rel="canonical" href="${SITE}/cv/cv.html">
<link rel="icon" href="../favicon.ico" sizes="32x32">
<link rel="stylesheet" href="cv.css">
</head>
<body>
<main class="cv">
  <header class="cv-head">
    <div class="cv-name"><h1>${esc(b.name)}</h1><p class="cv-title">${esc(b.cvTitle)}</p></div>
    <p class="cv-contact">${contact.join(' <span class="sep" aria-hidden="true">|</span> ')}</p>
  </header>
  <section><h2>Summary</h2><p>${esc(b.cvSummary || b.summary)}</p></section>
  <section><h2>Experience</h2>
    ${d.experience.map(e => `<div class="item"><div class="row"><h3>${esc(e.role)}</h3><span class="when">${range(e.start, e.end)}</span></div>
    <p class="sub">${esc(e.org)}, ${esc(e.location)}</p><ul>${e.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('\n    ')}
  </section>
  <section><h2>Projects</h2>
    ${cvProjects.map(p => `<div class="item"><div class="row"><h3>${esc(p.name)} <span class="tag">— ${esc(p.tagline)}</span></h3><span class="when">${[isLink(p.links.live) ? `<a href="${p.links.live}">Live</a>` : '', isLink(p.links.repo) ? `<a href="${p.links.repo}">Code</a>` : ''].filter(Boolean).join(' · ')}</span></div>
    <p class="sub">${esc(p.cvRole || p.role)} · ${esc(p.stack.slice(0, p.cvStackCount || 6).join(', '))}</p><ul>${p.cvBullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('\n    ')}
  </section>
  <section><h2>Technical Skills</h2>
    <dl class="skills">${(d.cvSkills || d.skills).map(g => `<div><dt>${esc(g.group)}:</dt> <dd>${esc(g.items.join(', '))}</dd></div>`).join('')}</dl>
  </section>
  <section><h2>Education</h2>
    ${d.education.map(e => `<div class="item edu"><div class="row"><p><strong>${esc(e.degree)}</strong>, ${esc(e.org)}${e.awarding ? ` — ${esc(e.awarding)}` : ''}</p><span class="when">${range(e.start, e.end)}</span></div></div>`).join('\n    ')}
  </section>
</main>
</body>
</html>
`;
}

function cvAts() {
  const L = [];
  L.push(b.name, b.cvTitle, [b.email, b.phone, b.location].join(' | '), [bare(b.links.linkedin), bare(b.links.github), bare(b.links.site)].join(' | '), '');
  L.push('SUMMARY', b.cvSummary || b.summary, '');
  L.push('EXPERIENCE');
  d.experience.forEach(e => { L.push(`${e.role} | ${e.org}, ${e.location} | ${range(e.start, e.end)}`); e.bullets.forEach(x => L.push(`- ${x}`)); L.push(''); });
  L.push('PROJECTS');
  projects.filter(p => p.cvBullets?.length).forEach(p => {
    L.push(`${p.name} - ${p.tagline}`);
    L.push(`Role: ${p.role}`, `Technologies: ${p.stack.join(', ')}`);
    if (isLink(p.links.live)) L.push(`Live: ${p.links.live}`);
    if (isLink(p.links.repo)) L.push(`Code: ${p.links.repo}`);
    p.cvBullets.forEach(x => L.push(`- ${x}`)); L.push('');
  });
  L.push('TECHNICAL SKILLS'); (d.cvSkills || d.skills).forEach(g => L.push(`${g.group}: ${g.items.join(', ')}`)); L.push('');
  L.push('EDUCATION'); d.education.forEach(e => L.push(`${e.degree} | ${e.org}${e.awarding ? ` - ${e.awarding}` : ''} | ${range(e.start, e.end).replace('–', '-')}`));
  return L.join('\n').replace(/[–—]/g, '-').replace(/→/g, '->') + '\n';
}

// ---------- write ----------
out('index.html', home());
projects.filter(p => p.caseStudy && p.links.caseStudy).forEach(p => out(p.links.caseStudy, caseStudy(p)));
out('404.html', notFound());
out('cv/cv.html', cvHtml());
out('cv/Chamod_Tharusha_Alwis_ATS.txt', cvAts());
const urls = ['/', ...projects.filter(p => p.caseStudy && p.links.caseStudy).map(p => '/' + p.links.caseStudy)];
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${d.meta.lastUpdated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
