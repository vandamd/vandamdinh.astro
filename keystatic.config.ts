import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'github',
        repo: "vandamd/vandamdinh.astro",
    },
    collections: {
        blog: collection({
            label: 'Blog',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                date: fields.text({ label: 'Date' }),
                song: fields.text({ label: 'Song' }),
                img: fields.text({ label: 'Background Image' }),
                content: fields.markdoc({ label: 'Content' }),
            },
        }),
    },
});
