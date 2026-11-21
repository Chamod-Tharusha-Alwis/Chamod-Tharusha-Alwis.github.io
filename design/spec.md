# Phase 3 — Design spec (A3 UI/UX Designer)

Two directions, each as a working static mock you can open in a browser:

- `design/mock-a.html` — **A · Engineer's Notebook** (light first, dark toggle)
- `design/mock-b.html` — **B · Product Dark** (dark only)

Screenshots (390 px phone and 1440 px desktop, fold + full page) are in `design/screenshots/`:
`mock-a-light-*`, `mock-a-dark-*`, `mock-b-dark-*`.

Both mocks use the approved copy from `data/profile.json` word for word. MediSync screenshots are **labelled placeholders** until you send them. Mock-only images (WebP, cropped/compressed) are in `design/assets/`; the hero photo went from `profile2.jpg` 1.59 MB → `profile-portrait.webp` 17 KB.

## Pick one (or mix)

| | A · Engineer's Notebook | B · Product Dark |
|---|---|---|
| Feel | Calm, editorial, senior | Modern, product/startup |
| Default theme | Light (follows system; toggle saved to `localStorage`) | Dark only |
| Fonts (2) | Fraunces (display serif) + Inter (body) | Space Grotesk (display) + Inter (body) |
| Accent | Deep teal `#0E6B66` light / `#5FC9BF` dark | Mint→blue gradient `#6EE7C8 → #7AA7FF` (buttons, 2 words of the headline, logo only) |
| Layout | Single column with a 32 px notebook grid background, white cards | Bento grid of glass tiles, soft glow on hover |
| Hero | Headline + portrait card | Headline tile + photo tile + "Now / Studying / Stack" tile |
| Prints / CV match | Very close: serif headings carry over to a print CV naturally | CV would use the same fonts but must be black-on-white, so it looks less like the site |
| Risk | Can look "quiet" next to flashier portfolios | Dark glass is common in dev portfolios; less distinctive |

**My recommendation: A.** It reads more like a senior engineer, works in light and dark, and the CV can match it closely. If you like B's hero, a good mix is **A's palette and fonts with B's bento hero** (photo tile + "Now" tile).

## Tokens

### Spacing (8 px scale)
`--s1 8 · --s2 16 · --s3 24 · --s4 32 · --s5 48 · --s6 64 · --s7 96`. Page gutter 16 px on phones, 48 px from 768 px. Max content width 1120 px (A) / 1160 px (B).

### Type scale (fluid, `clamp`)
| Role | A | B |
|---|---|---|
| H1 hero | 40 → 72 px, Fraunces 600 | 36 → 68 px, Space Grotesk 700 |
| H2 section | 28 → 40 px | 28 → 44 px |
| H3 card | 22 px | 20 px |
| Body | Inter 16 px / 1.65 | Inter 16 px / 1.65 |
| Lead | 18 px | 18 px |
| Small / meta | 13–14 px | 12–14 px |

### Radius, shadow, motion
- Radius: A 6 / 10 / 16 px · B 10 / 14 / 20 px, pills 999 px.
- Shadow: A soft two-layer shadow, bigger on hover lift · B no shadow; a 1 px accent ring + glow on hover.
- Motion: fade + 16 px slide-in via `IntersectionObserver` (0.6 s), 2–3 px hover lift, nav shrinks on scroll. **All of it is off under `prefers-reduced-motion`**, and content is visible with JS disabled (the hide-until-revealed state only applies after JS adds a `.js` class).

### Colour & contrast (WCAG AA ≥ 4.5:1)
| Pair | Colours | Ratio |
|---|---|---|
| A light body text | `#16181D` on `#FAF8F3` | 16.73:1 |
| A light secondary text | `#4A4F5A` on `#FAF8F3` | 7.74:1 |
| A light accent text | `#0E6B66` on `#FAF8F3` | 5.97:1 |
| A light primary button | `#FFFFFF` on `#0E6B66` | 6.34:1 |
| A dark body text | `#ECEAE4` on `#121417` | 15.34:1 |
| A dark secondary text | `#A9AEB8` on `#121417` | 8.29:1 |
| A dark accent text | `#5FC9BF` on `#121417` | 9.31:1 |
| A dark primary button | `#0B1716` on `#5FC9BF` | 9.22:1 |
| B body text | `#EEF1F6` on `#0B0D12` | 17.17:1 |
| B secondary text | `#A3ABBA` on `#0B0D12` | 8.41:1 |
| B accent / accent-2 text | `#6EE7C8` / `#7AA7FF` on `#0B0D12` | 12.89 / 8.14:1 |
| B button (worst end of gradient) | `#06110E` on `#7AA7FF` | 8.04:1 |

## Components

