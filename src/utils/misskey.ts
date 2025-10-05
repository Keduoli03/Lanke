export async function fetchLocalTimeline(base: string, token?: string) {
  const url = `${base}/api/notes/local-timeline`;
  const body: any = { limit: 50, withReplies: false, withRenotes: false };
  if (token) body.i = token; // 某些实例需要令牌
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return [];
  return await res.json();
}