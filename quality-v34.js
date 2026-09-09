
/* MortaLeague V34.1 — single-source mobile drawer controller */
(() => {
  const get = (id) => document.getElementById(id);

  function parts() {
    return {
      menu: get('mortaHamburger'),
      drawer: get('mortaDrawer'),
      backdrop: get('mortaDrawerBackdrop'),
      close: get('mortaDrawerClose')
    };
  }

  function setDrawer(open) {
    const { menu, drawer, backdrop } = parts();
    if (!menu || !drawer || !backdrop) return false;

    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    backdrop.hidden = !open;
    document.documentElement.classList.toggle('morta-drawer-open', open);
    document.body.classList.toggle('morta-drawer-open', open);
    if (!open) document.body.style.overflow = '';
    return true;
  }

  // Capture phase + stopImmediatePropagation prevents older duplicate handlers
  // from toggling the drawer a second time.
  document.addEventListener('click', (e) => {
    const hamburger = e.target.closest('#mortaHamburger');
    if (hamburger && window.matchMedia('(max-width:900px)').matches) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const drawer = get('mortaDrawer');
      setDrawer(!drawer?.classList.contains('open'));
      return;
    }

    if (e.target.closest('#mortaDrawerClose') || e.target.closest('#mortaDrawerBackdrop')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      setDrawer(false);
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width:900px)').matches) setDrawer(false);
  });

  // Defensive helper for optional UI nodes.
  window.MortaSafeText = (target, value) => {
    const el = typeof target === 'string' ? get(target) : target;
    if (el) el.textContent = value == null ? '' : String(value);
    return el;
  };
})();
