import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	// 使用 posts 目录
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			categories: z.array(z.string()),
			tags: z.array(z.string()),
			date: z.coerce.date(),
			updated: z.coerce.date().optional(),
			slug: z.string(),
			cover: z.union([image(), z.null()]).optional(), // 允许 null 值
			pinned: z.boolean().default(false), // 是否置顶
			aiSummary: z.boolean().optional(), // 是否启用AI摘要（可有可无）
		}),
});

export const collections = {
  'posts': posts,
};