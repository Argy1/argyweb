import { readChipTarget } from "@/components/three/anchorTracker";
import { chipMotion, useChipStore } from "@/components/three/chipStore";
import { clamp, mixRgba, readPalette, rgba } from "./palette";
import { drainSignals } from "./signals";

/**
 * Latar "papan sirkuit hidup" (Canvas 2D, bukan WebGL supaya ringan).
 *
 * Menggambar sendiri grid 72px yang sama dengan `.bg-circuit` (grid CSS dimatikan setelah frame pertama,
 * lihat html[data-bg="live"] di globals.css), lalu menambah:
 *  - gelombang diagonal pada titik persimpangan,
 *  - jalur bersiku dengan kilatan cahaya (biru, sesekali emas/ungu) yang berujung di node,
 *  - kursor: titik & garis di sekitarnya menyala dan terdorong; klik/ketuk melepas riak,
 *  - chip 3D "menyalakan" papan di sekelilingnya (aura + cincin gelombang yang memancar),
 *  - percikan acak, dan kecepatan animasi bertambah saat scroll.
 * Warna dibaca dari token CSS (tema terang/gelap), tidak ada hex di sini.
 */

const CELL = 72;
const TAU = Math.PI * 2;
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const SEG_LEVELS = 6;
const SEG_BUCKETS = SEG_LEVELS * 2;
const DOT_LEVELS = 5;
const PULSE_SEGS = 6;

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Pulse {
  speed: number;
  offset: number;
  period: number;
  tail: number;
}

interface Trace {
  pts: [number, number][];
  cum: number[];
  len: number;
  born: number;
  life: number;
  seed: number;
  pulses: Pulse[];
}

interface Spark {
  idx: number;
  born: number;
  life: number;
  gold: boolean;
}

interface Ripple {
  x: number;
  y: number;
  born: number;
  /** Sinyal navigasi: lebih besar, lebih cepat, berona emas. */
  big?: boolean;
}

const rippleSpeed = (r: Ripple) => (r.big ? 900 : 480);
const rippleLife = (r: Ripple) => (r.big ? 1.5 : 1.6);

export interface CircuitOptions {
  /** Dipanggil bila pemantau FPS menyerah (perangkat tidak mampu); mesin sudah berhenti saat ini dipanggil. */
  onGiveUp?: () => void;
}

