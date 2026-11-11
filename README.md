# VennQuest — Grade 8 Sets & Venn Diagrams
**Intellia Learning Platform · Grade 8 Mathematics**

VennQuest is an interactive, learn-by-doing educational module teaching students to organize and count overlapping groups using Venn diagrams. Students step into the role of junior data analysts at a game studio's **Playtest Lab**, auditing survey results, preventing double-counting, calculating set intersections (∩), unions (∪), and complements (A′), and building Venn diagrams inside-out.

---

## 🚀 Key Learning Objectives

1. **Describe Sets & Elements:** Use set notation including $\in$ (is an element of), $\notin$ (is not an element of), and $\xi$ (the universal set).
2. **Represent Complements:** Find $n(A')$ using $n(A') = n(\xi) - n(A)$.
3. **Four Regions of Two-Set Diagrams:** Accurately read and place quantities in Only A, Both, Only B, and Neither.
4. **Intersections ($A \cap B$):** Understand and count the "AND" overlap.
5. **Unions ($A \cup B$):** Prevent double-counting using the inclusion-exclusion principle:
   $$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$
6. **Subset & Disjoint Cases:** Identify $A \subset B$ and disjoint ($A \cap B = \emptyset$) configurations.
7. **Three-Set Diagrams:** Complete 7-region plus outside diagrams from the inside out (centre first).

---

## 🎨 Binding Enhancements Implemented

- **S1 (Home Screen Phase Strip):** All 5 phase names (**Wonder · Story · Simulate · Practice · Reflect**) appear on **one single line** across all viewports from 320px up without wrapping, truncation, or horizontal scrolling (`src/components/shared/PhaseStrip.jsx`).
- **S2 (Uncongested Reflect Flow):** The Reflect phase is structured as an accessible, spacious 3-step flow (`recap` tap-a-region check $\rightarrow$ `scorecard` with 4 large tiles and expander $\rightarrow$ `think it over` prompt) with sticky action buttons and touch targets $\ge 48\text{px}$.
- **S3 (Mobile-First Responsiveness):** Built with `100dvh` viewport handling, native Pointer Events for touch drag-and-drop, and full keyboard equivalents.
- **S4 (Interactive, Non-MCQ Simulations):** 4 archetype-mapped stations built from animated tokens, draggable circles, and live feedback with zero theoretical multiple-choice questions.

---

## 🧪 Simulation Stations (Playtest Lab)

| Station | Archetype | Description |
|---|---|---|
| **Station A · The Overlap Lab** | Concept Discovery Lab | Pure free-play: drag circles to change overlap, flip tester game memberships, view live counters, and watch the inclusion-exclusion "Count It!" animation. |
| **Station B · Shade the Target** | Build-to-Target Challenge | Paint or tap diagram regions to match set expression cards ($A \cap B'$, $A'$, $A \cup B$, $(A \cup B)'$) while animated target tokens light up and outline. |
| **Station C · Fill the Diagram** | Multi-Step Construction | Complete diagrams from survey totals step-by-step: set overlap first, observe automated subtraction for "only" zones, place outside count, and run universal sum check. |
| **Station D · Audit the Analyst** | Error-Detective | Replay a rival analyst's calculation log, identify the seeded misconception error, and repair the survey count. |

---

## 🖼️ Art Brief: Story Panels

Placeholders are delivered in `src/assets/story/` (`1.png` to `4.png`) framed with CSS (`object-fit: cover`):

1. **Panel 1 — The Messy Survey:** The studio's Playtest Lab. Jack stands at a whiteboard covered with survey cards and writes `"20 + 22 = 42?"` circled in red; Emma frowns, pointing at a `"40 Surveyed"` sign on the desk; Pixel the Penguin waddles into frame with chalk.
2. **Panel 2 — Two Circles, Four Zones:** Pixel draws a large glowing rectangle ($\xi$) and two overlapping circles on a glass wall, labelling the 4 zones: Only Racing (12), Both (8), Only Puzzle (14), and Neither (6).
3. **Panel 3 — Count the Overlap Once:** The central overlap zone glows gold, showing an arrow labelled `"Counted twice!"` and the subtraction formula: $20 + 22 - 8 = 34$. Outside is labelled $(A \cup B)' = 6$.
4. **Panel 4 — Three Games, Seven Zones:** A high-tech studio monitor displays a 3-circle Venn diagram with the central region (all three) highlighted. The team high-fives as a green `"APPROVED"` stamp appears on the report.

---

## 🎙️ Audio & Narration Pipeline

- **Voice:** ElevenLabs Alice (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`.
- **Pre-generated Audio:** Offline scripts in `scripts/generate_audio.js` generate static `.mp3` assets into `public/assets/audio/` and update `src/utils/audioMap.js`.
- **Dynamic Narration:** Question and hint text are generated on-the-fly and cached by text hash when an API key is present.
- **Silent Fallback:** If `VITE_ELEVENLABS_API_KEY` is not provided in `.env.local`, the application runs smoothly without audio errors (no robotic browser Web Speech fallback).

```bash
# Generate offline audio phrases (requires VITE_ELEVENLABS_API_KEY in .env.local)
npm run generate-audio

# Clean orphan audio files
npm run clean-audio
```

---

## 🛠️ Developer Setup & Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run comprehensive mathematics & independent oracle stress tests
npm run stress-test

# Build for production
npm run build
```

