// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import readingStats from '@jcayzac/astro-rehype-frontmatter-reading-stats'

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // <--- 在这里添加您的网站域名
  markdown: {
    rehypePlugins: [
      readingStats,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  integrations: [
    icon({
      include: {
        'material-symbols': ['*'],
        'fa6-solid': ['*'],
      }
    }), 
    svelte()
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
