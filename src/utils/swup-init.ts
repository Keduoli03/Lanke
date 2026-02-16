import Swup from 'swup';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';

const initSwup = () => {
    if (window.swup) {
        return;
    }
    const container = document.querySelector('#swup');
    if (!container) {
        return;
    }
    const swup = new Swup({
      containers: ['#swup'],
      cache: true,
      plugins: [
        new SwupHeadPlugin({
          persistAssets: true
        }),
        new SwupPreloadPlugin(),
        new SwupScriptsPlugin({
          head: true,
          body: true
        })
      ]
    });

    window.swup = swup;

    const runPageInits = () => {
        if (window.__initSidebar) window.__initSidebar();
        if (window.__initMobileNav) window.__initMobileNav();
    };

    swup.hooks.on('visit:start', () => {
        document.documentElement.classList.add('is-changing');
        
        document.dispatchEvent(new Event('astro:before-swap'));

        if (window.setNoSidebarTransition) window.setNoSidebarTransition(true);
        if (window.freezeRootVars) window.freezeRootVars();
        if (window.freezeSidebarVars) window.freezeSidebarVars();
    });

    swup.hooks.on('content:replace', () => {
        if (window.applyThemeAndHue) window.applyThemeAndHue();
        if (window.unfreezeRootVars) window.unfreezeRootVars();
        if (window.unfreezeSidebarVars) window.unfreezeSidebarVars();
        
        if (window.setNoSidebarTransition) window.setNoSidebarTransition(true);
        setTimeout(() => {
            if (window.setNoSidebarTransition) window.setNoSidebarTransition(false);
        }, 100);

        runPageInits();
        document.dispatchEvent(new Event('astro:page-load'));
        document.dispatchEvent(new Event('astro:after-swap'));
    });

    swup.hooks.on('visit:end', () => {
        document.documentElement.classList.remove('is-changing');
    });

    const triggerLoad = () => {
        runPageInits();
        document.dispatchEvent(new Event('astro:page-load'));
    };
    if (document.readyState === 'complete') {
        triggerLoad();
    } else {
        window.addEventListener('load', triggerLoad);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwup);
} else {
    initSwup();
}
