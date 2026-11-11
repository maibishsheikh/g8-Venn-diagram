// src/utils/vennMath.js
// Single source of truth for VennQuest (Grade 8 Sets & Venn Diagrams)

export const CONTENT_AREAS = [
  {
    key: 'games',
    itemNoun: 'testers',
    sets2: ['Racing', 'Puzzle'],
    sets3: ['Racing', 'Puzzle', 'Strategy'],
    unit: 'testers',
  },
  {
    key: 'clubs',
    itemNoun: 'students',
    sets2: ['Robotics', 'Chess'],
    sets3: ['Robotics', 'Chess', 'Art'],
    unit: 'students',
  },
  {
    key: 'languages',
    itemNoun: 'learners',
    sets2: ['French', 'Japanese'],
    sets3: ['French', 'Japanese', 'Spanish'],
    unit: 'learners',
  },
  {
    key: 'transport',
    itemNoun: 'commuters',
    sets2: ['Train', 'Bus'],
    sets3: ['Train', 'Bus', 'Bicycle'],
    unit: 'commuters',
  },
  {
    key: 'music',
    itemNoun: 'listeners',
    sets2: ['Rock', 'Electronic'],
    sets3: ['Rock', 'Electronic', 'Classical'],
    unit: 'listeners',
  },
];

import { NAME_POOL } from '../data/namePool.js';

export const TESTER_NAMES = NAME_POOL;

export const TESTER_AVATARS = ['🧑🏻', '👧🏽', '🧑🏾', '👧🏻', '🧑🏼', '👧🏾', '🧑🏿', '👧🏼'];

/**
 * Returns sum of counts across all regions.
 */
export function total(survey) {
  return survey.counts.reduce((sum, c) => sum + (c || 0), 0);
}

/**
 * Returns sum of counts for masks matching a predicate.
 */
export function countWhere(survey, predicate) {
  let sum = 0;
  for (let m = 0; m < survey.counts.length; m++) {
    if (predicate(m)) {
      sum += survey.counts[m] || 0;
    }
  }
  return sum;
}

export function nSet(survey, letter) {
  const bit = letter === 'A' ? 1 : letter === 'B' ? 2 : 4;
  return countWhere(survey, (m) => (m & bit) !== 0);
}

export function nOnly(survey, letter) {
  const mask = letter === 'A' ? 1 : letter === 'B' ? 2 : 4;
  return survey.counts[mask] || 0;
}

export function nAnd(survey, letters = ['A', 'B']) {
  let mask = 0;
  for (const l of letters) {
    mask |= l === 'A' ? 1 : l === 'B' ? 2 : 4;
  }
  return countWhere(survey, (m) => (m & mask) === mask);
}

export function nOr(survey, letters = ['A', 'B']) {
  let mask = 0;
  for (const l of letters) {
    mask |= l === 'A' ? 1 : l === 'B' ? 2 : 4;
  }
  return countWhere(survey, (m) => (m & mask) !== 0);
}

export function nComplement(survey, letter) {
  const bit = letter === 'A' ? 1 : letter === 'B' ? 2 : 4;
  return countWhere(survey, (m) => (m & bit) === 0);
}

export function nNeither(survey) {
  return survey.counts[0] || 0;
}

/**
 * AST Expression evaluator & stringifier
 */
export function exprToString(expr) {
  if (typeof expr === 'string') return expr;
  switch (expr.op) {
    case 'set':
      return expr.letter;
    case 'not':
      return expr.sub ? `(${exprToString(expr.sub)})′` : `${expr.letter}′`;
    case 'and':
      return `${exprToString(expr.left)} ∩ ${exprToString(expr.right)}`;
    case 'or':
      return `${exprToString(expr.left)} ∪ ${exprToString(expr.right)}`;
    default:
      return '';
  }
}

/**
 * Returns which bitmasks satisfy the given expression.
 * sets: 2 or 3.
 */
