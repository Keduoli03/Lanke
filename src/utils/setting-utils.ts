// @ts-nocheck
import { siteConfig, expressiveCodeConfig } from "../config";

// --- 色调 (Hue) 管理 ---

/**
 * 获取站点配置中定义的默认色调值。
 * @returns {number} 默认色调值。
 */
export function getDefaultHue(): number {
  return siteConfig.themeColor.hue;
}

/**
 * 从 localStorage 获取当前色调值，如果不存在则返回默认值。
 * @returns {number} 当前或默认的色调值。
 */
export function getHue(): number {
  const hue = localStorage.getItem("theme-hue");
  return hue ? parseInt(hue) : getDefaultHue();
}

/**
 * 设置新的色调值，并将其应用到文档根元素的 CSS 变量和 localStorage。
 * @param {number} hue - 新的色调值 (0-360)。
 */
export function setHue(hue: number): void {
  document.documentElement.style.setProperty("--primary-hue", hue.toString());
  localStorage.setItem("theme-hue", hue.toString());
}


// --- 亮暗模式 (Theme) 管理 ---

/**
 * 获取当前主题（'light' 或 'dark'）。
 * 优先从 localStorage 读取，其次根据系统偏好设置。
 * @returns {'light' | 'dark'} 当前主题。
 */
export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'; // 服务端渲染时默认返回 light
  
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 设置主题，并更新文档 class, data-theme 和 localStorage。
 * @param {'light' | 'dark'} theme - 要设置的主题。
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  
  // 为 TailwindCSS 更新 class
  document.documentElement.classList.toggle('dark', theme === 'dark');

  // 为 expressive-code 更新 data-theme 属性
  if (theme === 'dark') {
    document.documentElement.setAttribute("data-theme", expressiveCodeConfig.themes[1]);
  } else {
    document.documentElement.setAttribute("data-theme", expressiveCodeConfig.themes[0]);
  }
}

/**
 * 切换当前主题。
 */
export function toggleTheme(event?: MouseEvent): void {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  if (!document.startViewTransition) {
    setTheme(newTheme);
    return;
  }

  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  document.documentElement.style.setProperty('--x', `${x}px`);
  document.documentElement.style.setProperty('--y', `${y}px`);

  // 移除上一次的临时 class (以防万一)
  document.documentElement.classList.remove('to-dark', 'to-light');
  // 添加表示切换方向的临时 class
  document.documentElement.classList.add(`to-${newTheme}`);

  const transition = document.startViewTransition(() => {
    setTheme(newTheme);
  });

  transition.finished.then(() => {
    // 动画结束后移除临时 class
    document.documentElement.classList.remove(`to-${newTheme}`);
  });
}

/**
 * 初始化主题和色调。
 * 在客户端加载时调用，以确保正确应用已保存的设置。
 */
export function applyThemeAndHue(): void {
  if (typeof window === 'undefined') return;
  
  // 应用亮暗模式和 data-theme
  const theme = getTheme();
  setTheme(theme);

  // 应用主题色
  const hue = getHue();
  document.documentElement.style.setProperty("--primary-hue", hue.toString());
}