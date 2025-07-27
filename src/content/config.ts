import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        song: z.string().optional(),
        date: z.date(),
        img: image(),
    }),
});

export const collections = {
    'blog': blogCollection,
};
