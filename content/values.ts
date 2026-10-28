import type { MoralCategory } from "./stories/types";

export type MoralValue = {
  id: MoralCategory;
  label: { en: string; si: string };
  blurb: { en: string; si: string };
  glyph: string;
};

export const MORAL_VALUES: readonly MoralValue[] = [
  {
    id: "kindness",
    label: { en: "Kindness", si: "කරුණාව" },
    blurb: { en: "Small acts that soften another’s day.", si: "අනුන්ගේ දවස මෘදු කරන කුඩා ක්‍රියා." },
    glyph: "M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z",
  },
  {
    id: "honesty",
    label: { en: "Honesty", si: "අවංකකම" },
    blurb: { en: "Telling the truth when it costs you.", si: "පිරිවැයක් වුවත් සත්‍ය කීම." },
    glyph: "M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z",
  },
  {
    id: "wisdom",
    label: { en: "Wisdom", si: "ප්‍රඥාව" },
    blurb: { en: "Seeing what a situation really asks of you.", si: "තත්ත්වය ඔබෙන් ඉල්ලා සිටින්නේ කුමක්දැයි දැකීම." },
    glyph: "M12 4a6 6 0 0 1 3.7 10.7c-.5.4-.7.9-.7 1.5V17h-6v-.8c0-.6-.2-1.1-.7-1.5A6 6 0 0 1 12 4zM9.5 20h5",
  },
  {
    id: "courage",
    label: { en: "Courage", si: "ධෛර්යය" },
    blurb: { en: "Doing the right thing while afraid.", si: "බිය සමඟත් නිවැරදි දේ කිරීම." },
    glyph: "M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z",
  },
  {
    id: "generosity",
    label: { en: "Generosity", si: "දානය" },
    blurb: { en: "Giving without keeping score.", si: "ගණන් නොබලා දීම." },
    glyph: "M4 12h16M12 4v16M7 7l10 10M17 7L7 17",
  },
  {
    id: "patience",
    label: { en: "Patience", si: "ඉවසීම" },
    blurb: { en: "Letting the right moment arrive.", si: "නිවැරදි මොහොත එන තෙක් ඉවසීම." },
    glyph: "M12 21a9 9 0 1 1 9-9M12 7v5l3.5 2M17 17h4v4",
  },
  {
    id: "compassion",
    label: { en: "Compassion", si: "දයාව" },
    blurb: { en: "Feeling with someone, not just for them.", si: "කෙනෙකු වෙනුවට නොව, ඔහු සමඟ දැනීම." },
    glyph: "M12 20s-8-4.8-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.2-8 10-8 10z",
  },
  {
    id: "leadership",
    label: { en: "Leadership", si: "නායකත්වය" },
    blurb: { en: "Carrying others before yourself.", si: "තමන්ට පෙර අනුන් උසුලා ගැනීම." },
    glyph: "M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7zM12 15v6",
  },
  {
    id: "problem-solving",
    label: { en: "Problem-solving", si: "ගැටලු විසඳීම" },
    blurb: { en: "Finding the third way through.", si: "තුන්වන මාර්ගය සොයා ගැනීම." },
    glyph: "M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zM15 8h5M15 12h5M15 16h5",
  },
];

export function getMoralValue(id: MoralCategory): MoralValue {
  return MORAL_VALUES.find((value) => value.id === id) ?? MORAL_VALUES[0]!;
}

export function isMoralCategory(value: unknown): value is MoralCategory {
  return MORAL_VALUES.some((entry) => entry.id === value);
}
