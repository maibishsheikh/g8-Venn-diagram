// src/components/phases/reflect/ReflectRecap.jsx
// Conforms to TRD §8 (Reflect Step 1 · Quick Check)
import React, { useState } from 'react';
import VennCanvas from '../../shared/VennCanvas.jsx';

const RECAP_PROMPTS = [
  {
    stepId: 1,
    title: "Question 1 of 3 · Double Counting",
    promptText: "Jack added 20 + 22 for Racing and Puzzle. Tap the zone he counted twice.",
    targetMasks: [3], // both
    explanation: "Correct! The overlap zone (both games) was counted in Racing and counted again in Puzzle.",
    wrongHint: "Not quite — think about which group gets counted twice when adding total Racing + total Puzzle.",
  },
  {
    stepId: 2,
    title: "Question 2 of 3 · The Outside Zone",
    promptText: "The zones add up to 34, but 40 testers were surveyed. Tap the zone that is missing.",
    targetMasks: [0], // neither
    explanation: "Spot on! The outside zone contains the 6 testers who were surveyed but played neither game.",
    wrongHint: "Look outside the two circles inside the universal set rectangle ξ.",
  },
  {
    stepId: 3,
    title: "Question 3 of 3 · 'And' versus 'Or'",
    promptText: "Tap every zone where a tester played Racing or Puzzle (or both).",
    targetMasks: [1, 2, 3], // union
    isMultiSelect: true,
    explanation: "Spot on! Union (Racing or Puzzle) spans all three interior zones: Racing only, both, and Puzzle only.",
    wrongHint: "Remember: 'or' means either game or both games. Tap all the zones inside the circles.",
  },
];

export default function ReflectRecap({
  recapIndex = 0,
  onNextQuestion,
  onSkipToScorecard,
}) {
  const [selectedMasks, setSelectedMasks] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const prompt = RECAP_PROMPTS[recapIndex] || RECAP_PROMPTS[0];

  function handleRegionTap(mask) {
    if (isChecked && feedback?.ok) return;

    if (prompt.isMultiSelect) {
      if (selectedMasks.includes(mask)) {
        setSelectedMasks(selectedMasks.filter((m) => m !== mask));
      } else {
        setSelectedMasks([...selectedMasks, mask]);
      }
    } else {
      setSelectedMasks([mask]);
    }
    // Clear feedback if user changes selection
    setFeedback(null);
    setIsChecked(false);
  }

  function handleCheck() {
    if (selectedMasks.length === 0) return;

    let isCorrect = false;
    if (prompt.isMultiSelect) {
      const hasAll = prompt.targetMasks.every((m) => selectedMasks.includes(m));
      const hasNoExtras = selectedMasks.every((m) => prompt.targetMasks.includes(m));
      isCorrect = hasAll && hasNoExtras;
    } else {
      isCorrect = selectedMasks.length === 1 && prompt.targetMasks.includes(selectedMasks[0]);
    }

    if (isCorrect) {
      setFeedback({ ok: true, msg: prompt.explanation });
      setIsChecked(true);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 2) {
        // Reveal after 2 wrong attempts
        setSelectedMasks(prompt.targetMasks);
        setFeedback({
          ok: false,
          msg: `The correct zone is highlighted. ${prompt.explanation}`,
        });
        setIsChecked(true);
      } else {
        setFeedback({
          ok: false,
          msg: prompt.wrongHint,
        });
        setIsChecked(false);
      }
    }
  }

  function handleNext() {
    onNextQuestion && onNextQuestion();
  }

  return (
    <div className="reflect-recap-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '12px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {prompt.title}
        </span>
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
          {prompt.promptText}
        </h2>
      </div>

      <div style={{ width: '100%', maxWidth: '540px' }} role="group" aria-label="Venn Diagram region selector">
        <VennCanvas
          descriptor={{
            sets: 2,
            names: ['Racing', 'Puzzle'],
            regions: [
              { mask: 0, label: 'Neither', text: '6' },
              { mask: 1, label: 'Only Racing', text: '12' },
              { mask: 2, label: 'Only Puzzle', text: '14' },
              { mask: 3, label: 'Both', text: '8' },
            ],
          }}
          mode="tap-region"
          highlightMasks={selectedMasks}
          onRegionTap={handleRegionTap}
        />
      </div>

      {feedback && (
        <div
          className="glass-card anim-bounce-in"
          style={{
            padding: '10px 18px',
            textAlign: 'center',
            maxWidth: '540px',
            borderColor: feedback.ok ? 'var(--green)' : 'var(--red)',
            background: feedback.ok ? 'rgba(39, 174, 143, 0.25)' : 'rgba(235, 87, 87, 0.25)',
          }}
          role="status"
          aria-live="polite"
        >
          <span style={{ fontWeight: 800, color: feedback.ok ? 'var(--green-light)' : 'var(--red-light)' }}>
            {feedback.msg}
          </span>
        </div>
      )}

      {/* Control row with Check / Next primary button */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
        {!isChecked ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{ minWidth: '130px', padding: '10px 24px' }}
            disabled={selectedMasks.length === 0}
            onClick={handleCheck}
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{ minWidth: '130px', padding: '10px 24px', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            onClick={handleNext}
          >
            Next ➔
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline"
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          onClick={onSkipToScorecard}
        >
          Skip to Scorecard
        </button>
      </div>
    </div>
  );
}
