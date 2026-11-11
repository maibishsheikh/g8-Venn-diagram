// src/data/storyContent.js
// 4 Widescreen Story Panels for VennQuest (Grade 8 Sets & Venn Diagrams)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Messy Survey 🎮",
    text: "At the studio's Playtest Lab, 40 playtesters were surveyed on their favorite games. Jack quickly added up the numbers: '20 played Racing and 22 played Puzzle, so 42 testers played a game!' Emma stopped him immediately: 'Wait, 20 plus 22 is 42, but we only surveyed 40 testers in total! You double-counted anyone who played both games!' Pixel the Penguin waddled over: 'Let's organize this properly with a Venn diagram.'",
    highlight: "📊 40 surveyed · 20 Racing + 22 Puzzle = 42? Don't double-count the overlap!",
    character: "Jack & Emma",
    characterEmoji: "🧑",
    imageBg: "radial-gradient(circle, #6c4ab6 0%, #1f2a44 100%)",
    imageEmoji: "🎮",
  },
  {
    panel: 1,
    title: "Two Circles, Four Zones 🗂️",
    text: "Pixel drew a large rectangle on the lab glass wall to represent the universal set ξ of all 40 testers. Inside, he drew two overlapping circles for Racing and Puzzle. 'Now look at the four separate zones,' explained Pixel. '12 played Racing only, 8 played both games, 14 played Puzzle only, and 6 played neither game.' Emma verified the tally: 12 + 8 + 14 + 6 = 40. 'Every single tester is in exactly one zone!'",
    highlight: "🗂️ Universal set ξ = 40 · Racing only (12) + Both (8) + Puzzle only (14) + Neither (6) = 40",
    character: "Pixel the Penguin",
    characterEmoji: "🐧",
    imageBg: "radial-gradient(circle, #2d9cdb 0%, #0d1117 100%)",
    imageEmoji: "🐧",
  },
  {
    panel: 2,
    title: "Count the Overlap Once 🧮",
    text: "'To find how many played at least one game,' said Pixel, 'we take the union: n(Racing ∪ Puzzle). We add Racing (20) and Puzzle (22), then subtract the 8 who played both so they aren't counted twice: 20 + 22 − 8 = 34!' The 6 testers who played neither belong to the complement: (Racing ∪ Puzzle)′ = 40 − 34 = 6. Jack grinned: 'Intersection ∩ means AND, union ∪ means OR or both, and complement ′ means NOT!'",
    highlight: "🧮 n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = 20 + 22 − 8 = 34 · Neither = 6",
    character: "Jack",
    characterEmoji: "🧑",
    imageBg: "radial-gradient(circle, #f2994a 0%, #6c4ab6 100%)",
    imageEmoji: "🧮",
  },
  {
    panel: 3,
    title: "Three Games, Seven Zones 🔺",
    text: "For the grand holiday playtest, Strategy was added, surveying 60 testers across three games. 'Always build from the inside out!' instructed Pixel. They placed the centre 2 who played all three first, then the pair-only zones, then single-only zones, and finally the outside zone. The numbers added back cleanly to 60. The studio director stamped 'APPROVED' on their playtest report: 'Outstanding work, data analysts!'",
    highlight: "🔺 Three sets, seven zones · Always build inside-out from the centre!",
    character: "Emma & Pixel",
    characterEmoji: "🌟",
    imageBg: "radial-gradient(circle, #27ae8f 0%, #1f2a44 100%)",
    imageEmoji: "🏆",
  },
];
