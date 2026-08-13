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
      order: z.number(),
      visible: z.boolean().default(true),
      images: z.array(z.object({ src: image(), alt: z.string() })),
    }),
});

export const collections = { projects };
