# Copilot Instructions for static-profile

## Architecture

Single-page static portfolio site built with **Astro + Tailwind CSS**, deployed to **GitHub Pages** via GitHub Actions.

```
src/
├── pages/index.astro           ← Single entry point, imports all section components
├── layouts/Layout.astro        ← HTML shell with CSP headers, Open Graph, dark theme
├── components/                 ← One .astro file per visual section
│   ├── ParticlesBG.astro       ← Canvas-based particle animation (vanilla JS, no deps)
│   ├── Hero.astro              ← Full-height intro with typing animation
│   ├── About.astro             ← Summary + AI-assisted coding callout
│   ├── Experience.astro        ← Condensed vertical timeline (role + company + dates only)
│   ├── Skills.astro            ← Skill badges grouped by category
│   ├── Certifications.astro    ← Cert credential cards
│   ├── Projects.astro          ← Card grid (merges GitHub API + manual markdown entries)
│   ├── ProjectCard.astro       ← Single project card with public/private badge
│   └── Footer.astro            ← LinkedIn + GitHub links
├── content/
│   ├── config.ts               ← Astro content collection schema (Zod validation)
│   └── projects/               ← ★ Add .md files here for manual project cards
│       ├── _template.md        ← Documented frontmatter template
│       ├── bantayscam.md       ← Private project entry
│       └── blockboardz.md      ← Private project entry
├── lib/github.ts               ← Build-time GitHub API fetch + sanitization
└── styles/global.css           ← Tailwind directives, dark theme, animations
```

## Developer Workflows

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

- **Adding a project card:** Create a `.md` file in `src/content/projects/` using `_template.md` as a guide. Rebuild to see the card.
- **Public repos:** Auto-fetched from GitHub API (`bladzv`) at build time — no manual entries needed.
- **Deployment:** Push to `main` triggers `.github/workflows/deploy.yml` (also runs weekly cron to refresh repos).

## Key Conventions

- **Icons:** Use `@lucide/astro` — import from `'@lucide/astro'`. No other icon libraries.
- **Colors:** Use `cyber-*` Tailwind tokens defined in `tailwind.config.mjs` (green `#00ff88`, blue `#00d4ff`, purple `#a855f7`).
- **CSS classes:** Use utility classes from `global.css`: `section-heading`, `section-container`, `glass-card`, `badge-public`, `badge-private`, `badge-ongoing`, `text-gradient`.
- **No client-side JS** except `ParticlesBG.astro`'s inline `<script>`. Everything else is static HTML.
- **Security:** All GitHub API data sanitized in `src/lib/github.ts`. CSP meta tag in Layout. No forms, no backend, no user input.
- **Responsive:** Tailwind breakpoints — `sm:` (640px), `md:` (768px), `lg:` (1024px). Mobile-first approach.
- **Accessibility:** Respect `prefers-reduced-motion` (particles hidden, animations disabled). Use `aria-label` on icon-only links.

## AI Agent Tips

- When adding new sections, follow the pattern in existing components: export no JS, use `section-container` wrapper, add Lucide icon + `section-heading`.
- Project card frontmatter schema is validated by Zod in `src/content/config.ts` — update schema if adding fields.
- The `base` path in `astro.config.mjs` is set for GitHub Pages (`/bladzv-profile`). Adjust if repo name changes.
