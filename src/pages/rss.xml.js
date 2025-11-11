// 函数：GET 返回 RSS feed
import rss from '@astrojs/rss';
import { siteConfig } from '../config';

import { getDateSortedPosts } from '../utils/content-utils';

export async function GET(context) {
  const posts = await getDateSortedPosts(); 

  return rss({
    stylesheet: "/rss.xsl",
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? post.data.excerpt ?? '',
      link: `/posts/${post.slug}/`,
      pubDate: post.data.date,
      categories: post.data.tags ?? [],
    })),
  });
}
