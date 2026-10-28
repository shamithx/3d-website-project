import Image from "next/image";
import { StoryArt } from "@/components/art/StoryArt";
import { coverSrc, hasCover } from "@/content/stories/covers";
import type { AnimalKind, Composition, PaletteKey, SceneKind } from "@/content/stories/types";
import { cn } from "@/lib/utils";

type StoryCoverProps = {
  slug: string;
  scene: SceneKind;
  palette: PaletteKey;
  animal: AnimalKind;
  composition: Composition;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  quality?: number;
};

/**
 * Renders the hand-painted cover where one exists and falls back to the layered
 * vector scene everywhere else, so no card can ever show a broken image.
 */
export function StoryCover({
  slug,
  scene,
  palette,
  animal,
  composition,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
  imageClassName,
  quality = 82,
}: StoryCoverProps) {
  if (!hasCover(slug)) {
    return (
      <div className={cn("h-full w-full", className)}>
        <StoryArt
          slug={slug}
          scene={scene}
          palette={palette}
          animal={animal}
          composition={composition}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={coverSrc(slug)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
