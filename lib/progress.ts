import type { Difficulty, Locale, MoralCategory, ReaderMode } from "@/content/stories/types";
import { todayKey, isYesterday } from "./utils";

export const PROGRESS_KEY = "jk.progress.v1";

export type StoryProgress = {
  scenesRead: string[];
  completedAt?: string;
  quizBest?: number;
  quizAttempts?: number;
};

export type Bookmark = {
  sceneId: string;
  sceneIndex: number;
  at: string;
};

export type ProgressState = {
  version: 1;
  stories: Record<string, StoryProgress>;
  bookmarks: Record<string, Bookmark>;
  reflections: Record<string, Record<number, string>>;
  streak: { last: string; count: number; best: number };
  quizzesTaken: number;
  settings: {
    fontScale: number;
    lineHeight: number;
    mode: ReaderMode;
    locale: Locale;
  };
};

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  stories: {},
  bookmarks: {},
  reflections: {},
  streak: { last: "", count: 0, best: 0 },
  quizzesTaken: 0,
  settings: { fontScale: 1, lineHeight: 1.85, mode: "en", locale: "en" },
};

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.version !== 1) return EMPTY_PROGRESS;
    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      stories: parsed.stories ?? {},
      bookmarks: parsed.bookmarks ?? {},
      reflections: parsed.reflections ?? {},
      streak: { ...EMPTY_PROGRESS.streak, ...(parsed.streak ?? {}) },
      settings: { ...EMPTY_PROGRESS.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, quota). The app still works in-memory.
  }
}

export type StoryFact = {
  slug: string;
  difficulty: Difficulty;
  moralCategories: readonly MoralCategory[];
};

export type BadgeId =
  | "kindHeart"
  | "wiseThinker"
  | "braveExplorer"
  | "masterStoryteller"
  | "keeperOfWisdom";

export type BadgeRequirement = {
  id: BadgeId;
  earned: (state: ProgressState, catalogue: readonly StoryFact[]) => boolean;
};

export const BADGE_RULES: readonly BadgeRequirement[] = [
  {
    id: "kindHeart",
    earned: (state, catalogue) =>
      Object.keys(state.stories).some((slug) => {
        const story = catalogue.find((entry) => entry.slug === slug);
        return Boolean(state.stories[slug]?.completedAt) &&
          Boolean(story && (story.moralCategories.includes("compassion") || story.moralCategories.includes("kindness")));
      }),
  },
  {
    id: "wiseThinker",
    earned: (state) => Object.values(state.stories).some((entry) => (entry.quizBest ?? 0) >= 5),
  },
  {
    id: "braveExplorer",
    earned: (state, catalogue) =>
      Object.keys(state.stories).some((slug) => {
        const story = catalogue.find((entry) => entry.slug === slug);
        return Boolean(state.stories[slug]?.completedAt) && story?.difficulty === "rich";
      }),
  },
  {
    id: "masterStoryteller",
    earned: (state) => Object.values(state.stories).filter((entry) => entry.completedAt).length >= 3,
  },
  {
    id: "keeperOfWisdom",
    earned: (state, catalogue) =>
      catalogue.length > 0 &&
      catalogue.every((story) => Boolean(state.stories[story.slug]?.completedAt)),
  },
];

export function computeBadges(
  state: ProgressState,
  catalogue: readonly StoryFact[],
): BadgeId[] {
  return BADGE_RULES.filter((rule) => rule.earned(state, catalogue)).map((rule) => rule.id);
}

export function starsForStory(entry: StoryProgress | undefined): number {
  if (!entry) return 0;
  let stars = 0;
  if (entry.scenesRead.length > 0) stars += 1;
  if ((entry.quizBest ?? 0) >= 3) stars += 1;
  if (entry.completedAt) stars += 1;
  return stars;
}

export type CompleteStoryInput = {
  slug: string;
  quizScore?: number;
  catalogue: readonly StoryFact[];
};

export function completeStory(
  state: ProgressState,
  input: CompleteStoryInput,
): { state: ProgressState; newBadges: BadgeId[] } {
  const before = computeBadges(state, input.catalogue);
  const existing = state.stories[input.slug] ?? { scenesRead: [] };
  const today = todayKey();
  const continues = isYesterday(state.streak.last);
  const streak =
    state.streak.last === today
      ? state.streak
      : {
          last: today,
          count: continues ? state.streak.count + 1 : 1,
          best: Math.max(state.streak.best, continues ? state.streak.count + 1 : 1),
        };

  const next: ProgressState = {
    ...state,
    streak,
    stories: {
      ...state.stories,
      [input.slug]: {
        ...existing,
        completedAt: existing.completedAt ?? new Date().toISOString(),
        quizBest: Math.max(existing.quizBest ?? 0, input.quizScore ?? 0),
      },
    },
  };

  const after = computeBadges(next, input.catalogue);
  return { state: next, newBadges: after.filter((badge) => !before.includes(badge)) };
}
