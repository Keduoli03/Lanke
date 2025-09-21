// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkGithubCard } from './src/plugins/rehype-component-github-card.mjs';
import rehypeAplayer from './src/plugins/rehype-component-aplayer.mjs';
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import readingStats from '@jcayzac/astro-rehype-frontmatter-reading-stats'
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";
import { expressiveCodeConfig, siteConfig } from './src/config';
import rehypeCallouts from "rehype-callouts";
import remarkAplayer from './src/plugins/rehype-component-aplayer.mjs';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkGithubCard,
      remarkAplayer
    ],
    rehypePlugins: [
      
      [rehypeCallouts, {
        theme: "github",
      }],
      rehypeAplayer,
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
    sitemap(),
    icon({
    include: {
      'material-symbols': ['*'],
      'fa6-solid': ['*'],
    }
  }), 
  svelte(), 
  // In astro-expressive-code config
        expressiveCode({
            themes: expressiveCodeConfig.themes,
            plugins: [
                pluginLineNumbers(),
                pluginCollapsibleSections(),
                pluginFileIcons({
                    iconClass: "text-4 w-5 inline mr-1 mb-1",
                    titleClass: "",
                }),
            ],
            defaultProps: {
                wrap: false,
                showLineNumbers: true,
            },
            frames: {
                showCopyToClipboardButton: true,
            },
        }),
],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  trailingSlash: 'always', // 始终以“/”结尾
  output: 'static',
  adapter: vercel(),
});