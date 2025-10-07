import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export type LightboxOptions = {
  gallery: HTMLElement | string;
  children: string;
  labels?: { close?: string };
  autoPreventDefault?: boolean;
  autoWriteSize?: boolean;
};

let instance: PhotoSwipeLightbox | null = null;
let lastGalleryEl: HTMLElement | null = null;
let lastClickHandler: ((e: Event) => void) | null = null;
let lastMO: MutationObserver | null = null;
let lastOpts: LightboxOptions | null = null; // 新增：存储最近一次的创建参数

export function createLightbox(opts: LightboxOptions) {
  // 清理旧实例与事件监听
  if (instance) {
    instance.destroy();
    instance = null;
  }
  if (lastGalleryEl && lastClickHandler) {
    lastGalleryEl.removeEventListener('click', lastClickHandler, true);
    lastClickHandler = null;
  }
  if (lastMO) {
    lastMO.disconnect();
    lastMO = null;
  }

  const galleryEl = (typeof opts.gallery === 'string'
    ? document.querySelector(opts.gallery)
    : opts.gallery) as HTMLElement | null;

  if (!galleryEl) {
    console.warn('[createLightbox] 未找到gallery元素:', opts.gallery);
    return null;
  }

  lastOpts = opts; // 记录最近的选项，用于首次点击兜底初始化
  const childrenSelector = opts.children;

  const ensureImageSize = (link: HTMLAnchorElement) => {
    const img = link.querySelector('img');
    if (!img) return;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    if (naturalWidth && naturalHeight) {
      if (!link.getAttribute('data-pswp-width')) link.setAttribute('data-pswp-width', String(naturalWidth));
      if (!link.getAttribute('data-pswp-height')) link.setAttribute('data-pswp-height', String(naturalHeight));
    } else if (img.width && img.height) {
      if (!link.getAttribute('data-pswp-width')) link.setAttribute('data-pswp-width', String(img.width));
      if (!link.getAttribute('data-pswp-height')) link.setAttribute('data-pswp-height', String(img.height));
    }
    if (!link.getAttribute('data-pswp-src')) {
      const href = link.getAttribute('href') || '';
      link.setAttribute('data-pswp-src', href);
    }
  };

  // 新增：异步获取尺寸，兼容懒加载与占位图
  const ensureImageSizeAsync = async (link: HTMLAnchorElement) => {
    const hasW = link.getAttribute('data-pswp-width');
    const hasH = link.getAttribute('data-pswp-height');
    if (hasW && hasH) {
      if (!link.getAttribute('data-pswp-src')) link.setAttribute('data-pswp-src', link.getAttribute('href') || '');
      return;
    }

    const imgEl = link.querySelector('img');
    let w = 0, h = 0;

    if (imgEl && imgEl.naturalWidth && imgEl.naturalHeight) {
      w = imgEl.naturalWidth; h = imgEl.naturalHeight;
    } else {
      const src = (imgEl?.currentSrc || imgEl?.src || link.getAttribute('href') || '').trim();
      if (src) {
        const preImg = new Image();
        preImg.decoding = 'async';
        preImg.loading = 'eager';
        preImg.src = src;
        await new Promise<void>((resolve) => {
          if (preImg.complete && preImg.naturalWidth) { resolve(); return; }
          preImg.onload = () => resolve();
          preImg.onerror = () => resolve(); // 不阻塞点击流程
        });
        w = preImg.naturalWidth; h = preImg.naturalHeight;
      }
    }

    if ((!w || !h) && imgEl) {
      w = imgEl.width || w;
      h = imgEl.height || h;
    }

    if (w && h) {
      link.setAttribute('data-pswp-width', String(w));
      link.setAttribute('data-pswp-height', String(h));
    }
    if (!link.getAttribute('data-pswp-src')) link.setAttribute('data-pswp-src', link.getAttribute('href') || '');
  };

  // 修改：点击处理为异步，确保尺寸写入后再打开
  const handleClick = async (e: Event) => {
    const target = e.target as Element | null;
    const link = target?.closest(childrenSelector) as HTMLAnchorElement | null;
    if (link) {
      if (opts.autoWriteSize ?? true) await ensureImageSizeAsync(link);
      e.preventDefault();
      e.stopPropagation();
      if (!instance && lastOpts) {
        instance = createLightbox(lastOpts);
      }
      if (instance) {
        const links = Array.from(galleryEl.querySelectorAll(childrenSelector));
        const index = links.indexOf(link);
        if (index !== -1) instance.loadAndOpen(index);
      }
    }
  };

  if (opts.autoPreventDefault ?? true) {
    galleryEl.addEventListener('click', handleClick, true);
    lastGalleryEl = galleryEl;
    lastClickHandler = handleClick;
  }

  if (opts.autoWriteSize ?? true) {
    const observer = new MutationObserver(() => {
      galleryEl.querySelectorAll(childrenSelector).forEach((el) => {
        if (el instanceof HTMLAnchorElement) ensureImageSize(el);
      });
    });
    observer.observe(galleryEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['src','width','height'] });
    lastMO = observer;
    galleryEl.querySelectorAll(childrenSelector).forEach((el) => {
      if (el instanceof HTMLAnchorElement) ensureImageSize(el);
    });
  }

  instance = new PhotoSwipeLightbox({
    gallery: galleryEl,
    children: childrenSelector,
    pswpModule: () => import('photoswipe'),
  });

  instance.on('afterInit', () => {
    const label = opts.labels?.close ?? '关闭';
    const closeBtn = instance?.pswp?.element?.querySelector<HTMLButtonElement>('.pswp__button--close');
    if (closeBtn) {
      closeBtn.setAttribute('title', label);
      closeBtn.setAttribute('aria-label', label);
    }
  });

  instance.init();
  return instance;
}

// 暴露到全局
declare global {
  interface Window {
    PSLightbox?: {
      create: typeof createLightbox;
      destroy: () => void;
    };
  }
}

(window).PSLightbox = {
  create: createLightbox,
  destroy: () => {
    instance?.destroy();
    instance = null;
    if (lastGalleryEl && lastClickHandler) {
      lastGalleryEl.removeEventListener('click', lastClickHandler, true);
      lastClickHandler = null;
    }
    if (lastMO) {
      lastMO.disconnect();
      lastMO = null;
    }
  }
};
