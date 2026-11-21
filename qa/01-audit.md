# Phase 1 — Audit (A1 Auditor)

Date: 2026-11-21 · Audited commit: `d36f0bf` (tip of `main`) · Read-only: no site files changed.

## How this was measured (read this first)

- **The live site could not be reached from the audit sandbox.** `curl -sI https://chamod-tharusha-alwis.github.io/` returned
  `403 Forbidden (agent proxy: no rule or network setting allows this host)`. So every number below comes from the **same files on `main`**, served locally with `python3 -m http.server`.
- `index.html` loads its images by absolute URL (`https://chamod-tharusha-alwis.github.io/profile2.jpg` etc.). For the local run only, a scratch copy had that prefix stripped so the images load. The repo file was not changed.
- Local-server side effects: `python -m http.server` sends no gzip and no cache headers, so the Lighthouse items `uses-text-compression` and `uses-long-cache-ttl` would partly go away on GitHub Pages. The image weight problems are real either way.
- Tools: Lighthouse 12.6.1 with Chromium 1243 headless, Playwright, poppler `pdfinfo`/`pdftotext`.

## 1. Lighthouse baseline (home page)

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| **Mobile** | **68** | 91 | 96 | 91 |
| **Desktop** | **82** | 91 | 96 | 91 |
| Target (Section 7.2) | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |

Mobile metrics: FCP 3.3 s · **LCP 17.3 s** · TBT 0 ms · CLS 0 · total transfer **3,044 KiB**.
Desktop metrics: FCP 0.9 s · LCP 3.0 s · CLS 0.001.
LCP element: `<img src="profile2.jpg" class="hero-photo">`.

Raw JSON: `qa/lighthouse/baseline-mobile.json`, `qa/lighthouse/baseline-desktop.json`.

