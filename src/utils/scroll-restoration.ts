// --- Astro 视图过渡（View Transitions）滚动恢复最终方案 ---

const SCROLL_POSITION_PREFIX = 'scroll-position-';

/**
 * 保存当前页面的滚动位置。
 * Astro 的 'before-swap' 事件是执行此操作的最佳时机。
 */
function saveScrollPosition(): void {
	sessionStorage.setItem(SCROLL_POSITION_PREFIX + window.location.pathname, window.scrollY.toString());
}

/**
 * 恢复滚动位置。
 * Astro 的 'page-load' 事件确保在页面内容更新后执行。
 */
function restoreScrollPosition(): void {
	const path = window.location.pathname;
	const savedPosition = sessionStorage.getItem(SCROLL_POSITION_PREFIX + path);

	if (savedPosition) {
		// 直接滚动，因为 Astro 的视图过渡机制会处理好视觉效果。
		// 我们不再需要手动隐藏/显示页面。
		window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'auto' });
	}
}

// --- 核心：只监听 Astro 提供的事件 ---

// 1. 在 Astro 页面切换完成时恢复滚动。
//    'astro:page-load' 会在初始加载和每次客户端导航后触发。
document.addEventListener('astro:page-load', restoreScrollPosition);

// 2. 在 Astro 页面切换开始前保存滚动。
document.addEventListener('astro:before-swap', saveScrollPosition);

// 3. 额外处理浏览器刷新和后退/前进按钮。
//    'beforeunload' 覆盖刷新操作。
window.addEventListener('beforeunload', saveScrollPosition);
