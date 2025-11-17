// @ts-nocheck
function ensureStyles(){
  try{
    var st=document.getElementById('page-transition-style');
    if(st) return;
    st=document.createElement('style');
    st.id='page-transition-style';
    st.textContent='\
.content-pane.vt-page{position:relative}\
html.layout-loading:not(.dark) .content-pane.vt-page::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,0.6);backdrop-filter:blur(1px);pointer-events:none;z-index:9998}\
html.dark.layout-loading .content-pane.vt-page::before{content:"";position:absolute;inset:0;background:color-mix(in srgb, var(--theme-color) 20%, transparent);opacity:.6;backdrop-filter:blur(1px);pointer-events:none;z-index:9998}\
#layout-spinner{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:2rem;height:2rem;border:3px solid var(--line-divider);border-top-color:var(--theme-color);border-radius:9999px;animation:spin .8s linear infinite;z-index:9999;display:none;pointer-events:none}\
@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}\
html.layout-loading #layout-spinner{display:block}\
';
    document.head.appendChild(st);
  }catch(e){}
}

function ensureSpinner(){
  try{
    var sp=document.getElementById('layout-spinner');
    if(sp) return sp;
    sp=document.createElement('div');
    sp.id='layout-spinner';
    document.body.appendChild(sp);
    return sp;
  }catch(e){}
}

function isInternalAnchor(el){
  try{
    if(!el) return false;
    var a=el.closest('a');
    if(!a) return false;
    // 明确标记为不触发过渡
    var noTransition = a.getAttribute('data-no-transition');
    if(noTransition === 'true') return false;
    // 无 href 或锚点占位，视为非导航
    var hrefAttr = a.getAttribute('href')||'';
    if(!hrefAttr || hrefAttr === '#' || hrefAttr.startsWith('javascript:')) return false;
    var u=new URL(a.href,window.location.href);
    // 内部导航且不新开窗口
    if(u.origin===window.location.origin && a.target!=='_blank'){
      // 同页面 hash 变化不触发加载
      var sameDoc = u.pathname===window.location.pathname && u.search===window.location.search;
      if(sameDoc && u.hash) return false;
      return true;
    }
    return false;
  }catch(e){return false}
}

var __pt_timer=null;
function showLoader(){
  try{
    ensureStyles();
    ensureSpinner();
    document.documentElement.classList.add('layout-loading');
    if(__pt_timer){ clearTimeout(__pt_timer); }
    __pt_timer=setTimeout(hideLoader,5000);
  }catch(e){}
}
function hideLoader(){ try{ document.documentElement.classList.remove('layout-loading'); if(__pt_timer){ clearTimeout(__pt_timer); __pt_timer=null; } }catch(e){} }

var __pt_touch=false; var __pt_drag=false; var __pt_x=0; var __pt_y=0;
document.addEventListener('pointerdown',function(e){
  if(e.pointerType==='touch'){ __pt_touch=true; __pt_drag=false; __pt_x=e.clientX||0; __pt_y=e.clientY||0; }
},true);
document.addEventListener('pointermove',function(e){
  if(__pt_touch){ var dx=(e.clientX||0)-__pt_x; var dy=(e.clientY||0)-__pt_y; if(Math.abs(dx)>8||Math.abs(dy)>8){ __pt_drag=true; } }
},true);
document.addEventListener('pointerup',function(){ __pt_touch=false; __pt_drag=false; },true);
document.addEventListener('pointercancel',function(){ __pt_touch=false; __pt_drag=false; },true);
document.addEventListener('click',function(e){
  if(__pt_drag){ __pt_touch=false; __pt_drag=false; return; }
  if(e.defaultPrevented) return;
  if(e.button!==0) return;
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
  var t=e.target; if(t&&t instanceof Element&&isInternalAnchor(t)){ showLoader(); }
},true);

document.addEventListener('astro:before-swap',function(){ showLoader(); });
document.addEventListener('astro:after-swap',function(){ setTimeout(hideLoader,160); });
document.addEventListener('astro:page-load',function(){ hideLoader(); });
window.addEventListener('popstate',function(){ hideLoader(); });