/* MortaLeague Professional Stability Layer V2 */
(() => {
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  const announce = (message,type='info') => {
    if(window.MortaUI?.toast) return window.MortaUI.toast(message,type);
    console[type==='error'?'error':'log']('[MortaLeague]',message);
  };
  $$('.systemRule h3').forEach(title=>{
    const card=title.closest('.systemRule');
    if(!card || title.dataset.mlProfessionalBound) return;
    title.dataset.mlProfessionalBound='1';
    title.setAttribute('aria-expanded',String(card.classList.contains('open')));
    const sync=()=>title.setAttribute('aria-expanded',String(card.classList.contains('open')));
    new MutationObserver(sync).observe(card,{attributes:true,attributeFilter:['class']});
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape') return;
    const open=$$('.profileModal.open,.publicProfileModal.open,.offerModal.open,.notificationModal.open,.adminModal.open,.accountModal.open,.contactModal.open,.modal.show');
    const top=open.at(-1);
    if(!top) return;
    const close=$('[data-close-profile],[data-close-account],[data-close-contact],[data-close],.accountClose,.close',top);
    if(close) close.click();
    else { top.classList.remove('open','show'); top.setAttribute('aria-hidden','true'); }
  });
  const asyncIds=['saveProfile','loginSubmit','registerSubmit','contactSubmit','hubPublish','adminNewsPublish'];
  asyncIds.forEach(id=>{
    const b=$('#'+id); if(!b) return;
    b.addEventListener('click',()=>{
      if(b.dataset.mlCooldown) return;
      b.dataset.mlCooldown='1';
      setTimeout(()=>delete b.dataset.mlCooldown,350);
    },true);
  });
  window.addEventListener('online',()=>announce('Bağlantı yeniden kuruldu.','success'));
  window.addEventListener('offline',()=>announce('İnternet bağlantısı kesildi.','error'));
  const optimizeImages=root=>$$('img',root).forEach(img=>{
    if(!img.hasAttribute('loading')) img.loading='lazy';
    if(!img.hasAttribute('decoding')) img.decoding='async';
  });
  optimizeImages(document);
  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType!==1) return;
    if(n.tagName==='IMG') optimizeImages(n.parentElement||document); else optimizeImages(n);
  }))).observe(document.documentElement,{childList:true,subtree:true});
  window.MortaLeagueHealth = () => ({
    online:navigator.onLine,
    supabase:!!window.mortaSupabase,
    profileModal:!!$('#profileModal'),
    players:!!$('#playerList'),
    teams:!!$('#teamList'),
    hub:!!$('#mortahub'),
    notifications:!!$('#notificationButton')
  });
})();

/* MortaLeague v12 QA / UX layer */
(function(){
  const ready=()=>{
    // Make images cheaper and safer to render.
    document.querySelectorAll('img').forEach(img=>{
      if(!img.hasAttribute('loading') && !img.closest('header')) img.loading='lazy';
      if(!img.hasAttribute('decoding')) img.decoding='async';
    });

    // Never let empty system view greet the user when navigating to it.
    const systems=document.getElementById('systems');
    const disclosure=document.getElementById('systemsDisclosure');
    const openSystems=()=>{ if(disclosure) disclosure.open=true; };
    document.querySelectorAll('[data-scroll="systems"],[data-mobile-scroll="systems"]').forEach(b=>b.addEventListener('click',openSystems,{capture:true}));

    // Keep the URL-driven view and active mobile item consistent after back/forward.
    window.addEventListener('popstate',()=>{
      const hash=location.hash.slice(1) || 'home';
      if(window.MortaLeagueViews?.show) window.MortaLeagueViews.show(hash,{history:false});
    });

    // Add lightweight keyboard semantics to navigation buttons.
    document.querySelectorAll('.mortaBottomNav button').forEach(btn=>{
      btn.setAttribute('type','button');
      btn.setAttribute('aria-current','false');
    });
    const sync=()=>document.querySelectorAll('.mortaBottomNav button').forEach(btn=>btn.setAttribute('aria-current',btn.classList.contains('is-active')?'page':'false'));
    document.addEventListener('morta:viewchange',sync);
    sync();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
