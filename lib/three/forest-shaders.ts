import * as THREE from "three";

/** Shared hash/value-noise/fbm, matched to the CPU fbm in forest-textures. */
const NOISE = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float norm = 0.0;
    for (int i = 0; i < 4; i += 1) {
      sum += vnoise(p) * amp;
      norm += amp;
      p *= 2.03;
      amp *= 0.5;
    }
    return sum / max(norm, 0.0001);
  }
`;

const num = (value: number): string => (Number.isFinite(value) ? value.toFixed(4) : "0.0");

export type TimeUniform = { value: number };

export type WindUniforms = {
  uTime: TimeUniform;
  uWind: TimeUniform;
  /** Global gust envelope, 0 = still air, 1 = a front is passing through. */
  uGust: TimeUniform;
};

/**
 * Sway for instanced foliage and grass. Phase comes from each instance's world
 * position, so neighbouring trees lean together instead of twitching in
 * lockstep. A travelling gust front sweeps the clearing, and a small
 * high-frequency buffet sells the leaf flutter on top of the slow sway.
 */
export function addWind(
  material: THREE.Material,
  wind: WindUniforms,
  options: { amp: number; freq: number; height: number; ref?: "local" | "anchor" },
): void {
  const amp = num(options.amp);
  const freq = num(options.freq);
  const freqSlow = num(options.freq * 0.41);
  const freqDrift = num(options.freq * 0.67);
  const freqBuffet = num(options.freq * 2.65);
  const height = num(Math.max(0.001, options.height));
  // Grass bends root-to-tip from its own origin; a canopy blob is rigid and
  // swings as one piece, so its height comes from where it was planted.
  const lift =
    options.ref === "anchor"
      ? `float lift = clamp(anchor.y / ${height}, 0.0, 1.0);`
      : `float lift = clamp(transformed.y / ${height}, 0.0, 1.0);`;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = wind.uTime;
    shader.uniforms.uWind = wind.uWind;
    shader.uniforms.uGust = wind.uGust;
    shader.vertexShader = `
      uniform float uTime;
      uniform float uWind;
      uniform float uGust;
      ${shader.vertexShader}
    `.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      {
        vec3 anchor = vec3(0.0);
        #ifdef USE_INSTANCING
          anchor = instanceMatrix[3].xyz;
        #endif
        float phase = anchor.x * 0.23 + anchor.z * 0.17;
        ${lift}
        float bend = pow(lift, 1.7);
        float swell = 0.6 + 0.4 * sin(uTime * 0.19 + anchor.x * 0.06 + anchor.z * 0.04);
        // A front travels across the clearing along -X: each plant leans a beat
        // after its upwind neighbour, so the wind reads as moving air.
        float front = 0.5 + 0.5 * sin(uTime * 0.34 - anchor.x * 0.085 - anchor.z * 0.12);
        float gust = mix(0.55, 1.5, uGust * front);
        float sway = sin(uTime * ${freq} + phase) * 0.62 + sin(uTime * ${freqSlow} + phase * 1.9) * 0.38;
        float buffet = sin(uTime * ${freqBuffet} + phase * 3.1) * 0.2;
        float drift = cos(uTime * ${freqDrift} + phase * 1.3);
        float push = uWind * swell * gust * bend;
        transformed.x += (sway + buffet) * ${amp} * push;
        transformed.z += drift * ${amp} * 0.55 * push;
        transformed.y -= abs(sway) * ${amp} * 0.18 * push;
      }`,
    );
  };
  material.customProgramCacheKey = () => `wind-${amp}-${freq}-${height}-${options.ref ?? "local"}`;
}

