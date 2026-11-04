// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // The live domain: used for canonical URLs and the absolute link-preview image URL.
  site: 'https://zeniarangwalaa.com',
  integrations: [mdx()],
});