export function exprRegions(expr, sets = 2) {
  const numMasks = sets === 3 ? 8 : 4;
  const masks = [];

  function evaluate(node, m) {
    switch (node.op) {
      case 'set': {
        const bit = node.letter === 'A' ? 1 : node.letter === 'B' ? 2 : 4;
        return (m & bit) !== 0;
      }
      case 'not':
        if (node.sub) return !evaluate(node.sub, m);
        {
          const bit = node.letter === 'A' ? 1 : node.letter === 'B' ? 2 : 4;
          return (m & bit) === 0;
        }
      case 'and':
        return evaluate(node.left, m) && evaluate(node.right, m);
      case 'or':
        return evaluate(node.left, m) || evaluate(node.right, m);
      default:
        return false;
    }
  }

  for (let m = 0; m < numMasks; m++) {
    if (evaluate(expr, m)) {
      masks.push(m);
    }
  }
  return masks;
}

export function exprCount(survey, expr) {
  const masks = exprRegions(expr, survey.sets);
  return masks.reduce((sum, m) => sum + (survey.counts[m] || 0), 0);
}

/**
 * Returns trace for n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
 */
export function inclusionExclusionTrace(survey) {
  const a = nSet(survey, 'A');
  const b = nSet(survey, 'B');
  const overlap = nAnd(survey, ['A', 'B']);
  const union = nOr(survey, ['A', 'B']);
  const outside = nNeither(survey);
  const tot = total(survey);

  return [
    { label: `Count in ${survey.names[0]} (A)`, expr: `n(A)`, value: a },
    { label: `Count in ${survey.names[1]} (B)`, expr: `n(B)`, value: b },
    { label: `In both (counted twice)`, expr: `n(A ∩ B)`, value: overlap },
    {
      label: `Union (counted once)`,
      expr: `n(A ∪ B) = ${a} + ${b} − ${overlap}`,
      value: union,
    },
    {
      label: `In neither (outside)`,
      expr: `n(ξ) − n(A ∪ B) = ${tot} − ${union}`,
      value: outside,
    },
  ];
}

/**
 * Solves diagram from totals (inside-out)
 */
export function solveFromTotals(problem) {
  if (problem.sets === 3) {
    const { center, abOnly, acOnly, bcOnly, onlyA, onlyB, onlyC, neither, tot } = problem;
    return [
      { stepId: 1, label: 'Centre (all 3)', value: center },
      { stepId: 2, label: 'Pair overlaps only', value: { abOnly, acOnly, bcOnly } },
      { stepId: 3, label: 'Single-only regions', value: { onlyA, onlyB, onlyC } },
      { stepId: 4, label: 'Outside (neither)', value: neither },
      { stepId: 5, label: 'Sum check', value: tot },
    ];
  }

  const tot = problem.tot || total(problem.survey);
  const a = problem.nA || nSet(problem.survey, 'A');
  const b = problem.nB || nSet(problem.survey, 'B');
  const neither = problem.neither !== undefined ? problem.neither : nNeither(problem.survey);
  const union = tot - neither;
  const overlap = a + b - union;
  const onlyA = a - overlap;
  const onlyB = b - overlap;

  return [
    {
      stepId: 1,
      label: 'Find Union from Total and Outside',
      expr: `${tot} − ${neither}`,
      value: union,
    },
    {
      stepId: 2,
      label: 'Find Overlap (Intersection)',
      expr: `(${a} + ${b}) − ${union}`,
      value: overlap,
    },
    {
      stepId: 3,
      label: 'Find Only A',
      expr: `${a} − ${overlap}`,
      value: onlyA,
    },
    {
      stepId: 4,
      label: 'Find Only B',
      expr: `${b} − ${overlap}`,
      value: onlyB,
    },
    {
      stepId: 5,
      label: 'Sum Check',
      expr: `${onlyA} + ${overlap} + ${onlyB} + ${neither}`,
      value: tot,
    },
  ];
}

/**
 * Validates a diagram's region counts against target survey
 */
export function verifyDiagram(survey, studentCounts) {
  const mismatchedMasks = [];
  for (let m = 0; m < survey.counts.length; m++) {
    if (studentCounts[m] !== survey.counts[m]) {
      mismatchedMasks.push(m);
    }
  }

  const sA = studentCounts[1] + studentCounts[3];
  const sB = studentCounts[2] + studentCounts[3];
  const tA = nSet(survey, 'A');
  const tB = nSet(survey, 'B');

  const mismatchedTotals = [];
  if (sA !== tA) mismatchedTotals.push('A');
  if (sB !== tB) mismatchedTotals.push('B');

  return {
    ok: mismatchedMasks.length === 0,
    mismatchedMasks,
    mismatchedTotals,
  };
}

