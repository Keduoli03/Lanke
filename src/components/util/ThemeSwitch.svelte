<script lang="ts">
  import { onMount } from 'svelte';
  import { getHue, setHue, getDefaultHue } from '../../utils/setting-utils';

  export let isMobile: boolean = false;

  let hue: number = 0;
  let showPanel: boolean = false;
  let panelRef: HTMLElement | null = null;
  let buttonRef: HTMLElement | null = null;

  onMount(() => {
    hue = getHue();
    
    const handleClickOutside = (e: MouseEvent) => {
      if (showPanel && panelRef && buttonRef && !panelRef.contains(e.target as Node) && !buttonRef.contains(e.target as Node)) {
        showPanel = false;
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  const handleHueChange = (e: Event) => {
    const newHue = parseInt((e.target as HTMLInputElement).value);
    hue = newHue;
    setHue(newHue);
  };

  const resetToDefault = () => {
    const defaultHue = getDefaultHue();
    hue = defaultHue;
    setHue(defaultHue);
  };

  const togglePanel = () => {
    showPanel = !showPanel;
  };
</script>

<div>
  <!-- 主题色切换按钮 -->
  <button 
    aria-label="主题色设置"
    class="flex items-center justify-center rounded-lg transition-colors active:scale-90 text-[var(--deep-text)] hover:bg-[var(--btn-regular-bg-hover)] {isMobile ? 'h-9 w-9' : 'h-8 w-8'}"
    on:click={togglePanel}
    bind:this={buttonRef}
  >
    <slot name="palette-icon" />
  </button>
  
  <!-- 主题色面板 -->
  <div 
    class="bg-[var(--float-panel-bg)] rounded-[var(--radius-large)] shadow-xl transition-all duration-200 z-50 absolute {showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'} {isMobile ? '-right-8 top-full mt-2 w-52 p-3' : 'left-full bottom-0 ml-2 w-80 p-4'}"
    bind:this={panelRef}
  >
    <div class="flex flex-row gap-2 items-center justify-between mb-3">
      <div class="flex gap-2 font-bold transition relative {isMobile ? 'text-sm ml-2' : 'text-lg ml-3'}">
        主题色
        <span class="absolute bg-[var(--primary)] w-1 h-4 rounded-md {isMobile ? '-left-2 top-[0.1rem]' : '-left-3 top-[0.33rem]'}"></span>
        
        <button 
          aria-label="重置为默认主题色" 
          class="flex items-center justify-center active:scale-90 rounded-md bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] {isMobile ? 'w-5 h-5' : 'w-7 h-7'}"
          on:click={resetToDefault}
        >
          <div class="text-[var(--btn-content)]">
            <slot name="reset-icon" />
          </div>
        </button>
      </div>
      
      <div 
        id="hueValue" 
        class="transition bg-[var(--btn-regular-bg)] rounded-md flex justify-center font-bold items-center text-[var(--btn-content)] {isMobile ? 'w-7 h-5 text-xs' : 'w-10 h-7 text-sm'}"
      >
        <span>{hue}</span>
      </div>
    </div>
    
    <div class="w-full rounded select-none px-1 {isMobile ? 'h-5' : 'h-6'}">
      <input 
        aria-label="调整主题色" 
        type="range" 
        min="0" 
        max="360" 
        step="5"
        class="w-full color-slider {isMobile ? 'h-5' : 'h-6'}"
        value={hue}
        on:input={handleHueChange}
      />
    </div>
  </div>
</div>

<style>
  /* 彩虹色滑块样式 */
  .color-slider {
    -webkit-appearance: none;
    appearance: none;
    background-image: var(--color-selection-bar);
    transition: background-image 0.15s ease-in-out;
    border-radius: 0.5rem;
  }
  
  /* 滑块拖拽按钮样式 */
  .color-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 0.875rem;
    width: 0.875rem;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .color-slider::-webkit-slider-thumb:hover {
    background: rgba(255, 255, 255, 0.8);
  }
  
  .color-slider::-webkit-slider-thumb:active {
    background: rgba(255, 255, 255, 0.6);
  }
  
  /* Firefox样式 */
  .color-slider::-moz-range-thumb {
    -moz-appearance: none;
    appearance: none;
    height: 0.875rem;
    width: 0.4rem;
    border-radius: 0.125rem;
    border-width: 0;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: none;
    cursor: pointer;
  }
  
  .color-slider::-moz-range-thumb:hover {
    background: rgba(255, 255, 255, 0.8);
  }
  
  .color-slider::-moz-range-thumb:active {
    background: rgba(255, 255, 255, 0.6);
  }
</style>