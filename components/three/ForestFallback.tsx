import type { ForestLight } from "@/lib/three/forest";
import { cn } from "@/lib/utils";

const W = 1440;
const H = 900;
const FAR_BANK = 470;
const NEAR_BANK = 586;
const SHADE = "#07100c";

type Palette = {
  skyTop: string;
  skyBottom: string;
  fog: string;
  sun: string;
  canopy: string;
  trunk: string;
  ground: string;
  grass: string;
  shallow: string;
  deep: string;
  source: { x: number; y: number; r: number };
  disc: number;
  shafts: number;
  stars: number;
  sparks: number;
  sparkTint: string;
};

// Mirrors ENVIRONMENTS in lib/three/forest.ts so the canvas takes over without a colour shift.
const PALETTES: Record<ForestLight, Palette> = {
  dawn: {
    skyTop: "#395a52", skyBottom: "#f6d8b0", fog: "#e0cbaa", sun: "#ffc078", canopy: "#1d3a2a",
    trunk: "#241f18", ground: "#35523d", grass: "#243a2b", shallow: "#b7cfc2", deep: "#54786f",
    source: { x: 1010, y: 330, r: 30 }, disc: 1, shafts: 0.5, stars: 0.25, sparks: 0, sparkTint: "#ffd98d",
  },
  day: {
    skyTop: "#4a7a86", skyBottom: "#f1e6c8", fog: "#cbd6c2", sun: "#fff0c4", canopy: "#23452f",
    trunk: "#2a2419", ground: "#2b4231", grass: "#20372a", shallow: "#c3d8ce", deep: "#5a7f78",
    source: { x: 1112, y: 168, r: 34 }, disc: 0.85, shafts: 0.34, stars: 0, sparks: 0, sparkTint: "#ffd98d",
  },
  dusk: {
    skyTop: "#3b2c3d", skyBottom: "#e9a877", fog: "#b98668", sun: "#ffb26a", canopy: "#18271f",
    trunk: "#1b150f", ground: "#1b2a20", grass: "#142117", shallow: "#8e7f74", deep: "#2c3c42",
    source: { x: 962, y: 402, r: 40 }, disc: 0.95, shafts: 0.55, stars: 0.2, sparks: 0, sparkTint: "#ffcf9a",
  },
  night: {
    skyTop: "#081420", skyBottom: "#1d3547", fog: "#142634", sun: "#f4e9cd", canopy: "#0d1d18",
    trunk: "#0d1110", ground: "#101d19", grass: "#0b1612", shallow: "#4d7280", deep: "#122630",
    source: { x: 1084, y: 196, r: 26 }, disc: 1, shafts: 0.18, stars: 1, sparks: 1, sparkTint: "#ffe3a3",
  },
  fire: {
    skyTop: "#1a1114", skyBottom: "#8a4a30", fog: "#5c3526", sun: "#ffa05a", canopy: "#14100f",
    trunk: "#110c09", ground: "#1a120f", grass: "#120c0a", shallow: "#6b4a44", deep: "#2a1d1c",
    source: { x: 900, y: 452, r: 20 }, disc: 0.35, shafts: 0.42, stars: 0.35, sparks: 0.9, sparkTint: "#ff9a4e",
  },
};

const f = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

function mix(a: string, b: string, t: number) {
  const x = parseInt(a.slice(1), 16);
  const y = parseInt(b.slice(1), 16);
  const part = (shift: number, mask: number) => {
    const from = (x >> shift) & mask;
    const to = (y >> shift) & mask;
    return Math.max(0, Math.min(255, Math.round(from + (to - from) * t)));
  };
  const h2 = (v: number) => v.toString(16).padStart(2, "0");
  return `#${h2(part(16, 255))}${h2(part(8, 255))}${h2(part(0, 255))}`;
}

// Deterministic: the fallback is server-rendered, so the scene must not shift between passes.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];

