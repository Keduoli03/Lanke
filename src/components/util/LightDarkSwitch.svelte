<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, toggleTheme } from '../../utils/setting-utils';

  let theme: 'light' | 'dark' = 'light';

  onMount(() => {
    theme = getTheme();
    
    const handleSystemThemeChange = () => {
        theme = getTheme();
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  });

  function handleToggle() {
    toggleTheme();
    theme = theme === 'light' ? 'dark' : 'light';
  }
</script>

<button 
  on:click={handleToggle} 
  class="flex items-center justify-center rounded-lg h-8 w-8 hover:bg-[var(--btn-regular-bg-hover)] transition-colors" 
  aria-label="切换亮暗模式"
  title="切换亮暗模式"
>
  {#if theme === 'light'}
    <slot name="dark-icon" />
  {:else}
    <slot name="light-icon" />
  {/if}
</button>