/* main.js — interacciones suaves de la landing */
(function () {
  'use strict';

  // ── Nav: shadow/blur cuando hay scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Reveal sutil en scroll (sin librerías) ──
  const targets = document.querySelectorAll(
    '.section-head, .card, .step, .project-row, .contact-btns'
  );
  if ('IntersectionObserver' in window && targets.length) {
    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = (el.dataset.delay ? +el.dataset.delay : i * 50);
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, Math.min(delay, 300));
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  // ── Smooth scroll respetando reduced motion ──
  // (CSS scroll-behavior ya lo cubre; nada extra necesario)
})();
