import * as THREE from "three";

/**
 * Deterministic PRNG. The forest is rebuilt on every mount, so unseeded random
 * values would make each visit a different forest.
 */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = fade(x - xi);
  const yf = fade(y - yi);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

/** CPU counterpart of the GLSL fbm, used for geometry and canvas detail. */
export function fbm(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return norm > 0 ? sum / norm : 0;
}

type Draw = (ctx: CanvasRenderingContext2D, size: number) => void;

function canvasTexture(
  size: number,
  draw: Draw,
  options: { srgb?: boolean; repeat?: [number, number] } = {},
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Detail maps are multiplied by the environment colour, so they stay in the
  // working colour space; anything with a painted hue needs the sRGB decode.
  texture.colorSpace = options.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (options.repeat) texture.repeat.set(options.repeat[0], options.repeat[1]);
  texture.needsUpdate = true;
  return texture;
}

function fillGray(
  ctx: CanvasRenderingContext2D,
  size: number,
  field: (x: number, y: number) => number,
): void {
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const value = Math.max(0, Math.min(255, field(x, y)));
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

/** Vertical fibres and deep cracks: stretched noise is what sells bark. */
export function barkTexture(): THREE.CanvasTexture {
  const texture = canvasTexture(256, (ctx, size) => {
    fillGray(ctx, size, (x, y) => {
      const fibre = fbm(x * 0.16, y * 0.011, 4);
      const grain = fbm(x * 0.85, y * 0.07, 2);
      const ridge = Math.abs(fbm(x * 0.05, y * 0.004, 2) - 0.5);
      return 118 + (fibre - 0.5) * 150 + (grain - 0.5) * 40 - ridge * 70;
    });
    const random = rng(9137);
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0; i < 7; i += 1) {
      const x = random() * size;
      ctx.strokeStyle = `rgba(40,32,26,${0.35 + random() * 0.4})`;
      ctx.lineWidth = 1 + random() * 3;
      ctx.beginPath();
      ctx.moveTo(x, -4);
      let cursor = x;
      for (let y = 0; y <= size; y += 16) {
        cursor += (random() - 0.5) * 9;
        ctx.lineTo(cursor, y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  });
  texture.repeat.set(1, 2);
  return texture;
}

/** Mottled forest floor: leaf mould, pebbles and shade between roots. */
export function groundTexture(): THREE.CanvasTexture {
  const texture = canvasTexture(256, (ctx, size) => {
    fillGray(ctx, size, (x, y) => {
      const blotch = fbm(x * 0.022, y * 0.022, 5);
      const fine = fbm(x * 0.32, y * 0.32, 3);
      return 120 + (blotch - 0.5) * 132 + (fine - 0.5) * 54;
    });
    const random = rng(2203);
    for (let i = 0; i < 260; i += 1) {
      const x = random() * size;
      const y = random() * size;
      const r = 0.6 + random() * 2.6;
      ctx.fillStyle = random() > 0.45 ? "rgba(70,58,44,0.5)" : "rgba(225,215,190,0.32)";
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.4 + random() * 0.7), random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  texture.repeat.set(16, 12);
  return texture;
}

/** Short directional strokes so the hare reads as fur rather than plastic. */
export function furTexture(): THREE.CanvasTexture {
  const texture = canvasTexture(128, (ctx, size) => {
    fillGray(ctx, size, (x, y) => {
      const stroke = fbm(x * 0.06, y * 0.5, 3);
      return 184 + (stroke - 0.5) * 74;
    });
    const random = rng(5501);
    for (let i = 0; i < 420; i += 1) {
      const x = random() * size;
      const y = random() * size;
      const len = 3 + random() * 7;
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + random() * 0.07})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len * 0.35, y + len);
      ctx.stroke();
    }
  });
  texture.repeat.set(3, 3);
  return texture;
}

function leafPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  width: number,
  rotation: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width, -length * 0.28, width * 0.86, -length * 0.78, 0, -length);
  ctx.bezierCurveTo(-width * 0.86, -length * 0.78, -width, -length * 0.28, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * A branchful of leaves on a transparent card. Alpha-tested rather than
 * blended so the canopy gets real depth sorting and casts cut-out shadows.
 */
export function leafClusterTexture(): THREE.CanvasTexture {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.clearRect(0, 0, size, size);
      const random = rng(7717);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 380; i += 1) {
        const angle = random() * Math.PI * 2;
        const dist = Math.pow(random(), 0.6) * size * 0.47;
        const x = size / 2 + Math.cos(angle) * dist;
        const y = size / 2 + Math.sin(angle) * dist * 0.9;
        const length = 12 + random() * 26;
        ctx.globalAlpha = 0.5 + random() * 0.5;
        leafPath(ctx, x, y, length, length * (0.3 + random() * 0.16), angle + random() * 2.4);
      }
      ctx.globalAlpha = 1;
      // Darken the interior so the cluster has volume instead of a flat veil.
      ctx.globalCompositeOperation = "source-atop";
      const shade = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
      shade.addColorStop(0, "rgba(150,150,150,1)");
      shade.addColorStop(1, "rgba(255,255,255,1)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, size, size);
      ctx.globalCompositeOperation = "source-over";
    },
    { srgb: true },
  );
}

