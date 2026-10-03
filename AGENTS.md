# Repository guidance

This repository is a static, single-page portfolio built with Astro 7 and Tailwind CSS 4. It deploys to GitHub Pages at the `/bladzv-profile` base path.

## Where things live

- `src/pages/index.astro` composes the page from `src/components/*.astro`.
- `src/layouts/Layout.astro` provides the HTML shell, metadata, and CSP meta tag.
- `src/styles/global.css` defines theme tokens, fonts, animations, and shared styles.
- `src/content.config.ts` defines the Zod schemas for projects, skills, and certifications.
- `src/lib/github.ts` supplies sanitized GitHub repository data at build time; `.cache/github_repos.json` is the local cache.
- `src/content/projects/`, `src/content/skills/`, and `src/content/certifications/` contain authored Markdown entries. Each directory has an `_template.md` example.

## Workflows

- Use a supported Node.js version from `package.json` and install the committed lockfile with `npm ci`.
- `npm run dev` starts the local server; `npm run build` creates the static site; `npm run preview` serves the build.
- `npm run lint` checks source formatting and rules; `npm run audit` checks dependencies. `npm test` is currently a placeholder.
- Run `node scripts/update-github-cache.js` only when refreshing the public repository cache is part of the task; it requires `GITHUB_TOKEN`.
- Pushing to `main` triggers the GitHub Pages deployment workflow. The cache refresh has its own GitHub Actions workflow.

## Editing conventions

- Follow neighboring Astro components when changing the page. Use `@lucide/astro` for icons and the `cyber-*` theme tokens and shared classes in `src/styles/global.css` for styling.
- Keep project, skill, and certification frontmatter consistent with `src/content.config.ts`. For a private project, set `visibility: private`; `blur: true` is optional.
- Preserve the static build, responsive layout, keyboard accessibility, and reduced-motion behavior when changing UI. Keep GitHub API data sanitized before rendering it.
- Keep the configured GitHub Pages site and base path in `astro.config.mjs` in mind when changing links or assets.
