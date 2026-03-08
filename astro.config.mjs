// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://bladzv.github.io',
  base: '/bladzv-profile',
  integrations: [tailwind()],
  output: 'static',
  devToolbar: { enabled: false },
});
