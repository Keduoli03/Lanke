//获取、修改、保存主题
import { siteConfig } from "../config";

export function getDefaultHue(): number {
  return siteConfig.themeColor.hue;
}

export function getHue(): number {
  const hue = localStorage.getItem("theme-hue");
  return hue ? parseInt(hue) : getDefaultHue();
}

export function setHue(hue: number): void {
  document.documentElement.style.setProperty("--primary-hue", hue.toString());
  localStorage.setItem("theme-hue", hue.toString());
}

/**
 * 主题相关的工具函数
 */

/**
 * 获取当前主题
 */
export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 设置主题
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/**
 * 切换主题
 */
export function toggleTheme(): void {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * 初始化主题
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  document.documentElement.classList.toggle('dark', theme === 'dark');
}