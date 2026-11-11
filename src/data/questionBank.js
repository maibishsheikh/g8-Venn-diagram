// src/data/questionBank.js
// 100 Procedurally Generated Questions across 10 Themed Worlds for VennQuest (Grade 8)

import { WORLDS } from '../config/worlds.config.js';
import {
  generateSurvey,
  total,
  nSet,
  nAnd,
  nOr,
  nComplement,
  nNeither,
  buildVennDescriptor,
  CONTENT_AREAS,
} from '../utils/vennMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

function createQuestion({
  id,
  districtId,
  category,
  questionText,
  correctAnswer,
  distractors,
  explanation,
  hint1,
  hint2,
  survey,
  askedMask = null,
}) {
  // Ensure exactly 3 unique distractors that differ from correctAnswer
  const distinctDistractors = [];
  const seen = new Set([String(correctAnswer).trim()]);

  for (const d of distractors) {
    const s = String(d).trim();
    if (!seen.has(s)) {
      seen.add(s);
      distinctDistractors.push(s);
    }
  }

  // Fallback pad with plausible numbers if needed
  let fallbackVal = typeof correctAnswer === 'number' ? correctAnswer + 3 : 10;
  while (distinctDistractors.length < 3) {
    const s = String(fallbackVal);
    if (!seen.has(s)) {
      seen.add(s);
      distinctDistractors.push(s);
    }
    fallbackVal += 2;
  }

  // Shuffle options deterministically
  const options = [String(correctAnswer), ...distinctDistractors.slice(0, 3)];
  // Deterministic rotation based on id
  const rot = id % 4;
  for (let i = 0; i < rot; i++) {
    const first = options.shift();
    options.push(first);
  }

  return {
    id,
    districtId,
    category,
    visual: 'venn',
    questionText,
    options,
    correctAnswer: String(correctAnswer),
    explanation,
    hint1,
    hint2,
    visualData: buildVennDescriptor(survey, { reveal: false, askedMask }),
    survey,
  };
}