export const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = (modelMatrix * vec4(position, 1.0)).xyz - cameraPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uStars;
  uniform float uHaze;
  uniform float uTime;
  varying vec3 vDir;
  ${NOISE}
  void main() {
    vec3 dir = normalize(vDir);
    float up = clamp(dir.y, -1.0, 1.0);

    // Ground haze lifts the sunward horizon; the far side stays cool and dark.
    float t = smoothstep(-0.02, 0.72, up);
    vec3 color = mix(uBottom, uTop, t);
    float band = pow(clamp(1.0 - abs(up), 0.0, 1.0), 5.0);
    color = mix(color, uHorizon, band * (0.55 + uHaze * 0.35));

    float toSun = max(dot(dir, normalize(uSunDir)), 0.0);
    color += uSun * pow(toSun, 260.0) * 1.35;
    color += uSun * pow(toSun, 22.0) * 0.42;
    color += uSun * pow(toSun, 3.0) * 0.11 * uHaze;

    if (uStars > 0.001) {
      // Buckets in spherical space; a hash above the threshold becomes a star.
      // The extra uTime term lets the whole field wheel imperceptibly.
      vec2 sph = vec2(atan(dir.z, dir.x) * 3.2 + uTime * 0.0016, asin(clamp(dir.y, -1.0, 1.0)) * 6.4);
      vec2 cell = floor(sph * 26.0);
      float id = hash21(cell);
      if (id > 0.988) {
        vec2 jitter = vec2(hash21(cell + 11.0), hash21(cell + 27.0)) - 0.5;
        float d = length(fract(sph * 26.0) - 0.5 - jitter * 0.5);
        float twinkle = 0.55 + 0.45 * sin(uTime * (1.1 + id * 4.0) + id * 40.0);
        float glow = smoothstep(0.34, 0.0, d) * twinkle;
        color += vec3(0.92, 0.95, 1.0) * glow * uStars * (0.5 + id);
      }

      // A meteor every dozen seconds or so, only on clear nights.
      float cycle = uTime / 12.0;
      float life = fract(cycle);
      float shot = floor(cycle);
      if (life < 0.075 && hash21(vec2(shot, 4.1)) > 0.42) {
        vec2 sky = vec2(atan(dir.z, dir.x), asin(clamp(dir.y, -1.0, 1.0)));
        float t = life / 0.075;
        vec2 head = vec2(mix(-2.6, 2.2, hash21(vec2(shot, 8.7))), 0.68 + hash21(vec2(shot, 2.3)) * 0.42)
          + vec2(1.7, -0.62) * t;
        vec2 run = normalize(vec2(1.7, -0.62));
        float along = clamp(dot(head - sky, run), 0.0, 0.62);
        float d = length(sky - (head - run * along));
        float trail = smoothstep(0.024, 0.0, d) * (1.0 - along / 0.62) * (1.0 - t * t);
        color += vec3(1.0, 0.97, 0.88) * trail * uStars * 1.6;
      }
    }

    // Below the horizon the dome is hidden by terrain, but keep it continuous.
    color = mix(color, uHorizon * 0.5, smoothstep(0.0, -0.22, up));
    color += (hash21(gl_FragCoord.xy) - 0.5) * 0.004;
    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;

export const WATER_VERTEX = /* glsl */ `
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vUv = uv;
    vec4 view = viewMatrix * world;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

export const WATER_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyBottom;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uRipple;
  uniform float uSunGlint;
  uniform float uMurk;
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vDepth;
  ${NOISE}
  void main() {
    // Downstream flow: the sample point travels with the current, faster in the
    // middle of the channel than against the banks.
    float lane = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.72, vUv.y);
    vec2 p = vec2(vWorld.x, vWorld.z * 0.6 - uTime * (0.5 + lane * 1.5));

    vec2 grad = vec2(0.0);
    float chop = fbm(p * 0.55 + vec2(0.0, uTime * 0.05));
    grad += vec2(1.0, 0.18) * 0.030 * sin(dot(p, vec2(1.0, 0.18)) * 1.7 + uTime * 1.9);
    grad += vec2(0.82, -0.55) * 0.021 * sin(dot(p, vec2(0.82, -0.55)) * 3.1 + uTime * 2.6);
    grad += vec2(-0.3, 1.0) * 0.013 * sin(dot(p, vec2(-0.3, 1.0)) * 6.4 + uTime * 3.4);
    grad += vec2(0.44, 0.9) * 0.008 * sin(dot(p, vec2(0.44, 0.9)) * 12.0 + uTime * 4.7);
    grad *= uRipple * (0.65 + chop * 0.9);

    vec3 normal = normalize(vec3(-grad.x, 1.0, -grad.y));
    vec3 view = normalize(cameraPosition - vWorld);
    float fresnel = 0.028 + 0.972 * pow(clamp(1.0 - max(dot(normal, view), 0.0), 0.0, 1.0), 5.0);

    vec3 reflected = reflect(-view, normal);
    vec3 sky = mix(uSkyBottom, uSkyTop, clamp(reflected.y * 1.35, 0.0, 1.0));

    // Deep water in the middle, sunlit and sediment-light over the shallows.
    float body = 0.34 + chop * 0.2 + (1.0 - lane) * 0.3;
    vec3 water = mix(uDeep, uShallow, clamp(body, 0.0, 1.0));
    vec3 color = mix(water, sky, clamp(fresnel + uMurk * 0.1, 0.0, 1.0));

    // Sun glitter keyed off the reflected ray rather than a tight Blinn-Phong
    // half-vector: a tropical sun only 8 degrees above the far bank never lands
    // inside a 340-exponent lobe, so the river read as a flat dark band.
    vec3 sunVec = normalize(uSunDir);
    float sunAlign = max(dot(reflected, sunVec), 0.0);
    float glitter = pow(sunAlign, 11.0) * 1.35;
    glitter += pow(sunAlign, 190.0) * 4.0;
    color += uSun * glitter * uSunGlint * step(0.015, sunVec.y);

    // Foam: thin animated streaks where the channel meets the bank.
    float edge = 1.0 - lane;
    float foam = smoothstep(0.42, 1.0, edge) * (0.45 + 0.55 * fbm(p * 2.4 + uTime * 0.5));
    color = mix(color, mix(uShallow, vec3(0.92, 0.95, 0.93), 0.55), clamp(foam, 0.0, 1.0) * 0.6);

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    color = mix(color, uFogColor, fog);

    float alpha = mix(0.72, 0.985, lane) * (1.0 - fog * 0.35);
    gl_FragColor = vec4(color, alpha);
  }
`;

export const SHAFT_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** One volumetric beam: bright at the source end, dissolving as it travels. */
export const SHAFT_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  ${NOISE}
  void main() {
    float sides = smoothstep(0.0, 0.42, vUv.x) * smoothstep(1.0, 0.58, vUv.x);
    float travel = (1.0 - vUv.y) * (1.0 - vUv.y);
    float wobble = fbm(vec2(vUv.x * 2.6, vUv.y * 1.3 - uTime * 0.045));
    float grain = 0.55 + wobble * 0.9;
    float alpha = sides * travel * grain * uOpacity;
    gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
  }
`;

export const MIST_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

/** Ground fog: slow noise banks that thin out with distance instead of
 *  keeping a hard sprite edge. */
export const MIST_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uDensity;
  varying vec2 vUv;
  varying float vDepth;
  ${NOISE}
  void main() {
    vec2 p = vec2(vUv.x * 3.2 + uTime * 0.012, vUv.y * 1.4 - uTime * 0.004);
    float bank = fbm(p * 2.1);
    float shape = smoothstep(0.0, 0.34, vUv.x) * smoothstep(1.0, 0.66, vUv.x)
      * smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.42, vUv.y);
    float alpha = shape * smoothstep(1.0 - uDensity, 1.0, bank * 0.7 + 0.42) * uOpacity;
    float fade = 1.0 - smoothstep(40.0, 120.0, vDepth);
    gl_FragColor = vec4(uColor, clamp(alpha * fade, 0.0, 1.0));
  }
`;

/**
 * Points-based firefly field. Pulsing and wandering happen on the GPU so a few
 * hundred insects cost nothing on the CPU.
 */
export function createFireflyMaterial(
  map: THREE.Texture,
  uniforms: {
    uTime: TimeUniform;
    uOpacity: TimeUniform;
    uRise: TimeUniform;
    uColor: { value: THREE.Color };
    uSize: { value: number };
    uPixelRatio: TimeUniform;
  },
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uTime: uniforms.uTime,
      uOpacity: uniforms.uOpacity,
      uRise: uniforms.uRise,
      uColor: uniforms.uColor,
      uSize: uniforms.uSize,
      uPixelRatio: uniforms.uPixelRatio,
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uRise;
      uniform float uSize;
      uniform float uPixelRatio;
      varying float vPulse;
      void main() {
        vec3 pos = position;
        float w = aSeed * 17.0;
        pos.x += sin(uTime * 0.31 + w) * 1.5 + sin(uTime * 0.11 + w * 2.3) * 0.9;
        pos.y += sin(uTime * 0.23 + w * 1.7) * 0.7;
        pos.z += cos(uTime * 0.27 + w * 0.9) * 1.2;
        // uRise blends the field between hovering fireflies and rising embers.
        float riseT = fract(uTime * (0.055 + aSeed * 0.05) + aSeed);
        pos.y += uRise * riseT * 11.0;
        pos.x += uRise * sin(uTime * 0.9 + aSeed * 21.0) * 1.4;
        vec4 view = modelViewMatrix * vec4(pos, 1.0);
        // Two overlapping rhythms so the field blinks out of step, like real ones.
        float beat = sin(uTime * (1.4 + aSeed * 1.6) + aSeed * 30.0);
        float beat2 = sin(uTime * (0.43 + aSeed * 0.5) + aSeed * 11.0);
        vPulse = pow(max(beat, 0.0), 2.2) * (0.35 + 0.65 * max(beat2, 0.0));
        vPulse *= mix(1.0, 1.0 - riseT, uRise);
        gl_PointSize = uSize * uPixelRatio * (1.0 + vPulse * 0.7) * (26.0 / max(-view.z, 0.6));
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vPulse;
      void main() {
        vec4 sprite = texture2D(uMap, gl_PointCoord);
        float alpha = sprite.a * uOpacity * vPulse;
        if (alpha < 0.002) discard;
        gl_FragColor = vec4(uColor * (0.6 + vPulse * 1.5), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Sunlit pollen: tiny motes that hang in the light shafts and drift with the
 * air. Unlike the fireflies they never blink out; they only catch the light.
 */
export function createPollenMaterial(
  map: THREE.Texture,
  uniforms: {
    uTime: TimeUniform;
    uOpacity: TimeUniform;
    uColor: { value: THREE.Color };
    uSize: { value: number };
    uPixelRatio: TimeUniform;
  },
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uTime: uniforms.uTime,
      uOpacity: uniforms.uOpacity,
      uColor: uniforms.uColor,
      uSize: uniforms.uSize,
      uPixelRatio: uniforms.uPixelRatio,
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uSize;
      uniform float uPixelRatio;
      varying float vGlow;
      void main() {
        vec3 pos = position;
        float w = aSeed * 23.0;
        pos.x += sin(uTime * 0.12 + w) * 1.3 + sin(uTime * 0.047 + w * 1.7) * 2.1;
        pos.y += sin(uTime * 0.09 + w * 1.3) * 0.7 + cos(uTime * 0.031 + w * 0.6) * 0.35;
        pos.z += cos(uTime * 0.1 + w * 0.8) * 1.1;
        vec4 view = modelViewMatrix * vec4(pos, 1.0);
        float shimmer = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed * 1.4) + w * 4.0);
        vGlow = 0.28 + shimmer * 0.72;
        gl_PointSize = uSize * uPixelRatio * (0.55 + shimmer * 0.6) * (22.0 / max(-view.z, 0.6));
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vGlow;
      void main() {
        vec4 sprite = texture2D(uMap, gl_PointCoord);
        float alpha = sprite.a * uOpacity * vGlow;
        if (alpha < 0.002) discard;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}
