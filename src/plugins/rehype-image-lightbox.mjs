import { visit } from 'unist-util-visit';

export default function rehypeImageLightbox() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || node.tagName !== 'img') return;

      const props = node.properties || {};
      const src = String(props.src || '');
      const alt = String(props.alt || '');
      const title = String(props.title || '');

      // 如果已经有 <a> 包裹，增强它的属性即可
      if (parent.tagName === 'a') {
        parent.properties = parent.properties || {};
        const cls = parent.properties.className || [];
        parent.properties.className = Array.isArray(cls) ? [...new Set([...cls, 'md-lightbox'])] : ['md-lightbox'];
        parent.properties.href = parent.properties.href || src;
        parent.properties['data-lightbox'] = parent.properties['data-lightbox'] || src;
        parent.properties['data-alt'] = alt;
        parent.properties['data-title'] = title;
        return;
      }

      // 用 <a> 包裹当前 <img>
      const anchor = {
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['md-lightbox'],
          href: src,
          'data-lightbox': src,
          'data-alt': alt,
          'data-title': title,
        },
        children: [node],
      };

      parent.children[index] = anchor;
    });
  };
}