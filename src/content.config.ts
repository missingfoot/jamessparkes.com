// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Search results and link previews: what the project is, after its name.
      seoTitle: z.string().optional(),
      description: z.string(),
      // About page cards: one line on what I did (work) or the gist (personal).
      summary: z.string().optional(),
      tags: z.array(z.string()),
      category: z.enum(['work', 'personal']).default('work'),
      // Personal projects only: a small label in the sidebar and homepage listing.
      kind: z.enum(['Game', 'Mod', 'Tool']).optional(),
      // Work projects only: shown above the title on the homepage, e.g. "2022 – 2025".
      years: z.string().optional(),
      // Work projects only: my job title there, shown above the highlights.
      role: z.string().optional(),
      // Work projects only: headline results shown at the top of the case study.
      highlights: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      order: z.number(),
      visible: z.boolean().default(true),
      images: z.array(z.object({ src: image(), alt: z.string() })),
      // Homepage timeline thumbnail; falls back to the first gallery image.
      cover: image().optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Position on the original blog page, to keep same-day posts in their old order
    order: z.number(),
    categories: z.array(z.string()),
    tags: z.array(z.string()).default([]),
    originalUrl: z.string().url(),
  }),
});

export const collections = { projects, blog };
