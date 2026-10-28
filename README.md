# Jathaka Katha · ජාතක කතා

**Ancient Wisdom. Living Stories.** · **පැරණි නුවණ, ජීවමාන කතා.**

A bilingual, immersive reading platform for the Jataka tales, built for Sri Lankan children (8–15), families and classrooms. Twelve tales, two languages, one complete 3D reading experience — no accounts, no advertising, no tracking.

**Live site:** <https://3d-website-project-two.vercel.app> · **Source:** <https://github.com/shamithx/3d-website-project>

---

## What is in this repository

| Area | Status |
| --- | --- |
| Homepage (cinematic 3D hero, featured tales, moral values, journey, lives, daily wisdom, vocabulary, quiz, teacher strip, about) | Complete |
| Story library (12 tales, Sinhala/English search, 9 moral filters, sorting, URL-shareable filters) | Complete |
| Story detail pages (overview, moral, characters, source attribution, related tales) | Complete |
| **Sasa Jataka immersive reader** (7 scenes, 3 reading modes, 3D environments, hotspots, story map, TTS, bookmarks, focus and continuous modes, optional ambience) | Complete |
| Learning pages (moral explanation, quiz, vocabulary, reflection, completion) | Complete for Sasa Jataka; lesson scaffolding for the other eleven |
| Parent & teacher room + generated printable worksheets and answer keys | Complete |
| Gamification (stars, five badges, streaks, collection) stored locally | Complete |
| Bilingual UI (Sinhala / English) across every page | Complete |
| PWA shell, offline fallback, manifest, icons | Complete |
| SEO (metadata, Open Graph, sitemap, robots, JSON-LD) | Complete |
| Full illustrated readers for the other eleven tales | **Not yet written** — labelled "in preparation" in the UI, with an honest overview and lesson instead |

Nothing in the interface is a dead control: every button navigates, changes state, generates a file, or is explicitly disabled with an explanation.

---

## Stack

- **Next.js 15.5** (App Router, React 19, Server Components)
- **TypeScript** with `strict` and `noUncheckedIndexedAccess`
- **Tailwind CSS 3.4** with a custom design-token layer in `app/globals.css`
- **Three.js 0.186** (hand-written scene, no wrapper) for the hero and reader
- **next/font** self-hosted Google fonts: Cormorant Garamond, Manrope, Noto Sans Sinhala
- **next/image** for the twelve painted covers
- A small service worker (no PWA dependency) for offline reading

No analytics, no cookie banners, no third-party scripts at runtime.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20+ is recommended (built and verified on Node 22).

### Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example   # canonical URL for metadata, sitemap, robots
NEXT_PUBLIC_REPO_URL=                              # optional: shows a live GitHub link in the footer
```

Both are optional for local development. `NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000`; when it is not set the footer shows the repository item as unavailable rather than linking nowhere.

---

## Project structure

```text
app/
  layout.tsx                 root layout, fonts, providers, header/footer
  page.tsx                   homepage composition
  globals.css                design system, typography, print styles
  stories/page.tsx           library
  stories/[slug]/page.tsx    story detail
  stories/[slug]/read/       immersive reader (Sasa Jataka)
  stories/[slug]/learn/      lesson, quiz, vocabulary, reflection
  teachers/                  teacher room
  teachers/worksheets/[slug]/route.ts   generated printable HTML
  about/ progress/ offline/  supporting pages
  sitemap.ts robots.ts manifest.ts icon.svg
components/
  art/                       painted cover + vector scene fallback
  home/ layout/ learning/ reader/ stories/ teachers/ three/ progress/ providers/
content/
  stories/                   typed story data, facts, covers
  translations/              en.ts + si.ts (fully typed dictionaries)
  values.ts                  moral-value taxonomy
