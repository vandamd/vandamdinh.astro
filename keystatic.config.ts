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
                song: fields.url({
                    label: 'URL',
                    description: 'Spotify URL',
                }),
                img: fields.image({
                    label: 'Background Image',
                    directory: 'src/assets',
                    publicPath: '../../assets/',
                }),
                content: fields.markdoc({
                    label: 'Content',
                    extension: 'md',
                    options: {
                        image: {
                            directory: 'src/assets',
                            publicPath: '../../assets/',
                        }
                    }
                }),
            },
        }),
    },
});
