import { visit } from 'unist-util-visit';

export default function rehypeImageLightbox() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      
      if (!parent || node.tagName !== 'img') return;

      const props = node.properties || {};
      let src = String(props.src || '');
      let alt = String(props.alt || '');
      let title = String(props.title || '');


      if (props['data-md-width']) {
          const w = props['data-md-width'];
          const currentStyle = props.style || '';
          
          // 设置 CSS 样式强制控制显示宽度，并添加 margin: 0 auto 实现居中
          // 注意：max-width 设为 100% 以保证移动端不溢出
          props.style = `width: ${w}px !important; max-width: 100% !important; display: block; margin: 0 auto; ${currentStyle}`;
          
          // 对于这种强制指定宽度的网络图片，我们可以保留 sizes="100vw" 以确保清晰度
          if (!props.sizes) props.sizes = '100vw';

          // 清理临时属性
          delete props['data-md-width'];
      }
      
      if (props['data-md-height']) {
          const h = props['data-md-height'];
          const currentStyle = props.style || '';
          // 同样为高度限制的图片添加居中
          props.style = `height: ${h}px !important; display: block; margin: 0 auto; ${currentStyle}`;
          delete props['data-md-height'];
      }


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
          // 'data-lightbox': src, // 移除：让前端根据 img 标签自动探测最佳画质（优先 srcset）
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