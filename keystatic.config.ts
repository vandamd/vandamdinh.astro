import { config, fields, collection, singleton } from '@keystatic/core';

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
            entryLayout: 'content',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                date: fields.date({ label: 'Date' }),
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
        others: collection({
            label: 'Others',
            slugField: 'title',
            path: 'src/content/*',
            entryLayout: 'content',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                date: fields.date({ label: 'Date' }),
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
    singletons: {
        favouriteFilms: singleton({
            label: 'Favourite Films',
            path: 'src/content/favourite/films',
            schema: {
                date: fields.date({ label: 'Date' }),
                films: fields.array(
                    fields.object({
                        letterboxdUrl: fields.url({ label: 'Letterboxd URL' }),
                        tmdbdUrl: fields.url({ label: 'TMDB URL' }),
                    }),
                    {
                        label: 'Favourite Films',
                        itemLabel: props => props.fields.letterboxdUrl.value ?? 'Film'
                    }
                ),
            }
        }),
        favouriteAlbums: singleton({
            label: 'Favourite Albums',
            path: 'src/content/favourite/albums',
            schema: {
                date: fields.date({ label: 'Date' }),
                albums: fields.array(
                    fields.object({
                        spotifyUrl: fields.url({ label: 'Spotify URL' }),
                    }),
                    {
                        label: 'Favourite Albums',
                        itemLabel: props => props.fields.spotifyUrl.value ?? 'Album'
                    }
                ),
            }
        }),
        favouriteTracks: singleton({
            label: 'Favourite Tracks',
            path: 'src/content/favourite/tracks',
            schema: {
                date: fields.date({ label: 'Date' }),
                tracks: fields.array(
                    fields.object({
                        spotifyUrl: fields.url({ label: 'Spotify URL' }),
                    }),
                    {
                        label: 'Favourite Tracks',
                        itemLabel: props => props.fields.spotifyUrl.value ?? 'Tracks'
                    }
                ),
            }
        }),
        favouriteVideos: singleton({
            label: 'Favourite Videos',
            path: 'src/content/favourite/videos',
            schema: {
                date: fields.date({ label: 'Date' }),
                videos: fields.array(
                    fields.object({
                        youtubeUrl: fields.url({ label: 'YouTube URL' }),
                    }),
                    {
                        label: 'Favourite Videos',
                        itemLabel: props => props.fields.youtubeUrl.value ?? 'Videos'
                    }
                ),
            }
        }),
        favouritePodcasts: singleton({
            label: 'Favourite Podcasts',
            path: 'src/content/favourite/podcasts',
            schema: {
                date: fields.date({ label: 'Date' }),
                podcasts: fields.array(
                    fields.object({
                        youtubeUrl: fields.url({ label: 'YouTube URL' }),
                    }),
                    {
                        label: 'Favourite Podcasts',
                        itemLabel: props => props.fields.youtubeUrl.value ?? 'Podcasts'
                    }
                ),
            }
        }),
    }
});
