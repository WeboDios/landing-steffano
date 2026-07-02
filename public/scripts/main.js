/* main.js — interacciones multi-page FLUIA */
(function () {
  'use strict';

  // ── Nav: blur/borde al hacer scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Scroll reveal ──
  const targets = document.querySelectorAll(
    '.section-head, .page-header, .prob-card, .svc-preview-card, .case-preview-card, ' +
    '.tl-step, .case-full, .contact-form, .contact-response-badge, .cta-banner-inner, .tech-grid li'
  );
  if ('IntersectionObserver' in window && targets.length) {
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target;
          const delay = el.dataset.delay ? +el.dataset.delay : i * 45;
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, Math.min(delay, 280));
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => obs.observe(el));
  }

  // ── Menú móvil (hamburguesa) ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const mqMobile = window.matchMedia('(max-width: 880px)');
  if (nav && navToggle) {
    const setOpen = (open) => {
      nav.classList.toggle('is-menu-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('nav-open-lock', open);
    };
    navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-menu-open')));

    // cerrar al tocar un enlace (excepto el trigger de Servicios en móvil)
    navLinks?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (a.classList.contains('nav-menu-trigger') && mqMobile.matches) return;
        setOpen(false);
      });
    });

    // cerrar con Escape y al volver a desktop
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    mqMobile.addEventListener('change', (e) => { if (!e.matches) setOpen(false); });
  }

  // ── Submenú de Servicios: tap lo expande en móvil; hover/focus en desktop (vía CSS) ──
  const navMenu = document.querySelector('[data-nav-menu]');
  if (navMenu) {
    const trigger = navMenu.querySelector('.nav-menu-trigger');
    trigger?.addEventListener('click', (e) => {
      if (mqMobile.matches) {
        e.preventDefault();
        const open = navMenu.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(open));
      }
    });
    navMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });
  }

  // ── Tabs de servicios (con deep-link por hash) ──
  const tabBtns = document.querySelectorAll('.svc-tab-btn');
  const panels = document.querySelectorAll('.svc-panel');
  if (tabBtns.length && panels.length) {
    function activate(id, focus) {
      tabBtns.forEach(btn => {
        const sel = btn.dataset.tab === id;
        btn.setAttribute('aria-selected', String(sel));
        btn.setAttribute('tabindex', sel ? '0' : '-1');
        if (sel && focus) btn.focus();
      });
      panels.forEach(p => p.classList.toggle('is-active', p.id === 'panel-' + id));
      history.replaceState(null, '', '#' + id);
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => activate(btn.dataset.tab, false));
      btn.addEventListener('keydown', (e) => {
        const list = Array.from(tabBtns);
        const i = list.indexOf(btn);
        if (e.key === 'ArrowRight') activate(list[(i + 1) % list.length].dataset.tab, true);
        if (e.key === 'ArrowLeft') activate(list[(i - 1 + list.length) % list.length].dataset.tab, true);
      });
    });

    // abrir tab según hash (#dashboards, #automatizacion, etc.)
    const hash = location.hash.replace('#', '');
    const valid = Array.from(tabBtns).some(b => b.dataset.tab === hash);
    activate(valid ? hash : tabBtns[0].dataset.tab, false);
  }

  // ── Formulario → WhatsApp ──
  const form = document.getElementById('contact-form');
  if (form) {
    const labels = {
      dashboard: 'Dashboard ejecutivo',
      automation: 'Automatización de procesos',
      'ai-agent': 'Agente IA',
      web: 'Website o sistema interno',
      diagnosis: 'Diagnóstico digital',
      other: 'Consulta general / No sé aún',
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.querySelector('#cf-name')?.value || '').trim();
      const service = (form.querySelector('#cf-service')?.value || '').trim();
      const message = (form.querySelector('#cf-message')?.value || '').trim();
      let text = name ? `Hola FLUIA, soy ${name}` : 'Hola FLUIA';
      if (service && labels[service]) text += ` y me interesa: ${labels[service]}`;
      if (message) text += `.\n\nDetalle: ${message}`;
      text += '.\n\n¿Podemos conversar?';
      window.open(`https://wa.me/51992551735?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  }
})();
