// src/components/phases/reflect/ReflectScorecard.jsx
// Conforms to TRD §8 (Reflect Step 3 · Scorecard)
import React from 'react';
import { BADGES } from '../../../utils/badgeEngine.js';

export default function ReflectScorecard({
  state,
  onPlayAgain,
  onGoHome,
  onBack,
}) {
  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars = state?.totalStars || 0;
  const xp = state?.xp || 0;
  const maxStreak = state?.maxStreak || 0;
  const earnedBadges = state?.badges || [];

  return (
    <div
      className="trophy-card glass-card"
      style={{
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <div>
        <span style={{ fontSize: '2.8rem' }}>🏆</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 900,
            color: 'var(--gold)',
            margin: '6px 0 2px',
          }}
        >
          Playtest Lab Certification
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', margin: 0 }}>
          Mastery summary across Venn diagram concepts &amp; surveys
        </p>
      </div>

      {/* Three stat tiles: correct / XP / best streak */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {/* Correct Tile */}
        <div
          className="trophy-stat"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '12px 6px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold)' }}>
            Correct
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              color: '#fff',
              margin: '4px 0',
            }}
          >
            {totalCorrect}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            of 100
          </span>
        </div>

        {/* XP Tile */}
        <div
          className="trophy-stat"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '12px 6px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
            Total XP
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              color: '#fff',
              margin: '4px 0',
            }}
          >
            {xp}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Points
          </span>
        </div>

        {/* Best Streak Tile */}
        <div
          className="trophy-stat"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '12px 6px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80' }}>
            Best Streak
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              color: '#fff',
              margin: '4px 0',
            }}
          >
            {maxStreak} 🔥
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            In a row
          </span>
        </div>
      </div>

      {/* The single line ⭐ {stars} / 30 */}
      <div
        style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#ffd54f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <span>⭐</span>
        <span>{totalStars} / 30 Stars Earned</span>
      </div>

      {/* Closed 'Badges unlocked (n)' disclosure */}
      <details
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '10px 14px',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <summary
          style={{
            fontWeight: 800,
            fontSize: '0.88rem',
            color: 'var(--gold-light)',
            userSelect: 'none',
          }}
        >
          Badges unlocked ({earnedBadges.length})
        </summary>

        <div
          className="badge-list"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          {BADGES.map((b) => {
            const isUnlocked = earnedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  background: isUnlocked ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isUnlocked ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isUnlocked ? '#86efac' : 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            );
          })}
        </div>
      </details>

      {/* Action Buttons: Play Again and Home (and Back) */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '6px',
        }}
      >
        <button
          type="button"
          className="btn btn-outline"
          style={{ minHeight: '48px', minWidth: '90px', padding: '10px 18px' }}
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          style={{ minHeight: '48px', minWidth: '140px', padding: '10px 24px' }}
          onClick={onPlayAgain}
        >
          🔄 Play Again
        </button>

        <button
          type="button"
          className="btn btn-outline"
          style={{ minHeight: '48px', minWidth: '120px', padding: '10px 22px' }}
          onClick={onGoHome}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}