/** Opaque, densely packed leaf tile for the interior of canopy masses and
 *  bushes. The card texture is deliberately cut out, which punches holes in a
 *  closed surface; this one only varies value, so it breaks up the smooth-rock
 *  shading without destroying the silhouette. */
export function canopySurfaceTexture(): THREE.CanvasTexture {
  return canvasTexture(
    256,
    (ctx, size) => {
      // The map multiplies the environment colour, so its mean has to sit near
      // white: a mid-grey tile halves the already-dark canopy and the relief
      // disappears into black.
      ctx.fillStyle = "#e8e8e8";
      ctx.fillRect(0, 0, size, size);
      const random = rng(4211);
      const offsets: ReadonlyArray<readonly [number, number]> = [
        [0, 0],
        [size, 0],
        [-size, 0],
        [0, size],
        [0, -size],
      ];
      for (let i = 0; i < 620; i += 1) {
        const angle = random() * Math.PI * 2;
        const cx = random() * size;
        const cy = random() * size;
        const length = 14 + random() * 26;
        const width = length * (0.3 + random() * 0.18);
        const gray = 196 + Math.floor(random() * 60);
        ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
        ctx.globalAlpha = 0.5 + random() * 0.5;
        // Draw each leaf into the four neighbouring tiles too, so the sheet
        // reads as continuous foliage rather than a bordered mat.
        for (const [ox, oy] of offsets) {
          leafPath(ctx, cx + ox, cy + oy, length, width, angle);
        }
      }
      ctx.globalAlpha = 1;
      // Large-scale value drift so a canopy does not read as a repeating mat.
      ctx.globalCompositeOperation = "multiply";
      for (let y = 0; y < size; y += 4) {
        for (let x = 0; x < size; x += 4) {
          const n = fbm(x * 0.035, y * 0.035, 3);
          const v = Math.round(226 + n * 29);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    },
    { srgb: true, repeat: [3, 3] },
  );
}

/** Single leaf for the falling-leaves particle. */
export function leafQuadTexture(): THREE.CanvasTexture {
  return canvasTexture(
    64,
    (ctx, size) => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.95;
      leafPath(ctx, size / 2, size * 0.88, size * 0.68, size * 0.26, 0);
      ctx.globalAlpha = 1;
    },
    { srgb: true },
  );
}

function radial(
  size: number,
  seed: number,
  stops: Array<[number, number]>,
  squashY = 1,
): THREE.CanvasTexture {
  return canvasTexture(
    size,
    (ctx, drawn) => {
      ctx.clearRect(0, 0, drawn, drawn);
      const random = rng(seed);
      const cx = drawn / 2;
      const cy = drawn / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, squashY);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, drawn / 2);
      for (const [at, alpha] of stops) {
        gradient.addColorStop(at, `rgba(255,255,255,${alpha})`);
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, drawn / 2, 0, Math.PI * 2);
      ctx.fill();
      // Break the perfect circle: a soft blob reads as cloud, a clean one as UI.
      for (let i = 0; i < 26; i += 1) {
        const angle = random() * Math.PI * 2;
        const radius = drawn * (0.12 + random() * 0.34);
        const r = drawn * (0.05 + random() * 0.16);
        ctx.fillStyle = `rgba(255,255,255,${0.02 + random() * 0.05})`;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
    { srgb: true },
  );
}

export function glowTexture(): THREE.CanvasTexture {
  return radial(128, 3301, [
    [0, 1],
    [0.18, 0.82],
    [0.42, 0.3],
    [0.72, 0.06],
    [1, 0],
  ]);
}

/** Lumpy cloud shape used for mist banks and canopy framing. */
export function puffTexture(): THREE.CanvasTexture {
  return radial(
    256,
    4421,
    [
      [0, 0.92],
      [0.34, 0.7],
      [0.62, 0.3],
      [0.86, 0.06],
      [1, 0],
    ],
    0.62,
  );
}

/** Blurred ellipse parked under an object to ground it in its shadow. */
export function contactShadowTexture(): THREE.CanvasTexture {
  return radial(128, 8819, [
    [0, 0.62],
    [0.4, 0.4],
    [0.75, 0.1],
    [1, 0],
  ]);
}

/** Cratered disc for the moon. */
export function moonTexture(): THREE.CanvasTexture {
  return canvasTexture(
    128,
    (ctx, size) => {
      const base = ctx.createRadialGradient(size * 0.42, size * 0.4, size * 0.05, size / 2, size / 2, size * 0.5);
      base.addColorStop(0, "rgba(255,255,255,1)");
      base.addColorStop(0.72, "rgba(238,232,214,1)");
      base.addColorStop(1, "rgba(196,190,176,1)");
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      const random = rng(6107);
      ctx.globalCompositeOperation = "multiply";
      for (let i = 0; i < 34; i += 1) {
        const angle = random() * Math.PI * 2;
        const dist = Math.pow(random(), 0.55) * size * 0.42;
        const r = 2 + random() * 11;
        ctx.fillStyle = `rgba(${150 - random() * 40},${146 - random() * 40},${138 - random() * 40},0.55)`;
        ctx.beginPath();
        ctx.arc(size / 2 + Math.cos(angle) * dist, size / 2 + Math.sin(angle) * dist, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    },
    { srgb: true },
  );
}
