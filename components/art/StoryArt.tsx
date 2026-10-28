import type { AnimalKind, Composition, PaletteKey, SceneKind } from "@/content/stories/types";
import { cn } from "@/lib/utils";

type Palette = {
  skyTop: string;
  skyBottom: string;
  sun: string;
  sunGlow: string;
  far: string;
  mid: string;
  near: string;
  ground: string;
  water: string;
  accent: string;
  animal: string;
  light: boolean;
};

const PALETTES: Record<PaletteKey, Palette> = {
  dawn: {
    skyTop: "#F2D3AE",
    skyBottom: "#FCF0D9",
    sun: "#E9B36C",
    sunGlow: "#F6D8AC",
    far: "#C2C7A9",
    mid: "#78956F",
    near: "#31503A",
    ground: "#213B2B",
    water: "#A9C2B7",
    accent: "#C08A3E",
    animal: "#1B2E24",
    light: false,
  },
  emerald: {
    skyTop: "#E3EBDC",
    skyBottom: "#F7F1DD",
    sun: "#D8BF7C",
    sunGlow: "#EFE2BE",
    far: "#A9BBA0",
    mid: "#567B5E",
    near: "#23412F",
    ground: "#162D21",
    water: "#7C9E92",
    accent: "#B08A4F",
    animal: "#15271D",
    light: false,
  },
  river: {
    skyTop: "#D6E6E5",
    skyBottom: "#F5EFDB",
    sun: "#E2C68C",
    sunGlow: "#EFE6C8",
    far: "#A6C0B8",
    mid: "#4F7B77",
    near: "#26483F",
    ground: "#18352D",
    water: "#4E8A9B",
    accent: "#C0943F",
    animal: "#152A25",
    light: false,
  },
  dusk: {
    skyTop: "#6E4C53",
    skyBottom: "#E8B58A",
    sun: "#F0BE7C",
    sunGlow: "#E7A472",
    far: "#7A5B58",
    mid: "#3D3C3C",
    near: "#1E2723",
    ground: "#141C1A",
    water: "#5B7180",
    accent: "#D3A45F",
    animal: "#121A18",
    light: true,
  },
  night: {
    skyTop: "#0E1E2E",
    skyBottom: "#274257",
    sun: "#F3E8CB",
    sunGlow: "#C8D6D9",
    far: "#2B4559",
    mid: "#182C3B",
    near: "#0C1A24",
    ground: "#08131B",
    water: "#2F5568",
    accent: "#C8AE74",
    animal: "#E6DCC4",
    light: true,
  },
  gold: {
    skyTop: "#F2DDB4",
    skyBottom: "#FCF4DF",
    sun: "#D9A552",
    sunGlow: "#F0D9A5",
    far: "#C8BC8C",
    mid: "#8D8C60",
    near: "#3E4C36",
    ground: "#2A3726",
    water: "#8FA79B",
    accent: "#B07C33",
    animal: "#22301F",
    light: false,
  },
  ember: {
    skyTop: "#2A1B1D",
    skyBottom: "#C67A45",
    sun: "#F3A75F",
    sunGlow: "#E08A4F",
    far: "#5A3630",
    mid: "#2E1F1E",
    near: "#170F10",
    ground: "#0E0809",
    water: "#7A4E48",
    accent: "#E0A05A",
    animal: "#120C0C",
    light: true,
  },
};

type StoryArtProps = {
  slug: string;
  scene: SceneKind;
  palette: PaletteKey;
  animal: AnimalKind;
  composition: Composition;
  className?: string;
  /** Hide from assistive tech when the surrounding card already names the story. */
  decorative?: boolean;
  title?: string;
};

const ANIMAL_LABELS: Record<AnimalKind, string> = {
  hare: "A hare",
  deer: "A deer",
  monkey: "A monkey",
  elephant: "An elephant",
  fish: "A fish",
  parrot: "A parrot",
  lion: "A lion",
  serpent: "A serpent",
  peacock: "A peacock",
  swan: "A swan",
  human: "A person",
};

