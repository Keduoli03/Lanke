import { visit } from 'unist-util-visit';

export default function remarkImageWrapper() {
  return (tree) => {
    visit(tree, (node) => {
      const esc = (s = '') => String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');

      // 1) 处理链接包裹图片：[![alt](img)](href)
      if (node.type === 'link' && Array.isArray(node.children) && node.children.length === 1 && node.children[0].type === 'image') {
        const image = node.children[0];
        const url = image.url || node.url || '';
        const alt = esc(image.alt || '');
        const title = esc(image.title || '');
        node.type = 'html';
        node.value = `<a class="md-lightbox" href="${esc(url)}" data-lightbox="${esc(url)}" data-alt="${alt}" data-title="${title}"><img src="${esc(url)}" alt="${alt}" title="${title}"></a>`;
        return;
      }

      // 2) 处理独立图片：![alt](img)
      if (node.type === 'image') {
        const { url = '', alt = '', title = '' } = node;
        node.type = 'html';
        node.value = `<a class="md-lightbox" href="${esc(url)}" data-lightbox="${esc(url)}" data-alt="${esc(alt)}" data-title="${esc(title)}"><img src="${esc(url)}" alt="${esc(alt)}" title="${esc(title)}"></a>`;
        return;
      }
    });
  };
}