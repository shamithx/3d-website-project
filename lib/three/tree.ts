import * as THREE from "three";
import { rng } from "./forest-textures";

/**
 * Recursive trees in the spirit of EZ-Tree's generator: a branch queue grows
 * tapered tubes whose section orientations accumulate gnarliness, twist and a
 * pull toward the light, then terminal branches carry crossed leaf cards.
 * Variants are merged into two buffers (wood + leaves) so the forest can be
 * drawn with a handful of instanced meshes.
 */

export type TreeGeometry = {
  wood: THREE.BufferGeometry;
  leaves: THREE.BufferGeometry;
};

type VariantConfig = {
  children: readonly [number, number, number, number];
  trunk: number;
  lean: number;
  spread: number;
  leafCount: number;
  gnarl: number;
};

const VARIANTS: readonly VariantConfig[] = [
  { children: [5, 3, 2, 2], trunk: 0.5, lean: 0.06, spread: 1, leafCount: 8, gnarl: 1 },
  { children: [4, 3, 2, 2], trunk: 0.56, lean: -0.04, spread: 0.86, leafCount: 7, gnarl: 0.85 },
  { children: [5, 4, 2, 2], trunk: 0.46, lean: 0.09, spread: 1.12, leafCount: 8, gnarl: 1.18 },
  { children: [4, 3, 3, 2], trunk: 0.53, lean: 0.01, spread: 0.95, leafCount: 7, gnarl: 1 },
];

// Trunk is level 0; level 4 branches are terminal and carry the leaves.
const LEVELS = 4;

const SECTIONS = {
  high: [12, 7, 5, 4, 3],
  low: [9, 5, 4, 3, 3],
} as const;

const SEGMENTS = {
  high: [9, 7, 5, 4, 3],
  low: [7, 5, 4, 3, 3],
} as const;

// Lengths are fractions of the final tree height, before normalization.
const LENGTHS = [0.5, 0.35, 0.22, 0.135, 0.08] as const;
const CHILD_START = [0.28, 0.32, 0.34, 0.36] as const;
const CHILD_ANGLE = [1.06, 0.98, 0.86, 0.72] as const;
const RADIUS_FACTOR = [0.68, 0.62, 0.57, 0.53] as const;
const GNARL = [0.006, 0.012, 0.02, 0.026, 0.032] as const;
const TWIST = [0.03, 0.2, 0.32, 0.44, 0.55] as const;
const FORCE = [0.00045, 0.0007, 0.001, 0.0013, 0.0016] as const;

const UP = new THREE.Vector3(0, 1, 0);
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

type Section = {
  origin: THREE.Vector3;
  orientation: THREE.Quaternion;
  radius: number;
};

type PendingBranch = {
  origin: THREE.Vector3;
  orientation: THREE.Quaternion;
  length: number;
  radius: number;
  level: number;
};

type Builder = {
  positions: number[];
  normals: number[];
  uvs: number[];
  colors: number[];
  indices: number[];
};

function createBuilder(): Builder {
  return { positions: [], normals: [], uvs: [], colors: [], indices: [] };
}

