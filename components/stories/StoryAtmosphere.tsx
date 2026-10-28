"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PaletteKey, SceneKind } from "@/content/stories/types";
import { cn } from "@/lib/utils";

type Effect = "leaves" | "fireflies" | "dust" | "water" | "mist" | "embers";

const TONES: Record<PaletteKey, { particle: string; glow: string; water: string }> = {
  dawn: { particle: "#e2c48d", glow: "#f7d6a4", water: "#bfe0d6" },
  dusk: { particle: "#efc088", glow: "#ffca8f", water: "#b9c8d6" },
  night: { particle: "#f2e3ba", glow: "#ffe6a8", water: "#b9d3e2" },
  gold: { particle: "#e8d09a", glow: "#f8e3b4", water: "#d3dcc3" },
  emerald: { particle: "#d6ddb2", glow: "#eae2bb", water: "#c3ddd3" },
  river: { particle: "#d2e3cf", glow: "#e6efd4", water: "#bfe1e6" },
  ember: { particle: "#ffb478", glow: "#ff9d55", water: "#c9a091" },
};

const WATER_SCENES: SceneKind[] = ["river", "lake", "ocean"];
const FOREST_SCENES: SceneKind[] = ["forest", "orchard", "hermitage", "garden", "cliff", "mountain"];
const STONE_SCENES: SceneKind[] = ["palace", "village", "garden"];

function effectsFor(scene: SceneKind, palette: PaletteKey): Effect[] {
  const effects: Effect[] = [];

  if (WATER_SCENES.includes(scene)) effects.push("water");

  if (palette === "night" || palette === "dusk") effects.push("fireflies");
  else if (palette === "ember") effects.push("embers");
  else if (STONE_SCENES.includes(scene) || palette === "gold") effects.push("dust");

  if (effects.length < 2 && FOREST_SCENES.includes(scene)) effects.push("leaves");
  if (effects.length < 2 && (scene === "mountain" || scene === "cliff")) effects.push("mist");

  return effects.slice(0, 2);
}

/** Stable per-story offset so cards do not animate in lockstep. */
function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) % 997;
  }
  return result;
}

const LEAVES = [
  { x: 8, y: -8, size: 14, duration: 19, delay: 0, drift: 26, spin: 210 },
  { x: 34, y: -14, size: 10, duration: 23, delay: 3.5, drift: -18, spin: -180 },
  { x: 66, y: -6, size: 12, duration: 21, delay: 7, drift: 22, spin: 240 },
  { x: 86, y: -12, size: 9, duration: 26, delay: 10.5, drift: -14, spin: -150 },
] as const;

const FIREFLIES = [
  { x: 14, y: 62, size: 4, duration: 9, delay: 0, drift: 12 },
  { x: 42, y: 48, size: 3, duration: 12, delay: 2.4, drift: -10 },
  { x: 68, y: 70, size: 4, duration: 10, delay: 4.1, drift: 9 },
  { x: 86, y: 40, size: 3, duration: 13, delay: 6.2, drift: -12 },
] as const;

const DUST = [
  { x: 18, y: 30, size: 3, duration: 18, delay: 0, drift: 14 },
  { x: 36, y: 58, size: 2, duration: 22, delay: 3, drift: -12 },
  { x: 58, y: 24, size: 3, duration: 20, delay: 5.5, drift: 10 },
  { x: 74, y: 66, size: 2, duration: 24, delay: 8, drift: -9 },
  { x: 88, y: 44, size: 3, duration: 19, delay: 11, drift: 13 },
] as const;

const EMBERS = [
  { x: 20, y: 78, size: 3, duration: 12, delay: 0, drift: 16 },
  { x: 44, y: 86, size: 2, duration: 15, delay: 2.6, drift: -12 },
  { x: 68, y: 74, size: 3, duration: 13, delay: 5, drift: 11 },
  { x: 84, y: 88, size: 2, duration: 16, delay: 7.4, drift: -14 },
] as const;

export function StoryAtmosphere({
  slug,
  scene,
  palette,
  className,
}: {
  slug: string;
  scene: SceneKind;
  palette: PaletteKey;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const effects = effectsFor(scene, palette);
  const tone = TONES[palette];
  const offset = (hash(slug) % 40) / 10;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setPaused(!visible);
      },
      { rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-paused={paused ? "true" : "false"}
      className={cn("story-atmosphere", className)}
      style={
        {
          "--atmo-particle": tone.particle,
          "--atmo-glow": tone.glow,
          "--atmo-water": tone.water,
          "--atmo-offset": `${offset}s`,
        } as CSSProperties
      }
    >
      <div className="story-atmosphere__light" />

      {effects.includes("water") ? <div className="story-atmosphere__water" /> : null}
      {effects.includes("mist") ? <div className="story-atmosphere__mist" /> : null}

      {effects.includes("leaves")
        ? LEAVES.map((leaf, index) => (
            <span
              key={`leaf-${index}`}
              className="story-atmosphere__leaf"
              style={
                {
                  "--x": `${leaf.x}%`,
                  "--y": `${leaf.y}%`,
                  "--size": `${leaf.size}px`,
                  "--duration": `${leaf.duration}s`,
                  "--delay": `${leaf.delay + offset}s`,
                  "--drift": `${leaf.drift}px`,
                  "--spin": `${leaf.spin}deg`,
                } as CSSProperties
              }
            >
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 2.4c4.4 4.3 6 8.4 0 13.8C6 10.8 7.6 6.7 12 2.4Z"
                  fill="currentColor"
                />
                <path d="M12 4.6v10.2" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.7" />
              </svg>
            </span>
          ))
        : null}

      {effects.includes("fireflies")
        ? FIREFLIES.map((fly, index) => (
            <span
              key={`fly-${index}`}
              className="story-atmosphere__firefly"
              style={
                {
                  "--x": `${fly.x}%`,
                  "--y": `${fly.y}%`,
                  "--size": `${fly.size}px`,
                  "--duration": `${fly.duration}s`,
                  "--delay": `${fly.delay + offset}s`,
                  "--drift": `${fly.drift}px`,
                } as CSSProperties
              }
            />
          ))
        : null}

      {effects.includes("dust")
        ? DUST.map((mote, index) => (
            <span
              key={`dust-${index}`}
              className="story-atmosphere__dust"
              style={
                {
                  "--x": `${mote.x}%`,
                  "--y": `${mote.y}%`,
                  "--size": `${mote.size}px`,
                  "--duration": `${mote.duration}s`,
                  "--delay": `${mote.delay + offset}s`,
                  "--drift": `${mote.drift}px`,
                } as CSSProperties
              }
            />
          ))
        : null}

      {effects.includes("embers")
        ? EMBERS.map((ember, index) => (
            <span
              key={`ember-${index}`}
              className="story-atmosphere__ember"
              style={
                {
                  "--x": `${ember.x}%`,
                  "--y": `${ember.y}%`,
                  "--size": `${ember.size}px`,
                  "--duration": `${ember.duration}s`,
                  "--delay": `${ember.delay + offset}s`,
                  "--drift": `${ember.drift}px`,
                } as CSSProperties
              }
            />
          ))
        : null}
    </div>
  );
}