function curve(pts: Pt[], closed: boolean) {
  if (pts.length < 2) return "";
  const at = (i: number): Pt => pts[(i + pts.length) % pts.length] ?? [0, 0];
  const head = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  const span = closed ? pts.length : pts.length - 1;
  let d = head;
  for (let i = 0; i < span; i += 1) {
    const p0 = at(closed ? i - 1 : Math.max(0, i - 1));
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(closed ? i + 2 : Math.min(pts.length - 1, i + 2));
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

function wave(x0: number, x1: number, baseY: number, amp: number, rand: () => number, steps = 26, harmonics = 4): Pt[] {
  const phases = Array.from({ length: harmonics }, () => rand() * Math.PI * 2);
  const freqs = Array.from({ length: harmonics }, (_, i) => (1.3 + i * 1.9) * (0.7 + rand() * 0.7));
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    let v = 0;
    for (let h = 0; h < harmonics; h += 1) v += Math.sin(t * Math.PI * 2 * freqs[h]! + phases[h]!) / (h + 1.3);
    pts.push([x0 + (x1 - x0) * t, baseY + v * amp]);
  }
  return pts;
}

function blob(cx: number, cy: number, rx: number, ry: number, rand: () => number, lumps = 7, jitter = 0.3) {
  const phases = Array.from({ length: lumps }, () => rand() * Math.PI * 2);
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    let m = 1;
    for (let k = 0; k < lumps; k += 1) m += Math.sin(a * (k + 2) + phases[k]!) * (jitter / (k + 1.6));
    pts.push([cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m]);
  }
  return curve(pts, true);
}

function limb(x0: number, y0: number, x1: number, y1: number, width: number, rand: () => number) {
  const mx = (x0 + x1) / 2 + (rand() - 0.5) * Math.abs(y1 - y0) * 0.5;
  const my = (y0 + y1) / 2 + (rand() - 0.5) * Math.abs(x1 - x0) * 0.3;
  const w1 = width * 0.22;
  return `M${f(x0)} ${f(y0 - width)} Q${f(mx)} ${f(my - width * 0.7)} ${f(x1)} ${f(y1 - w1)} L${f(x1)} ${f(y1 + w1)} Q${f(
    mx,
  )} ${f(my + width * 0.7)} ${f(x0)} ${f(y0 + width)} Z`;
}

type Item = { d: string; fill: string; o: number };

// Grown from its own origin so instances can be placed with a transform instead of baked-in coordinates.
function tree(height: number, rand: () => number) {
  const lean = (rand() - 0.5) * height * 0.12;
  const bw = Math.max(1.6, height * 0.032);
  const tw = bw * 0.3;
  const top = -height;
  const trunk = [
    `M${f(-bw * 1.9)} 0 C${f(-bw)} ${f(-height * 0.18)} ${f(-bw * 0.9)} ${f(-height * 0.5)} ${f(-tw + lean * 0.6)} ${f(
      top + height * 0.22,
    )} L${f(tw + lean * 0.6)} ${f(top + height * 0.22)} C${f(tw + lean * 0.6)} ${f(-height * 0.5)} ${f(bw * 0.9)} ${f(
      -height * 0.18,
    )} ${f(bw * 1.9)} 0 Z`,
  ];
  const blobs: string[] = [];
  const crownY = top + height * 0.16;
  const limbs = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < limbs; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const t = 0.55 + (i / limbs) * 0.4;
    const by = -height * t;
    const reach = height * (0.15 + rand() * 0.13);
    const ex = lean * t + side * reach;
    const ey = by - reach * (0.35 + rand() * 0.4);
    trunk.push(limb(lean * t, by, ex, ey, Math.max(1, height * 0.014), rand));
    blobs.push(blob(ex, ey - height * 0.03, height * 0.1, height * 0.075, rand, 5, 0.36));
  }
  blobs.push(blob(lean, crownY, height * 0.26, height * 0.19, rand, 8, 0.22));
  const satellites = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < satellites; i += 1) {
    const a = rand() * Math.PI * 2;
    const r = 0.4 + rand() * 0.75;
    blobs.push(
      blob(
        lean + Math.cos(a) * height * 0.24 * r,
        crownY + Math.sin(a) * height * 0.16 * r,
        height * (0.09 + rand() * 0.07),
        height * (0.07 + rand() * 0.05),
        rand,
        6,
        0.34,
      ),
    );
  }
  return { trunk: trunk.join(" "), blobs };
}

