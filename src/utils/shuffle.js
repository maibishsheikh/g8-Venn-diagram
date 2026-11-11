// src/utils/shuffle.js
// Question sequencing and shuffling utilities

import { generateAllQuestions } from '../data/questionBank.js';

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bankOrSeed = 0) {
  if (Array.isArray(bankOrSeed)) {
    return [...bankOrSeed].sort((a, b) => a.id - b.id);
  }
  return generateAllQuestions(typeof bankOrSeed === 'number' ? bankOrSeed : 0);
}
