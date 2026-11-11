# VennQuest — Module PRD
**Grade 8 · Venn Diagrams**
*Produced from `Intellia_Module_Blueprint_PRD_v3.1.md`. Inputs: `{{GRADE}}` = Grade 8; `{{TOPIC}}` = Venn diagrams; `{{CURRICULUM}}` = Global (multi-framework; default comparison set, §3); `{{SPECIAL_INSTRUCTIONS}}` = M1–M2 (§6). Platform standards S1–S4 and G1 apply by default (§5, §14). Companion: `VennQuest_Grade8_TRD_v3.1.md`.*

---

## 1. Overview

VennQuest teaches students to organise and count overlapping groups using Venn diagrams. Students learn to place items into a universal set (ξ) and its subsets, read and fill the four regions of a two-set diagram (only A, both, only B, neither), tell **"and" (intersection)** from **"or" (union)**, count an overlap **once** using n(A ∪ B) = n(A) + n(B) − n(A ∩ B), use the **complement** (A′), recognise **subset** and **disjoint** cases, shade regions for set expressions, and finish with a **three-set** diagram. The module teaches by manipulation, not theory questions (S4): students drag animated "tester" tokens into circles, watch counts update live, and repair a rival analyst's flawed diagram. It is framed as a junior data-analyst team at a game studio's Playtest Lab: every world is a survey of playtesters whose answers must be organised into a report.

## 2. Background

**Position in the series:** this is the fifth Grade 8 module and the **first outside the geometry strand** that QuadQuest, ReasonQuest, CongruenceQuest, and SimilarQuest established. It is a sets / data-organisation module, so it deliberately does not extend the geometry scope map from those PRDs.

**Relationship to neighbouring modules:** earlier modules in the platform use bar models and tables to organise information (for example the Grade 7 representation module and the Grade 4 data-handling modules). Venn diagrams are the natural next organising tool for **overlapping categories**, where a table or bar model cannot show that one person belongs to two groups at once. The module deliberately stops before **probability from Venn diagrams**, a natural later companion (§15.5).

**Reuse:** reuses `G2-Money-Money-main`'s five-phase architecture per platform convention.

## 3. Standards Alignment

**Source and crosswalk.** `{{CURRICULUM}}` is *Global (multi-framework)*, so the placement check used the blueprint's default comparison set. Results:

