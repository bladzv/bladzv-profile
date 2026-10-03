// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bladzv.github.io',
  base: '/bladzv-profile',
  output: 'static',
  compressHTML: true,
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