/**
 * Produces candidate distractor values from named misconceptions
 */
export function misconceptionDistractors(survey, askedKind, count = 3) {
  const a = nSet(survey, 'A');
  const b = nSet(survey, 'B');
  const overlap = nAnd(survey, ['A', 'B']);
  const union = nOr(survey, ['A', 'B']);
  const tot = total(survey);
  const neither = nNeither(survey);
  const onlyA = survey.counts[1];
  const onlyB = survey.counts[2];

  let candidates = [];

  switch (askedKind) {
    case 'union': {
      candidates = [
        { value: a + b, misconceptionId: 'double-count-overlap' },
        { value: tot, misconceptionId: 'forget-outside' },
        { value: overlap, misconceptionId: 'and-or-swap' },
        { value: onlyA + onlyB, misconceptionId: 'centre-omitted' },
      ];
      break;
    }
    case 'intersection': {
      candidates = [
        { value: union, misconceptionId: 'and-or-swap' },
        { value: a + b, misconceptionId: 'double-count-overlap' },
        { value: onlyA, misconceptionId: 'n-as-only' },
        { value: onlyB, misconceptionId: 'n-as-only' },
      ];
      break;
    }
    case 'onlyA': {
      candidates = [
        { value: a, misconceptionId: 'n-as-only' },
        { value: overlap, misconceptionId: 'and-or-swap' },
        { value: onlyB, misconceptionId: 'complement-as-other-set' },
        { value: Math.abs(a - b), misconceptionId: 'wrong-total-base' },
      ];
      break;
    }
    case 'onlyB': {
      candidates = [
        { value: b, misconceptionId: 'n-as-only' },
        { value: overlap, misconceptionId: 'and-or-swap' },
        { value: onlyA, misconceptionId: 'complement-as-other-set' },
        { value: Math.abs(a - b), misconceptionId: 'wrong-total-base' },
      ];
      break;
    }
    case 'complementA': {
      // n(A') = total - n(A) = onlyB + neither
      candidates = [
        { value: onlyB, misconceptionId: 'complement-as-other-set' },
        { value: b, misconceptionId: 'complement-as-other-set' },
        { value: union - a, misconceptionId: 'wrong-total-base' },
        { value: a, misconceptionId: 'n-as-only' },
      ];
      break;
    }
    case 'neither': {
      candidates = [
        { value: 0, misconceptionId: 'forget-outside' },
        { value: overlap, misconceptionId: 'and-or-swap' },
        { value: tot - a, misconceptionId: 'wrong-total-base' },
      ];
      break;
    }
    case 'threeSetExactlyTwo': {
      const c = survey.counts[7] || 0; // all three
      const pairSum = (survey.counts[3] || 0) + (survey.counts[5] || 0) + (survey.counts[6] || 0);
      candidates = [
        { value: pairSum + c, misconceptionId: 'exactly-vs-at-least' },
        { value: c, misconceptionId: 'centre-omitted' },
        { value: pairSum - c, misconceptionId: 'wrong-total-base' },
      ];
      break;
    }
    default: {
      candidates = [
        { value: a + b, misconceptionId: 'double-count-overlap' },
        { value: overlap, misconceptionId: 'and-or-swap' },
        { value: tot, misconceptionId: 'forget-outside' },
      ];
    }
  }

  // Filter distinct candidates that are positive/non-negative integers and have valid IDs
  const seen = new Set();
  const valid = [];
  for (const c of candidates) {
    if (typeof c.value === 'number' && Number.isInteger(c.value) && c.value >= 0 && !seen.has(c.value)) {
      seen.add(c.value);
      valid.push(c);
    }
  }

  return valid.slice(0, count);
}

/**
 * Seeds a single realistic mistake in a diagram trace for AuditTheAnalyst
 */
