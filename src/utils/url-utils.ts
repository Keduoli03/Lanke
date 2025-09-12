export function url(path: string = "/"): string {
  return import.meta.env.BASE_URL + path.substring(1);
}

/**
 * 获取相对于站点根目录的 URL
 */
export function getRelativeLocaleUrl(locale: string, path: string): string {
  // 移除开头的斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 如果是默认语言，直接返回路径
  if (locale === 'zh' || !locale) {
    return `/${cleanPath}`;
  }
  
  return `/${locale}/${cleanPath}`;
}

/**
 * 检查 URL 是否为外部链接
 */
export function isExternalUrl(url: string): boolean {
  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * 规范化 URL 路径
 */
export function normalizeUrl(url: string): string {
  // 移除末尾的斜杠，除非是根路径
  if (url.length > 1 && url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
}

/**
 * 检查当前路径是否匹配给定的 URL
 */
export function isCurrentPath(currentPath: string, targetUrl: string): boolean {
  const normalizedCurrent = normalizeUrl(currentPath);
  const normalizedTarget = normalizeUrl(targetUrl);
  
  return normalizedCurrent === normalizedTarget;
}