| Component | Notes |
|---|---|
| Skip link | First tab stop, visible on focus |
| Sticky nav | Work · About · Skills · Experience · Contact · **Download CV** button. Shrinks after 8 px scroll |
| Mobile menu (< 960 px) | Full-screen dialog, `aria-modal`, focus moves to Close, Tab is trapped, **Esc closes and returns focus** to the menu button |
| Theme toggle (A only) | Defaults to system; choice saved to `localStorage` in try/catch; label says what it will switch to |
| Status pill | Green dot + "Open to Junior SE, Full-Stack and Data roles" |
| Button | Primary / ghost / small; min 44 px touch target (36 px for small in-card buttons) |
| Chip | Skill/stack tags; plain text, no percentage bars |
| Featured project card | Screenshot, meta line, title, summary, 3 stats (`<dl>`), stack chips, Case study / Live / Code |
| Project card | Image (16:9, lazy, width/height set), summary, chips, Live / Code |
| Filter chips | All / Full-Stack / Data & ML, `aria-pressed`, hides cards with `hidden` |
| "Other work" strip | Heart-disease coursework, no link |
| Timeline | Shield Technologies first, then 3 education entries |
| Skills groups | 6 groups, 1 / 2 / 3 columns at 360 / 768 / 1100 px |
| Contact block | Email link + **Copy email** button with `aria-live` confirmation, LinkedIn, GitHub, location. No phone, no form |
| Footer | © year, "Last updated" (from `meta.lastUpdated`), Back to top |
| External links | `target="_blank" rel="noopener"` + hidden "(opens in new tab)" text |

## Page wireframes

### Home — desktop (≥ 960 px)
```
┌──────────────────────────────────────────────────────────────┐
│ Chamod.        Work About Skills Experience Contact [CV] (◐) │  sticky
├──────────────────────────────────────────────────────────────┤
│ (● Open to roles) Kandy                       ┌──────────┐   │
│ Chamod Tharusha Alwis                         │  photo   │   │
│ FULL-STACK DEVELOPER BUILDING                 │  4:5     │   │
│ secure, data-driven WEB PLATFORMS             │ [Now: …] │   │
│ lead line                                     └──────────┘   │
│ [View my work] [Download CV] (gh)(in)                        │
├──────────────────────────────────────────────────────────────┤
│ PROJECTS                                                     │
│ ┌────────────────────────┬─────────────────────────────────┐ │
│ │  MediSync screenshot   │ Featured · Solo capstone · Live │ │
│ │                        │ MediSync — summary              │ │
│ │                        │ 3 | 191k+ | 465→145 KB          │ │
│ │                        │ chips · [Case study][Live][Code]│ │
│ └────────────────────────┴─────────────────────────────────┘ │
│ (All)(Full-Stack)(Data & ML)                                 │
│ ┌──────────────┐ ┌──────────────┐                            │
│ │ Ayu Arana    │ │ Ceylon       │                            │
│ └──────────────┘ └──────────────┘                            │
│ ┄ Other work: Heart-disease prediction ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
├──────────────────────────────────────────────────────────────┤
│ EXPERIENCE timeline · SKILLS 3×2 groups · ABOUT 2 cols       │
│ CONTACT card (email + copy, LinkedIn, GitHub)                │
│ footer: © · last updated · back to top                       │
└──────────────────────────────────────────────────────────────┘
```

### Home — phone (360–390 px)
Single column: nav (logo · theme · ☰) → status → headline → lead → buttons (wrap) → photo (220 px) → MediSync (image on top, stats in 3 columns) → filter chips → cards stacked → timeline → skills (1 column) → about → contact → footer. Verified: no horizontal scroll at 390 px in either mock.

### Case study page — `/projects/medisync.html` (to build in Phase 4)
```
nav
← Back to work
MediSync — AI-driven national healthcare platform for Sri Lanka
meta: Solo BSc capstone · Live · [Live site] [Code]
hero screenshot (dashboard)
Overview | Problem | My role | Architecture (inline SVG: React ⇄ Express API ⇄ Flask ML; MongoDB Atlas, Redis, Vault, Cloudinary)
Key features | Tech decisions | Challenges & what I learned [[FILL — needs your input]] | Screenshots (map, doctor portal) | Links
footer
```
"Challenges & what I learned" and "Tech decisions" need a few sentences from you. I won't invent them; I'll ask in Phase 4.

## Evidence for this phase

- Overflow check (Playwright): `scrollWidth` equals the viewport at 390 and 1440 px for A light, A dark and B: **no horizontal scroll**. 0 console errors.
- Mobile menu (Playwright): opening moves focus to `menu-close`; Esc returns focus to `menu-open`, in both mocks.
- Lighthouse 12.6.1 on the mocks: **Accessibility 100** (A and B). Best Practices 96 (favicon 404 only). SEO 54 is expected: the mocks are deliberately `noindex` and have no meta description.
- axe-core 4.10.2 `color-contrast` with all content revealed: **0 violations** for A dark, A light and B.
