# 06 — Cache-busting and MediSync featured card

## 1. Caching
Problem: `/assets/css` and `/assets/js` were cached for 1 day under fixed URLs, so after a deploy returning visitors got new HTML with old CSS.

Fix:
- `scripts/build.mjs` appends `?v=<first 10 hex chars of SHA-256>` to every asset URL it emits: CSS, JS, font preloads, images (`src`, `srcset`, image preload), favicon, apple-touch icon, OG/Twitter image, JSON-LD image.
- Fonts are referenced from `site.css`, so the build stamps their hashes into the CSS `url()`s first (idempotent), then hashes the CSS. A second build produces byte-identical output.
- `vercel.json`: `/assets/(.*)` → `public, max-age=31536000, immutable` (safe because every reference is hashed); everything else (HTML, sitemap, robots, CV PDF, favicon.ico) → `public, max-age=0, must-revalidate`.

Checks:
```
second build: identical output
unversioned assets/ refs in shipped HTML/CSS: none
assets/css/site.css?v=…  assets/js/main.js?v=…  (hash changes when the file changes:
  e.g. this PR's CSS edit changed site.css?v=b72e749586 → a new hash)
```

## 2. Featured card
- Landing screenshot cropped at y = 680 px (just below the two buttons); the cut-off "Interactive Workflows" box is gone. WebPs regenerated at 480/960/1440 (1440×515).
- Image runs full width across the top of the card; text below. Text splits into two columns only from 1200 px (at 1024 px the right column was too narrow).

Measured (Playwright, image box vs. its container):
```
1024 card 928x816  media 926x332  img 926x331  empty band: 1px vertical (divider line), 0 horizontal
1440 card 1120x750 media 1118x401 img 1118x400 empty band: 1px vertical (divider line), 0 horizontal
1920 card 1120x750 media 1118x401 img 1118x400 empty band: 1px vertical (divider line), 0 horizontal
no horizontal scroll; 0 failed requests
```
Screenshots: `qa/screenshots/v5/home-featured-card-{1024,1440,1920}.png`.

## 3. Re-run
```
html-validate (all pages): exit 0
home mobile      99 | 100 | 100 | 100 | LCP 2.3 s | CLS 0
home desktop    100 | 100 | 100 | 100 | LCP 0.5 s | CLS 0
medisync mobile 100 | 100 | 100 | 100 | LCP 1.8 s | CLS 0
medisync desktop 100 | 100 | 100 | 100 | LCP 0.5 s | CLS 0
axe: 0 violations on / and /projects/medisync.html, light and dark
```
Not verified here: the real Vercel response headers (the Vercel Preview is not reachable from the build sandbox).
