// src/components/IntroScreen.jsx
// Implements TRD §6 / PRD §8.0 (Screenshot 1 / S1 Binding)
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY_STEPS = [
  { id: 'wonder', name: 'Wonder', desc: 'Where does Zoe go?', icon: '🤔' },
  { id: 'story', name: 'Story', desc: 'A messy survey', icon: '📖' },
  { id: 'simulate', name: 'Simulate', desc: '4 interactive labs', icon: '🔬' },
  { id: 'practice', name: 'Practice', desc: '10 worlds & bosses', icon: '🎯' },
  { id: 'reflect', name: 'Reflect', desc: 'Review & scorecard', icon: '📓' },
];

export default function IntroScreen({ state, dispatch }) {
  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function handleSelectPhase(phaseKey) {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: phaseKey });
  }

  return (
    <div className="intro-wrap">
      {/* 1. Top Curriculum Chip */}
      <div className="intro-top-badge">
        ✨ Curriculum · Venn Diagrams Grade 8
      </div>

      {/* 2. Main Title */}
      <h1 className="intro-title">
        <span className="intro-title-venn">Venn</span>
        <span className="intro-title-quest">Quest</span>
      </h1>

      {/* 3. Subtitle */}
      <h2 className="intro-subtitle">
        Count overlapping groups without counting anyone twice
      </h2>

      {/* 4. Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-avatar" aria-label="Pixel the Penguin">
          🐧
        </div>
        <div className="intro-speech-bubble">
          Some testers play <strong>both</strong> games. Count the overlap <strong>once</strong>:{' '}
          <span className="intro-formula">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</span>
        </div>
      </div>

      {/* 5. Journey Card */}
      <div className="journey-card">
        <div className="journey-heading">
          YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START
        </div>
        <div className="journey-steps-container" role="list">
          {JOURNEY_STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                type="button"
                className={`journey-step-item ${state.phase === step.id ? 'active' : ''}`}
                onClick={() => handleSelectPhase(step.id)}
                aria-label={`${step.name}: ${step.desc}`}
                role="listitem"
              >
                <div className="journey-item-icon">{step.icon}</div>
                <div className="journey-item-text">
                  <div className="journey-item-title">{step.name}</div>
                  <div className="journey-item-desc">{step.desc}</div>
                </div>
              </button>
              {idx < JOURNEY_STEPS.length - 1 && (
                <div className="journey-arrow" aria-hidden="true">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6. CTA Button */}
      <button className="intro-cta-main" onClick={startFresh}>
        🚀 Begin Your Journey!
      </button>

      {/* 7. Bottom Info Chips */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <span className="bottom-card-icon">🎯</span>
          <span>100 Questions</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">⭕</span>
          <span>Two &amp; Three Sets</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">✨</span>
          <span>Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
