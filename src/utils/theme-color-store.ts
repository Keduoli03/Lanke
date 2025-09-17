import { writable } from 'svelte/store';

// 用于在所有组件间共享当前主题色的状态
export const themeColor = writable<string>('default');

// 用于同步调色板的展开/收起状态
export const isPaletteOpen = writable<boolean>(false);