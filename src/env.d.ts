/// <reference types="astro/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

interface Window {
  swup: import('swup').default;
  
  // Theme management functions
  setNoSidebarTransition: (value: boolean) => void;
  freezeRootVars: () => void;
  freezeSidebarVars: () => void;
  applyThemeAndHue: () => void;
  applySidebarOpen: () => void;
  unfreezeRootVars: () => void;
  unfreezeSidebarVars: () => void;
}
