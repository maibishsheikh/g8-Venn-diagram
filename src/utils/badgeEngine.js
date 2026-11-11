// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for VennQuest (Grade 8 Sets & Venn Diagrams)

export const BADGES = [
  { id: 'first_point',       icon: '📍', label: 'First Data Point',  description: 'Answered your very first Venn diagram question correctly!' },
  { id: 'clean_count',       icon: '🔢', label: 'Clean Count',       description: 'Achieved a streak of 5 correct answers without double-counting!' },
  { id: 'overlap_streak',    icon: '🔥', label: 'Overlap Streak',    description: 'Achieved a 10-question winning streak!' },
  { id: 'lab_kit',           icon: '🧪', label: 'Full Lab Kit',      description: 'Completed all 4 interactive simulation stations in the Playtest Lab!' },
  { id: 'report_approved',   icon: '⭐', label: 'Report Approved',   description: 'Scored 3 stars in a Practice World!' },
  { id: 'bug_squashed',      icon: '🏅', label: 'Bug Squashed',      description: 'Defeated a World Boss in battle!' },
  { id: 'dedicated_analyst', icon: '📋', label: 'Dedicated Analyst', description: 'Answered over 20 questions in Practice!' },
  { id: 'master_analyst',    icon: '🏆', label: 'Master Analyst',    description: 'Completed the full 5-phase VennQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_point');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('clean_count');
  if (state.maxStreak >= 10) unlocked.push('overlap_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('lab_kit');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('report_approved');
  }

  // Centurion / dedicated analyst
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('dedicated_analyst');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('bug_squashed');
  }

  // Full journey complete
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_analyst');
  }

  return unlocked;
}

