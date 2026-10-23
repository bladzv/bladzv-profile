/**
 * Small visual effects shared by the desktop and dossier pages.
 * Every effect is skipped or made static under prefers-reduced-motion.
 */

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Types each phrase into every [data-typewriter] element, then deletes it and moves on. */
export function typewriter(phrases: string[], delay = 600) {
  const els = () => document.querySelectorAll<HTMLElement>('[data-typewriter]');
  const put = (t: string) => els().forEach((e) => (e.textContent = t));
  if (!phrases.length) return;
  if (reducedMotion()) return put(phrases[0]);

  let pi = 0;
  let ci = 0;
  let deleting = false;
  const tick = () => {
    const cur = phrases[pi];
    ci += deleting ? -1 : 1;
    put(cur.slice(0, ci));
    if (!deleting && ci === cur.length) {
      deleting = true;
      return setTimeout(tick, 1800);
    }
    if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      return setTimeout(tick, 400);
    }
    setTimeout(tick, deleting ? 40 : 70);
  };
  setTimeout(tick, delay);
}

/** Resolves [data-scramble] text from random glyphs, left to right. */
export function scramble() {
  if (reducedMotion()) return;
  const glyphs = '0123456789ABCDEF#$%&@!?/<>';
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const target = el.dataset.scramble ?? '';
    let f = 0;
    const id = setInterval(() => {
      f++;
      el.textContent = [...target]
        .map((ch, i) => (f > i * 3 + 8 || ch === '.' ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join('');
      if (f > target.length * 3 + 8) clearInterval(id);
    }, 45);
  });
}

/** Network-style particle field drawn into a canvas that fills its container. */
export function particles(canvas: HTMLCanvasElement, color: string, density = 12000) {
  if (reducedMotion() || canvas.dataset.init) return;
  canvas.dataset.init = '1';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  interface Point { x: number; y: number; vx: number; vy: number }
  let w = 0;
  let h = 0;
  let raf = 0;
  const pts: Point[] = [];

  const size = () => {
    const r = canvas.getBoundingClientRect();
    w = canvas.width = r.width;
    h = canvas.height = r.height;
    const n = Math.min(90, Math.round((w * h) / density));
    while (pts.length < n) {
      pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
    }
    pts.length = n;
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(canvas);

  const draw = () => {
    if (!canvas.isConnected) return ro.disconnect();
    if (document.hidden || canvas.offsetParent === null) {
      raf = requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, 6.3);
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.globalAlpha = (1 - d / 110) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}

export function initParticles(density?: number) {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-particles]').forEach((c) => {
    particles(c, c.dataset.particles || '#00d4ff', density);
  });
}

/**
 * Remembers the preferred view; storage can be unavailable, so failures are ignored.
 * The key is namespaced because every bladzv.github.io project page shares this origin's storage.
 */
export function setMode(mode: 'os' | 'simple') {
  try {
    localStorage.setItem('bladzv-profile:mode', mode);
  } catch {
    // ignore
  }
}
