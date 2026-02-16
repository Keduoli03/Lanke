// @ts-nocheck
/**
 * 这是一个用于防止主题闪烁的内联脚本。
 * 它会读取 localStorage 中的主题和色调设置，并在页面渲染前应用它们。
 * 它还监听 Astro 的视图过渡事件，以确保在客户端路由切换后主题保持一致。
 */
function applyThemeAndHue() {
  // --- 应用亮暗模式 ---
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light-plus');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'catppuccin-frappe');
  }

  // --- 应用主题色 (Hue) ---
  const hue = localStorage.getItem("theme-hue") || 210; // 210 是默认的蓝色
  document.documentElement.style.setProperty("--primary-hue", hue.toString());
}

function setNoSidebarTransition(on) {
  try {
    document.documentElement.classList.toggle('no-sidebar-transition', !!on);
  } catch(e) {}
}

function freezeRootVars() {
  try {
    var root = document.documentElement;
    var cs = getComputedStyle(root);
    var vars = ['--page-bg','--content-pane-bg','--text-primary','--text-secondary','--line-divider','--theme-color','--theme-color-light','--sidebar-bg','--sidebar-icon-bg','--sidebar-icon-symbol'];
    for (var i=0;i<vars.length;i++) {
      var v = vars[i];
      var val = cs.getPropertyValue(v);
      if (val) root.style.setProperty(v, val);
    }
  } catch(e) {}
}

function unfreezeRootVars() {
  try {
    var root = document.documentElement;
    var vars = ['--page-bg','--content-pane-bg','--text-primary','--text-secondary','--line-divider','--theme-color','--theme-color-light','--sidebar-bg','--sidebar-icon-bg','--sidebar-icon-symbol'];
    for (var i=0;i<vars.length;i++) { root.style.removeProperty(vars[i]); }
  } catch(e) {}
}


function freezeSidebarVars() {
  try {
    var root = document.documentElement;
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    var csb = getComputedStyle(sb);
    sb.style.width = csb.width;
    sb.style.transition = 'none';
    var cs = getComputedStyle(root);
    var vars = ['--sidebar-bg','--sidebar-icon-bg','--sidebar-icon-symbol','--theme-color','--theme-color-light','--text-secondary','--text-primary','--line-divider'];
    for (var i=0;i<vars.length;i++) {
      var v = vars[i];
      var val = cs.getPropertyValue(v);
      if (val) sb.style.setProperty(v, val);
    }
    var btn = document.getElementById('sidebar-toggle');
    if (btn) {
      var csb = getComputedStyle(btn);
      btn.style.transition = 'none';
      btn.style.transform = csb.transform;
    }
  } catch(e) {}
}

function unfreezeSidebarVars() {
  try {
    var sb = document.getElementById('sidebar');
    if (sb) {
      sb.style.width = '';
      sb.style.transition = '';
      var vars = ['--sidebar-bg','--sidebar-icon-bg','--sidebar-icon-symbol','--theme-color','--theme-color-light','--text-secondary','--text-primary','--line-divider'];
      for (var i=0;i<vars.length;i++) { sb.style.removeProperty(vars[i]); }
    }
    var btn = document.getElementById('sidebar-toggle');
    if (btn) {
      btn.style.transition = '';
      btn.style.transform = '';
    }
  } catch(e) {}
}

window.applyThemeAndHue = applyThemeAndHue;
window.setNoSidebarTransition = setNoSidebarTransition;
window.freezeRootVars = freezeRootVars;
window.unfreezeRootVars = unfreezeRootVars;
window.freezeSidebarVars = freezeSidebarVars;
window.unfreezeSidebarVars = unfreezeSidebarVars;

// 首次加载：禁用侧边栏过渡，应用状态后在下一帧恢复
setNoSidebarTransition(true);
applyThemeAndHue();

// 移除旧的 Astro 事件监听器，这些将在 swup-init.ts 中通过 Swup 事件处理
// document.addEventListener('astro:before-swap', ...);
// document.addEventListener('astro:after-swap', ...);

// 预先拦截内部链接的点击/按下，尽早冻结，避免首帧闪白
function isInternalAnchor(el){
  try {
    if (!el) return false;
    var a = el.closest('a');
    if (!a || !a.href) return false;
    var u = new URL(a.href, window.location.href);
    return u.origin === window.location.origin && a.target !== '_blank';
  } catch(e) { return false }
}
document.addEventListener('pointerdown', function(e){
  var t = e.target;
  if (t && t instanceof Element && isInternalAnchor(t)) { setNoSidebarTransition(true); freezeRootVars(); freezeSidebarVars(); }
}, true);
document.addEventListener('click', function(e){
  var t = e.target;
  if (t && t instanceof Element && isInternalAnchor(t)) { setNoSidebarTransition(true); freezeRootVars(); freezeSidebarVars(); }
}, true);
