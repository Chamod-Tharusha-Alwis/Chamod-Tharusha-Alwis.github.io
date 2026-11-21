# 02 — Independent QA & verification report (redesign/v2)

QA agent: A6 (independent; did not build the site). Date: 2026-11-21. Commit under test: `7597ee5` (branch `redesign/v2`).
Environment: local `python3 -m http.server 8095` from the repo root (no gzip, no cache headers), Chromium 1243 (headless) via Playwright, Lighthouse 12.6.1, axe-core 4.10.2, html-validate 9.7.1, poppler `pdfinfo`/`pdftotext`.
Only files under `qa/` were written. Nothing was committed.

## Summary

| # | Check | Result | Key evidence |
|---|-------|--------|--------------|
| 1 | Lighthouse (2 pages × mobile/desktop) | **PASS** | Home mobile 98/100/100/100, home desktop 100/100/100/100, MediSync mobile 100/100/100/100, MediSync desktop 100/100/100/100 (Perf/A11y/BP/SEO). Only audits below 0.9 are text compression and cache TTL, which the local Python server causes. |
| 2 | axe-core, 4 pages × light/dark | **PASS** (0 serious/critical) | 0 violations on all 8 runs. axe marked `color-contrast` "incomplete" because of the body grid gradient, so I computed contrast by hand: lowest ratio is 5.48:1 (light) and 6.83:1 (dark), with 0 failures. |
| 3 | HTML validation (html-validate recommended config) | **FAIL** (17 errors; 1 is a real problem) | Real: `unique-landmark` on the case-study TOC `<nav>` (has no name). The rest are stylistic or debatable: lowercase doctype ×4, `aria-label` on `<ul>` ×9, inline style ×1, raw `&` ×1, and `long-title` ×1 (false positive: the rule counts `&amp;` as 5 characters; the decoded title is 67 characters). |
| 4 | Link check | **PASS** (internal) / **NOT VERIFIED** (external) | 48 internal URLs and fragments return 200 with 0 failures, including fonts, PDF, favicon, OG image and sitemap URLs. The 10 external URLs are blocked by the sandbox (github.com 403 from the proxy; linkedin.com and *.chamodtharusha.com.lk give 000). |
| 5 | Screenshots, overflow, console | **PASS** with visual defects | 18 full-page screenshots. `scrollWidth == viewport` on all 18. 0 console errors and 0 failed requests. Defects: the project card images are cropped at the sides, and the Ceylon Traveler image shows "Gemini-powered AI Assistant" text (see #8). |
| 6 | Keyboard, theme, no-JS, reduced motion | **PASS** (1 minor) | Tab 1 is the skip link. Enter goes to `#main`, and the next Tab lands on "View my work". Focus shows a 3px solid outline on every stop. The mobile menu focus trap and Esc both work. The theme toggle works by keyboard and persists across reloads. With JS off all content is visible. Reduced motion makes reveals visible with a 0s transition. Minor: without JS the mobile menu button does nothing. |
| 7 | CV PDF and ATS text vs profile.json | **PASS** with 1 owner question | 1 page, A4 (594.96 × 841.92 pt). All 75 profile strings are present. No zero-width or nbsp characters. All 10 `/URI` link annotations match profile.json. `body` is 10.5pt and `@page` margin is 15mm. Question: the phone number is printed although `phonePublic: false`. |
| 8 | Site facts vs profile.json | **PASS** with 1 issue | No "Gemini", "real-time", "scalable", "symptom" or invented numbers in the page text. Every number on index and medisync appears in profile.json. The "My role" sentence is supported. Issue: the **Ceylon Traveler screenshot image** advertises "AI-Powered Trip Planning … Gemini-powered AI Assistant", which contradicts `meta.decisions.geminiFeature: "left out"`. |
| 9 | Size budget, images | **PASS** | JS per page is 3,509 B (main.js) + 162 B inline, about 3.6 KB against a 30 KB budget. Transfer is 228 KB (home) and 121 KB (MediSync). Content images are WebP. All 3 `<img>` have width, height and alt. The two below-the-fold images use `loading="lazy"`; the hero image uses `fetchpriority="high"`. |
| 10 | SEO basics | **PASS** (advisories) | Titles are unique. Every page has a description, canonical, OG and Twitter tags. The JSON-LD Person parses. Favicon is present. sitemap.xml is well-formed and robots.txt points to it. Advisory: the descriptions are 198 and 227 characters, so search results will cut them off. |
| 11 | `[[FILL` markers | **FAIL** (expected, needs owner input) | 3 in shipped HTML (HTML comments next to "Screenshot coming soon" placeholders): index.html:89, medisync.html:64 and medisync.html:97 (the line holds 2 markers). Also in profile.json (3), content/copy.md and design/spec.md. |
| 12 | git diff vs origin/main | **PASS** | `--diff-filter=D` lists no deletions. 4 R100 renames to `assets/legacy/`. Nothing references the root `style.css` (unused leftover). |

---

## 1. Lighthouse

```
cd scratchpad/lh && CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
npx lighthouse http://localhost:8095/ --output=json --output-path=qa/lighthouse/final-home-mobile.json --chrome-flags="--headless=new --no-sandbox"
npx lighthouse ... --preset=desktop --output-path=qa/lighthouse/final-home-desktop.json
(same for /projects/medisync.html → final-medisync-{mobile,desktop}.json)
```

```
== final-home-desktop.json     performance=100 accessibility=100 best-practices=100 seo=100
   FCP 0.3 s | LCP 0.5 s | TBT 0 ms | CLS 0 | SI 0.3 s | Total size 223 KiB
== final-home-mobile.json      performance=98 accessibility=100 best-practices=100 seo=100
   FCP 1.4 s | LCP 2.2 s | TBT 0 ms | CLS 0.07 | SI 1.4 s | Total size 223 KiB
   render-blocking-resources: score=0 Est savings of 400 ms
== final-medisync-desktop.json performance=100 accessibility=100 best-practices=100 seo=100
   FCP 0.3 s | LCP 0.4 s | TBT 0 ms | CLS 0 | SI 0.3 s | Total size 118 KiB
== final-medisync-mobile.json  performance=100 accessibility=100 best-practices=100 seo=100
   FCP 1.1 s | LCP 1.8 s | TBT 0 ms | CLS 0 | SI 1.1 s | Total size 118 KiB
   render-blocking-resources: score=0 Est savings of 150 ms ; unused-css-rules: Est savings of 11 KiB
All four: uses-text-compression score=0 (est. 25–29 KiB), uses-long-cache-ttl score=0.5
```

- **Text compression and cache TTL:** these fail because `python3 -m http.server` sends no gzip and no Cache-Control headers. GitHub Pages serves gzip with a 10-minute cache. They are not site defects.
- **Home mobile CLS 0.07** (under the 0.1 "good" threshold). Lighthouse puts the one shift on `section.hero p.lead`, with cause "Web font loaded: `/assets/fonts/fraunces-italic-400-latin.woff2`". The italic `<em>` in the h1 uses this font, which is not preloaded (only the Inter and Fraunces 600 fonts are). Optional fix: preload it, or set `size-adjust` on a fallback font.
- Target met on every page (Perf ≥ 90, A11y/BP/SEO ≥ 95).

## 2. axe-core

Script: `scratchpad/pw/axe_shots.js`. It runs at 1280×900 with `colorScheme` set to light or dark, adds class `in` to every `.reveal`, waits 800 ms, then injects `axe.min.js` with `addScriptTag({path})`.

```
/ [light] axe 4.10.2: violations=0 serious/critical=0  incomplete: color-contrast(serious,49)
/ [dark]  axe 4.10.2: violations=0 serious/critical=0  incomplete: color-contrast(serious,49)
/projects/medisync.html [light]: violations=0 serious/critical=0  incomplete: color-contrast(serious,73)
/projects/medisync.html [dark]:  violations=0 serious/critical=0  incomplete: color-contrast(serious,73)
/404.html [light]: violations=0 serious/critical=0  incomplete: color-contrast(serious,11)
/404.html [dark]:  violations=0 serious/critical=0  incomplete: color-contrast(serious,11)
/cv/cv.html [light]: violations=0 serious/critical=0  incomplete: none
/cv/cv.html [dark]:  violations=0 serious/critical=0  incomplete: none
```

The "incomplete" results come from `bgGradient`: the `body` grid `background-image` stops axe from working out the background. On the case study there are also 10 `bgOverlap` results and 1 each of `nonBmp` and `shortTextContent`. I did not count incomplete results as passes. Instead, `scratchpad/pw/contrast.js` computes the WCAG ratio for every visible text element against the composited solid background. It also checks the worst case: `--bg` with the `--grid` line blended in, and `--surface-2` for the striped placeholders.

```
/ [light] text elements=154 minRatio=5.48 (SPAN "." brand dot) failures=0
/ [dark]  text elements=154 minRatio=6.83 ("Screenshot coming soon") failures=0
/projects/medisync.html [light] 84 elements minRatio=5.48 failures=0 ; [dark] minRatio=6.83 failures=0
/404.html [light] 15 elements minRatio=5.48 failures=0 ; [dark] minRatio=7.71 failures=0
```

(My first run of this script reported false failures because it did not parse the `color(srgb …)` values that `color-mix()` produces. I fixed the parser and the numbers above come from the corrected run.) Lighthouse's own `color-contrast` audit also scored 1 on all four runs.

## 3. HTML validation

```
html-validate (9.7.1) index.html projects/medisync.html 404.html cv/cv.html
404.html          1:1   error  DOCTYPE should be uppercase                     doctype-style
index.html        1:1   error  DOCTYPE should be uppercase                     doctype-style
                  6:86  error  title text cannot be longer than 70 characters  long-title
                  95:29, 114:31, 125:31, 164:70 … 169:70 (9×)  "aria-label" cannot be used on this element  aria-label-misuse
                  183:53 error  Inline style is not allowed                    no-inline-style
cv/cv.html        1:1   error  DOCTYPE should be uppercase                     doctype-style
projects/medisync.html 1:1 error DOCTYPE should be uppercase                   doctype-style
                  67:51  error  Landmarks must have a non-empty and unique accessible name  unique-landmark
                  67:354 error  Raw "&" must be encoded as "&amp;"             no-raw-characters
✖ 17 problems (17 errors, 0 warnings)
```

How I classified them (none are hidden):

- **Real (fix):** `unique-landmark` at medisync.html:67. `<aside class="toc" aria-label="On this page"><nav>` gives the page a second `<nav>` landmark with no name, next to `nav[aria-label=Primary]`.
- **Worth fixing (consistency):** `no-raw-characters` at medisync.html:67, the TOC link text "Challenges & what I learned". A bare `& ` is valid HTML5, but the generator encodes `&amp;` everywhere else.
- **Debatable:** `aria-label-misuse` ×9, on `<ul class="chips" aria-label="Tech stack">` (3) and the six skill-group `<ul>`s. ARIA 1.2 lets authors name `role=list`, but screen readers announce list names inconsistently. axe does not flag these. Possible fix: drop the `aria-label`s, since the skill `<h3>` already labels each group, or use `aria-labelledby`.
- **Stylistic or false positives:**
  - `doctype-style` ×4: lowercase `<!doctype html>` is valid.
  - `no-inline-style` ×1: `#contact style="padding-top:0"`.
  - `long-title`: the rule counts raw `&amp;`; the decoded title is 67 characters (see #10).

## 4. Link check

Script: `scratchpad/pw/links.js`. It renders each page and collects every `[href]`, `[src]` and `srcset` candidate, the OG and Twitter image URLs, URLs inside JSON-LD, and CSS `url()` (including fonts referenced from site.css and cv.css). It adds the sitemap `<loc>`s and the robots `Sitemap:` line. Production `https://chamod-tharusha-alwis.github.io/` is mapped to localhost. Each URL is fetched, and each fragment is checked against the target page's ids.

```
### INTERNAL (48)  — all 200, every fragment resolves (#main, #top, #work, #about, #skills, #experience, #contact,
    medisync #overview … #links), PDF [application/pdf], 3 fonts [font/woff2], 7 images, favicon.ico, favicon.svg,
    apple-touch-icon, og-image.png, site.css, cv.css, main.js, cv.html, sitemap.xml, both sitemap URLs.
internal failures: 0
```

I also tested `404.html` served at an unknown deep path (`/no/such/page`, using a Playwright route fulfilled with 404.html, the way GitHub Pages serves it). The page was styled, both fonts loaded, there were 0 failed subresources, and the home link resolves to `/`. The root-relative paths work.

External links:

| URL | Result |
|---|---|
| https://github.com/Chamod-Tharusha-Alwis | NOT VERIFIED: proxy 403 |
| https://github.com/Chamod-Tharusha-Alwis/MediSync | NOT VERIFIED: proxy 403; GitHub MCP denied (repo not in session) |
| https://github.com/Chamod-Tharusha-Alwis/Ayu-Arana-Care | NOT VERIFIED: as above |
| https://github.com/Chamod-Tharusha-Alwis/Ceylon-Traveler | NOT VERIFIED: as above |
| https://www.linkedin.com/in/chamod-alwis | NOT VERIFIED: blocked (000) |
| https://medisync.chamodtharusha.com.lk/ | NOT VERIFIED: blocked (000) |
| https://ayu-arana-care.chamodtharusha.com.lk/ | NOT VERIFIED: blocked (000) |
| https://ceylon-traveler.chamodtharusha.com.lk/ | NOT VERIFIED: blocked (000) |
| https://schema.org (JSON-LD @context) | not a navigable link |
| mailto:chamodtharusha13@gmail.com | matches profile.json |

## 5. Screenshots, overflow, console

Saved in `qa/screenshots/final/`: `{home,medisync,404}-{360,768,1440}-{light,dark}.png`, all full page at deviceScaleFactor 1. The script scrolls the page first so the reveals fire. Extras: `kbd-skip-focus-1440.png`, `kbd-menu-open-390.png`, `nojs-home-1280.png`.

```
home 360 light: scrollWidth=360 vw=360 OK revealNotVisible=0 consoleErrors=0 badResponses=[]
... (all 18 combinations identical in outcome)
404 1440 dark: scrollWidth=1440 vw=1440 OK revealNotVisible=0 bg=rgb(18, 20, 23) consoleErrors=0 badResponses=[]
```

I reviewed home 1440 light, home 360 dark, MediSync 1440 dark and a 2× zoom of home 360 light. Visible defects:

1. **Project card images are cropped at the sides.** `.card img { aspect-ratio: 16/9; object-fit: cover; object-position: top }` (site.css:133) is applied to sources of about 2.2:1 (960×438) and 2.3:1 (960×414). At 1440 the Ceylon Traveler card shows "raveler" and "owered Trip Planning", with the logo and the left edge of the heading cut off. The Ayu Arana Care card loses its right-hand header button.
2. **The Ceylon Traveler screenshot content contradicts the content decision:** its hero reads "Stop guessing. Our Gemini-powered AI Assistant creates tailored itineraries…" (see #8).
3. Minor typography: the stat "465→145 KB" wraps "KB" onto a second line at 1440 and 360. At 360 the three stat columns are narrow, and the labels break to 1–2 words per line (for example "code-/splitting").
4. Expected placeholders: three "Screenshot coming soon" blocks (MediSync dashboard, map, doctor portal). They are pending the FILL items.

No overlap, clipping or theme-colour problems in either theme otherwise. Dark mode applies on every page.

## 6. Keyboard, theme, no-JS, reduced motion

Script: `scratchpad/pw/kbd.js`.

```
### KEYBOARD @1440
Tab 1: a.skip "Skip to content" outline=solid 3px rgb(14,107,102) ; box when focused top=16,left=16 (in viewport)
after Enter: location.hash=#main ; next Tab -> a.btn.btn-primary "View my work"   (sequential focus moved into main)
stops 1–16: skip, brand, Work, About, Skills, Experience, Contact, Download CV, #theme, View my work, Download CV,
            GitHub, LinkedIn, Read case study →, Live site, Code      — every stop outline=solid 3px, visible=true
### KEYBOARD @390
stops: skip, brand, #theme, #menu-open, View my work, Download CV, GitHub, LinkedIn, Read case study, Live site, Code,
       All, Full-Stack, Data & ML, Live site, Code
menu button reached after 4 Tabs; Enter -> open=true aria-expanded=true focus=#menu-close focusInsideMenu=true
Tab x9 inside menu: IN:Work | IN:About | IN:Skills | IN:Experience | IN:Contact | IN:Download CV | IN:menu-close | IN:Work | IN:About
Shift+Tab from close btn -> IN:Download CV   (wraps backwards)
after Esc: open=false aria-expanded=false focus=menu-open body overflow=(empty)
closed menu display=none ; clicking a menu link closes it and navigates (#skills)
theme (both widths): before {t:(none), bg rgb(250,248,243), label "Switch to dark theme"}
   Enter -> {t:dark, bg rgb(18,20,23), localStorage theme=dark, label "Switch to light theme"}; Space -> light; Space -> dark
   reload -> {t:dark, bg rgb(18,20,23)} ; navigate to medisync.html -> dark   (persists)
### NO-JS
/ {jsClass:false, reveal:8, hidden:0, textLen:3993}; medisync {hidden:0, textLen:4302}; 404 {hidden:0}
noJS @390: menu button visible=true, .nav-links visible=false, theme btn visible=true
### REDUCED MOTION (reducedMotion:'reduce', without scrolling)
all 8 .reveal: opacity=1 transform=none transition=0s (in=false) ; html scroll-behavior=auto
```

Filters, tested by clicking: "Data & ML" shows only "Other work", "Full-Stack" hides it, "All" restores both cards. `aria-pressed` updates correctly.

Minor issue: with JavaScript disabled at 390px, the hamburger and theme buttons are still visible but do nothing, and `.nav-links` is hidden. Content is fully readable, but there is no in-page navigation menu. Fix: hide `.menu-btn` and `#theme` unless `html.js` is set, or fall back to showing the links.

UX note (not a failure): the nav order is Work · About · Skills · Experience · Contact, while the sections on the page run Work → Experience → Skills → About → Contact.

## 7. CV PDF and ATS text

```
$ pdfinfo Chamod_Tharusha_Alwis.pdf
Title: Chamod Tharusha Alwis — CV   Creator: Chromium   Producer: Skia/PDF m157   Tagged: yes
Pages: 1   Page size: 594.96 x 841.92 pts (A4)   File size: 151463 bytes
$ pdffonts → Fraunces-SemiBold, Inter-Regular (×8 subsets), all "Type 3", embedded, ToUnicode=yes
```

Comparison script: `scratchpad/cvcmp.py`. It normalises whitespace and joins words hyphenated across line ends, then checks 75 strings from profile.json: name, email, phone, location, cvTitle, summary, role, org, 3 experience bullets, 8 project cvBullets, 47 skills, and the education degrees, orgs and awarding bodies.

```
pdftotext -layout:   checked 75 strings; missing 0          (invisible/nbsp chars: [] ; non-ascii: · – —)
pdftotext (raw):     1 "missing" — raw mode de-hyphenates the line-wrapped "OTP-\ngated" into "OTPgated";
                     -layout output shows "OTP-" / "gated record access … 191k+ pairs." so the text IS present.
cv/Chamod_Tharusha_Alwis_ATS.txt: checked 75; only differences are deliberate formatting:
   name in caps "CHAMOD THARUSHA ALWIS", cvTitle with "|" instead of "·". invisible chars: [] ; non-ascii: [] (pure ASCII)
```

- **Content in the CV but not in profile.json:** none, apart from derived formatting: the "Live · Code" link labels, display forms of the URLs, the stack lists (taken from `stack`), and the `cvRole`/`role` lines.
- Heart-disease prediction has no `cvBullets` and is correctly left out of both files.
- **Link annotations** (`/URI` in the raw PDF, 10 unique): the MediSync, Ayu Arana Care and Ceylon Traveler live and repo URLs, the github profile, linkedin, the site URL and `mailto:chamodtharusha13@gmail.com`. All 10 match profile.json exactly.
- **cv.css:** `@page { size: A4; margin: 15mm; }` (≥ 15mm: pass); `body { font: 400 10.5pt/1.22 … }` (≥ 10.5pt: pass). Some secondary text (`.cv-contact`, `.when`, `.sub`, `h2`) is 9.5pt. That is allowed by the check but worth knowing.
- **Owner question:** `basics.phonePublic` is `false`, yet `0772600303` appears in both cv.html and the PDF, and the PDF is publicly linked from every page. If `phonePublic:false` means "not on the public internet", the phone has to come off the public CV. If it only means "not on the website", this is fine.
- **Low risk:** Chromium embedded every font as Type 3. pdftotext extracts the text cleanly, but some older ATS parsers handle Type 3 fonts poorly. The plain-text ATS file mitigates this.

## 8. Facts check

```
grep -o -i for Gemini|real-time|realtime|scalable|symptom|AI-powered|chatbot|%|years|users|million|LLM|GPT|Docker|Kubernetes|AWS
  → 0 hits on index.html, projects/medisync.html, 404.html, cv/cv.html
"scale" hits = viewport "initial-scale" + medisync "can scale and deploy independently" (verbatim techDecisions) + figcaption
numbers in visible text not present in profile.json: index.html [] ; medisync.html []
```

I also listed every visible text segment that is not verbatim in profile.json (`scratchpad` inline script). Apart from UI labels, dates and headings, these remain:

- **Supported.** "Solo project: I designed and built all three services. That covered the React front end, the Node.js/Express API, the Flask ML engine, the security layer and the CI/CD pipeline." Profile `role` says solo and all three services. The stack lists React, Express and Flask. The highlights include AES-256, Vault, OTP and audit logs ("security layer"), and "CI/CD with GitHub Actions". The cvBullet says "set up CI/CD with GitHub Actions and Vercel". The sentence restates existing facts and adds no new claim.
- **Slight stretch (low).** Architecture figcaption: "Three separately deployed services. The Flask ML engine can scale independently of the web API." The profile says the split was made "so the Python forecasting work can scale and deploy independently". "Can deploy independently" is not quite "are separately deployed". Suggest "Three services; the Flask ML engine can scale and deploy independently of the web API." The SVG `<desc>` also says "The API uses MongoDB Atlas, Redis, HashiCorp Vault, Cloudinary". The profile lists these as `architecture.stores` without saying which service uses them, so the wording is plausible but inferred.
- **Not supported (medium).** The `assets/img/ceylon-traveler-960.webp` and `-480.webp` screenshots show "AI-Powered Trip Planning — Our Gemini-powered AI Assistant creates tailored itineraries…" and a "Ceylon Traveler AI" chat panel. profile.json sets `decisions.geminiFeature: "left out (disabled for now)"`, and the Ceylon Traveler description makes no AI claim. The image therefore makes a claim the copy deliberately avoids. Recapture or crop the screenshot without the AI hero, or get the owner's sign-off.
- Note: the cards and case study say "Live" (`status: "live"`), but profile `verification.live` for MediSync is "NOT VERIFIED". I could not verify it either, because of the sandbox.

## 9. Size budget

```
home (Lighthouse network-requests, transfer): 10 requests, 228,234 B
   Document 19,668 | Fonts 126,174 (3 woff2) | CSS 17,577 | Script 3,703 | Images 60,610 | favicon.svg 502
medisync: 6 requests, 120,512 B  (no images; fonts 83,756)
JS: assets/js/main.js 3,509 B + inline theme script 162 B on each page  → ~3.6 KB  (< 30 KB ✔)
images: profile-480/720, ayu-arana-care-480/960, ceylon-traveler-480/960 = WebP; og-image.png 1200×630 PNG 308,753 B;
        apple-touch-icon 180×180 PNG; favicon.svg
<img>: 3 on home — all have width+height+alt; hero eager + fetchpriority=high + preload; both card images loading="lazy" decoding="async"
```

Advisory: og-image.png is 302 KB. A JPEG or palette PNG would probably come in under 100 KB, but it does not affect page weight.

## 10. SEO

```
index.html  title(67) "Chamod Tharusha Alwis — Full-Stack Developer & Data Science Student"  desc 198 chars  canonical / 
medisync    title(43) "MediSync case study — Chamod Tharusha Alwis"                          desc 227 chars  canonical /projects/medisync.html
404.html    title(38) "Page not found — Chamod Tharusha Alwis"   robots=noindex                desc 25 chars
cv/cv.html  title(26) "Chamod Tharusha Alwis — CV"                                              canonical /cv/cv.html (no OG – fine)
OG on 3 pages: og:type,site_name,title,description,url,image(+width,height,alt) ; Twitter: card=summary_large_image,title,description,image
JSON-LD (home): parsed OK, @type Person; name,url,image,jobTitle,email,worksFor,address,alumniOf,sameAs,knowsAbout
xmllint --noout sitemap.xml → OK (2 URLs) ; robots.txt: Allow /, Disallow /design/ /qa/, Sitemap: …/sitemap.xml
```

Advisories, none blocking:

- The meta descriptions are 198 and 227 characters, so search results will truncate them at about 155–160.
- `alumniOf` lists ESOFT, which is ongoing study. Schema.org tolerates this.
- 404.html has a canonical plus `noindex`. That is harmless, but a canonical is unusual on a 404 page.
- `cv/cv.html` is not in the sitemap, which is fine.

## 11. FILL markers

```
$ grep -rn "\[\[FILL" --exclude-dir=.git .
./index.html:89               <!-- [[FILL: dashboard screenshot]] -->  (renders "Screenshot coming soon")
./projects/medisync.html:64   <!-- [[FILL: dashboard screenshot]] -->
./projects/medisync.html:97   <!-- [[FILL: district map screenshot]] --> and <!-- [[FILL: doctor portal screenshot]] --> (same line)
./data/profile.json:232,236,240  images[].src for the 3 MediSync screenshots
./content/copy.md:7, :173     (notes / open-items list)
./design/spec.md:129          ("Challenges & what I learned [[FILL — needs your input]]" — now filled in the site; spec is stale)
```

The markers in the shipped HTML are inside HTML comments, so visitors never see them. Visitors do see the three placeholder blocks. profile.json's own rule ("Strings containing FILL markers … must not ship") means these are blocking until Chamod supplies the screenshots, or the builder removes the placeholder figures.

## 12. git diff vs origin/main

```
$ git diff --name-status --diff-filter=D origin/main...HEAD
(empty — no deletions)
$ git diff --name-status -M origin/main...HEAD | grep ^R
R100 ceylon-traveler1.png → assets/legacy/ceylon-traveler1.png
R100 new.png → assets/legacy/new.png
R100 profile.jpg → assets/legacy/profile.jpg
R100 profile2.jpg → assets/legacy/profile2.jpg
Chamod_Tharusha_Alwis.pdf modified (80,365 → 151,463 B); old copy added at assets/legacy/Chamod_Tharusha_Alwis_old.pdf
60 files changed, 38028 insertions(+), 1180 deletions(-)
$ grep -rn "style\.css" (excluding site.css/cv.css, .git, qa) → no matches
```

Root `style.css` is unreferenced dead weight. It is safe to delete, or to move to `assets/legacy/`.

Note: this QA run overwrote `qa/lighthouse/final-*.json` and three `qa/screenshots/final/home-*.png` files that were already committed, and added the rest of the screenshot set. Those are the only working-tree changes.

---

## Failures and fixes, in priority order

1. **[Medium · content/facts] The Ceylon Traveler card image advertises a Gemini AI assistant.**
   - Files: `assets/img/ceylon-traveler-960.webp`, `assets/img/ceylon-traveler-480.webp`. Used by `index.html` `article.card[data-cat=full-stack]:nth-of-type(2) img`.
   - Reproduce: open `/` at 1440 and look at the Ceylon Traveler card, or open the WebP directly. The hero reads "AI-Powered Trip Planning … Our Gemini-powered AI Assistant…".
   - Conflict: `data/profile.json` `meta.decisions.geminiFeature = "left out"`.
   - Fix: recapture without the AI hero, or crop it out, or get the owner's explicit OK.
2. **[Medium · visual] Project card screenshots are cropped at the sides.**
   - Selector: `.card img` (site.css:133, `aspect-ratio: 16/9; object-fit: cover`). The sources are 960×438 and 960×414.
   - Reproduce: open `/` at 1440 or 360 and look at the cards. Ceylon Traveler shows "raveler" and "owered Trip Planning"; the Ayu Arana header is cut on the right.
   - Fix: use `aspect-ratio: 960/438` (or `auto`), or `object-fit: contain`, or crop the sources to 16:9.
3. **[Medium · blocker per profile.json rule] FILL items still open.**
   - Three MediSync screenshot placeholders: `index.html:89`, `projects/medisync.html:64` and `:97`. Source: `data/profile.json` `projects[0].images[].src`.
   - Needs: the screenshots from Chamod, or the placeholder figures removed before shipping.
4. **[Medium · owner decision] Phone number on the public CV although `basics.phonePublic: false`.**
   - Files: `cv/cv.html` (`.cv-contact`), `Chamod_Tharusha_Alwis.pdf`, `cv/Chamod_Tharusha_Alwis_ATS.txt`.
   - Fix: confirm the intent with the owner. If it should be private, drop the phone and rebuild the PDF and TXT.
5. **[Low · a11y/validation] The case-study TOC has an unnamed second `<nav>` landmark.**
   - Location: `projects/medisync.html:67`, `aside.toc > nav`.
   - Reproduce: `html-validate projects/medisync.html` reports `unique-landmark`.
   - Fix: put `aria-label="On this page"` on the `<nav>` (and remove it from the `<aside>`), or drop the `<nav>` wrapper.
6. **[Low · validation] Raw `&` in TOC text.**
   - Location: `projects/medisync.html:67`, `<a href="#challenges">Challenges & what I learned</a>`. Encode it as `&amp;` in `scripts/build.mjs`.
7. **[Low · validation, debatable] `aria-label` on `<ul>`.**
   - Locations: `ul.chips[aria-label="Tech stack"]` ×3 and the six skill-group `ul.chips` (index.html lines 95, 114, 125, 164–169).
   - Fix: remove the labels (the skill groups already have an `<h3>`), or use `aria-labelledby` pointing at the `<h3>`, or document the rule as off.
8. **[Low · progressive enhancement] With JS disabled the mobile menu button and theme button are dead controls**, and the primary nav links are hidden below the desktop breakpoint.
   - Reproduce: Playwright `javaScriptEnabled:false` at 390px. `#menu-open` is visible and `.nav-links` is hidden.
   - Fix: CSS `html:not(.js) .menu-btn, html:not(.js) #theme { display:none }`, and show `.nav-links`, wrapped, when `html:not(.js)`.
9. **[Low · copy precision] The architecture figcaption says "Three separately deployed services".** The profile only says the services "can … deploy independently".
   - Location: `projects/medisync.html` `figure.arch figcaption`. Suggest rewording to match the profile.
10. **[Low · perf polish] Home mobile CLS 0.07 from the late-loading `fraunces-italic-400-latin.woff2`** (the hero `<em>`).
    - Fix: add `<link rel="preload" … fraunces-italic-400-latin.woff2>`, or a metric-matched fallback font.
11. **[Advisory]**
    - Meta descriptions are over 160 characters: index 198, medisync 227.
    - og-image.png is 302 KB.
    - The "465→145 KB" stat wraps "KB" onto its own line, and the 360px stat labels are cramped.
    - The nav link order does not match the section order.
    - Root `style.css` is unused.
    - `design/spec.md:129` still carries a FILL note.
    - The CV PDF uses Type 3 fonts.
    - Validator noise: doctype case ×4, inline style on `#contact`, and the `long-title` false positive.

**Not verified:** all 8 external http(s) links (GitHub, LinkedIn and the three `*.chamodtharusha.com.lk` live sites). The sandbox blocks them: github.com returns 403 from the proxy, the others return no connection, and GitHub MCP access to the project repos was denied. Production gzip and cache behaviour on GitHub Pages was not measured.
