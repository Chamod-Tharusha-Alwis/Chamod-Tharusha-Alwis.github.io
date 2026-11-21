# 03 — Fixes and re-check of failed QA items

Date 2026-11-21. Fixes by A4/A5 for the failures in `qa/02-qa-report.md`, then only the failed checks re-run, plus the CV checks because the CV changed. Local server: `python3 -m http.server 8096`. Screenshots: `qa/screenshots/recheck/`.

| # | QA failure | Fix | Re-check result |
|---|---|---|---|
| 1 | Ceylon Traveler image shows "Gemini-powered AI Assistant" | Whole screenshot is the AI hero, so it can't be cropped out. Replaced with a labelled placeholder ("Ceylon Traveler booking page — Screenshot coming soon"); FILL marker asks for a new screenshot | **PASS**: `gemini in text: false` at 360/768/1440; placeholder present |
| 2 | Card images cropped at the sides | `.card img` now uses the image's own ratio (`height:auto`, no forced 16:9) | **PASS**: Ayu box ratio 2.177–2.183 vs natural 2.195 (difference is the 1px border), `object-fit: fill` (not cover) at 360/768/1440 |
| 3 | MediSync screenshot FILLs | Needs owner (screenshots on the way) | **OPEN**: placeholders remain |
| 4 | Phone on CV although `phonePublic:false` | Owner decision: phone on CV only. Flag renamed `phoneOnWebsite:false` and documented in `meta.notes` | **RESOLVED (by design)**: phone absent from site HTML, present on CV |
| 5 | Unnamed second `<nav>` | `aria-label="On this page"` moved onto the TOC `<nav>` | html-validate **0 errors** |
| 6 | Raw `&` in TOC | TOC labels escaped | html-validate **0 errors** |
| 7 | `aria-label` on `<ul>` | Removed from stack chips; skill lists use `aria-labelledby` → group `<h3>` | html-validate **0 errors**; axe 0 serious/critical |
| 8 | Dead menu/theme buttons with JS off | Hidden without `.js`; nav links shown as a wrapping row | **PASS**: no-JS 390 → `menuBtn:none, theme:none, links:flex, scrollWidth:390` |
| 9 | Figcaption overstated deployment | "Three services. The Flask ML engine can scale and deploy independently of the web API." | Wording matches the profile |
| 10 | CLS 0.07 from late italic font | Preload `fraunces-italic-400-latin.woff2` on the home page | **PASS**: CLS 0 (mobile and desktop) |
| 11 | Advisories | Meta descriptions shortened (≤160 chars); OG image now JPEG 95 KB (was PNG 302 KB); stat values `nowrap` + smaller on ≤400px; nav order now matches section order; root `style.css` moved to `assets/legacy/`; `design/spec.md` FILL note resolved; CV now embeds static fonts (CID TrueType, not Type 3); home `<title>` shortened so `long-title` passes without argument; doctype uppercase; inline style replaced by a class | see below |

## Evidence

### HTML validation
```
$ html-validate index.html projects/medisync.html 404.html cv/cv.html
html-validate exit 0
```

### Lighthouse (Perf / A11y / BP / SEO): JSON in `qa/lighthouse/recheck-*.json`
```
home mobile      99 | 100 | 100 | 100 | CLS 0 | LCP 2.1 s
home desktop    100 | 100 | 100 | 100 | CLS 0 | LCP 0.5 s
medisync mobile 100 | 100 | 100 | 100 | CLS 0 | LCP 1.7 s
medisync desktop 100 | 100 | 100 | 100 | CLS 0 | LCP 0.4 s
```

### axe-core 4.10.2, all content revealed
```
/ light 0 · / dark 0 · /projects/medisync.html light 0 · dark 0 · /404.html light 0 · dark 0 · /cv/cv.html light 0 · dark 0   (serious/critical)
```

### Overflow, console, nav
```
scrollWidth 360/768/1440 = viewport; 0 console errors on home 390/1440 light+dark
nav order:     Work | Experience | Skills | About | Contact | Download CV
section order: work | experience | skills | about | contact
```

### CV (changed: word cuts, static fonts)
```
$ pdfinfo Chamod_Tharusha_Alwis.pdf → Pages: 1, Page size: 594.96 x 841.92 pts (A4)
$ pdffonts → Fraunces-SemiBold, Inter-SemiBold, Inter-Regular: CID TrueType, embedded
content height 256.6 mm of 267 mm available → 10.4 mm free at the bottom
cvcmp (QA script, summary → cvSummary): PDF 73/73 strings present, ATS 73/73, 0 invisible chars
PDF links: 10 unique /URI annotations (unchanged set)
body 10.5pt, @page margin 15mm
```
One extraction problem was found and fixed: the PDF broke "OTP-gated" across a line and `pdftotext` dropped the hyphen ("OTPgated"). The bullet now says "OTP checks on record access" (no hyphen to break).

### FILL markers still open
```
index.html:90               dashboard screenshot (MediSync)
index.html:121              new Ceylon Traveler screenshot without the Gemini AI section
projects/medisync.html:64   dashboard screenshot
projects/medisync.html:97   district map screenshot, doctor portal screenshot
data/profile.json           the same 4 image sources
```

### Deletions vs main
`git diff --name-status --diff-filter=D origin/main...HEAD` lists nothing. Renames: 4 images, the old CV and `style.css` into `assets/legacy/`. `assets/img/og-image.png` was created earlier on this branch and is replaced by `og-image.jpg`; it never existed on `main`.

### NOT VERIFIED (unchanged)
External links (GitHub, LinkedIn, the 3 live sites): the sandbox network blocks them. GitHub Pages gzip and caching were not measured.
