export type Locale = "en" | "si";

export type Localized = {
  readonly en: string;
  readonly si: string;
};

export type MoralCategory =
  | "kindness"
  | "honesty"
  | "wisdom"
  | "courage"
  | "generosity"
  | "patience"
  | "compassion"
  | "leadership"
  | "problem-solving";

export type Difficulty = "gentle" | "balanced" | "rich";

export type AnimalKind =
  | "hare"
  | "deer"
  | "monkey"
  | "elephant"
  | "fish"
  | "parrot"
  | "lion"
  | "serpent"
  | "peacock"
  | "swan"
  | "human";

export type SceneKind =
  | "forest"
  | "river"
  | "palace"
  | "mountain"
  | "lake"
  | "village"
  | "orchard"
  | "night"
  | "cliff"
  | "hermitage"
  | "ocean"
  | "garden";

export type PaletteKey = "dawn" | "emerald" | "river" | "dusk" | "night" | "gold" | "ember";

export type Composition = "arch" | "wide" | "column";

export type SourceRef = {
  /** Collection the tale belongs to, using the standard Pali numbering where verified. */
  readonly collection: string;
  readonly jatakaNumber?: number;
  readonly attribution: string;
  readonly note: Localized;
  readonly url?: string;
};

export type VocabularyEntry = {
  readonly word: string;
  readonly transliteration: string;
  readonly meaningSi: string;
  readonly meaningEn: string;
  readonly exampleSi: string;
  readonly exampleEn: string;
};

export type Hotspot = {
  readonly id: string;
  /** Position on the scene stage, in percent. */
  readonly x: number;
  readonly y: number;
  readonly label: Localized;
  readonly body: Localized;
  readonly kind: "character" | "place" | "object";
};

export type ReaderScene = {
  readonly id: string;
  readonly title: Localized;
  readonly setting: Localized;
  /** Which illustrated environment the 3D stage should move to. */
  readonly environment: SceneKind;
  readonly palette: PaletteKey;
  readonly light: "dawn" | "day" | "dusk" | "night" | "fire";
  readonly text: Localized;
  /** Public-domain source excerpt, only where a verified translation exists. */
  readonly sourceExcerpt?: {
    readonly en: string;
    readonly attribution: string;
  };
  readonly vocabulary: readonly string[];
  readonly hotspots: readonly Hotspot[];
  readonly mapLocationId?: string;
};

export type QuizQuestion = {
  readonly id: string;
  readonly prompt: Localized;
  readonly options: readonly Localized[];
  readonly answer: number;
  readonly explanation: Localized;
};

export type StoryLocation = {
  readonly id: string;
  readonly name: Localized;
  readonly description: Localized;
  /** Percentage coordinates on the story map. */
  readonly x: number;
  readonly y: number;
};

export type StoryBeat = {
  readonly en: string;
  readonly si: string;
};

export type Story = {
  readonly id: string;
  readonly slug: string;
  readonly title: Localized;
  readonly tagline: Localized;
  readonly summary: Localized;
  readonly moral: Localized;
  readonly moralCategories: readonly MoralCategory[];
  readonly ageRange: readonly [number, number];
  readonly minutes: number;
  readonly difficulty: Difficulty;
  readonly languages: readonly Locale[];
  readonly animal: AnimalKind;
  readonly scene: SceneKind;
  readonly palette: PaletteKey;
  readonly composition: Composition;
  readonly featured: boolean;
  readonly source: SourceRef;
  readonly beats: readonly StoryBeat[];
  /** Four-part explanation used on the learning page, where one has been written. */
  readonly learning?: {
    readonly happened: Localized;
    readonly keyDecision: Localized;
    readonly learned: Localized;
    readonly everyday: Localized;
  };
  readonly characters?: readonly {
    readonly name: Localized;
    readonly role: Localized;
  }[];
  /** Present only when the full immersive reading edition exists. */
  readonly reader?: {
    readonly scenes: readonly ReaderScene[];
    readonly vocabulary: readonly VocabularyEntry[];
    readonly quiz: readonly QuizQuestion[];
    readonly objectives: readonly Localized[];
    readonly locations: readonly StoryLocation[];
    readonly reflection: readonly Localized[];
  readonly sourceReading?: {
    readonly label: Localized;
    readonly attribution: string;
    readonly url: string;
    readonly editorialNote: Localized;
    readonly paragraphs: readonly string[];
  };
  };
};

export type ReaderMode = "source" | "simple-si" | "en";
