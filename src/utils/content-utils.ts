
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 获取所有已发布的文章。
 *
 * 此函数采用黑名单策略，过滤掉 status 为 '未完成' 的文章。
 * 它会有意获取所有文章，然后在内存中进行过滤，
 * 目的是为了解决 Astro 开发服务器中的一个缓存行为：
 * 在内容变更时，传递给 `getCollection` 的过滤器可能不会被重新评估。
 * 通过手动过滤，可以确保每次都获取到最新的、已发布的文章列表。
 *
 * @returns 返回一个解析为已发布文章条目数组的 Promise。
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  // 黑名单策略：过滤掉状态为 '未完成' 的文章
  const publishedPosts = allPosts.filter(post => post.data.status !== '未完成');
  return publishedPosts;
}

export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.sort((a, b) => {
    // 将 pinned: true 的文章排在前面
    if (a.data.pinned && !b.data.pinned) return -1;
    if (!a.data.pinned && b.data.pinned) return 1;
    // 如果 a 和 b 的 pinned 状态相同，则按日期降序排列
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

export async function getAdjacentPosts(slug: string): Promise<{
  prevPost: CollectionEntry<'posts'> | null;
  nextPost: CollectionEntry<'posts'> | null;
}> {
  const posts = await getSortedPosts();
  const currentIndex = posts.findIndex(p => p.id === slug);

  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return { prevPost, nextPost };
}

export async function getAllCategories(): Promise<{ name: string; count: number; posts: CollectionEntry<'posts'>[] }[]> {
  const posts = await getPublishedPosts();
  const categoryMap = new Map<string, CollectionEntry<'posts'>[]>();

  posts.forEach(post => {
    const categories = post.data.categories || [];
    categories.forEach(category => {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(post);
    });
  });

  return Array.from(categoryMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts,
  })).sort((a, b) => b.count - a.count);
}

// 获取所有标签及其文章数量
export async function getAllTags(): Promise<{ name:string; count: number; posts: CollectionEntry<'posts'>[] }[]> {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, CollectionEntry<'posts'>[]>();
  
  posts.forEach(post => {
    const tags = post.data.tags || [];
    tags.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    });
  });

  return Array.from(tagMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts,
  })).sort((a, b) => b.count - a.count);
}

//纯时间排序
export async function getDateSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * @deprecated 分类获取文章，已经弃用
 */
export async function getPostsByCategory(category: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter(post => 
    post.data.categories?.includes(category) || 
    (category === '未分类' && (!post.data.categories || post.data.categories.length === 0))
  );
}

/**
 * @deprecated 标签获取文章，已经弃用
 */
export async function getPostsByTag(tag: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter(post => post.data.tags?.includes(tag));
}