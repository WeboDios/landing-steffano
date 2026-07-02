import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://landing-steffano.vercel.app',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
