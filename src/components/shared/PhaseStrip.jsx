// src/components/shared/PhaseStrip.jsx
// S1 Binding Requirement: 5 phase names on one single line across all viewports 320px+
import React from 'react';
import './PhaseStrip.css';

export const PHASES = [
  { key: 'wonder',   icon: '🔍', label: 'Wonder' },
  { key: 'story',    icon: '📖', label: 'Story' },
  { key: 'simulate', icon: '🧪', label: 'Simulate' },
  { key: 'play',     icon: '🎮', label: 'Practice' },
  { key: 'reflect',  icon: '📓', label: 'Reflect' },
];

export default function PhaseStrip({
  currentPhase,
  phaseComplete = {},
  onSelectPhase,
  compact = false,
}) {
  return (
    <nav
      className={`phase-strip ${compact ? 'phase-strip--compact' : ''}`}
      role="navigation"
      aria-label="Learning journey phases"
    >
      {PHASES.map((p) => {
        const isActive = p.key === currentPhase;
        const isDone = Boolean(phaseComplete[p.key]);

        return (
          <button
            key={p.key}
            type="button"
            className={`phase-strip__item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
            onClick={() => onSelectPhase && onSelectPhase(p.key)}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${p.label} phase${isDone ? ' (Completed)' : ''}`}
          >
            <span className="phase-strip__icon" aria-hidden="true">
              {isDone ? '✓' : p.icon}
            </span>
            <span className="phase-strip__label">{p.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

