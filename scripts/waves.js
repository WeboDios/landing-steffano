/* waves.js — fondo ambiental de ondas, suave y continuo.
   Lee los colores del tema activo (CSS vars) y se actualiza al cambiar de estilo. */
(function () {
  'use strict';

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  let w = 0, h = 0, raf = 0;
  const t0 = performance.now();
  let running = false;

  let PRIMARY = [157, 92, 246];
  let ACCENT  = [232, 121, 160];

  function parseColor(str, fallback) {
    if (!str) return fallback;
    str = str.trim();
    let m = str.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const p = m[1].split(',').map(s => parseFloat(s));
      return [p[0] | 0, p[1] | 0, p[2] | 0];
    }
    m = str.match(/^#?([0-9a-f]{6})$/i);
    if (m) {
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return fallback;
  }

  function readThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    PRIMARY = parseColor(cs.getPropertyValue('--primary'), PRIMARY);
    ACCENT  = parseColor(cs.getPropertyValue('--accent'),  ACCENT);
  }

  const WAVES = [
    { y: 0.16, amp: 0.055, freq: 3.0, speed: 0.28, phase: 0.0, c: 'p', width: 1.5, blur: 20, alpha: 0.34 },
    { y: 0.22, amp: 0.042, freq: 4.4, speed: 0.40, phase: 1.4, c: 'p', width: 1.0, blur: 16, alpha: 0.24 },
    { y: 0.30, amp: 0.070, freq: 2.3, speed: 0.17, phase: 2.7, c: 'a', width: 1.1, blur: 18, alpha: 0.18 },
    { y: 0.50, amp: 0.080, freq: 2.0, speed: 0.13, phase: 4.1, c: 'p', width: 1.0, blur: 14, alpha: 0.13 },
    { y: 0.72, amp: 0.052, freq: 2.7, speed: 0.21, phase: 3.0, c: 'p', width: 1.1, blur: 16, alpha: 0.20 },
    { y: 0.82, amp: 0.085, freq: 1.8, speed: 0.11, phase: 5.5, c: 'a', width: 0.9, blur: 12, alpha: 0.14 }
  ];
  const ORBS = [
    { x: 0.16, y: 0.20, r: 0.34, c: 'p', alpha: 0.18, sx: 0.012, sy: 0.008, px: 0.0, py: 0.7 },
    { x: 0.80, y: 0.40, r: 0.28, c: 'a', alpha: 0.12, sx: 0.009, sy: 0.014, px: 1.3, py: 2.1 },
    { x: 0.34, y: 0.70, r: 0.40, c: 'p', alpha: 0.13, sx: 0.014, sy: 0.010, px: 2.6, py: 4.0 }
  ];

  function col(key) { return key === 'a' ? ACCENT : PRIMARY; }
  function rgba(c, a) { return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`; }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawOrb(o, t) {
    const cx = (o.x + Math.sin(t * o.sx + o.px) * 0.04) * w;
    const cy = (o.y + Math.cos(t * o.sy + o.py) * 0.03) * h;
    const r = Math.max(w, h) * o.r;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const c = col(o.c);
    g.addColorStop(0, rgba(c, o.alpha));
    g.addColorStop(0.45, rgba(c, o.alpha * 0.3));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  function drawWave(L, t) {
    const amp = L.amp * h;
    const phase = L.phase + t * L.speed;
    const yMid = h * L.y;
    const c = col(L.c);
    ctx.beginPath();
    const step = Math.max(3, Math.floor(w / 200));
    for (let x = 0; x <= w; x += step) {
      const u = x / w;
      const y = yMid
        + Math.sin(u * L.freq + phase) * amp
        + Math.sin(u * L.freq * 1.7 + phase * 0.7) * amp * 0.35
        + Math.sin(u * L.freq * 0.4 - phase * 0.3) * amp * 0.18;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(c, 1);
    ctx.globalAlpha = L.alpha;
    ctx.lineWidth = L.width;
    ctx.shadowColor = rgba(c, 0.9);
    ctx.shadowBlur = L.blur;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    for (const o of ORBS) drawOrb(o, t);
    for (const L of WAVES) drawWave(L, t);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (running) raf = requestAnimationFrame(draw);
  }

  function start() { if (running) return; running = true; raf = requestAnimationFrame(draw); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  document.addEventListener('themechange', readThemeColors);

  let resizeTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 80); });

  readThemeColors();
  resize();
  if (prefersReduced) draw(performance.now()); else start();
})();
