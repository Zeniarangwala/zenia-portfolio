import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One MDX file per project in src/content/projects/.
// Anything not yet known is written as "TODO: Zenia to confirm" so it stays visible.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
    order: z.number(),
    name: z.string(),
    title: z.string(),
    discipline: z.string(),
    problem: z.string(),
    role: z.string(),
    team: z.string(),
    tools: z.string(),
    timeline: z.string(),
    inclusion: z.object({
      audience: z.string(),
      decisions: z.array(z.string()),
    }),
    // "Intention" (designed for, not tested) vs "Tested" (with evidence), or a TODO.
    inclusionStatus: z.string(),
    cover: z
      .object({ src: z.string(), width: z.number(), height: z.number() })
      .optional(),
    coverAlt: z.string(),
    // What's still missing for this case study (images, footage, facts).
    assetRequest: z.string(),
  }),
});

export const collections = { projects };
