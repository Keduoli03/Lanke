import { writable } from 'svelte/store';

// 这个 store 将在所有组件间共享当前的 'light' 或 'dark' 主题状态。
// 它在服务器端默认初始化为 'light'，但在客户端会立即被实际主题覆盖。
// 用来解决手机和PC导航栏同时存在产生的冲突
export const theme = writable<'light' | 'dark'>('light');