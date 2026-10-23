// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bladzv.github.io',
  base: '/bladzv-profile',
  output: 'static',
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    // src/lib/github.ts rewrites the repo cache on every dev render; watching it reloads the page.
    server: { watch: { ignored: ['**/.cache/**'] } },
  },
  devToolbar: { enabled: false },
});
