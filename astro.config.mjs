// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bladzv.github.io',
  base: '/bladzv-profile',
  output: 'static',
  devToolbar: { enabled: false },
});
