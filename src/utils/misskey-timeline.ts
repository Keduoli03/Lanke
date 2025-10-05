// 时间线初始化（抽离）
export interface MisskeyUser { id: string; username?: string; name?: string; avatarUrl?: string }
export interface MisskeyFile { url: string }
export interface MisskeyNote {
  id: string;
  userId: string;
  createdAt: string;
  text?: string;
  files?: MisskeyFile[];
  renoteId?: string;
  replyId?: string;
  user?: MisskeyUser;
}

export interface MisskeyOptions { instance: string; userId: string; limit?: number }

export async function initMisskeyTimeline(containerId: string, opts: MisskeyOptions): Promise<void> {
  const container = document.getElementById(containerId) as HTMLDivElement | null;
  if (!container) return;
  if (container.dataset.init === '1') return; // 避免重复
  container.dataset.init = '1';

  const MISSKEY_INSTANCE = opts.instance;
  const USER_ID = opts.userId;
  const LIMIT = opts.limit ?? 20;

  const absUrl = (p: string | null | undefined): string => {
    if (!p) return '';
    try { return new URL(p, MISSKEY_INSTANCE).href; } catch { return p; }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const pad = (num: number) => num.toString().padStart(2, '0');
    if (diffDays === 0) return `今天 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (diffDays === 1) return `昨天 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (diffDays < 365) return `${pad(date.getMonth() + 1)}月${pad(date.getDate())}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
  };

  const getNoteDetailUrl = (noteId: string): string => `${MISSKEY_INSTANCE}/notes/${noteId}`;

  const fetchReplies = async (noteId: string, limit: number = 5): Promise<MisskeyNote[]> => {
    try {
      const res = await fetch(`${MISSKEY_INSTANCE}/api/notes/children`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteId, limit })
      });
      if (!res.ok) return [];
      return await res.json();
    } catch { return [] }
  };

  const fetchQuotedNote = async (noteId: string): Promise<MisskeyNote | null> => {
    try {
      const res = await fetch(`${MISSKEY_INSTANCE}/api/notes/show`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteId })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null }
  };

  const renderQuotedNote = async (quotedNoteId: string | undefined): Promise<string> => {
    if (!quotedNoteId) return '';
    const quotedNote = await fetchQuotedNote(quotedNoteId);
    if (!quotedNote) return '';
    const quotedUrl = getNoteDetailUrl(quotedNoteId);
    const quotedTime = formatDate(quotedNote.createdAt);
    return `
      <div class="quoted-note">
        <div class="quoted-header">
          <img src="${absUrl(quotedNote.user?.avatarUrl)}" class="quoted-avatar" alt="${quotedNote.user?.name || ''}的头像" loading="lazy" />
          <div class="quoted-author-info">
            <span class="quoted-author">${quotedNote.user?.name || quotedNote.user?.username || ''}</span>
            <span class="quoted-time">${quotedTime}</span>
          </div>
        </div>
        <div class="quoted-content">${quotedNote.text || '[无内容]'}</div>
        ${quotedNote.files && quotedNote.files.length > 0 ? `<div class="quoted-media"><img src="${absUrl(quotedNote.files[0].url)}" alt="引用内容图片" loading="lazy" /></div>` : ''}
        <a href="${quotedUrl}" target="_blank" class="quoted-link" rel="noopener noreferrer">查看原文</a>
      </div>
    `;
  };

  // 初始加载态（Twind）
  container.innerHTML = `
    <div class="flex items-center justify-center py-8">
      <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="ml-3 text-sm text-gray-600 dark:text-gray-300">加载中...</p>
    </div>
  `;

  try {
    const userRes = await fetch(`${MISSKEY_INSTANCE}/api/users/show`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: USER_ID })
    });
    const user: MisskeyUser = await userRes.json();
    const currentUserId: string = user.id;

    const timelineRes = await fetch(`${MISSKEY_INSTANCE}/api/users/notes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: USER_ID, limit: LIMIT, withReplies: true })
    });
    const notes: MisskeyNote[] = await timelineRes.json();

    const filteredNotes = notes.filter((note) => !note.replyId || note.userId !== currentUserId);
    container.innerHTML = '';
    if (filteredNotes.length === 0) {
      container.innerHTML = '<div class="py-10 text-center text-sm text-gray-500 dark:text-gray-400">暂无内容</div>';
      return;
    }

    for (const note of filteredNotes) {
      const postCard = document.createElement('div');
      postCard.className = 'card-base relative px-5 py-4 rounded-xl shadow-md mb-6';
      const formattedTime = formatDate(note.createdAt);
      const isOwnPost = note.userId === currentUserId;
      const noteUrl = getNoteDetailUrl(note.id);
      const quotedHtml = note.renoteId && note.renoteId !== note.id ? await renderQuotedNote(note.renoteId) : '';

      // 头部仅保留时间，不再放“详情”
      postCard.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <img src="${absUrl(note.user?.avatarUrl || user.avatarUrl)}" class="w-9 h-9 rounded-full" alt="${note.user?.name || user.name}的头像" loading="lazy" />
          <span class="font-semibold text-gray-800 dark:text-gray-100">
            <a class="hover:underline" href="${absUrl(`/@${note.user?.username || user.username}`)}" target="_blank" rel="noopener noreferrer">${note.user?.name || note.user?.username || user.name}</a>
          </span>
          <div class="ml-auto text-sm text-gray-500 dark:text-gray-400">
            <a class="hover:underline" href="${noteUrl}" target="_blank" rel="noopener noreferrer">${formattedTime}</a>
          </div>
        </div>
        <div class="prose prose-sm max-w-none break-words">${note.text || ''}</div>
        ${quotedHtml}
        ${note.files && note.files.length > 0 ? `<div class="mt-3 rounded-lg overflow-hidden"><a href="${noteUrl}" target="_blank" rel="noopener noreferrer"><img class="w-full object-cover" src="${absUrl(note.files[0].url)}" alt="附件图片" loading="lazy" /></a></div>` : ''}
        <div class="mt-4 space-y-3" data-note-id="${note.id}"></div>
        <div class="absolute bottom-3 right-4">
          <a href="${noteUrl}" target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline">详情</a>
        </div>
      `;

      const repliesWrap = postCard.querySelector<HTMLDivElement>('.replies');
      if (isOwnPost && repliesWrap) {
        const replies = await fetchReplies(note.id, 5);
        if (Array.isArray(replies) && replies.length > 0) {
          const replyCount = document.createElement('div');
          replyCount.className = 'reply-count';
          replyCount.textContent = `共 ${replies.length} 条回复`;
          repliesWrap.appendChild(replyCount);
          replies.forEach((r) => {
            const item = document.createElement('div');
            item.className = 'reply';
            const replyTime = formatDate(r.createdAt);
            const rUser = r.user || ({} as MisskeyUser);
            const replyUrl = getNoteDetailUrl(r.id);
            item.innerHTML = `
              <img src="${absUrl(rUser.avatarUrl)}" class="w-7 h-7 rounded-full" alt="${rUser.name || rUser.username || '用户'}头像" loading="lazy" />
              <div class="flex-1">
                <div class="font-medium text-sm">
                  <a class="hover:underline" href="${absUrl(`/@${rUser.username}`)}" target="_blank" rel="noopener noreferrer">${rUser.name || rUser.username || '用户'}</a>
                  <span class="ml-2 text-xs text-gray-500 dark:text-gray-400"><a class="hover:underline" href="${replyUrl}" target="_blank" rel="noopener noreferrer">${replyTime}</a></span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-200 break-words">${r.text || ''}</div>
              </div>
            `;
            repliesWrap.appendChild(item);
          });
        } else {
          repliesWrap.style.display = 'none';
        }
      } else if (repliesWrap) {
        repliesWrap.style.display = 'none';
      }

      container.appendChild(postCard);
    }
  } catch (err) {
    container.innerHTML = `<div class="py-8 text-center text-sm text-red-600 dark:text-red-400">加载失败</div>`;
    // 可选：上报错误日志
    console.error(err);
  }
}