function assemble(height: number, rand: () => number, trunkFill: string, canopyFill: () => string): Item[] {
  const t = tree(height, rand);
  const items: Item[] = [{ d: t.trunk, fill: trunkFill, o: 0.94 }];
  for (const b of t.blobs) items.push({ d: b, fill: canopyFill(), o: 0.86 + rand() * 0.14 });
  return items;
}

function treeline(baseY: number, radius: number, rand: () => number) {
  let d = `M0 ${f(baseY + 90)} L0 ${f(baseY)}`;
  let x = 0;
  while (x < W) {
    const r = radius * (0.55 + rand() * 0.95);
    x += r * 2;
    d += ` A${f(r)} ${f(r * (0.6 + rand() * 0.55))} 0 0 1 ${f(x)} ${f(baseY + (rand() - 0.5) * radius * 0.4)}`;
  }
  return `${d} L${W} ${f(baseY + 90)} Z`;
}

function buildScene(light: ForestLight) {
  const p = PALETTES[light];
  const night = light === "night";
  const rand = rng(light.length * 7919 + W);

  const prototypes: { id: string; items: Item[] }[] = [];
  const treeLayers = [
    { baseY: FAR_BANK - 4, hMin: 54, hMax: 96, count: 15, shapes: 3, blur: 2.4, haze: 0.62, seed: 3 },
    { baseY: FAR_BANK + 2, hMin: 96, hMax: 168, count: 10, shapes: 3, blur: 1.2, haze: 0.36, seed: 17 },
    { baseY: FAR_BANK + 8, hMin: 150, hMax: 232, count: 6, shapes: 6, blur: 0.6, haze: 0.17, seed: 29 },
    // Near-shore trees frame the clearing instead of filling it, matching the canvas camera.
    { baseY: NEAR_BANK + 66, hMin: 238, hMax: 322, count: 5, shapes: 5, blur: 0.7, haze: -1, seed: 41, at: [96, 268, 1338, 1178, 1436] },
  ].map((band, bi) => {
    const near = band.haze < 0;
    const hz = Math.max(0, band.haze);
    const canopy = near ? `url(#${light}-near)` : mix(p.canopy, p.fog, hz);
    const lit = near ? canopy : mix(canopy, p.sun, 0.16 * (1 - hz) + 0.05);
    const trunkFill = near ? mix(p.trunk, SHADE, 0.35) : mix(p.trunk, p.fog, hz * 0.9);
    const lr = rng(band.seed * 613 + light.length);
    const ids: string[] = [];
    for (let k = 0; k < band.shapes; k += 1) {
      const id = `${light}-t${bi}-${k}`;
      prototypes.push({ id, items: assemble(100, lr, trunkFill, () => (lr() > 0.55 ? lit : canopy)) });
      ids.push(id);
    }
    const uses = Array.from({ length: band.count }, (_, i) => {
      const x = band.at ? band.at[i % band.at.length]! : ((i + 0.15 + lr() * 0.72) / band.count) * (W + 120) - 60;
      const s = (band.hMin + lr() * (band.hMax - band.hMin)) / 100;
      const mirror = lr() > 0.5 ? -1 : 1;
      return {
        href: ids[i % ids.length]!,
        transform: `translate(${f(x)} ${f(band.baseY + (lr() - 0.5) * 12)}) scale(${r2(s * mirror)} ${r2(s)})`,
      };
    });
    return { blur: band.blur, uses };
  });

  // Defocused foreground mass, echoing the two framing canopy sprites.
  const fr = rng(4421);
  const foreBlobs: { d: string; fill: string; o: number }[] = [];
  for (const [cx, cy, r] of [[-40, 880, 250], [130, 962, 190], [1500, 872, 260], [1330, 968, 196]] as const) {
    foreBlobs.push({ d: blob(cx, cy, r, r * (0.55 + fr() * 0.4), fr, 8, 0.26), fill: mix(p.canopy, SHADE, 0.3 + fr() * 0.18), o: 0.7 });
  }
  const overhang: { d: string; fill: string; o: number }[] = [];
  for (let i = 0; i < 16; i += 1) {
    const x = i % 2 === 0 ? 120 + fr() * 420 : 900 + fr() * 520;
    overhang.push({
      d: blob(x, 24 + fr() * 116, 60 + fr() * 130, 34 + fr() * 60, fr, 7, 0.3),
      fill: mix(p.canopy, SHADE, 0.3 + fr() * 0.35),
      o: 0.5 + fr() * 0.4,
    });
  }

  const waterPts = wave(-40, W + 40, FAR_BANK, 9, rand);
  const nearPts = wave(-40, W + 40, NEAR_BANK, 16, rand);
  const waterPath = `${curve(waterPts, false)} L${W + 40} ${H} L-40 ${H} Z`;
  const groundPath = `${curve(nearPts, false)} L${W + 40} ${H} L-40 ${H} Z`;

  const streaks: { x: number; y: number; w: number; h: number; o: number }[] = [];
  const sr = rng(1289);
  for (let i = 0; i < 30; i += 1) {
    const y = FAR_BANK + 6 + sr() * (NEAR_BANK - FAR_BANK - 10);
    const under = Math.abs(sr() * 2 - 1) < 0.34 ? p.source.x : sr() * W;
    streaks.push({ x: under + (sr() - 0.5) * (90 + y * 0.5), y, w: 14 + sr() * 78, h: 1.4 + sr() * 2.2, o: 0.06 + sr() * 0.3 });
  }

  const shafts: string[] = [];
  const ar = rng(6107);
  for (let i = 0; i < 5; i += 1) {
    const a = (-26 + i * 6 + (ar() - 0.5) * 4) * (Math.PI / 180);
    const dx = -Math.sin(a);
    const dy = Math.cos(a);
    const px = -dy;
    const py = dx;
    const start = p.source.r * 1.4 + ar() * 90;
    const w0 = 9 + ar() * 16;
    const w1 = w0 * (1.9 + ar() * 1.2);
    const len = 620 + ar() * 200;
    const ox = p.source.x + dx * start;
    const oy = p.source.y + dy * start;
    shafts.push(
      `M${f(ox + px * w0)} ${f(oy + py * w0)} L${f(ox + dx * len + px * w1)} ${f(oy + dy * len + py * w1)} L${f(
        ox + dx * len - px * w1,
      )} ${f(oy + dy * len - py * w1)} L${f(ox - px * w0)} ${f(oy - py * w0)} Z`,
    );
  }

  const clouds: { d: string; o: number }[] = [];
  const cr = rng(3307);
  for (let i = 0; i < 7; i += 1) {
    const y = 90 + cr() * 250;
    clouds.push({
      d: blob(120 + cr() * (W - 240), y, 120 + cr() * 260, 16 + cr() * 34, cr, 7, 0.4),
      o: 0.1 + cr() * 0.22,
    });
  }

  const stars: { x: number; y: number; r: number; o: number }[] = [];
  const tr = rng(7717);
  for (let i = 0; i < 60; i += 1) {
    stars.push({ x: tr() * W, y: tr() * 380, r: 0.6 + tr() * 1.5, o: 0.15 + tr() * 0.75 });
  }

  const sparks: { x: number; y: number; r: number; o: number }[] = [];
  const gr = rng(5501);
  for (let i = 0; i < 26; i += 1) {
    const fire = light === "fire";
    sparks.push({
      x: fire ? 620 + gr() * 620 : gr() * W,
      y: fire ? 320 + gr() * 480 : FAR_BANK - 40 + gr() * 260,
      r: 2.5 + gr() * 7,
      o: 0.25 + gr() * 0.7,
    });
  }

  const blades: string[] = [];
  const br = rng(2203);
  for (let i = 0; i < 96; i += 1) {
    const depth = br();
    const baseY = 622 + depth * 300;
    const x = br() * (W + 80) - 40;
    const h = (20 + br() * 44) * (0.6 + depth * 1.6);
    const bend = (br() - 0.5) * h * 0.9;
    const w = Math.max(1, h * 0.07);
    blades.push(
      `M${f(x - w)} ${f(baseY)} Q${f(x + bend * 0.4)} ${f(baseY - h * 0.6)} ${f(x + bend)} ${f(baseY - h)} Q${f(
        x + bend * 0.4,
      )} ${f(baseY - h * 0.5)} ${f(x + w)} ${f(baseY)} Z`,
    );
  }

  const reeds: string[] = [];
  const rr = rng(8191);
  for (let i = 0; i < 22; i += 1) {
    const x = rr() * W;
    const y = NEAR_BANK - 4 + rr() * 14;
    const h = 26 + rr() * 46;
    reeds.push(limb(x, y, x + (rr() - 0.5) * 26, y - h, 1.6, rr));
  }

  const leaves: { d: string; o: number }[] = [];
  const lr2 = rng(1723);
  for (let i = 0; i < 10; i += 1) {
    const x = lr2() * W;
    const y = 180 + lr2() * 520;
    leaves.push({ d: blob(x, y, 6 + lr2() * 7, 2.6 + lr2() * 3, lr2, 4, 0.2), o: 0.3 + lr2() * 0.4 });
  }

  const pools: { d: string; o: number }[] = [];
  const pr = rng(9103);
  for (let i = 0; i < 6; i += 1) {
    pools.push({
      d: blob(180 + pr() * (W - 360), 660 + pr() * 200, 110 + pr() * 210, 16 + pr() * 30, pr, 6, 0.3),
      o: 0.02 + pr() * 0.045,
    });
  }

  const bushPts: string[] = [];
  const bu = rng(6607);
  for (let i = 0; i < 16; i += 1) {
    bushPts.push(blob(-20 + (i / 16) * (W + 60) + bu() * 40, NEAR_BANK + 8 + bu() * 22, 46 + bu() * 62, 14 + bu() * 20, bu, 6, 0.34));
  }

  return {
    p,
    night,
    prototypes,
    treeLayers,
    foreBlobs,
    overhang,
    farLine: treeline(FAR_BANK - 26, 15, rand),
    ridge: curve(wave(-40, W + 40, 424, 22, rand).concat([[W + 40, H], [-40, H]]), true),
    waterPath,
    groundPath,
    waterEdge: curve(waterPts, false),
    bankEdge: curve(nearPts, false),
    streaks,
    shafts,
    clouds,
    stars,
    sparks,
    blades,
    reeds,
    leaves,
    pools,
    bushes: bushPts,
    hare: harePath(),
  };
}

