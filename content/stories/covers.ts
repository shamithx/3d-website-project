/** Slugs that have a hand-painted cover in /public/images/stories. */
const COVER_SLUGS = new Set([
  "sasa-jataka",
  "vessantara-jataka",
  "nigrodhamiga-jataka",
  "mahakapi-jataka",
  "kapi-jataka",
  "nalapana-jataka",
  "ruru-jataka",
  "kuru-dhamma-jataka",
  "mahajanaka-jataka",
  "temiya-jataka",
  "suvannasama-jataka",
  "ummagga-jataka",
]);

export function hasCover(slug: string): boolean {
  return COVER_SLUGS.has(slug);
}

export function coverSrc(slug: string): string {
  return `/images/stories/${slug}.webp`;
}
