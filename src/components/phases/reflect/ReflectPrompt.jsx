// src/components/phases/reflect/ReflectPrompt.jsx
// Conforms to TRD §8 (Reflect Step 2 · Think It Over)
import React, { useState } from 'react';

const CHIPS = [
  "I counted someone twice",
  "I forgot the outside",
  "I mixed up and / or",
];

export default function ReflectPrompt({ onBack, onNext }) {
  const [selectedChips, setSelectedChips] = useState([]);
  const [journalText, setJournalText] = useState('');

  function handleToggleChip(chip) {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
      // Append chip to textarea if not already present
      if (!journalText.includes(chip)) {
        setJournalText((prev) => (prev ? `${prev}. ${chip}` : chip));
      }
    }
  }

  return (
    <div
      className="reflect-prompt-wrap"
      style={{
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '2.5rem' }}>💭</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 900,
            color: '#fff',
            marginTop: '4px',
          }}
        >
          Which survey made you stop and recount, and what did you miss the first time?
        </h2>
      </div>

      {/* Quick-insert chips in role="toolbar" */}
      <div
        className="glass-card"
        style={{ padding: '16px' }}
        role="toolbar"
        aria-label="Reflection quick-insert options"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {CHIPS.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                className={`quick-insert-btn btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  minHeight: '48px',
                  borderRadius: '999px',
                  padding: '8px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                }}
                onClick={() => handleToggleChip(chip)}
              >
                {isSelected ? '✓ ' : '+ '}{chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Reflection Journal */}
      <div className="glass-card" style={{ padding: '14px' }}>
        <label
          htmlFor="reflect-textarea"
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--gold)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          Analyst Notes (Optional):
        </label>
        <textarea
          id="reflect-textarea"
          rows={3}
          className="reflect-textarea"
          placeholder="e.g. When counting players who played Racing or Puzzle, I had to subtract the overlap..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '10px',
            color: '#fff',
            padding: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '6px' }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ minHeight: '48px', minWidth: '100px', padding: '10px 20px' }}
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          style={{ minHeight: '48px', minWidth: '140px', padding: '10px 24px' }}
          onClick={onNext}
        >
          Next: Scorecard ➔
        </button>
      </div>
    </div>
  );
}
