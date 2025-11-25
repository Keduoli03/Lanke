## 目标

* 侧边栏只保留一个“搜索”按钮

* 点击按钮后在屏幕中央弹出对话框（全屏/居中），包含搜索输入、即时结果列表、关闭按钮

* 使用 Pagefind 客户端索引进行搜索；点击结果跳转到对应文章

* 支持移动端与桌面端，键盘可用、可访问，避免背景滚动与闪烁

## 交互设计

* 触发：侧边栏搜索按钮点击 → 打开对话框

* 关闭：ESC、点击遮罩、点击关闭按钮

* 搜索：输入关键词后 200ms 防抖触发；显示最多 50 条结果

* 键盘导航：↑/↓ 在结果中移动焦点；Enter 打开选中结果；ESC 关闭

* 移动端：对话框全屏，输入获得焦点；滚动锁定

## 组件与文件

* 新增 `src/components/util/SearchDialog.svelte`

  * Props：无；内部状态：`open`、`query`、`results`、`loading`

  * 懒加载 Pagefind：首次打开时 `import('/pagefind/pagefind.js')`

  * 打开/关闭：监听 `window` 上的自定义事件 `search:open`、`search:close`；或导出 `open()`、`close()` 函数

  * 结果项：显示 `title`、`excerpt`、`url`；点击跳转；高亮 `<mark>` 保留

  * 可访问：`role="dialog"`、`aria-modal="true"`、焦点陷阱、`tabIndex` 管理

  * 样式：内联或组件私有，使用现有 CSS 变量（`--content-pane-bg`, `--text-primary`, `--line-divider` 等）

* 布局挂载：在 `src/layouts/MainLayout.astro` 与 `src/layouts/PostLayout.astro` 的 `</body>` 前挂载 `<SearchDialog client:load />`

* 侧边栏按钮：更新 `src/components/Sidebar.astro` 将搜索输入改为按钮，点击时：

  * 展开侧边栏（保持现有逻辑）

  * `window.dispatchEvent(new CustomEvent('search:open'))` 打开对话框

## 详细实现步骤

1. 创建 `SearchDialog.svelte`

   * 结构：遮罩层 + 居中容器 + 关闭按钮 + 输入 + 结果列表

   * 脚本：

     * `let open=false, query='', results=[], loading=false`

     * `async function ensurePagefind(){ return await import('/pagefind/pagefind.js') }`

     * `async function runSearch(q){ const pf=await ensurePagefind(); const res=await pf.search(q); results = await Promise.all(res.results.slice(0,50).map(r=>r.data())) }`

     * 打开时聚焦输入；关闭时还原焦点到触发按钮

     * 监听 `pointerdown`/`keydown` 实现键盘导航与 ESC

   * 样式：

     * 遮罩：`position:fixed; inset:0; background:rgba(0,0,0,.35)`

     * 面板：`max-width: 720px; width: 90vw; border:1px solid var(--line-divider); border-radius:.75rem; background:var(--content-pane-bg)`

     * 结果项 hover 高亮，使用主题色淡化背景
2. 在 `MainLayout.astro` 与 `PostLayout.astro` 挂载 `<SearchDialog client:load />`
3. 更新 `Sidebar.astro`

   * 将搜索输入改为“搜索”按钮（保留图标）

   * 点击按钮：展开侧栏 + 触发 `search:open`
4. 保留 `/search` 页面（可选）

   * 当前 `/search` 可作为分享链接备用；也可在将来删除以简化导航
5. 构建与索引

   * `pnpm build` 已包含 `pagefind --source dist`，构建后可直接使用 `/pagefind/pagefind.js`

## 可访问与性能

* 打开时锁定背景滚动（与 Lightbox 同策略），关闭后恢复

* 首次打开懒加载索引模块，后续缓存复用；显示骨架/“搜索中…”状态

* 移动端输入唤起键盘时，上移面板以避免遮挡

## 验证

* 桌面：点击侧边栏搜索 → 弹窗出现、输入即时结果、键盘可用、点击结果跳转

* 移动端：全屏弹窗、阻止背景滚动、输入与结果可操作

* 切页后再次打开：无需刷新即可正常搜索

## 变更范围

* 新增 1 个 Svelte 组件并在两个布局挂载

* 修改侧边栏一处渲染与点击逻辑（输入改按钮）

* 不影响现有索引与构建流程

