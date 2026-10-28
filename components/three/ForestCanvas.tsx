"use client";

import { useEffect, useRef, useState } from "react";
import { createForest, type ForestHandle, type ForestLight } from "@/lib/three/forest";
import { cn } from "@/lib/utils";

export type ForestCanvasProps = {
  mode: "hero" | "reader";
  light: ForestLight;
  quality: "high" | "low";
  reducedMotion: boolean;
  onFail?: () => void;
};

export default function ForestCanvas({
  mode,
  light,
  quality,
  reducedMotion,
  onFail,
}: ForestCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ForestHandle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = createForest(canvas, { mode, light, quality, reducedMotion });
    if (!handle) {
      onFail?.();
      return;
    }
    handleRef.current = handle;
    const frame = window.requestAnimationFrame(() => setReady(true));

    const onScroll = () => {
      const progress = window.scrollY / Math.max(1, window.innerHeight);
      handle.setScroll(Math.min(1, progress));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const parent = canvas.parentElement;
    const observer = new ResizeObserver(() => handle.resize());
    if (parent) observer.observe(parent);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      handle.dispose();
      handleRef.current = null;
    };
    // `light` is applied through the effect below so the scene is not rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quality, reducedMotion]);

  useEffect(() => {
    handleRef.current?.setLight(light);
  }, [light]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "h-full w-full transition-opacity duration-[1400ms]",
        ready ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    />
  );
}
