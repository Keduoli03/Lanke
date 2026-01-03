import { writable } from 'svelte/store';

// 主题状态：'light' | 'dark'
// 服务端默认初始化为 'light'，客户端挂载时需立即同步真实状态
export const theme = writable<'light' | 'dark'>('light');

// 主题色调 (Hue)：0-360
// 用于动态调整全局主色调
export const hue = writable<number>(210);

// 调色板面板的展开/收起状态
export const isPaletteOpen = writable<boolean>(false);

// 侧边栏展开/收起状态 (移动端/响应式)
export const isSidebarOpen = writable<boolean>(false);
