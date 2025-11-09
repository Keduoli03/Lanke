import { visit } from 'unist-util-visit';

export default function rehypeImageLightbox() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || node.tagName !== 'img') return;

      const props = node.properties || {};
      const src = String(props.src || '');
      const alt = String(props.alt || '');
      const title = String(props.title || '');

      // 如果已经有 <a> 包裹，只增强属性，避免覆盖原本的 href
      if (parent.tagName === 'a') {
        parent.properties = parent.properties || {};
        const cls = parent.properties.className || [];
        parent.properties.className = Array.isArray(cls) ? [...new Set([...cls, 'md-lightbox'])] : ['md-lightbox'];
        // 不再覆盖 href，保留原链接
        parent.properties['data-lightbox'] = parent.properties['data-lightbox'] || src;
        parent.properties['data-alt'] = alt;
        parent.properties['data-title'] = title;
        // 禁用 Astro 预取，避免视口预取造成 404
        parent.properties['data-astro-prefetch'] = 'false';
        // 可访问性增强
        parent.properties.role = parent.properties.role || 'button';
        parent.properties.tabIndex = parent.properties.tabIndex ?? 0;
        return;
      }

      // 没有外层链接时，创建一个用于灯箱的 <a>
      const anchor = {
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['md-lightbox'],
          href: '#', // 避免预取错误，同时点击由脚本接管
          'data-lightbox': src,
          'data-alt': alt,
          'data-title': title,
          // 禁用 Astro 预取
          'data-astro-prefetch': 'false',
          // 可访问性
          role: 'button',
          tabIndex: 0,
        },
        children: [node],
      };

      parent.children[index] = anchor;
    });
  };
}