import * as THREE from "three";
import {
  addWind,
  createFireflyMaterial,
  createPollenMaterial,
  MIST_FRAGMENT,
  MIST_VERTEX,
  SHAFT_FRAGMENT,
  SHAFT_VERTEX,
  SKY_FRAGMENT,
  SKY_VERTEX,
  WATER_FRAGMENT,
  WATER_VERTEX,
  type WindUniforms,
} from "./forest-shaders";
import {
  barkTexture,
  canopySurfaceTexture,
  contactShadowTexture,
  fbm,
  furTexture,
  glowTexture,
  groundTexture,
  leafClusterTexture,
  leafQuadTexture,
  moonTexture,
  puffTexture,
  rng,
} from "./forest-textures";
import { createTreeGeometry } from "./tree";

export type ForestLight = "dawn" | "day" | "dusk" | "night" | "fire";

type Vec3 = [number, number, number];

type Environment = {
  skyTop: number;
  skyBottom: number;
  horizon: number;
  fog: number;
  fogNear: number;
  fogFar: number;
  sun: number;
  sunlight: number;
  ambient: number;
  ambientGround: number;
  canopy: number;
  trunk: number;
  ground: number;
  grass: number;
  dirt: number;
  rock: number;
  fur: number;
  waterShallow: number;
  waterDeep: number;
  sunOpacity: number;
  moonOpacity: number;
  fireflies: number;
  embers: number;
  stars: number;
  shafts: number;
  mist: number;
  murk: number;
  glint: number;
  wind: number;
  leafFall: number;
  birds: number;
  butterflies: number;
  pollen: number;
  exposure: number;
  sunDir: Vec3;
  moonDir: Vec3;
  cameraZ: number;
  cameraY: number;
  targetY: number;
};

export const ENVIRONMENTS: Record<ForestLight, Environment> = {
  dawn: {
    skyTop: 0x395a52,
    skyBottom: 0xf6d8b0,
    horizon: 0xffd9a4,
    fog: 0xe0cbaa,
    fogNear: 26,
    fogFar: 130,
    sun: 0xffc078,
    sunlight: 2.1,
    ambient: 1.35,
    ambientGround: 0x1b2f22,
    canopy: 0x1d3a2a,
    trunk: 0x241f18,
    ground: 0x35523d,
    grass: 0x243a2b,
    dirt: 0x3a2f21,
    rock: 0x4a4a44,
    fur: 0x8a7a60,
    waterShallow: 0xb7cfc2,
    waterDeep: 0x54786f,
    sunOpacity: 1,
    moonOpacity: 0,
    fireflies: 0,
    embers: 0,
    stars: 0.18,
    shafts: 0.62,
    mist: 0.78,
    murk: 0.34,
    glint: 1,
    wind: 0.55,
    leafFall: 0.9,
    birds: 1,
    butterflies: 1,
    pollen: 0.8,
    exposure: 1.14,
    sunDir: [0.46, 0.15, -0.88],
    moonDir: [0.2, 0.55, -0.8],
    cameraZ: 14.5,
    cameraY: 2.05,
    targetY: 2.25,
  },
  day: {
    skyTop: 0x4a7a86,
    skyBottom: 0xf1e6c8,
    horizon: 0xe8e3c4,
    fog: 0xcbd6c2,
    fogNear: 26,
    fogFar: 120,
    sun: 0xfff0c4,
    sunlight: 2.6,
    ambient: 1.25,
    ambientGround: 0x22392a,
    canopy: 0x23452f,
    trunk: 0x2a2419,
    ground: 0x2b4231,
    grass: 0x20372a,
    dirt: 0x40361f,
    rock: 0x585a52,
    fur: 0x7d6f55,
    waterShallow: 0xc3d8ce,
    waterDeep: 0x5a7f78,
    sunOpacity: 0.85,
    moonOpacity: 0,
    fireflies: 0,
    embers: 0,
    stars: 0,
    shafts: 0.42,
    mist: 0.24,
    murk: 0.3,
    glint: 0.8,
    wind: 0.85,
    leafFall: 0.8,
    birds: 1,
    butterflies: 1,
    pollen: 0.95,
    exposure: 1.18,
    sunDir: [0.34, 0.74, -0.58],
    moonDir: [0.2, 0.55, -0.8],
    cameraZ: 13.6,
    cameraY: 2.9,
    targetY: 2.4,
  },
  dusk: {
    skyTop: 0x3b2c3d,
    skyBottom: 0xe9a877,
    horizon: 0xff9d5c,
    fog: 0xb98668,
    fogNear: 18,
    fogFar: 92,
    sun: 0xffb26a,
    sunlight: 1.7,
    ambient: 0.85,
    ambientGround: 0x171f1a,
    canopy: 0x18271f,
    trunk: 0x1b150f,
    ground: 0x1b2a20,
    grass: 0x142117,
    dirt: 0x2b2118,
    rock: 0x3a3634,
    fur: 0x7a6c58,
    waterShallow: 0x8e7f74,
    waterDeep: 0x2c3c42,
    sunOpacity: 0.95,
    moonOpacity: 0,
    fireflies: 0.15,
    embers: 0,
    stars: 0.28,
    shafts: 0.66,
    mist: 0.55,
    murk: 0.42,
    glint: 1.15,
    wind: 0.45,
    leafFall: 0.95,
    birds: 0.55,
    butterflies: 0.4,
    pollen: 0.5,
    exposure: 1.1,
    sunDir: [-0.52, 0.09, -0.85],
    moonDir: [0.35, 0.45, -0.8],
    cameraZ: 12.4,
    cameraY: 2.6,
    targetY: 2.2,
  },
  night: {
    skyTop: 0x081420,
    skyBottom: 0x1d3547,
    horizon: 0x274a5e,
    fog: 0x142634,
    fogNear: 16,
    fogFar: 80,
    sun: 0xf4e9cd,
    sunlight: 0.7,
    ambient: 0.5,
    ambientGround: 0x08120f,
    canopy: 0x0d1d18,
    trunk: 0x0d1110,
    ground: 0x101d19,
    grass: 0x0b1612,
    dirt: 0x161a18,
    rock: 0x232a2c,
    fur: 0x646a5e,
    waterShallow: 0x4d7280,
    waterDeep: 0x122630,
    sunOpacity: 0,
    moonOpacity: 1,
    fireflies: 1,
    embers: 0,
    stars: 1,
    shafts: 0.2,
    mist: 0.5,
    murk: 0.24,
    glint: 0.5,
    wind: 0.3,
    leafFall: 0.45,
    birds: 0,
    butterflies: 0,
    pollen: 0.06,
    exposure: 1.02,
    sunDir: [0.3, 0.5, -0.75],
    moonDir: [0.3, 0.46, -0.82],
    cameraZ: 11.8,
    cameraY: 2.4,
    targetY: 2.6,
  },
  fire: {
    skyTop: 0x1a1114,
    skyBottom: 0x8a4a30,
    horizon: 0xd86a33,
    fog: 0x5c3526,
    fogNear: 12,
    fogFar: 62,
    sun: 0xffa05a,
    sunlight: 1.35,
    ambient: 0.95,
    ambientGround: 0x1a100c,
    canopy: 0x14100f,
    trunk: 0x110c09,
    ground: 0x1a120f,
    grass: 0x120c0a,
    dirt: 0x241611,
    rock: 0x2e2420,
    fur: 0x81694f,
    waterShallow: 0x6b4a44,
    waterDeep: 0x2a1d1c,
    sunOpacity: 0.35,
    moonOpacity: 0,
    fireflies: 0,
    embers: 1,
    stars: 0.35,
    shafts: 0.4,
    mist: 0.62,
    murk: 0.5,
    glint: 0.55,
    wind: 0.4,
    leafFall: 0.3,
    birds: 0,
    butterflies: 0,
    pollen: 0.18,
    exposure: 1.06,
    sunDir: [-0.24, 0.07, -0.96],
    moonDir: [0.1, 0.4, -0.9],
    cameraZ: 9.6,
    cameraY: 2.2,
    targetY: 1.9,
  },
};

export type ForestOptions = {
  mode: "hero" | "reader";
  light: ForestLight;
  quality: "high" | "low";
  reducedMotion: boolean;
};