Failing audits (score < 0.9):
- Accessibility: `color-contrast` — nav links `#6b7a9a` on `#0b0f15` = 4.45:1 (needs 4.5); footer `#394255` on `#07090f` = **1.97:1**.
- SEO: `meta-description` missing.
- Best Practices: `errors-in-console` — one 404 (the browser asks for `/favicon.ico`, which doesn't exist).
- Performance: image delivery (est. save ~2.8 MB), responsive images (~2.6 MB), modern formats (~2.1 MB), render-blocking Google Fonts (~2.5 s mobile), offscreen images.

## 2. Screenshots

`qa/screenshots/baseline/`
- `current-375-fold.png`, `current-375-full.png`
- `current-1440-fold.png`, `current-1440-full.png`

## 3. Repo structure

```
index.html  1,137 lines — all CSS (≈780 lines) and JS inline in one file
style.css     248 lines — NOT LINKED from index.html (dead file, older blue/Poppins theme)
profile.jpg   960×1280,   52 KB  (About photo)
profile2.jpg  3000×4000, 1.59 MB (hero photo, shown at 360×360 → ~100× too many pixels)
new.png       1899×866,  1.04 MB (Ayu Arana Care screenshot, name says nothing)
ceylon-traveler1.png 1902×820, 253 KB
Chamod_Tharusha_Alwis.pdf  80 KB (FlowCV export)
```
No `robots.txt`, `sitemap.xml`, favicon, OG image, `404.html`, or README.

## 4. Prioritised problem list

### P0 — hurts hiring outcomes directly
1. **MediSync, your strongest project, is missing** from both the site and the CV.
2. **Mobile layout is broken.** At 375 px the page is 427 px wide (`scrollWidth 427 / innerWidth 375`): the pill nav is 436 px wide and clips "ABOUT" and "CONTACT" (see `current-375-fold.png`). There's no mobile menu.
3. **Mobile LCP 17.3 s** — caused by the 1.59 MB, 3000×4000 hero photo. Recruiters on phones see a blank circle for seconds.
4. **Skills are thin and out of date:** no TypeScript, Python data stack, Flask/FastAPI, Redis, Vault, CI/CD, ML libraries.
5. **No meta description, no Open Graph/Twitter card** — links shared on LinkedIn/WhatsApp show no preview.

### P1 — accessibility (WCAG 2.2 AA)
6. `cursor: none` on `body` and every link/button hides the real pointer on desktop; the replacement cursor is drawn by **two competing `requestAnimationFrame` loops** (lines 1097 and 1128) running forever.
7. No `<main>` landmark, no skip link.
8. Focus indicator is only the browser default (`outline: auto 1px`) on a near-black page; no styled `:focus-visible`.
9. **`prefers-reduced-motion` is ignored** — verified: with reduced motion on, the spinning rings still run (`animation-name: spin-slow`). Content also starts at `opacity:0` and only appears via JS, so with JS off the page is mostly blank.
10. Contrast failures listed in section 1.
11. 6 `target="_blank"` links, 0 with `rel="noopener"`, and none tell screen-reader users they open a new tab.
12. Decorative emoji (⚡) and the arrows ↗ → are read aloud.

### P2 — content and credibility
13. Generic copy: "thoughtful, end-to-end digital experiences that are fast, clean, and purposeful", "passionate about clean code", stat "∞ Curiosity", "5+ Languages" (you list 8).
14. Projects show no problem/role/impact, only a description + chips. No case-study pages.
15. **Fact mismatch:** the site says Ceylon Traveler has "a custom AI engine powered by Google Gemini" generating itineraries. Your brief and the CV don't mention this. Needs confirming (see questions).
16. No experience section on the site (Shield Technologies internship isn't mentioned at all); education only in a paragraph.
17. Footer says "© 2025".
18. GitHub contact icon SVG path has a typo (`c3 0 6-2-6-5.5`) so the icon renders distorted.

### P3 — SEO/hygiene
19. No canonical URL, JSON-LD `Person`, `robots.txt`, `sitemap.xml`, favicon.
20. Images have no `width`/`height`, no `loading="lazy"`, no WebP/AVIF; image URLs are hard-coded absolute to the live domain (breaks local preview and any custom domain).
21. Three font families (Fraunces, Syne, DM Sans) — the spec says max 2.
22. Dead `style.css`.

## 5. Current CV audit (`Chamod_Tharusha_Alwis.pdf`)

`pdfinfo`: 1 page, **612×792 pt = US Letter (not A4)**, made by FlowCV, tagged PDF.

| Issue | Evidence |
|---|---|
| Paper size is Letter, not A4 | `Page size: 612 x 792 pts (letter)` |
| **Hidden zero-width space inside the email** — copy-paste / ATS parsing yields a broken address | `pdftotext` → `'odtharusha13​@g'` |
| Hidden word-joiner char after company name | `'VATE)LIMITED⁠'` |
| "SHIELD TECHNOLOGIES (PRIVATE)LIMITED" — missing space, all caps | text extract |
| "ESU Kandy Campus" — you say it should be ESOFT Metro Campus | text extract |
| "Nextgen campus" lower-case c | text extract |
| Bullets extract as `•` on a separate line from their text, with blank lines between → ATS may split each bullet into fragments | 6 orphaned `•` lines in `pdftotext -layout` output |
| Skills laid out in 3 columns; "RESTful API Design" wraps into the wrong column in extraction | text extract |
| MediSync missing; no TypeScript / Flask / FastAPI / ML / Redis / Vault / CI/CD | text extract |
| Summary opens with "Results-driven" and ends "drive innovation within a dynamic team" | text extract |
| No portfolio URL in header | text extract |

## 6. Links

| Link | Status |
|---|---|
| Internal anchors `#about #skills #projects #contact` | OK — all targets exist |
| `Chamod_Tharusha_Alwis.pdf` | OK (local 200) |
| ayu-arana-care / ceylon-traveler live sites, GitHub repos, LinkedIn | **NOT VERIFIED** — the sandbox network blocks these hosts (curl returned 000/403 from the proxy, not from the sites) |

## 7. Keyboard walkthrough (current)

Tab order (375 and 1440 identical): About → Skills → Projects → Contact → View Work → Let's Talk → Download CV → Live Website → Source Code → Live Website → Source Code → Email → LinkedIn → GitHub. Order is logical. Problems: no skip link, weak focus ring, nav off-screen on mobile so the first and last nav items are focused while clipped.
