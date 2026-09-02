/* MortaLeague Professional Stability Layer V2 */
(() => {
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  const announce = (message,type='info') => {
    if(window.MortaUI?.toast) return window.MortaUI.toast(message,type);
    console[type==='error'?'error':'log']('[MortaLeague]',message);
  };

  // Keep accordions accessible and deterministic.
  $$('.systemRule h3').forEach(title=>{
    const card=title.closest('.systemRule');
    if(!card || title.dataset.mlProfessionalBound) return;
    title.dataset.mlProfessionalBound='1';
    title.setAttribute('aria-expanded',String(card.classList.contains('open')));
    const sync=()=>title.setAttribute('aria-expanded',String(card.classList.contains('open')));
    new MutationObserver(sync).observe(card,{attributes:true,attributeFilter:['class']});
  });

  // Only close the topmost visible dialog with Escape.
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape') return;
    const open=$$('.profileModal.open,.publicProfileModal.open,.offerModal.open,.notificationModal.open,.adminModal.open,.accountModal.open,.contactModal.open,.modal.show');
    const top=open.at(-1);
    if(!top) return;
    const close=$('[data-close-profile],[data-close-account],[data-close-contact],[data-close],.accountClose,.close',top);
    if(close) close.click();
    else { top.classList.remove('open','show'); top.setAttribute('aria-hidden','true'); }
  });

  // Prevent accidental duplicate clicks on async action buttons.
  const asyncIds=['saveProfile','loginSubmit','registerSubmit','contactSubmit','hubPublish','adminNewsPublish'];
  asyncIds.forEach(id=>{
    const b=$('#'+id); if(!b) return;
    b.addEventListener('click',()=>{
      if(b.dataset.mlCooldown) return;
      b.dataset.mlCooldown='1';
      setTimeout(()=>delete b.dataset.mlCooldown,350);
    },true);
  });

  // Better network feedback without exposing technical internals to normal users.
  window.addEventListener('online',()=>announce('Bağlantı yeniden kuruldu.','success'));
  window.addEventListener('offline',()=>announce('İnternet bağlantısı kesildi.','error'));

  // Make dynamically inserted images safer and less expensive.
  const optimizeImages=root=>$$('img',root).forEach(img=>{
    if(!img.hasAttribute('loading')) img.loading='lazy';
    if(!img.hasAttribute('decoding')) img.decoding='async';
  });
  optimizeImages(document);
  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType!==1) return;
    if(n.tagName==='IMG') optimizeImages(n.parentElement||document); else optimizeImages(n);
  }))).observe(document.documentElement,{childList:true,subtree:true});

  // Expose a lightweight health check for debugging from the browser console.
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
