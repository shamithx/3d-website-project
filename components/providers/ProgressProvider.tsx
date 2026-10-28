"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EMPTY_PROGRESS,
  PROGRESS_KEY,
  completeStory,
  computeBadges,
  readProgress,
  starsForStory,
  writeProgress,
  type BadgeId,
  type ProgressState,
  type StoryFact,
} from "@/lib/progress";
import { storyFacts } from "@/content/stories/facts";
import { clamp, todayKey } from "@/lib/utils";
import type { ReaderMode } from "@/content/stories/types";

type ProgressContextValue = {
  hydrated: boolean;
  progress: ProgressState;
  badges: BadgeId[];
  stars: number;
  markSceneRead: (slug: string, sceneId: string) => void;
  toggleBookmark: (slug: string, sceneId: string, sceneIndex: number) => void;
  saveReflection: (slug: string, index: number, value: string) => void;
  recordQuiz: (slug: string, score: number, total: number) => void;
  complete: (slug: string, catalogue: readonly StoryFact[], quizScore?: number) => BadgeId[];
  updateSettings: (settings: Partial<ProgressState["settings"]>) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef<ProgressState>(EMPTY_PROGRESS);

  const commit = useCallback((next: ProgressState) => {
    stateRef.current = next;
    setState(next);
    writeProgress(next);
  }, []);

  useEffect(() => {
    const loaded = readProgress();
    stateRef.current = loaded;
    setState(loaded);
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_KEY) return;
      const next = readProgress();
      stateRef.current = next;
      setState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markSceneRead = useCallback(
    (slug: string, sceneId: string) => {
      const current = stateRef.current;
      const entry = current.stories[slug] ?? { scenesRead: [] };
      if (entry.scenesRead.includes(sceneId)) return;
      const today = todayKey();
      const streak =
        current.streak.last === today
          ? current.streak
          : {
              last: today,
              count: current.streak.count === 0 ? 1 : current.streak.count,
              best: Math.max(current.streak.best, current.streak.count),
            };
      commit({
        ...current,
        streak,
        stories: {
          ...current.stories,
          [slug]: { ...entry, scenesRead: [...entry.scenesRead, sceneId] },
        },
      });
    },
    [commit],
  );

  const toggleBookmark = useCallback(
    (slug: string, sceneId: string, sceneIndex: number) => {
      const current = stateRef.current;
      const existing = current.bookmarks[slug];
      const bookmarks = { ...current.bookmarks };
      if (existing?.sceneId === sceneId) {
        delete bookmarks[slug];
      } else {
        bookmarks[slug] = { sceneId, sceneIndex, at: new Date().toISOString() };
      }
      commit({ ...current, bookmarks });
    },
    [commit],
  );

  const saveReflection = useCallback(
    (slug: string, index: number, value: string) => {
      const current = stateRef.current;
      const existing = current.reflections[slug] ?? {};
      commit({
        ...current,
        reflections: { ...current.reflections, [slug]: { ...existing, [index]: value } },
      });
    },
    [commit],
  );

  const recordQuiz = useCallback(
    (slug: string, score: number, total: number) => {
      const current = stateRef.current;
      const entry = current.stories[slug] ?? { scenesRead: [] };
      commit({
        ...current,
        quizzesTaken: current.quizzesTaken + 1,
        stories: {
          ...current.stories,
          [slug]: {
            ...entry,
            quizBest: Math.max(entry.quizBest ?? 0, score),
            quizAttempts: (entry.quizAttempts ?? 0) + 1,
          },
        },
      });
    },
    [commit],
  );

  const complete = useCallback(
    (slug: string, catalogue: readonly StoryFact[], quizScore?: number) => {
      const result = completeStory(stateRef.current, { slug, catalogue, quizScore });
      commit(result.state);
      return result.newBadges;
    },
    [commit],
  );

  const updateSettings = useCallback(
    (settings: Partial<ProgressState["settings"]>) => {
      const current = stateRef.current;
      const nextSettings = { ...current.settings, ...settings };
      commit({
        ...current,
        settings: {
          ...nextSettings,
          fontScale: clamp(nextSettings.fontScale, 0.9, 1.6),
          lineHeight: clamp(nextSettings.lineHeight, 1.5, 2.4),
          mode: nextSettings.mode as ReaderMode,
        },
      });
    },
    [commit],
  );

  const reset = useCallback(() => {
    commit({ ...EMPTY_PROGRESS, settings: stateRef.current.settings });
  }, [commit]);

  const badges = useMemo(() => computeBadges(state, storyFacts), [state]);

  const stars = useMemo(
    () => Object.values(state.stories).reduce((total, entry) => total + starsForStory(entry), 0),
    [state.stories],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      hydrated,
      progress: state,
      badges,
      stars,
      markSceneRead,
      toggleBookmark,
      saveReflection,
      recordQuiz,
      complete,
      updateSettings,
      reset,
    }),
    [hydrated, state, badges, stars, markSceneRead, toggleBookmark, saveReflection, recordQuiz, complete, updateSettings, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}
