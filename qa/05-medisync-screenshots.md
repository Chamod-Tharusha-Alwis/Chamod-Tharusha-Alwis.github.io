# 05 — MediSync screenshots

Images (originals in `assets/legacy/`, not deployed): public health surveillance page (main image on the home card and the case-study hero), landing page and doctor portal (case-study Screenshots section). Doctor portal cropped below y = 862 px to remove the "commit fd71d33" line. WebP at 480 / 960 / 1440 widths with `srcset`/`sizes`, width/height set, descriptive alt text. The home featured card now shows the image full width above the text, so the wide screenshot isn't cropped or letterboxed.

Local server, Lighthouse 12.6.1 (Performance / Accessibility / Best Practices / SEO), JSON in `qa/lighthouse/v4-*.json`:
```
home mobile      99 | 100 | 100 | 100 | LCP 2.3 s | CLS 0
home desktop    100 | 100 | 100 | 100 | LCP 0.5 s | CLS 0
medisync mobile  99 | 100 | 100 | 100 | LCP 1.8 s | CLS 0
medisync desktop 100 | 100 | 100 | 100 | LCP 0.4 s | CLS 0
```
axe-core 4.10.2: 0 violations on / and /projects/medisync.html in light and dark.
html-validate: exit 0 on all pages. No horizontal scroll at 390 / 1440. All MediSync images load (checked `complete && naturalWidth > 0`).
No `[[FILL` markers remain in the site, data or content files.

## Update: landing page is the main image (PR #4 review change)

Order is now: landing page → home featured card + case-study hero; public health page → first in the case-study Screenshots section; doctor portal → second. Alt text rewritten for each position (the Screenshots captions use the same text). Sizes, width/height and srcset unchanged.

```
html-validate (all pages): exit 0
home mobile      99 | 100 | 100 | 100 | LCP 2.3 s | CLS 0
home desktop    100 | 100 | 100 | 100 | LCP 0.5 s | CLS 0
medisync mobile 100 | 100 | 100 | 100 | LCP 1.8 s | CLS 0
medisync desktop 100 | 100 | 100 | 100 | LCP 0.4 s | CLS 0
axe: 0 violations on / and /projects/medisync.html, light and dark
scrollWidth = viewport at 390 and 1440 on both pages; all images load
```
Screenshots: `qa/screenshots/v4/home-featured-card-1440.png`, `home-featured-card-390.png`, `medisync-screenshots-section-1440.png`.

## Fix: blurry Screenshots section (sizes attribute)

Cause: `sizes="(min-width: 768px) 420px, 100vw"` with a two-column grid (each image ~339 px wide), so 1× desktop screens correctly picked the 480 file, which looks soft for dense UI shots. Fix: one screenshot per row at the text-column width, and `sizes="(min-width: 1024px) 710px, (min-width: 768px) 680px, calc(100vw - 32px)"` to match.

Loaded file (Playwright `currentSrc`), before → after:
```
1440px 1x  480 @339px  →  medisync-public-health-960.webp, medisync-doctor-portal-960.webp @705px
1440px 2x  960 @339px  →  ...-1440.webp @705px
1920px 1x  480 @339px  →  ...-960.webp @705px
1024px 1x  480 @308px  →  ...-960.webp @642px
 768px 1x  480 @322px  →  ...-960.webp @670px
 390px 1x  480 @356px  →  ...-480.webp @356px (correct for the slot)
 390px 3x  1440 @356px →  ...-1440.webp @356px
```
html-validate exit 0 · MediSync Lighthouse mobile 99/100/100/100, desktop 100/100/100/100, CLS 0 · axe 0 violations (light, dark) · no horizontal scroll at 390/1440.
