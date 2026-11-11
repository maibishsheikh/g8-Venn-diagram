# VennQuest — Module TRD
**Grade 8 · Venn Diagrams**
*Technical companion to `VennQuest_Grade8_PRD_v3.1.md`, produced from `Intellia_Module_Blueprint_TRD_v3.1.md`. Repo: `venn-quest-main`. Clone source: `G2-Money-Money-main`.*

**Traceability.** M1 (English names) → §4.2, §4.4, §12.18. M2 (global, curriculum-neutral) → §4.4, §12.18. S1 (phase names on one line) → §6, §12.6. S2 (stepped Reflect) → §8, §12.7, §14.3. S3 (responsive) → §9, §12.8. S4 (animated, non-MCQ stations) → §10, §12.9. G1 (global content) → §4.4, §12.18. Module component specs → §14.

**Section numbering follows the blueprint.** Sections 1, 2, 5–9, 11–13 are copied from the blueprint (fixed content) with the VennQuest slots filled; §3, §4, §10's table, and §14 are authored for this module.

---

## 1. Reference Analysis Notes — Gotcha Check

Findings from reading the zip. Re-verify each against the repo you actually clone.

**Dead and duplicate code (confirm by tracing imports from `main.jsx` → `App.jsx`):**
1. **Live tree is `src/components/**`, `src/config/worlds.config.js`, `src/data/*`, `src/hooks/useAudio.js`, `src/utils/*`.** `src/features/*` (a parallel Wonder/Story/Simulate/Play/Reflect implementation), `src/core/*` (`useViewport`, `audio/useAudio`, `questions/*`), and the unused components `TopBar.jsx`, `PhaseNav.jsx`, `XPBar.jsx`, `FloatingSymbols.jsx` are not reachable from `App.jsx`. **Do not copy them forward**, and do not edit them by mistake. (The earlier blueprint listed `core/hooks/useViewport.js` as "reuse as-is"; it is unused, so drop it unless a module needs it.)
2. **`src/index.css` is never imported** (`main.jsx` imports only `styles/globals.css`). It contains the original token set.

**Undefined CSS variables (silent failures):**
3. Components use `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--radius-xl, 22px)`, and `var(--transition)`, but `design-tokens.css` does not define them (they exist only in the unimported `index.css`). In the zip they resolve to inherited/initial values (for example no transition on `.audio-btn`; the Story card radius falls back to 22 px). **Define them** in `design-tokens.css` (§5.1) with values chosen so rendering stays identical to the zip where the fallback was visible (`--radius-xl: 22px`).

**Layout bugs inherited from the zip:**
4. **`.phase-content` height uses `100vh`** (`calc(100vh - 58px)`, and `calc(100vh - 50px/46px)` on mobile) while `.app-shell` uses `100dvh`. On phones with collapsing toolbars this clips or overflows. Use `100dvh` and the shared header-height variable (§5.3).
5. **Mobile header hides phase labels** (`.step-label { display:none }` at ≤ 768 px), leaving only numbered circles. This is the zip's intentional compact behaviour and is **kept**; the one-line phase *names* requirement (S1) is satisfied on the Home screen (§6.4), not in the header.
6. **Viewport meta** is `maximum-scale=1.0, user-scalable=no`, which blocks pinch-zoom. ⚠ Recommended deviation: remove those two parameters (WCAG 1.4.4). Needs sign-off; see PRD §15.
7. **`generateSessionQuestions` only sorts by `id`** (no shuffle) and `LOAD_QUESTIONS` is dispatched on every Begin; fine for a procedural bank but means replays repeat the same session unless the bank is regenerated (relevant to the Practice unlock rule, §7.4).
8. **Two different ElevenLabs voice-settings tables:** `scripts/generate_audio.js` (pre-generated clips: e.g. `statement` stability 0.65 / similarity 0.80 / style 0.30) and `hooks/useAudio.js` (runtime fallback: e.g. `statement` 0.20 / 0.55 / 0.50). Dynamic clips therefore sound different from pre-generated ones. **Unify on one table** (§11).
9. **Hardcoded story-panel count** (`NEXT_STORY_PANEL` checks `storyPanel >= 3`) and **hardcoded 4 stations / 10 worlds / 100 questions** in the reducer (`ADVANCE_SIM_STATION` caps at 3; `NEXT_QUESTION` uses `% 10` and `< 100`). Defaults are 4 / 4 / 10 / 100; change them deliberately if a module differs.
10. **Leftover branding:** `index.html` `<title>`/description, `package.json` `name` (`moneyquest`), `README.md` (a generic Vite template), `narration.js`, and emoji/class names such as `.coin-btn-emoji` in `globals.css`, plus any locale-specific content carried over from the cloned module (item 12).
11. **Mouse-only interaction risk** and **fixed-pixel assumptions** in inherited station components; see S3/S4 (§9–§10).
12. **Locale-specific leftovers (G1):** the zip is a money module, so its story, question bank, narration, audio `phrases`, and station copy may contain currency- and region-specific content, and sibling modules built for one market may carry country-specific names, school terms (level labels, club names), places, and units. Grep and rewrite all of it for the new module, and run the locale audit (§12.18). Character names follow §4.4.

**Module-specific risk:** this module's correctness lives in **which region a thing belongs to**, and its interactions are continuous (dragging circles, moving tokens). Two failure modes follow: (a) region logic duplicated between the question generator, the Simulate stations, and the geometry code, which then silently disagree; (b) token animations that look right but place a token in a region whose count does not match the diagram. Both are prevented by a **single source of truth**: one `counts[mask]` representation (§4.3) and one geometry module (§14.1), checked by an independent oracle (§12.2) and a token-placement audit (§12.5).

**How the gotchas apply to VennQuest:**
- Defaults fit: 4 story panels, 4 stations, 10 worlds, 100 questions, so the hardcoded counts in the reducer (item 9) need no change. The **unlock rule** (§7.4) does need reducer changes.
- Item 7: every Begin and every replay passes a fresh `attemptSeed` to `generateSessionQuestions`, so a replayed world gets a new question set (§4.3).
- Item 12: the zip is a money module; remove all coin, note, and currency content (components, copy, narration, audio phrases) and rename `.coin-btn-emoji` style classes for Venn emoji classes.
- Item 6 (viewport meta) is a sign-off item (PRD §15.10).

## 2. Tech Stack

| Item | Version / setting |
|---|---|
| React / React DOM | `^19.2.7` |
| Vite / `@vitejs/plugin-react` | `^8.1.0` / `^6.0.2` (`base: '/'`, manual `vendor` chunk) |
| Framer Motion | `^12.42.0` |
| lucide-react | `^1.22.0` |
| Tailwind CSS (+ PostCSS, Autoprefixer) | `^3.4.4` (`@tailwind base/components/utilities` imported in `globals.css`; config has an empty `theme.extend`) |
| Lint | `oxlint ^1.69.0` (`react/rules-of-hooks: error`, `react/only-export-components: warn`) |
| Audio tooling (dev) | `dotenv`, `node-fetch` (scripts `generate-audio`, `clean-audio`) |
| Hosting | `vercel.json` single-page rewrite to `/index.html` |
| Fonts | Google Fonts: **Fredoka** 400–700, **Nunito** 400/600/700/800/900, **Quicksand** 500–700 (`index.html`) |

**No new runtime dependencies per module.** Dev-only additions for §12 tests: Playwright and axe-core.

## 3. Folder Structure

```
venn-quest-main/
├── public/ (assets/audio, assets/story, favicon.svg)
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§11)
│   ├── clean_audio.js            # reuse as-is
│   ├── stress_test.mjs           # NEW — §12.1–12.5 (generator run, independent oracle, provenance, degenerate, token placement)
│   ├── layout_tests.spec.mjs     # NEW — §12.6–12.10 (Playwright: Home, Reflect, device matrix, layout anchors)
│   └── locale_audit.mjs          # NEW — §12.18 (deny-list and English-name audit)
├── src/
│   ├── main.jsx                  # imports styles/globals.css only
│   ├── App.jsx / App.css         # reducer, app-shell, app-header (reuse; §1.4 fix; per-world unlock, §7.4)
│   ├── styles/ design-tokens.css (§5.1 + five appended tokens + world accents + set tokens, §5.7), globals.css (Venn emoji classes)
│   ├── config/ worlds.config.js (§4.1), audio.config.js, characters.config.js (Jack / Emma / Pixel, §4.2)
│   ├── hooks/ useAudio.js, usePointerDrag.js (NEW), useVennScale.js (NEW; the blueprint's useVisualScale)
│   ├── data/ storyContent.js (§4.2), questionBank.js (§4.3), namePool.js (NEW, §4.4)
│   ├── utils/ audio.js, audioMap.js (generated), narration.js, badgeEngine.js, scoring.js, shuffle.js,
│   │          vennMath.js (NEW), vennGeometry.js (NEW), tokenLayout.js (NEW)
│   └── components/
│       ├── IntroScreen.jsx/.css      # REWRITE to screenshot 1 (§6)
│       ├── ProgressMap.jsx/.css      # header phase nav — reuse as-is
│       ├── shared/ Mascot (Pixel), FeedbackOverlay, FloatingNumbers (not mounted in Reflect), VennCanvas (NEW), TokenCrowd (NEW)
│       ├── gamification/ KingdomMap (REWRITE to screenshot 2, §7), StarRating
│       ├── quiz/ QuestionRenderer (MODIFY: renders VennCanvas), BossBattleModal
│       ├── phases/ WonderPhase (interactive, §14.4), StoryPhase, SimulatePhase, PlayPhase (map per §7),
│       │          ReflectPhase (stepped, §8) + reflect/ ReflectStepper, ReflectRecap, ReflectPrompt, ReflectScorecard
│       └── simulations/ TheOverlapLab, ShadeTheTarget, FillTheDiagram, AuditTheAnalyst (.jsx), Stations.css
└── index.html, package.json, vite.config.js, tailwind.config.js, postcss.config.js, vercel.json, .oxlintrc.json, README.md
```
Do **not** copy: `src/features/*`, `src/core/*`, `index.css`, `TopBar`, `PhaseNav`, `XPBar`, `FloatingSymbols`, `CoinDisplay`, `MoneyVisual`, `moneyMath.js` (money-specific). `config/locale.config.js` is **not needed**: the module has no currency or unit setting.

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9. `emoji` is the world **icon** shown on the map card (🔒 replaces it while locked); the question range `Q{10i+1}–{10i+10}` is derived, not stored.

