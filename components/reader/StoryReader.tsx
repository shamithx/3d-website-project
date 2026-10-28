"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { StoryArt } from "@/components/art/StoryArt";
import { ForestStage } from "@/components/three/ForestStage";
import { ReaderText } from "@/components/reader/ReaderText";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FocusIcon,
  HeadphonesIcon,
  MapPinIcon,
  PauseIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "@/components/shared/Icons";
import { GoldRule } from "@/components/shared/ui";
import { useSpeech } from "@/hooks/useSpeech";
import { createAmbient, type AmbientHandle } from "@/lib/ambient";
import { storyFacts } from "@/content/stories/facts";
import type {
  Hotspot,
  ReaderMode,
  Story,
  VocabularyEntry,
} from "@/content/stories/types";
import type { MessageKey } from "@/lib/i18n";
import type { BadgeId } from "@/lib/progress";
import { cn, clamp } from "@/lib/utils";

type Panel =
  | { kind: "hotspot"; hotspot: Hotspot }
  | { kind: "map" }
  | { kind: "cast" }
  | { kind: "vocabulary"; entry: VocabularyEntry }
  | null;

export function StoryReader({ story }: { story: Story }) {
  const reader = story.reader!;
  const { locale, t } = useLocale();
  const { progress, hydrated, markSceneRead, toggleBookmark, complete, updateSettings } = useProgress();
  const speech = useSpeech();

  const scenes = reader.scenes;
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<ReaderMode>(locale === "si" ? "simple-si" : "en");
  const [panel, setPanel] = useState<Panel>(null);
  const [focus, setFocus] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [activeChar, setActiveChar] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [ambientOn, setAmbientOn] = useState(false);
  const [completion, setCompletion] = useState<{ badges: BadgeId[]; star: boolean } | null>(null);
  const [mapLocation, setMapLocation] = useState<string | null>(null);
  const ambientRef = useRef<AmbientHandle | null>(null);
  const textTopRef = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);
  const scrollSectionRefs = useRef<Array<HTMLElement | null>>([]);

  const scene = scenes[index] ?? scenes[0]!;
  const total = scenes.length;
  const isLast = index === total - 1;
  const bookmarked = progress.bookmarks[story.slug]?.sceneId === scene.id;
  const completed = Boolean(progress.stories[story.slug]?.completedAt);
  const scale = hydrated ? progress.settings.fontScale : 1;
  const leading = hydrated ? progress.settings.lineHeight : 1.85;

  const sceneVocabulary = useMemo(
    () => reader.vocabulary.filter((entry) => scene.vocabulary.includes(entry.word)),
    [reader.vocabulary, scene.vocabulary],
  );

  const goTo = useCallback(
    (next: number) => {
      const target = clamp(next, 0, total - 1);
      if (target === index) return;
      speech.stop();
      setActiveChar(null);
      setPanel(null);
      setIndex(target);
      shouldScroll.current = true;
    },
    [index, speech, total],
  );

  // Restore a bookmarked or linked scene.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = Number(params.get("scene"));
    if (Number.isFinite(requested) && requested > 0 && requested <= total) {
      setIndex(requested - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markSceneRead(story.slug, scene.id);
  }, [markSceneRead, scene.id, story.slug]);

  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    if (window.innerWidth < 1024) {
      textTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "Escape") {
        setFocus(false);
        setPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  useEffect(() => {
    return () => {
      ambientRef.current?.close();
      ambientRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!continuous) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-scene-id");
          if (id) markSceneRead(story.slug, id);
        }
      },
      { threshold: 0.55 },
    );
    scrollSectionRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [continuous, markSceneRead, story.slug]);

  function toggleSpeech() {
    if (mode === "source") return;
    const text = mode === "simple-si" ? scene.text.si : scene.text.en;
    const lang = mode === "simple-si" ? "si-LK" : "en-US";
    if (speech.speaking) {
      if (speech.paused) speech.resume();
      else speech.stop();
      return;
    }
    if (!speech.supported) {
      setNotice(t("reader.ttsUnsupported"));
      return;
    }
    if (!speech.hasVoiceFor(lang)) {
      setNotice(t("reader.ttsNoVoice"));
    } else {
      setNotice(null);
    }
    setActiveChar(null);
    speech.speak({
      text,
      lang,
      onBoundary: (charIndex) => setActiveChar(charIndex),
      onEnd: () => setActiveChar(null),
    });
  }

  function toggleAmbient() {
    if (ambientOn) {
      ambientRef.current?.setLevel(0);
      const handle = ambientRef.current;
      ambientRef.current = null;
      window.setTimeout(() => handle?.close(), 900);
      setAmbientOn(false);
      return;
    }
    const handle = createAmbient();
    if (!handle) {
      setNotice(t("reader.soundNote"));
      return;
    }
    ambientRef.current = handle;
    handle.setLevel(0.12);
    setAmbientOn(true);
  }

  function finish() {
    const badges = complete(story.slug, storyFacts, progress.stories[story.slug]?.quizBest);
    setCompletion({ badges, star: true });
  }

  const modeOptions: { id: ReaderMode; label: string; description: string; available: boolean }[] = [
    {
      id: "source",
      label: t("reader.mode.source"),
      description: t("reader.mode.sourceDesc"),
      available: Boolean(reader.sourceReading),
    },
    { id: "simple-si", label: t("reader.mode.simple-si"), description: t("reader.mode.simpleDesc"), available: true },
    { id: "en", label: t("reader.mode.en"), description: t("reader.mode.enDesc"), available: true },
  ];
  const activeMode = modeOptions.find((option) => option.id === mode) ?? modeOptions[2]!;

  return (
    <div className="bg-parchment-100">
      <div className="no-print border-b border-forest-900/10 bg-parchment-100 lg:sticky lg:top-[var(--header-h)] lg:z-40">
        <div className="shell flex min-h-14 flex-wrap items-center justify-between gap-3 py-2">
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.1em] text-forest-900 transition-colors hover:text-gold-600"
          >
            <ArrowLeftIcon size={15} />
            {t("reader.backToStory")}
          </Link>

          <p className="order-3 hidden w-full text-[0.68rem] uppercase tracking-[0.14em] text-ink-500 sm:order-none sm:block sm:w-auto">
            {story.title[locale]} · {t("reader.scene", { n: index + 1, total })}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleAmbient}
              className="icon-btn h-9 w-9"
              aria-pressed={ambientOn}
              aria-label={ambientOn ? t("reader.soundOff") : t("reader.soundOn")}
              title={t("reader.soundNote")}
            >
              {ambientOn ? <VolumeIcon size={16} /> : <VolumeOffIcon size={16} />}
            </button>
            <button
              type="button"
              onClick={() => setContinuous((value) => !value)}
              className={cn("icon-btn icon-btn-wide h-9 whitespace-nowrap text-[0.66rem] uppercase tracking-[0.08em]", continuous && "bg-forest-900 text-parchment-50")}
              aria-pressed={continuous}
            >
              {t("reader.scrollShort")}
            </button>
            <button
              type="button"
              onClick={() => setFocus((value) => !value)}
              className="icon-btn h-9 w-9"
              aria-pressed={focus}
              aria-label={focus ? t("reader.focusExit") : t("reader.focus")}
            >
              <FocusIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={focus ? "fixed inset-0 z-[80] overflow-y-auto bg-parchment-100" : undefined}>
        {focus ? (
          <div className="sticky top-0 z-10 border-b border-forest-900/10 bg-parchment-100/95 backdrop-blur">
            <div className="shell flex h-14 items-center justify-between">
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-500">
                {t("reader.scene", { n: index + 1, total })}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="icon-btn h-9 w-9" aria-label={t("reader.prevScene")}>
                  <ChevronLeftIcon size={17} />
                </button>
                <button type="button" onClick={() => goTo(index + 1)} disabled={isLast} className="icon-btn h-9 w-9" aria-label={t("reader.nextScene")}>
                  <ChevronRightIcon size={17} />
                </button>
                <button type="button" onClick={() => setFocus(false)} className="icon-btn h-9 w-9" aria-label={t("reader.focusExit")}>
                  <CloseIcon size={17} />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className={cn(!focus && !continuous && "lg:grid lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]")}>
          {!focus && !continuous ? (
            <div className="sticky top-[var(--header-h)] z-30 h-[36svh] w-full overflow-hidden bg-forest-900 sm:h-[46svh] lg:z-0 lg:top-[calc(var(--header-h)+57px)] lg:h-[calc(100svh-var(--header-h)-57px)]">
              <ForestStage
                mode="reader"
                light={scene.light}
                label={t("reader.sceneArt", { title: scene.title[locale] })}
                className="absolute inset-0 h-full w-full"
              />

              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                <div className="pointer-events-auto flex items-start justify-between gap-3 p-4 sm:p-5">
                  <div className="max-w-[60%]">
                    <p className="text-[0.58rem] uppercase tracking-[0.22em] text-gold-300">
                      {scene.setting[locale]}
                    </p>
                    <p className="mt-1 text-[0.95rem] leading-tight text-parchment-50 sm:text-[1.05rem]">
                      {scene.title[locale]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPanel(panel?.kind === "map" ? null : { kind: "map" })}
                      className="icon-btn h-9 w-9 border-parchment-200/30 text-parchment-100 hover:bg-parchment-100/15"
                      aria-label={t("reader.map")}
                      aria-pressed={panel?.kind === "map"}
                    >
                      <MapPinIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanel(panel?.kind === "cast" ? null : { kind: "cast" })}
                      className="icon-btn h-9 w-9 border-parchment-200/30 text-parchment-100 hover:bg-parchment-100/15"
                      aria-label={t("reader.cast")}
                      aria-pressed={panel?.kind === "cast"}
                    >
                      <UsersIcon size={16} />
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-[16%] bottom-[26%]">
                  {scene.hotspots.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      type="button"
                      onClick={() => setPanel({ kind: "hotspot", hotspot })}
                      className="group pointer-events-auto absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300/70 bg-forest-900/35 text-gold-300 backdrop-blur-sm transition-colors hover:bg-forest-900/70"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                      aria-label={t("a11y.hotspot", { name: hotspot.label[locale] })}
                    >
                      <span className="absolute inset-0 animate-ping rounded-full border border-gold-300/30" aria-hidden="true" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-forest-900/90 px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-parchment-100 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        {hotspot.label[locale]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pointer-events-auto p-4 sm:p-5">
                  <p className="mb-2 text-[0.58rem] uppercase tracking-[0.1em] text-parchment-100/50">
                    {t("reader.tapHint")}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => goTo(index - 1)}
                      disabled={index === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment-200/30 text-parchment-100 transition-colors hover:border-gold-300 hover:bg-parchment-100/10 disabled:opacity-30"
                      aria-label={t("reader.prevScene")}
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                    <div className="flex-1">
                      <div className="h-px w-full bg-parchment-100/25">
                        <div
                          className="h-px bg-gold-300 transition-all duration-500"
                          style={{ width: `${((index + 1) / total) * 100}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[0.58rem] uppercase tracking-[0.12em] text-parchment-100/55">
                        {t("reader.scene", { n: index + 1, total })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo(index + 1)}
                      disabled={isLast}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment-200/30 text-parchment-100 transition-colors hover:border-gold-300 hover:bg-parchment-100/10 disabled:opacity-30"
                      aria-label={t("reader.nextScene")}
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {panel ? (
                <ReaderPanel
                  panel={panel}
                  story={story}
                  locale={locale}
                  onClose={() => setPanel(null)}
                  onJump={(target) => {
                    setPanel(null);
                    setContinuous(false);
                    goTo(target);
                  }}
                  mapLocation={mapLocation}
                  setMapLocation={setMapLocation}
                  onVocabulary={(entry) => setPanel({ kind: "vocabulary", entry })}
                />
              ) : null}
            </div>
          ) : null}

          <div
            ref={textTopRef}
            className={cn(
              "relative bg-parchment-100",
              focus ? "mx-auto max-w-[46rem] px-5 pb-24 pt-8 sm:px-8" : "px-5 pb-24 pt-6 sm:px-8 lg:px-10 lg:py-10 xl:px-14",
              continuous && "mx-auto max-w-[52rem]",
            )}
          >
            <div className={cn("flex flex-wrap items-center justify-between gap-3", focus && "hidden")}>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("reader.modeLabel")}>
                {modeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={!option.available}
                    onClick={() => {
                      setMode(option.id);
                      speech.stop();
                      setActiveChar(null);
                    }}
                    aria-pressed={mode === option.id}
                    className={cn(
                      "border px-3 py-1.5 text-[0.7rem] transition-colors",
                      mode === option.id
                        ? "border-forest-900 bg-forest-900 text-parchment-50"
                        : "border-forest-900/20 text-forest-900 hover:border-gold-500",
                      !option.available && "cursor-not-allowed opacity-40",
                    )}
                    title={option.description}
                  >
                    <span className={option.id === "simple-si" ? "si" : undefined}>{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateSettings({ fontScale: scale - 0.1 })}
                  className="icon-btn h-9 w-9 border-forest-900/15 text-[0.72rem]"
                  aria-label={t("reader.decrease")}
                >
                  A−
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ fontScale: scale + 0.1 })}
                  className="icon-btn h-9 w-9 border-forest-900/15 text-[0.88rem]"
                  aria-label={t("reader.increase")}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ lineHeight: leading + 0.15 })}
                  className="icon-btn h-9 w-9 border-forest-900/15"
                  aria-label={t("reader.loosen")}
                  title={t("reader.lineHeight")}
                >
                  <span className="flex flex-col gap-[3px]" aria-hidden="true">
                    <span className="block h-px w-3.5 bg-current" />
                    <span className="block h-px w-3.5 bg-current" />
                    <span className="block h-px w-3.5 bg-current" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleBookmark(story.slug, scene.id, index)}
                  className="icon-btn h-9 w-9 border-forest-900/15"
                  aria-pressed={bookmarked}
                  aria-label={bookmarked ? t("reader.removeBookmark") : t("reader.bookmark")}
                >
                  <BookmarkIcon size={16} filled={bookmarked} />
                </button>
                {mode !== "source" ? (
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className="icon-btn h-9 w-9 border-forest-900/15"
                    aria-pressed={speech.speaking}
                    aria-label={speech.speaking ? t("reader.ttsStop") : t("reader.ttsPlay")}
                  >
                    {speech.speaking && !speech.paused ? <PauseIcon size={15} /> : speech.paused ? <PlayIcon size={15} /> : <HeadphonesIcon size={16} />}
                  </button>
                ) : null}
              </div>
            </div>

            <p className="mt-3 text-[0.66rem] leading-relaxed text-ink-500/70">{activeMode.description}</p>

            {notice ? (
              <p role="status" className="mt-3 border-l-2 border-gold-500 pl-3 text-[0.74rem] leading-relaxed text-ink-500">
                {notice}
              </p>
            ) : null}

            {!continuous ? (
              <div className="mt-8">
                {mode === "source" && reader.sourceReading ? (
                  <SourceDocument source={reader.sourceReading} />
                ) : (
                  <>
                    {!focus ? (
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-600">
                          {t("reader.scene", { n: index + 1, total })}
                        </p>
                        <p className="text-[0.6rem] uppercase tracking-[0.12em] text-ink-500/70">
                          {scene.setting[locale]}
                        </p>
                      </div>
                    ) : null}
                    <h1 className={cn("mt-2 text-[1.6rem] leading-tight text-forest-900 sm:text-[1.9rem]", locale === "si" && "si-heading")}>
                      {scene.title[locale]}
                    </h1>
                    <GoldRule className="mt-4" />
                    <div className="mt-6">
                      <ReaderText
                        text={mode === "simple-si" ? scene.text.si : scene.text.en}
                        locale={mode === "simple-si" ? "si" : "en"}
                        vocabulary={reader.vocabulary}
                        activeChar={activeChar}
                        scale={scale}
                        leading={leading}
                        onVocabulary={(entry) => setPanel({ kind: "vocabulary", entry })}
                      />
                    </div>

                    {sceneVocabulary.length > 0 ? (
                      <div className="mt-7 flex flex-wrap items-center gap-2">
                        <span className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-500">
                          {t("common.vocabulary")}
                        </span>
                        {sceneVocabulary.map((entry) => (
                          <button
                            key={entry.word}
                            type="button"
                            onClick={() => setPanel({ kind: "vocabulary", entry })}
                            className="chip si text-[0.82rem]"
                          >
                            {entry.word}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {story.source.jatakaNumber ? (
                      <p className="mt-6 text-[0.68rem] text-ink-500/60">
                        {t("reader.adaptationNotice")} · {t("common.jatakaNo", { n: story.source.jatakaNumber })}
                      </p>
                    ) : null}

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        disabled={index === 0}
                        className="btn btn-secondary btn-sm"
                      >
                        <ChevronLeftIcon size={15} />
                        {t("reader.prevScene")}
                      </button>

                      {isLast ? (
                        <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.1em] text-gold-600">
                          <StarIcon size={14} />
                          {t("reader.complete")}
                        </span>
                      ) : (
                        <button type="button" onClick={() => goTo(index + 1)} className="btn btn-primary btn-sm">
                          {t("reader.nextScene")}
                          <ChevronRightIcon size={15} />
                        </button>
                      )}
                    </div>

                    {isLast ? (
                      <div className="mt-8 border border-gold-500/40 bg-parchment-50 p-6">
                        <p className="eyebrow">{t("reader.complete")}</p>
                        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-500">{t("reader.completeBody")}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={finish}
                            disabled={completion !== null}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircleIcon size={15} />
                            {completed ? t("reader.completed") : t("reader.markComplete")}
                          </button>
                          <Link href={`/stories/${story.slug}/learn`} className="btn btn-secondary btn-sm">
                            {t("reader.learningCta")}
                            <ArrowRightIcon size={14} />
                          </Link>
                        </div>
                        {completion ? (
                          <div className="mt-4 border-t border-forest-900/10 pt-4 text-[0.76rem] text-forest-800">
                            <p className="inline-flex items-center gap-2">
                              <StarIcon size={14} className="text-gold-500" />
                              {t("learn.starEarned")}
                            </p>
                            {completion.badges.length > 0 ? (
                              <p className="mt-1">
                                {t("learn.badgeEarned")}:{" "}
                                {completion.badges
                                  .map((badge) => t(`badges.${badge}` as MessageKey))
                                  .join(" · ")}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-8 space-y-16">
                {mode === "source" && reader.sourceReading ? (
                  <SourceDocument source={reader.sourceReading} />
                ) : (
                  scenes.map((entry, entryIndex) => (
                    <section
                      key={entry.id}
                      ref={(node) => {
                        scrollSectionRefs.current[entryIndex] = node;
                      }}
                      data-scene-id={entry.id}
                      className="scroll-mt-24"
                    >
                      <div className="overflow-hidden rounded-t-[999px] border border-forest-900/10">
                        <div className="aspect-[16/9]">
                          <StoryArt
                            slug={`scroll-${entry.id}`}
                            scene={entry.environment}
                            palette={entry.palette}
                            animal={story.animal}
                            composition="wide"
                          />
                        </div>
                      </div>
                      <p className="mt-6 text-[0.6rem] uppercase tracking-[0.2em] text-gold-600">
                        {t("reader.scene", { n: entryIndex + 1, total })}
                      </p>
                      <h2 className={cn("mt-2 text-[1.5rem] text-forest-900", locale === "si" && "si-heading")}>
                        {entry.title[locale]}
                      </h2>
                      <p className="mt-1 text-[0.74rem] italic text-ink-500/70">{entry.setting[locale]}</p>
                      <div className="mt-5">
                        <ReaderText
                          text={mode === "simple-si" ? entry.text.si : entry.text.en}
                          locale={mode === "simple-si" ? "si" : "en"}
                          vocabulary={reader.vocabulary}
                          activeChar={null}
                          scale={scale}
                          leading={leading}
                          onVocabulary={(vocabEntry) => setPanel({ kind: "vocabulary", entry: vocabEntry })}
                        />
                      </div>
                      <GoldRule className="mt-10" />
                    </section>
                  ))
                )}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setContinuous(false)} className="btn btn-secondary btn-sm">
                    <ArrowLeftIcon size={14} />
                    {t("reader.readingCta" as MessageKey) === "reader.readingCta" ? t("reader.sceneProgress") : t("reader.sceneProgress")}
                  </button>
                  <Link href={`/stories/${story.slug}/learn`} className="btn btn-primary btn-sm">
                    {t("reader.learningCta")}
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceDocument({
  source,
}: {
  source: NonNullable<NonNullable<Story["reader"]>["sourceReading"]>;
}) {
  const { t, locale } = useLocale();
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-600">{t("reader.sourceNotice")}</p>
      <h1 className="mt-2 text-[1.5rem] leading-tight text-forest-900 sm:text-[1.8rem]">{source.label[locale]}</h1>
      {locale === "si" ? (
        <p className="mt-1 text-[0.76rem] uppercase tracking-[0.1em] text-ink-500">{source.label.en}</p>
      ) : null}
      <p className="mt-2 text-[0.74rem] italic text-ink-500/80">{source.attribution}</p>
      <GoldRule className="mt-5" />
      <div lang="en" className="mt-6 space-y-4 text-[0.98rem] leading-[1.85] text-ink-700">
        {source.paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-8 border-l-2 border-gold-500 pl-4">
        <p className="text-[0.62rem] uppercase tracking-[0.14em] text-forest-900">{t("reader.editorialNote")}</p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-500">{source.editorialNote.en}</p>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[0.72rem] uppercase tracking-[0.1em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
        >
          {t("reader.openSource")}
        </a>
      </div>
    </div>
  );
}

function ReaderPanel({
  panel,
  story,
  locale,
  onClose,
  onJump,
  mapLocation,
  setMapLocation,
  onVocabulary,
}: {
  panel: NonNullable<Panel>;
  story: Story;
  locale: "en" | "si";
  onClose: () => void;
  onJump: (index: number) => void;
  mapLocation: string | null;
  setMapLocation: (id: string | null) => void;
  onVocabulary: (entry: VocabularyEntry) => void;
}) {
  const { t } = useLocale();
  const reader = story.reader;
  if (!reader) return null;

  const location = reader.locations.find((entry) => entry.id === mapLocation);
  const sceneForLocation = location
    ? reader.scenes.findIndex((entry) => entry.mapLocationId === location.id)
    : -1;

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-10 bg-forest-900/20 lg:hidden"
        aria-label={t("reader.closePanel")}
        tabIndex={-1}
      />
      <div className="absolute inset-x-0 bottom-0 z-20 max-h-[70%] overflow-y-auto border-t border-gold-500/40 bg-parchment-50 p-5 shadow-panel sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[80%] sm:w-80 sm:border sm:border-gold-500/30">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-gold-600">
            {panel.kind === "map"
              ? t("reader.map")
              : panel.kind === "cast"
                ? t("reader.cast")
                : panel.kind === "vocabulary"
                  ? t("common.vocabulary")
                  : t("reader.cast")}
          </p>
          <button type="button" onClick={onClose} className="text-ink-500 hover:text-forest-900" aria-label={t("reader.closePanel")}>
            <CloseIcon size={16} />
          </button>
        </div>

        {panel.kind === "hotspot" ? (
          <div className="mt-3">
            <p className={`text-[1.2rem] leading-tight text-forest-900 ${locale === "si" ? "si" : "display"}`}>
              {panel.hotspot.label[locale]}
            </p>
            <p className={`mt-3 text-[0.86rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
              {panel.hotspot.body[locale]}
            </p>
          </div>
        ) : null}

        {panel.kind === "vocabulary" ? (
          <div className="mt-3">
            <p className="si text-[1.7rem] leading-tight text-forest-900">{panel.entry.word}</p>
            <p className="mt-1 text-[0.66rem] uppercase tracking-[0.14em] text-gold-600">{panel.entry.transliteration}</p>
            <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-500">{panel.entry.meaningEn}</p>
            <p className="si mt-2 text-[0.84rem] leading-relaxed text-forest-800">{panel.entry.meaningSi}</p>
            <div className="mt-4 border-t border-forest-900/10 pt-3">
              <p className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-500">උදාහරණය</p>
              <p className="si mt-1 text-[0.86rem] leading-relaxed text-forest-900">{panel.entry.exampleSi}</p>
              <p className="mt-2 text-[0.8rem] italic leading-relaxed text-ink-500">{panel.entry.exampleEn}</p>
            </div>
          </div>
        ) : null}

        {panel.kind === "cast" && story.characters ? (
          <ul className="mt-3 space-y-3">
            {story.characters.map((character) => (
              <li key={character.name.en} className="border-b border-forest-900/10 pb-3 last:border-0">
                <p className="text-[0.94rem] text-forest-900">{character.name[locale]}</p>
                <p className={`mt-1 text-[0.78rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                  {character.role[locale]}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {panel.kind === "map" ? (
          <div className="mt-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-forest-900/15 bg-parchment-200">
              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d="M0 55 C18 48 30 58 45 52 C60 46 72 56 100 48 L100 75 L0 75 Z" fill="#C9D3B8" opacity="0.55" />
                <path d="M0 40 C22 34 34 42 50 37 C66 32 78 40 100 34" stroke="#8FA383" strokeWidth="0.8" fill="none" opacity="0.7" />
                <path d="M62 30 C70 42 68 56 74 75" stroke="#4E8A9B" strokeWidth="2" fill="none" opacity="0.55" />
                <path d="M8 62 C30 58 44 64 62 60" stroke="#C0943F" strokeWidth="0.5" fill="none" strokeDasharray="2 2" opacity="0.7" />
              </svg>
              {reader.locations.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setMapLocation(entry.id)}
                  className={cn(
                    "absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all",
                    mapLocation === entry.id
                      ? "border-gold-600 bg-gold-500 text-parchment-50"
                      : "border-forest-900/40 bg-parchment-50 text-forest-900 hover:border-gold-500",
                  )}
                  style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
                  aria-label={entry.name[locale]}
                  aria-pressed={mapLocation === entry.id}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </button>
              ))}
            </div>

            {location ? (
              <div className="mt-3">
                <p className="text-[1rem] text-forest-900">{location.name[locale]}</p>
                <p className={`mt-1 text-[0.82rem] leading-relaxed text-ink-500 ${locale === "si" ? "si" : ""}`}>
                  {location.description[locale]}
                </p>
                {sceneForLocation >= 0 ? (
                  <button
                    type="button"
                    onClick={() => onJump(sceneForLocation)}
                    className="mt-3 text-[0.68rem] uppercase tracking-[0.1em] text-forest-900 underline decoration-gold-500/40 underline-offset-4"
                  >
                    {t("reader.scene", { n: sceneForLocation + 1, total: reader.scenes.length })}
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-[0.76rem] leading-relaxed text-ink-500">{t("reader.tapHint")}</p>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
