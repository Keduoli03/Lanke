import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 已有的posts集合
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			categories: z.array(z.string()),
			tags: z.array(z.string()),
			date: z.coerce.date(),
			updated: z.coerce.date().optional(),
			slug: z.string(),
			cover: z.union([image(), z.null()]).optional(),
			pinned: z.boolean().default(false),
			aiSummary: z.boolean().optional().default(true),
			status: z.string().optional(),
			column: z.string().optional(),
		}),
});


const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.coerce.date().optional(),
			updated: z.coerce.date().optional(),
			slug: z.string(), // 用于生成页面URL
		}),
});

export const collections = {
  'posts': posts,
  'pages': pages, 
};
