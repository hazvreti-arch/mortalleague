
/* MortaLeague V34 — isolated interaction stabilizer */
(() => {
  const $ = (s) => document.querySelector(s);

  const menu = $('#mortaHamburger');
  const drawer = $('#mortaDrawer');
  const backdrop = $('#mortaDrawerBackdrop');
  const closeBtn = $('#mortaDrawerClose');

  function isMobile(){ return window.matchMedia('(max-width:900px)').matches; }

  function setDrawer(open){
    if(!drawer || !menu || !backdrop) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menu.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
    document.documentElement.classList.toggle('morta-drawer-open', open);
    document.body.classList.toggle('morta-drawer-open', open);
  }

  menu?.addEventListener('click', (e) => {
    if(!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    setDrawer(!drawer?.classList.contains('open'));
  });

  closeBtn?.addEventListener('click', () => setDrawer(false));
  backdrop?.addEventListener('click', () => setDrawer(false));

  document.querySelectorAll('[data-drawer-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.drawerScroll;
      const target = document.getElementById(id);
      setDrawer(false);
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({behavior:'smooth', block:'start'}));
      } else {
        document.querySelector(`[data-scroll="${id}"]`)?.click();
      }
    });
  });

  $('#mortaDrawerProfileBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    setDrawer(false);
    setTimeout(() => window.__openMortaProfile?.(e), 40);
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && drawer?.classList.contains('open')) setDrawer(false);
  });

  window.addEventListener('resize', () => {
    if(!isMobile()) setDrawer(false);
  });

  /* Extra protection against the old "textContent of null" class of crash. */
  window.MortaSafeText = (id, value) => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if(el) el.textContent = value == null ? '' : String(value);
    return el;
  };
})();
