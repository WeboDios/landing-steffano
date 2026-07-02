/* waves.js — fondo ambiental: ondas animadas + orbes de luz flotantes.
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

  // Orbes de luz que viajan lentamente cruzando la pantalla (deriva horizontal
  // con reaparición por el lado opuesto) + un leve vaivén vertical y respiración.
  // x0 = posición inicial, vx = velocidad horizontal (frac. de ancho/seg; signo = dirección),
  // by/bys = amplitud/velocidad del vaivén vertical, br/bs = respiración del radio/opacidad.
  const ORBS = [
    { x0: 0.05, y: 0.24, r: 0.30, c: 'p', alpha: 0.16, vx:  0.020, by: 0.035, bys: 0.06, py: 0.9, br: 0.10, bs: 0.18 },
    { x0: 0.70, y: 0.34, r: 0.26, c: 'a', alpha: 0.12, vx: -0.015, by: 0.045, bys: 0.08, py: 2.1, br: 0.12, bs: 0.22 },
    { x0: 0.35, y: 0.76, r: 0.34, c: 'p', alpha: 0.13, vx:  0.012, by: 0.030, bys: 0.05, py: 4.0, br: 0.09, bs: 0.15 },
    { x0: 0.90, y: 0.60, r: 0.22, c: 'a', alpha: 0.10, vx: -0.024, by: 0.050, bys: 0.07, py: 1.1, br: 0.14, bs: 0.26 }
  ];
  const ORB_SPAN = 1.6; // recorrido total: de -0.3 a 1.3 del ancho (entra y sale fuera de pantalla)

  function col(key) { return key === 'a' ? ACCENT : PRIMARY; }
  function rgba(c, a) { return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`; }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawOrb(o, t) {
    // deriva horizontal continua con envoltura (wrap) en el rango [-0.3, 1.3]
    let fx = o.x0 + t * o.vx;
    fx = ((fx + 0.3) % ORB_SPAN + ORB_SPAN) % ORB_SPAN - 0.3;
    const cx = fx * w;
    const cy = (o.y + Math.sin(t * o.bys + o.py) * o.by) * h;
    const breath = 1 + Math.sin(t * o.bs + o.py) * o.br;
    const r = Math.max(w, h) * o.r * breath;
    const a = o.alpha * (1 + Math.sin(t * o.bs * 0.8 + o.py) * 0.18);
    const c = col(o.c);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(c, a));
    g.addColorStop(0.4, rgba(c, a * 0.32));
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