export function StoryArt({
  slug,
  scene,
  palette,
  animal,
  composition,
  className,
  decorative = true,
  title,
}: StoryArtProps) {
  const p = PALETTES[palette];
  const uid = `art-${slug.replace(/[^a-z0-9-]/gi, "")}-${composition}`;
  const horizon = composition === "wide" ? 470 : 520;
  const arch = composition === "arch";

  return (
    <svg
      viewBox="0 0 640 800"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title ?? `Illustration for ${slug}`}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="100%" stopColor={p.skyBottom} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sunGlow} stopOpacity="0.95" />
          <stop offset="60%" stopColor={p.sunGlow} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.sunGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.water} stopOpacity="0.95" />
          <stop offset="100%" stopColor={p.near} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyBottom} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p.skyBottom} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-arch`}>
          <path d="M0 800 L0 300 C0 150 140 70 320 70 C500 70 640 150 640 300 L640 800 Z" />
        </clipPath>
        <clipPath id={`${uid}-frame`}>
          <rect x="0" y="0" width="640" height="800" />
        </clipPath>
      </defs>

      <g clipPath={arch ? `url(#${uid}-arch)` : `url(#${uid}-frame)`}>
        <rect width="640" height="800" fill={`url(#${uid}-sky)`} />

        {scene === "night" ? <Stars /> : null}
        <Sun p={p} uid={uid} scene={scene} />
        <Clouds p={p} scene={scene} />

        <SceneLayer scene={scene} p={p} horizon={horizon} uid={uid} />
        <AnimalFigure kind={animal} p={p} scene={scene} />
        <Foreground scene={scene} p={p} composition={composition} />
        <Mist p={p} uid={uid} horizon={horizon} />
      </g>

      {arch ? (
        <>
          <path
            d="M10 800 L10 300 C10 152 148 60 320 60 C492 60 630 152 630 300 L630 800"
            fill="none"
            stroke={p.accent}
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <path
            d="M22 800 L22 302 C22 160 154 72 320 72 C486 72 618 160 618 302 L618 800"
            fill="none"
            stroke={p.accent}
            strokeOpacity="0.25"
            strokeWidth="1"
          />
        </>
      ) : null}
    </svg>
  );
}

function Sun({ p, uid, scene }: { p: Palette; uid: string; scene: SceneKind }) {
  const night = scene === "night";
  const x = night ? 470 : 452;
  const y = night ? 180 : 220;
  const r = night ? 58 : 74;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 3.4} fill={`url(#${uid}-glow)`} />
      <circle cx={x} cy={y} r={r} fill={p.sun} opacity={night ? 0.95 : 0.85} />
      {night ? (
        <g fill={p.skyTop} opacity="0.35">
          <circle cx={x - 18} cy={y - 12} r="13" />
          <circle cx={x + 20} cy={y + 14} r="9" />
          <circle cx={x + 4} cy={y - 26} r="7" />
        </g>
      ) : null}
    </g>
  );
}

function Stars() {
  const stars = [
    [70, 120, 1.6],
    [148, 82, 1.1],
    [220, 150, 1.4],
    [286, 96, 1],
    [352, 62, 1.5],
    [408, 132, 1.1],
    [520, 96, 1.3],
    [580, 168, 1],
    [96, 214, 0.9],
    [252, 226, 1.2],
    [560, 240, 1.1],
  ] as const;
  return (
    <g fill="#F4EAD2">
      {stars.map(([cx, cy, r], index) => (
        <circle key={index} cx={cx} cy={cy} r={r} opacity={0.5 + (index % 3) * 0.12} />
      ))}
    </g>
  );
}

function Clouds({ p, scene }: { p: Palette; scene: SceneKind }) {
  if (scene === "night") return null;
  return (
    <g fill={p.skyBottom} opacity="0.5">
      <ellipse cx="150" cy="240" rx="88" ry="14" />
      <ellipse cx="196" cy="228" rx="52" ry="10" />
      <ellipse cx="500" cy="300" rx="70" ry="11" />
      <ellipse cx="540" cy="290" rx="44" ry="8" />
    </g>
  );
}

