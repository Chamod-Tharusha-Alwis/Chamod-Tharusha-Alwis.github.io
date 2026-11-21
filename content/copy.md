# Phase 2 — Copy for review (A2 Content Strategist)

Everything here comes from `data/profile.json`. That file is what the site and the CV will be built from.
Edit freely — mark changes inline or reply with numbered notes.

**Defaults I used because the answer was still a placeholder:**
- MediSync live URL / repo → left as `[[FILL]]`.
- Ceylon Traveler "Gemini AI itinerary engine" → **left out** until you confirm it's real.
- Heart-disease ML → listed **without a link**.
- Domain → stays **chamod-tharusha-alwis.github.io**.
- Phone → CV only (`phonePublic: false`).

---

## Hero

> **Chamod Tharusha Alwis**
> Full-stack developer building secure, data-driven web platforms
>
> Software engineering intern at Shield Technologies and BSc Data Science student. I build MERN apps and the Python services behind them.
>
> Kandy, Sri Lanka · ● Open to Junior SE, Full-Stack and Data roles
>
> [View my work] [Download CV] · GitHub · LinkedIn

## About

I'm a software developer from Kandy, Sri Lanka. Right now I'm a software engineering intern at Shield Technologies, where I build features for MERN applications and help turn prototypes into production code.

I'm also studying for a BSc (Hons) in Data Science with London Metropolitan University. My capstone, MediSync, is where the two meet: a healthcare platform with a Node.js API, a React front end and a Python service that forecasts disease outbreaks.

I like work that has to be correct and secure, not just look good: access control, encrypted records, clean APIs and data you can trust.

---

## Featured project — MediSync

**AI-driven national healthcare platform for Sri Lanka** · BSc (Hons) Data Science capstone (ongoing) · Live

| Stat | |
|---|---|
| **3** | services: React, Node.js, Flask ML |
| **191k+** | drug-interaction pairs checked |
| **465 → 145 KB** | initial JS bundle after code-splitting |

**Problem.** Patients, doctors, pharmacies, hospitals and labs need to share medical records and prescriptions safely, and health officials need early warning when a disease starts to spread in a district.

**What I built.** A three-service platform: a React 19 front end, a Node.js / Express 5 API and a Python Flask ML engine. Each role has its own portal, patient records sit behind encryption and OTP-based consent, and a public map shows outbreak risk for every district in Sri Lanka.

**Key features**
- Outbreak forecasting with Prophet and ARIMA, plus z-score anomaly detection for unusual case spikes.
- Public Sri Lanka district choropleth map built with Leaflet and GeoJSON.
- AES-256 field-level encryption with blind indexes, keys in HashiCorp Vault, Redis, OTP-gated access to patient records and audit logs.
- Separate portals for patients, doctors, pharmacies, hospitals/labs and admins.
- Drug-interaction and allergy checks against 3,000 drugs, 191k+ interaction pairs and 71k+ ICD codes.
- CI/CD with GitHub Actions, deployed on Vercel.

**Tech.** React 19 · Node.js · Express 5 · Python · Flask · Prophet · ARIMA · scikit-learn · MongoDB Atlas · Redis · HashiCorp Vault · Cloudinary · Socket.IO · Leaflet · GitHub Actions · Vercel

**Impact.** Cut the initial JavaScript bundle from 465 KB to 145 KB with code-splitting.

