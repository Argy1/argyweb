import { clamp, readPalette, rgba, type Palette } from "./palette";

/**
 * Efek kursor (hanya desktop, mode Penuh): sorot cahaya lembut di bawah kursor yang membesar di atas elemen
 * interaktif + jejak percikan (biru, sesekali emas) saat kursor digerakkan. Kanvas overlay sendiri supaya
 * terlihat juga di atas kartu. Kursor asli tetap ada. Loop rAF hanya berjalan selama ada gerakan atau
 * partikel hidup, lalu berhenti dan membersihkan kanvas (tidak ada komposit ulang saat diam).
 * Warna dibaca dari token CSS (tidak ada hex di sini).
 */

const TAU = Math.PI * 2;
const MAX_PARTICLES = 48;
const INTERACTIVE = 'a, button, [role="button"], [role="switch"], input, textarea, select, label, summary';
const ALPHA_LEVELS = 4;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
  gold: boolean;
}

export function startCursorFx(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let pal: Palette = readPalette();
  let w = 0;
  let h = 0;
  let dpr = 1;

  // Sprite sorot: gradien radial dibuat sekali per palet.
  const spot = document.createElement("canvas");
  spot.width = 128;
  spot.height = 128;
  const paintSpot = () => {
    const c = spot.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, 128, 128);
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, rgba(pal.primary, 1));
    g.addColorStop(0.5, rgba(pal.primary, 0.35));
    g.addColorStop(1, rgba(pal.primary, 0));
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  };
  paintSpot();

  const resize = () => {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pw = Math.round(cw * dpr);
    const ph = Math.round(ch * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = cw;
    h = ch;
  };

  // ---- state ----
  let tx = -9999;
  let ty = -9999;
  let sx = -9999;
  let sy = -9999;
  let present = 0; // 0..1: kursor ada di jendela (fade in/out)
  let wantPresent = false;
  let hover = 0; // 0..1: di atas elemen interaktif
  let wantHover = false;
  let lastMove = 0;
  let raf = 0;
  let last = 0;
  let clock = 0;
  const particles: Particle[] = [];
  let drawn = false;

  const ensureLoop = () => {
    if (!raf && document.visibilityState !== "hidden") {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const dx = e.clientX - tx;
    const dy = e.clientY - ty;
    const first = tx < -9000;
    tx = e.clientX;
    ty = e.clientY;
    if (first || !wantPresent) {
      sx = tx;
      sy = ty;
    }
    wantPresent = true;
    wantHover = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
    lastMove = performance.now();

    // Percikan sebanding kecepatan gerak (px per event), dibatasi supaya tidak membanjiri.
    const dist = first ? 0 : Math.hypot(dx, dy);
    const count = Math.min(3, Math.floor(dist / 16));
    for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
      const jitter = 5;
      particles.push({
        x: tx + (Math.random() - 0.5) * jitter * 2,
        y: ty + (Math.random() - 0.5) * jitter * 2,
        vx: -dx * 2.2 + (Math.random() - 0.5) * 50,
        vy: -dy * 2.2 + (Math.random() - 0.5) * 50,
        born: clock,
        life: 0.5 + Math.random() * 0.45,
        size: 1.2 + Math.random() * 1.6,
        gold: Math.random() < 0.3,
      });
    }
    ensureLoop();
  };
  const onLeave = () => {
    wantPresent = false;
    ensureLoop();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  window.addEventListener("blur", onLeave);
  const themeObserver = new MutationObserver(() => {
    pal = readPalette();
    paintSpot();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  resize();

  // ---- loop ----
  function frame(now: number) {
    raf = 0;
    if (document.visibilityState === "hidden") return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    clock += dt;

    sx += (tx - sx) * (1 - Math.exp(-dt * 18));
    sy += (ty - sy) * (1 - Math.exp(-dt * 18));
    present += ((wantPresent ? 1 : 0) - present) * (1 - Math.exp(-dt * 9));
    hover += ((wantHover ? 1 : 0) - hover) * (1 - Math.exp(-dt * 12));

    ctx!.clearRect(0, 0, w, h);
    const { primary, gold, dark } = pal;

    // sorot lembut
    if (present > 0.01) {
      const radius = 104 * (1 + 0.35 * hover);
      ctx!.globalAlpha = clamp((dark ? 0.2 : 0.11) * present * (1 + 0.5 * hover), 0, 1);
      ctx!.drawImage(spot, sx - radius, sy - radius, radius * 2, radius * 2);
      ctx!.globalAlpha = 1;
      // cincin kecil saat di atas elemen interaktif
      if (hover > 0.02) {
        ctx!.strokeStyle = rgba(gold, 0.55 * hover * present);
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 14 + 8 * hover, 0, TAU);
        ctx!.stroke();
      }
    }

    // jejak percikan: dikelompokkan per warna × tingkat alpha
    const buckets: Particle[][] = Array.from({ length: 2 * ALPHA_LEVELS }, () => []);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = clock - p.born;
      if (age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * 3);
      p.vy *= Math.exp(-dt * 3);
      const k = 1 - age / p.life;
      buckets[(p.gold ? ALPHA_LEVELS : 0) + Math.min(ALPHA_LEVELS - 1, Math.floor(k * ALPHA_LEVELS))].push(p);
    }
    if (dark) ctx!.globalCompositeOperation = "lighter";
    for (let b = 0; b < buckets.length; b++) {
      const list = buckets[b];
      if (!list.length) continue;
      const level = (b % ALPHA_LEVELS) + 1;
      ctx!.fillStyle = rgba(b >= ALPHA_LEVELS ? gold : primary, (level / ALPHA_LEVELS) * 0.85);
      ctx!.beginPath();
      for (const p of list) {
        const k = 1 - (clock - p.born) / p.life;
        const r = p.size * (0.5 + 0.5 * k);
        ctx!.moveTo(p.x + r, p.y);
        ctx!.arc(p.x, p.y, r, 0, TAU);
      }
      ctx!.fill();
    }
    ctx!.globalCompositeOperation = "source-over";
    drawn = true;

    // Lanjut hanya selama ada gerakan, partikel, atau fade berlangsung.
    const idleFor = performance.now() - lastMove;
    const settling = Math.abs(tx - sx) > 0.5 || Math.abs(ty - sy) > 0.5 || (wantPresent ? present < 0.99 : present > 0.01);
    if (particles.length > 0 || settling || idleFor < 400 || Math.abs((wantHover ? 1 : 0) - hover) > 0.01) {
      raf = requestAnimationFrame(frame);
    } else if (!wantPresent || idleFor > 400) {
      // Diam: sorot tetap tergambar sampai kursor pergi; berhenti menggambar ulang.
      if (!wantPresent) ctx!.clearRect(0, 0, w, h);
    }
  }

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onLeave);
    themeObserver.disconnect();
    sizeObserver.disconnect();
    if (drawn) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
