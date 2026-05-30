/* main.js — interacciones de la landing (mejorada) */
(function () {
  'use strict';

  // ── Nav: blur/borde al hacer scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Nav: indicador de sección activa ──
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    navLinks.forEach(link => {
      const s = document.getElementById(link.dataset.nav);
      if (s) map.set(s, link);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          const link = map.get(e.target);
          if (link) link.classList.add('is-active');
        }
      });
    }, { threshold: 0.25, rootMargin: '-10% 0px -55% 0px' });
    map.forEach((_, s) => obs.observe(s));
  }

  // ── Scroll reveal ──
  const targets = document.querySelectorAll(
    '.section-head, .svc-item, .tl-step, .project-row, .contact-form, .contact-response-badge'
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
          const delay = el.dataset.delay ? +el.dataset.delay : i * 50;
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, Math.min(delay, 300));
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => obs.observe(el));
  }

  // ── Acordeón genérico (proyectos + servicios) ──
  function initAccordion(selector) {
    const toggles = document.querySelectorAll(selector);
    toggles.forEach(toggle => {
      const detail = document.getElementById(toggle.getAttribute('aria-controls'));
      const row = toggle.closest('.project-row, .svc-item');
      if (!detail || !row) return;
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggles.forEach(other => {
          if (other === toggle) return;
          const od = document.getElementById(other.getAttribute('aria-controls'));
          const or = other.closest('.project-row, .svc-item');
          if (od && or) {
            other.setAttribute('aria-expanded', 'false');
            od.setAttribute('aria-hidden', 'true');
            od.classList.remove('is-open');
            or.classList.remove('is-open');
          }
        });
        const next = !isOpen;
        toggle.setAttribute('aria-expanded', String(next));
        detail.setAttribute('aria-hidden', String(!next));
        detail.classList.toggle('is-open', next);
        row.classList.toggle('is-open', next);
      });
    });
  }
  initAccordion('.project-toggle');
  initAccordion('.svc-toggle');

  // ── Formulario → WhatsApp ──
  const form = document.getElementById('contact-form');
  if (form) {
    const labels = {
      dashboard: 'Dashboard ejecutivo',
      automation: 'Automatización de procesos',
      'ai-agent': 'Agente IA',
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

  // ── Conmutador de estilo (herramienta de vista previa) ──
  const switcher = document.getElementById('themeSwitch');
  if (switcher) {
    const dots = switcher.querySelectorAll('.theme-dot');
    const STORAGE = 'steffano-theme';
    const apply = (val, persist) => {
      document.documentElement.setAttribute('data-theme', val);
      dots.forEach(d => d.classList.toggle('is-active', d.dataset.themeVal === val));
      document.dispatchEvent(new CustomEvent('themechange', { detail: val }));
      if (persist) { try { localStorage.setItem(STORAGE, val); } catch (e) {} }
    };
    let saved = 'amatista';
    try { saved = localStorage.getItem(STORAGE) || 'amatista'; } catch (e) {}
    apply(saved, false);
    dots.forEach(d => d.addEventListener('click', () => apply(d.dataset.themeVal, true)));
  }

})();