export function seedErrorInDiagram(survey, misconceptionId) {
  const flawedCounts = [...survey.counts];
  const a = nSet(survey, 'A');
  const b = nSet(survey, 'B');
  const overlap = survey.counts[3];
  const neither = survey.counts[0];

  let replaySteps = [];
  let errorTarget = '';
  let correctValue = 0;
  let explanation = '';

  if (misconceptionId === 'double-count-overlap') {
    // Analyst enters union as a + b, making sum of regions exceed universal set
    errorTarget = 'union';
    correctValue = a + b - overlap;
    replaySteps = [
      { step: 1, text: `Counted ${survey.names[0]} = ${a}` },
      { step: 2, text: `Counted ${survey.names[1]} = ${b}` },
      { step: 3, text: `Added ${a} + ${b} = ${a + b} for total players (DOUBLE COUNT!)`, isFlawed: true },
    ];
    explanation = `The overlap of ${overlap} was counted in both sets! You must subtract the ${overlap} overlap once so no tester is double-counted.`;
  } else if (misconceptionId === 'n-as-only') {
    // Analyst put n(A) in the "only A" region without subtracting overlap
    flawedCounts[1] = a;
    errorTarget = 'region-1';
    correctValue = a - overlap;
    replaySteps = [
      { step: 1, text: `Noted overlap of ${overlap} in both` },
      { step: 2, text: `Entered ${a} directly into ${survey.names[0]}-only zone`, isFlawed: true },
      { step: 3, text: `Entered ${survey.counts[2]} into ${survey.names[1]}-only zone` },
    ];
    explanation = `${survey.names[0]} has ${a} total, which ALREADY includes the ${overlap} who play both! The "only" zone must be ${a} − ${overlap} = ${correctValue}.`;
  } else if (misconceptionId === 'forget-outside') {
    // Analyst forgot to place the outside neither count
    flawedCounts[0] = 0;
    errorTarget = 'region-0';
    correctValue = neither;
    replaySteps = [
      { step: 1, text: `Placed ${survey.counts[1]} in only ${survey.names[0]}` },
      { step: 2, text: `Placed ${overlap} in both` },
      { step: 3, text: `Placed ${survey.counts[2]} in only ${survey.names[1]}` },
      { step: 4, text: `Reported 0 outside in neither`, isFlawed: true },
    ];
    explanation = `There were ${neither} surveyed testers who played neither game! Leaving them out makes the survey report incomplete.`;
  } else {
    // and-or swap
    errorTarget = 'overlap';
    correctValue = overlap;
    replaySteps = [
      { step: 1, text: `Mistook the union (${a + b - overlap}) for the overlap!`, isFlawed: true },
      { step: 2, text: `Placed ${a + b - overlap} in both` },
    ];
    explanation = `The overlap is only the testers who played BOTH games (${overlap}), not the union of all players!`;
  }

  return {
    flawedCounts,
    replaySteps,
    errorTarget,
    correctValue,
    explanation,
  };
}

/**
 * Expands survey counts into named tester tokens with deterministic IDs
 */
export function tokensFromSurvey(survey) {
  const tokens = [];
  let tokenIdx = 0;
  for (let m = 0; m < survey.counts.length; m++) {
    const c = survey.counts[m] || 0;
    for (let i = 0; i < c; i++) {
      const name = TESTER_NAMES[tokenIdx % TESTER_NAMES.length];
      const avatar = TESTER_AVATARS[tokenIdx % TESTER_AVATARS.length];
      tokens.push({
        id: `t_${survey.id || 0}_${tokenIdx}`,
        name,
        avatar,
        mask: m,
      });
      tokenIdx++;
    }
  }
  return tokens;
}

/**
 * Generates a valid, verified survey
 */
