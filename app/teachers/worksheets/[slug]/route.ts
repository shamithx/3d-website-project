import { getStory } from "@/content/stories";
import { translate } from "@/lib/i18n";
import type { Locale } from "@/content/stories/types";

export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GENERIC_OBJECTIVES = ["learn.genericObj1", "learn.genericObj2", "learn.genericObj3"] as const;

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const story = getStory(slug);
  if (!story) {
    return new Response("Story not found", { status: 404 });
  }

  const url = new URL(request.url);
  const locale: Locale = url.searchParams.get("lang") === "si" ? "si" : "en";
  const answers = url.searchParams.get("key") === "1";
  const t = (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
    translate(locale, key, vars);

  const character = (story.characters?.[0]?.name ?? {
    en: "the main character",
    si: "ප්‍රධාන චරිතය",
  })[locale];

  const questions = [
    t("teachers.question1", { character }),
    t("teachers.question2"),
    t("teachers.question3"),
    t("teachers.question4"),
  ];

  const objectives =
    story.reader?.objectives ??
    GENERIC_OBJECTIVES.map((key) => ({ en: translate("en", key), si: translate("si", key) }));

  const vocabulary = story.reader?.vocabulary.slice(0, 6) ?? [];
  const quiz = story.reader?.quiz ?? [];

  const fileName = `jathaka-katha-${story.slug}-${answers ? "answer-key" : "worksheet"}.html`;

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(t("teachers.worksheetTitle", { title: story.title[locale] }))}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
<style>
  :root { --ink:#1b1a16; --forest:#1e3a2b; --gold:#a2762c; --line:#c9c2ad; --muted:#5c5647; }
  * { box-sizing: border-box; }
  body { margin:0; background:#f7f1e3; color:var(--ink); font-family:"Noto Sans Sinhala","Iskoola Pota",Georgia,serif; line-height:1.7; }
  .sheet { width:min(820px,100%); margin:0 auto; background:#fffdf7; padding:48px 56px; }
  .top { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--line); padding-bottom:14px; }
  .brand { font-family:"Cormorant Garamond",serif; font-size:15px; letter-spacing:.28em; text-transform:uppercase; color:var(--gold); }
  .brand small { display:block; letter-spacing:.16em; color:var(--muted); font-size:10px; margin-top:6px; }
  .sheet h1 { font-family:"Cormorant Garamond",serif; font-weight:400; font-size:34px; line-height:1.15; margin:26px 0 4px; color:var(--forest); }
  h1.si { font-family:"Noto Sans Sinhala",sans-serif; font-size:28px; line-height:1.5; }
  .sub { color:var(--gold); font-size:15px; margin:0 0 18px; }
  .meta { display:flex; flex-wrap:wrap; gap:8px 18px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:10px 0; }
  .fields { display:flex; gap:22px; margin:20px 0 8px; font-size:12px; color:var(--muted); }
  .fields span { flex:1; border-bottom:1px solid var(--line); padding-bottom:6px; }
  h2 { font-family:"Cormorant Garamond",serif; font-size:19px; letter-spacing:.04em; margin:30px 0 10px; color:var(--forest); font-weight:600; }
  h2.si { font-family:"Noto Sans Sinhala",sans-serif; font-size:16px; }
  p { margin:0 0 10px; font-size:14px; }
  ol, ul { padding-left:20px; margin:0; }
  li { margin-bottom:14px; font-size:14px; }
  .lines { margin-top:8px; }
  .lines div { border-bottom:1px solid #ddd6c2; height:22px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:6px 24px; }
  .vocab { width:100%; border-collapse:collapse; margin-top:6px; }
  .vocab td { border-bottom:1px solid #ddd6c2; padding:8px 4px; font-size:14px; vertical-align:bottom; }
  .vocab td:first-child { width:28%; font-size:19px; }
  .vocab td:nth-child(2) { width:22%; color:var(--gold); font-size:10px; text-transform:uppercase; letter-spacing:.1em; }
  .draw { margin-top:8px; height:220px; border:1px solid var(--line); background:
    repeating-linear-gradient(0deg, transparent, transparent 27px, #eee7d5 28px); }
  .key { margin-top:14px; border-left:3px solid var(--gold); padding-left:14px; }
  .key p { font-size:13px; }
  .notes { margin-top:28px; border-top:1px solid var(--line); padding-top:12px; font-size:10.5px; line-height:1.6; color:var(--muted); }
  .teacher { background:#fbefd9; border:1px solid #e0c9a0; padding:10px 14px; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:#7a531a; margin-bottom:8px; }
  .print { position:fixed; right:18px; top:18px; background:var(--forest); color:#fffdf7; border:0; padding:10px 16px; font-size:11px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; }
  @media print {
    body { background:#fff; }
    .sheet { width:auto; padding:0; background:#fff; }
    .print { display:none; }
    @page { margin: 16mm 15mm; }
    li { break-inside: avoid; }
  }
</style>
</head>
<body>
<button class="print" onclick="window.print()">${locale === "si" ? "මුද්‍රණය / PDF" : "Print / Save as PDF"}</button>
<main class="sheet">
  <div class="top">
    <div class="brand">Jathaka Katha<small>ජාතක කතා · ${escapeHtml(t("footer.credit").slice(0, 40))}…</small></div>
    <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-align:right;">
      ${escapeHtml(t(answers ? "teachers.answerKey" : "teachers.worksheets"))}<br />
      ${answers ? "TEACHER COPY" : "STUDENT COPY"}
    </div>
  </div>

  ${answers ? `<div class="teacher">${escapeHtml(t("teachers.answerKeyNote"))}</div>` : ""}

  <h1 class="${locale === "si" ? "si" : ""}">${escapeHtml(story.title[locale])}</h1>
  <p class="sub">${escapeHtml(locale === "si" ? story.title.en : story.title.si)}</p>

  <div class="meta">
    <span>${escapeHtml(t("teachers.ageBand"))}: ${story.ageRange[0]}–${story.ageRange[1]}</span>
    <span>${escapeHtml(t("teachers.duration"))}: ${t("common.minShort", { n: story.minutes })}</span>
    <span>${escapeHtml(story.source.collection)}</span>
    ${story.source.jatakaNumber ? `<span>${escapeHtml(t("common.jatakaNo", { n: story.source.jatakaNumber }))}</span>` : ""}
  </div>

  ${answers ? "" : `<div class="fields"><span>${escapeHtml(t("teachers.name"))}</span><span>${escapeHtml(t("teachers.date"))}</span><span>${escapeHtml(t("teachers.class"))}</span></div>`}

  <h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("story.overview"))}</h2>
  <p class="${locale === "si" ? "si" : ""}">${escapeHtml(story.summary[locale])}</p>

  <h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("learn.objectives"))}</h2>
  <ul>
    ${objectives.map((objective) => `<li class="${locale === "si" ? "si" : ""}">${escapeHtml(objective[locale])}</li>`).join("")}
  </ul>

  <h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("teachers.questions"))}</h2>
  <ol>
    ${questions
      .map(
        (question, index) => `<li>
      <div class="${locale === "si" ? "si" : ""}">${escapeHtml(question)}</div>
      ${
        answers
          ? `<div class="key"><p>${escapeHtml(
              index === 0
                ? locale === "si"
                  ? "පිළිතුරු චරිතයේ අභිප්‍රාය සහ කතාවේ ආරම්භය අනුව වෙනස් වේ. සිසුන් කතාවෙන් සාක්ෂි දෙන බව බලන්න."
                  : "Answers will vary. Look for a response that names the character’s aim and supports it with something from the story."
                : locale === "si"
                  ? "පිළිතුරු වෙනස් විය හැක. සිසුන් තම තේරීමට කතාවෙන් හේතු දක්වන බව බලන්න."
                  : "Answers will vary. Look for a reason drawn from the story rather than a single ‘correct’ line."
            )}</p></div>`
          : `<div class="lines"><div></div><div></div><div></div></div>`
      }
    </li>`,
      )
      .join("")}
  </ol>

  ${
    vocabulary.length > 0
      ? `<h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("teachers.vocabularyExercise"))}</h2>
  <p class="${locale === "si" ? "si" : ""}">${escapeHtml(t("teachers.matchWord"))}</p>
  <table class="vocab">
    <tbody>
      ${vocabulary
        .map(
          (word) => `<tr>
        <td class="si">${escapeHtml(word.word)}</td>
        <td>${escapeHtml(word.transliteration)}</td>
        <td>${answers ? escapeHtml(word.meaningEn) : ""}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>`
      : ""
  }

  ${answers ? "" : `<h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("teachers.drawBox"))}</h2><div class="draw"></div>`}

  ${
    answers && quiz.length > 0
      ? `<h2 class="${locale === "si" ? "si" : ""}">${escapeHtml(t("teachers.answerKey"))}</h2>
  <ol>
    ${quiz
      .map(
        (question, index) => `<li>
      <div class="${locale === "si" ? "si" : ""}">${escapeHtml(question.prompt[locale])}</div>
      <p><strong>${escapeHtml(question.options[question.answer]?.[locale] ?? "")}</strong></p>
      <p class="${locale === "si" ? "si" : ""}">${escapeHtml(question.explanation[locale])}</p>
    </li>`,
      )
      .join("")}
  </ol>`
      : ""
  }

  <div class="notes">
    <p><strong>${escapeHtml(t("story.sourceNote"))}</strong> ${escapeHtml(story.source.attribution)} — ${escapeHtml(story.source.collection)}${story.source.jatakaNumber ? `, No. ${story.source.jatakaNumber}` : ""}.</p>
    <p>${escapeHtml(story.source.note[locale])}</p>
    <p>${escapeHtml(t("teachers.sourceVsAdaptationBody"))}</p>
    <p>Jathaka Katha · ${escapeHtml(t("footer.rights").replace("{year}", String(new Date().getFullYear())))}</p>
  </div>
</main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