export function generateAllQuestions(attemptSeed = 0) {
  const bank = [];
  let qId = 1;

  for (let w = 0; w < 10; w++) {
    for (let qInWorld = 0; qInWorld < 10; qInWorld++) {
      const area = CONTENT_AREAS[(w + qInWorld + attemptSeed) % CONTENT_AREAS.length];
      const s = generateSurvey({
        sets: w === 8 ? 3 : 2,
        shape: w === 5 ? (qInWorld % 2 === 0 ? 'subset' : 'disjoint') : 'overlap',
        contentArea: area.key,
        id: qId + attemptSeed * 1000,
      });

      const aName = s.names[0];
      const bName = s.names[1];
      const cName = s.sets === 3 ? s.names[2] : '';
      const tot = total(s);
      const a = nSet(s, 'A');
      const b = nSet(s, 'B');
      const overlap = s.counts[3];
      const onlyA = s.counts[1];
      const onlyB = s.counts[2];
      const neither = s.counts[0];
      const union = a + b - overlap;

      let qObj = null;

      switch (w) {
        case 0: { // World 0: sets-elements-universal-set
          const isTrueQ = qInWorld % 2 === 0;
          if (isTrueQ) {
            const correct = `n(ξ) = ${tot}`;
            qObj = createQuestion({
              id: qId,
              districtId: 0,
              category: 'SETS & UNIVERSAL SET',
              questionText: `In a survey of ${area.itemNoun}, the diagram shows the universal set ξ. How many ${area.itemNoun} are there altogether in ξ?`,
              correctAnswer: tot,
              distractors: [tot - neither, a + b, a],
              explanation: `The universal set ξ contains all elements in the rectangle: ${onlyA} + ${overlap} + ${onlyB} + ${neither} = ${tot} ${area.itemNoun}.`,
              hint1: "Look at the entire universal set rectangle ξ.",
              hint2: `Add all four regions inside the rectangle: ${onlyA} + ${overlap} + ${onlyB} + ${neither}.`,
              survey: s,
            });
          } else {
            qObj = createQuestion({
              id: qId,
              districtId: 0,
              category: 'SET MEMBERSHIP',
              questionText: `Set A represents ${area.itemNoun} in ${aName}. How many ${area.itemNoun} belong to Set A (n(A))?`,
              correctAnswer: a,
              distractors: [onlyA, a + b, overlap],
              explanation: `Set A includes both the "only A" region (${onlyA}) and the overlap (${overlap}): ${onlyA} + ${overlap} = ${a}.`,
              hint1: `Look at the entire circle for ${aName} (Set A).`,
              hint2: `Add the two regions inside Circle A: ${onlyA} + ${overlap} = ${a}.`,
              survey: s,
            });
          }
          break;
        }

        case 1: { // World 1: set-and-complement
          const compA = tot - a;
          qObj = createQuestion({
            id: qId,
            districtId: 1,
            category: 'COMPLEMENT A′',
            questionText: `There are ${tot} ${area.itemNoun} in ξ, and ${a} are in ${aName} (Set A). How many are NOT in Set A (find n(A′))?`,
            correctAnswer: compA,
            distractors: [b, onlyB, tot + a],
            explanation: `n(A′) is the complement of A: n(ξ) − n(A) = ${tot} − ${a} = ${compA} ${area.itemNoun}.`,
            hint1: "The complement A′ means everything in the universal set that is NOT inside circle A.",
            hint2: `Subtract n(A) from the universal total: ${tot} − ${a} = ${compA}.`,
            survey: s,
          });
          break;
        }

        case 2: { // World 2: read-two-set-venn
          const askOnly = qInWorld % 2 === 0;
          if (askOnly) {
            qObj = createQuestion({
              id: qId,
              districtId: 2,
              category: 'READ REGIONS',
              questionText: `A diagram shows: only ${aName} ${onlyA}, both ${overlap}, only ${bName} ${onlyB}, and neither ${neither}. How many ${area.itemNoun} belong ONLY to ${aName}?`,
              correctAnswer: onlyA,
              distractors: [a, overlap, b],
              explanation: `The "only ${aName}" region does not include the overlap: it is ${onlyA}.`,
              hint1: `Find the crescent shape of circle A that does not touch circle B.`,
              hint2: `Read the number in the left-hand crescent: ${onlyA}.`,
              survey: s,
              askedMask: 1,
            });
          } else {
            qObj = createQuestion({
              id: qId,
              districtId: 2,
              category: 'READ REGIONS',
              questionText: `From the survey diagram, how many ${area.itemNoun} are in NEITHER ${aName} nor ${bName}?`,
              correctAnswer: neither,
              distractors: [overlap, onlyA, tot],
              explanation: `The outside region represents elements in ξ that are in neither set: ${neither}.`,
              hint1: "Look outside both circles, inside the rectangle.",
              hint2: `The number in the corner of the rectangle is ${neither}.`,
              survey: s,
              askedMask: 0,
            });
          }
          break;
        }

        case 3: { // World 3: intersection-and
          const askOverlap = qInWorld % 2 === 0;
          if (askOverlap) {
            qObj = createQuestion({
              id: qId,
              districtId: 3,
              category: 'INTERSECTION (AND)',
              questionText: `How many ${area.itemNoun} are in BOTH ${aName} and ${bName} (find n(A ∩ B))?`,
              correctAnswer: overlap,
              distractors: [union, a + b, onlyA],
              explanation: `n(A ∩ B) is the intersection — where the two circles overlap: ${overlap}.`,
              hint1: "Intersection ∩ means 'AND' — look at the central football-shaped overlap.",
              hint2: `The overlap between circle A and circle B contains ${overlap}.`,
              survey: s,
              askedMask: 3,
            });
          } else {
            qObj = createQuestion({
              id: qId,
              districtId: 3,
              category: 'FIND ONLY FROM TOTAL',
              questionText: `n(${bName}) = ${b}, and ${overlap} belong to both. How many belong to ${bName} ONLY?`,
              correctAnswer: onlyB,
              distractors: [b, b + overlap, a],
              explanation: `Subtract the overlap from the total of set B: ${b} − ${overlap} = ${onlyB}.`,
              hint1: "Remember: Set B includes both the 'only B' zone and the overlap.",
              hint2: `Subtract the overlap: ${b} − ${overlap} = ${onlyB}.`,
              survey: s,
              askedMask: 2,
            });
          }
          break;
        }

        case 4: { // World 4: union-or-no-double-count
          qObj = createQuestion({
            id: qId,
            districtId: 4,
            category: 'UNION (OR)',
            questionText: `n(${aName}) = ${a}, n(${bName}) = ${b}, and ${overlap} are in both. How many ${area.itemNoun} are in ${aName} OR ${bName} (find n(A ∪ B))?`,
            correctAnswer: union,
            distractors: [a + b, tot, overlap],
            explanation: `Count the overlap once: n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${a} + ${b} − ${overlap} = ${union}.`,
            hint1: "Union ∪ means 'or, including both'. Do not double-count the overlap!",
            hint2: `Add both totals, then subtract the overlap once: ${a} + ${b} − ${overlap} = ${union}.`,
            survey: s,
          });
          break;
        }

        case 5: { // World 5: subset-and-disjoint
          if (s.shape === 'subset') {
            qObj = createQuestion({
              id: qId,
              districtId: 5,
              category: 'SUBSET (A ⊂ B)',
              questionText: `All ${overlap} members of ${aName} are also in ${bName}. Set B has ${overlap + onlyB} total members. How many are in at least one of the two?`,
              correctAnswer: overlap + onlyB,
              distractors: [overlap * 2 + onlyB, onlyB, overlap],
              explanation: `Since Set A is completely inside Set B (A ⊂ B), the union is simply all of Set B: ${overlap + onlyB}.`,
              hint1: "Set A is a subset of Set B — it is entirely contained inside B.",
              hint2: `Since everyone in A is already in B, the union equals n(B) = ${overlap + onlyB}.`,
              survey: s,
            });
          } else {
            // Disjoint
            const disjUnion = onlyA + onlyB;
            qObj = createQuestion({
              id: qId,
              districtId: 5,
              category: 'DISJOINT SETS',
              questionText: `${onlyA} ${area.itemNoun} are in ${aName} and ${onlyB} are in ${bName}, with NO ONE in both (disjoint sets). How many are in A or B?`,
              correctAnswer: disjUnion,
              distractors: [disjUnion + 5, Math.abs(onlyA - onlyB), tot],
              explanation: `When two sets are disjoint (A ∩ B = ∅), the overlap is 0: ${onlyA} + ${onlyB} = ${disjUnion}.`,
              hint1: "Since the circles do not overlap, there is no double-counting.",
              hint2: `Simply add the two separate sets: ${onlyA} + ${onlyB} = ${disjUnion}.`,
              survey: s,
            });
          }
          break;
        }

        case 6: { // World 6: fill-venn-from-totals
          qObj = createQuestion({
            id: qId,
            districtId: 6,
            category: 'FILL FROM TOTALS',
            questionText: `In a survey of ${tot} ${area.itemNoun}, n(${aName}) = ${a}, n(${bName}) = ${b}, and ${neither} are in neither. How many ${area.itemNoun} are in BOTH?`,
            correctAnswer: overlap,
            distractors: [neither, union, a + b],
            explanation: `Union n(A ∪ B) = ${tot} − ${neither} = ${union}. Overlap = (${a} + ${b}) − ${union} = ${overlap}.`,
            hint1: `First find the union by subtracting the ${neither} who are in neither from the total ${tot}.`,
            hint2: `Union is ${union}. Then subtract from the sum of the sets: (${a} + ${b}) − ${union} = ${overlap}.`,
            survey: s,
            askedMask: 3,
          });
          break;
        }

        case 7: { // World 7: shade-set-expressions
          const exprType = qInWorld % 3;
          if (exprType === 0) {
            // A ∩ B' (only A)
            qObj = createQuestion({
              id: qId,
              districtId: 7,
              category: 'SHADING EXPRESSIONS',
              questionText: `Which region count corresponds to the set expression A ∩ B′ (${aName} AND NOT ${bName})?`,
              correctAnswer: onlyA,
              distractors: [a, overlap, onlyB],
              explanation: `A ∩ B′ means elements in A that are NOT in B (the "only A" zone): ${onlyA}.`,
              hint1: "A ∩ B′ is inside circle A but outside circle B.",
              hint2: `That is the 'only A' zone: ${onlyA}.`,
              survey: s,
              askedMask: 1,
            });
          } else if (exprType === 1) {
            // (A ∪ B)' (neither)
            qObj = createQuestion({
              id: qId,
              districtId: 7,
              category: 'SHADING EXPRESSIONS',
              questionText: `What is the value of n((A ∪ B)′) — the complement of the union?`,
              correctAnswer: neither,
              distractors: [union, tot, overlap],
              explanation: `(A ∪ B)′ is everything in ξ outside both circles: ${neither}.`,
              hint1: "The complement of the union is the region outside both circles.",
              hint2: `That is the 'neither' zone: ${neither}.`,
              survey: s,
              askedMask: 0,
            });
          } else {
            // A' ∩ B (only B)
            qObj = createQuestion({
              id: qId,
              districtId: 7,
              category: 'SHADING EXPRESSIONS',
              questionText: `Which region count corresponds to A′ ∩ B (NOT in ${aName}, but IN ${bName})?`,
              correctAnswer: onlyB,
              distractors: [b, overlap, onlyA],
              explanation: `A′ ∩ B means elements in B that are NOT in A (the "only B" zone): ${onlyB}.`,
              hint1: "A′ ∩ B is inside circle B but outside circle A.",
              hint2: `That is the 'only B' zone: ${onlyB}.`,
              survey: s,
              askedMask: 2,
            });
          }
          break;
        }

        case 8: { // World 8: three-set-venn
          const c = s.counts[7]; // all 3
          const abOnly = s.counts[3];
          const acOnly = s.counts[5];
          const bcOnly = s.counts[6];
          const exactlyTwo = abOnly + acOnly + bcOnly;

          const isExactlyTwo = qInWorld % 2 === 0;
          if (isExactlyTwo) {
            qObj = createQuestion({
              id: qId,
              districtId: 8,
              category: 'THREE-SET VENN',
              questionText: `In the 3-circle diagram (${aName}, ${bName}, ${cName}), how many ${area.itemNoun} played EXACTLY TWO games?`,
              correctAnswer: exactlyTwo,
              distractors: [exactlyTwo + c, c, exactlyTwo + s.counts[1]],
              explanation: `Add the three pair-only regions: ${abOnly} + ${acOnly} + ${bcOnly} = ${exactlyTwo}. (Do NOT include the centre ${c}, which is 3 games!)`,
              hint1: "Look for the 3 pair petals between the circles, excluding the very centre.",
              hint2: `Add: ${abOnly} + ${acOnly} + ${bcOnly} = ${exactlyTwo}.`,
              survey: s,
            });
          } else {
            qObj = createQuestion({
              id: qId,
              districtId: 8,
              category: 'THREE-SET VENN',
              questionText: `How many ${area.itemNoun} belong to ALL THREE sets (n(A ∩ B ∩ C))?`,
              correctAnswer: c,
              distractors: [exactlyTwo, c + 4, s.counts[0]],
              explanation: `The central region where all three circles intersect has ${c} ${area.itemNoun}.`,
              hint1: "Look at the very centre where all three circles overlap.",
              hint2: `The centre count is ${c}.`,
              survey: s,
              askedMask: 7,
            });
          }
          break;
        }

        case 9: { // World 9: mixed-review
          // Draw from key topics
          const subType = qInWorld % 4;
          if (subType === 0) {
            qObj = createQuestion({
              id: qId,
              districtId: 9,
              category: 'MIXED REVIEW',
              questionText: `Given n(ξ) = ${tot}, n(${aName}) = ${a}, n(${bName}) = ${b}, and n(A ∩ B) = ${overlap}, how many ${area.itemNoun} are in the union n(A ∪ B)?`,
              correctAnswer: union,
              distractors: [a + b, tot, overlap],
              explanation: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${a} + ${b} − ${overlap} = ${union}.`,
              hint1: "Use the inclusion-exclusion formula: n(A) + n(B) − n(A ∩ B).",
              hint2: `${a} + ${b} − ${overlap} = ${union}.`,
              survey: s,
            });
          } else if (subType === 1) {
            qObj = createQuestion({
              id: qId,
              districtId: 9,
              category: 'MIXED REVIEW',
              questionText: `In the diagram, how many ${area.itemNoun} are in ${aName} but NOT in ${bName} (n(A ∩ B′))?`,
              correctAnswer: onlyA,
              distractors: [a, overlap, onlyB],
              explanation: `A ∩ B′ is the region inside A and outside B: ${onlyA}.`,
              hint1: "Find the region in circle A that doesn't overlap circle B.",
              hint2: `That is ${onlyA}.`,
              survey: s,
              askedMask: 1,
            });
          } else if (subType === 2) {
            qObj = createQuestion({
              id: qId,
              districtId: 9,
              category: 'MIXED REVIEW',
              questionText: `How many ${area.itemNoun} are in NEITHER ${aName} nor ${bName} ((A ∪ B)′)?`,
              correctAnswer: neither,
              distractors: [overlap, onlyA, tot],
              explanation: `The outside region inside the rectangle is ${neither}.`,
              hint1: "Look outside both circles.",
              hint2: `The outside count is ${neither}.`,
              survey: s,
              askedMask: 0,
            });
          } else {
            qObj = createQuestion({
              id: qId,
              districtId: 9,
              category: 'MIXED REVIEW',
              questionText: `What is the value of 1 unit in probability if we know the total is ${tot} and n(A ∩ B) = ${overlap}? How many are in BOTH sets?`,
              correctAnswer: overlap,
              distractors: [union, a, b],
              explanation: `The number of elements in both sets A ∩ B is ${overlap}.`,
              hint1: "Look at the intersection of A and B.",
              hint2: `The overlap is ${overlap}.`,
              survey: s,
              askedMask: 3,
            });
          }
          break;
        }

        default:
          break;
      }

      bank.push(qObj);
      qId++;
    }
  }

  return bank;
}

export function generateSessionQuestions(attemptSeed = 0) {
  return generateAllQuestions(attemptSeed);
}

const questionBank = generateAllQuestions();
export default questionBank;