```js
export const WORLDS = [
  { id: 0, name: "Meet the Testers", emoji: "👥", accent: "var(--world-0)",
    description: "Describe sets, use ∈, ∉, and ξ", conceptFocus: "sets-elements-universal-set",
    boss: { name: "The Misfiled Report", emoji: "🗂️", reward: "Sorter Badge" } },
  { id: 1, name: "Inside and Outside", emoji: "🔲", accent: "var(--world-1)",
    description: "One set in ξ; find its complement A′", conceptFocus: "set-and-complement",
    boss: { name: "The Ghost Tester", emoji: "👻", reward: "Outside Badge" } },
  { id: 2, name: "Two Circles, Four Zones", emoji: "🔵", accent: "var(--world-2)",
    description: "Read and place items in the four regions", conceptFocus: "read-two-set-venn",
    boss: { name: "The Double Player", emoji: "🎮", reward: "Region Reader Badge" } },
  { id: 3, name: "The Overlap Zone", emoji: "🔗", accent: "var(--world-3)",
    description: "Find and count A ∩ B (\"and\")", conceptFocus: "intersection-and",
    boss: { name: "The Gatekeeper", emoji: "🚪", reward: "Overlap Badge" } },
  { id: 4, name: "Count It Once", emoji: "➕", accent: "var(--world-4)",
    description: "Find and count A ∪ B without double-counting", conceptFocus: "union-or-no-double-count",
    boss: { name: "The Double Counter", emoji: "🧮", reward: "Union Badge" } },
  { id: 5, name: "Nested and Apart", emoji: "↔️", accent: "var(--world-5)",
    description: "Recognise subset and disjoint cases", conceptFocus: "subset-and-disjoint",
    boss: { name: "The Nesting Doll", emoji: "🪆", reward: "Special Case Badge" } },
  { id: 6, name: "Fill from the Totals", emoji: "🧾", accent: "var(--world-6)",
    description: "Complete a two-set diagram from totals", conceptFocus: "fill-venn-from-totals",
    boss: { name: "The Missing Form", emoji: "📄", reward: "Totals Badge" } },
  { id: 7, name: "Shade the Region", emoji: "🎨", accent: "var(--world-7)",
    description: "Shade and count A′, A ∩ B′, A′ ∩ B, (A ∪ B)′", conceptFocus: "shade-set-expressions",
    boss: { name: "The Shading Gremlin", emoji: "🖍️", reward: "Shading Badge" } },
  { id: 8, name: "Three Circles", emoji: "☘️", accent: "var(--world-8)",
    description: "Read and complete a three-set diagram", conceptFocus: "three-set-venn",
    boss: { name: "The Triple Overlap", emoji: "🔺", reward: "Three-Set Badge" } },
  { id: 9, name: "The Final Audit", emoji: "🏁", accent: "var(--world-9)",
    description: "Mixed review of every concept above", conceptFocus: "mixed-review",
    boss: { name: "The Head of Analytics", emoji: "📊", reward: "Master Analyst Trophy" } },
];
```

### 4.2 `data/storyContent.js` and `config/characters.config.js`
`STORY_PANELS` has length 4 per PRD §8.2, in the fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Messy Survey", "Two Circles, Four Zones", "Count the Overlap Once", "Three Games, Seven Zones". **Fixed literals**, unit-tested once at build time against `vennMath.js`: two-set survey 40 (20 Racing, 22 Puzzle, 8 both; regions 12 / 8 / 14 / 6; union 34; 12 + 8 + 14 + 6 = 40; 20 + 22 − 8 = 34); three-set survey 60 (centre 2; pair-only 4, 3, 5; single-only 10, 8, 6; outside 22; sum 60; at least one = 38).

Characters use common English first names (M1) and neutral emoji (no skin-tone assumptions); colours reference existing tokens only:

```js
export const CHARACTERS = {
  jack:  { name: "Jack",  role: "Adds the totals and double-counts",        emoji: "🧑", colour: "var(--gold)",         mascotEmoji: "🐧" },
  emma:  { name: "Emma",  role: "Checks the pieces add back to the whole",  emoji: "👧", colour: "var(--purple-light)", mascotEmoji: "🐧" },
  pixel: { name: "Pixel the Penguin", role: "Mascot & mentor",              emoji: "🐧", colour: "var(--green)",        mascotEmoji: "🐧" },
};
export const MASCOT = { name: "Pixel the Penguin", emoji: "🐧" };
```

### 4.3 Question Bank — Procedural Generation

The eight blueprint rules map onto the design as follows: (1) one source of truth → `counts[mask]`; (2) whole numbers by construction → region counts are chosen first; (3) named-misconception distractors → the registry below; (4) regenerate, don't pad → `misconceptionDistractors` returns fewer than 3 valid values → regenerate the survey; (5) coincidence guards → no two of n(A), n(B), n(A ∩ B), n(A ∪ B) are equal; (6) shared logic → `vennMath.js`; (7) explanations rendered from `inclusionExclusionTrace` / `solveFromTotals`; (8) context variety → five content areas cycled.

**Single source of truth: `counts[mask]`.** A survey is an array of region counts indexed by a bitmask: bit 0 = in A, bit 1 = in B, bit 2 = in C. Two sets: `0` outside, `1` only A, `2` only B, `3` both. Three sets: `0` outside, `1` A only, `2` B only, `4` C only, `3` A∩B only, `5` A∩C only, `6` B∩C only, `7` all three. **Every** total, shading target, token, question, and distractor derives from this one array.

```js
survey = {
  id, contentArea,                       // "games" | "clubs" | "languages" | "transport" | "music"
  sets: 2 | 3, letters: ["A","B","C"], names: ["Racing","Puzzle","Strategy"],
  shape: "overlap" | "subset" | "disjoint",
  counts: [outside, onlyA, onlyB, both, ...],   // length 4 or 8
}
```

**`utils/vennMath.js`** — pure functions shared by the generator, the stations, the Reflect recap, and the Error-Detective:

| Function | Purpose |
|---|---|
| `generateSurvey({ sets, shape, contentArea, seed })` | Builds a survey by choosing the **region counts first** and deriving totals, names, and wording from them. `seed` includes the `attemptSeed`, so replays differ. |
| `total(survey)` | n(ξ) = sum of `counts`. |
| `countWhere(survey, predicate)` | Sum of `counts[m]` for masks satisfying `predicate(m)`; the base of every derived total. |
| `nSet` / `nAnd` / `nOr` / `nComplement` | n(A), n(A ∩ B …), n(A ∪ B …), n(A′), all via `countWhere`. |
| Expression layer: `{op:'set'\|'not'\|'and'\|'or'}` AST, `exprToString(expr)`, `exprRegions(expr, sets)`, `exprCount(survey, expr)` | **The single source of truth for shading and set-notation items.** `exprRegions` returns the masks for which the expression is true; Shade the Target, World 7, and the Error-Detective all call it, so a shading "correct answer" is never authored separately from the expression. Supported: `A′`, `A∩B`, `A∪B`, `A∩B′`, `A′∩B`, `(A∪B)′`, and (three-set) `A∩B∩C`, `A∪B∪C`. |
| `inclusionExclusionTrace(survey)` | Ordered steps `[ { label, expr, value } ]` for n(A) + n(B) − n(A ∩ B) = n(A ∪ B); drives the Lab's "count it" animation and the explanation text. |
| `solveFromTotals(problem)` | Returns the **inside-out** working order and values (overlap → "only" regions by subtraction → outside → sum check) for two- and three-set problems. |
| `verifyDiagram(survey, studentCounts)` | Returns `{ ok, mismatchedMasks, mismatchedTotals }`; used live by Fill the Diagram and Audit the Analyst. |
| `misconceptionDistractors(survey, askedKind, count)` | Returns `{ value, misconceptionId }` candidates computed by running the *wrong* procedure on the same survey. |
| `seedErrorInDiagram(survey, misconceptionId)` | Returns `{ flawedCounts, replaySteps, errorTarget, correctValue }`; the flawed diagram is the correct one with exactly one wrong step applied. |
| `tokensFromSurvey(survey)` | Expands `counts` into named tester tokens `{ id, name, avatar, mask }`, deterministic for a survey id, with names taken from `data/namePool.js` (§4.4). |

**Misconception registry** (each distractor and seeded error carries one of these IDs):

| `misconceptionId` | Wrong procedure |
|---|---|
| `double-count-overlap` | Union computed as n(A) + n(B) (no subtraction). |
| `n-as-only` | Treats n(A) as "only A" (forgets the overlap is inside A). |
| `forget-outside` | Leaves out the outside region, so regions don't sum to n(ξ); reports n(ξ) as a union. |
| `and-or-swap` | Answers with the union where the intersection was asked, or vice versa. |
| `complement-as-other-set` | Reads A′ as B. |
| `wrong-total-base` | Computes a complement from n(A ∪ B) or another wrong base instead of n(ξ). |
| `set-as-complement` | Answers n(A) when n(A′) was asked. |
| `sum-instead-of-difference` | Adds where a subtraction was needed (n(ξ) + n(A), n(P) + n(both)). |
| `total-as-answer` | Answers n(ξ). |
| `wrong-region-count` | Reads a neighbouring region's count. |
| `membership-swap` | Swaps ∈ and ∉ in a membership statement. |
| `wrong-count` | Miscounts the listed elements of a set. |
| `difference-instead-of-union` | Subset/disjoint: subtracts the sets instead of adding without overlap. |
| `smaller-set-as-union` | Subset/disjoint: reports one set as the union. |
| `centre-omitted` | Three-set: ignores the centre when deriving "only" pair regions. |
| `exactly-vs-at-least` | Three-set: includes the centre in "exactly two", or confuses "at least one" with "exactly two". |
| `pair-totals-summed` | Three-set: adds the three pairwise intersections, counting the centre three times. |
| `circle-sum-as-union` | Three-set: n(A) + n(B) + n(C) taken as the union. |
| `wrong-region-shaded` | Shading or notation error for a set expression (a neighbouring region). |
| `complement-misplaced` | Applies the complement to the wrong part of an expression, for example (A ∩ B)′ for A ∩ B′. |

