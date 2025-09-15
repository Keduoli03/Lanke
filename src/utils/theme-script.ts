// @ts-nocheck
/**
 * 这是一个用于防止主题闪烁的内联脚本。
 * 它会读取 localStorage 中的主题和色调设置，并在页面渲染前应用它们。
 * 它还监听 Astro 的视图过渡事件，以确保在客户端路由切换后主题保持一致。
 */
function applyThemeAndHue() {
  // --- 应用亮暗模式 ---
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  // --- 应用主题色 (Hue) ---
  const hue = localStorage.getItem("theme-hue") || 210; // 210 是默认的蓝色
  document.documentElement.style.setProperty("--primary-hue", hue.toString());
}

// 首次加载时应用主题
applyThemeAndHue();

// 在 Astro 视图过渡（客户端路由）后再次应用主题
document.addEventListener('astro:after-swap', applyThemeAndHue);