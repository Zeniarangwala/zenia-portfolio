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
- **Home page cards** (tags, hover image) and **hero stickers:** `src/data/site.ts`. Card titles, covers and alt text come from each case study's frontmatter.
- **Email, LinkedIn, résumé links:** `src/data/site.ts`. Put your résumé at `public/resume.pdf`.
- **About / Connect:** `src/pages/about.astro`, `src/pages/connect.astro`.
- **Colours and type sizes:** the tokens at the top of `src/styles/global.css` (the two accent options are noted there).
- **Missing facts** are marked `TODO: Zenia to confirm`. Search for that phrase to find them all.
