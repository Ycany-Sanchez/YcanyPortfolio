# Ycany Sanchez — Portfolio

A cinematic editorial portfolio built with Next.js App Router, React, TypeScript, Node.js, GSAP, and locally served Inter Tight. The original Streamlit portfolio remains untouched.

## Run on Windows

```powershell
npm.cmd ci
npm.cmd run dev -- --port 3100
```

Open http://localhost:3100. For a production preview:

```powershell
npm.cmd run build
npm.cmd start -- --port 3100
```

PowerShell may block npm.ps1; use npm.cmd as shown. Node.js 22.13+ or 24 LTS is recommended; this project was verified with Node.js 24.

## Content and design

- `lib/projects.ts` owns typed project metadata and public profile links.
- `content/*.mdx` contains five case-study narratives. They use the Markdown-compatible subset of MDX, rendered with react-markdown; arbitrary JSX, imports, and raw HTML are deliberately not executed.
- `components/system-flow.tsx` contains the explorable architecture narratives.
- `public/media` contains the supplied portrait, résumé, and original event announcements.
- `public/fonts` contains the unmodified Inter Tight Latin variable font and its OFL license. No runtime font service is used.
- `design` contains eight AI-generated visual references and design notes. These are website mockups, not evidence of the projects' real interfaces.

The five projects are Parola, BantAI Buddy, +inHealth, IMentia, and FoodPantry. Personal roles, team contributions, intended capabilities, and measured outcomes are kept distinct. The omitted DocTient1 workshop entry has no verified description or implementation evidence in the reviewed portfolio.

The homepage follows a six-section narrative: introduction, work, expertise, approach, about, and inquiry. Motion respects reduced-motion settings; the hero also has a visible pause/resume control. The site uses native scrolling and remains readable without JavaScript.

## Inquiry email

Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`: a Resend API key.
- `CONTACT_FROM_EMAIL`: sender on a domain verified in your Resend account.
- `CONTACT_TO_EMAIL`: optional recipient override; defaults to the supplied portfolio email.
- `SITE_URL`: your canonical HTTPS origin on production, e.g. your own deployed domain.

Do not commit credentials. The homepage is prerendered, so rebuild after changing email configuration or SITE_URL. Without the sender and key, the form clearly states it is unavailable, disables submission, and links to email.

`POST /api/contact` validates fields and selected options, checks same-origin requests and a honeypot, rejects implausibly fast or expired forms, and limits the request to 16 KB. It sends a plain-text message through Resend with a stable idempotency key and an 8-second timeout. HTTP 200 means the provider accepted the message; it is not a guarantee of inbox delivery. Provider failures never produce a success message. No inquiry database or analytics is included.

## Verify

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

The contact tests inject a mock provider and never send real messages. Browser smoke checks live in `scripts/browser-smoke.mjs`; they require a local Chrome DevTools endpoint on port 9238 and a running site:

```powershell
$env:PORTFOLIO_URL='http://127.0.0.1:3100'
node scripts/browser-smoke.mjs
```

The script verifies five responsive widths, all project pages, mobile navigation and Escape focus, architecture interactions, reduced motion, no-JavaScript readability, the unavailable-email fallback, 404s, and bundled assets. Reports and screenshots go to ignored `artifacts/`.

## Deploy to Vercel

Import this folder as the project root, choose Next.js, set the four environment variables above, and deploy using `npm run build`. No special Vercel configuration is required. Confirm the public SITE_URL, résumé, all case-study routes, and a real project inquiry after launch.

Local development does not deploy the site, register domains, create external repositories, or configure an email account.

## Verification results

Verified locally against the production build on 1 November 2026:

- Production build and strict TypeScript checks passed.
- All 12 contact integration tests passed without sending email.
- All 40 browser checks passed at viewport widths 360, 390, 768, 1366, and 1920.
- Five case-study routes, architecture controls, mobile navigation/Escape focus, reduced motion, no-JavaScript readability, résumé/media, social preview, robots/sitemap, and the custom 404 were checked.
- Final desktop and mobile Lighthouse runs scored **100 performance, 100 accessibility, 100 best practices, and 100 SEO**.
- Independent source reviews found no remaining blocking issues after fixes.

Lighthouse results are local lab measurements rather than guarantees for a deployed site. Raw reports and screenshots are saved under the ignored `artifacts/` directory.
