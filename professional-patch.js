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

/* MortaLeague v13 Master UX layer */
(() => {
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  // Unified toast API used by future features without touching core logic.
  const ensureToastStack=()=>{
    let stack=$('.mortaToastStack');
    if(!stack){ stack=document.createElement('div'); stack.className='mortaToastStack'; stack.setAttribute('aria-live','polite'); stack.setAttribute('aria-atomic','true'); document.body.appendChild(stack); }
    return stack;
  };
  window.MortaUI=window.MortaUI||{};
  if(!window.MortaUI.toast){
    window.MortaUI.toast=(message,type='info')=>{
      const item=document.createElement('div'); item.className=`mortaToast ${type}`; item.textContent=String(message);
      ensureToastStack().appendChild(item); setTimeout(()=>item.remove(),3600);
    };
  }

  // Scroll progress + back-to-top; both are non-invasive.
  const bar=document.createElement('div'); bar.className='mortaPageProgress'; bar.setAttribute('aria-hidden','true'); document.body.appendChild(bar);
  const back=document.createElement('button'); back.type='button'; back.className='mortaBackTop'; back.textContent='↑'; back.title='Başa dön'; back.setAttribute('aria-label','Başa dön'); document.body.appendChild(back);
  const syncScroll=()=>{
    const d=document.documentElement, max=Math.max(1,d.scrollHeight-d.clientHeight);
    bar.style.width=`${Math.min(100,Math.max(0,(scrollY/max)*100))}%`;
    back.classList.toggle('show',scrollY>420);
  };
  addEventListener('scroll',syncScroll,{passive:true}); syncScroll();
  back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // Make every button explicit and prevent accidental form submission.
  $$('button:not([type])').forEach(b=>{if(!b.closest('form')) b.type='button';});

  // External links stay predictable; no accidental loss of app state.
  $$('a[href^="http"]').forEach(a=>{if(a.target==='_blank'){a.rel='noopener noreferrer';}});

  // Improve native lazy loading for data-added images without touching avatars.
  const optimize=()=>$$('img').forEach(img=>{
    if(!img.hasAttribute('decoding')) img.decoding='async';
    if(!img.hasAttribute('loading') && !img.closest('.logo,.profileAvatar,.avatar')) img.loading='lazy';
  });
  optimize();

  // Robust view helper: if a nav control targets a view, keep one visible section.
  const viewIds=['home','players','playerCalculator','systems','mortahub'];
  const normalizeTarget=v=>v==='contribution'?'playerCalculator':v;
  const enforceView=target=>{
    const id=normalizeTarget(target);
    if(!viewIds.includes(id)) return false;
    const sections=viewIds.map(x=>document.getElementById(x)).filter(Boolean);
    sections.forEach(sec=>{
      if(sec.id===id){ sec.classList.remove('mortaViewHidden'); sec.hidden=false; sec.setAttribute('aria-hidden','false'); }
      else { sec.classList.add('mortaViewHidden'); sec.hidden=false; sec.setAttribute('aria-hidden','true'); }
    });
    document.body.classList.add('morta-view-mode');
    return true;
  };
  window.MortaLeagueV13={enforceView};

  // Repair common semantic aliases without replacing existing event handlers.
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-mobile-scroll],[data-scroll]');
    if(!b) return;
    const target=normalizeTarget(b.getAttribute('data-mobile-scroll')||b.getAttribute('data-scroll')||'');
    if(viewIds.includes(target)){
      // Let the existing app handler run; normalize visibility after it.
      requestAnimationFrame(()=>enforceView(target));
    }
  },{capture:true});

  // Mobile navigation active state based on current section and viewport.
  const syncNav=()=>{
    const active=viewIds.find(id=>{const el=document.getElementById(id); return el && !el.classList.contains('mortaViewHidden') && el.getAttribute('aria-hidden')!=='true';});
    $$('.mortaBottomNav button').forEach(b=>{
      const t=normalizeTarget(b.getAttribute('data-mobile-scroll')||b.dataset.target||'');
      const on=t===active; b.classList.toggle('is-active',on); b.setAttribute('aria-current',on?'page':'false');
    });
  };
  document.addEventListener('morta:viewchange',syncNav);
  setTimeout(syncNav,0);

  // Focus the first useful control after a view change for keyboard/screen-reader users.
  document.addEventListener('morta:viewchange',e=>{
    const id=e.detail?.id;
    if(!id) return;
    const sec=document.getElementById(normalizeTarget(id));
    const focusable=sec?.querySelector('input,select,button,[href]');
    if(focusable && matchMedia('(min-width:901px)').matches) setTimeout(()=>focusable.focus({preventScroll:true}),50);
  });

  // Guard against accidental duplicate clicks on primary async buttons.
  document.addEventListener('click',e=>{
    const b=e.target.closest('.primary,.secondary,.accountBtn');
    if(!b || b.disabled || b.dataset.mlGuard==='1') return;
    if(b.id && /submit|save|publish|calculate/i.test(b.id)){
      b.dataset.mlGuard='1'; setTimeout(()=>delete b.dataset.mlGuard,450);
    }
  },{capture:true});

  // Tiny connectivity feedback, throttled to avoid noise.
  let last=0; const announce=(msg,type)=>{const now=Date.now(); if(now-last<1200)return; last=now; window.MortaUI?.toast(msg,type);};
  addEventListener('online',()=>announce('Bağlantı yeniden kuruldu.','success'));
  addEventListener('offline',()=>announce('İnternet bağlantısı kesildi.','error'));
})();
