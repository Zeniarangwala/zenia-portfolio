// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // TODO: Zenia to confirm — set to the final custom domain (e.g. 'https://example.com')
  // so canonical URLs and Open Graph links are generated.
  // site: 'https://example.com',
  integrations: [mdx()],
});
