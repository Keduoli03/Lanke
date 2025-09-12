
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  return allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}