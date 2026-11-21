# 04 — Vercel Preview check (redesign/v2)

Preview URL: https://chamod-tharusha-alwis-github-juhi74zgs.vercel.app/index.html

**Tested by Chamod (owner) on 2026-11-21, reported in chat.** The build agent could not reach the Preview: Vercel API access for the team was not authorised in this session, and the sandbox network blocks `*.vercel.app`. These results are therefore owner-reported, not agent-verified.

| Check | Expected | Owner result |
|---|---|---|
| All pages (home, 3 case studies, 404) | 200 | Load |
| sitemap.xml, robots.txt, CV PDF | 200 | Load |
| /data/profile.json, /qa/, /content/copy.md, /cv/cv.html | 404 page | Show the 404 page |
| External links (GitHub, LinkedIn, live sites) | Work | Work |

Not covered by the owner report: `/assets/legacy/` and `/cv/Chamod_Tharusha_Alwis_ATS.txt` (both excluded by the same allowlist in `scripts/stage.mjs`, which deploys 23 files; see `node scripts/stage.mjs`).

Production (https://www.chamodtharusha.com.lk/) still to be checked after merge, especially that /data/profile.json returns 404.
