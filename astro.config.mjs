// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Browser targets for the CSS minifier (lightningcss). Without explicit targets it
// collapses prefixed/standard pairs (e.g. -webkit-backdrop-filter + backdrop-filter)
// down to one, which was dropping the blur in Chrome/Firefox.
const cssTargets = { chrome: 87 << 16, firefox: 78 << 16, safari: 14 << 16 };

export default defineConfig({
  site: 'https://jamessparkes.com',
  integrations: [mdx()],
  vite: {
    css: {
      transformer: 'lightningcss',
      lightningcss: { targets: cssTargets },
    },
    build: { cssTarget: ['chrome87', 'firefox78', 'safari14'] },
  },
});