function toGeometry(builder: Builder): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(builder.positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(builder.normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(builder.uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(builder.colors, 3));
  geometry.setIndex(builder.indices);
  geometry.computeBoundingSphere();
  return geometry;
}

function sampleSection(sections: Section[], t: number): Section {
  const last = sections.length - 1;
  if (last <= 0) return sections[0]!;
  const f = Math.max(0, Math.min(1, t)) * last;
  const index = Math.min(last - 1, Math.floor(f));
  const a = sections[index]!;
  const b = sections[index + 1]!;
  const alpha = f - index;
  return {
    origin: a.origin.clone().lerp(b.origin, alpha),
    orientation: a.orientation.clone().slerp(b.orientation, alpha),
    radius: a.radius + (b.radius - a.radius) * alpha,
  };
}

/**
 * One growth step: twist around the branch axis, a random gnarl whose strength
 * rises as the branch gets thinner, then a small rotation toward the light.
 */
function bend(
  orientation: THREE.Quaternion,
  radius: number,
  level: number,
  config: VariantConfig,
  random: () => number,
): THREE.Quaternion {
  const next = orientation.clone();
  next.multiply(
    new THREE.Quaternion().setFromAxisAngle(UP, TWIST[level]! * (0.5 + random() * 0.9)),
  );
  const gnarl =
    GNARL[level]! * config.gnarl * Math.min(6, 1 / Math.sqrt(Math.max(radius, 0.0015)));
  next.multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_X, (random() * 2 - 1) * gnarl));
  next.multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_Z, (random() * 2 - 1) * gnarl));

  const light = new THREE.Vector3(config.lean * 0.7 + 0.05, 1, -0.08).normalize();
  const qLight = new THREE.Quaternion().setFromUnitVectors(UP, light);
  next.rotateTowards(qLight, Math.min(0.16, FORCE[level]! / Math.max(radius, 0.002)));
  return next;
}

/** A leaf card and its perpendicular twin, so the cluster reads from any angle. */
function addLeafCluster(
  builder: Builder,
  center: THREE.Vector3,
  size: number,
  shade: number,
  random: () => number,
): void {
  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler((random() - 0.5) * 0.8, random() * Math.PI * 2, (random() - 0.5) * 0.8),
  );
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q).multiplyScalar(size * 0.5);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q).multiplyScalar(size * 0.5);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(q);

  addLeafQuad(builder, center, right, up, normal, shade);
  addLeafQuad(
    builder,
    center,
    normal.clone().multiplyScalar(size * 0.5),
    up,
    right.clone().normalize(),
    shade,
  );
}

