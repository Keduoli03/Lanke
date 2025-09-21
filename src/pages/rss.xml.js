import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { siteConfig } from '../config';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    stylesheet: "/rss.xsl", // 确保启用XSLT
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.slug}/`,
      pubDate: post.data.date,
      categories: post.data.tags ?? [],
    })),
  });
}
