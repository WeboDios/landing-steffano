/* waves.js — ondas decorativas tipo sound-wave, sin librerías */
(function () {
  'use strict';

  const PRIMARY = '#9D5CF6';
  const ACCENT  = '#E879A0';

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initWave(canvasId, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    let w = 0, h = 0;
    let raf = 0;
    let t0 = performance.now();

    const layers = opts.layers;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      // base radial glow
      if (opts.glow) {
        const cx = w * (opts.glowX || 0.5);
        const cy = h * (opts.glowY || 0.55);
        const r  = Math.max(w, h) * (opts.glowR || 0.55);
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,   'rgba(157, 92, 246, 0.22)');
        g.addColorStop(0.5, 'rgba(232, 121, 160, 0.08)');
        g.addColorStop(1,   'rgba(7, 4, 16, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // wave layers
      for (let i = 0; i < layers.length; i++) {
        const L = layers[i];
        const amp   = L.amp * (h * 0.5);
        const freq  = L.freq;
        const speed = L.speed;
        const phase = L.phase + t * speed;
        const yMid  = h * (L.y);
        const color = L.color === 'accent' ? ACCENT : PRIMARY;

        ctx.beginPath();
        const step = Math.max(2, Math.floor(w / 220));
        for (let x = 0; x <= w; x += step) {
          // multiple sines stacked for organic feel
          const u = x / w;
          const y =
            yMid +
            Math.sin(u * freq + phase) * amp +
            Math.sin(u * freq * 1.7 + phase * 0.7) * amp * 0.35 +
            Math.sin(u * freq * 0.4 - phase * 0.3) * amp * 0.18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = L.width;
        ctx.globalAlpha = L.alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = L.blur;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }

    function start() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    }

    // pause when offscreen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    // resize on layout changes
    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    resize();
    if (prefersReduced) {
      // single frame, no loop
      draw(performance.now());
    } else {
      start();
    }
  }

  // ── HERO: sound-wave layered (rich, central) ──
  initWave('wavesCanvas', {
    glow: true,
    glowX: 0.65,
    glowY: 0.5,
    glowR: 0.6,
    layers: [
      { y: 0.55, amp: 0.18, freq: 4.0, speed: 0.45, phase: 0.0, color: 'primary', width: 2.5,  blur: 28, alpha: 0.55 },
      { y: 0.58, amp: 0.22, freq: 3.2, speed: 0.32, phase: 1.6, color: 'accent',  width: 2.0,  blur: 24, alpha: 0.40 },
      { y: 0.52, amp: 0.14, freq: 5.5, speed: 0.55, phase: 2.4, color: 'primary', width: 1.4,  blur: 18, alpha: 0.50 },
      { y: 0.6,  amp: 0.27, freq: 2.4, speed: 0.22, phase: 3.1, color: 'primary', width: 1.2,  blur: 14, alpha: 0.30 },
      { y: 0.5,  amp: 0.09, freq: 7.5, speed: 0.7,  phase: 4.0, color: 'accent',  width: 0.9,  blur: 10, alpha: 0.40 },
      { y: 0.57, amp: 0.32, freq: 1.8, speed: 0.18, phase: 5.2, color: 'primary', width: 0.8,  blur: 8,  alpha: 0.22 }
    ]
  });

  // ── CONTACTO: 2 ondas suaves de fondo ──
  initWave('contactoCanvas', {
    glow: false,
    layers: [
      { y: 0.5,  amp: 0.10, freq: 3.4, speed: 0.30, phase: 0.0, color: 'primary', width: 1.4, blur: 22, alpha: 0.45 },
      { y: 0.55, amp: 0.13, freq: 2.6, speed: 0.22, phase: 2.0, color: 'accent',  width: 1.2, blur: 20, alpha: 0.32 },
      { y: 0.48, amp: 0.08, freq: 5.0, speed: 0.40, phase: 3.0, color: 'primary', width: 0.9, blur: 14, alpha: 0.40 }
    ]
  });
})();