function SceneLayer({
  scene,
  p,
  horizon,
  uid,
}: {
  scene: SceneKind;
  p: Palette;
  horizon: number;
  uid: string;
}) {
  const waterTop = horizon + 60;

  return (
    <g>
      {/* Far ridge */}
      {scene === "mountain" || scene === "cliff" ? (
        <>
          <path d={`M0 ${horizon - 40} L120 190 L210 300 L300 150 L420 300 L520 210 L640 300 L640 ${horizon} L0 ${horizon} Z`} fill={p.far} opacity="0.9" />
          <path d={`M300 150 L360 240 L330 236 Z`} fill="#FFFFFF" opacity="0.55" />
          <path d={`M0 ${horizon} L120 300 L230 ${horizon} Z`} fill={p.mid} opacity="0.55" />
        </>
      ) : (
        <path
          d={`M0 ${horizon - 10} C90 ${horizon - 62} 150 ${horizon - 30} 220 ${horizon - 48} C300 ${horizon - 70} 360 ${horizon - 22} 440 ${horizon - 42} C520 ${horizon - 62} 580 ${horizon - 26} 640 ${horizon - 40} L640 ${horizon} L0 ${horizon} Z`}
          fill={p.far}
          opacity="0.85"
        />
      )}

      {/* Mid ground */}
      <path
        d={`M0 ${horizon} C120 ${horizon - 26} 190 ${horizon + 6} 280 ${horizon - 10} C380 ${horizon - 28} 470 ${horizon + 8} 560 ${horizon - 6} C600 ${horizon - 12} 620 ${horizon - 4} 640 ${horizon} L640 800 L0 800 Z`}
        fill={p.mid}
        opacity="0.92"
      />

      {scene === "river" || scene === "lake" || scene === "ocean" ? (
        <WaterBand p={p} uid={uid} top={waterTop} scene={scene} />
      ) : null}

      <path
        d={`M0 ${horizon + 150} C140 ${horizon + 120} 250 ${horizon + 168} 360 ${horizon + 140} C470 ${horizon + 112} 560 ${horizon + 156} 640 ${horizon + 132} L640 800 L0 800 Z`}
        fill={p.near}
      />

      <SceneProps scene={scene} p={p} horizon={horizon} />
    </g>
  );
}

function WaterBand({
  p,
  uid,
  top,
  scene,
}: {
  p: Palette;
  uid: string;
  top: number;
  scene: SceneKind;
}) {
  const height = scene === "ocean" ? 300 : 150;
  return (
    <g>
      <rect x="0" y={top} width="640" height={height} fill={`url(#${uid}-water)`} />
      <g stroke={p.skyBottom} strokeOpacity="0.4" strokeWidth="1.5">
        <path d={`M40 ${top + 26} q30 -8 62 0 t62 0 t62 0`} fill="none" />
        <path d={`M330 ${top + 58} q34 -9 68 0 t68 0 t62 0`} fill="none" />
        <path d={`M70 ${top + 92} q28 -7 56 0 t56 0`} fill="none" />
        <path d={`M380 ${top + 112} q30 -8 60 0 t60 0`} fill="none" />
      </g>
      {scene === "lake" ? (
        <g fill={p.near} opacity="0.75">
          <ellipse cx="120" cy={top + 40} rx="20" ry="6" />
          <ellipse cx="180" cy={top + 74} rx="14" ry="4" />
          <ellipse cx="500" cy={top + 52} rx="17" ry="5" />
        </g>
      ) : null}
    </g>
  );
}

