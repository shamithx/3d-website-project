import type { Difficulty, MoralCategory } from "./types";
import type { StoryFact } from "@/lib/progress";

/**
 * A lightweight projection of the story library, safe to import into client
 * components without pulling the full bilingual story text into the bundle.
 */
export const storyFacts: readonly StoryFact[] = [
  { slug: "sasa-jataka", difficulty: "gentle", moralCategories: ["generosity", "compassion", "wisdom", "kindness"] },
  { slug: "vessantara-jataka", difficulty: "rich", moralCategories: ["generosity", "patience", "courage"] },
  { slug: "nigrodhamiga-jataka", difficulty: "balanced", moralCategories: ["leadership", "compassion", "courage"] },
  { slug: "mahakapi-jataka", difficulty: "balanced", moralCategories: ["leadership", "courage", "compassion"] },
  { slug: "ruru-jataka", difficulty: "balanced", moralCategories: ["honesty", "kindness", "compassion"] },
  { slug: "nalapana-jataka", difficulty: "gentle", moralCategories: ["problem-solving", "wisdom", "leadership"] },
  { slug: "mahajanaka-jataka", difficulty: "rich", moralCategories: ["courage", "patience", "wisdom"] },
  { slug: "temiya-jataka", difficulty: "rich", moralCategories: ["courage", "wisdom", "patience"] },
  { slug: "suvannasama-jataka", difficulty: "balanced", moralCategories: ["compassion", "patience", "kindness"] },
  { slug: "ummagga-jataka", difficulty: "rich", moralCategories: ["problem-solving", "wisdom", "leadership"] },
  { slug: "kuru-dhamma-jataka", difficulty: "balanced", moralCategories: ["honesty", "leadership", "patience"] },
  { slug: "kapi-jataka", difficulty: "balanced", moralCategories: ["wisdom", "problem-solving", "patience"] },
] as const satisfies ReadonlyArray<{ slug: string; difficulty: Difficulty; moralCategories: readonly MoralCategory[] }>;
