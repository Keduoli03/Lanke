/**
 * 构造一个以 BASE_URL 为前缀的完整 URL，并确保其以斜杠结尾。
 * @param path 相对路径，例如 "/about"
 * @returns {string} 完整的、规范化的 URL
 */
export function url(path: string = "/"): string {
  const constructedPath = import.meta.env.BASE_URL + (path.startsWith('/') ? path.substring(1) : path);
  return normalizeUrl(constructedPath);
}

/**
 * 获取相对于站点根目录的 URL
 */
export function getRelativeLocaleUrl(locale: string, path: string): string {
  // 移除开头的斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 如果是默认语言，直接返回路径
  if (locale === 'zh' || !locale) {
    return normalizeUrl(`/${cleanPath}`);
  }
  
  return normalizeUrl(`/${locale}/${cleanPath}`);
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
 * 规范化 URL 路径，确保以斜杠结尾
 * @param {string} url - 需要规范化的 URL
 * @returns {string} - 规范化后的 URL
 */
export function normalizeUrl(url: string): string {
  // 分离路径、查询参数和哈希
  const hashIndex = url.indexOf('#');
  const hash = hashIndex !== -1 ? url.substring(hashIndex) : '';
  const urlWithoutHash = hashIndex !== -1 ? url.substring(0, hashIndex) : url;

  const queryIndex = urlWithoutHash.indexOf('?');
  const query = queryIndex !== -1 ? urlWithoutHash.substring(queryIndex) : '';
  const path = queryIndex !== -1 ? urlWithoutHash.substring(0, queryIndex) : urlWithoutHash;

  // 如果路径不是根路径“/”且不以“/”结尾，则添加它
  if (path.length > 1 && !path.endsWith('/')) {
    return `${path}/${query}${hash}`;
  }
  
  // 否则，原样返回
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