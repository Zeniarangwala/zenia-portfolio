# zenia-portfolio

Zenia Rangwala's design portfolio. Built with [Astro](https://astro.build) and plain CSS.

## Run it

```sh
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # static site in dist/ (works on Vercel or Netlify)
```

## Edit content

- **Case studies:** `src/content/projects/<project>.mdx`. Frontmatter (between the `---` lines) holds the quick facts and the inclusion box; the text below it is the case study.
- **Images:** `public/images/<project>/`. Reference them as `/images/<project>/<file>`.
- **About / Connect:** `src/pages/about.astro`, `src/pages/connect.astro`.
- **Missing facts** are marked `TODO: Zenia to confirm`. Search for that phrase to find them all.
