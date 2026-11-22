// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      category: z.enum(['work', 'personal']).default('work'),
      // Personal projects only: a small label in the sidebar and homepage listing.
      kind: z.enum(['Game', 'Mod', 'Tool']).optional(),
      // Work projects only: shown above the title on the homepage, e.g. "2022 – 2025".
      years: z.string().optional(),
      order: z.number(),
      visible: z.boolean().default(true),
      images: z.array(z.object({ src: image(), alt: z.string() })),
      // Homepage timeline thumbnail; falls back to the first gallery image.
      cover: image().optional(),
    }),
});

export const collections = { projects };
