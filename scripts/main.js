/* main.js — interacciones de la landing */
(function () {
  'use strict';

  // ── Nav: shadow/blur on scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Nav: active section indicator ──
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionMap = new Map();
    navLinks.forEach(link => {
      const section = document.getElementById(link.dataset.nav);
      if (section) sectionMap.set(section, link);
    });

    const setActive = (section) => {
      navLinks.forEach(l => l.classList.remove('is-active'));
      const link = sectionMap.get(section);
      if (link) link.classList.add('is-active');
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: '-10% 0px -55% 0px' }
    );

    sectionMap.forEach((_, section) => navObserver.observe(section));
  }

  // ── Scroll reveal ──
  const revealTargets = document.querySelectorAll(
    '.section-head, .card, .step, .project-row, .contact-form, .contact-response-badge'
  );
  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay ? +el.dataset.delay : i * 50;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, Math.min(delay, 300));
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // ── Project expand / collapse ──
  const projectToggles = document.querySelectorAll('.project-toggle');
  projectToggles.forEach((toggle) => {
    const detailId = toggle.getAttribute('aria-controls');
    const detail = document.getElementById(detailId);
    const row = toggle.closest('.project-row');
    if (!detail || !row) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other open rows
      projectToggles.forEach((other) => {
        if (other === toggle) return;
        const otherId = other.getAttribute('aria-controls');
        const otherDetail = document.getElementById(otherId);
        const otherRow = other.closest('.project-row');
        if (otherDetail && otherRow) {
          other.setAttribute('aria-expanded', 'false');
          otherDetail.setAttribute('aria-hidden', 'true');
          otherDetail.classList.remove('is-open');
          otherRow.classList.remove('is-open');
        }
      });

      // Toggle this row
      const next = !isOpen;
      toggle.setAttribute('aria-expanded', String(next));
      detail.setAttribute('aria-hidden', String(!next));
      detail.classList.toggle('is-open', next);
      row.classList.toggle('is-open', next);
    });
  });

  // ── Contact form → WhatsApp pre-fill ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const serviceLabels = {
      dashboard: 'Dashboard ejecutivo',
      automation: 'Automatización de procesos',
      'ai-agent': 'Agente IA',
      other: 'Consulta general / No sé aún',
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = (contactForm.querySelector('#cf-name')?.value    || '').trim();
      const service = (contactForm.querySelector('#cf-service')?.value || '').trim();
      const message = (contactForm.querySelector('#cf-message')?.value || '').trim();

      let text = name
        ? `Hola Steffano, soy ${name}`
        : 'Hola Steffano';

      if (service && serviceLabels[service]) {
        text += ` y me interesa: ${serviceLabels[service]}`;
      }

      if (message) {
        text += `.\n\nDetalle: ${message}`;
      }

      text += '.\n\n¿Podemos conversar?';

      const url = `https://wa.me/51992551735?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

})();
