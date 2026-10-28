"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ForestLight } from "@/lib/three/forest";
import { cn } from "@/lib/utils";
import { ForestFallback } from "@/components/three/ForestFallback";

const ForestCanvas = dynamic(() => import("@/components/three/ForestCanvas"), {
  ssr: false,
  loading: () => null,
});

type ForestStageProps = {
  mode: "hero" | "reader";
  light: ForestLight;
  label: string;
  className?: string;
};

export function ForestStage({ mode, light, label, className }: ForestStageProps) {
  const positioning = className?.includes("absolute") ? "" : "relative";
  const reducedMotion = useReducedMotion();
  const [supported, setSupported] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const context =
        probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl");
      setSupported(Boolean(context));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showCanvas = supported && !failed && visible;
  const quality: "high" | "low" =
    typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 900px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4)
      ? "low"
      : "high";

  return (
    <div ref={containerRef} className={cn("overflow-hidden", positioning, className)} role="img" aria-label={label}>
      <ForestFallback light={light} className={cn("transition-opacity duration-1000", showCanvas ? "opacity-0" : "opacity-100")} />
      {showCanvas ? (
        <div className="absolute inset-0">
          <ForestCanvas
            mode={mode}
            light={light}
            quality={quality}
            reducedMotion={reducedMotion}
            onFail={() => setFailed(true)}
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_35%,rgba(11,22,18,0.55)_100%)]" />
    </div>
  );
}
