// src/components/gamification/KingdomMap.jsx
// Conforms strictly to TRD §7 / Screenshot 2 (Practice Phase — World Map)
import React from 'react';
import './KingdomMap.css';
import { WORLDS } from '../../config/worlds.config.js';
import { calcStars } from '../../utils/scoring.js';

export default function KingdomMap({
  districtScores = [],
  districtCorrect = [],
  unlockedWorlds = [],
  currentDistrict = 0,
  onSelectDistrict,
  onChallengeBoss,
  onJumpToReflect,
  totalStars = 0,
}) {
  const currentWorld = WORLDS[currentDistrict] || WORLDS[0];
  const bossName = currentWorld?.boss?.name || 'Chief Auditor';

  // Compute stars total if not passed explicitly
  const computedStars =
    totalStars ||
    districtScores.reduce((sum, sc) => {
      if (sc === null || sc === undefined) return sum;
      return sum + calcStars(sc);
    }, 0);

  return (
    <div className="play-map-card">
      {/* Title row */}
      <div className="play-map-head">
        <div className="play-map-titles">
          <h2 className="play-map-title">Venn Diagram Game Worlds</h2>
          <div className="play-map-sub">
            10 Themed Worlds · Need 4/10 Correct to Unlock Next World
          </div>
        </div>

        <div className="play-star-pill" aria-label={`Total stars: ${computedStars} out of 30`}>
          <span className="star-icon">⭐</span> {computedStars} / 30
        </div>
      </div>

      {/* 5 × 2 World Grid */}
      <div className="world-grid" role="list">
        {WORLDS.map((world, idx) => {
          const isCurrent = idx === currentDistrict;
          const isCompleted = districtScores[idx] !== null && districtScores[idx] !== undefined;
          // Unlocked if in unlockedWorlds array, or world 0, or already completed
          const isUnlocked =
            unlockedWorlds[idx] !== undefined ? unlockedWorlds[idx] : idx === 0 || isCompleted;

          const correct = districtCorrect[idx] || 0;
          const stars = isCompleted ? calcStars(districtScores[idx]) : 0;
          const qStart = idx * 10 + 1;
          const qEnd = idx * 10 + 10;

          return (
            <div
              key={world.id}
              className={`world-card ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              onClick={() => {
                if (isUnlocked && onSelectDistrict) {
                  onSelectDistrict(idx);
                }
              }}
              role="listitem"
              tabIndex={isUnlocked ? 0 : -1}
              aria-label={`World ${idx + 1}: ${world.name}. Status: ${
                !isUnlocked ? 'Locked' : isCurrent ? 'Play' : isCompleted ? `${stars} stars, ${correct} of 10` : 'Ready'
              }`}
            >
              {/* Header row: W{n} and Q{start}–{end} */}
              <div className="world-card-top">
                <span className="world-badge">W{idx + 1}</span>
                <span className="world-q-range">
                  Q{qStart}–{qEnd}
                </span>
              </div>

              {/* World Icon */}
              <div className="world-icon" aria-hidden="true">
                {isUnlocked ? world.emoji : '🔒'}
              </div>

              {/* World Name */}
              <div className="world-name" title={world.name}>
                {world.name}
              </div>

              {/* Status */}
              <div className="world-status">
                {!isUnlocked ? (
                  <span className="status-locked">Locked</span>
                ) : isCurrent ? (
                  <span className="status-current">Play →</span>
                ) : isCompleted ? (
                  <span className="status-completed">
                    ⭐ {stars}/3 · {correct}/10
                  </span>
                ) : (
                  <span className="status-ready">Ready</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons under Grid */}
      <div className="world-actions">
        <button
          type="button"
          className="world-action-btn boss-btn"
          onClick={onChallengeBoss}
        >
          👑 Boss Battle: {bossName}
        </button>

        <button
          type="button"
          className="world-action-btn reflect-btn"
          onClick={onJumpToReflect}
        >
          📓 Jump to Reflect Phase →
        </button>
      </div>
    </div>
  );
}
