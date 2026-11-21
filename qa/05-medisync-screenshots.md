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