| Framework | Level where taught | Depth / notes | Source |
|---|---|---|---|
| England National Curriculum | Key Stage 3 (ages 11–14): enumerating sets and unions/intersections of sets with tables, grids, and Venn diagrams sits in the probability strand. School schemes introduce ∪, ξ, and ′ in Year 8–9; GCSE extends. | Closest match to Grade 8: Venn diagrams plus basic notation, usually paired with probability. | [Mr Mathematics KS3 scheme](https://mr-mathematics.com/probability-outcomes-venn-diagrams/); [AQA bridging note](https://allaboutmaths-classic.aqa.org.uk/attachments/5310/ks3-4-bridging-the-gap-pocket-5-set-notation-number-lines.pdf); [a Year 9 school topic outline](https://www.sirjohnthursby.lancs.sch.uk/Topic-3-Year-9-Mathematics) |
| US Common Core | High school (Grades 9–12), standard HSS-CP.A.1: describe events as subsets of a sample space and as unions, intersections, or complements ("or", "and", "not"). | Formal set language appears at high school and is tied to probability. Informal Venn sorting at earlier grades was not checked against a specific standard. | [Common Core HSS-CP.A.1](https://thecorestandards.org/Math/Content/HSS/CP/A/1/) |
| India (NCERT / CBSE) | Class 11, Chapter 1 *Sets*: universal set, Venn diagrams, union, intersection, difference, complement, practical problems on union and intersection. | Formal and upper-secondary; includes De Morgan's laws (excluded here). | [NCERT Class 11 Sets summary](https://vedantu.com/ncert-solutions/ncert-solutions-class-11-maths-chapter-1-sets); [Allen chapter overview](https://allen.in/ncert-solutions/class-11-maths-chapter-1-sets) |
| Cambridge IGCSE Mathematics (0580) | Set notation and Venn diagrams (syllabus references C1.2 / E1.2), taught at Years 10–11 (ages 14–16). Core is limited to two sets; Extended covers two or three sets (per syllabus summaries). | Upper secondary, with notation-heavy exam questions. | [Syllabus summary E1.2](https://www.cazoommaths.com/igcse-maths-revision/cambridge-igcse-0580/e1-2/); [IGCSE notes](https://www.tutopiya.com/lesson-notes/igcse-cambridge-mathematics/set-notation-and-venn-diagrams/) |
| Singapore MOE | Secondary 4 (E-Math / G3 Math), from the school content outlines reviewed in the earlier check (Yishun Secondary, Peicai Secondary, ACS (Independent)); tuition-site claims of Secondary 2 were not relied on. | Formal *Set Language and Notation* chapter. Carried over from the previous PRD; not re-fetched in this revision. | School outlines (earlier check) |

**⚠ Grade-level scope flag.** Formal set notation and Venn-diagram counting is placed anywhere from ages 11–14 (England KS3) to upper secondary (Cambridge IGCSE, US high school, India Class 11, Singapore Secondary 4). Grade 8 (ages 13–14) is therefore an **at-level fit for England and an early/foundation placement for the other frameworks**. I relied on the school outlines and official standards above, not on tuition-site blogs. Scope is capped to what is common at or near this grade:
- **Two-set diagrams are the core** (Worlds 0–7). **Three-set diagrams appear only as a capped capstone** (World 8), with counts and regions only.
- **Notation is introduced gradually**: every concept is met first in plain words ("in both", "in at least one", "not in A"), then paired with its symbol; no world introduces more than one new symbol.
- Numbers stay small (universal set ≤ 60 in simulations) so tokens can be seen and counted.
- **Excluded as market-specific extras (bridge only, optional):** set-builder notation, De Morgan's laws and other formal set algebra, difference notation (A \ B), power sets, nested complements of three-set expressions, conditional probability, and any probability from Venn diagrams.

**In-scope skills:**
- Describing a set in words or by listing; using ∈ (is an element of), ∉ (is not an element of), and ξ (the universal set).
- Drawing a set inside a universal-set rectangle and finding its complement A′, with n(A′) = n(ξ) − n(A).
- Reading the four regions of a two-set Venn diagram and placing items into them.
- Intersection (A ∩ B, "and") and union (A ∪ B, "or, including both") in words, symbols, and counts.
- Counting a union without double-counting: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
- Recognising **subset** (A ⊂ B) and **disjoint** (A ∩ B = ∅) situations.
- Completing a two-set Venn diagram from given totals, working from the intersection outward.
- Identifying and shading the regions for A′, A ∩ B′, A′ ∩ B, and (A ∪ B)′, and counting them.
- Reading and completing a three-set Venn diagram (seven regions plus "outside"), including "exactly two" versus "at least one".

**Adjacent skills treated as bridge only, not tested here:**
- **Probability from Venn diagrams** (taught alongside sets in England and the US): a natural next module; not mentioned in the learner-facing Reflect, to keep it uncongested.
- **Formal set algebra** (set-builder notation, De Morgan's laws, algebraic manipulation of set expressions).
- **Interpreting Venn diagrams with percentages or fractions**: all quantities here are counts.

**Common misconceptions this module is designed around** (each becomes a named, generated distractor or a seeded error, TRD §4.3):
- **Double-counting the overlap** (treating n(A) + n(B) as the union).
- **Confusing "and" with "or"** (∩ with ∪).
- Treating **n(A) as "only A"** (forgetting it includes the overlap).
- **Forgetting the outside region** (items in ξ but in neither set), so the regions don't sum to n(ξ).
- Treating the **complement A′ as "the other set B"**.
- In three-set diagrams, **forgetting that n(A ∩ B) includes the centre** region, or mixing up "exactly two" with "at least two".

**Domain conventions to encode as house style:**
- Every diagram shows the **universal-set rectangle (ξ)** and labels **every region** with a count or "?". A circle drawn without its rectangle is never shown.
- Every worked example follows the same order: **read the story → name the sets → place the overlap first → fill "only" regions by subtraction → fill the outside → check that all regions sum to n(ξ)**.
- Counts always use **n( )** notation; "and" always maps to ∩ and "or" to ∪, with "or" explicitly including "both".
- Set A is always blue with a **diagonal hatch**, set B orange with **dots**, and set C green with **crosshatch**, consistent across every phase (colour is never the only cue, §12).

**Terminology and notation variants.** House style first, then variants a student may meet elsewhere:

| Idea | House style | Variants elsewhere |
|---|---|---|
| Universal set | ξ | U, E (used in some IGCSE exam questions), S, Ω |
| Complement | A′ | Aᶜ, Ā, "not A" |
| Number of elements | n(A) | \|A\|, #(A), "cardinality" |
| Subset | A ⊂ B (A inside B) | A ⊆ B where equality is allowed |
| Empty set | ∅ | { } |
| "A but not B" | A ∩ B′ | A \ B, A − B |
| Spelling | International English, British-style (organise, colour) | US spellings (organize, color) |

Narration, visuals, and distractors use the house style only; a variant is never used as a distractor.

**Locale-neutral content check (G1).** Contexts are varied and work in any country: games played, clubs joined, languages studied, transport used (walk, bike, bus, car), and music genres. No country-specific school terms, currencies, places, holidays, or brands appear in learner-facing text. All names are common English first names (§7).

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Describe sets in words or by listing, and use ∈, ∉, and ξ.
2. Represent a set and its complement in a Venn diagram and find n(A′).
3. Read the four regions of a two-set Venn diagram and place items in them.
4. Find and count the intersection A ∩ B ("and").
5. Find and count the union A ∪ B ("or") without double-counting.
6. Recognise subset and disjoint cases.
7. Complete a two-set Venn diagram from given totals.
8. Shade and count the regions for A′, A ∩ B′, A′ ∩ B, and (A ∪ B)′.
9. Read and complete a three-set Venn diagram, including "exactly" versus "at least".

Ordering runs foundational → applied and drives the world sequence in §9 (one objective per world for Worlds 0–8; World 9 is the mixed review).

## 5. Inherited Standards *(copied unchanged from the blueprint PRD v3.1 §5)*

- **Five-phase architecture:** Wonder → Story → Simulate → Practice → Reflect ("Play" in code; **"Practice"** in the UI).
- **Look and feel:** the zip's design system — dark navy `#0a0a2e` base, gold `#ffc107` primary, purple `#7c5cbf` secondary, green `#4caf50` success, red `#ef5350` error; **Fredoka** (display) and **Nunito** (body); glass-card surfaces; radii 8 / 14 / 22 / pill — exactly as in the TRD §5. No module redefines them.
- **Shell and navigation:** the zip's header — **Home** button at top-left, a centred **numbered phase pill** (01 Wonder … 05 Reflect) and the **audio toggle immediately to the right of the pill**. The header is hidden on the Home screen. (This replaces the earlier "audio toggle at right-centre" wording.)
- **Home screen (S1):** per screenshot 1 — all five phase names on one line (§8.0).
- **Practice map:** per screenshot 2 (§8.4).
- **Reflect (S2):** stepped and uncongested, reusing the zip's Reflect styling (§8.5).
- **Responsive (S3):** mobile-first, 320 px to 1920 px, portrait and landscape; touch, mouse, and keyboard (§12).
- **Simulate (S4):** exactly 4 archetype-mapped stations in the zip's station shell, animated, interactive, none a multiple-choice quiz (§8.3).
- **Gamification:** XP per question, 0–3 stars per world (≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1 correct of 10), streaks, 8 fixed badge triggers (§10), 10 Boss Battles (5Q / 3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60 s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs **Alice** only, 6 emotional presets (one table used for both pre-generated and dynamic clips), pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity. Every question and every hint has its own narration. Wonder narration auto-starts right after **Begin Your Journey**.
- **Question bank:** 10 worlds × 10 questions = 100 (platform minimum 20+), procedurally generated, ≥ 300-run stress test, fixed schema, World 9 is the mixed-review finale.
- **Feedback system:** correct — green highlight, success animation, positive sound, encouraging message; incorrect — red highlight, gentle shake, retry sound, hint, another attempt; popups/modals animated and consistent; buttons have hover / active / focus / disabled states.
- **Delivery:** zip with placeholder story art and an art-brief README.
- **Global and language conventions (G1):** English-language content for a global audience; characters have common English first names; learner-facing text uses only Intellia grade labels and generic school words ("club", "class", "grade"), with no country-specific terms, currencies, places, holidays, or brands unless the topic requires them (then isolated behind one locale setting, TRD §4.4); one notation and spelling house style per module, declared in §3.

## 6. Enhancement Requests / Special Instructions

Two instructions were supplied for this module revision. Each is a **binding acceptance requirement**:

| # | Instruction | Where satisfied |
|---|---|---|
| M1 | "ensure that the module uses english names, currently it takes only singaporian names" | PRD §7 (characters and background names), §9 (sample questions), §11, §13, §14; TRD §4.2, §4.4 (name pool), §12.18 (locale audit) |
| M2 | "ensure the blueprint does not limit to singapore only because we're working globally on intellia 360" (applied to this module as: curriculum-neutral scope, wording, and contexts) | PRD §3 (crosswalk, notation variants, G1 check), §7, §14, §15.1, §15.11; TRD §4.4, §12.18 |

The four instructions in the earlier draft (home-screen phase names on one line, a less congested Reflect, responsive on mobile and web, animated non-MCQ simulations) are now **platform standards S1–S4** in blueprint v2 onward, so they are not listed as special instructions; they are satisfied in §8.0, §8.5, §12, and §8.3 and tested in §14.

Defaults applied beyond these: 4-panel Story (§8.2), common English first names (§7), a module-specific mascot with rationale (§7), and the standard 4-station Simulate design (§8.3). The Concept Discovery Lab is **pure free-play** with no confirmation question.

## 7. Module Identity

- **Module name:** **VennQuest**. The Home title splits as **Venn** (orange) + **Quest** (white).
- **Story theme:** the **Playtest Lab** at a game studio. Junior data analysts receive survey results from playtesters (who played which games, who joined which clubs, who uses which transport) and must organise them into clear, correct reports. The "report" is a Venn diagram; a wrong count means the studio ships the wrong game. The theme suits the age band (13–14) and makes overlapping groups feel natural: of course one person can play two games.
- **Named characters** (common English first names, no surnames):
  - **Jack**: adds up each group's total and reports the sum, double-counting anyone who is in two groups.
  - **Emma**: checks that the pieces add back to the number of people surveyed before she trusts a report.
  - **Background names** in generated questions and tokens come from one shared pool of 48 common English first names (TRD §4.4). *Replaces the earlier draft's non-English names (M1).*
- **Mascot: Pixel the Penguin 🐧** *(override, with rationale)*: penguins naturally huddle in overlapping groups, and their black-and-white plumage is a ready visual for "inside / outside"; the name suits the game-lab setting. Distinct from the owl, fox, chameleon, robot, beaver, tortoise, lion cub, ant, bee, and seal mascots used elsewhere. Appears in the Home speech bubble, Wonder, Story, and Reflect.
- **Global-content check (G1):** passed on theme, story, and contexts: no country-specific school terms, currencies, places, holidays, foods, or brands.
- **Collision check:** Jack, Emma, and Pixel were compared against the Grade 8 siblings named in this PRD only (no full registry was available); result recorded in §15.3.

## 8. Five-Phase Journey Detail

### 8.0 Home Screen (S1)

Top to bottom, centred, no header, no description paragraph (structure fixed by blueprint §8.0; copy slots filled):

1. **Top chip:** `✨ Curriculum · Venn Diagrams Grade 8`
2. **Title:** **Venn** (orange) **Quest** (white).
3. **Subtitle** (gold, one line): "Count overlapping groups without counting anyone twice"
4. **Mascot row:** Pixel's avatar and a white speech bubble: "Some testers play **both** games. Count the overlap **once**: **n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**" (formula in orange).
5. **Journey card** — heading `YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START`; five phases in one row joined by arrows, icon circles from the zip's phase icons:

| Phase name | Descriptor (≤ 22 characters) |
|---|---|
| Wonder | Where does Zoe go? |
| Story | A messy survey |
| Simulate | 4 interactive labs |
| Practice | 10 worlds & bosses |
| Reflect | Review & scorecard |

6. **CTA:** `🚀 Begin Your Journey!`
7. **Three info chips:** `🎯 100 Questions`, `⭕ Two & Three Sets`, `✨ Badges & XP`.

**S1 requirements:** the five names appear **on one line at every width from 320 px up**, never wrapped, truncated, or scrolled sideways. On phones each item stacks icon above name and the descriptors are hidden. Exact sizes and positions: TRD §6.2.

### 8.1 Wonder
Single **interactive** hook screen in the zip's Wonder card. Twelve animated tester avatars drift between two overlapping hoops labelled "Plays Racing" and "Plays Puzzle". The prompt: *"Zoe plays **both** games. Where should she go?"* The student drags (or taps) Zoe; she can be dropped in a single hoop, but only the overlap makes both hoops glow. Narration: *"A tester can belong to more than one group. Let's find out how to keep count."* No scoring.

### 8.2 Story — 4 panels

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Messy Survey | Hook: double-counting | 40 testers were surveyed. Jack reports 20 played Racing and 22 played Puzzle, "so 42 played something", more than the 40 surveyed. Emma: "That can't be right." |
| 2 | Two Circles, Four Zones | Universal set, circles, the four regions | Pixel the Penguin draws the rectangle (ξ) and two overlapping circles and fills the zones: only Racing 12, both 8, only Puzzle 14, neither 6. They check: 12 + 8 + 14 + 6 = 40. |
| 3 | Count the Overlap Once | ∩, ∪, complement, n(A ∪ B) | The 8 "both" testers were counted twice. 20 + 22 − 8 = 34 played at least one game, so 6 played neither (the complement of the union). The symbols ∩, ∪, and ′ are introduced beside their plain-language meanings. |
| 4 | Three Games, Seven Zones | Three-set diagrams | A third game joins a survey of 60 testers. Pixel shows the **inside-out** method: centre first (2), then the pair-only zones (4, 3, 5), then the single-only zones (10, 8, 6), then outside (22). The sum check 2 + 4 + 3 + 5 + 10 + 8 + 6 + 22 = 60 passes Emma's check and the report is approved. |

**Fixed literals** (unit-tested in TRD §4.2): 40, 20, 22, 8, 12, 14, 6, 34; three-set: 60, 2, 4, 3, 5, 10, 8, 6, 22.

### 8.3 Simulate — 4 stations (S4)
Every station is built from animated tokens and live-updating diagrams; **none contains a multiple-choice question**. Each is operable by drag, by tap-to-select-then-tap, and by keyboard. Pitched to the lower-secondary band (Appendix A of the blueprint): 48 px targets, about 25 words per instruction, 4–6 minutes per station. Full technical spec: TRD §10.

| Station | Archetype | Premise and why it teaches |
|---|---|---|
| The Overlap Lab | Concept Discovery Lab (**pure free-play**) | A crowd of animated tester tokens sits inside a Venn diagram. The student **drags the circles** to change how much they overlap, and the tokens glide to the correct region as memberships change; tapping a token flips whether it plays each game and the token animates to its new region. Live counters show n(A), n(B), n(A ∩ B), n(A ∪ B), and n(outside). Tapping a region name (union, intersection, complement…) makes that region glow and its tokens pulse. A "count it" animation flashes the A circle, then the B circle, with the overlap flashing twice and then being subtracted, so the **double-count is seen, not told**. Dragging the circles apart shows the disjoint case; dragging one fully inside the other shows the subset case; a toggle adds a third circle. No questions. |
| Shade the Target | Build-to-Target Challenge | A set expression card appears (for example A ∩ B′). The student **taps or paints regions** of the diagram; tokens that satisfy the *student's shaded regions* light up, and tokens satisfying the *target expression* show a dashed outline, so the two sets of tokens visibly match or mismatch. When they match exactly, the target "locks" with a success animation. Rounds cover A′, A ∩ B′, A′ ∩ B, A ∪ B, (A ∪ B)′, and a three-set round. Free retries. |
| Fill the Diagram | Multi-Step/Composite Construction | A survey is given **as totals only** (for example n(ξ) = 50, n(A) = 30, n(B) = 24, 6 in neither). Four chained steps: (1) **set the overlap** with a stepper while the circle totals animate and a "does A still add up to 30?" bar shows the mismatch live; (2) the "only A" and "only B" regions **fill themselves by animated subtraction**; (3) place the outside count; (4) a **sum check** animation drops tokens into the regions and compares the total against ξ. Later rounds are three-set and enforce the inside-out order. |
| Audit the Analyst | Error-Detective | A rival analyst's finished diagram plays back as an **animated replay** of their counting. One step is wrong (the overlap counted twice, the outside region forgotten, "only A" entered as n(A), or the wrong region shaded). The student **pauses the replay and taps the exact region or number that is wrong**, then **repairs it directly** by editing the count or dragging tokens to the right region. The corrected diagram re-runs the sum check. |

### 8.4 Practice — world map and questions (screenshot 2)

**Map screen** (replaces the zip's map): one card titled **`Venn Diagram Game Worlds`** with the subtitle **`10 Themed Worlds · Need 4/10 Correct to Unlock Next World`** and a **star pill** (`⭐ n / 30`) at the right. A short teal accent line sits at the top edge of the card.

**World cards (5 × 2):** each shows `W1`…`W10` (top-left), the question range `Q1–10`…`Q91–100` (top-right), the world icon (🔒 while locked), the world name, and a status — **`Play →`** on the current world (highlighted with a mint border), **`Locked`**, **`Ready`**, or stars + `n/10` once completed. Clicking the current world card enters it.

**Buttons under the grid:** `👑 Boss Battle: {current world's boss}` and `📓 Jump to Reflect Phase →`.

**Rules shown on screen:** a world unlocks when the previous world is scored **at least 4 of 10**; below that, the student replays the world with **freshly generated questions**. Stars are 0–3 per world, 30 in total.

**Question screen, feedback overlay, and Boss modal** are the zip's, unchanged: top bar with topic name + Boss / Map buttons + ⭐ XP / 🔥 streak / `Q n/10` pills, thin progress line, the question card with its live visual, hint button, Previous/Next, then feedback popup (2.2 s). Exact sizes: TRD §5.4, §7.

World names, icons, and bosses: §9. Every question carries a **live-rendered Venn visual**. Whether Practice should also include tap-the-region item formats is recorded in §15.2.

### 8.5 Reflect (S2)

A short, spacious, three-step flow built from the zip's Reflect card (title badge "📓 Learning Reflection & Scorecard"), never one crowded screen:
1. **Quick check** — 3 recap prompts, **one per screen**, each answered by a direct interaction (tap a part of the module's visual, or at most three option buttons for non-visual topics). They target the module's three headline habits: **double-counting the overlap**, **forgetting the outside region**, and **confusing "and" with "or"** (prompts below).
2. **Think it over** — one reflection prompt ("Which survey made you stop and recount, and what did you miss the first time?"), quick-insert chips, and a text box.
3. **Scorecard** — three stat tiles (correct / XP / best streak), one line `⭐ n / 30`, a **closed** "Badges unlocked" section, and **Play Again** / **Home** buttons.

Rules: one primary task per screen; a sticky bottom Back/Next bar; a "Step n of 3" indicator; no nested scrolling; generous spacing; no competing effects. Reflect is reachable in **one tap** (header phase pill, the map's "Jump to Reflect Phase →", and the Practice-complete card). Limits: TRD §8.

**VennQuest recap prompts** (Step 1, one per screen, two-set diagram, answered by tapping regions):
1. *Double-counting:* "Jack added 20 + 22 for Racing and Puzzle. Tap the zone he counted twice." → **both**.
2. *Forgetting the outside:* "The zones add up to 34, but 40 testers were surveyed. Tap the zone that is missing." → **neither**.
3. *"And" versus "or":* "Tap every zone where a tester played Racing **or** Puzzle (or both)." → **only Racing, both, only Puzzle**.

**Think it over** (Step 2): the prompt above, with three quick-insert chips: "I counted someone twice", "I forgot the outside", "I mixed up and / or".

**Control budget (interpretation of the five-control limit):** the diagram's regions form **one composite control** (a single tab stop with arrow-key navigation, each region's hit-zone ≥ 48 × 48 px), and the three quick-insert chips form **one composite toolbar**. Each counts as one control. The primary button reads **Check** until the answer is checked, then **Next**. Step 1 therefore has diagram + Back + Check/Next + "Skip to scorecard" = 4 controls; Step 2 has chips + text box + Back + Next = 4; Step 3 has the badges disclosure + Play Again + Home + Back = 4. Flagged for confirmation in §15.12.

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. The map card shows each world's icon (`emoji`). World 9 is the mixed-review grand finale. World accents are the zip's ten defaults, assigned in order (TRD §5.7).*

| id | Icon | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|---|
| 0 | 👥 | Meet the Testers | `sets-elements-universal-set` | Describe sets, use ∈, ∉, and ξ | The Misfiled Report 🗂️ | Sorter Badge |
| 1 | 🔲 | Inside and Outside | `set-and-complement` | One set in ξ; find its complement A′ | The Ghost Tester 👻 | Outside Badge |
| 2 | 🔵 | Two Circles, Four Zones | `read-two-set-venn` | Read and place items in the four regions | The Double Player 🎮 | Region Reader Badge |
| 3 | 🔗 | The Overlap Zone | `intersection-and` | Find and count A ∩ B ("and") | The Gatekeeper 🚪 | Overlap Badge |
| 4 | ➕ | Count It Once | `union-or-no-double-count` | Find and count A ∪ B without double-counting | The Double Counter 🧮 | Union Badge |
| 5 | ↔️ | Nested and Apart | `subset-and-disjoint` | Recognise subset and disjoint cases | The Nesting Doll 🪆 | Special Case Badge |
| 6 | 🧾 | Fill from the Totals | `fill-venn-from-totals` | Complete a two-set diagram from totals | The Missing Form 📄 | Totals Badge |
| 7 | 🎨 | Shade the Region | `shade-set-expressions` | Shade and count A′, A ∩ B′, A′ ∩ B, (A ∪ B)′ | The Shading Gremlin 🖍️ | Shading Badge |
| 8 | ☘️ | Three Circles | `three-set-venn` | Read and complete a three-set diagram | The Triple Overlap 🔺 | Three-Set Badge |
| 9 | 🏁 | The Final Audit | `mixed-review` | Mixed review of every concept above; hardest boss | The Head of Analytics 📊 | Master Analyst Trophy |

**Verified sample questions** (one per world; arithmetic checked; each distractor names its misconception ID from TRD §4.3):

| World | Question | Answer | Distractors (misconception) |
|---|---|---|---|
| 0 | ξ = {Amy, Ben, Chloe, Dan, Ella, Fiona}. R = {Amy, Chloe, Fiona} played Racing. Which statement is true? | **Ben ∉ R** | Ben ∈ R (`membership-swap`); Chloe ∉ R (`membership-swap`); n(R) = 4 (`wrong-count`) |
| 1 | 30 testers were surveyed. 18 played Racing. How many did **not** play Racing? | **12** (30 − 18) | 18 (`set-as-complement`); 48 (`sum-instead-of-difference`); 30 (`total-as-answer`) |
| 2 | Diagram: only Racing 12, both 8, only Puzzle 14, neither 6. How many played Racing? | **20** (12 + 8) | 12 (`n-as-only`); 8 (`wrong-region-count`); 40 (`total-as-answer`) |
| 3 | n(R) = 20, n(P) = 22, and 8 played both. How many played Puzzle **only**? | **14** (22 − 8) | 22 (`n-as-only`); 30 (`sum-instead-of-difference`); 12 (`wrong-region-count`, Racing only) |
| 4 | Same survey (20 Racing, 22 Puzzle, 8 both): how many played at least one game? | **34** (20 + 22 − 8) | 42 (`double-count-overlap`); 14 (`wrong-region-count`); 40 (`forget-outside`) |
| 5 | All 15 chess club members are also in the robotics club, which has 27 members. How many students are in at least one of the two clubs? | **27** (subset) | 42 (`double-count-overlap`); 12 (`difference-instead-of-union`); 15 (`smaller-set-as-union`) |
| 5 (disjoint) | 12 in Art, 9 in Drama, none in both. How many in at least one? | **21** | 3 (`difference-instead-of-union`); 12 (`smaller-set-as-union`); 9 (`wrong-region-count`) |
| 6 | ξ = 50, n(A) = 30, n(B) = 24, and 6 are in neither. How many are in both? | **10** (50 − 6 = 44; 30 + 24 − 44) | 6 (`wrong-region-count`); 44 (`and-or-swap`); 54 (`double-count-overlap`) |
| 7 | Only A 20, both 10, only B 14, neither 6. What is n(A ∩ B′)? | **20** (A but not B) | 30 (`n-as-only`); 14 (`wrong-region-shaded`); 6 (`wrong-region-shaded`). Same diagram: n(A′) = **20** (14 + 6); n((A ∪ B)′) = **6** |
| 8 | Three games, 60 testers: only A 10, only B 8, only C 6, A and B only 4, A and C only 3, B and C only 5, all three 2, none 22. How many played **exactly two** games? | **12** (4 + 3 + 5) | 14 (`exactly-vs-at-least`, includes the centre); 18 (`pair-totals-summed`, centre counted three times); 38 (`exactly-vs-at-least`, at least one). Variant: at least one game = **38** (60 − 22) |
| 9 | Which expression describes testers who played Racing but **not** Puzzle? | **R ∩ P′** | R′ ∩ P (`wrong-region-shaded`); R ∪ P′ (`and-or-swap`); (R ∩ P)′ (`complement-misplaced`) |

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Data Point 📍 |
| 5-answer streak | Clean Count 🔢 |
| 10-answer streak | Overlap Streak 🔥 |
| All 4 Simulate stations complete | Full Lab Kit 🧪 |
| Any world scores 3 stars | Report Approved ⭐⭐⭐ |
| Any Boss Battle won | Bug Squashed 🏅 |
| 20+ questions answered in Practice | Dedicated Analyst 📋 |
| Full 5-phase journey complete | Master Analyst Badge 🏆 |

## 11. Audio & Narration Content Rules

- Every symbol is spoken **together with its plain-language meaning** on first use per world: "A intersection B, the testers in A **and** B"; "A union B, the testers in A **or** B **or both**"; "A complement, everyone in the universal set who is **not** in A"; "n of A, the number of elements in A"; ξ is "the universal set".
- "Or" is always narrated as "or both" when it denotes union, so the inclusive meaning is never left implicit.
- Region narration always names the region by what it contains ("only Racing", "both", "neither"), never "this part" or "that part".
- The double-count is narrated as "counted twice"; the correction is always narrated as "subtract the overlap once".
- Hints always begin with the **first thing to place** ("Start with the overlap…" or "Start by finding who is outside…").
- Every question text and hint has its own narration (dynamic, cached by text hash, because the bank is procedural), in addition to the pre-generated fixed phrases.
- **Names and wording (G1):** only the module's English first names are spoken; they are checked by ear in the generated clips and replaced, not respelled, if mispronounced. Narration uses only the notation house style in §3 and no country-specific school terms.

## 12. Accessibility and Responsiveness (S3)

**Responsive on mobile and web.** Desktop (≥ 1024 px) matches the zip and the two screenshots; below that, the zip's own 768 / 540 / 480 px rules apply, plus a few additions (TRD §9). Verified from a 320 px phone to a 1920 px display, portrait and landscape:
- No horizontal scrolling at any width; no clipped or overlapping elements; the main visual scales with its labels kept legible (minimum rendered label size).
- Header: labels hidden ≤ 768 px and Home text hidden ≤ 540 px, as in the zip. Home screen: §8.0. Map grid: 5 / 3 / 2 columns.
- Stations: the zip's two columns collapse to one at ≤ 768 px (visual on top, controls below); a module whose visual needs width may stack up to 1024 px.
- All interactions work by **touch, mouse, and keyboard**; touch targets ≥ 48 × 48 px (larger for early grades, Appendix A); sticky bars respect safe areas; full-height layouts use dynamic viewport height.

**Accessibility.** Enlarged fonts and targets in Simulate and Practice; no cue is colour-only (patterns and text labels too); every part of a diagram has a text label; animations honour reduce-motion; changes are announced to screen readers; visible keyboard focus. ⚠ The zip's viewport meta disables pinch-zoom; recommended change in §15.

**Module items (VennQuest):**
- The Venn diagram scales to the available width and keeps every label at least 12 px rendered; label pills sit on a dark backing so text stays legible over the set patterns.
- All four stations stack **diagram on top, controls below** below 1024 px (module-level `data-stack-below="1024"`, because the diagram needs width); in phone landscape (height under 500 px) the controls move to a collapsible side panel.
- `touch-action: none` is applied **only** to draggable tokens and the Overlap Lab's circle handles, so the page still scrolls on touch.
- Small regions (a thin overlap on a 320 px screen) get enlarged hit-zones (≥ 48 × 48 px) and the tap-to-select-then-tap method.
- Sets are distinguished by **pattern and text label as well as colour** (blue/hatch, orange/dots, green/crosshatch).

## 13. Assets Required

4 story images at the reference module's placeholder dimensions, delivered as blank CSS-framed placeholders (`object-fit: cover`, artwork drop-in with no layout changes), with an art-brief README (one line per panel):
1. The Playtest Lab: Jack at a whiteboard with a messy pile of survey cards and "20 + 22 = 42?" circled; Emma frowning at the "40 surveyed" sign.
2. Pixel the Penguin drawing a rectangle with two overlapping circles on a glass wall, four zones labelled.
3. The overlap zone highlighted, with a "counted twice" arrow and the subtraction written beside it.
4. A three-circle diagram on the lab's big screen with the centre zone glowing and the team approving the report.

Art briefs use no country-specific signage, uniforms, currency, or landmarks.

## 14. Success Metrics / Acceptance Criteria

- Question-bank stress test (≥ 300 runs), audio parity, clean production build, full-journey walkthrough with zero console errors.
- **Visual fidelity:** token values, header, Wonder/Story/Simulate/Practice-question/Reflect surfaces match the zip (token-parity test); the **Home screen** and **Practice map** match the screenshot boxes within ±4 px at 1366 × 681 and 1361 × 654 (layout-anchor test).
- **S1:** at every tested width from 320 px up, the five Home-screen phase names render on a single line — no wrapping, truncation, or horizontal scroll.
- **S2:** each Reflect step fits 360 × 640 without scrolling (steps 1–2), has ≤ 5 interactive controls, targets ≥ 48 px, no overlapping or competing animation; Reflect reachable in one tap.
- **S3:** the full journey passes the device matrix; every station completable by touch only, mouse only, and keyboard only; no horizontal overflow.
- **S4:** no Simulate station contains a multiple-choice question; each is manipulation-driven with live animated feedback; the Concept Discovery Lab has no questions.
- **Practice map:** the 4/10 unlock rule, replay with regenerated questions, and the 0–30 star total behave as in §8.4.
- Every correct answer verified by an **independent solver**; every distractor traces to a named misconception.
- **G1 (global content):** the locale audit passes (TRD §12.18): no country-specific terms, currencies, places, or brands in learner-facing text; every character and background name is a common English first name; only Intellia grade labels appear; the §3 crosswalk is complete and the terminology house style is applied consistently in narration, visuals, and distractors.
- **M1 (English names):** every character name (Jack, Emma, Pixel) and every background name is on the module's English first-name list; the locale audit finds none of the earlier draft's non-English names anywhere in `src/`, `public/`, `README.md`, or the audio phrases.
- **M2 / G1 (global content):** the §3 crosswalk is complete; no framework name, country-specific school term or level label, currency, place, or brand appears in learner-facing text; the notation house style (§3) is used consistently in narration, visuals, and distractors.
- **Region integrity:** every diagram's regions sum to n(ξ), every "neither" and "only" count is non-negative, and degenerate diagrams (an empty region) appear only in the dedicated subset/disjoint items.
- **Token integrity:** every token sits inside its own region and per-region token counts equal the diagram's counts, for any circle geometry.
- **Distractors:** every distractor traces to a named misconception (§9), never equals the correct answer, and never makes the question ambiguous.
- **Variety:** problems span the contexts in §3 (games, clubs, languages, transport, music); no single context dominates the bank.
- **Reflect budget:** composite controls (diagram, chip toolbar) count as one control each (§8.5); Check/Next is a single button.
- **Replay:** a world scored below 4/10 is replayed with a freshly generated question set.

## 15. Assumptions & Open Questions

1. **Grade placement and curriculum crosswalk (§3):** formal sets and Venn diagrams sit at ages 11–14 in England (KS3) and in upper secondary elsewhere (Cambridge IGCSE, US high school, India Class 11, Singapore Secondary 4). This PRD treats Grade 8 as at-level for England and an early/foundation placement elsewhere, and caps scope accordingly. Confirm the target markets; if Grade 8 must be at-level formal sets for an upper-secondary-first market, set-notation and three-set depth would need to grow.
2. **Practice item formats:** Practice stays multiple-choice with a live Venn visual under the fixed question schema (4 options). If tap-the-region or enter-the-count items are wanted, that is a schema change to decide before the TRD is built.
3. **Characters, mascot, theme:** Jack, Emma, Pixel the Penguin, and the Playtest Lab are proposed defaults, not approved. The collision check covered only the siblings named in this PRD, not the full module registry.
4. **Concept Discovery Lab:** free-play with no confirmation question; completion is gated on exploration flags.
5. **Excluded adjacent topics:** probability from Venn diagrams (a "Sets and Probability" companion is the natural next module); formal set algebra (De Morgan's laws, set-builder notation, difference notation); percentages and fractions in Venn diagrams. Each is bridge-only here.
6. **Header size:** screenshot 2's header pill is about 37 px tall, the zip's about 46 px. The zip's header is used for all phases; the compact one would change four values (pill padding, circle size, audio button, header height).
7. **Audio-toggle position:** the zip and screenshot 2 place it beside the phase pill; earlier wording said "right-centre". The zip's position is used; confirm.
8. **Practice unlock rule:** "Need 4/10 Correct to Unlock Next World" is new relative to the zip (which advances regardless of score); confirm the rule and the replay behaviour.
9. **Screenshot-derived values** are approximate (JPEG); replace with exact source values if available. Layout defects visible in the screenshots (unequal map columns, clipped Home button, a three-line "Simulate" descriptor) are not reproduced.
10. **Viewport meta:** remove `user-scalable=no` to allow pinch-zoom (accessibility); needs sign-off because it departs from the zip.
11. **Markets and locale variants:** which markets this module will launch in, and whether any need a regional variant (for example the U / E notation for the universal set, US spellings, or extra upper-secondary content such as De Morgan's laws). The spelling house style (British-style) is a default to confirm.
12. **Reflect control budget:** this PRD counts the diagram and the chip toolbar as one composite control each, so the five-control limit can hold with Back/Next. Confirm that interpretation, or reduce the Reflect chips to two and use single-region prompts.
13. **Three-set scope:** World 8 is a capped capstone (counts and regions only). More three-set depth (expression shading across three sets) would need its own world and push the module further past the grade placement.