export type ForestHandle = {
  setLight: (light: ForestLight) => void;
  setScroll: (progress: number) => void;
  setPaused: (paused: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

// ---- World shape -----------------------------------------------------------

/** The river runs along X; its centre wanders so the banks are never straight. */
function riverZ(x: number): number {
  return -2.5 + Math.sin(x * 0.052) * 3.2 + Math.sin(x * 0.019 + 1.3) * 1.9;
}

const WATER_Y = -1.28;
const CHANNEL = 6.4;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

function smoothstep01(edge0: number, edge1: number, v: number): number {
  const t = clamp01((v - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

const noise1 = (seed: number) => (x: number): number => {
  const s = Math.sin(x * 78.233 + seed) * 43758.5453;
  return s - Math.floor(s);
};

/** Terrain elevation in ground-local space. Flattened inside the channel so
 *  the flat water surface never strands a dry patch. */
function heightAt(x: number, z: number): number {
  const base =
    (fbm(x * 0.018 + 3.1, z * 0.018 + 7.7, 4) - 0.5) * 3.1 +
    (fbm(x * 0.072 + 1.3, z * 0.072 + 2.1, 3) - 0.5) * 0.62;
  const d = Math.abs(z - riverZ(x));
  const flatten = 1 - 0.82 * clamp01(1 - d / 9);
  const channel = -1.9 * Math.pow(clamp01(1 - d / (CHANNEL + 0.6)), 1.65);
  const rim = 0.5 * Math.exp(-((d - (CHANNEL + 0.5)) ** 2) / 6.5);
  const farRise = smoothstep01(8, 34, -z) * 3.4;
  const nearDrop = -smoothstep01(12, 30, z) * 1.6;
  return base * flatten + channel + rim + farRise + nearDrop;
}

/** The ground mesh sits at GROUND_Y, so props drop by the same amount. */
const GROUND_Y = -0.35;
const surfaceY = (x: number, z: number): number => heightAt(x, z) + GROUND_Y;
/** World height of the water surface, used to keep props out of the channel. */
const WATER_SURFACE_Y = WATER_Y + GROUND_Y;

// Hoisted so the frame loop never allocates a colour per object.
const WHITE = new THREE.Color(0xffffff);
const FIREFLY_COLOR = new THREE.Color(0xffd98d);
const EMBER_COLOR = new THREE.Color(0xff8a3d);
const BUTTERFLY_TINT = new THREE.Color(0xc68a45);

// ---- Geometry builders -----------------------------------------------------

type Placement = { matrix: THREE.Matrix4; color?: THREE.Color };

function buildInstanced(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  items: Placement[],
  options: { cast?: boolean; receive?: boolean; frustumCulled?: boolean } = {},
): THREE.InstancedMesh | null {
  if (items.length === 0) return null;
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  items.forEach((item, index) => {
    mesh.setMatrixAt(index, item.matrix);
    if (item.color) mesh.setColorAt(index, item.color);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = Boolean(options.cast);
  mesh.receiveShadow = Boolean(options.receive);
  // Instances are spread across the whole scene; the mesh's own bounding sphere
  // is only the size of one unit asset and would cull the lot.
  mesh.frustumCulled = options.frustumCulled ?? false;
  return mesh;
}

/** Tapered, bent, non-circular trunk: a bare cylinder is the instant giveaway. */
function limbGeometry(seed: number, bend: number): THREE.BufferGeometry {
  const radial = 9;
  const rings = 7;
  const geometry = new THREE.CylinderGeometry(0.34, 1, 1, radial, rings, true);
  geometry.translate(0, 0.5, 0);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const radius = Math.hypot(x, z);
    if (radius < 1e-4) continue;
    const bulge = 1 + (noise1(seed)(Math.cos(angle) * 3.7) - 0.5) * 0.22;
    const flare = 1 + Math.pow(clamp01(1 - y * 2.6), 2.4) * 0.55;
    const next = radius * bulge * flare;
    position.setX(i, Math.cos(angle) * next);
    position.setZ(i, Math.sin(angle) * next);
    // Lean the whole limb over its height, plus a little noise wobble.
    position.setY(i, y + (noise1(seed + 9)(y * 3.3) - 0.5) * 0.03);
    position.setX(i, position.getX(i) + y * y * bend);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Lumpy foliage mass: an icosahedron pushed around by noise. */
function blobGeometry(seed: number, detail = 2): THREE.BufferGeometry {
  const geometry = new THREE.IcosahedronGeometry(1, detail);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const lobe = 0.72 + fbm(x * 1.7 + seed, z * 1.7 + y * 2.3 + seed, 3) * 0.72;
    const squash = 1 + (y < 0 ? -0.16 : 0.04);
    const scale = lobe * squash;
    position.setXYZ(i, x * scale, y * scale * 0.86, z * scale);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Scalloped half-wing lying in the XZ plane, pivoted at the body. */
function butterflyWingGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0.02, 0);
  shape.bezierCurveTo(0.09, 0.16, 0.32, 0.2, 0.42, 0.09);
  shape.bezierCurveTo(0.47, 0.02, 0.38, -0.06, 0.26, -0.06);
  shape.bezierCurveTo(0.2, -0.15, 0.07, -0.15, 0.03, -0.05);
  shape.lineTo(0.02, 0);
  const geometry = new THREE.ShapeGeometry(shape, 10);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

/**
 * A bent blade of grass: a strip of quads that tapers to a point, with vertex
 * colours carrying the dark-root to lit-tip gradient.
 */
function bladeGeometry(segments: number, width: number, curve: number): THREE.BufferGeometry {
  const count = (segments + 1) * 2;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const indices: number[] = [];
  for (let s = 0; s <= segments; s += 1) {
    const t = s / segments;
    const y = t;
    const z = t * t * curve;
    const half = width * (1 - t * t * 0.92) * 0.5;
    const base = (s * 2) * 3;
    positions[base] = -half;
    positions[base + 1] = y;
    positions[base + 2] = z;
    positions[base + 3] = half;
    positions[base + 4] = y;
    positions[base + 5] = z;
    const shade = 0.42 + t * 0.95;
    colors[s * 6] = shade * 0.9;
    colors[s * 6 + 1] = shade;
    colors[s * 6 + 2] = shade * 0.86;
    colors[s * 6 + 3] = shade * 0.9;
    colors[s * 6 + 4] = shade;
    colors[s * 6 + 5] = shade * 0.86;
    uvs[s * 4] = 0;
    uvs[s * 4 + 1] = t;
    uvs[s * 4 + 2] = 1;
    uvs[s * 4 + 3] = t;
    if (s < segments) {
      const v = s * 2;
      indices.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// ---- Scene assembly --------------------------------------------------------

export function createForest(
  canvas: HTMLCanvasElement,
  options: ForestOptions,
): ForestHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: options.quality === "high",
      alpha: false,
      powerPreference: "high-performance",
      // Reduced motion draws once before the canvas fades in; without this the
      // buffer is cleared on the first composite and the stage stays blank.
      preserveDrawingBuffer: options.reducedMotion,
    });
  } catch {
    return null;
  }

  const low = options.quality === "low";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = !low;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
  const initial = ENVIRONMENTS[options.light];
  const random = rng(options.mode === "reader" ? 4409 : 1201);
  const readerHare = options.mode === "reader";
  // Both stages use the far bank: it stays inside the frame through every
  // preset camera, while the near bank sits under the hero's CTA stack.
  const hareX = 2;
  const hareZ = -7.5;
  const hareGlade = 22;
  const bushGlade = 32;

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const motion = {
    cameraZ: initial.cameraZ,
    cameraY: initial.cameraY,
    targetY: initial.targetY,
    fogNear: initial.fogNear,
    fogFar: initial.fogFar,
    sunlight: initial.sunlight,
    ambient: initial.ambient,
    sunOpacity: initial.sunOpacity,
    moonOpacity: initial.moonOpacity,
    fireflies: initial.fireflies,
    embers: initial.embers,
    stars: initial.stars,
    shafts: initial.shafts,
    mist: initial.mist,
    murk: initial.murk,
    glint: initial.glint,
    wind: initial.wind,
    leafFall: initial.leafFall,
    birds: initial.birds,
    butterflies: initial.butterflies,
    pollen: initial.pollen,
    exposure: initial.exposure,
  };
  const motionTarget = { ...motion };

  const colorKeys = [
    "skyTop",
    "skyBottom",
    "horizon",
    "fog",
    "sun",
    "canopy",
    "trunk",
    "ground",
    "grass",
    "dirt",
    "rock",
    "fur",
    "waterShallow",
    "waterDeep",
  ] as const;
  type ColorKey = (typeof colorKeys)[number];
  const colors = Object.fromEntries(
    colorKeys.map((key) => [key, new THREE.Color(initial[key])]),
  ) as Record<ColorKey, THREE.Color>;
  const colorTargets = Object.fromEntries(
    colorKeys.map((key) => [key, new THREE.Color(initial[key])]),
  ) as Record<ColorKey, THREE.Color>;

  const sunDir = new THREE.Vector3(...initial.sunDir).normalize();
  const moonDir = new THREE.Vector3(...initial.moonDir).normalize();
  const sunDirTarget = sunDir.clone();
  const moonDirTarget = moonDir.clone();
  /** Direction the visible light source sits in, used by sky, water and shadows. */
  const keyDir = new THREE.Vector3();

  const wind: WindUniforms = {
    uTime: { value: 0 },
    uWind: { value: initial.wind },
    uGust: { value: 0.35 },
  };

  scene.fog = new THREE.Fog(initial.fog, initial.fogNear, initial.fogFar);
  // The scene opens a touch further back and settles in; see `intro` in draw.
  camera.position.set(0, initial.cameraY, initial.cameraZ + (options.reducedMotion ? 0 : 2.2));
  renderer.toneMappingExposure = initial.exposure;

  // ---- Sky dome ----
  const skyUniforms = {
    uTop: { value: colors.skyTop.clone() },
    uBottom: { value: colors.skyBottom.clone() },
    uHorizon: { value: colors.horizon.clone() },
    uSun: { value: colors.sun.clone() },
    uSunDir: { value: sunDir.clone() },
    uStars: { value: initial.stars },
    uHaze: { value: 0.6 },
    uTime: wind.uTime,
  };
  const skyMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    }),
  );
  const sky = new THREE.Mesh(track(new THREE.SphereGeometry(190, 32, 20)), skyMaterial);
  sky.renderOrder = -10;
  scene.add(sky);

  // ---- Sun and moon ----
  const glow = track(glowTexture());
  const sunHalo = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({
        map: glow,
        color: 0xffd9a0,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    ),
  );
  sunHalo.scale.set(64, 64, 1);
  sunHalo.renderOrder = -9;
  scene.add(sunHalo);

  // A hard-edged disc reads as a floating balloon; the glow map gives the same
  // additive falloff the eye expects from a low sun seen through haze.
  const sunDisc = new THREE.Mesh(
    track(new THREE.CircleGeometry(3.4, 40)),
    track(
      new THREE.MeshBasicMaterial({
        color: colors.sun.clone(),
        map: glow,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        fog: false,
      }),
    ),
  );
  sunDisc.renderOrder = -8;
  scene.add(sunDisc);

  const moonMap = track(moonTexture());
  const moonDisc = new THREE.Mesh(
    track(new THREE.CircleGeometry(3.6, 48)),
    track(
      new THREE.MeshBasicMaterial({
        map: moonMap,
        color: 0xf2e7c9,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        fog: false,
      }),
    ),
  );
  moonDisc.renderOrder = -8;
  scene.add(moonDisc);

  const moonHalo = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({
        map: glow,
        color: 0xbcd4e6,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    ),
  );
  moonHalo.scale.set(34, 34, 1);
  moonHalo.renderOrder = -9;
  scene.add(moonHalo);

  // ---- Terrain ----
  const terrainSegments = low ? 96 : 168;
  const terrainSize = 320;
  const groundGeometry = track(
    new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments),
  );
  {
    const position = groundGeometry.attributes.position as THREE.BufferAttribute;
    const tints = new Float32Array(position.count * 3);
    const wet = new THREE.Color(0.4, 0.38, 0.34);
    const silt = new THREE.Color(1.18, 1.06, 0.84);
    const plain = new THREE.Color(1, 1, 1);
    const stony = new THREE.Color(1.1, 1.06, 1.02);
    const deep = new THREE.Color(0.62, 0.66, 0.72);
    const scratch = new THREE.Color();
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      // Local +Y maps to world -Z after the plane is laid flat.
      const z = -position.getY(i);
      const y = heightAt(x, z);
      position.setZ(i, y);

      const d = Math.abs(z - riverZ(x));
      const slope =
        1 -
        Math.min(
          1,
          Math.abs(heightAt(x + 1.4, z) - heightAt(x - 1.4, z)) / 2.6 +
            Math.abs(heightAt(x, z + 1.4) - heightAt(x, z - 1.4)) / 2.6,
        );
      const mottle = fbm(x * 0.24 + 11, z * 0.24 + 5, 2);

      if (y < WATER_Y - 0.35) scratch.copy(deep);
      else if (d < CHANNEL - 0.4) scratch.copy(wet);
      else if (d < CHANNEL + 1.9) scratch.copy(silt);
      else if (slope < 0.42) scratch.copy(stony);
      else scratch.copy(plain);

      const jitter = 0.86 + mottle * 0.3;
      tints[i * 3] = scratch.r * jitter;
      tints[i * 3 + 1] = scratch.g * jitter * (0.94 + mottle * 0.12);
      tints[i * 3 + 2] = scratch.b * jitter;
    }
    groundGeometry.setAttribute("color", new THREE.BufferAttribute(tints, 3));
    groundGeometry.computeVertexNormals();
  }
  const groundMap = track(groundTexture());
  const groundMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.ground.clone(),
      map: groundMap,
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      dithering: true,
    }),
  );
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.35;
  ground.receiveShadow = !low;
  scene.add(ground);

  // ---- River ----
  const riverUniforms = {
    uTime: wind.uTime,
    uShallow: { value: colors.waterShallow.clone() },
    uDeep: { value: colors.waterDeep.clone() },
    uSun: { value: colors.sun.clone() },
    uSunDir: { value: sunDir.clone() },
    uSkyTop: { value: colors.skyTop.clone() },
    uSkyBottom: { value: colors.skyBottom.clone() },
    uFogColor: { value: colors.fog.clone() },
    uFogNear: { value: initial.fogNear },
    uFogFar: { value: initial.fogFar },
    uRipple: { value: 1 },
    uSunGlint: { value: initial.glint },
    uMurk: { value: initial.murk },
  };
  const waterMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: riverUniforms,
      vertexShader: WATER_VERTEX,
      fragmentShader: WATER_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const water = new THREE.Mesh(track(buildRiverGeometry(150, 7.4)), waterMaterial);
  water.position.y = WATER_SURFACE_Y;
  scene.add(water);

  // ---- Ripples ----
  // Expanding rings where fish rise; a still sheet reads as painted glass.
  const rippleGeo = track(new THREE.RingGeometry(0.82, 1, 36));
  const ripples: {
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    phase: number;
    speed: number;
  }[] = [];
  for (let i = 0; i < (low ? 3 : 5); i += 1) {
    const material = track(
      new THREE.MeshBasicMaterial({
        color: 0xe4f3ea,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    const mesh = new THREE.Mesh(rippleGeo, material);
    mesh.rotation.x = -Math.PI / 2;
    const x = -24 + i * 12 + (random() - 0.5) * 5;
    const z = riverZ(x) + (random() - 0.5) * 2.8;
    mesh.position.set(x, WATER_SURFACE_Y + 0.025, z);
    mesh.renderOrder = 2;
    scene.add(mesh);
    ripples.push({
      mesh,
      material,
      phase: random(),
      speed: 0.055 + random() * 0.035,
    });
  }

  function buildRiverGeometry(steps: number, halfWidth: number): THREE.BufferGeometry {
    const positions = new Float32Array((steps + 1) * 2 * 3);
    const uvs = new Float32Array((steps + 1) * 2 * 2);
    const indices: number[] = [];
    const from = -78;
    const to = 78;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = from + (to - from) * t;
      const centre = riverZ(x);
      // The channel widens where it bends, as it does in a real river.
      const widen = halfWidth * (0.86 + noise1(7717)(t * 5.5) * 0.34);
      for (let e = 0; e < 2; e += 1) {
        const v = i * 2 + e;
        positions[v * 3] = x;
        positions[v * 3 + 1] = 0;
        positions[v * 3 + 2] = centre + (e === 0 ? -widen : widen);
        uvs[v * 2] = t;
        uvs[v * 2 + 1] = e;
      }
      if (i < steps) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  // ---- Materials shared by every plant ----
  const barkMap = track(barkTexture());
  const trunkMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.trunk.clone(),
      map: barkMap,
      roughness: 0.94,
      metalness: 0,
    }),
  );
  addWind(trunkMaterial, wind, { amp: 0.05, freq: 0.62, height: 9, ref: "anchor" });

  // The recursive trees are normalized to unit height, so wind lift can come
  // from the vertex itself: roots stay planted while the crown travels.
  const treeBarkMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.trunk.clone(),
      map: barkMap,
      vertexColors: true,
      roughness: 0.93,
      metalness: 0,
    }),
  );
  addWind(treeBarkMaterial, wind, { amp: 0.022, freq: 0.6, height: 1 });

  const leafMap = track(leafClusterTexture());
  const foliageMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.canopy.clone(),
      map: leafMap,
      vertexColors: true,
      transparent: false,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.88,
      metalness: 0,
    }),
  );
  addWind(foliageMaterial, wind, { amp: 0.024, freq: 0.6, height: 1 });

  // The canopy masses are the trunk of the silhouette; without leaf mottling
  // they read as faceted boulders. An opaque leaf tile breaks up that smooth-rock
  // shading without punching holes in a closed surface.
  const massLeafMap = track(canopySurfaceTexture());

  const grassMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.grass.clone(),
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
    }),
  );
  addWind(grassMaterial, wind, { amp: 0.16, freq: 1.35, height: 0.75 });

  const stoneMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.rock.clone(),
      roughness: 0.92,
      metalness: 0,
      flatShading: true,
    }),
  );

  // ---- Trees ----
  const leafGeo = track(new THREE.PlaneGeometry(1, 1));
  const blobGeos = [
    track(blobGeometry(11, low ? 1 : 2)),
    track(blobGeometry(29, low ? 1 : 2)),
    track(blobGeometry(53, low ? 1 : 2)),
  ];

  // Each variant is one recursively grown tree, normalized to unit height and
  // instanced across the bands below.
  const treeVariantCount = low ? 2 : 4;
  const treeVariants = Array.from({ length: treeVariantCount }, (_, v) => {
    const geometry = createTreeGeometry(1409 + v * 197, low ? "low" : "high", v);
    track(geometry.wood);
    track(geometry.leaves);
    return geometry;
  });
  const treePlacements: Placement[][] = treeVariants.map(() => []);

  const scratchMatrix = new THREE.Matrix4();
  const scratchPosition = new THREE.Vector3();
  const scratchQuaternion = new THREE.Quaternion();
  const scratchScale = new THREE.Vector3();
  const scratchEuler = new THREE.Euler();
  const scratchColor = new THREE.Color();

  function place(
    list: Placement[],
    x: number,
    y: number,
    z: number,
    scale: THREE.Vector3,
    rotation: THREE.Euler,
    tint?: number,
  ): void {
    scratchPosition.set(x, y, z);
    scratchQuaternion.setFromEuler(rotation);
    scratchMatrix.compose(scratchPosition, scratchQuaternion, scale);
    list.push({
      matrix: scratchMatrix.clone(),
      color: tint === undefined ? undefined : scratchColor.clone().setScalar(tint),
    });
  }

  type TreeBand = {
    count: number;
    height: [number, number];
  };

  const bands: TreeBand[] = [
    // Framing trees stand on the near bank, just outside the camera's cone.
    { count: 5, height: [9.5, 13.5] },
    { count: 8, height: [7, 10.5] },
    { count: 13, height: [5, 9] },
  ];

  let treeIndex = 0;
  for (let b = 0; b < bands.length; b += 1) {
    const band = bands[b];
    if (!band) continue;
    for (let i = 0; i < band.count; i += 1) {
      const seed = treeIndex * 0.618 + b * 3.7;
      const side = i % 2 === 0 ? -1 : 1;
      // Trees ring the clearing; the near band hugs the frame edges.
      let x: number;
      let z: number;
      if (b === 0) {
        x = side * (13.5 + noise1(seed)(i * 2.7) * 9);
        z = 3 + noise1(seed + 3)(i) * 12;
      } else if (b === 1) {
        x = side * (10 + noise1(seed)(i * 1.9) * 34);
        z = -12 - noise1(seed + 5)(i * 2.3) * 22;
      } else {
        x = (noise1(seed)(i * 3.1) - 0.5) * 118;
        z = -30 - noise1(seed + 7)(i * 1.7) * 34;
      }
      const elevation = heightAt(x, z);
      // A trunk planted below the waterline would stand in the river.
      if (elevation < WATER_Y + 0.25) continue;
      const groundY = elevation + GROUND_Y;

      const height = band.height[0] + noise1(seed + 11)(i) * (band.height[1] - band.height[0]);
      const scale = height * (0.96 + noise1(seed + 23)(i) * 0.08);
      const lean = (noise1(seed + 13)(i) - 0.5) * 0.1;
      const bucket = treePlacements[treeIndex % treeVariants.length]!;
      place(
        bucket,
        x,
        groundY - 0.05,
        z,
        new THREE.Vector3(scale, scale, scale),
        new THREE.Euler(lean * 0.6, noise1(seed + 17)(i) * Math.PI * 2, lean),
        0.86 + noise1(seed + 19)(i) * 0.26,
      );
      treeIndex += 1;
    }
  }

  treeVariants.forEach((variant, index) => {
    const bucket = treePlacements[index]!;
    const woodMesh = buildInstanced(variant.wood, treeBarkMaterial, bucket, {
      cast: !low,
      receive: !low,
    });
    const leafMesh = buildInstanced(variant.leaves, foliageMaterial, bucket, {
      cast: !low,
    });
    if (woodMesh) scene.add(woodMesh);
    if (leafMesh) scene.add(leafMesh);
  });

  // ---- Undergrowth ----
  // Blades are deliberately broad: at 10x taller than wide they alias to black
  // wires instead of reading as sward.
  const bladeGeo = track(bladeGeometry(4, 0.19, 0.32));
  const reedGeo = track(bladeGeometry(5, 0.13, 0.5));
  const blades: Placement[] = [];
  const reeds: Placement[] = [];
  const grassCount = low ? 1200 : 3200;
  for (let i = 0; i < grassCount; i += 1) {
    // Clustered rather than uniform: grass grows in tufts, not in a grid.
    const clump = Math.floor(noise1(i * 0.7919)(3.1) * 46);
    const cx = (noise1(clump * 1.31)(5.7) - 0.5) * 96;
    const cz = 6 - noise1(clump * 2.17)(9.3) * 40;
    const x = cx + (noise1(i * 3.7)(2.3) - 0.5) * 5.5;
    const z = cz + (noise1(i * 5.9)(4.1) - 0.5) * 5.5;
    const y = surfaceY(x, z);
    if (y < WATER_SURFACE_Y + 0.1) continue;
    // A grazed glade around the hare: without it a 1-unit sward swallows it whole.
    if ((x - hareX) ** 2 + (z - hareZ) ** 2 < hareGlade) continue;
    const size = 0.4 + noise1(i * 7.1)(6.3) * 0.75;
    place(
      blades,
      x,
      y,
      z,
      new THREE.Vector3(size * (0.7 + noise1(i)(8.1) * 0.7), size, size),
      new THREE.Euler(0, noise1(i * 9.3)(7.7) * Math.PI * 2, (noise1(i * 11.7)(9.1) - 0.5) * 0.4),
      0.6 + noise1(i * 13.3)(11.3) * 0.75,
    );
  }
  const reedCount = low ? 90 : 260;
  for (let i = 0; i < reedCount; i += 1) {
    const x = (noise1(i * 1.7)(3.3) - 0.5) * 150;
    const side = i % 2 === 0 ? -1 : 1;
    const z = riverZ(x) + side * (CHANNEL - 0.5 + noise1(i * 2.3)(7.1) * 1.9);
    // Keep the bank in front of the hare clear of tall reeds as well.
    if ((x - hareX) ** 2 + (z - hareZ) ** 2 < hareGlade) continue;
    const y = surfaceY(x, z);
    const size = 1.1 + noise1(i * 3.1)(5.5) * 1.5;
    place(
      reeds,
      x,
      y,
      z,
      new THREE.Vector3(size * 0.5, size, size * 0.5),
      new THREE.Euler(0, noise1(i * 4.7)(9.9) * Math.PI * 2, (noise1(i * 5.3)(2.2) - 0.5) * 0.3),
      0.55 + noise1(i * 6.1)(4.4) * 0.6,
    );
  }
  const bladeMesh = buildInstanced(bladeGeo, grassMaterial, blades, { receive: !low });
  const reedMesh = buildInstanced(reedGeo, grassMaterial, reeds);
  [bladeMesh, reedMesh].forEach((mesh) => mesh && scene.add(mesh));

  // Bushes, rocks and a fallen log break up the ground plane.
  const bushMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.canopy.clone(),
      map: massLeafMap,
      roughness: 0.95,
    }),
  );
  addWind(bushMaterial, wind, { amp: 0.14, freq: 1.05, height: 2.4, ref: "anchor" });
  const bushes: Placement[] = [];
  const bushGeo = blobGeos[1] ?? blobGeos[0];
  if (bushGeo) {
    for (let i = 0; i < (low ? 16 : 44); i += 1) {
      const x = (noise1(i * 1.13)(2.9) - 0.5) * 62;
      const z = 4 - noise1(i * 2.41)(6.1) * 26;
      const y = surfaceY(x, z);
      if (y < WATER_SURFACE_Y + 0.15) continue;
      // Keep the hare's glade open; shrubs would hide it from the camera.
      if ((x - hareX) ** 2 + (z - hareZ) ** 2 < bushGlade) continue;
      // Kept low and wide: a 2-unit ellipsoid reads as a boulder, not a shrub.
      const size = 0.4 + noise1(i * 3.77)(8.3) * 0.8;
      place(
        bushes,
        x,
        y + size * 0.4,
        z,
        new THREE.Vector3(size * 1.6, size * 0.7, size * 1.2),
        new THREE.Euler(noise1(i)(3) * 2, noise1(i)(7) * 3, noise1(i)(11) * 2),
        0.6 + noise1(i * 5.9)(13.7) * 0.5,
      );
    }
  }
  const bushMesh = buildInstanced(bushGeo ?? leafGeo, bushMaterial, bushes, { cast: !low, receive: !low });
  if (bushMesh) scene.add(bushMesh);

  const stones: Placement[] = [];
  const stoneGeo = blobGeos[2] ?? blobGeos[0];
  for (let i = 0; i < (low ? 8 : 22); i += 1) {
    const x = (noise1(i * 7.31)(3.7) - 0.5) * 70;
    const z = 7 - noise1(i * 8.13)(5.3) * 34;
    if ((x - hareX) ** 2 + (z - hareZ) ** 2 < hareGlade) continue;
    const y = surfaceY(x, z);
    const size = 0.24 + noise1(i * 9.37)(7.9) * 0.72;
    place(
      stones,
      x,
      y + size * 0.35,
      z,
      new THREE.Vector3(size * 1.4, size * 0.75, size * 1.1),
      new THREE.Euler(noise1(i)(2) * 3, noise1(i)(6) * 3, noise1(i)(10) * 3),
      0.7 + noise1(i * 2.9)(11.1) * 0.6,
    );
  }
  const stoneMesh = buildInstanced(stoneGeo ?? leafGeo, stoneMaterial, stones, {
    cast: !low,
    receive: !low,
  });
  if (stoneMesh) scene.add(stoneMesh);

  const log = new THREE.Mesh(
    track(limbGeometry(1313, 0.02)),
    trunkMaterial,
  );
  log.scale.set(0.42, 4.6, 0.42);
  log.rotation.set(0, 0, Math.PI / 2 - 0.06);
  {
    const x = -7.4;
    const z = 5.2;
    log.position.set(x, surfaceY(x, z) + 0.36, z);
    log.castShadow = !low;
    log.receiveShadow = !low;
    scene.add(log);
  }

  // ---- Contact shadows for objects the shadow map cannot see well ----
  const contactMap = track(contactShadowTexture());
  const contactMaterial = track(
    new THREE.MeshBasicMaterial({
      map: contactMap,
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
  );
  function addContactShadow(x: number, z: number, size: number, opacity = 1): void {
    const disc = new THREE.Mesh(track(new THREE.PlaneGeometry(size, size)), contactMaterial);
    disc.rotation.x = -Math.PI / 2;
    disc.rotation.z = random() * Math.PI;
    disc.position.set(x, surfaceY(x, z) + 0.03, z);
    disc.renderOrder = 1;
    disc.userData.opacity = opacity;
    scene.add(disc);
    contactDiscs.push(disc);
  }
  const contactDiscs: THREE.Mesh[] = [];
  addContactShadow(hareX, hareZ, 3.2);
  addContactShadow(-7.4, 5.2, 4.4, 0.7);
  for (let i = 0; i < stones.length && i < 10; i += 1) {
    const item = stones[i];
    if (!item) continue;
    const p = new THREE.Vector3().setFromMatrixPosition(item.matrix);
    addContactShadow(p.x, p.z, 1.9, 0.55);
  }

  // ---- Mist banks ----
  const mistUniforms = {
    uTime: wind.uTime,
    uColor: { value: colors.fog.clone().lerp(new THREE.Color(0xffffff), 0.35) },
    uOpacity: { value: 1 },
    uDensity: { value: initial.mist },
  };
  const mistMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: mistUniforms,
      vertexShader: MIST_VERTEX,
      fragmentShader: MIST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const mistGroup = new THREE.Group();
  for (let i = 0; i < (low ? 3 : 6); i += 1) {
    const plane = new THREE.Mesh(track(new THREE.PlaneGeometry(90 - i * 6, 9 + i * 1.6)), mistMaterial);
    const z = riverZ(-20 + i * 8) - 12 + i * 4.4;
    plane.position.set(-14 + i * 7, WATER_Y + 1.1 + i * 0.55, z);
    plane.rotation.set(-0.06, 0.1 - i * 0.03, 0);
    mistGroup.add(plane);
  }
  scene.add(mistGroup);

  // ---- Volumetric shafts ----
  const shaftUniforms = {
    uTime: wind.uTime,
    uColor: { value: colors.sun.clone() },
    uOpacity: { value: initial.shafts },
  };
  const shaftMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: shaftUniforms,
      vertexShader: SHAFT_VERTEX,
      fragmentShader: SHAFT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
  );
  const shaftGeo = track(new THREE.PlaneGeometry(1, 1));
  const shafts: { mesh: THREE.Mesh; ground: THREE.Vector3; width: number }[] = [];
  for (let i = 0; i < (low ? 4 : 7); i += 1) {
    const mesh = new THREE.Mesh(shaftGeo, shaftMaterial);
    mesh.renderOrder = 6;
    const ground = new THREE.Vector3(
      (noise1(i * 3.3)(1.7) - 0.5) * 44,
      -1.4 + noise1(i * 5.1)(3.3) * 2.4,
      -22 + noise1(i * 7.7)(5.9) * 30,
    );
    mesh.position.copy(ground);
    scene.add(mesh);
    shafts.push({ mesh, ground, width: 2.6 + noise1(i * 9.1)(7.1) * 5.4 });
  }

  // ---- Falling leaves ----
  const leafCount = low ? 40 : 110;
  const leafParticleMaterial = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd9c08a),
      map: track(leafQuadTexture()),
      transparent: true,
      alphaTest: 0.3,
      side: THREE.DoubleSide,
      roughness: 1,
    }),
  );
  addWind(leafParticleMaterial, wind, { amp: 0.2, freq: 1.6, height: 12, ref: "anchor" });
  const leafItems: Placement[] = [];
  const leafState: { x: number; y: number; z: number; spin: number; fall: number; size: number }[] = [];
  for (let i = 0; i < leafCount; i += 1) {
    const state = {
      x: (random() - 0.5) * 54,
      y: random() * 17 + 0.5,
      z: (random() - 0.5) * 44 - 4,
      spin: random() * Math.PI * 2,
      fall: 0.35 + random() * 0.75,
      size: 0.16 + random() * 0.2,
    };
    leafState.push(state);
    place(
      leafItems,
      state.x,
      state.y,
      state.z,
      new THREE.Vector3(state.size, state.size, state.size),
      new THREE.Euler(random() * 3, random() * 3, random() * 3),
    );
  }
  const leafMesh = buildInstanced(leafGeo, leafParticleMaterial, leafItems);
  if (leafMesh) scene.add(leafMesh);

  // ---- Fireflies and embers ----
  const sparkCount = low ? 90 : 260;
  const sparkGeometry = track(new THREE.BufferGeometry());
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkSeeds = new Float32Array(sparkCount);
  for (let i = 0; i < sparkCount; i += 1) {
    sparkPositions[i * 3] = (random() - 0.5) * 52;
    sparkPositions[i * 3 + 1] = 0.3 + random() * 7.5;
    sparkPositions[i * 3 + 2] = (random() - 0.5) * 40 - 2;
    sparkSeeds[i] = random();
  }
  sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeometry.setAttribute("aSeed", new THREE.BufferAttribute(sparkSeeds, 1));
  const sparkUniforms = {
    uTime: wind.uTime,
    uOpacity: { value: initial.fireflies },
    uColor: { value: new THREE.Color(0xffd98d) },
    uSize: { value: 26 },
    uRise: { value: 0 },
    uPixelRatio: { value: 1 },
  };
  const sparkMaterial = track(
    createFireflyMaterial(glow, sparkUniforms),
  );
  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  sparks.frustumCulled = false;
  scene.add(sparks);

  // ---- Pollen ----
  const pollenCount = low ? 55 : 150;
  const pollenGeometry = track(new THREE.BufferGeometry());
  const pollenPositions = new Float32Array(pollenCount * 3);
  const pollenSeeds = new Float32Array(pollenCount);
  for (let i = 0; i < pollenCount; i += 1) {
    pollenPositions[i * 3] = (random() - 0.5) * 48;
    pollenPositions[i * 3 + 1] = 0.4 + random() * 6.2;
    pollenPositions[i * 3 + 2] = (random() - 0.5) * 36 - 4;
    pollenSeeds[i] = random();
  }
  pollenGeometry.setAttribute("position", new THREE.BufferAttribute(pollenPositions, 3));
  pollenGeometry.setAttribute("aSeed", new THREE.BufferAttribute(pollenSeeds, 1));
  const pollenUniforms = {
    uTime: wind.uTime,
    uOpacity: { value: initial.pollen },
    uColor: { value: new THREE.Color(0xffe6b8) },
    uSize: { value: 10 },
    uPixelRatio: { value: 1 },
  };
  const pollenMaterial = track(createPollenMaterial(glow, pollenUniforms));
  const pollen = new THREE.Points(pollenGeometry, pollenMaterial);
  pollen.frustumCulled = false;
  scene.add(pollen);

  // ---- Birds ----
  const birdMaterial = track(
    new THREE.MeshBasicMaterial({
      color: 0x14201a,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    }),
  );
  const wingShape = track(new THREE.BufferGeometry());
  wingShape.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([0, 0, 0, 1.5, 0.12, -0.22, 0.42, 0.06, 0.5, 1.1, 0.1, 0.55]),
      3,
    ),
  );
  wingShape.setIndex([0, 2, 1, 1, 2, 3]);
  wingShape.computeVertexNormals();
  const bodyGeo = track(new THREE.ConeGeometry(0.09, 0.7, 5));
  const birdData: {
    group: THREE.Group;
    left: THREE.Mesh;
    right: THREE.Mesh;
    speed: number;
    offset: number;
    y: number;
    z: number;
    span: number;
  }[] = [];
  const birdGroup = new THREE.Group();
  for (let i = 0; i < (low ? 4 : 7); i += 1) {
    const group = new THREE.Group();
    const left = new THREE.Mesh(wingShape, birdMaterial);
    left.scale.x = -1;
    const right = new THREE.Mesh(wingShape, birdMaterial);
    const body = new THREE.Mesh(bodyGeo, birdMaterial);
    body.rotation.x = Math.PI / 2;
    group.add(left, right, body);
    group.scale.setScalar(0.85 + (i % 3) * 0.3);
    birdGroup.add(group);
    birdData.push({
      group,
      left,
      right,
      speed: 1.5 + (i % 4) * 0.32,
      offset: i * 5.2,
      y: 13 + (i % 5) * 1.7,
      z: -30 - (i % 3) * 9,
      span: 92,
    });
  }
  scene.add(birdGroup);

  // ---- Butterflies ----
  const butterflyWing = track(butterflyWingGeometry());
  const butterflyMaterial = track(
    new THREE.MeshBasicMaterial({
      color: 0xb97a38,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const butterflyBodyGeo = track(new THREE.CapsuleGeometry(0.016, 0.085, 3, 6));
  const butterflyBodyMaterial = track(new THREE.MeshBasicMaterial({ color: 0x2a1f16 }));
  const butterflies: {
    group: THREE.Group;
    left: THREE.Group;
    right: THREE.Group;
    cx: number;
    cz: number;
    baseY: number;
    radius: number;
    speed: number;
    phase: number;
  }[] = [];
  const butterflyGroup = new THREE.Group();
  for (let i = 0; i < (low ? 2 : 4); i += 1) {
    const group = new THREE.Group();
    const left = new THREE.Group();
    const right = new THREE.Group();
    const leftWing = new THREE.Mesh(butterflyWing, butterflyMaterial);
    leftWing.scale.x = -1;
    const rightWing = new THREE.Mesh(butterflyWing, butterflyMaterial);
    left.add(leftWing);
    right.add(rightWing);
    const body = new THREE.Mesh(butterflyBodyGeo, butterflyBodyMaterial);
    body.rotation.x = Math.PI / 2;
    group.add(left, right, body);
    group.scale.setScalar(0.9 + (i % 3) * 0.12);
    butterflyGroup.add(group);

    const cx = -3 + noise1(i * 3.7)(2.4) * 10;
    // Over the far bank, not the river channel: low mid-channel fliers were
    // hidden behind the near bank from the camera.
    const cz = -7.4 - noise1(i * 5.1)(5.5) * 3.4;
    butterflies.push({
      group,
      left,
      right,
      cx,
      cz,
      baseY: surfaceY(cx, cz) + 0.65 + noise1(i * 7.3)(8.9) * 0.6,
      radius: 0.8 + noise1(i * 9.1)(4.2) * 1.2,
      speed: 0.22 + noise1(i * 11.3)(6.6) * 0.24,
      phase: noise1(i * 13.7)(7.8) * Math.PI * 2,
    });
  }
  scene.add(butterflyGroup);

  // ---- The Bodhisatta, as a hare ----
  const furMap = track(furTexture());
  const hareMaterial = track(
    new THREE.MeshStandardMaterial({
      color: colors.fur.clone(),
      map: furMap,
      roughness: 0.92,
      metalness: 0,
      dithering: true,
    }),
  );
  const hareDark = track(
    new THREE.MeshStandardMaterial({ color: colors.fur.clone().multiplyScalar(0.62), roughness: 0.95 }),
  );
  const hareInner = track(
    new THREE.MeshStandardMaterial({ color: colors.fur.clone().multiplyScalar(1.5), roughness: 0.86 }),
  );
  const eyeMaterial = track(
    new THREE.MeshStandardMaterial({ color: 0x090a09, roughness: 0.12, metalness: 0 }),
  );

  const hare = new THREE.Group();
  const torso = new THREE.Mesh(track(new THREE.SphereGeometry(0.5, 22, 16)), hareMaterial);
  torso.scale.set(1.32, 0.94, 0.98);
  torso.position.set(0, 0.44, 0);
  const haunch = new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 18, 14)), hareMaterial);
  haunch.scale.set(1.16, 1.02, 1.1);
  haunch.position.set(-0.4, 0.36, 0);
  const chest = new THREE.Mesh(track(new THREE.SphereGeometry(0.3, 18, 14)), hareMaterial);
  chest.scale.set(1.05, 0.98, 0.94);
  chest.position.set(0.42, 0.42, 0);
  const tail = new THREE.Mesh(track(new THREE.SphereGeometry(0.14, 12, 10)), hareInner);
  tail.position.set(-0.78, 0.5, 0);
  tail.scale.set(0.9, 1.1, 1);

  const head = new THREE.Group();
  head.position.set(0.62, 0.62, 0);
  const skull = new THREE.Mesh(track(new THREE.SphereGeometry(0.25, 20, 16)), hareMaterial);
  skull.scale.set(1.16, 0.98, 0.96);
  const muzzle = new THREE.Mesh(track(new THREE.SphereGeometry(0.13, 14, 12)), hareMaterial);
  muzzle.scale.set(1.35, 0.86, 0.9);
  muzzle.position.set(0.22, -0.05, 0);
  const nose = new THREE.Mesh(track(new THREE.SphereGeometry(0.032, 10, 8)), hareDark);
  nose.position.set(0.39, -0.01, 0);
  const eyeGeo = track(new THREE.SphereGeometry(0.042, 12, 10));
  const eyeLeft = new THREE.Mesh(eyeGeo, eyeMaterial);
  eyeLeft.position.set(0.15, 0.07, 0.16);
  const eyeRight = new THREE.Mesh(eyeGeo, eyeMaterial);
  eyeRight.position.set(0.15, 0.07, -0.16);
  head.add(skull, muzzle, nose, eyeLeft, eyeRight);

  const earGeo = track(new THREE.CapsuleGeometry(0.062, 0.4, 4, 10));
  const innerGeo = track(new THREE.CapsuleGeometry(0.032, 0.3, 4, 10));
  function makeEar(sign: number): { pivot: THREE.Group; tip: THREE.Group } {
    const pivot = new THREE.Group();
    pivot.position.set(-0.02, 0.2, 0.1 * sign);
    pivot.rotation.z = -0.24 * sign * 0.4 - 0.16;
    const tip = new THREE.Group();
    const outer = new THREE.Mesh(earGeo, hareMaterial);
    outer.scale.set(1, 1, 0.42);
    outer.position.y = 0.24;
    const inner = new THREE.Mesh(innerGeo, hareInner);
    inner.scale.set(1, 1, 0.42);
    inner.position.set(0.012, 0.24, 0.012 * sign);
    tip.add(outer, inner);
    pivot.add(tip);
    return { pivot, tip };
  }
  const earLeft = makeEar(1);
  const earRight = makeEar(-1);
  head.add(earLeft.pivot, earRight.pivot);

  const legGeo = track(new THREE.CapsuleGeometry(0.052, 0.2, 4, 8));
  const pawGeo = track(new THREE.SphereGeometry(0.075, 12, 10));
  const frontLeft = new THREE.Mesh(legGeo, hareMaterial);
  frontLeft.position.set(0.44, 0.16, 0.13);
  const frontRight = new THREE.Mesh(legGeo, hareMaterial);
  frontRight.position.set(0.44, 0.16, -0.13);
  const pawLeft = new THREE.Mesh(pawGeo, hareMaterial);
  pawLeft.scale.set(1.3, 0.6, 1);
  pawLeft.position.set(0.47, 0.03, 0.14);
  const pawRight = new THREE.Mesh(pawGeo, hareMaterial);
  pawRight.scale.set(1.3, 0.6, 1);
  pawRight.position.set(0.47, 0.03, -0.14);
  const hindLeft = new THREE.Mesh(pawGeo, hareMaterial);
  hindLeft.scale.set(1.9, 0.7, 0.9);
  hindLeft.position.set(-0.44, 0.06, 0.28);
  const hindRight = new THREE.Mesh(pawGeo, hareMaterial);
  hindRight.scale.set(1.9, 0.7, 0.9);
  hindRight.position.set(-0.44, 0.06, -0.28);

  hare.add(torso, haunch, chest, tail, head, frontLeft, frontRight, pawLeft, pawRight, hindLeft, hindRight);
  hare.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = !low;
      object.receiveShadow = !low;
    }
  });
  hare.position.set(hareX, surfaceY(hareX, hareZ) + 0.02, hareZ);
  hare.scale.setScalar(readerHare ? 1.7 : 1.4);
  hare.rotation.y = -0.28;
  scene.add(hare);

  // A warm pool of light behind the hare so it never reads as a cut-out.
  const halo = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({
        map: glow,
        color: 0xf3c98e,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  halo.scale.set(4.4, 2.2, 1);
  halo.position.set(hareX, hare.position.y + 0.55, hareZ - 1.5);
  scene.add(halo);

  // ---- Canopy framing ----
  const puff = track(puffTexture());
  // Out-of-focus canopy fringe. These hang from the top corners only: their
  // lower edge must stay above the camera's horizon, or a 30-unit near-black
  // quad swallows the whole foreground.
  const framingMaterial = track(
    new THREE.SpriteMaterial({
      map: puff,
      color: colors.canopy.clone().multiplyScalar(0.62),
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );
  const framing: THREE.Sprite[] = [];
  for (const [x, y, sx, sy] of [
    [-13.5, 9.4, 26, 9],
    [15, 10.0, 28, 10],
    [-6, 13.0, 30, 7],
    [7, 13.8, 26, 6],
  ] as const) {
    const frame = new THREE.Sprite(framingMaterial);
    frame.scale.set(sx, sy, 1);
    frame.position.set(x, y, 8.5);
    frame.renderOrder = 8;
    scene.add(frame);
    framing.push(frame);
  }

  // ---- Lights ----
  const hemisphere = new THREE.HemisphereLight(0xffe6bd, initial.ambientGround, initial.ambient);
  scene.add(hemisphere);
  const keyLight = new THREE.DirectionalLight(colors.sun.clone(), initial.sunlight);
  scene.add(keyLight);
  scene.add(keyLight.target);
  if (!low) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    const span = 34;
    keyLight.shadow.camera.left = -span;
    keyLight.shadow.camera.right = span;
    keyLight.shadow.camera.top = span;
    keyLight.shadow.camera.bottom = -span;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 140;
    keyLight.shadow.bias = -0.0007;
    keyLight.shadow.normalBias = 0.06;
  }
  const fill = new THREE.DirectionalLight(0xbfd6c9, 0.34);
  fill.position.set(-16, 9, 14);
  scene.add(fill);
  const bounce = new THREE.DirectionalLight(0xffc98a, 0.5);
  bounce.position.set(8, 2.5, 10);
  scene.add(bounce);
  const waterBounce = new THREE.PointLight(0xdcefe6, 6, 26, 2);
  waterBounce.position.set(2, WATER_Y + 0.4, riverZ(2) + 1.5);
  scene.add(waterBounce);

  // ---- Animation state ----
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let scrollProgress = 0;
  let paused = false;
  let disposed = false;
  let raf = 0;
  let elapsed = 0;
  let intro = options.reducedMotion ? 1 : 0;
  let lastTime = 0;
  const lookTarget = new THREE.Vector3(0, initial.targetY, -10);
  const scratchA = new THREE.Vector3();
  const scratchB = new THREE.Vector3();
  const scratchC = new THREE.Vector3();
  const toCamVec = new THREE.Vector3();
  const sideVec = new THREE.Vector3();
  const normalVec = new THREE.Vector3();
  const basis = new THREE.Matrix4();
  const sourcePosition = new THREE.Vector3();

  function resize(): void {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth ?? canvas.clientWidth ?? 1;
    const height = parent?.clientHeight ?? canvas.clientHeight ?? 1;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sparkUniforms.uPixelRatio.value = renderer.getPixelRatio();
    // Resizing clears the drawing buffer and the static path has no frame loop.
    if (options.reducedMotion) draw(0.016, 0.4);
  }

  function draw(delta: number, time: number): void {
    const ease = Math.min(1, delta * 1.5);
    for (const key of colorKeys) colors[key].lerp(colorTargets[key], ease);
    for (const key of Object.keys(motion) as (keyof typeof motion)[]) {
      motion[key] += (motionTarget[key] - motion[key]) * ease;
    }
    sunDir.lerp(sunDirTarget, ease);
    moonDir.lerp(moonDirTarget, ease);
    keyDir.copy(sunDir).multiplyScalar(1 - motion.moonOpacity).addScaledVector(moonDir, motion.moonOpacity).normalize();

    renderer.toneMappingExposure = motion.exposure;

    skyUniforms.uSunDir.value.copy(keyDir);
    skyUniforms.uStars.value = motion.stars;
    skyUniforms.uHaze.value = 0.35 + motion.mist * 0.55;
    skyUniforms.uTop.value.copy(colors.skyTop);
    skyUniforms.uBottom.value.copy(colors.skyBottom);
    (skyUniforms.uHorizon.value as THREE.Color).copy(colors.horizon);
    (skyUniforms.uSun.value as THREE.Color).copy(colors.sun);

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(colors.fog);
      scene.fog.near = motion.fogNear;
      scene.fog.far = motion.fogFar;
    }

    groundMaterial.color.copy(colors.ground);
    trunkMaterial.color.copy(colors.trunk);
    treeBarkMaterial.color.copy(colors.trunk);
    foliageMaterial.color.copy(colors.canopy).offsetHSL(0.014, -0.05, 0.07);
    bushMaterial.color.copy(colors.canopy).offsetHSL(-0.01, 0.03, -0.04);
    grassMaterial.color.copy(colors.grass);
    stoneMaterial.color.copy(colors.rock);
    hareMaterial.color.copy(colors.fur);
    hareDark.color.copy(colors.fur).multiplyScalar(0.55);
    hareInner.color.copy(colors.fur).multiplyScalar(1.55);
    framingMaterial.color.copy(colors.canopy).multiplyScalar(0.42);
    hemisphere.intensity = motion.ambient;
    hemisphere.color.copy(colors.sun).lerp(WHITE, 0.35);
    hemisphere.groundColor.copy(colors.ground).multiplyScalar(0.55);
    keyLight.color.copy(colors.sun);
    keyLight.position.copy(keyDir).multiplyScalar(60);
    keyLight.target.position.set(0, -0.5, -8);
    fill.color.copy(colors.skyTop).lerp(colors.fog, 0.4);
    bounce.color.copy(colors.sun).lerp(colors.waterShallow, 0.35);
    waterBounce.color.copy(colors.waterShallow);
    waterBounce.intensity = 2 + motion.glint * 5;

    (riverUniforms.uShallow.value as THREE.Color).copy(colors.waterShallow);
    (riverUniforms.uDeep.value as THREE.Color).copy(colors.waterDeep);
    (riverUniforms.uSun.value as THREE.Color).copy(colors.sun);
    (riverUniforms.uSkyTop.value as THREE.Color).copy(colors.skyTop);
    (riverUniforms.uSkyBottom.value as THREE.Color).copy(colors.skyBottom);
    (riverUniforms.uFogColor.value as THREE.Color).copy(colors.fog);
    riverUniforms.uSunDir.value.copy(keyDir);
    riverUniforms.uFogNear.value = motion.fogNear;
    riverUniforms.uFogFar.value = motion.fogFar;
    riverUniforms.uSunGlint.value = motion.glint;
    riverUniforms.uMurk.value = motion.murk;
    riverUniforms.uRipple.value = 0.55 + motion.wind * 0.9;

    wind.uWind.value = motion.wind;
    // Two incommensurate slow waves so gusts arrive irregularly rather than on
    // an audible metronome; foliage, grass and fallen leaves all share it.
    wind.uGust.value = clamp01(
      0.42 + Math.sin(time * 0.29 + 0.7) * 0.34 + Math.sin(time * 0.117 + 2.4) * 0.24,
    );

    const flicker =
      1 +
      (Math.sin(time * 12.7) * 0.55 + Math.sin(time * 27.3 + 1.7) * 0.3) *
        motion.embers *
        0.16;
    keyLight.intensity = motion.sunlight * flicker;

    pollenUniforms.uOpacity.value =
      motion.pollen * (0.2 + motion.sunOpacity * 0.55) * (0.85 + wind.uGust.value * 0.15);
    pollenUniforms.uColor.value.copy(colors.sun).lerp(WHITE, 0.4);
    pollen.visible = pollenUniforms.uOpacity.value > 0.005;

    butterflyMaterial.opacity = 0.3 + motion.butterflies * 0.5;
    butterflyMaterial.color.copy(BUTTERFLY_TINT).lerp(colors.sun, 0.22);
    butterflyGroup.visible = motion.butterflies > 0.03;

    const haloBreathe = 1 + Math.sin(time * 0.8) * 0.018;
    sunHalo.scale.set(64 * haloBreathe, 64 * haloBreathe, 1);
    moonHalo.scale.set(34 * haloBreathe, 34 * haloBreathe, 1);

    shaftUniforms.uColor.value.copy(colors.sun);
    shaftUniforms.uOpacity.value = motion.shafts * 0.32;
    mistUniforms.uDensity.value = 0.25 + motion.mist * 0.5;
    mistUniforms.uOpacity.value = 0.05 + motion.mist * 0.24;
    (mistUniforms.uColor.value as THREE.Color).copy(colors.fog).lerp(WHITE, 0.3);
    // The banks themselves lean and slide with the same air that moves the trees.
    mistGroup.rotation.y = Math.sin(time * 0.021 + 0.5) * 0.045;
    mistGroup.position.x = Math.sin(time * 0.037) * 1.9;
    mistGroup.position.z = Math.cos(time * 0.029) * 0.9;

    for (let i = 0; i < ripples.length; i += 1) {
      const ripple = ripples[i];
      if (!ripple) continue;
      const t = (time * ripple.speed + ripple.phase) % 1;
      const fade = 1 - t;
      ripple.mesh.scale.setScalar(0.5 + t * 4.2);
      ripple.material.opacity =
        fade * fade * (0.035 + motion.glint * 0.14) * (1 - motion.murk * 0.45);
      ripple.mesh.visible = motion.glint > 0.1;
    }

    // The visible disc follows the same direction as the key light, and tracks
    // the camera so it stays at infinity.
    sourcePosition.copy(keyDir).multiplyScalar(150).add(camera.position);
    sunHalo.position.copy(sourcePosition);
    sunDisc.position.copy(sourcePosition);
    sunDisc.quaternion.copy(camera.quaternion);
    sunDisc.material.opacity = motion.sunOpacity;
    sunHalo.material.opacity = motion.sunOpacity * 0.8;
    (sunDisc.material as THREE.MeshBasicMaterial).color.copy(colors.sun);
    (sunHalo.material as THREE.SpriteMaterial).color.copy(colors.sun).lerp(WHITE, 0.3);
    scratchB.copy(moonDir).multiplyScalar(150).add(camera.position);
    moonDisc.position.copy(scratchB);
    moonDisc.quaternion.copy(camera.quaternion);
    moonHalo.position.copy(scratchB);
    moonDisc.material.opacity = motion.moonOpacity;
    moonHalo.material.opacity = motion.moonOpacity * 0.5;

    // Sparks double as fireflies (hovering) and embers (rising).
    const emberled = motion.embers > motion.fireflies;
    sparkUniforms.uOpacity.value = Math.max(motion.fireflies * 0.9, motion.embers * 0.75);
    sparkUniforms.uRise.value = emberled ? 1 : 0;
    sparkUniforms.uColor.value.copy(emberled ? EMBER_COLOR : FIREFLY_COLOR);
    sparks.visible = sparkUniforms.uOpacity.value > 0.005;

    // God rays: each beam runs from just above the canopy down to its patch of
    // floor, with the quad turned to face the camera.
    for (const shaft of shafts) {
      scratchB.copy(shaft.ground);
      // Each beam swells on its own slow rhythm, so the light feels alive
      // without the whole scene pulsing in sync.
      scratchA.copy(scratchB).addScaledVector(keyDir, 38 + Math.sin(time * 0.17 + shaft.ground.x * 0.3) * 2.5);
      const dir = scratchC.copy(scratchB).sub(scratchA).normalize();
      const toCam = toCamVec.copy(camera.position).sub(scratchB).normalize();
      const side = sideVec.crossVectors(dir, toCam);
      if (side.lengthSq() < 1e-6) side.set(0, 0, 1);
      side.normalize();
      const normal = normalVec.crossVectors(side, dir).normalize();
      basis.makeBasis(side, dir, normal);
      shaft.mesh.quaternion.setFromRotationMatrix(basis);
      shaft.mesh.position.copy(scratchA).lerp(scratchB, 0.5);
      const swell = 0.9 + Math.sin(time * 0.31 + shaft.ground.x * 0.21) * 0.1;
      shaft.mesh.scale.set(shaft.width * swell, scratchA.distanceTo(scratchB), 1);
    }

    // Camera: pointer parallax over a slow idle drift, plus the scroll dolly.
    smooth.x += (pointer.x - smooth.x) * Math.min(1, delta * 2.4);
    smooth.y += (pointer.y - smooth.y) * Math.min(1, delta * 2.4);
    if (!options.reducedMotion) intro = Math.min(1, intro + delta * 0.45);
    const introEase = intro * intro * (3 - 2 * intro);
    const drift = options.reducedMotion ? 0 : 1;
    const targetX =
      smooth.x * 1.5 + Math.sin(time * 0.07) * 0.5 * drift + Math.sin(time * 0.023) * 0.75 * drift;
    const targetY =
      motion.cameraY +
      smooth.y * 0.55 +
      Math.sin(time * 0.11 + 1.2) * 0.12 * drift +
      Math.sin(time * 0.043) * 0.14 * drift;
    const targetZ = motion.cameraZ - scrollProgress * 2.6 + (1 - introEase) * 2.2;
    camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.2);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.2);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 1.6);
    lookTarget.set(
      smooth.x * 1.1 + Math.sin(time * 0.05) * 0.2 * drift,
      motion.targetY - scrollProgress * 0.5,
      -10,
    );
    camera.lookAt(lookTarget);
    // A hint of handheld roll keeps the frame from feeling like a locked-off render.
    camera.rotateZ((Math.sin(time * 0.11) * 0.007 + smooth.x * 0.005) * drift);
    sky.position.set(camera.position.x, camera.position.y * 0.4, camera.position.z - 150);

    // Leaves tumble on three axes, ride the gust front and wrap back to the canopy.
    if (leafMesh && !options.reducedMotion) {
      const gust = wind.uGust.value;
      for (let i = 0; i < leafState.length; i += 1) {
        const state = leafState[i];
        if (!state) continue;
        state.y -= delta * state.fall * (0.4 + motion.leafFall) * (1 + gust * 0.35);
        state.spin += delta * (1.1 + state.fall);
        state.x +=
          delta *
          (0.22 + motion.wind * 0.9) *
          (0.45 + Math.sin(state.spin * 1.4) * 0.55) *
          (0.45 + gust);
        state.z += delta * Math.cos(state.spin * 0.7) * (0.3 + motion.wind * 0.5);
        if (state.y < -0.4 || Math.abs(state.x) > 34) {
          state.y = 15 + random() * 4;
          state.x = (random() - 0.5) * 54;
          state.z = (random() - 0.5) * 44 - 4;
          state.spin = random() * Math.PI * 2;
        }
        const flutter = Math.sin(state.spin * 1.7) * 0.9;
        const driftSway = Math.sin(state.spin * 0.6) * (0.8 + gust * 0.8);
        scratchPosition.set(
          state.x + driftSway,
          state.y,
          state.z + Math.cos(state.spin * 0.45) * 1.2,
        );
        scratchEuler.set(flutter, state.spin * 0.7, state.spin + gust * 0.5);
        scratchQuaternion.setFromEuler(scratchEuler);
        // Fade in below the canopy and shrink out at the ground, so respawns
        // never pop in view.
        const fade =
          smoothstep01(-0.4, 1.3, state.y) * smoothstep01(19, 15, state.y);
        scratchScale.setScalar(state.size * (0.25 + fade * 0.75));
        scratchMatrix.compose(scratchPosition, scratchQuaternion, scratchScale);
        leafMesh.setMatrixAt(i, scratchMatrix);
      }
      leafMesh.instanceMatrix.needsUpdate = true;
      leafMesh.visible = motion.leafFall > 0.02;
    }

    // Hare: breathing, grazing, blinking, ear swivels, a tail twitch and the
    // occasional startle hop. `hop` lifts the whole body for a beat.
    const breath = Math.sin(time * 2.3);
    const hopCycle = (time * 0.105 + 0.58) % 1;
    const hop =
      hopCycle > 0.905 ? Math.sin(((hopCycle - 0.905) / 0.095) * Math.PI) : 0;
    const blinkCycle = (time * 0.163 + 0.37) % 1;
    const blink = Math.max(
      blinkCycle > 0.88 && blinkCycle < 0.9
        ? Math.sin(((blinkCycle - 0.88) / 0.02) * Math.PI)
        : 0,
      blinkCycle > 0.962 ? Math.sin(((blinkCycle - 0.962) / 0.038) * Math.PI) : 0,
    );
    eyeLeft.scale.y = 1 - blink * 0.92;
    eyeRight.scale.y = 1 - blink * 0.92;

    torso.scale.set(
      1.32 - hop * 0.03,
      0.94 + breath * 0.016 + hop * 0.04,
      0.98 + breath * 0.011 - hop * 0.01,
    );
    chest.scale.set(
      1.05 - hop * 0.02,
      0.98 + breath * 0.022 + hop * 0.035,
      0.94 + breath * 0.014,
    );
    const grazeCycle = (time * 0.1) % 1;
    const grazing =
      smoothstep01(0.42, 0.5, grazeCycle) * (1 - smoothstep01(0.72, 0.79, grazeCycle));
    const graze = grazing * (1 - hop);
    head.rotation.x = -0.05 - graze * 0.72 - hop * 0.32 + Math.sin(time * 0.43) * 0.035;
    head.rotation.y = Math.sin(time * 0.29) * 0.22 * (1 - graze) + hop * 0.12;
    head.position.y = 0.62 - graze * 0.14 + hop * 0.05;
    muzzle.scale.set(1.35 + Math.sin(time * 11) * 0.02, 0.86 + Math.sin(time * 9.3) * 0.02, 0.9);
    const flick = Math.max(0, Math.sin(time * 0.7) - 0.965) * 28;
    const flickRight = Math.max(0, Math.sin(time * 0.53 + 2.1) - 0.965) * 28;
    earLeft.pivot.rotation.z = -0.16 + Math.sin(time * 0.61) * 0.14 - flick * 0.5;
    earLeft.pivot.rotation.x = Math.sin(time * 0.47) * 0.16 + graze * 0.34 + hop * 0.2;
    earRight.pivot.rotation.z = 0.16 - Math.sin(time * 0.53 + 1.1) * 0.14 + flickRight * 0.5;
    earRight.pivot.rotation.x = Math.sin(time * 0.41 + 0.7) * 0.14 + graze * 0.34 + hop * 0.2;
    // The tips lag behind their pivots: that follow-through is most of the life.
    const tipSway = Math.sin(time * 1.9) * 0.07;
    earLeft.tip.rotation.z = tipSway + flick * 0.18;
    earRight.tip.rotation.z = -tipSway + flickRight * 0.18;
    const tailTwitch = Math.max(0, Math.sin(time * 0.83 + 1.4) - 0.93) * 6;
    tail.scale.set(0.9 + tailTwitch * 0.05, 1.1 - tailTwitch * 0.02, 1 + tailTwitch * 0.04);
    tail.rotation.z = tailTwitch * 0.08;
    hare.position.y =
      surfaceY(hareX, hareZ) + 0.02 + Math.sin(time * 1.15) * 0.008 + hop * 0.17;
    hare.rotation.x = -hop * 0.1;
    hare.rotation.y = -0.28 + Math.sin(time * 0.21) * 0.09 + graze * 0.12;
    hare.rotation.z = Math.sin(time * 0.33) * 0.012 + hop * 0.02;
    halo.material.opacity = 0.08 + motion.sunOpacity * 0.12 + motion.moonOpacity * 0.04;

    for (const bird of birdData) {
      const travel = ((time * bird.speed + bird.offset) % bird.span) - bird.span / 2;
      const lift =
        Math.sin(time * 0.5 + bird.offset) * 0.6 +
        Math.sin(time * 0.23 + bird.offset * 1.7) * 0.9;
      const weave = Math.sin(time * 0.31 + bird.offset * 0.7) * 2.2;
      bird.group.position.set(travel, bird.y + lift, bird.z + weave);
      // Bursts of flapping separated by glides, with a bank into the weave.
      const energy = 0.4 + 0.6 * Math.max(0, Math.sin(time * 0.21 + bird.offset * 0.9));
      const flap = Math.sin(time * 6.4 + bird.offset) * energy;
      bird.left.rotation.z = flap * 0.9;
      bird.right.rotation.z = -flap * 0.9;
      bird.group.rotation.x = flap * 0.08;
      bird.group.rotation.y = -0.2 + Math.sin(time * 0.27 + bird.offset) * 0.08;
      bird.group.rotation.z = Math.sin(time * 0.37 + bird.offset * 1.3) * 0.18;
    }
    birdMaterial.opacity = 0.55 + motion.birds * 0.3;
    birdGroup.visible = motion.birds > 0.02;

    if (butterflyGroup.visible) {
      for (const butterfly of butterflies) {
        const t = time * butterfly.speed + butterfly.phase;
        const x =
          butterfly.cx + Math.cos(t) * butterfly.radius + Math.sin(t * 0.63 + 1.7) * 0.55;
        const z = butterfly.cz + Math.sin(t * 1.27) * butterfly.radius * 0.62;
        const y = butterfly.baseY + Math.sin(t * 2.1) * 0.2 + Math.sin(t * 0.7) * 0.08;
        butterfly.group.position.set(x, y, z);
        butterfly.group.rotation.y = Math.atan2(-Math.sin(t), Math.cos(t * 1.27) * 0.79);
        butterfly.group.rotation.z = Math.sin(time * 2.3 + butterfly.phase) * 0.12;
        const flap = 0.25 + Math.sin(time * 19 + butterfly.phase * 3.1) * 0.75;
        butterfly.left.rotation.z = -flap;
        butterfly.right.rotation.z = flap;
      }
    }

    // Soft ambient occlusion under the props; the shadow map is directional and
    // leaves these objects looking pinned to the floor.
    contactMaterial.opacity = 0.2 + motion.sunOpacity * 0.22 + motion.moonOpacity * 0.1;

    renderer.render(scene, camera);
  }

  function loop(now: number): void {
    raf = requestAnimationFrame(loop);
    if (paused || disposed) {
      lastTime = now;
      return;
    }
    if (lastTime === 0) lastTime = now;
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += delta;
    wind.uTime.value = elapsed;
    draw(delta, elapsed);
  }

  resize();

  if (options.reducedMotion) {
    wind.uTime.value = 0.4;
    draw(0.016, 0.4);
  } else {
    raf = requestAnimationFrame(loop);
  }

  const onVisibility = (): void => {
    paused = document.hidden;
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onPointer = (event: PointerEvent): void => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  return {
    setLight(light: ForestLight) {
      const next = ENVIRONMENTS[light];
      for (const key of colorKeys) colorTargets[key].set(next[key]);
      motionTarget.cameraZ = next.cameraZ;
      motionTarget.cameraY = next.cameraY;
      motionTarget.targetY = next.targetY;
      motionTarget.fogNear = next.fogNear;
      motionTarget.fogFar = next.fogFar;
      motionTarget.sunlight = next.sunlight;
      motionTarget.ambient = next.ambient;
      motionTarget.sunOpacity = next.sunOpacity;
      motionTarget.moonOpacity = next.moonOpacity;
      motionTarget.fireflies = next.fireflies;
      motionTarget.embers = next.embers;
      motionTarget.stars = next.stars;
      motionTarget.shafts = next.shafts;
      motionTarget.mist = next.mist;
      motionTarget.murk = next.murk;
      motionTarget.glint = next.glint;
      motionTarget.wind = next.wind;
      motionTarget.leafFall = next.leafFall;
      motionTarget.birds = next.birds;
      motionTarget.butterflies = next.butterflies;
      motionTarget.pollen = next.pollen;
      motionTarget.exposure = next.exposure;
      sunDirTarget.set(...next.sunDir).normalize();
      moonDirTarget.set(...next.moonDir).normalize();
      hemisphere.groundColor.set(next.ambientGround);
      if (options.reducedMotion) {
        // Nothing is animating, so snap the scene rather than easing forever.
        for (const key of colorKeys) colors[key].copy(colorTargets[key]);
        for (const key of Object.keys(motion) as (keyof typeof motion)[]) {
          motion[key] = motionTarget[key];
        }
        sunDir.copy(sunDirTarget);
        moonDir.copy(moonDirTarget);
        draw(0.4, 1);
      }
    },
    setScroll(progress: number) {
      scrollProgress = Math.max(0, Math.min(1, progress));
      if (options.reducedMotion) draw(0.016, 0.4);
    },
    setPaused(value: boolean) {
      paused = value;
    },
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
          else material?.dispose();
        }
      });
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
