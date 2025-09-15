// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
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
import { expressiveCodeConfig } from './src/config';

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
  integrations: [icon({
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
});