function addLeafQuad(
  builder: Builder,
  center: THREE.Vector3,
  right: THREE.Vector3,
  up: THREE.Vector3,
  normal: THREE.Vector3,
  shade: number,
): void {
  const base = builder.positions.length / 3;
  const corners: Array<[number, number]> = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  for (const [rx, ry] of corners) {
    builder.positions.push(
      center.x + right.x * rx + up.x * ry,
      center.y + right.y * rx + up.y * ry,
      center.z + right.z * rx + up.z * ry,
    );
    builder.normals.push(normal.x, normal.y, normal.z);
    builder.colors.push(shade, shade, shade);
  }
  builder.uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
  builder.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

export function createTreeGeometry(
  seed: number,
  quality: "low" | "high",
  variant: number,
): TreeGeometry {
  const config = VARIANTS[variant % VARIANTS.length]!;
  const sectionsByLevel = SECTIONS[quality];
  const segmentsByLevel = SEGMENTS[quality];
  const random = rng(seed);
  const wood = createBuilder();
  const leaves = createBuilder();

  let maxY = 0;

  const queue: PendingBranch[] = [
    {
      origin: new THREE.Vector3(0, 0, 0),
      orientation: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(config.lean, random() * Math.PI * 2, config.lean * 0.5),
      ),
      length: config.trunk,
      radius: 0.035,
      level: 0,
    },
  ];

  while (queue.length > 0) {
    const branch = queue.shift()!;
    const level = Math.min(branch.level, LEVELS);
    const sectionCount = sectionsByLevel[level]!;
    const segmentCount = segmentsByLevel[level]!;
    const sectionLength = branch.length / sectionCount;
    const branchShade = 0.8 + random() * 0.18;
    const sections: Section[] = [];

    const origin = branch.origin.clone();
    let orientation = branch.orientation.clone();
    let previousRing = -1;

    for (let i = 0; i <= sectionCount; i += 1) {
      const t = i / sectionCount;
      let radius = branch.radius * Math.pow(1 - t, level === 0 ? 1.15 : 1);
      if (i === sectionCount) radius = Math.max(0.00045, branch.radius * 0.035);
      // Buttressed root flare: the trunk widens where it meets the ground.
      if (level === 0) radius *= 1 + Math.pow(1 - t, 4) * 0.55;
      radius = Math.max(radius, 0.0004);

      const ringStart = wood.positions.length / 3;
      const shade = branchShade * (0.88 + t * 0.12);
      for (let j = 0; j <= segmentCount; j += 1) {
        const angle = (j / segmentCount) * Math.PI * 2;
        // Slightly irregular cross-section on the trunk, fading out with height.
        const lobes =
          level === 0 ? 1 + Math.sin(angle * 3 + seed) * 0.05 * (1 - t) : 1;
        const radial = new THREE.Vector3(
          Math.cos(angle) * radius * lobes,
          0,
          Math.sin(angle) * radius * lobes,
        ).applyQuaternion(orientation);
        const x = origin.x + radial.x;
        const y = origin.y + radial.y;
        const z = origin.z + radial.z;
        wood.positions.push(x, y, z);

        const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .applyQuaternion(orientation)
          .normalize();
        wood.normals.push(normal.x, normal.y, normal.z);
        wood.uvs.push(j / segmentCount, t);
        wood.colors.push(shade, shade, shade);
        if (y > maxY) maxY = y;
      }

      if (previousRing >= 0) {
        for (let j = 0; j < segmentCount; j += 1) {
          const a = previousRing + j;
          const b = ringStart + j;
          wood.indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      previousRing = ringStart;

      sections.push({ origin: origin.clone(), orientation: orientation.clone(), radius });
      if (i < sectionCount) {
        origin.addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(orientation), sectionLength);
        orientation = bend(orientation, radius, level, config, random);
      }
    }

    if (level >= LEVELS) {
      const count =
        quality === "low" ? 3 : config.leafCount + (random() < 0.5 ? 1 : 0);
      for (let k = 0; k < count; k += 1) {
        const t = 0.1 + 0.9 * ((k + random() * 0.8) / count);
        const section = sampleSection(sections, t);
        const size = (quality === "low" ? 0.08 : 0.055) + random() * 0.04;
        const center = section.origin.clone();
        center.x += (random() - 0.5) * section.radius * 2.2;
        center.z += (random() - 0.5) * section.radius * 2.2;
        const shade =
          0.6 + Math.min(1, Math.max(0, center.y / 0.9)) * 0.3 + random() * 0.14;
        addLeafCluster(leaves, center, size, shade, random);
        maxY = Math.max(maxY, center.y + size * 0.75);
      }
    } else {
      const count = config.children[level]!;
      const radialBase = random() * Math.PI * 2;
      const childLevel = level + 1;
      for (let c = 0; c < count; c += 1) {
        const spreadT = CHILD_START[level]!;
        const t = spreadT + (0.94 - spreadT) * ((c + 0.25 + random() * 0.5) / count);
        const section = sampleSection(sections, t);
        const angle = radialBase + (c / count) * Math.PI * 2 + (random() - 0.5) * 0.55;
        const tilt = CHILD_ANGLE[level]! * (0.82 + random() * 0.36);
        const childOrientation = section.orientation
          .clone()
          .multiply(new THREE.Quaternion().setFromAxisAngle(UP, angle))
          .multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_X, tilt))
          .multiply(new THREE.Quaternion().setFromAxisAngle(UP, random() * Math.PI * 2));
        queue.push({
          origin: section.origin,
          orientation: childOrientation,
          length: LENGTHS[childLevel]! * config.spread * (0.82 + random() * 0.36),
          radius: Math.max(0.0011, section.radius * RADIUS_FACTOR[level]!),
          level: childLevel,
        });
      }
    }
  }

  // Normalize to a unit-height tree so instance scale is exact.
  const normalize = 1 / Math.max(0.001, maxY);
  for (const positions of [wood.positions, leaves.positions]) {
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = positions[i]! * normalize;
      positions[i + 1] = positions[i + 1]! * normalize;
      positions[i + 2] = positions[i + 2]! * normalize;
    }
  }

  return { wood: toGeometry(wood), leaves: toGeometry(leaves) };
}
