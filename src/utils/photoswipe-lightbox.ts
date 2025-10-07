
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export type LightboxOptions = {
  gallery: HTMLElement | string;
  children: string;
  labels?: { close?: string };
};

let instance: PhotoSwipeLightbox | null = null;

export function createLightbox(opts: LightboxOptions) {
  if (instance) {
    instance.destroy();
    instance = null;
  }
  instance = new PhotoSwipeLightbox({
    gallery: opts.gallery,
    children: opts.children,
    pswpModule: () => import('photoswipe'),
  });

  instance.on('afterInit', () => {
    const label = opts.labels?.close ?? '关闭';
    const btn = instance?.pswp?.element?.querySelector<HTMLButtonElement>('.pswp__button--close');
    if (btn) {
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
    }
  });

  instance.init();
  return instance;
}

// 暴露到全局，便于在 .astro 中调用
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
  destroy: () => { instance?.destroy(); instance = null; }
};