export function generateSurvey({
  sets = 2,
  shape = 'overlap',
  contentArea = 'games',
  id = 0,
}) {
  const area = CONTENT_AREAS.find((c) => c.key === contentArea) || CONTENT_AREAS[0];
  const names = sets === 3 ? area.sets3 : area.sets2;
  const letters = sets === 3 ? ['A', 'B', 'C'] : ['A', 'B'];

  let counts;
  if (sets === 2) {
    if (shape === 'subset') {
      // A is subset of B: only A = 0, both > 0
      const both = 8 + ((id * 3) % 7);
      const onlyB = 6 + ((id * 2) % 6);
      const outside = 4 + (id % 5);
      counts = [outside, 0, onlyB, both];
    } else if (shape === 'disjoint') {
      // Disjoint: both = 0
      const onlyA = 8 + ((id * 3) % 9);
      const onlyB = 7 + ((id * 2) % 8);
      const outside = 5 + (id % 5);
      counts = [outside, onlyA, onlyB, 0];
    } else {
      // Standard overlap
      // Generate counts where no two totals match
      const base = 4 + (id % 6);
      const onlyA = base + 4;
      const both = base;
      const onlyB = base + 7;
      const outside = Math.max(3, 12 - base);
      counts = [outside, onlyA, onlyB, both];
    }
  } else {
    // 3 sets
    // masks: 0 outside, 1 only A, 2 only B, 4 only C, 3 AB only, 5 AC only, 6 BC only, 7 all 3
    const c = 2 + (id % 3);
    counts = [
      6 + (id % 4),  // 0 outside
      5 + (id % 3),  // 1 only A
      4 + (id % 3),  // 2 only B
      3 + (id % 2),  // 3 AB only
      4 + (id % 3),  // 4 only C
      2 + (id % 2),  // 5 AC only
      3 + (id % 2),  // 6 BC only
      c,             // 7 all three
    ];
  }

  const s = {
    id,
    contentArea: area.key,
    sets,
    letters,
    names,
    shape,
    counts,
    unitNoun: area.itemNoun,
  };

  return s;
}

/**
 * Builds descriptor for VennCanvas
 */
export function buildVennDescriptor(survey, { reveal = false, askedMask = null, highlightMasks = [] } = {}) {
  const isThree = survey.sets === 3;
  const tot = total(survey);

  if (!isThree) {
    return {
      sets: 2,
      names: survey.names,
      letters: ['A', 'B'],
      universalTotal: tot,
      shape: survey.shape,
      regions: [
        {
          mask: 0,
          label: 'Neither',
          count: survey.counts[0],
          text: reveal || askedMask !== 0 ? String(survey.counts[0]) : '?',
          isAsked: askedMask === 0,
          highlight: highlightMasks.includes(0),
        },
        {
          mask: 1,
          label: `Only ${survey.names[0]}`,
          count: survey.counts[1],
          text: reveal || askedMask !== 1 ? String(survey.counts[1]) : '?',
          isAsked: askedMask === 1,
          highlight: highlightMasks.includes(1),
        },
        {
          mask: 2,
          label: `Only ${survey.names[1]}`,
          count: survey.counts[2],
          text: reveal || askedMask !== 2 ? String(survey.counts[2]) : '?',
          isAsked: askedMask === 2,
          highlight: highlightMasks.includes(2),
        },
        {
          mask: 3,
          label: 'Both',
          count: survey.counts[3],
          text: reveal || askedMask !== 3 ? String(survey.counts[3]) : '?',
          isAsked: askedMask === 3,
          highlight: highlightMasks.includes(3),
        },
      ],
    };
  }

  // 3 sets
  return {
    sets: 3,
    names: survey.names,
    letters: ['A', 'B', 'C'],
    universalTotal: tot,
    shape: 'overlap',
    regions: [
      { mask: 0, label: 'Outside', count: survey.counts[0], text: reveal || askedMask !== 0 ? String(survey.counts[0]) : '?' },
      { mask: 1, label: `Only ${survey.names[0]}`, count: survey.counts[1], text: reveal || askedMask !== 1 ? String(survey.counts[1]) : '?' },
      { mask: 2, label: `Only ${survey.names[1]}`, count: survey.counts[2], text: reveal || askedMask !== 2 ? String(survey.counts[2]) : '?' },
      { mask: 4, label: `Only ${survey.names[2]}`, count: survey.counts[4], text: reveal || askedMask !== 4 ? String(survey.counts[4]) : '?' },
      { mask: 3, label: `${survey.names[0]} & ${survey.names[1]} only`, count: survey.counts[3], text: reveal || askedMask !== 3 ? String(survey.counts[3]) : '?' },
      { mask: 5, label: `${survey.names[0]} & ${survey.names[2]} only`, count: survey.counts[5], text: reveal || askedMask !== 5 ? String(survey.counts[5]) : '?' },
      { mask: 6, label: `${survey.names[1]} & ${survey.names[2]} only`, count: survey.counts[6], text: reveal || askedMask !== 6 ? String(survey.counts[6]) : '?' },
      { mask: 7, label: 'All three', count: survey.counts[7], text: reveal || askedMask !== 7 ? String(survey.counts[7]) : '?' },
    ],
  };
}