// Unit-space outline, placed with translate/scale so the stroke widths stay predictable.
function harePath() {
  return {
    body:
      "M-1.45 -0.15 C-1.78 -0.62 -1.62 -1.18 -1 -1.42 C-0.44 -1.66 0.36 -1.74 0.86 -1.56 C1.04 -1.78 1.24 -1.96 1.46 -2 " +
      "C1.88 -2.06 2.16 -1.8 2.1 -1.5 C2.04 -1.27 1.79 -1.17 1.54 -1.22 C1.3 -1.16 1.16 -0.95 1.1 -0.7 C1 -0.3 0.6 -0.05 0 -0.02 C-0.62 0.02 -1.16 -0.02 -1.45 -0.15 Z",
    ears:
      "M1.4 -1.94 q-0.06 -0.76 0.16 -1.06 q0.17 -0.22 0.29 0.05 q0.12 0.42 -0.1 1.03 z M1.62 -1.96 q0.18 -0.7 0.46 -0.92 q0.21 -0.14 0.25 0.15 q0.04 0.43 -0.44 0.83 z",
    tail: "M-1.42 -0.95 q-0.34 -0.12 -0.42 0.2 q-0.06 0.3 0.28 0.32 q0.3 0.02 0.28 -0.26 z",
    feet: "M-1.12 -0.14 q-0.34 0.12 -0.08 0.15 l0.92 -0.01 q0.2 -0.07 0.04 -0.16 z M0.92 -0.6 q0.14 0.4 0.06 0.56 l0.3 -0.01 q0.02 -0.31 -0.1 -0.56 z",
  };
}

