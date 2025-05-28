// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ["i.scdn.co", "image.tmdb.org", "i.ytimg.com"],
  },

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          content: { type: 'text', value: ' ↗' },
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      ],
    ]
  },

  adapter: cloudflare(),
});