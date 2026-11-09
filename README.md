<div align="center">

# Static Profile — Bloodymer S. Velasco

A portfolio you can click around like a small desktop ("bladzOS"): draggable Files and Terminal windows, with tablet and phone layouts. A plain, scrollable simple mode is one toggle away, plus pages for write-ups and open study notes.

![Astro](https://img.shields.io/badge/Astro-0a0a0f?style=for-the-badge&logo=astro&logoColor=ff5d01) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0a0a0f?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4) ![TypeScript](https://img.shields.io/badge/TypeScript-0a0a0f?style=for-the-badge&logo=typescript&logoColor=3178c6)

[Live site](https://bladzv-profile.pages.dev/)

</div>

---

## About

Static Profile is a fast, accessibility‑minded portfolio built with Astro and Tailwind CSS. It shows public GitHub repos (fetched at build time) and manually authored private projects.

Why this repo:
- Security‑first: CSP meta tag in `Layout.astro` and sanitization of all GitHub API data.
- Easy content workflow: add/edit Markdown in `src/content/`; use `blur: true` for private projects.
- Accessible: respects `prefers-reduced-motion` (particles hidden, animations disabled); `aria-label` on all icon‑only links.


## Tech Stack

- Framework: Astro 7 (static output, served from the site root)
- Styling: Tailwind CSS v4 via the Vite plugin — dark navy `cyber-*` CSS theme tokens
- Fonts: Inter (desktop UI), Archivo (simple mode, write-ups, notes) + JetBrains Mono via Google Fonts
- Background: Canvas particle animation (vanilla JS, no dependencies)
- Hosting: Cloudflare Pages (static, free plan); security headers in `public/_headers`
- Build-time data: GitHub REST API (sanitized), cached in `src/data/github-repos.json`
- CI/CD: Cloudflare Pages builds and deploys on push to `main`; GitHub Actions runs checks and the weekly cache refresh

## Project Structure

```
src/
├── content.config.ts           ← Zod schemas: projects, skills, certifications, writeups, notes
├── pages/
│   ├── index.astro             ← bladzOS desktop (tablet and phone layouts included)
│   ├── simple.astro            ← Simple mode: one plain, scrollable page
│   ├── writeups/               ← Write-ups index + one page per published write-up
│   └── notes.astro             ← Open notebook with folders, search and copy buttons
├── layouts/Layout.astro        ← HTML shell + CSP meta tag + OG/Twitter tags
├── components/
│   ├── os/                     ← Desktop shell, top bar, phone home, file icons
│   │   └── sections/           ← Window contents: about, experience, projects, …
│   └── dossier/                ← Shared parts of the simple, write-ups and notes pages
├── content/
│   ├── projects/               ← Project entries (.md); public repos add a summary and group
│   ├── skills/                 ← Skill groups (.md)
│   ├── certifications/         ← Certifications (.md)
│   ├── writeups/               ← Write-ups (.md); drafts show as "in draft"
│   └── notes/                  ← One JSON file per note
├── data/                       ← Profile facts, roles, note folder order, cached GitHub repos
├── lib/                        ← GitHub fetch + sanitization, project merge, base-path links
├── client/                     ← Client scripts: windows, terminal, notes, effects
└── styles/global.css           ← Tailwind theme tokens (cyber-*, dossier-*) + shared classes
scripts/
└── update-github-cache.js      ← Refreshes src/data/github-repos.json from GitHub API
vendor/
└── http-cache-semantics/       ← Patched fork of an Astro dependency + its regression test
.github/
├── workflows/ci.yml            ← Audit, lint, test and build on push and pull requests
└── workflows/update-cache.yml  ← Weekly cron to refresh cached public repos
```

## Developer Workflows

Use Node.js 22.23.4+ on the 22.x line, 24.16.0+ on the 24.x line, or 26.3.0+.
CI uses Node.js 22.23.4 and installs the committed npm lockfile with `npm ci`.
Tailwind 4 targets Safari 16.4+, Chrome 111+, and Firefox 128+.
Theme colors, fonts, animations, and shared component styles live in `src/styles/global.css`.

```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint (failures are not suppressed)
npm run audit    # Check all dependencies; high/critical findings fail
npm test         # Regression test for the vendored http-cache-semantics fork
```

- **Adding a project:** Create a `.md` file in `src/content/projects/` using `_template.md` as a guide.
- **Public repos:** Auto-fetched from GitHub API (`bladzv`) at build time (including repo descriptions). Without an entry they appear under "More on GitHub"; add a short `.md` with `title`, `summary`, `group` and `order` to place one in a group.
- **Private projects:** Set `visibility: private` (and optionally `blur: true`) in the frontmatter.
- **Adding a write-up:** Copy `src/content/writeups/_template.md`; it gets its own page once `status: published`.
- **Adding a note:** Copy `src/content/notes/_template.json`; folder order lives in `src/data/notes.ts`.
- **Deploying:** Push to `main` — Cloudflare Pages builds and deploys automatically (Node version from `.node-version`). Pull requests get preview links. The Cloudflare build command is `npm run audit && npm run lint && npm run build`.
- **Refreshing cached repos locally:** Run `node scripts/update-github-cache.js` (requires `GITHUB_TOKEN` env var).

### Dependency security and deployment

The Cloudflare Pages build command runs `npm run audit` and `npm run lint` before
`npm run build`. High or critical findings, lint errors, and audit service failures
fail the build, and the last good deployment stays live. The CI workflow runs the
same checks plus `npm test` on pushes and pull requests. Do not add an audit bypass
to publish an affected build.
`npm test` covers only the vendored fork, so verification also requires lint,
build, dependency audit, and browser checks.

As of October 3, 2026, upstream has no release fixing
[GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp).
Astro's remote-image build cache uses `http-cache-semantics`, so this repository
ships a local BSD-2-Clause fork at `vendor/http-cache-semantics`. It rejects
reuse of shared responses with non-public `Set-Cookie`, `proxy-revalidate`, or
`no-cache`, including requests with `max-stale`. `npm test` covers the reported
case and ordinary stale-cache behavior. The fork is marked `4.2.1-profile.0` to
distinguish it from upstream. The npm advisory feed does not review local fork
code, so keep its regression tests and review future upstream changes before
updating it. Replace the fork with an upstream patched release when one is
available, then rerun the full audit and build checks.