function SceneProps({ scene, p, horizon }: { scene: SceneKind; p: Palette; horizon: number }) {
  switch (scene) {
    case "palace":
      return (
        <g>
          <rect x="150" y={horizon - 96} width="340" height="96" fill={p.near} />
          <rect x="150" y={horizon - 108} width="340" height="12" fill={p.accent} opacity="0.55" />
          <path d={`M212 ${horizon - 108} L212 ${horizon - 176} L320 ${horizon - 224} L428 ${horizon - 176} L428 ${horizon - 108} Z`} fill={p.near} />
          <path d={`M320 ${horizon - 224} L356 ${horizon - 206} L320 ${horizon - 188} L284 ${horizon - 206} Z`} fill={p.accent} opacity="0.5" />
          <g fill={p.ground} opacity="0.55">
            <rect x="236" y={horizon - 72} width="18" height="72" />
            <rect x="300" y={horizon - 72} width="18" height="72" />
            <rect x="392" y={horizon - 72} width="18" height="72" />
          </g>
          <g fill={p.accent} opacity="0.35">
            <circle cx="320" cy={horizon - 52} r="7" />
            <circle cx="256" cy={horizon - 40} r="4" />
            <circle cx="400" cy={horizon - 40} r="4" />
          </g>
        </g>
      );
    case "village":
      return (
        <g>
          <Hut x={150} y={horizon + 24} scale={1} p={p} />
          <Hut x={400} y={horizon + 44} scale={0.82} p={p} />
          <path d={`M250 800 C282 ${horizon + 120} 350 ${horizon + 90} 360 ${horizon + 40}`} stroke={p.water} strokeOpacity="0.4" strokeWidth="16" fill="none" />
          <g fill={p.near} opacity="0.9">
            <ellipse cx="90" cy={horizon + 150} rx="42" ry="16" />
            <ellipse cx="560" cy={horizon + 176} rx="52" ry="18" />
          </g>
        </g>
      );
    case "forest":
    case "night":
      return (
        <g>
          <Tree x={110} y={horizon + 70} scale={1.5} p={p} opacity={0.9} />
          <Tree x={540} y={horizon + 30} scale={1.7} p={p} opacity={0.85} />
          <Tree x={250} y={horizon + 20} scale={0.8} p={p} opacity={0.55} />
        </g>
      );
    case "river":
      return (
        <g>
          <Tree x={92} y={horizon + 40} scale={1.3} p={p} opacity={0.92} />
          <Tree x={566} y={horizon - 10} scale={1.1} p={p} opacity={0.8} />
          <g stroke={p.near} strokeWidth="3" fill="none" opacity="0.75">
            <path d={`M470 ${horizon + 8} q6 -60 18 -92`} />
            <path d={`M488 ${horizon + 8} q2 -52 10 -78`} />
          </g>
        </g>
      );
    case "lake":
      return (
        <g>
          <Tree x={80} y={horizon + 20} scale={1.2} p={p} opacity={0.9} />
          <g stroke={p.near} strokeWidth="2.5" fill="none" opacity="0.8">
            <path d={`M120 ${horizon + 150} q-4 -46 -20 -70`} />
            <path d={`M130 ${horizon + 150} q0 -52 6 -76`} />
            <path d={`M142 ${horizon + 150} q8 -40 22 -62`} />
          </g>
        </g>
      );
    case "orchard":
      return (
        <g>
          <FruitTree x={140} y={horizon + 30} p={p} />
          <FruitTree x={430} y={horizon + 52} p={p} />
        </g>
      );
    case "garden":
      return (
        <g>
          <rect x="120" y={horizon - 30} width="400" height="10" fill={p.accent} opacity="0.35" />
          <path d={`M240 ${horizon - 30} L240 ${horizon - 118} L400 ${horizon - 118} L400 ${horizon - 30} Z`} fill={p.near} opacity="0.9" />
          <path d={`M226 ${horizon - 118} L320 ${horizon - 166} L414 ${horizon - 118} Z`} fill={p.mid} />
          <g fill={p.accent} opacity="0.4">
            <circle cx="190" cy={horizon + 40} r="7" />
            <circle cx="470" cy={horizon + 26} r="5" />
            <circle cx="510" cy={horizon + 66} r="6" />
          </g>
          <Tree x={70} y={horizon + 80} scale={0.9} p={p} opacity={0.85} />
          <Tree x={586} y={horizon + 60} scale={1.05} p={p} opacity={0.85} />
        </g>
      );
    case "hermitage":
      return (
        <g>
          <path d={`M198 ${horizon + 40} L198 ${horizon - 34} L320 ${horizon - 92} L442 ${horizon - 34} L442 ${horizon + 40} Z`} fill={p.near} />
          <path d={`M182 ${horizon - 34} L320 ${horizon - 100} L458 ${horizon - 34} L442 ${horizon - 22} L320 ${horizon - 80} L198 ${horizon - 22} Z`} fill={p.accent} opacity="0.6" />
          <rect x="300" y={horizon - 6} width="40" height="46" fill={p.ground} opacity="0.7" />
          <g stroke={p.mid} strokeWidth="4" fill="none">
            <path d={`M170 ${horizon + 40} q-10 -48 16 -74`} />
            <path d={`M186 ${horizon + 40} q14 -42 40 -58`} />
            <path d={`M470 ${horizon + 40} q4 -52 -18 -76`} />
          </g>
        </g>
      );
    case "cliff":
      return (
        <g>
          <path d={`M0 ${horizon + 210} L120 ${horizon + 80} L230 ${horizon + 150} L360 ${horizon + 60} L520 ${horizon + 190} L640 ${horizon + 110} L640 800 L0 800 Z`} fill={p.near} />
          <path d={`M230 ${horizon + 150} L360 ${horizon + 60} L390 ${horizon + 200} Z`} fill={p.ground} opacity="0.6" />
          <g stroke={p.skyBottom} strokeWidth="1.6" fill="none" opacity="0.7">
            <path d={`M120 ${horizon + 24} q10 -10 20 0 q10 -10 20 0`} />
            <path d={`M470 ${horizon - 8} q8 -8 16 0 q8 -8 16 0`} />
          </g>
        </g>
      );
    case "ocean":
      return (
        <g>
          <path d={`M300 ${horizon + 160} l30 -26 l34 26 z`} fill={p.near} opacity="0.9" />
          <path d={`M306 ${horizon + 156} l24 -18 l26 18 z`} fill={p.accent} opacity="0.5" />
          <g fill={p.near} opacity="0.6">
            <circle cx="180" cy={horizon + 140} r="4" />
            <circle cx="470" cy={horizon + 120} r="3" />
            <circle cx="520" cy={horizon + 180} r="4" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

function Hut({ x, y, scale, p }: { x: number; y: number; scale: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-56" y="-10" width="112" height="70" fill={p.near} />
      <path d="M-74 -10 L0 -74 L74 -10 Z" fill={p.mid} />
      <path d="M-74 -10 L0 -74 L74 -10 L66 -4 L0 -60 L-66 -4 Z" fill={p.accent} opacity="0.45" />
      <rect x="-14" y="18" width="28" height="42" fill={p.ground} opacity="0.65" />
    </g>
  );
}

function Tree({
  x,
  y,
  scale,
  p,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale: number;
  p: Palette;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <path d="M-5 0 C-7 -50 -12 -86 -22 -120 L22 -120 C12 -86 7 -50 5 0 Z" fill={p.near} />
      <path d="M0 -108 C-34 -140 -78 -136 -92 -156 C-58 -178 -18 -158 2 -132 C22 -166 66 -182 96 -160 C76 -132 38 -138 6 -112 Z" fill={p.near} opacity="0.95" />
      <path d="M-2 -134 C-26 -160 -30 -190 -14 -206 C6 -190 10 -160 4 -136 Z" fill={p.near} opacity="0.9" />
      <path d="M2 -136 C22 -168 52 -176 66 -164 C54 -142 26 -132 4 -130 Z" fill={p.near} opacity="0.85" />
    </g>
  );
}

function FruitTree({ x, y, p }: { x: number; y: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-6 0 C-8 -40 -10 -70 -16 -96 L16 -96 C10 -70 8 -40 6 0 Z" fill={p.near} />
      <circle cx="0" cy="-132" r="58" fill={p.mid} />
      <circle cx="-40" cy="-116" r="34" fill={p.mid} opacity="0.92" />
      <circle cx="42" cy="-114" r="36" fill={p.mid} opacity="0.92" />
      <g fill={p.accent}>
        <circle cx="-24" cy="-142" r="5" />
        <circle cx="14" cy="-120" r="4" />
        <circle cx="36" cy="-146" r="4.5" />
        <circle cx="-10" cy="-164" r="4" />
      </g>
    </g>
  );
}

function Foreground({
  scene,
  p,
  composition,
}: {
  scene: SceneKind;
  p: Palette;
  composition: Composition;
}) {
  return (
    <g>
      <path d="M0 800 L0 720 C80 690 150 726 220 742 C300 760 380 726 460 742 C530 756 590 730 640 740 L640 800 Z" fill={p.ground} />
      <g stroke={p.ground} strokeWidth="3" fill="none" opacity="0.85" strokeLinecap="round">
        <path d="M40 748 q10 -30 4 -50" />
        <path d="M58 752 q16 -28 26 -42" />
        <path d="M96 760 q-8 -26 -22 -38" />
        <path d="M540 750 q8 -32 0 -52" />
        <path d="M566 756 q16 -26 28 -38" />
      </g>
      {composition === "column" ? (
        <g fill={p.near} opacity="0.92">
          <path d="M0 0 L72 0 C56 200 50 420 58 800 L0 800 Z" />
          <path d="M640 0 L568 0 C584 220 590 430 582 800 L640 800 Z" />
        </g>
      ) : null}
      {scene === "night" ? (
        <g fill={p.sun} opacity="0.75">
          <circle cx="150" cy="640" r="2.4" />
          <circle cx="205" cy="700" r="2" />
          <circle cx="470" cy="662" r="2.2" />
          <circle cx="520" cy="712" r="1.8" />
          <circle cx="330" cy="736" r="2" />
        </g>
      ) : null}
    </g>
  );
}

function Mist({ p, uid, horizon }: { p: Palette; uid: string; horizon: number }) {
  return (
    <rect x="0" y={horizon - 20} width="640" height="120" fill={`url(#${uid}-mist)`} opacity="0.55" />
  );
}

function AnimalFigure({ kind, p, scene }: { kind: AnimalKind; p: Palette; scene: SceneKind }) {
  const x = 330;
  const y = scene === "cliff" ? 596 : scene === "ocean" ? 600 : 648;
  const fill = p.animal;
  const body = { fill, opacity: scene === "night" ? 0.92 : 0.95 };

  switch (kind) {
    case "hare":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="46" ry="34" />
          <circle cx="38" cy="-26" r="20" />
          <path d="M30 -40 C24 -70 30 -92 38 -92 C46 -92 44 -66 40 -42 Z" />
          <path d="M44 -40 C48 -74 58 -90 64 -86 C70 -82 60 -54 50 -38 Z" />
          <circle cx="-44" cy="-8" r="10" />
          <path d="M-26 28 L-26 48 L-12 48 L-10 28 Z" />
          <path d="M18 26 L18 48 L32 48 L34 26 Z" />
          <circle cx="46" cy="-30" r="2.6" fill={p.sunGlow} />
        </g>
      );
    case "deer":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="56" ry="30" />
          <path d="M40 -14 C46 -52 52 -62 58 -64 L70 -58 C64 -44 58 -26 56 -10 Z" />
          <circle cx="70" cy="-66" r="14" />
          <path d="M62 -78 L52 -102 L58 -102 L68 -82 Z" />
          <path d="M72 -78 L80 -104 L86 -102 L78 -80 Z" />
          <path d="M-34 24 L-34 62 L-22 62 L-20 24 Z" />
          <path d="M18 24 L18 62 L30 62 L32 24 Z" />
          <path d="M-56 -4 C-66 -22 -68 -34 -62 -38 C-54 -32 -48 -18 -46 -6 Z" />
          <circle cx="76" cy="-68" r="2.4" fill={p.sunGlow} />
        </g>
      );
    case "monkey":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="30" ry="36" />
          <circle cx="0" cy="-46" r="24" />
          <circle cx="-20" cy="-50" r="9" />
          <circle cx="20" cy="-50" r="9" />
          <path d="M-28 4 C-62 6 -70 -24 -50 -36" stroke={fill} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M-16 30 C-16 56 -2 72 18 70" stroke={fill} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M16 30 L16 62 L28 62 L30 30 Z" />
          <circle cx="-8" cy="-50" r="2.2" fill={p.sunGlow} />
          <circle cx="8" cy="-50" r="2.2" fill={p.sunGlow} />
        </g>
      );
    case "elephant":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="-10" cy="0" rx="70" ry="46" />
          <circle cx="58" cy="-24" r="32" />
          <path d="M58 -6 C52 30 60 54 78 62 C88 66 92 54 82 50 C72 46 74 22 78 4 Z" />
          <path d="M30 -44 C38 -66 54 -70 60 -58 C50 -50 40 -46 30 -44 Z" />
          <path d="M-56 36 L-56 76 L-40 76 L-36 36 Z" />
          <path d="M-20 40 L-20 78 L-4 78 L-2 40 Z" />
          <path d="M20 38 L20 76 L36 76 L38 38 Z" />
          <circle cx="70" cy="-34" r="2.6" fill={p.sunGlow} />
        </g>
      );
    case "fish":
      return (
        <g transform={`translate(${x} ${y + 8})`} {...body}>
          <ellipse cx="0" cy="0" rx="46" ry="22" />
          <path d="M-40 0 L-70 -22 L-70 22 Z" />
          <path d="M-4 -22 L14 -44 L24 -20 Z" />
          <circle cx="26" cy="-5" r="2.8" fill={p.sunGlow} />
        </g>
      );
    case "human":
      return (
        <g transform={`translate(${x} ${y + 4})`} {...body}>
          <circle cx="0" cy="-52" r="14" />
          <path d="M-14 -38 L14 -38 L30 8 L14 12 L10 56 L-8 56 L-12 12 L-30 8 Z" />
          <path d="M-14 -34 C-30 -18 -34 4 -30 18 L-22 18 C-24 2 -18 -14 -8 -24 Z" />
          <path d="M14 -34 C30 -18 34 4 30 18 L22 18 C24 2 18 -14 8 -24 Z" />
        </g>
      );
    case "parrot":
      return (
        <g transform={`translate(${x} ${y - 40})`} {...body}>
          <ellipse cx="0" cy="0" rx="20" ry="34" />
          <circle cx="8" cy="-36" r="15" />
          <path d="M14 -30 L30 -26 L18 -18 Z" />
          <path d="M-6 32 C-24 46 -30 64 -20 70" stroke={fill} strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
      );
    case "swan":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="44" ry="24" />
          <path d="M26 -10 C40 -34 34 -54 22 -56 C12 -58 10 -44 18 -40 C26 -36 24 -22 16 -10 Z" />
          <path d="M-38 0 C-58 -18 -66 -6 -56 6 Z" />
          <circle cx="20" cy="-56" r="2.4" fill={p.sunGlow} />
        </g>
      );
    case "lion":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="52" ry="30" />
          <circle cx="48" cy="-22" r="28" />
          <g fill={fill} opacity="0.85">
            <circle cx="48" cy="-22" r="36" opacity="0.35" />
          </g>
          <path d="M-38 22 L-38 56 L-24 56 L-22 22 Z" />
          <path d="M12 22 L12 56 L26 56 L28 22 Z" />
          <path d="M-52 -2 C-70 -12 -74 -28 -64 -34" stroke={fill} strokeWidth="6" fill="none" />
        </g>
      );
    case "serpent":
      return (
        <g transform={`translate(${x} ${y + 30})`} {...body}>
          <path d="M-80 20 C-40 -10 0 30 40 0 C70 -22 84 -6 70 12" stroke={fill} strokeWidth="20" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="12" r="12" />
        </g>
      );
    case "peacock":
      return (
        <g transform={`translate(${x} ${y})`} {...body}>
          <ellipse cx="0" cy="0" rx="26" ry="34" />
          <circle cx="2" cy="-40" r="12" />
          <path d="M4 -50 L8 -62 L14 -52 Z" />
          <g stroke={fill} strokeWidth="4" fill="none" opacity="0.8">
            <path d="M-40 30 C-70 -10 -40 -50 -6 -20" />
            <path d="M40 30 C70 -10 40 -50 6 -20" />
            <path d="M-52 50 C-86 10 -60 -30 -20 -6" />
            <path d="M52 50 C86 10 60 -30 20 -6" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function animalLabel(kind: AnimalKind): string {
  return ANIMAL_LABELS[kind];
}
