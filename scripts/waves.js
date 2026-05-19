/* waves.js — Continuous full-page ambient sound-wave background.
   One fixed canvas behind everything, rendering:
     · multiple layered sound-waves spanning the entire viewport
     · slow-drifting radial orb glows (low opacity, premium feel)
     · sparse "pulse dots" — minimalist audio-node accents
   Pauses when the tab is hidden. Honours prefers-reduced-motion. */
(function () {
  'use strict';

  const PRIMARY        = [157,  92, 246];   // #9D5CF6
  const PRIMARY_SOFT   = [185, 136, 249];   // #B988F9
  const ACCENT         = [232, 121, 160];   // #E879A0

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  let w = 0, h = 0;
  let raf = 0;
  let t0 = performance.now();
  let running = false;

  /* ── Wave layers — positioned across the whole viewport height.
     y is a fraction of viewport height; multiple bands give the
     "continuous flow" feel that crosses sections. ─────────────── */
  const WAVES = [
    // top band — sits behind hero, lush + a bit more present
    { y: 0.18, amp: 0.060, freq: 3.2, speed: 0.30, phase: 0.0, color: PRIMARY,      width: 1.6,  blur: 22, alpha: 0.42 },
    { y: 0.22, amp: 0.045, freq: 4.6, speed: 0.42, phase: 1.4, color: PRIMARY_SOFT, width: 1.1,  blur: 18, alpha: 0.30 },
    { y: 0.30, amp: 0.075, freq: 2.4, speed: 0.18, phase: 2.7, color: ACCENT,       width: 1.2,  blur: 20, alpha: 0.22 },

    // mid band — quieter, threads through cards/process section
    { y: 0.48, amp: 0.085, freq: 2.0, speed: 0.14, phase: 4.1, color: PRIMARY,      width: 1.0,  blur: 16, alpha: 0.16 },
    { y: 0.55, amp: 0.040, freq: 5.2, speed: 0.50, phase: 0.6, color: ACCENT,       width: 0.8,  blur: 12, alpha: 0.18 },

    // lower band — back up to ambient, behind projects + contact
    { y: 0.72, amp: 0.055, freq: 2.8, speed: 0.22, phase: 3.0, color: PRIMARY_SOFT, width: 1.2,  blur: 18, alpha: 0.26 },
    { y: 0.80, amp: 0.090, freq: 1.8, speed: 0.12, phase: 5.5, color: PRIMARY,      width: 0.9,  blur: 14, alpha: 0.18 },
    { y: 0.86, amp: 0.035, freq: 4.0, speed: 0.36, phase: 2.0, color: ACCENT,       width: 0.7,  blur: 10, alpha: 0.22 }
  ];

  /* ── Drifting orb glows — soft, low-opacity, very slow. ── */
  const ORBS = [
    { x: 0.18, y: 0.22, r: 0.36, color: PRIMARY, alpha: 0.22, sx: 0.012, sy: 0.008, px: 0.0, py: 0.7 },
    { x: 0.78, y: 0.42, r: 0.30, color: ACCENT,  alpha: 0.14, sx: 0.009, sy: 0.014, px: 1.3, py: 2.1 },
    { x: 0.32, y: 0.68, r: 0.42, color: PRIMARY, alpha: 0.16, sx: 0.014, sy: 0.010, px: 2.6, py: 4.0 },
    { x: 0.82, y: 0.88, r: 0.34, color: ACCENT,  alpha: 0.12, sx: 0.011, sy: 0.013, px: 4.4, py: 1.8 }
  ];

  /* ── Sparse pulse dots — audio-node accents, fixed positions.
     Each has its own slow phase, so they pulse arrhythmically. ── */
  const DOTS = [
    { x: 0.08, y: 0.14, base: 1.2, mag: 0.6, speed: 0.7, phase: 0.0, color: PRIMARY_SOFT, alpha: 0.55 },
    { x: 0.92, y: 0.10, base: 0.9, mag: 0.5, speed: 1.1, phase: 1.4, color: ACCENT,       alpha: 0.50 },
    { x: 0.14, y: 0.46, base: 1.0, mag: 0.4, speed: 0.9, phase: 2.2, color: PRIMARY_SOFT, alpha: 0.40 },
    { x: 0.88, y: 0.58, base: 1.4, mag: 0.7, speed: 0.6, phase: 3.0, color: PRIMARY,      alpha: 0.55 },
    { x: 0.06, y: 0.78, base: 1.0, mag: 0.5, speed: 0.8, phase: 4.1, color: ACCENT,       alpha: 0.42 },
    { x: 0.62, y: 0.90, base: 1.1, mag: 0.5, speed: 1.0, phase: 5.0, color: PRIMARY_SOFT, alpha: 0.48 },
    { x: 0.48, y: 0.32, base: 0.8, mag: 0.3, speed: 1.3, phase: 0.8, color: PRIMARY_SOFT, alpha: 0.35 },
    { x: 0.72, y: 0.20, base: 0.9, mag: 0.4, speed: 0.95,phase: 2.8, color: PRIMARY,      alpha: 0.38 }
  ];

  function rgba(c, a) { return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`; }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawOrb(o, t) {
    const cx = (o.x + Math.sin(t * o.sx + o.px) * 0.04) * w;
    const cy = (o.y + Math.cos(t * o.sy + o.py) * 0.03) * h;
    const r  = Math.max(w, h) * o.r;
    const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0,    rgba(o.color, o.alpha));
    g.addColorStop(0.45, rgba(o.color, o.alpha * 0.30));
    g.addColorStop(1,    rgba(o.color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  function drawWave(L, t) {
    const amp   = L.amp * h;
    const phase = L.phase + t * L.speed;
    const yMid  = h * L.y;

    ctx.beginPath();
    const step = Math.max(3, Math.floor(w / 200));
    for (let x = 0; x <= w; x += step) {
      const u = x / w;
      const y =
        yMid +
        Math.sin(u * L.freq + phase) * amp +
        Math.sin(u * L.freq * 1.7 + phase * 0.7) * amp * 0.35 +
        Math.sin(u * L.freq * 0.4 - phase * 0.3) * amp * 0.18;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(L.color, 1);
    ctx.globalAlpha = L.alpha;
    ctx.lineWidth   = L.width;
    ctx.shadowColor = rgba(L.color, 0.9);
    ctx.shadowBlur  = L.blur;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }

  function drawDot(d, t) {
    const pulse = 0.5 + 0.5 * Math.sin(t * d.speed + d.phase);
    const r = d.base + d.mag * pulse;
    const cx = d.x * w;
    const cy = d.y * h;

    // outer halo
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 8);
    g.addColorStop(0,   rgba(d.color, d.alpha * 0.55));
    g.addColorStop(0.4, rgba(d.color, d.alpha * 0.18));
    g.addColorStop(1,   rgba(d.color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 8, 0, Math.PI * 2);
    ctx.fill();

    // core
    ctx.fillStyle = rgba(d.color, Math.min(1, d.alpha + 0.3));
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(now) {
    const t = (now - t0) / 1000;

    ctx.clearRect(0, 0, w, h);

    // ── orbs (additive feel via screen-ish blend) ──
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    for (let i = 0; i < ORBS.length; i++) drawOrb(ORBS[i], t);

    // ── waves ──
    for (let i = 0; i < WAVES.length; i++) drawWave(WAVES[i], t);

    // ── dots ──
    ctx.shadowBlur = 0;
    for (let i = 0; i < DOTS.length; i++) drawDot(DOTS[i], t);

    // reset
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    if (running) raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(draw);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // resize on window changes
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 80);
  });

  resize();
  if (prefersReduced) {
    // single static frame
    draw(performance.now());
  } else {
    start();
  }
})();
