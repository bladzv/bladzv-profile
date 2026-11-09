# Repository guidance

This repository is a static portfolio built with Astro 7 and Tailwind CSS 4. It deploys to Cloudflare Workers (static assets) at `https://bladzv.mylesdev.com`, served from the site root.

## Where things live

- Pages: `src/pages/index.astro` is the bladzOS desktop (`src/components/os/OsShell.astro`); `simple.astro` is the plain, scrollable version; `writeups/` and `notes.astro` are the write-ups and notes pages. The simple, write-ups and notes pages share `src/components/dossier/*.astro`.
- `src/components/os/sections/*.astro` hold the content of each desktop window, following the design's `AppContent` (section ids: about, route, projects, training, writeups, notes, contact). They render once, and `src/client/os.ts` shows them in the desktop, tablet or phone layout.
- `src/client/` contains the client scripts: `os.ts` (windows and layout), `terminal.ts`, `notes.ts` (search, note switching, copy; shared by `/notes/` and the desktop Notes window) and `effects.ts` (typewriter, scramble, particles, saved view mode).
- `src/layouts/Layout.astro` provides the HTML shell, metadata, and CSP meta tag.
- `src/styles/global.css` defines theme tokens (`cyber-*` for the desktop, `dossier-*` for the simple, write-ups and notes pages), fonts, and shared classes.
- `src/content.config.ts` defines the Zod schemas for projects, skills, certifications, writeups, and notes.
- `src/data/profile.ts` holds the profile facts, roles and section list; `src/data/notes.ts` sets the order of note folders.
- `src/lib/github.ts` supplies sanitized GitHub repository data at build time; `src/data/github-repos.json` is the committed cache. `src/lib/projects.ts` merges it with the project entries; `src/lib/notes.ts` orders notes and builds their search text.
- `src/content/projects/`, `skills/`, `certifications/` and `writeups/` contain authored Markdown entries; `src/content/notes/` contains one JSON file per note. Each directory has a `_template` example.

## Workflows

- Use a supported Node.js version from `package.json` and install the committed lockfile with `npm ci`.
- `npm run dev` starts the local server; `npm run build` creates the static site; `npm run preview` serves the build.
- `npm run lint` checks source with the typescript-eslint and Astro recommended rules; `npm run audit` checks dependencies; `npm test` runs the regression test in `vendor/http-cache-semantics/`.
- Run `node scripts/update-github-cache.js` only when refreshing the public repository cache is part of the task; it requires `GITHUB_TOKEN`.
- After editing `public/favicon.svg`, run `node scripts/build-favicons.js` to regenerate `favicon.ico` and the PNG icons, then bump the `?v=` in `src/layouts/Layout.astro`.
- Pushing to `main` triggers a Cloudflare Workers Builds build and deploy (Node version from `.node-version`; build command `npm run audit && npm run lint && npm run build`, so a failed check keeps the last good deploy live; deploy command `npx wrangler deploy`, configured in `wrangler.jsonc`, which also attaches the custom domain). `.github/workflows/ci.yml` runs audit, lint, test and build; the cache refresh has its own workflow. Do not put `[skip ci]` in commits that should go live, because Cloudflare skips them. HTTP security headers live in `public/_headers`.

## Editing conventions

- Follow neighboring Astro components when changing the page. Use `@lucide/astro` for icons and the `cyber-*` / `dossier-*` theme tokens and shared classes in `src/styles/global.css` for styling.
- Keep project, skill, and certification frontmatter consistent with `src/content.config.ts`. For a private project, set `visibility: private`; `blur: true` is optional. A public repo only needs `title`, `summary`, `group` and `order`, because the GitHub cache supplies the rest. A write-up stays hidden behind a draft row until `status: published`.
- Preserve the static build, responsive layout, keyboard accessibility, and reduced-motion behavior when changing UI. Keep GitHub API data sanitized before rendering it.
- Keep the configured site and base path in `astro.config.mjs` in mind when changing links or assets; build internal links with `url()` from `src/lib/paths.ts`.