**Constraints (hard requirements):**
- Every count is a non-negative integer and `total(survey) ≤ 60`.
- Shape `overlap` has every region ≥ 1; `subset` has the inner set's "only" region = 0 and the others ≥ 1; `disjoint` has the "both" region = 0 and the others ≥ 1. No other zero regions are generated.
- No two of n(A), n(B), n(A ∩ B), n(A ∪ B) are equal for the same survey.
- Every distractor comes from `misconceptionDistractors`, is a non-negative integer (or a valid expression or statement for notation items), and differs from the correct answer and the other options; if fewer than 3 valid distractors exist, **regenerate the survey**, never pad.
- `generateSurvey` cycles through its five content areas so no single context dominates the 100-question bank.
- Every explanation is rendered from `inclusionExclusionTrace` / `solveFromTotals`, never written separately.

**Per-world generator map** (each world has one or more templates, exactly 4 options: 1 correct + 3 distractors):

| id | `conceptFocus` | Correct answer from | Distractors drawn from |
|---|---|---|---|
| 0 | `sets-elements-universal-set` | membership truth of `mask` bits / n of a listed set | `membership-swap`, `wrong-count` |
| 1 | `set-and-complement` | `nComplement` | `set-as-complement`, `sum-instead-of-difference`, `total-as-answer`, `wrong-total-base` |
| 2 | `read-two-set-venn` | `nSet` / `countWhere` for a named region | `n-as-only`, `wrong-region-count`, `total-as-answer` |
| 3 | `intersection-and` | `nAnd`, or "only B" = n(B) − n(A ∩ B) | `and-or-swap`, `n-as-only`, `sum-instead-of-difference`, `wrong-region-count` |
| 4 | `union-or-no-double-count` | `nOr` via `inclusionExclusionTrace` | `double-count-overlap`, `forget-outside`, `wrong-region-count` |
| 5 | `subset-and-disjoint` | `nOr` for subset/disjoint shapes | `double-count-overlap`, `difference-instead-of-union`, `smaller-set-as-union`, `wrong-region-count` |
| 6 | `fill-venn-from-totals` | any region from `solveFromTotals` | `wrong-region-count`, `and-or-swap`, `double-count-overlap`, `forget-outside` |
| 7 | `shade-set-expressions` | `exprCount` / `exprToString` for the shaded regions | `wrong-region-shaded`, `complement-as-other-set`, `and-or-swap`, `n-as-only` |
| 8 | `three-set-venn` | counts from the seven regions | `centre-omitted`, `exactly-vs-at-least`, `pair-totals-summed`, `circle-sum-as-union` |
| 9 | `mixed-review` | draws from worlds 2–8 at random | union of the above, plus `complement-misplaced` |

**`data/questionBank.js`:** fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`. `visual` is `"venn"` and `visualData` is `buildVennDescriptor(survey, { reveal })` (§14.1), so **every question renders a live Venn diagram**. `hint1` always names the first thing to place ("Start with the overlap…" / "Find who is outside first…"). Exports `generateSessionQuestions(attemptSeed)` and `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

### 4.4 Locale and names

Intellia is a global platform; modules ship in English and must not assume one country.
1. **Names:** characters use common English first names (no surnames), gender-balanced where two characters appear, easy for the Alice voice to pronounce, and distinct from sibling modules' pairs. Character names live only in `characters.config.js` and are passed into templates; none is hard-coded in components, story text, or narration strings. Background names used in generated questions come from one **pool of common English first names** declared in the module's data layer, never from a locale-specific list.
2. **Curriculum-neutral wording:** no country-specific school terms or level labels (for example Year n, Secondary n, Class n, Standard n, or named clubs and programmes) in learner-facing text; use "grade", "class", and "club" generically. Intellia grade labels are the only level language. Framework names appear in the PRD/TRD only.
3. **Money, units, dates, places, holidays, food, brands:** neutral by default (generic "coins" or "credits", metric units unless the topic is unit conversion, no named currencies, cities, or brands). If the topic requires one, put it behind one config object (`config/locale.config.js`: currency symbol, unit system, number format) so a regional variant is a config change, not a rewrite.
4. **Notation and terminology:** one house style per module, stated in the PRD §3 with the variants listed; spoken forms in narration (PRD §11) match it.
5. **Spelling:** one English spelling variant per module; prefer wording that is identical in US and UK spelling, and state the chosen variant in the PRD when it cannot be avoided.
6. **Audio:** names and terms are checked by ear in the generated clips; if the voice mispronounces a name, replace the name rather than respelling it.

