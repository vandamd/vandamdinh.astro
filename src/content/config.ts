import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({ image }) => z.object({
    title: z.string(),
    song: z.string().optional(),
    date: z.string(),
    img: image(),
    // Add other frontmatter fields here if needed, e.g.:
    // pubDate: z.date(),
    // author: z.string(),
    // description: z.string().optional(),
    // image: z.object({
    //   url: z.string(),
    //   alt: z.string()
    // }).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};