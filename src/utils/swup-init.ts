import Swup from 'swup';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';

// 防止重复初始化
if (window.swup) {
    console.log('Swup already initialized');
} else {
    // 初始化 Swup
    const swup = new Swup({
      containers: ['#swup'],
      cache: true,
      plugins: [
        new SwupHeadPlugin(),
        new SwupPreloadPlugin(),
        new SwupScriptsPlugin({
          head: true,
          body: true
        })
      ]
    });

    // 将 swup 挂载到 window
    window.swup = swup;

    // ----------------------------------------------------------------------
    // 辅助函数
    // ----------------------------------------------------------------------
    function updateSidebarActiveState() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('#sidebar a.nav-link');
        
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http')) return;
            
            let isActive = false;
            if (href === '/' || href === '') {
                isActive = currentPath === '/';
            } else {
                isActive = currentPath.startsWith(href);
            }
            
            if (isActive) {
                link.classList.add('is-active');
                // 确保父级li也是active状态如果有的话，但这里Sidebar结构比较扁平
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 生命周期钩子 - 主题与 UI 状态管理
    // ----------------------------------------------------------------------

    swup.hooks.on('visit:start', () => {
        document.documentElement.classList.add('is-changing');
        
        // 触发 Astro 兼容事件 (before-swap)
        document.dispatchEvent(new Event('astro:before-swap'));

        // 冻结主题变量，防止过渡期间闪烁
        if (window.setNoSidebarTransition) window.setNoSidebarTransition(true);
        if (window.freezeRootVars) window.freezeRootVars();
        if (window.freezeSidebarVars) window.freezeSidebarVars();
    });

    swup.hooks.on('content:replace', () => {
        // 更新侧边栏高亮
        updateSidebarActiveState();

        // 恢复主题状态
        if (window.applyThemeAndHue) window.applyThemeAndHue();
        if (window.applySidebarOpen) window.applySidebarOpen();
        if (window.unfreezeRootVars) window.unfreezeRootVars();
        if (window.unfreezeSidebarVars) window.unfreezeSidebarVars();
        
        // 保持侧边栏过渡禁用一小段时间
        if (window.setNoSidebarTransition) window.setNoSidebarTransition(true);
        setTimeout(() => {
            if (window.setNoSidebarTransition) window.setNoSidebarTransition(false);
        }, 100);

        // 触发 Astro 兼容事件，让现有组件（如 Lightbox, Live2D）重新初始化
        document.dispatchEvent(new Event('astro:page-load'));
        document.dispatchEvent(new Event('astro:after-swap'));
    });

    swup.hooks.on('visit:end', () => {
        document.documentElement.classList.remove('is-changing');
    });
}

