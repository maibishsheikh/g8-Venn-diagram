// src/utils/narration.js
// Narration script builder for VennQuest (Grade 8 Sets & Venn Diagrams)
// Strictly matches on-screen text 1:1

export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const instruct = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to VennQuest! Let's investigate the overlapping survey mystery!"),
    say("Zoe plays both Racing and Puzzle. Where does she go in the Venn diagram so both games count her?"),
    ask("A tester can belong to more than one group. Let's find out how to keep count!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("At the studio's Playtest Lab, forty playtesters were surveyed on their favorite games."),
      say("Jack quickly added up the numbers: twenty played Racing and twenty-two played Puzzle, so forty-two testers played a game!"),
      think("Wait, twenty plus twenty-two is forty-two, but we only surveyed forty testers in total! You double-counted anyone who played both games, warned Emma."),
      cheer("Pixel the Penguin waddled over. Let's organize this properly with a Venn diagram!"),
    ],
    [
      say("Pixel drew a large rectangle on the lab glass wall to represent the universal set xi of all forty testers."),
      say("Inside, he drew two overlapping circles for Racing and Puzzle."),
      say("Now look at the four separate zones, explained Pixel. Twelve played Racing only, eight played both games, fourteen played Puzzle only, and six played neither game."),
      cheer("Emma verified the tally: twelve plus eight plus fourteen plus six equals forty. Every single tester is in exactly one zone!"),
    ],
    [
      say("To find how many played at least one game, said Pixel, we take the union: n of Racing union Puzzle."),
      say("We add Racing twenty and Puzzle twenty-two, then subtract the eight who played both so they aren't counted twice: twenty plus twenty-two minus eight equals thirty-four!"),
      say("The six testers who played neither belong to the complement: the complement of the union equals forty minus thirty-four, which is six."),
      cheer("Jack grinned: Intersection means AND, union means OR or both, and complement means NOT!"),
    ],
    [
      say("For the grand holiday playtest, Strategy was added, surveying sixty testers across three games."),
      say("Always build from the inside out! instructed Pixel."),
      say("They placed the centre two who played all three first, then the pair-only zones, then single-only zones, and finally the outside zone."),
      cheer("The numbers added back cleanly to sixty. The studio director stamped APPROVED on their playtest report: Outstanding work, data analysts!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Overlap Lab!"),
      instruct("Drag the circles to change overlap, flip tester memberships, and observe how regions and counts update live!"),
    ],
    [
      instruct("Welcome to Station B — Shade the Target!"),
      instruct("Tap or paint diagram regions to match the set expression cards. Tokens with dashed outlines are your target!"),
    ],
    [
      instruct("Welcome to Station C — Fill the Diagram!"),
      instruct("Construct a complete Venn diagram from survey totals, working step-by-step from the inside out!"),
    ],
    [
      instruct("Welcome to Station D — Audit the Analyst!"),
      instruct("Review a rival analyst's replay log, spot the flawed counting step, and repair the survey!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are an unstoppable analyst! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Spot on! Three in a row! ⭐")];
  }
  return [cheer("Clean count! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, count the overlap carefully, and try again! 💡")
  ];
}

export function playHint1Narration(text) {
  return [
    encourage(text || "Here's your first hint! Start with the overlap first.")
  ];
}

export function playHint2Narration(text) {
  return [
    encourage(text || "Here's your next hint! Remember to subtract the overlap so nobody is double-counted.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Excellent data analysis on this survey district! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    instruct("The Boss Battle begins! Answer correctly to defeat the boss and verify your report!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You squashed the bug, defeated the boss, and claimed the World Badge! 👑")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's check your key Venn diagram concepts and review your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered sets, universal sets, intersections, unions, and Venn diagrams! You are a certified Master Analyst! 🏆")
  ];
}