const SCENES = new Map<ForestLight, ReturnType<typeof buildScene>>();

function scene(light: ForestLight) {
  let s = SCENES.get(light);
  if (!s) {
    s = buildScene(light);
    SCENES.set(light, s);
  }
  return s;
}

export function ForestFallback({ light, className }: { light: ForestLight; className?: string }) {
  const s = scene(light);
  const p = s.p;
  const id = (name: string) => `${light}-${name}`;

  const soilTop = mix(p.ground, p.fog, 0.3);
  const soilFront = mix(p.ground, SHADE, 0.5);
  const haze = mix(p.fog, p.sun, 0.18);

  const treeLayer = (i: number) => {
    const layer = s.treeLayers[i];
    if (!layer) return null;
    return (
      <g key={i} filter={`url(#${id(`haze${i}`)})`} opacity="0.96">
        {layer.uses.map((use, j) => (
          <use key={j} href={`#${use.href}`} transform={use.transform} />
        ))}
      </g>
    );
  };

  const shaftGroup = (opacity: number) => (
    <g opacity={opacity} filter={`url(#${id("beam")})`} style={{ mixBlendMode: "screen" }}>
      {s.shafts.map((d, i) => (
        <path key={i} d={d} fill={`url(#${id("shaft")})`} opacity={p.shafts} />
      ))}
    </g>
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.skyTop} />
            <stop offset="0.42" stopColor={mix(p.skyTop, p.skyBottom, 0.55)} />
            <stop offset="0.8" stopColor={p.skyBottom} />
            <stop offset="1" stopColor={haze} />
          </linearGradient>
          <linearGradient id={id("soil")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={soilTop} />
            <stop offset="0.35" stopColor={mix(p.ground, SHADE, 0.2)} />
            <stop offset="1" stopColor={soilFront} />
          </linearGradient>
          <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(p.shallow, p.deep, 0.45)} />
            <stop offset="0.26" stopColor={mix(p.shallow, p.deep, 0.65)} />
            <stop offset="0.62" stopColor={mix(p.deep, SHADE, 0.15)} />
            <stop offset="1" stopColor={mix(p.deep, SHADE, 0.5)} />
          </linearGradient>
          <linearGradient id={id("bank")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(p.shallow, p.ground, 0.5)} />
            <stop offset="1" stopColor={mix(p.ground, SHADE, 0.2)} />
          </linearGradient>
          <radialGradient id={id("bloom")}>
            <stop offset="0" stopColor={p.sun} stopOpacity="0.85" />
            <stop offset="0.35" stopColor={mix(p.sun, p.skyBottom, 0.5)} stopOpacity="0.32" />
            <stop offset="1" stopColor={p.sun} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("shaft")} gradientUnits="userSpaceOnUse" x1={p.source.x} y1={p.source.y} x2={p.source.x - 300} y2={H}>
            <stop offset="0" stopColor={p.sun} stopOpacity="0.42" />
            <stop offset="0.3" stopColor={p.sun} stopOpacity="0.13" />
            <stop offset="0.72" stopColor={p.sun} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("mist")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={haze} stopOpacity="0" />
            <stop offset="0.5" stopColor={haze} stopOpacity="0.75" />
            <stop offset="1" stopColor={haze} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("near")} x1="0.88" y1="0.06" x2="0.12" y2="1">
            <stop offset="0" stopColor={mix(p.canopy, p.sun, 0.26)} />
            <stop offset="0.45" stopColor={p.canopy} />
            <stop offset="1" stopColor={mix(p.canopy, SHADE, 0.55)} />
          </linearGradient>
          <linearGradient id={id("glint")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(p.sun, "#ffffff", 0.4)} stopOpacity="0.75" />
            <stop offset="1" stopColor={p.sun} stopOpacity="0" />
          </linearGradient>

          <filter id={id("soft")} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="0.9" />
          </filter>
          <filter id={id("leaf")} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="13" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
          {s.treeLayers.map((layer, i) => (
            <filter key={i} id={id(`haze${i}`)} x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency={`${0.014 + i * 0.007} ${0.03 + i * 0.012}`} numOctaves="2" seed={11 + i * 5} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={22 - i * 4} xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation={layer.blur} />
            </filter>
          ))}
          <filter id={id("cloud")} x="-30%" y="-60%" width="160%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="3" seed="19" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id={id("defocus")} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id={id("beam")} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="3" seed="23" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="72" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id={id("glow")} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <clipPath id={id("waterClip")}>
            <path d={s.waterPath} />
          </clipPath>
          <clipPath id={id("groundClip")}>
            <path d={s.groundPath} />
          </clipPath>
          <clipPath id={id("skyClip")}>
            <rect x="0" y="0" width={W} height={FAR_BANK + 6} />
          </clipPath>
          <clipPath id={id("frame")}>
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>

          {s.prototypes.map((proto) => (
            <g key={proto.id} id={proto.id}>
              {proto.items.map((item, j) => (
                <path key={j} d={item.d} fill={item.fill} opacity={item.o} />
              ))}
            </g>
          ))}
        </defs>

        <g clipPath={`url(#${id("frame")})`}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${id("sky")})`} />

          {p.stars > 0 ? (
            <g clipPath={`url(#${id("skyClip")})`} opacity={p.stars}>
              {s.stars.map((st, i) => (
                <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#f6f1de" opacity={st.o * (1 - st.y / 460)} />
              ))}
              <ellipse cx={720} cy={140} rx={620} ry={120} fill="#cfe0ea" opacity="0.05" filter={`url(#${id("cloud")})`} />
            </g>
          ) : null}

          <g clipPath={`url(#${id("skyClip")})`} filter={`url(#${id("cloud")})`}>
            {s.clouds.map((c, i) => (
              <path key={i} d={c.d} fill={mix(p.sun, p.skyTop, 0.35)} opacity={c.o} />
            ))}
          </g>

          <g opacity={p.disc}>
            <circle cx={p.source.x} cy={p.source.y} r={p.source.r * 7} fill={`url(#${id("bloom")})`} />
            <circle cx={p.source.x} cy={p.source.y} r={p.source.r} fill={s.night ? "#f7f0da" : p.sun} filter={`url(#${id("soft")})`} />
            {s.night ? (
              <g fill={mix(p.sun, p.skyTop, 0.35)} opacity="0.35">
                <circle cx={p.source.x - 8} cy={p.source.y - 6} r="6" />
                <circle cx={p.source.x + 6} cy={p.source.y + 9} r="4.5" />
                <circle cx={p.source.x + 11} cy={p.source.y - 10} r="3" />
              </g>
            ) : null}
          </g>

          <g filter={`url(#${id("cloud")})`}>
            <path d={s.ridge} fill={mix(p.fog, p.canopy, 0.28)} opacity="0.5" />
            <path d={s.farLine} fill={mix(p.canopy, p.fog, 0.78)} opacity="0.85" />
          </g>

          {[0, 1, 2].map(treeLayer)}

          <rect x="0" y={FAR_BANK - 86} width={W} height="112" fill={`url(#${id("mist")})`} opacity="0.32" />

          {shaftGroup(0.42)}

          <path d={s.waterPath} fill={`url(#${id("water")})`} />
          <g clipPath={`url(#${id("waterClip")})`}>
            <ellipse
              cx={p.source.x}
              cy={(FAR_BANK + NEAR_BANK) / 2}
              rx="74"
              ry={(NEAR_BANK - FAR_BANK) * 0.62}
              fill={`url(#${id("glint")})`}
              opacity={p.disc * 0.55}
              filter={`url(#${id("defocus")})`}
            />
            {s.streaks.map((st, i) => (
              <rect
                key={i}
                x={st.x}
                y={st.y}
                width={st.w}
                height={st.h}
                rx={st.h / 2}
                fill={mix(p.sun, "#ffffff", 0.5)}
                opacity={st.o}
              />
            ))}
            <rect x="0" y={NEAR_BANK - 26} width={W} height="40" fill={mix(p.deep, SHADE, 0.5)} opacity="0.35" filter={`url(#${id("defocus")})`} />
          </g>
          <path d={s.waterEdge} fill="none" stroke={mix(p.sun, p.shallow, 0.4)} strokeOpacity="0.35" strokeWidth="2" />

          <path d={s.groundPath} fill={`url(#${id("soil")})`} />
          <path d={s.bankEdge} fill="none" stroke={`url(#${id("bank")})`} strokeWidth="16" opacity="0.5" />
          <g clipPath={`url(#${id("groundClip")})`}>
            <g filter={`url(#${id("defocus")})`}>
              {s.pools.map((pool, i) => (
                <path key={i} d={pool.d} fill={mix(p.sun, p.ground, 0.62)} opacity={pool.o} />
              ))}
            </g>
            <g filter={`url(#${id("leaf")})`}>
              {s.bushes.map((d, i) => (
                <path key={`b${i}`} d={d} fill={mix(p.canopy, p.fog, 0.12)} opacity="0.9" />
              ))}
            </g>
            {s.reeds.map((d, i) => (
              <path key={`r${i}`} d={d} fill={mix(p.grass, SHADE, 0.3)} opacity="0.85" />
            ))}
            {s.blades.map((d, i) => (
              <path key={`g${i}`} d={d} fill={i % 5 === 0 ? mix(p.grass, p.sun, 0.22) : mix(p.grass, SHADE, 0.25)} opacity="0.9" />
            ))}
            <rect x="0" y="0" width={W} height={H} filter={`url(#${id("grain")})`} opacity="0.06" style={{ mixBlendMode: "overlay" }} />
          </g>

          {shaftGroup(0.14)}

          {treeLayer(3)}

          <g opacity="0.95">
            <ellipse cx={908} cy={NEAR_BANK + 34} rx="52" ry="9" fill={SHADE} opacity="0.4" filter={`url(#${id("defocus")})`} />
            <g transform={`translate(900 ${NEAR_BANK + 34}) scale(29)`}>
              <g fill={mix(p.trunk, SHADE, 0.6)}>
                <path d={s.hare.tail} />
                <path d={s.hare.body} />
                <path d={s.hare.ears} />
                <path d={s.hare.feet} />
              </g>
              <path
                d={s.hare.body}
                fill="none"
                stroke={mix(p.sun, p.canopy, 0.35)}
                strokeWidth="0.07"
                strokeLinejoin="round"
                opacity={0.55 * p.disc}
              />
            </g>
          </g>

          <g filter={`url(#${id("soft")})`}>
            {s.leaves.map((leaf, i) => (
              <path key={i} d={leaf.d} fill={mix(p.sun, p.grass, 0.45)} opacity={leaf.o} />
            ))}
          </g>

          {p.sparks > 0 ? (
            <g filter={`url(#${id("glow")})`} style={{ mixBlendMode: "screen" }} opacity={p.sparks}>
              {s.sparks.map((sp, i) => (
                <circle key={i} cx={sp.x} cy={sp.y} r={sp.r} fill={p.sparkTint} opacity={sp.o} />
              ))}
            </g>
          ) : null}

          <g filter={`url(#${id("defocus")})`}>
            {s.overhang.map((leaf, i) => (
              <path key={i} d={leaf.d} fill={leaf.fill} opacity={leaf.o} />
            ))}
            {s.foreBlobs.map((leaf, i) => (
              <path key={`f${i}`} d={leaf.d} fill={leaf.fill} opacity={leaf.o} />
            ))}
          </g>

          <rect x="0" y="0" width={W} height={H} fill={mix(p.sun, "#ffffff", 0.3)} opacity="0.05" style={{ mixBlendMode: "soft-light" }} />
          <rect x="0" y="0" width={W} height={H} filter={`url(#${id("grain")})`} opacity="0.055" style={{ mixBlendMode: "overlay" }} />
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/65 via-transparent to-transparent" />
    </div>
  );
}
