import { visit } from 'unist-util-visit';

function createImageWrapperHtml(props) {
  // 统一变量名，使用更明确的命名
  const imageSrc = (props.src || '').trim();
  const imageAlt = (props.alt || '').trim();
  const imageTitle = (props.title || '').trim();
  const imageWidth = props.width ? String(props.width).trim() : '';
  const imageHeight = props.height ? String(props.height).trim() : '';
  
  // 仅在有明确尺寸时添加数据属性
  const sizeAttributes = imageWidth && imageHeight 
    ? `data-pswp-width="${imageWidth}" data-pswp-height="${imageHeight}"` 
    : '';

  // 确保链接和图片源一致
  return `<a class="pswp-link" href="${imageSrc}" data-pswp-src="${imageSrc}" ${sizeAttributes}>
    <img 
      src="${imageSrc}" 
      alt="${imageAlt}" 
      title="${imageTitle}" 
      loading="lazy"
      ${imageWidth ? `width="${imageWidth}"` : ''}
      ${imageHeight ? `height="${imageHeight}"` : ''}
    />
  </a>`;
}

export default function remarkImageWrapper() {
  return (tree) => {
    // 处理标准 Markdown 图片（image 节点）
    visit(tree, { type: 'image' }, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      
      // 构建图片包装器HTML
      const html = createImageWrapperHtml({ 
        src: node.url, 
        alt: node.alt, 
        title: node.title,
        width: node.width,  // 传递宽度信息
        height: node.height // 传递高度信息
      });
      parent.children[index] = { type: 'html', value: html };
    });
  };
}