**VennQuest settings for these rules:**
- **Characters (M1):** Jack, Emma, and the mascot Pixel the Penguin (`characters.config.js`).
- **Background-name pool** (`data/namePool.js`, 48 common English first names, reviewed for voice pronunciation; excludes the characters' names): Amy, Ava, Ben, Chloe, Dan, Ella, Fiona, Grace, Harry, Isla, Jake, Kate, Liam, Mia, Noah, Olivia, Sam, Tom, Zoe, Ruby, Leo, Lucy, Max, Ned, Nina, Owen, Rose, Ryan, Sophie, Will, Adam, Beth, Cara, Dylan, Evie, Finn, Gwen, Hugo, Iris, Joe, Kyle, Lara, Matt, Nora, Oscar, Paul, Pete, Tess. Tokens are drawn without repeats within one diagram (cap 48 tokens, so the pool always suffices).
- **Content areas:** games, clubs, languages, transport (walk, bike, bus, car), music. No currency or units, so no `locale.config.js`.
- **Notation house style:** ξ, A′, n( ), ⊂, ∅, A ∩ B′ (PRD §3); no variant notation appears in learner-facing text.
- **Spelling:** International English, British-style (organise, colour); US variants are an open question (PRD §15.11).
- **Module deny-list additions** (for §12.18): the earlier draft's non-English names (Jia Wei, Nurul, Aisha, Chen, Dev, Farah) and the school term "CCA", on top of the blueprint's default seed.

## 5. Design System

### 5.1 `styles/design-tokens.css`
Reuse the zip's file verbatim, then **append the five tokens the zip's components use but never defined** (§1.3).

| Token | Value |
|---|---|
| `--color-bg` | `#0a0a2e` |
| `--color-surface` | `rgba(30, 30, 100, 0.7)` |
| `--color-primary` / `--gold` | `#ffc107` |
| `--gold-light` | `#ffe082` |
| `--color-secondary` / `--purple` | `#7c5cbf` (`--purple-light` `#9c7fd8`) |
| `--color-accent` / `--green` | `#4caf50` |
| `--color-error` / `--red` | `#ef5350` |
| `--color-text` | `#ffffff` |
| `--color-text-muted` | `rgba(255,255,255,0.4)` |
| `--font-display` | `'Fredoka', 'Nunito', system-ui, -apple-system, 'Segoe UI', + colour-emoji fonts, sans-serif` |
| `--font-body` | `'Nunito', system-ui, …` (same fallback chain) |
| `--font-emoji` | `'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji','EmojiOne Color',sans-serif` |
| `--radius-sm / md / lg / pill` | `8px / 14px / 22px / 999px` |
| `--shadow-sm / md` | `0 2px 8px rgba(0,0,0,.25)` / `0 6px 24px rgba(0,0,0,.35)` |
| `--shadow-glow-gold` | `0 0 24px rgba(255,193,7,.35)` |
| `--transition-fast / base / spring` | `0.18s ease` / `0.3s ease` / `0.6s cubic-bezier(0.34,1.56,0.64,1)` |
| **Append:** `--text-primary` | `#ffffff` |
| **Append:** `--text-secondary` | `rgba(255,255,255,0.75)` |
| **Append:** `--text-muted` | `rgba(255,255,255,0.45)` |
| **Append:** `--radius-xl` | `22px` *(matches the zip's effective Story-card radius)* |
| **Append:** `--transition` | `0.25s cubic-bezier(0.4,0,0.2,1)` |

**World accents `--world-0 … --world-9`** are the only per-module colours. The zip's set (a Material-500-style family) is: `#FFD700, #FF6F61, #4CAF50, #AB47BC, #29B6F6, #EC407A, #FF9800, #26A69A, #5C6BC0, #FFC107`. **Default: reuse these ten values unchanged** (assign them to the module's worlds in order, or by meaning); a module may substitute its own only if each stays within the same saturation/lightness family and meets contrast against `#0a0a2e`.

**Recurring literal colours** (used directly in component CSS; keep as written):

| Role | Value(s) |
|---|---|
| Amber active / CTA gradient | `#fbb03b → #f59e0b` (180°), border `#fbbf24`, text on amber `#18181b` |
| Primary button | `linear-gradient(135deg,#ffc107,#ff9800)`, text `#1a1a2e`, glow `0 0 20px rgba(255,193,7,.3)` |
| Success / done green | `#22c55e` (soft `#86efac`, `#4ade80`) ; green button `#00e676 → #00c853` |
| Error | `#ef5350` (soft `#f87171`); option wrong `#ff5252` / text `#ff8a80` |
| Option correct / selected | `#00e676` / `#ffe033` |
| Title orange / subtitle gold (Home) | `#ff9f43` / `#feca57` |
| Station title / yellow accents | `#fcd34d` / `#ffd54f` |
| Muted label greys | `#a0a0b8` (inactive nav label), `#c0c0d8` (completed), `#4a4a5e` (nav divider), `#a4b0be` / `#d1d8e0` (Home descriptions) |
| Hint (purple) | bg `rgba(124,92,191,.22)`, border `rgba(124,92,191,.5)`, text `#f3e8ff` |

**Surfaces** (all dark glass over `#0a0a2e`):

| Surface | Fill | Border | Radius |
|---|---|---|---|
| `.glass-card` | `rgba(22,22,80,.72)`, blur 14 px, shadow `0 6px 28px rgba(0,0,0,.4)` | `1px rgba(255,255,255,.1)` | 22 |
| Wonder / Simulate / Story cards | `rgba(26,20,68,.85–.88)`, blur 20–24 px, shadow `0 16–18px 45–50px rgba(0,0,0,.45–.5)` | `1–1.5px rgba(130,110,210,.25–.3)` | 22 (Story uses `--radius-xl`) |
| Header phase pill / audio button | `rgba(20,20,45,.78)`, blur 16 / 12 | `1px rgba(255,255,255,.16–.18)` | 40 / 50% |
| Home journey card | `rgba(30,30,65,.65)`, blur 14, shadow `0 8px 24px rgba(0,0,0,.3)` | `1px rgba(255,255,255,.14)` | 20 |
| Home bottom chips | `rgba(30,30,60,.6)`, blur 10 | `1px rgba(255,255,255,.1)` | 16 (pill in screenshot 1) |
| Sim tabs / footer bars | `rgba(15,12,40,.75)` | `1px rgba(255,255,255,.08)` | — |
| Feedback / Boss overlays | backdrop `rgba(10,10,30,.78)` blur 10 / `rgba(10,10,35,.85)` blur 12 | card border `2px rgba(34,197,94,.6)` or `rgba(239,83,80,.6)` / `1.5px rgba(255,179,0,.4)` | 22 |

**Backgrounds:** `body` is flat `#0a0a2e`; `FloatingNumbers` (fixed, z-index 0, `font-size 2.4rem`, `rgba(255,255,255,.045)`, 22 s linear float) sits behind every phase. **The Home screen alone** adds a radial gradient (§6.2).

### 5.2 Typography
Display = Fredoka (weights 700–900 for headings/buttons); body = Nunito (600–800 for UI text). Sizes are `clamp()`-based; the values that matter:

| Element | Size | Weight |
|---|---|---|
| Home title | `clamp(2.4rem, 4.8vw, 3.8rem)` (≈ 60.8 px at 1366) | 900 |
| Home subtitle | ≈ 18 px *(measured)* | 800 |
| Wonder title | `clamp(1.4rem, 2.4vw, 1.95rem)` | 900 |
| Story title / text | `clamp(1.45rem, 2.2vw, 2rem)` / `clamp(1.08rem, 1.3vw, 1.28rem)` (line-height 1.6) | 900 / 700 |
| Question text | `clamp(1.35rem, 2vw, 1.75rem)` (line-height 1.45) | 900 |
| Option button | `1.05rem`, min-height 48 px | 700 |
| Station title / guide text | `clamp(1.1rem, 1.35vw, 1.35rem)` / `clamp(.92rem, 1.05vw, 1.05rem)` | 900 / 700 |
| Reflect title | `clamp(1.5rem, 2.5vw, 2.1rem)` | 900 |
| Header phase label | `1rem` (hidden ≤ 768 px) | 800 |
| Buttons (`.btn`) | `1rem`, `.btn-sm` `.88rem`, `.btn-lg` `1.15rem` | 700 |
Emoji glyphs always use `--font-emoji` (the `.coin-btn-emoji, .mascot, …` list in `globals.css`; **rename and extend it for the module's own emoji classes**).

### 5.3 App shell and header &nbsp;(`App.css`, `ProgressMap.css`)

| Item | Desktop | ≤ 768 px | ≤ 540 px |
|---|---|---|---|
| `.app-shell` | 100% × `100dvh`, `overflow:hidden`, flex column | same | same |
| `.app-header` (fixed, z 150, `pointer-events:none`) | height 56, padding 0 16 | 50, padding 0 8 | 46 |
| `.phase-content` padding-top | 58 | 50 | 46 |
| `.phase-content` padding-bottom | 6 | `max(60px, 40px + safe-area)` | `max(70px, 45px + safe-area)` |
| `.home-btn` (absolute, z 200) | `top 8, left 16`, pill, border `1.5px #f59e0b`, bg `rgba(22,18,48,.9)`, text `#fbbf24` Fredoka 800 `.92rem`, padding `6px 16px`, min-height 36 | `top 7, left 8`, padding `4px 10px`, `.84rem`, min-height 32 | `top 6, left 6`, **text hidden** (icon only), padding `4px 8px` |
| `.header-progress` | centred (`left:50%`, `top:7`) | `top:7` | `top:6` |
| Phase pill | padding `8px 20px`, gap 14, radius 40 | padding `4px 8px`, gap 4 | same |
| Step circle | 30 px (font `.88rem`, 900) | 26 px (`.76rem`) | same |
| Step label | Fredoka `1rem` 800; icon + label | **hidden** | hidden |
| Audio button | 44 × 44, `1.25rem` | 34 × 34, `1rem` | same |

Step-circle states: **done** `#22c55e` with ✓ + glow `0 0 10px rgba(34,197,94,.5)`; **active** `#fbb03b`, text `#18181b`, glow `0 0 12px rgba(251,176,59,.6)`; **idle** `rgba(255,255,255,.15)`, text `rgba(255,255,255,.6)`. The header is **hidden on the Home screen**.

**Audio toggle position: in the pill's row, immediately to the right of the phase pill (gap 12).** This follows the zip and screenshot 2 and **replaces** the earlier "right-centre of the screen" wording.

Fix for §1.4: define `--header-h: 56px` (50 / 46 at the breakpoints above) and use `height: calc(100dvh - var(--header-h))`.

### 5.4 Per-phase layout metrics (zip)

| Phase / element | Metrics |
|---|---|
| **Wonder** | `.wonder-content` max-width 660; card padding `clamp(14px,2vh,22px) clamp(16px,2.5vw,28px)`, gap `clamp(8px,1.2vh,12px)`; centred; number display dashed gold border `1.5px rgba(255,179,0,.45)`, radius 12; CTA `1.1rem`, padding `10px 30px`, min-height 44 |
| **Story** | container max `min(1160px, 96vw)`; progress track 10 px tall; main card grid `1.15fr 1fr`, radius 22, border `1.5px rgba(130,110,210,.3)`, max-height `calc(100vh - 140px)`; content padding `clamp(18px,2.5vh,30px) clamp(20px,2.5vw,32px)`; nav dots 12 px (active 28 px wide pill); nav buttons min-height 42, padding `8px 22px`, `1.05rem`; **≤ 768: single column**, image min-height 200 |
| **Simulate** | `.sim-card` max `min(1080px, 98vw)`, full height; tabs `padding 6px 14px`, tab min-height 32 (28 at ≤ 768), active tab = amber gradient; footer buttons min-height 36 (34), radius 12; progress dots 8 px (active ×1.35, done `#22c55e`) |
| **Station** | `.station-wrap` padding `clamp(6px,1vh,10px) clamp(8px,1.2vw,16px)`; header = title + target box (`rgba(245,158,11,.22)`, `2px #f59e0b`, radius 12); **2-column grid `1fr 1fr`**, gap `clamp(8px,1.2vw,14px)` → **1 column and `overflow-y:auto` at ≤ 768**; guide card dashed `1.5px rgba(255,255,255,.25)`, radius 12; success panel `rgba(18,16,52,.96)`, `2px rgba(34,197,94,.7)`, radius 14; action buttons min-height 38 (34), radius 12 |
| **Practice — question screen** | `.play-wrap` max 800, padding `10px 16px 20px`; top bar = pill, bg `rgba(20,20,50,.75)`; progress line 5 px tall (amber gradient); `.qr-wrap` max 740, padding `clamp(18px,2.8vw,28px) clamp(18px,2.8vw,32px)`; options grid 2 × gap 10; hint box purple (above); prev/next min-height 44 |
| **Feedback overlay** | card max 520, padding `28px 32px`; icon circle 72; title `clamp(1.6rem,2.5vw,2.2rem)`; auto-dismiss after 2.2 s |
| **Boss modal** | card max 540 (battle mode 760); avatar 76 px circle; title `clamp(1.6rem,2.5vw,2.2rem)` gold |
| **Reflect (zip)** | `.reflect-card` max 760, padding `clamp(20px,3.5vw,32px)`, gap 18; trophy card max 620, border `2px rgba(255,179,0,.45)` — restructured in §8 |

### 5.5 Breakpoints (zip)
**768** (primary: header compaction, label hiding, single-column Story/stations, 3-column map grid in the zip), **600** (mascot bubble font `.95rem`, practice top bar centred), **540** (home-button text hidden, header 46), **500** (badge list one column), **480** (2-column map grid in the zip). New modules add no other primary breakpoints; §9 lists the few allowed additions.

### 5.6 Motion
Hover: `translateY(-1…-3px)` with amber glow; press: `scale(.97)`; options: shake `0.38s` on wrong; feedback auto-dismiss 2.2 s; spring transition `0.6s cubic-bezier(.34,1.56,.64,1)` for celebratory pops.

### 5.7 Module slots (VennQuest)

**World accents** are the zip's ten defaults, assigned in order (no new colours):

| World | Accent |
|---|---|
| 0 — Meet the Testers | `#FFD700` |
| 1 — Inside and Outside | `#FF6F61` |
| 2 — Two Circles, Four Zones | `#4CAF50` |
| 3 — The Overlap Zone | `#AB47BC` |
| 4 — Count It Once | `#29B6F6` |
| 5 — Nested and Apart | `#EC407A` |
| 6 — Fill from the Totals | `#FF9800` |
| 7 — Shade the Region | `#26A69A` |
| 8 — Three Circles | `#5C6BC0` |
| 9 — The Final Audit | `#FFC107` |

**Set tokens** reuse existing palette values: `--set-a: #29B6F6` (blue, diagonal-hatch pattern), `--set-b: #FF9800` (orange, dot pattern), `--set-c: #4CAF50` (green, crosshatch pattern). Each set is drawn as a translucent fill of its colour plus an SVG `<pattern>` and a 2 px stroke, so patterns carry the distinction independently of colour. Region labels sit on a `rgba(10,10,46,.75)` backing pill so text stays legible over the patterns (contrast against `#0a0a2e` is met by the white label text on the pill).

## 6. Home Screen

Replaces the zip's `IntroScreen` (which stacks the five phases as a 3 + 2 grid, adds a description paragraph, and uses stacked bottom cards). The header is not shown on this screen.

### 6.1 Structure (top to bottom, centred column)
1. **Top chip** — `✨ Curriculum · {{TOPIC}} {{GRADE}}`.
2. **Title** — two words: `{{Topic word}}` in orange `#ff9f43` and `Quest` in white, 900 weight, text-shadow `2px 2px 0 rgba(0,0,0,.25)`.
3. **Subtitle** — one line of gold `#feca57` text naming what the student will master.
4. **Mascot row** — round mascot avatar + white speech bubble (one to two lines; key formula or term in orange).
5. **Journey card** — heading `YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START`, then **all five phases in one row** joined by `→` arrows: icon circle, **phase name**, and a short two-line descriptor.
6. **CTA** — `🚀 Begin Your Journey!`.
7. **Three info chips** — for example `🎯 100 Questions`, a topic chip, `✨ Badges & XP`.
There is **no description paragraph** (the zip's `.intro-desc` is removed).

### 6.2 Measurements at 1366 × 681 *(measured, ±3 px)*

| Element | Box / size | Style |
|---|---|---|
| Top chip | x 458–908 (≈ 450 w), y 55–88 (≈ 33 h) | text ≈ 15 px / 800 white; fill ≈ `rgba(255,255,255,.16)`; border `1px rgba(255,255,255,.22)`; pill |
| Title | centred; cap-height ≈ 40 px; y ≈ 136–181 | `clamp(2.4rem,4.8vw,3.8rem)`, 900 |
| Subtitle | centred, y ≈ 188–205 | ≈ 18 px / 800, `#feca57` |
| Mascot avatar | ≈ 48 px circle (x 294–341) | `radial-gradient(circle,#ffd54f,#ff9f43)`, border `2.5px rgba(255,255,255,.35)` |
| Speech bubble | x 353–1073 (≈ 720 w), y 253–311 (≈ 58 h), 2 lines | white, radius ≈ 20, text ≈ 15 px / 800 `#2b2b2b`, left tail 8 × 10 px; row gap ≈ 12 |
| Journey card | x 253–1113 (**≈ 860 w**), y 354–477 (≈ 123 h) | `rgba(30,30,65,.65)`, border `1px rgba(255,255,255,.14)`, radius 20, blur 14 |
| Journey heading | y ≈ 374 | ≈ 13 px / 900, `#feca57`, letter-spacing 1 px, uppercase |
| Journey items | row centre y ≈ 430; **item pitch ≈ 173 px** | icon circle ≈ 36 px (`radial-gradient(circle,rgba(93,63,211,.4),rgba(50,30,90,.8))`, border `1.5px rgba(130,100,240,.35)`); name ≈ 15 px / 800 white; descriptor ≈ 12 px `#a4b0be` |
| Arrows | between items | `→`, `rgba(255,255,255,.25)`, ≈ 20 px |
| CTA | x 547–819 (≈ 272 w), y 520–577 (≈ 57 h) | amber gradient `#fbb03b → #f59e0b`, text `#18181b` ≈ 19 px / 800, radius ≈ 18 (rounded rectangle, **not** a full pill), glow `0 6px 20px rgba(245,158,11,.4)` |
| Info chips | y 585–624 (≈ 39 h), widths ≈ 145 / 161 / 139 (content-sized), gap ≈ 13 | pill, fill ≈ `rgba(30,30,60,.6)`, border `1px rgba(255,255,255,.1)`, icon ≈ 17 px + label ≈ 14 px / 800 `#d1d8e0`, in one row |
| Vertical rhythm | chip top 55 → last chip bottom 624 | **no scroll at 1366 × 681** |
| Page background | radial gradient, centre ≈ `#1b1143`, corners ≈ `#09051c` | `radial-gradient(ellipse at 50% 40%, #1b1143 0%, #09051c 100%)` *(approximate)* |

### 6.3 Reference CSS (adapt the zip's `IntroScreen.css`)
```css
.intro-wrap { background: radial-gradient(ellipse at 50% 40%, #1b1143 0%, #09051c 100%);
  align-items:center; padding:24px 16px 40px; overflow-y:auto; min-height:100%; font-family:'Fredoka','Quicksand',sans-serif; }
.journey-card { max-width:860px; width:100%; padding:16px 26px; border-radius:20px; }
.journey-steps-container { display:flex; align-items:center; justify-content:space-between; width:100%; gap:0; }
.journey-step-item { flex:1 1 0; min-width:0; display:flex; align-items:center; justify-content:center; gap:10px; }
.journey-item-title { white-space:nowrap; font-size:clamp(.72rem,1.1vw,1.05rem); font-weight:800; }   /* names never wrap */
.journey-item-desc  { font-size:clamp(.66rem,.9vw,.8rem); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.journey-arrow { flex:0 0 auto; }
.intro-cta-main { border-radius:18px; padding:16px 44px; font-size:1.2rem;
  background:linear-gradient(180deg,#fbb03b,#f59e0b); color:#18181b; }
.intro-bottom-cards { display:flex; gap:13px; justify-content:center; flex-wrap:wrap; }
.bottom-card { flex-direction:row; width:auto; border-radius:999px; padding:9px 16px; gap:8px; }
```

### 6.4 One-line phase names (S1) and mobile behaviour
- The five **names** (`Wonder`, `Story`, `Simulate`, `Practice`, `Reflect`) are `white-space: nowrap` and never truncated at any width from 320 px up. Descriptors are **at most ≈ 22 characters**, line-clamped to two lines, and every item has the same height so the row stays aligned.
- **≥ 641 px:** one row, icon beside text, arrows visible.
- **≤ 640 px:** one row; each item stacks **icon above name**; arrows and descriptors are hidden; names scale with `clamp(10.5px, 3.2vw, 15px)`; icon circle 28 px.
- **≤ 380 px:** page padding 12 px, card padding 8 px, item gap 0 (so the longest name, "Simulate", fits about 56 px per item at 320 px); below 340 px icons may be hidden to protect the names.
- The heading, CTA, and chips keep their order; the page scrolls vertically (`overflow-y:auto`) when the viewport is shorter than the content.

### 6.5 Screenshot defects not to reproduce
In screenshot 1 the `Simulate` descriptor wraps to **three lines** and misaligns the row; the intended behaviour is the line-clamped, equal-height items above.

### 6.6 VennQuest copy slots
Chip `✨ Curriculum · Venn Diagrams Grade 8`; title **Venn** (orange `#ff9f43`) + **Quest** (white); subtitle "Count overlapping groups without counting anyone twice"; bubble "Some testers play **both** games. Count the overlap **once**: **n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**" (formula in orange); descriptors "Where does Zoe go?" (18), "A messy survey" (14), "4 interactive labs" (18), "10 worlds & bosses" (18), "Review & scorecard" (18), all ≤ 22 characters; info chips `🎯 100 Questions`, `⭕ Two & Three Sets`, `✨ Badges & XP`.

## 7. Practice Phase — World Map

Replaces the zip's map screen (`🗺️ Money Worlds Kingdom` card, `KingdomMap` 5-column cards with icon / "World n" / name / status, and "Enter … / Challenge Boss / Jump to Reflect" buttons). The **question screen, feedback overlay, and boss modal remain exactly as in the zip (§5.4)**. The header is the zip's (§5.3).

### 7.1 Structure
- **Card** — one glass card, title row, a 5 × 2 world grid, and a button row.
- **Title row** — left: `{{Topic}} Game Worlds` (mint green) over the subtitle `10 Themed Worlds · Need 4/10 Correct to Unlock Next World`; right: a **star pill** `⭐ {stars} / 30`.
- **Accent line** — a short centred teal bar at the card's top edge.
- **World cards** — each shows: `W{n}` badge (top-left), `Q{a}–{b}` range (top-right), centred **icon** (🔒 when locked), **world name**, and a status line: `Play →` (current), `Locked`, `Ready`, or stars + `n/10` (completed).
- **Buttons** — `👑 Boss Battle: {current world's boss}` and `📓 Jump to Reflect Phase →`, centred under the grid. Clicking the current world card enters it (there is no separate "Enter" button).

### 7.2 Measurements at 1361 × 654 *(measured, ±3 px)*

| Element | Box / size | Style |
|---|---|---|
| Card | x 209–1157 (**≈ 948 w**), y 131–593 (≈ 462 h), centred | fill ≈ `#131432`, border ≈ `#262745` (`1px`), radius ≈ 22 |
| Accent line | ≈ 65 × 3 px at card top + 20, centred | mint `#08bd88` → bright mint, radius pill |
| Title | left padding ≈ 25 from card edge; baseline ≈ y 184 | Fredoka 900, ≈ 24 px, `#1fda96` |
| Subtitle | y ≈ 211 | ≈ 14 px / 700, `#a4a8c5` |
| Star pill | x 1037–1132 (≈ 95 × 34), right-aligned in the title row | fill ≈ `#0c0d21`, star `#fdcb38`, text ≈ 14 px / 800 `#eeefff`, pill |
| World grid | y 239–521; **5 columns × 2 rows**; column gap ≈ 13, row gap ≈ 14 | — |
| World card | ≈ 134 h; padding ≈ 10 × 12; radius ≈ 14 | locked fill ≈ `#181736`, border `1px rgba(255,255,255,.08–.1)`, content at ≈ 55–60 % opacity |
| `W{n}` badge | ≈ 28 × 18, top-left | fill ≈ `#201f3e`, text ≈ 11–12 px / 800 `#edeeff` |
| `Q` range | top-right | ≈ 11–12 px / 800 sky `≈ #3bb0e8` (current card: mint) |
| Icon | centred, ≈ 28 px | 🔒 for locked |
| World name | centred | ≈ 14 px / 800 `≈ #d3d0ed`, single line (2-line clamp on narrow cards) |
| Status | below name | ≈ 12 px; `Locked` muted `≈ #6c6f93`; `Play →` mint `#18cb89` / 800 |
| **Current** card | — | border `1.5px` mint (`≈ #1fda96`), fill ≈ `#101532`, `Play →` in mint |
| Buttons | y 538–569 (≈ 32 h), gap ≈ 12, centred; grid-to-button gap ≈ 17 | pills; Boss: gold text `#f3c563`, border `rgba(255,193,7,.5)`; Reflect: grey text `#a8aec8`, border `rgba(255,255,255,.12)`; both fill ≈ `#22223e`, ≈ 13 px / 800 |
| Page background | flat `#0a0a2e` + FloatingNumbers | — |

Colours are JPEG-sampled; if the original source of this screen is available, copy its exact hex values.

### 7.3 Reference CSS
```css
.play-map-card { width:100%; max-width:950px; padding:24px 25px; border-radius:22px;
  background:#131432; border:1px solid #262745; position:relative; }
.play-map-card::before { content:''; position:absolute; top:20px; left:50%; transform:translateX(-50%);
  width:65px; height:3px; border-radius:999px; background:#08bd88; }
.play-map-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-top:22px; }
.play-map-title { font-family:var(--font-display); font-weight:900; font-size:1.5rem; color:#1fda96; }
.play-map-sub   { font-size:.9rem; font-weight:700; color:#a4a8c5; }
.play-star-pill { background:#0c0d21; border-radius:999px; padding:7px 16px; font-weight:800; font-size:.9rem; }
.world-grid { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:14px 13px; margin-top:16px; }
.world-card { height:134px; padding:10px 12px; border-radius:14px; background:#181736;
  border:1px solid rgba(255,255,255,.09); display:flex; flex-direction:column; align-items:center; text-align:center; }
.world-card.locked  { opacity:.6; cursor:not-allowed; }
.world-card.current { border:1.5px solid #1fda96; background:#101532; }
.world-actions { display:flex; gap:12px; justify-content:center; margin-top:17px; flex-wrap:wrap; }
```
Below 768 px use the zip's responsive grid: **3 columns ≤ 768, 2 columns ≤ 480**, cards auto height.

### 7.4 Behaviour shown by the screenshot
- **Unlock rule:** world *n + 1* unlocks when the student scores **at least 4 of 10** in world *n* (the rule printed in the subtitle); completed worlds show their stars. This is new relative to the zip (which advances regardless of score), so the reducer needs: a per-world `unlocked` flag, a **replay** path when the score is below 4 (the world's questions are **regenerated**, not repeated, §1.7), and a unit test for the threshold.
- **Stars:** `0–30` total, 3 per world from the zip's `calcStars` (≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1).
- **Boss button** targets the **current** world's boss; **Jump to Reflect Phase** dispatches `SET_PHASE: reflect`.

### 7.5 Screenshot defects not to reproduce
In screenshot 2 the five columns are **unequal** (≈ 151–192 px) and the fifth column touches the card's right edge with no padding, and the Home button at top-left is partly clipped. The spec above uses **equal columns (`minmax(0,1fr)`) with the card's full padding**, and the zip's Home button (§5.3). The header pill in the screenshot is also more compact (≈ 37 px tall versus ≈ 46 px in the zip); **the zip's header is kept for all phases** (see PRD §15).

### 7.6 VennQuest copy slots
Card title `Venn Diagram Game Worlds`; world icons, names, and ranges from §4.1 (W1 👥 Meet the Testers `Q1–10` … W10 🏁 The Final Audit `Q91–100`); the Boss button reads `👑 Boss Battle: {current world's boss}` from `WORLDS[i].boss.name`.

## 8. Reflect Phase — Stepped (S2)

The zip's Reflect puts a three-question quiz, a journal with quick-insert chips, stat pills, and a submit button on one screen, then shows a trophy card. S2 splits it into a short stepped flow that **reuses the zip's classes, colours, and sizes** (`.reflect-card`, `.reflect-badge`, `.reflect-title`, `.reflect-quiz-container`, `.reflect-opt-btn`, `.reflect-journal`, `.quick-insert-btn`, `.trophy-card`).

| Step | Content | Zip elements reused |
|---|---|---|
| 1 · Quick check (3 screens, one prompt each) | One prompt and a **direct-answer interaction** (tap a region/part of the module's visual; for non-visual topics, at most three `reflect-opt-btn` options) | `reflect-badge` ("📓 Learning Reflection & Scorecard"), `reflect-title`, `reflect-quiz-container` |
| 2 · Think it over | One reflection prompt, quick-insert chips, textarea | `reflect-journal`, `quick-insert-btn`, `reflect-textarea` |
| 3 · Scorecard | Three stat tiles (correct / XP / best streak), one line `⭐ {stars} / 30`, a closed "Badges unlocked (n)" disclosure, **Play Again** and **Home** | `trophy-card`, `trophy-stat`, `badge-list` (inside the disclosure), `btn btn-primary`, `btn btn-outline` |

Rules (each tested in §12.7):
- Card max-width 760 (trophy 620), padding `clamp(20px,3.5vw,32px)`, gap 18 — unchanged from the zip. The mascot is `sm` (48 px) and is hidden when the viewport height is under 600 px.
- A **sticky bottom action bar** (Back / Next, min-height 52, safe-area padding) sits inside `.reflect-wrap`; a "Step n of 3" indicator uses the zip's story-dot style (12 px dots, active 28 px).
- At most **five** interactive controls per step; body text ≥ 16 px; targets ≥ 48 × 48; **no nested scroll** — steps 1 and 2 fit 360 × 640 without scrolling.
- The zip's 30-star staggered pop is replaced by one summary line; the star celebration is a single short animation (none under reduced motion).
- Focus moves to each step heading; changes are announced via `aria-live="polite"`.
- **Reflect is reachable in one tap**: always enabled in the header nav once Practice has started, plus the **Jump to Reflect Phase →** button on the world map (§7) and a "Go to Reflect Phase" button on the Practice-complete card (as in the zip).
- Order of steps follows the zip's flow (concept check → journal → trophy).

### Module content — VennQuest
State machine in `ReflectStepper`: `recap-1 → recap-2 → recap-3 → prompt → scorecard → done` (quick check, think it over, scorecard). The indicator reads "Step 1 of 3" across the three recap screens, with "Question n of 3" as a small secondary label.

- **Recap prompts** (`ReflectRecap`, a two-set `VennCanvas` in `tap-region` mode, built from fixed seeds through `vennMath.js`): (1) double-counting: "Jack added 20 + 22 for Racing and Puzzle. Tap the zone he counted twice." → both; (2) forgetting the outside: "The zones add up to 34, but 40 testers were surveyed. Tap the zone that is missing." → neither; (3) "and" versus "or": "Tap every zone where a tester played Racing **or** Puzzle (or both)." → only Racing, both, only Puzzle.
- **Check/Next:** one primary button that reads **Check** until the answer has been checked, then **Next**; a wrong answer shows a short plain-language reason and allows one more try, then reveals the answer. A "Skip to scorecard" text button is always available.
- **Think it over** (`ReflectPrompt`): "Which survey made you stop and recount, and what did you miss the first time?" with three quick-insert chips ("I counted someone twice", "I forgot the outside", "I mixed up and / or") and an optional text box.
- **Scorecard** (`ReflectScorecard`): three tiles (correct / XP / best streak), the line `⭐ {stars} / 30`, a closed "Badges unlocked (n)" disclosure, **Play Again** and **Home**.
- **Composite controls:** the region diagram is one `role="group"` with a roving tabindex (single tab stop, arrow-key navigation, each region hit-zone ≥ 48 × 48 px); the chips are one `role="toolbar"`. Each counts as **one** control in the five-control budget (§12.7). Step 1 = diagram + Back + Check/Next + Skip (4); Step 2 = chips + text box + Back + Next (4); Step 3 = disclosure + Play Again + Home + Back (4).

## 9. Responsive System (S3)

Principle: **desktop (≥ 1024 px) is pixel-identical to the zip/screenshot specs above; mobile adaptations extend the zip's own 768 / 540 / 480 rules and add only what is listed here.** Verified from 320 × 568 to 1920 × 1080, portrait and landscape.

1. **Heights:** `100dvh` everywhere (§1.4); safe-area insets on the header, sticky action bars, and Home page bottom.
2. **Header:** unchanged from the zip (labels hidden ≤ 768; Home text hidden ≤ 540).
3. **Home:** §6.4.
4. **Map grid:** 5 / 3 (≤ 768) / 2 (≤ 480) columns.
5. **Stations:** the zip's `1fr 1fr` grid collapses to one column at ≤ 768. A station whose visual needs width may set a module-level `data-stack-below="1024"` (documented in the module TRD); the visual goes **on top**, controls below. In phone landscape (height < 500) controls move to a collapsible side panel.
6. **Touch:** `touch-action: manipulation` on buttons/steppers; `touch-action: none` **only** on draggable elements; targets ≥ 48 × 48 (the zip's 44 px minimum for `.btn` is raised to 48 for in-station controls; early-grade modules use the PRD's grade-band guide).
7. **Drag** uses Pointer Events with tap-to-select-then-tap and keyboard equivalents (§10).
8. **Visual scale:** SVG visuals scale to container width and enforce a minimum rendered label size of 12 px (`useVisualScale`).
9. **No horizontal overflow** at any width; long labels wrap or scale.
10. ⚠ **Viewport meta:** remove `maximum-scale=1.0, user-scalable=no` (§1.6) — pending sign-off.

### Module settings — VennQuest
All four stations set `data-stack-below="1024"` (the diagram needs width): diagram on top, controls below. `useVennScale` implements the blueprint's `useVisualScale` with a 12 px minimum label size. `touch-action: none` is on tokens and on the Overlap Lab's circle handles only. The 5 / 3 / 2 map grid and all other rules are unchanged.

## 10. Simulate Stations (S4)

**Shell:** exactly the zip's `SimulatePhase` — `sim-card`, tab bar (station name + icon, ✅ when done, locked until the previous is complete), station area, footer (← Previous Station / progress dots / Next Station →, which becomes "Practice! 🎮" once the last station is complete). **Station skeleton:** `station-wrap` → `station-header` (title + target box) → `station-grid-2col` (`station-col-left` / `-right`) → `station-guide-card` → `station-actions`; completion shows `station-success`.

**Hard rules (enforced in §12.9):** no multiple-choice option component or quiz renderer inside `components/simulations/`; the **Concept Discovery Lab** has no questions, scoring, timer, or confirmation question (exploration-flag completion); every station responds to manipulation with live, meaningful motion; every interaction has touch / mouse / keyboard equivalents; interaction types and numbers follow the PRD's grade-band guide.

**Drag primitive:** `usePointerDrag` (Pointer Events, pointer capture, 6 px threshold, `touchAction:'none'` on draggable items only). Required equivalents: tap-to-select-then-tap, and keyboard (Enter/Space pick up, arrows cycle targets, Enter drop, Esc cancel) with a polite live region. Animation: Framer Motion springs ≈ 350 ms; fades 150–200 ms; **reduced-motion** → instant moves with a brief fade.

**Archetypes** (the zip's four stations map as: *Coin Register* → Build-to-Target, *Market Scanner* → Composite, *Change Maker* → Composite, *Receipt Detective* → Error-Detective; the zip has no free-play lab, which v2+ adds as the first station): **Concept Discovery Lab** (free-play), **Build-to-Target**, **Multi-Step/Composite**, **Error-Detective** (locate the fault by tapping the exact place, then repair by manipulation).

| Component | Archetype | Student manipulates | Live animated feedback | Completion gate |
|---|---|---|---|---|
| `TheOverlapLab.jsx` | Concept Discovery Lab (**pure free-play**) | **Drags circle B** (and A, in three-set mode) by its handle to change overlap; taps a token to open two toggle chips ("plays A", "plays B") and flip membership; taps region chips (A only, B only, A ∩ B, A ∪ B, A′, outside); presses "Count it"; toggles the third circle | Tokens glide into the correct region as circles move or memberships change; counters n(A), n(B), n(A ∩ B), n(A ∪ B), n(outside) tick; the tapped region glows and its tokens pulse; "Count it" flashes circle A, then circle B, with the overlap flashing twice, then subtracts it once to land on n(A ∪ B) (driven by `inclusionExclusionTrace`); dragging circles apart shows the **disjoint** case and dragging one inside the other shows the **subset** case, each with a plain-language caption | Exploration flags only, **no confirmation question**: overlap changed through partial, disjoint, and subset; at least 5 membership flips; every region chip used once; "Count it" run once; third circle toggled once |
| `ShadeTheTarget.jsx` | Build-to-Target Challenge | Taps or paints regions of the diagram to shade them, to match a **set expression card** (A′, A ∩ B′, A′ ∩ B, A ∪ B, (A ∪ B)′, and one three-set expression) | Tokens inside the student's shaded regions light up; tokens satisfying the target expression (from `exprRegions`) show a dashed outline; when the lit and outlined sets match exactly, the target **locks** with a success animation; a mismatch pulses the first token that disagrees, as a visual hint | All six rounds locked; free retries; no scoring |
| `FillTheDiagram.jsx` | Multi-Step/Composite Construction | Four chained steps on one totals-only survey, via steppers: (1) set the overlap, (2) confirm the "only" regions, (3) set the outside count, (4) run the sum check; three-set rounds enforce **inside-out order** (centre, then pair-only zones, then single-only zones, then outside) | A live bar shows "does n(A) still add up?"; changing the overlap animates the "only A" and "only B" regions refilling by subtraction (from `solveFromTotals`); the sum check drops tokens into the regions and compares against n(ξ); `verifyDiagram` highlights exactly which total or region disagrees | All four rounds (two two-set, two three-set) completed in the enforced order |
| `AuditTheAnalyst.jsx` | Error-Detective | Plays, pauses, and steps an **animated replay** of a rival analyst's counting; **taps the exact region or number that is wrong**; then **repairs it** by editing the count or dragging tokens to the right region | The replay shows tokens being placed and totals accumulating; a wrong tap shakes and explains in plain language which rule was missed; a correct repair re-runs the sum check; flawed diagrams come from `seedErrorInDiagram` (never hand-authored), each round seeded with a different misconception | All four rounds located **and** repaired |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION` / `ADVANCE_SIM_STATION` gating (capped at 4 stations) are reused from the zip. All four stations set `data-stack-below="1024"` (§9). Instruction text stays at about 25 words per instruction and targets at 48 px (lower-secondary band, PRD Appendix A).

## 11. Gamification and Audio

**Gamification:** `calcXP(attempts, hints, streak)` — base 12 / 8 / 5 by attempt, −2 per hint, +5 at streak ≥ 3, +10 at ≥ 5, floor 2; `calcStars` ≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1; 8 badge triggers in `badgeEngine.js` (first correct; streak 5; streak 10; all stations; a 3-star world; boss defeated; 20+ answered; full journey) — only the `BADGES` display strings change. Practice modes: Guided (5Q), Independent (10Q), Timed (8Q / 60 s), Boss (5Q / 3 lives).

**Audio:** ElevenLabs only, **Alice**, voice ID `Xb7hH8MSUJpSbSDYk0k2`, model `eleven_multilingual_v2`, no browser TTS fallback (missing clip + no key → silent). Pre-generated settings (`generate_audio.js`): statement/instruction `0.65 / 0.80 / 0.30`, question `0.55 / 0.75 / 0.50`, encouragement `0.50 / 0.85 / 0.60`, emphasis `0.75 / 0.90 / 0.20`, thinking `0.70 / 0.78 / 0.40`, celebration `0.45 / 0.85 / 0.80` (stability / similarity / style; speaker boost on) — **six distinct presets**. **Use this one table for runtime dynamic narration too** (§1.8). Every question and hint is narrated (dynamic path cached by text hash for procedural content); Wonder narration auto-starts after **Begin Your Journey**; the audio toggle is in the header beside the phase pill (§5.3). Character names and terms follow §4.4.

### Module content — VennQuest
- **Badges** (`BADGES` display strings only, per PRD §10): First Data Point, Clean Count, Overlap Streak, Full Lab Kit, Report Approved, Bug Squashed, Dedicated Analyst, Master Analyst Badge.
- **Narration rewrite:** `utils/narration.js` function bodies (signatures unchanged) and `scripts/generate_audio.js`'s `phrases` array follow PRD §11: every symbol paired with its plain-language meaning on first use per world (∩ = "and", ∪ = "or, or both", ′ = "not in", n( ) = "the number of elements in", ξ = "the universal set"); regions named by what they contain; the double-count called "counted twice" and the fix "subtract the overlap once"; hints open with the first thing to place.
- **Dynamic narration for procedural content:** every question text and hint goes through the dynamic ElevenLabs path, cached by a hash of the exact text, using the **same six presets** as the pre-generated clips. Question templates emit **narration-safe strings** (for example "A ∩ B" carries the spoken form "A intersection B, the testers in A and B").
- **Station live announcements** (token moves, count changes) use the screen-reader live region and are voiced only when the audio toggle is on.
- After content lock: `npm run generate-audio`, then `npm run clean-audio`. Names are checked by ear (§4.4).

## 12. Build, QA, and Delivery

1. **Question-bank stress test** (≥ 300 runs, 30,000 questions) — no duplicates/`NaN`; module invariants hold.
2. **Independent-oracle audit** — a separate solver (no shared code with the generator) recomputes every answer.
3. **Distractor-provenance audit** — every distractor/seeded error has a registered `misconceptionId`.
4. **Degenerate-case audit.**
5. **Module-specific audit** — token-placement audit, expression-region audit, Story-literal unit test, and replay-regeneration test (detail below the list).
6. **S1 Home-screen test (Playwright)** — at 320, 340, 360, 375, 390, 412, 600, 640, 768, 1024, 1280, 1366, 1440, 1920: the five `.journey-item-title` elements each render on one line (`getClientRects().length === 1`), share a top offset (±1 px) at ≥ 641 px (and at ≤ 640 px), do not overflow their box, use no ellipsis, and the page has no horizontal overflow. Real fonts loaded.
7. **S2 Reflect test** — 360 × 640, 390 × 844, 768 × 1024, 1280 × 800: steps 1–2 fit without scrolling at 360 × 640; ≤ 5 controls per step; controls ≥ 48 × 48; body ≥ 16 px; no overlaps; focus lands on each step heading; Reflect reachable in one tap.
8. **S3 device matrix** — 320×568, 360×640, 390×844, 412×915, 768×1024, 1024×768, 844×390, 1280×800, 1366×681, 1920×1080: full journey, no horizontal overflow, no clipped controls; every station completed **touch-only**, **mouse-only**, and **keyboard-only**.
9. **S4 interactivity audit** — lint/grep fails the build if `components/simulations/` imports the option component or quiz renderer; walkthrough confirms manipulation-driven stations and a question-free Concept Discovery Lab.
10. **Layout-anchor fidelity test (Home and Practice map)** — at 1366 × 681 (Home) and 1361 × 654 (Practice), assert bounding boxes against §6.2 / §7.2 within ±4 px: chip, title, bubble, journey card (≈ 860 w), CTA (≈ 272 × 57), chips row; map card (≈ 948 w), grid (5 equal columns), buttons row. Store the two reference screenshots under `tests/reference/` for manual comparison.
11. **Token-parity test** — computed styles of `body`, `.glass-card`, `.btn-primary`, `.sim-tab.active`, `.progress-bar-pill`, `.reflect-card` equal the zip's values (§5.1, §5.3, §5.4); no `var(--…)` used in CSS that is not defined (a script greps all `var(--x)` against `:root`).
12. **Reduced-motion and performance** — no springs under `prefers-reduced-motion`; ≈ 50 fps or better for the heaviest drag under 4× CPU throttle.
13. **Audio parity** — every narrated string has an `audioMap` entry or is intentionally dynamic; runtime voice settings equal the pre-generated table (§1.8).
14. **Full-journey walkthrough** — Home → Wonder → Story → Simulate (4 stations) → Practice (map, unlock rule, all 4 modes, 10 bosses, badges) → Reflect (3 steps) — zero console errors.
15. **Production build** — `npm install && npm run build` from a clean extract.
16. **Accessibility** — axe-core: no serious/critical issues; non-colour cues; announcements; focus visible.
17. **Delivery** — zip excludes `node_modules/`, `dist/`; 4 story placeholders + art-brief README; branding cleaned (§1.10, §1.12); `.env.local.example` documents `VITE_ELEVENLABS_API_KEY`.
18. **Locale-neutrality audit (G1)** — `scripts/locale_audit.mjs` fails the build if any file under `src/`, `public/`, `index.html`, `README.md`, or the audio `phrases` array contains a term from the module's **deny-list** (default seed: `Singapore`, `Singaporean`, `MOE`, `HDB`, `CCA`, `S$`, `SGD`, `Singlish`, patterns such as `Secondary [0-9]`, `Primary [0-9]`, `Sec [0-9]`, `Year [0-9]`, `Class [0-9]`, the sibling module's character and mascot names, and any other country, city, currency, or brand term the module should not carry). It also verifies that every name in `characters.config.js` and in the background-name pool is on the module's English first-name list, and that learner-facing level labels are Intellia grade labels only. Framework names are allowed in PRD/TRD files, never in `src/`.

### Module detail for §12
- **§12.1 stress test:** ≥ 300 generations (30,000 questions) across all 10 concept categories and all five content areas; no duplicate options, no `NaN` / `undefined`, all counts non-negative integers, `total ≤ 60`, every diagram's regions sum to n(ξ).
- **§12.2 independent oracle (highest-stakes check):** `scripts/stress_test.mjs` rebuilds each survey as **explicit lists of element IDs with real JavaScript `Set` operations** (union, intersection, difference) and recomputes every asked quantity, sharing no code with `vennMath.js`'s region arithmetic. Every labelled correct answer must match in all 30,000 questions, and every `exprRegions` result must match membership evaluated element by element.
- **§12.4 degenerate cases:** zero regions appear only in `subset` and `disjoint` shapes.
- **§12.5 module audits:**
  - *Token placement:* for 200 random circle geometries and surveys, every token's slot lies inside its own region (via `maskAt`), no two tokens overlap, and per-region token counts equal `counts[mask]`.
  - *Expression regions:* each supported expression's `exprRegions` equals the oracle's element-by-element evaluation.
  - *Story literals:* the Story numbers in §4.2 equal `vennMath.js` outputs.
  - *Replay regeneration:* two attempts at the same world with different `attemptSeed` values produce different question sets, and a score below 4 keeps the next world locked (§7.4).
- **§12.6 Home test:** the five `.journey-item-title` elements, plus a check that each descriptor is ≤ 22 characters.
- **§12.7 Reflect test:** composite controls (diagram, chip toolbar) count as one control each (single tab stop, roving tabindex); every region hit-zone and chip is ≥ 48 × 48 px; the primary button is a single element whose label changes from Check to Next.
- **§12.18 locale audit (M1, M2, G1):** deny-list = blueprint default seed plus the §4.4 additions; the name check reads `characters.config.js` and `namePool.js`; framework names (Singapore, England, Common Core, NCERT, Cambridge) must not appear anywhere under `src/`, `public/`, `README.md`, or the audio phrases.

## 13. Risks

- **Screenshot-derived values are approximate** (JPEG). Treat colours and sizes in §6.2 / §7.2 as ±6 channel / ±3 px, and replace them with exact source values if the original CSS becomes available.
- **Divergence between the two image-driven screens and the zip** (home layout, map layout, header size, audio toggle position). Keep the §10/§11 fidelity tests in CI so later edits don't quietly drift either way.
- **Undefined tokens** reappearing if a module re-clones `design-tokens.css` without the five appended tokens (§5.1); the token-parity test catches it.
- **Home-screen one-line guarantee** depends on font metrics; run §12.6 with the real font after any label or font change.
- **Unlock-rule change** (≥ 4 / 10) alters progression for every module; confirm before shipping (PRD §15).
- **Reflect creep** — enforce the per-step budget (§8) via §12.7.
- **Pointer/scroll conflicts** from `touch-action:none`; keep it on draggable items only.
- **Animation drifting from data** — one source of truth (§4.3) and the module-specific audit.
- **Static-station regression** — §12.9.
- **Locale leakage (G1)** — cloned content (names, currency, school terms) quietly reappears in stories, questions, narration, or audio; the deny-list audit (§12.18) must run in CI, and the deny-list must be updated whenever a new sibling is used as a clone source.
- **Small-region hit targets.** A thin overlap on a 320 px screen can be narrower than a fingertip. Enlarged hit-zones (§14.1) and the tap-to-select-then-tap method are the mitigation; verify in the touch-only run.
- **Token animation drifting from the data.** Tokens that animate to a slot outside their region, or counters that disagree with token positions, undermine the module's core teaching. The single `counts[mask]` source and the token-placement audit (§12.5) are the guardrails.
- **Composite-control interpretation (S2).** The Reflect budget counts the region diagram and the chip toolbar as one control each (PRD §8.5). If that reading is rejected, Step 1 exceeds five controls and the recap must drop to single-region prompts with larger, fewer targets.
- **Scope creep into probability or formal set algebra.** Both are natural next steps and are excluded (PRD §3, §15.5); resolve the grade-placement question (PRD §15.1) before any expansion.
- **Grade placement.** Formal sets sit at upper secondary in most frameworks checked; Grade 8 is an early placement with capped scope everywhere except England KS3. If the target markets change, the three-set world and the notation depth are the parts to revisit.
- **Mascot and character collision.** Check Jack, Emma, and Pixel the Penguin against the full sibling registry before locking them (PRD §15.3).

## 14. Module Component Specs (VennQuest)

### 14.1 `VennCanvas.jsx` and `utils/vennGeometry.js`
`VennCanvas` takes `{ descriptor, mode, onRegionTap, highlightMasks, shadeMasks, compact }` and renders an SVG (`viewBox` 640×400 for two sets, 640×480 for three, `width: 100%`, height from aspect ratio). It always draws the **ξ rectangle** and labels every region with its count or "?" (PRD §3). Sets use the fixed set tokens, fill patterns, and strokes from §5.7.

`vennGeometry.js` is the only place geometry lives: circle centres and radii from an `overlap` parameter, `maskAt(x, y)` (point-in-circle bits), `regionAnchor(mask)` (label position by sampled centroid), and `hitTest(x, y)` for taps. The question visuals, the Lab's draggable circles, the token layout, and the shading hit-zones all call it. Region hit-zones are enlarged to a minimum 48 CSS-px target where regions are small.

`mode` values: `"display"` (questions), `"tap-region"` (Reflect recap, Audit the Analyst), `"paint"` (Shade the Target), `"edit-counts"` (Fill the Diagram), `"free"` (Overlap Lab, draggable circles; Wonder, circles fixed).

### 14.2 `TokenCrowd.jsx`, `utils/tokenLayout.js`, `hooks/usePointerDrag.js`
- **Tokens** are small avatar discs (named, for screen readers) positioned inside `VennCanvas`. `tokenLayout(counts, geometry, tokenSize)` returns a deterministic slot for each token **inside its region** (hex-grid sampling inside the region mask, spaced at least one token diameter apart, ordered by token id so tokens keep similar slots as circles move). Cap: 48 tokens per diagram; stations stay ≤ 40.
- **Animation:** Framer Motion springs (about 350 ms to settle); count numbers tick; region highlights fade in over 150–200 ms. Under `prefers-reduced-motion`, positions change instantly with a short opacity fade and no spring.
- **Drag:** `usePointerDrag` (blueprint Appendix A.1) uses Pointer Events with pointer capture, a 6 px threshold, and `touch-action: none` on tokens and circle handles only. A drop calls `hitTest`; a drop elsewhere returns the token with a short bounce.
- **Equivalent inputs (required):** (1) tap-to-select, then tap a region; (2) keyboard: tokens are focusable buttons whose label gives name, memberships, and current region; Enter/Space picks up, arrow keys cycle the target region, Enter drops, Esc cancels. A polite live region announces every move ("Zoe moved to both. n(Racing) is now 21").

### 14.3 Reflect components
`ReflectStepper` owns the state machine (§8 module content) and moves focus to each step heading (`tabIndex={-1}`); `ReflectRecap` wraps `VennCanvas` in the composite group; `ReflectPrompt` holds the chip toolbar and text box; `ReflectScorecard` renders tiles, the star line, and the disclosure. Mascot `sm` (48 px), hidden when the viewport height is under 600 px; `FloatingNumbers` and full-screen confetti are not mounted.

### 14.4 `WonderPhase.jsx`
A single interactive hook screen (PRD §8.1): twelve drifting avatars and two overlapping hoops rendered through `VennCanvas` in `free` mode (circles fixed). Dragging or tapping the prompted avatar ("Zoe plays both") onto the overlap makes both hoops glow; no scoring. Narration auto-starts after **Begin Your Journey**.
