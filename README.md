<div align="center">

# Static Profile — Bloodymer S. Velasco

A clean, fast one‑page resume that highlights who I am, what I've built, and my skills in IT & cybersecurity. The site works on any device and keeps things simple and accessible — just me on the web.

![Astro](https://img.shields.io/badge/Astro-0a0a0f?style=for-the-badge&logo=astro&logoColor=ff5d01) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0a0a0f?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4) ![TypeScript](https://img.shields.io/badge/TypeScript-0a0a0f?style=for-the-badge&logo=typescript&logoColor=3178c6)

[Live site](https://bladzv.github.io/bladzv-profile/)

</div>

---

## About

Static Profile is a fast, accessibility‑minded portfolio built with Astro and Tailwind CSS. It shows public GitHub repos (fetched at build time) and manually authored private projects.

Why this repo:
- Minimal runtime JS — improved performance and reduced attack surface.
- Security‑first: CSP in `Layout.astro` and sanitization of GitHub data.
- Easy content workflow: add/edit Markdown in `src/content/`; use `blur: true` for private projects.


## Tech Stack

- Framework: Astro 6
- Styling: Tailwind CSS v3 via PostCSS (`postcss.config.cjs`)
- Hosting: GitHub Pages (static)
- Build-time data: GitHub REST API (sanitized), cached in `.cache/github_repos.json`
- CI/CD: GitHub Actions — deploy on push to `main`, weekly cache refresh

## Project Structure

```
src/
├── content.config.ts           ← Zod schemas for projects, skills, certifications
├── pages/index.astro           ← Single entry point, composes all sections
├── layouts/Layout.astro        ← HTML shell + CSP meta tag
├── components/                 ← One .astro file per visual section
├── content/
│   ├── projects/               ← Manual project entries (.md) — public & private
│   ├── skills/                 ← Skill badge groups by category (.md)
│   └── certifications/         ← Cert credential cards (.md)
├── lib/github.ts               ← Build-time GitHub API fetch + sanitization
└── styles/global.css           ← Tailwind directives + custom utilities
scripts/
└── update-github-cache.js      ← Refreshes .cache/github_repos.json from GitHub API
.github/
├── workflows/deploy.yml        ← Build & deploy to GitHub Pages on push to main
└── workflows/update-cache.yml  ← Weekly cron to refresh cached public repos
```

## Developer Workflows

```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

- **Adding a project:** Create a `.md` file in `src/content/projects/` using `_template.md` as a guide.
- **Public repos:** Auto-fetched from GitHub API (`bladzv`) at build time — no manual entry needed.
- **Private projects:** Set `visibility: private` (and optionally `blur: true`) in the frontmatter.
- **Deploying:** Push to `main` — GitHub Actions builds and deploys automatically.
