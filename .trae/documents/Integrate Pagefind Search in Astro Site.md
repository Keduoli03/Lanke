## 目标

* 让文章内容占满面板宽度

* 在同一内容面板的右侧集成目录与“回到顶部/滚动到评论”按钮

* 适配文章动态路由与其他 Markdown 页面（如关于页），根据是否存在目录数据动态显示右侧栏

## 布局设计

* 新建 `src/layouts/PostLayout.astro`

* 接收 props：`title`, `description`, `railWidth`（默认 `siteConfig.tocWidth`）, `headings?`, `showRail?`（默认 true）

* 结构：在 `MainLayout` 的 `content-pane` 内创建一个相对定位容器，左侧为内容 `<slot/>`，右侧为绝对定位的右侧栏 `aside`

* 右侧栏内部使用粘性定位保持跟随滚动；在移动端隐藏

* 动态显示：当 `showRail` 为 true 且 `headings?.length > 0` 时渲染默认目录与控件；否则不显示

* 可扩展：提供命名插槽 `slot="rail"`，若页面提供该插槽则使用插槽内容替换默认目录与控件

## 页面适配

### Posts 动态路由页面 `src/pages/posts/[...slug].astro`

* 保持 `getStaticPaths`（第 18–24 行）不变

* 使用 `render(entry)` 获取 `Content` 和 `headings`

* 将布局从 `MainLayout` 替换为 `PostLayout`，传入 `title`, `description`, `railWidth=siteConfig.tocWidth`, `headings`

* 不提供 `slot="rail"` 时，右侧栏由布局默认渲染 `Toc + ScrollToTop + ScrollToComment`

* 文章主体、封面、`PostInfoCard` 与 `Artalk` 保持原位置

### 关于页面 `src/pages/about.astro`

* 使用 `render(aboutPost)` 获取 `Content` 和 `headings`

* 将布局从 `MainLayout` 替换为 `PostLayout`，传入 `title`, `headings`

* 如需自定义右侧栏，提供 `slot="rail"`；否则使用默认目录与控件

## 关键样式与定位

* 大屏（≥1024px）：

  * `.post-content { padding-right: var(--rail-width); }`

  * `.post-rail { position: absolute; right: 0; top: 0; width: var(--rail-width); }`

  * `.rail-sticky { position: sticky; top: 14px; }`

* 小屏：隐藏右侧栏，内容全宽

## 兼容性

* 保持与 `ClientRouter` 的工作方式：布局仅改变面板内部结构，不影响过渡

* 不修改站点全局样式，仅在布局内使用内联样式隔离作用域

## 实施步骤

1. 新建 `PostLayout.astro`，实现上面的结构、props 与动态显示逻辑
2. 更新 `src/pages/posts/[...slug].astro` 引入并使用 `PostLayout`，传入 `headings`
3. 更新 `src/pages/about.astro` 引入并使用 `PostLayout`，传入 `headings`
4. 验证桌面与移动端展示、滚动粘性、目录生成与跳转、评论按钮行为

## 验证

* 打开任一文章页：右侧出现目录与按钮，文章占满面板

* 切换到其他页面再返回：右侧栏与目录仍正确渲染

* 打开关于页：若存在标题层级则显示目录，否则右侧栏隐藏

