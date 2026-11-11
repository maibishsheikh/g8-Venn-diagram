// src/components/phases/WonderPhase.jsx
// Sizing & structure match reference WonderPhase exactly
import React, { useEffect, useState } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import VennCanvas from '../shared/VennCanvas.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🎮', '📊', '⭕', '🏷️', '⭐', '🏆', '🎯', '💡', '🐧', '✨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [zoePlaced, setZoePlaced] = useState(false);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  function handleDropZoe(mask) {
    if (mask === 3) {
      sounds.correct();
      setZoePlaced(true);
    } else {
      sounds.click();
    }
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">🎮</div>
          <h1 className="wonder-title headline">The Overlapping Survey Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">20 Racing + 22 Puzzle = 42? ➔ Surveyed = 40!</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              At the studio, <strong className="wonder-em">20 playtesters played Racing</strong> and <strong className="wonder-em">22 played Puzzle</strong>…
            </p>
            <p className="body-text wonder-q">
              Why does the total add up to 42 when only <strong className="wonder-em">40 testers</strong> were surveyed in total, and where does <span className="wonder-highlight">Zoe go if she plays both</span>?
            </p>
          </div>

          {/* Interactive Mini-Hook Canvas */}
          <div className="wonder-interactive-box">
            <VennCanvas
              descriptor={{
                sets: 2,
                names: ['Racing', 'Puzzle'],
                regions: [
                  { mask: 0, text: '' },
                  { mask: 1, text: '' },
                  { mask: 2, text: '' },
                  { mask: 3, text: zoePlaced ? '👧🏽 Zoe (Both!)' : 'Tap overlap' },
                ],
              }}
              mode="tap-region"
              compact={true}
              highlightMasks={zoePlaced ? [3] : []}
              onRegionTap={handleDropZoe}
            />
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot
              mood={zoePlaced ? 'celebrate' : 'curious'}
              message={
                zoePlaced
                  ? "Brilliant! The overlap lets Zoe belong to both circles at the exact same time! 🐧✨"
                  : "Let's investigate how counting overlapping groups without double-counting works!"
              }
              size="sm"
            />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
