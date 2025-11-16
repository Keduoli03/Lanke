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
html.dark.layout-loading .content-pane.vt-page::before{content:"";position:absolute;inset:0;background:color-mix(in srgb, var(--theme-color) 25%, black);backdrop-filter:blur(1px);pointer-events:none;z-index:9998}\
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
    if(!a||!a.href) return false;
    var u=new URL(a.href,window.location.href);
    return u.origin===window.location.origin&&a.target!=='_blank';
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

document.addEventListener('pointerdown',function(e){ var t=e.target; if(t&&t instanceof Element&&isInternalAnchor(t)){ showLoader(); } },true);
document.addEventListener('click',function(e){ var t=e.target; if(t&&t instanceof Element&&isInternalAnchor(t)){ showLoader(); } },true);

document.addEventListener('astro:before-swap',function(){ showLoader(); });
document.addEventListener('astro:after-swap',function(){ setTimeout(hideLoader,160); });
document.addEventListener('astro:page-load',function(){ hideLoader(); });