export function startCircuitBackground(canvas: HTMLCanvasElement, opts: CircuitOptions = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const root = document.documentElement;
  const coarse = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  let lite = coarse;
  let pal = readPalette();

  let w = 0;
  let h = 0;
  let dpr = 1;
  let nx = 0;
  let ny = 0;
  let X = new Float32Array(0);
  let Y = new Float32Array(0);
  let E = new Float32Array(0);
  let G = new Float32Array(0);
  let W = new Float32Array(0);
  let traces: Trace[] = [];
  const sparks: Spark[] = [];
  const ripples: Ripple[] = [];
  const segBuckets: number[][] = Array.from({ length: SEG_BUCKETS }, () => []);

  // Sprite aura chip: gradien radial dibuat sekali per palet; menggambar sprite jauh lebih murah
  // daripada mengisi gradien layar penuh tiap frame.
  const aura = document.createElement("canvas");
  aura.width = 128;
  aura.height = 128;
  const paintAura = () => {
    const actx = aura.getContext("2d");
    if (!actx) return;
    actx.clearRect(0, 0, 128, 128);
    const g = actx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, rgba(pal.primary, 1));
    g.addColorStop(0.45, rgba(pal.primary, 0.42));
    g.addColorStop(1, rgba(pal.primary, 0));
    actx.fillStyle = g;
    actx.fillRect(0, 0, 128, 128);
  };
  paintAura();

  // Sprite titik tenang (5 tingkat gelombang): di-blit, jauh lebih murah daripada ratusan arc per frame.
  let dotSprites: HTMLCanvasElement[] = [];
  const paintDots = () => {
    dotSprites = [];
    for (let b = 0; b < DOT_LEVELS; b++) {
      const wb = (b + 0.5) / DOT_LEVELS;
      const r = 1.4 + wb * 0.7;
      const size = Math.ceil((r * 2 + 2) * dpr);
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const cctx = c.getContext("2d");
      if (cctx) {
        cctx.fillStyle = rgba(pal.primary, Math.min(0.85, pal.dotA * (0.62 + 0.7 * wb)));
        cctx.beginPath();
        cctx.arc(size / 2, size / 2, r * dpr, 0, TAU);
        cctx.fill();
      }
      dotSprites.push(c);
    }
  };

  // ---- jalur ----
  function makeTrace(now: number, stagger: boolean): Trace {
    let nodes: [number, number][] = [];
    for (let attempt = 0; attempt < 14 && nodes.length < 3; attempt++) {
      let i = 1 + Math.floor(Math.random() * Math.max(1, nx - 2));
      let j = 1 + Math.floor(Math.random() * Math.max(1, ny - 2));
      let dir = Math.floor(Math.random() * 4);
      nodes = [[i, j]];
      const segs = 3 + Math.floor(Math.random() * (lite ? 3 : 5));
      for (let s = 0; s < segs; s++) {
        if (s > 0) dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        const run = 1 + Math.floor(Math.random() * 3);
        let ok = false;
        for (let tries = 0; tries < 2 && !ok; tries++) {
          const ni = i + DIRS[dir][0] * run;
          const nj = j + DIRS[dir][1] * run;
          if (ni >= 0 && ni < nx && nj >= 0 && nj < ny) {
            i = ni;
            j = nj;
            nodes.push([i, j]);
            ok = true;
          } else dir = (dir + 2) % 4;
        }
        if (!ok) break;
      }
    }
    const pts = nodes.map(([i, j]) => [i * CELL + 0.5, j * CELL + 0.5] as [number, number]);
    const cum = [0];
    for (let k = 1; k < pts.length; k++) {
      cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    }
    const len = cum[cum.length - 1] || 1;
    const life = 9 + Math.random() * 8;
    const pulseCount = len > 480 && !lite ? 2 : 1;
    const pulses: Pulse[] = [];
    for (let p = 0; p < pulseCount; p++) {
      const tail = 70 + Math.random() * 70;
      const period = len + tail + 160 + Math.random() * 520;
      pulses.push({
        speed: (lite ? 150 : 190) + Math.random() * (lite ? 80 : 130),
        offset: Math.random() * period,
        period,
        tail,
      });
    }
    return { pts, cum, len, born: stagger ? now - Math.random() * life * 0.7 : now, life, seed: Math.random() * 1000, pulses };
  }

  function pointAt(tr: Trace, d: number, out: [number, number]) {
    const dist = clamp(d, 0, tr.len);
    let k = 1;
    while (k < tr.cum.length - 1 && tr.cum[k] < dist) k++;
    const span = tr.cum[k] - tr.cum[k - 1] || 1;
    const f = (dist - tr.cum[k - 1]) / span;
    out[0] = tr.pts[k - 1][0] + (tr.pts[k][0] - tr.pts[k - 1][0]) * f;
    out[1] = tr.pts[k - 1][1] + (tr.pts[k][1] - tr.pts[k - 1][1]) * f;
  }

  function traceCount() {
    return lite ? clamp(Math.round((w * h) / 65000), 5, 9) : clamp(Math.round((w * h) / 80000), 8, 22);
  }

  const resize = () => {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return;
    const nextDpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    if (nextDpr !== dpr || !dotSprites.length) {
      dpr = nextDpr;
      paintDots();
    }
    const pw = Math.round(cw * dpr);
    const ph = Math.round(ch * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = cw;
    h = ch;
    const nnx = Math.floor(cw / CELL) + 2;
    const nny = Math.floor(ch / CELL) + 2;
    if (nnx !== nx || nny !== ny) {
      nx = nnx;
      ny = nny;
      const n = nx * ny;
      X = new Float32Array(n);
      Y = new Float32Array(n);
      E = new Float32Array(n);
      G = new Float32Array(n);
      W = new Float32Array(n);
      sparks.length = 0;
      traces = Array.from({ length: traceCount() }, () => makeTrace(t, true));
    }
  };

  // ---- input ----
  let ptrX = -9999;
  let ptrY = -9999;
  let ptrTX = -9999;
  let ptrTY = -9999;
  let ptrOn = false;
  let ptrStrength = 0;
  let touchTimer: number | undefined;
  const onMove = (e: PointerEvent) => {
    ptrTX = e.clientX;
    ptrTY = e.clientY;
    if (!ptrOn) {
      ptrX = ptrTX;
      ptrY = ptrTY;
    }
    ptrOn = true;
    window.clearTimeout(touchTimer);
  };
  const onDown = (e: PointerEvent) => {
    onMove(e);
    if (ripples.length >= 4) ripples.shift();
    ripples.push({ x: e.clientX, y: e.clientY, born: t });
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") touchTimer = window.setTimeout(() => (ptrOn = false), 350);
  };
  const onLeave = () => (ptrOn = false);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("pointercancel", onLeave, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  window.addEventListener("blur", onLeave);

  const themeObserver = new MutationObserver(() => {
    pal = readPalette();
    paintAura();
    paintDots();
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);

  // ---- loop ----
  let t = 0;
  let raf = 0;
  let last = 0;
  let lastSY = window.scrollY;
  let boost = 0;
  let chipO = 0;
  let nextSpark = 0.6;
  let workEMA = 0;
  let frames = 0;
  let revealed = false;
  let done = false;
  const tmp: [number, number] = [0, 0];
  const tmp2: [number, number] = [0, 0];

  resize();

  // Pemantau FPS nyata (bukan hanya waktu JS): di perangkat tanpa akselerasi GPU, canvas 2D bisa membuat
  // seluruh halaman tersendat. Turun ke mode ringan, lalu berhenti dan kembali ke grid CSS statis.
  // `?bgforce` mematikan pemantau (untuk debugging).
  const force = /[?&]bgforce/.test(window.location.search);
  let prevNow = 0;
  let sumMs = 0;
  let countMs = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      last = 0;
      prevNow = 0;
      return;
    }
    const interval = prevNow ? now - prevNow : 16.7;
    prevNow = now;
    if (!force && t > 2.5 && interval < 250) {
      sumMs += interval;
      if (++countMs >= 45) {
        const avg = sumMs / countMs;
        sumMs = 0;
        countMs = 0;
        if (!lite && avg > 26) {
          lite = true;
          traces = traces.slice(0, traceCount());
        } else if (lite && avg > 28) {
          cleanup();
          opts.onGiveUp?.();
          return;
        }
      }
    }
    if (lite && last && now - last < 31) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    const work0 = performance.now();
    if (!w) return;

    const sy = window.scrollY;
    const sv = Math.abs(sy - lastSY) / Math.max(dt, 0.001);
    lastSY = sy;
    boost += (clamp(sv / 1200, 0, 1) - boost) * (1 - Math.exp(-dt * 5));
    t += dt * (1 + boost * 1.6);
    const fade = clamp(t / 1.6, 0, 1);

    ptrX += (ptrTX - ptrX) * (1 - Math.exp(-dt * 16));
    ptrY += (ptrTY - ptrY) * (1 - Math.exp(-dt * 16));
    ptrStrength += ((ptrOn ? 1 : 0) - ptrStrength) * (1 - Math.exp(-dt * 6));

    // Posisi chip di layar (ditulis <Chip> tiap frame); tanpa WebGL pakai anchor hero.
    let cx = 0;
    let cy = 0;
    let cr = 0;
    let co = 0;
    if (useChipStore.getState().webgl === "on") {
      const s = chipMotion.screen;
      cx = s.x;
      cy = s.y;
      cr = s.r;
      co = s.opacity;
    } else {
      const tg = readChipTarget();
      if (tg.visible && tg.id !== "intro") {
        cx = tg.cx;
        cy = tg.cy;
        cr = Math.min(tg.w, tg.h) * 0.46;
        co = tg.opacity;
      }
    }
    chipO += (co - chipO) * (1 - Math.exp(-dt * 4));
    const gi = 1 + Math.min(1.4, chipMotion.glow);
    const chipOn = chipO > 0.01 && cr > 8;

    // percikan acak (emas sesekali)
    if (t > nextSpark && sparks.length < (lite ? 5 : 10)) {
      sparks.push({ idx: Math.floor(Math.random() * nx * ny), born: t, life: 1.5 + Math.random() * 1.2, gold: Math.random() < 0.55 });
      nextSpark = t + (lite ? 0.55 : 0.3) + Math.random() * 0.5;
    }
    for (let s = sparks.length - 1; s >= 0; s--) if (t - sparks[s].born > sparks[s].life) sparks.splice(s, 1);
    for (let r = ripples.length - 1; r >= 0; r--) if (t - ripples[r].born > rippleLife(ripples[r])) ripples.splice(r, 1);
    drainSignals((x, y) => {
      if (ripples.length >= 4) ripples.shift();
      ripples.push({ x, y, born: t, big: true });
    });

    const R = coarse ? 150 : 190;
    const R2 = R * R;
    const chipR = cr * 3;

    // ---- medan per titik ----
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const idx = j * nx + i;
        const x0 = i * CELL + 0.5;
        const y0 = j * CELL + 0.5;
        let x = x0;
        let y = y0;
        let e = 0;
        let g = 0;
        W[idx] = 0.5 + 0.28 * Math.sin(i * 0.55 + j * 0.38 - t * 1.15) + 0.22 * Math.sin(i * 0.21 - j * 0.47 + t * 0.7);

        if (ptrStrength > 0.01) {
          const dx = x0 - ptrX;
          const dy = y0 - ptrY;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            const f2 = f * f;
            e += f2 * 1.1 * ptrStrength;
            g = Math.max(g, clamp((f - 0.55) / 0.4, 0, 1) * ptrStrength);
            const push = f2 * 18 * ptrStrength;
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
        }

        if (chipOn) {
          const d = Math.hypot(x0 - cx, y0 - cy);
          if (d < chipR) {
            const fall = Math.pow(1 - d / chipR, 1.5);
            const ring = Math.pow(Math.max(0, Math.sin(d / 38 - t * 2.4)), 3);
            e += fall * (0.3 + 0.9 * ring) * chipO * gi * fade;
          }
        }

        for (let r = 0; r < ripples.length; r++) {
          const rp = ripples[r];
          const age = t - rp.born;
          const k = 1 - age / rippleLife(rp);
          const d = Math.hypot(x0 - rp.x, y0 - rp.y);
          const dd = (d - age * rippleSpeed(rp)) / (rp.big ? 64 : 46);
          if (k > 0 && dd > -2.4 && dd < 2.4) {
            e += Math.exp(-dd * dd) * k * (rp.big ? 1.35 : 1.1);
            g = Math.max(g, (rp.big ? 0.9 : 0.5) * k);
          }
        }

        X[idx] = x;
        Y[idx] = y;
        E[idx] = e;
        G[idx] = g;
      }
    }
    for (let s = 0; s < sparks.length; s++) {
      const sp = sparks[s];
      if (sp.idx >= nx * ny) continue;
      const env = Math.sin(clamp((t - sp.born) / sp.life, 0, 1) * Math.PI);
      E[sp.idx] += env * 0.95;
      if (sp.gold) G[sp.idx] = Math.max(G[sp.idx], env);
      const i = sp.idx % nx;
      if (i > 0) E[sp.idx - 1] += env * 0.35;
      if (i < nx - 1) E[sp.idx + 1] += env * 0.35;
      if (sp.idx >= nx) E[sp.idx - nx] += env * 0.35;
      if (sp.idx < nx * (ny - 1)) E[sp.idx + nx] += env * 0.35;
    }

    // ---- gambar ----
    ctx.clearRect(0, 0, w, h);
    const { primary, gold, violet, dark } = pal;

    // Dikelompokkan per gaya (satu path/stroke per kelompok) supaya jumlah draw call kecil; penting di
    // perangkat tanpa akselerasi GPU untuk canvas 2D.
    if (chipOn) {
      const ar = cr * 2.8;
      ctx.globalAlpha = clamp((dark ? 0.26 : 0.16) * chipO * gi * fade, 0, 1);
      ctx.drawImage(aura, cx - ar, cy - ar, ar * 2, ar * 2);
      ctx.globalAlpha = 1;
    }

    // grid dasar (polyline per baris/kolom, ikut terdorong)
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(pal.grid, pal.gridA);
    ctx.beginPath();
    for (let j = 0; j < ny; j++) {
      ctx.moveTo(X[j * nx], Y[j * nx]);
      for (let i = 1; i < nx; i++) ctx.lineTo(X[j * nx + i], Y[j * nx + i]);
    }
    for (let i = 0; i < nx; i++) {
      ctx.moveTo(X[i], Y[i]);
      for (let j = 1; j < ny; j++) ctx.lineTo(X[j * nx + i], Y[j * nx + i]);
    }
    ctx.stroke();

    // segmen yang menyala (kursor, chip, riak, percikan): 6 tingkat terang Ã— (biru | emas)
    for (let b = 0; b < SEG_BUCKETS; b++) segBuckets[b].length = 0;
    const collect = (a: number, b: number) => {
      const em = (E[a] + E[b]) * 0.5;
      if (em < 0.05) return;
      const level = Math.min(SEG_LEVELS - 1, Math.floor(em * 5));
      segBuckets[level * 2 + ((G[a] + G[b]) * 0.5 > 0.4 ? 1 : 0)].push(a, b);
    };
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const idx = j * nx + i;
        if (i < nx - 1) collect(idx, idx + 1);
        if (j < ny - 1) collect(idx, idx + nx);
      }
    }
    for (let b = 0; b < SEG_BUCKETS; b++) {
      const list = segBuckets[b];
      if (!list.length) continue;
      const em = ((b >> 1) + 0.5) / 5;
      const alpha = Math.min(0.6, em * 0.5 + 0.04);
      ctx.strokeStyle = b & 1 ? mixRgba(primary, gold, 0.85, alpha) : rgba(primary, alpha);
      ctx.lineWidth = 1 + Math.min(1, em) * 0.9;
      ctx.beginPath();
      for (let q = 0; q < list.length; q += 2) {
        ctx.moveTo(X[list[q]], Y[list[q]]);
        ctx.lineTo(X[list[q + 1]], Y[list[q + 1]]);
      }
      ctx.stroke();
    }

    // jalur + kilatan
    if (dark) ctx.globalCompositeOperation = "lighter";
    const pulseA = dark ? 0.9 : 0.72;
    for (let k = 0; k < traces.length; k++) {
      let tr = traces[k];
      if (t - tr.born > tr.life) {
        tr = makeTrace(t, false);
        traces[k] = tr;
      }
      const age = t - tr.born;
      const env = clamp(age / 1.4, 0, 1) * clamp((tr.life - age) / 1.4, 0, 1) * fade;
      if (env <= 0.01) continue;

      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.strokeStyle = rgba(primary, (dark ? 0.2 : 0.15) * env);
      ctx.beginPath();
      ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
      for (let p = 1; p < tr.pts.length; p++) ctx.lineTo(tr.pts[p][0], tr.pts[p][1]);
      ctx.stroke();

      // via di tiap tikungan + inti pad di kedua ujung (satu fill), cincin pad (satu stroke)
      const first = tr.pts[0];
      const last = tr.pts[tr.pts.length - 1];
      ctx.fillStyle = rgba(primary, 0.42 * env);
      ctx.beginPath();
      for (let p = 1; p < tr.pts.length - 1; p++) {
        ctx.moveTo(tr.pts[p][0] + 2.2, tr.pts[p][1]);
        ctx.arc(tr.pts[p][0], tr.pts[p][1], 2.2, 0, TAU);
      }
      ctx.moveTo(first[0] + 2.4, first[1]);
      ctx.arc(first[0], first[1], 2.4, 0, TAU);
      ctx.moveTo(last[0] + 2.4, last[1]);
      ctx.arc(last[0], last[1], 2.4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = rgba(primary, 0.4 * env);
      ctx.beginPath();
      ctx.moveTo(first[0] + 5, first[1]);
      ctx.arc(first[0], first[1], 5, 0, TAU);
      ctx.moveTo(last[0] + 5, last[1]);
      ctx.arc(last[0], last[1], 5, 0, TAU);
      ctx.stroke();

      for (let p = 0; p < tr.pulses.length; p++) {
        const pu = tr.pulses[p];
        const prog = t * pu.speed + pu.offset;
        const cycle = Math.floor(prog / pu.period);
        const head = prog - cycle * pu.period;
        if (head - pu.tail > tr.len + 50) continue;
        const roll = hash(tr.seed + p * 13.7 + cycle * 7.1);
        const col = roll < 0.66 ? primary : roll < 0.88 ? gold : violet;

        ctx.lineCap = "round";
        for (let s = 0; s < PULSE_SEGS; s++) {
          const a = head - (pu.tail * (s + 1)) / PULSE_SEGS;
          const b = head - (pu.tail * s) / PULSE_SEGS;
          if (b <= 0 || a >= tr.len) continue;
          pointAt(tr, Math.max(a, 0), tmp);
          pointAt(tr, Math.min(b, tr.len), tmp2);
          ctx.strokeStyle = rgba(col, pulseA * env * Math.pow(1 - s / PULSE_SEGS, 1.3));
          ctx.lineWidth = 2.6 - s * 0.28;
          ctx.beginPath();
          ctx.moveTo(tmp[0], tmp[1]);
          ctx.lineTo(tmp2[0], tmp2[1]);
          ctx.stroke();
        }
        if (head > 0 && head < tr.len) {
          pointAt(tr, head, tmp);
          ctx.fillStyle = rgba(col, 0.2 * env);
          ctx.beginPath();
          ctx.arc(tmp[0], tmp[1], 9, 0, TAU);
          ctx.fill();
          ctx.fillStyle = rgba(col, 0.95 * env);
          ctx.beginPath();
          ctx.arc(tmp[0], tmp[1], 2.5, 0, TAU);
          ctx.fill();
        } else if (head >= tr.len && head < tr.len + 60) {
          // tiba di ujung: cincin memancar dari pad
          const f = (head - tr.len) / 60;
          ctx.strokeStyle = rgba(col, 0.6 * (1 - f) * env);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(last[0], last[1], 5 + f * 20, 0, TAU);
          ctx.stroke();
        }
      }
    }
    ctx.lineCap = "butt";
    ctx.globalCompositeOperation = "source-over";

    // titik persimpangan: yang tenang di-blit dari sprite, yang menyala digambar satu per satu
    const total = nx * ny;
    for (let idx = 0; idx < total; idx++) {
      if (E[idx] >= 0.05) continue;
      const sp = dotSprites[Math.min(DOT_LEVELS - 1, Math.max(0, Math.floor(W[idx] * DOT_LEVELS)))];
      const sz = sp.width / dpr;
      ctx.drawImage(sp, X[idx] - sz / 2, Y[idx] - sz / 2, sz, sz);
    }
    for (let idx = 0; idx < total; idx++) {
      const e = E[idx];
      if (e < 0.05) continue;
      const wv = W[idx];
      const gm = G[idx];
      const r = 1.4 + wv * 0.7 + e * 2.4;
      if (e > 0.3 && !lite) {
        ctx.fillStyle = mixRgba(primary, gold, gm, 0.1 * Math.min(e, 1.2));
        ctx.beginPath();
        ctx.arc(X[idx], Y[idx], r * 3, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = mixRgba(primary, gold, gm, Math.min(0.85, pal.dotA * (0.62 + 0.7 * wv) + e * 0.7));
      ctx.beginPath();
      ctx.arc(X[idx], Y[idx], r, 0, TAU);
      ctx.fill();
    }

    // riak klik/ketuk
    for (let r = 0; r < ripples.length; r++) {
      const rp = ripples[r];
      const age = t - rp.born;
      const k = Math.max(0, 1 - age / rippleLife(rp));
      ctx.strokeStyle = rp.big ? mixRgba(primary, gold, 0.8, 0.5 * k) : rgba(primary, 0.35 * k);
      ctx.lineWidth = rp.big ? 2 : 1.5;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, age * rippleSpeed(rp), 0, TAU);
      ctx.stroke();
    }

    if (!revealed) {
      // Frame pertama identik dengan grid CSS; baru setelah itu grid CSS dimatikan (tanpa kedipan).
      revealed = true;
      root.dataset.bg = "live";
    }

    // Jaga performa: bila kerja per frame terlalu berat, turun ke mode ringan (30fps, tanpa halo).
    workEMA += (performance.now() - work0 - workEMA) * 0.05;
    if (!lite && ++frames > 90 && workEMA > 7) {
      lite = true;
      traces = traces.slice(0, traceCount());
    }
  };

  raf = requestAnimationFrame(frame);

  const cleanup = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(touchTimer);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onLeave);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onLeave);
    themeObserver.disconnect();
    sizeObserver.disconnect();
    delete root.dataset.bg;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return cleanup;
}
