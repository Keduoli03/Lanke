<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, toggleTheme } from '../../utils/setting-utils';
  import { theme } from '../../utils/theme-store'; // 1. 导入全局 store

  onMount(() => {
    // 2. 在客户端挂载时，获取真实主题并更新全局 store
    theme.set(getTheme());
    
    // 监听系统主题变化，并同步到全局 store
    const handleSystemThemeChange = () => {
        theme.set(getTheme());
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  });

  async function handleToggle(event: MouseEvent) {
    const newTheme = await toggleTheme(event);
    theme.set(newTheme);
  }
</script>

<button 
  on:click={handleToggle} 
  class="{$$props.class} flex items-center justify-center rounded-lg h-8 w-8 hover:bg-[var(--btn-regular-bg-hover)] transition-colors" 
  aria-label="切换亮暗模式"
  title="切换亮暗模式"
>
  <!-- 4. 使用 '$' 前缀订阅 store 的值 -->
  {#if $theme === 'light'}
    <div class="text-gray-800">
      <slot name="dark-icon" />
    </div>
  {:else}
    <div class="text-gray-200">
      <slot name="light-icon" />
    </div>
  {/if}
</button>