hooks/  lib/  public/
```

### Content model

`content/stories/types.ts` defines the whole schema: identity, bilingual copy, age band, difficulty, moral categories, source references, beats, characters, and an optional `reader` block containing scenes, vocabulary, quiz, objectives, locations, reflection prompts and the source-based reading text.

Add a tale by:

1. Adding an entry to `content/stories/index.ts` (or a new file imported there) typed as `Story`.
2. Giving it a painted cover at `public/images/stories/<slug>.webp` and adding the slug to `content/stories/covers.ts` (otherwise the layered SVG scene is used automatically).
3. Adding `reader.scenes` if it should have a full reading edition; the reader, learning page, quizzes and worksheets all derive from the same data.

The reader is data-driven: no component changes are needed to add a new complete story.

---

## Bilingual architecture

- Every interface string lives in `content/translations/en.ts` and `content/translations/si.ts`. The Sinhala dictionary is typed as `Record<MessageKey, string>`, so a missing translation is a compile error — not a silent English fallback.
- The locale is stored in a first-party cookie (`jk-locale`) and read on the server, so the first paint is already in the right language and `<html lang>` is correct.
- Switching language updates the cookie and refreshes server components; no mixed-language interface text is rendered.
- `:lang(si)` switches the typographic stack to Noto Sans Sinhala with Sinhala-appropriate line height and letter spacing.

## 3D and motion

- The forest in `lib/three/forest.ts` is a real Three.js scene: custom sky, water, mist and light-shaft shaders, recursively grown fractal trees with tapered branches and crossed leaf quads (`lib/three/tree.ts`), drifting leaves on gust fronts, gliding birds, butterflies, pollen, fireflies, embers, occasional shooting stars and expanding river ripples, plus a hare that blinks, grazes, swivels its ears and hops.
- Five environment presets (dawn, day, dusk, night, fire) cross-fade colours, fog, lights and camera distance; every opening eases in with a slow camera settle.
- Quality scales with the device (`low` mode reduces particles, geometry and pixel ratio).
- WebGL failure, blocked context, or an unsupported device falls back to a hand-built layered SVG illustration — the page never depends on WebGL.
- `prefers-reduced-motion` renders a single static frame and disables ambient animation.
- Rendering pauses when the tab is hidden.
- Ambient audio is off by default and generated in-browser with the Web Audio API after an explicit click.

### Story-card atmosphere (2D only)

The library and homepage cards use `components/stories/StoryAtmosphere.tsx`, a small CSS-driven layer that sits between the cover and the card's text:

- Each tale gets at most two effects chosen from its scene and palette: drifting leaves, glowing fireflies, slow dust motes, a water shimmer band, low mist, or rising embers.
- The painted cover is a single flat image, so nothing pretends to be a separated object. Movement comes from a very slow image breathing (2.6% over 32s), an atmospheric light pass, and a handful of vector particles over the artwork.
- Desktop hover lifts the image 4% over 600ms while the atmosphere drifts the other way — a small two-layer parallax. Keyboard focus triggers the same state; touch devices get ambient motion only.
- Effects are pure CSS transforms and opacity. An `IntersectionObserver` pauses every animation on cards outside a 240px margin, and `prefers-reduced-motion` removes the layer entirely.
- No extra packages, no video, no canvas, no WebGL on this layer, and no change to image ratios, layout or typography.

## Privacy and child safety

- No accounts, no personal details, no analytics, no third-party requests at runtime.
- Progress, bookmarks and reflection answers live in `localStorage` on the device and are never uploaded.
- Reflection text can be exported by the reader as a local text file; nothing is shared automatically.
- No advertising, leaderboards, loot boxes or pressure mechanics.

## Accessibility

- Semantic landmarks, skip link, visible focus rings, keyboard scene navigation (`←`/`→`, `Esc`), labelled controls, `aria-live` search results and scene status.
- Text size and line spacing are adjustable and persisted.
- Colour combinations were chosen for contrast on parchment; the reader avoids text over the 3D scene.
- Descriptive alternative text on meaningful illustrations; decorative card art is marked as such.

## Sources and attribution

The Jataka framing stories and verses come from the Pali commentarial tradition (Jātakatthavaṇṇanā). Summaries and children's adaptations are labelled as adaptations wherever they appear; no generated text is presented as canonical scripture.

Source translations used (public domain):

- E. B. Cowell (ed.), _The Jātaka, or Stories of the Buddha's Former Births_, Pali Text Society, 1895–1907.
- H. T. Francis & R. A. Neil, _The Jātaka_, Vol. III, 1897 — the Sasa Jataka source text, verified against the SuttaCentral edition: <https://suttacentral.net/ja316/en/francis-neil>
- Robert Chalmers (Vol. I) and W. H. D. Rouse (Vols. II, IV) for the remaining volumes.

Each story records its collection and, where verified, its standard Jataka number (Sasa 316, Nigrodhamiga 12, Vessantara 547, Mahajanaka 539, Temiya 538, Suvaṇṇasāma 540, Ummagga 546, Mahākapi 407, Kapi 404, Naḷapāna 20, Ruru 482, Kuru-dhamma 276). Regional Sri Lankan retellings differ; the site says so rather than implying a single authorised version.

Covers were illustrated specifically for this project in a single art direction; they are not third-party artwork.

## Deployment

### Vercel

The site is deployed on Vercel's free Hobby plan.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (detected automatically) |
| Build command | `npm run build` |
| Output directory | `.next` (managed by the Vercel Next.js runtime; do not override) |
| Node version | 20 |
| Production branch | `main` |

Set these environment variables for Production (and Preview, if previews are used):

```bash
NEXT_PUBLIC_SITE_URL=https://3d-website-project-two.vercel.app
NEXT_PUBLIC_REPO_URL=https://github.com/shamithx/3d-website-project
```

No other configuration is required. The project uses server features (`cookies()` for locale, a dynamic worksheet route, `headers()` in `next.config.mjs`), so it is deployed as a Next.js app — not a static export.

### Netlify

A `netlify.toml` is included and uses the official Next.js runtime:

```bash
npm i -D @netlify/plugin-nextjs
```

Then connect the repository and set the same environment variable.

### Self-hosting

```bash
npm ci
npm run build
npm run start   # binds to 0.0.0.0:3000 by default
```

The service worker requires HTTPS (or localhost) and is only registered in production builds.

## Known limitations

- Eleven tales have an illustrated overview and lesson material but not yet a full scene-by-scene reader. The interface labels this explicitly.
- Text-to-speech depends on voices installed on the device. Sinhala (`si-LK`) voices are uncommon; the UI explains when one is unavailable instead of failing silently.
- Offline caching covers the app shell and pages that have already been visited.
- Fonts are fetched at build time by `next/font`; an offline build machine needs network access for the first build.
- The repository is public but has **no open-source licence** yet. Add a licence only after deciding ownership and reuse terms for the code and the illustrations. The public-domain translations remain public domain.

## Credits

Design, code and illustrations: the Jathaka Katha project. Typography: Cormorant Garamond (Christian Thalmann), Manrope (Mikhail Sharanda), Noto Sans Sinhala (Google), all under the SIL Open Font License.
