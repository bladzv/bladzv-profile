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

- Framework: Astro
- Styling: Tailwind CSS
- Hosting: GitHub Pages (static)
- Build-time data: GitHub REST API (sanitized)

## Project Structure

- `src/pages/index.astro` — single entry that composes components
- `src/layouts/Layout.astro` — HTML shell + CSP
- `src/components/` — visual sections (Hero, About, Projects, etc.)
- `src/content/` — Markdown collections for projects, skills, certifications
- `src/lib/github.ts` — build-time GitHub fetch + sanitization
- `src/styles/global.css` — Tailwind utilities and site styles