**My role.** Solo project: I designed and built all three services.
**Links.** [Live](https://medisync.chamodtharusha.com.lk/) (NOT VERIFIED — unreachable from build sandbox) · [Code](https://github.com/Chamod-Tharusha-Alwis/MediSync) (verified public) · Case study: /projects/medisync.html


---

## Ayu Arana Care

**Management system for an elders' care home**

**Problem.** A care home needs one place to manage residents, their medical records, memberships, payments and checkup requests, with staff only seeing what their role allows.

**What I built.** A MERN web app with role-based access control, resident medical records, membership tiers, payments and checkup requests, and a responsive React and Tailwind front end.

- Role-based access control with bcrypt-hashed passwords.
- Resident medical records and checkup requests.
- Membership tiers and payment records.

**Tech.** MongoDB · Express · React · Node.js · Tailwind CSS · bcrypt
**Links.** [Live](https://ayu-arana-care.chamodtharusha.com.lk/) · [Code](https://github.com/Chamod-Tharusha-Alwis/Ayu-Arana-Care)

## Ceylon Traveler

**Travel and accommodation booking platform for Sri Lanka**

**Problem.** Travellers in Sri Lanka usually book hotels, taxis and guides in different places. This brings them into one booking flow.

**What I built.** A MERN platform for booking hotels, taxis and guides, with availability checks and JWT authentication.

- Hotel, taxi and guide booking in one place.
- Availability checks before a booking is confirmed.
- JWT-based authentication.

**Tech.** MongoDB · Express · React · Node.js · JWT
**Links.** [Live](https://ceylon-traveler.chamodtharusha.com.lk/) · [Code](https://github.com/Chamod-Tharusha-Alwis/Ceylon-Traveler)

> ⚠ The Gemini AI itinerary feature from the current site is not included. Tell me "keep" and I'll add a line + "Gemini API" chip.

## Other work — Heart-disease prediction (coursework)

As a group we trained and compared Random Forest, SVM and Logistic Regression models on the Cleveland UCI heart-disease dataset. My individual part was an artificial neural network for the same task. *Python · scikit-learn · pandas · `[[FILL: ANN library]]`* · No repo link.

---

## Experience & education (site timeline + CV)

**Software Engineering Intern & Full-Stack Developer** — Shield Technologies (Private) Limited, Kandy · Jan 2026 – Present
- Build full-stack features with MongoDB, Express, React and Node.js in an Agile R&D team.
- Design RESTful APIs with senior engineers and optimise database queries.
- Turn research prototypes into maintainable, production-ready code.

**BSc (Hons) Data Science (Top-Up)** — ESOFT Metro Campus, Kandy — London Metropolitan University (UK) · 2026 – Present
**Diploma in Full Stack Development** — Nextgen Campus · 2025 – 2026
**Higher Diploma in Computing & Software Engineering** — ICBT Kandy Campus — Cardiff Metropolitan University (UK) · 2023 – 2025

## Skills

- **Languages:** JavaScript (ES6+), TypeScript, Python, Java, C#, C++, PHP, Dart
- **Frontend:** React 19, Vite, Tailwind CSS, HTML5, CSS3, Socket.IO client, Leaflet
- **Backend:** Node.js, Express 5, Flask, FastAPI, REST APIs, JWT & RBAC, Nodemailer
- **Data & ML:** pandas, scikit-learn, Prophet, ARIMA, z-score anomaly detection, Random Forest, SVM, Logistic Regression, ANN
- **Databases & Cloud:** MongoDB / Atlas, MySQL, Oracle, SQL Server, Firebase, Redis, HashiCorp Vault, Cloudinary, GitHub Actions CI/CD, Vercel
- **Practices:** OOP, SDLC, Agile, Git, QA test-case design, AES-256 field-level encryption, secret rotation

## Contact

> Open to junior software engineer, full-stack and data roles. The quickest way to reach me is email.
>
> chamodtharusha13@gmail.com [Copy] · LinkedIn · GitHub · Kandy, Sri Lanka

---

## CV text

**Chamod Tharusha Alwis**
Software Engineer · Full-Stack Developer · Data Science
chamodtharusha13@gmail.com · 0772600303 · Kandy, Sri Lanka · linkedin.com/in/chamod-alwis · github.com/Chamod-Tharusha-Alwis · chamod-tharusha-alwis.github.io

**Summary**
Software engineering intern at Shield Technologies, building MERN features in an Agile R&D team, and BSc (Hons) Data Science student. I built MediSync, a three-service healthcare platform with Prophet and ARIMA outbreak forecasting and AES-256 field-level encryption. Looking for a junior software engineer, full-stack or data science role.

**Experience** — as above.

**Projects**

*MediSync — AI-driven national healthcare platform (solo BSc capstone)*
- Designed and built, solo, a three-service healthcare platform (React 19, Node.js/Express 5, Python Flask, MongoDB Atlas) with role-based portals for patients, doctors, pharmacies, hospitals/labs and admins.
- Built an outbreak-forecasting engine in Flask using Prophet, ARIMA and z-score anomaly detection, feeding a public district-level risk map of Sri Lanka (Leaflet, GeoJSON).
- Secured patient data with AES-256 field-level encryption and blind indexes, HashiCorp Vault, OTP-gated record access and audit logs; added drug-interaction checks covering 191k+ pairs.
- Cut the initial JS bundle from 465 KB to 145 KB with code-splitting; set up CI/CD with GitHub Actions and Vercel.

*Ayu Arana Care — Elders' care home management system*
- Built a secure REST API in Node.js and Express with role-based access control and bcrypt, managing resident medical records, membership tiers and payments.
- Built a responsive React and Tailwind CSS front end for medical tracking and resident checkup requests.

*Ceylon Traveler — Travel & accommodation booking platform*
- Built a REST API in Node.js and Express for booking logic, availability checks and JWT authentication.
- Designed the MongoDB schema and a responsive React front end for hotel, taxi and guide booking.

**Technical skills** — grouped as above. **Education** — as above.

---

## Traceability

Every fact above comes from the brief's Section 1 or from your Phase 1 answers. Things I deliberately **removed** from the old site/CV:
- "Results-driven", "drive innovation within a dynamic team", "passionate about clean code", "∞ Curiosity", "5+ Languages".
- "Real-time" booking/medical tracking (old CV) — not in the brief, so dropped.
- "Scalable" (old CV) — no evidence given, so dropped.
- Gemini AI engine (old site) — pending your confirmation.

## Open `[[FILL]]` items

1. Your role on Ayu Arana Care (solo / team + your part).
2. Your role on Ceylon Traveler (solo / team + your part).
3. Ceylon Traveler Gemini feature: keep or remove (left out for now).
4. ANN library for the heart-disease coursework.
5. MediSync screenshots: dashboard, district map, doctor portal.

## Verification log

- github.com/Chamod-Tharusha-Alwis/MediSync — **VERIFIED** 2026-11-21: public, HTTP 200 without login.
- medisync.chamodtharusha.com.lk — **NOT VERIFIED**: the build sandbox cannot resolve the host (network policy). Please open it yourself once.
- Note: the MediSync README also mentions "symptom diagnosis" and a Vercel URL (medi-sync-sepia-eight.vercel.app). Neither is in your brief, so neither is used here.
