import type { Story } from "./types";

/** The subset of a story needed to render a card, kept small for the client bundle. */
export type StoryCardData = {
  slug: string;
  title: Story["title"];
  tagline: Story["tagline"];
  summary: Story["summary"];
  moral: Story["moral"];
  moralCategories: Story["moralCategories"];
  ageRange: Story["ageRange"];
  minutes: number;
  difficulty: Story["difficulty"];
  animal: Story["animal"];
  scene: Story["scene"];
  palette: Story["palette"];
  composition: Story["composition"];
  featured: boolean;
  jatakaNumber?: number;
  hasReader: boolean;
  quizLength: number;
};

export function toCardData(story: Story): StoryCardData {
  return {
    slug: story.slug,
    title: story.title,
    tagline: story.tagline,
    summary: story.summary,
    moral: story.moral,
    moralCategories: story.moralCategories,
    ageRange: story.ageRange,
    minutes: story.minutes,
    difficulty: story.difficulty,
    animal: story.animal,
    scene: story.scene,
    palette: story.palette,
    composition: story.composition,
    featured: story.featured,
    jatakaNumber: story.source.jatakaNumber,
    hasReader: Boolean(story.reader),
    quizLength: story.reader?.quiz.length ?? 0,
  };
}
