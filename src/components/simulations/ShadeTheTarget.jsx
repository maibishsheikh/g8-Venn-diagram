// src/components/simulations/ShadeTheTarget.jsx
// S4 Binding: Build-to-Target Challenge — Tap regions to match set expression cards
import React, { useState, useMemo } from 'react';
import VennCanvas from '../shared/VennCanvas.jsx';
import TokenCrowd from '../shared/TokenCrowd.jsx';
import { getGeometry2 } from '../../utils/vennGeometry.js';
import { generateTokenSlots } from '../../utils/tokenLayout.js';
import { exprRegions, exprToString } from '../../utils/vennMath.js';
import { NAME_POOL } from '../../data/namePool.js';

const TARGET_ROUNDS = [
  {
    expr: { op: 'and', left: { op: 'set', letter: 'A' }, right: { op: 'not', letter: 'B' } },
    title: "A ∩ B′",
    desc: "In A AND NOT in B (Only A)",
    hint: "Select the region inside circle A that does not touch circle B.",
  },
  {
    expr: { op: 'and', left: { op: 'set', letter: 'A' }, right: { op: 'set', letter: 'B' } },
    title: "A ∩ B",
    desc: "In A AND in B (Intersection / Both)",
    hint: "Select the central overlap where circle A and circle B meet.",
  },
  {
    expr: { op: 'not', letter: 'A' },
    title: "A′",
    desc: "Complement of A (NOT in Set A)",
    hint: "Select every region in the universal set that is outside circle A.",
  },
  {
    expr: { op: 'or', left: { op: 'set', letter: 'A' }, right: { op: 'set', letter: 'B' } },
    title: "A ∪ B",
    desc: "In A OR in B (Union / At least one)",
    hint: "Select all regions inside circle A or circle B (3 regions).",
  },
  {
    expr: { op: 'and', left: { op: 'not', letter: 'A' }, right: { op: 'set', letter: 'B' } },
    title: "A′ ∩ B",
    desc: "NOT in A AND in B (Only B)",
    hint: "Select the crescent of circle B that does not touch circle A.",
  },
  {
    expr: { op: 'not', sub: { op: 'or', left: { op: 'set', letter: 'A' }, right: { op: 'set', letter: 'B' } } },
    title: "(A ∪ B)′",
    desc: "Neither A nor B (Outside both)",
    hint: "Select the background region outside both circles inside the rectangle.",
  },
];

const FIXED_COUNTS = [4, 5, 6, 4]; // 0: outside, 1: only A, 2: only B, 3: both

export default function ShadeTheTarget({ onComplete, audioEnabled }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [shadedMasks, setShadedMasks] = useState([]);
  const [showSuccessRound, setShowSuccessRound] = useState(false);

  const round = TARGET_ROUNDS[currentRoundIdx];
  const targetMasks = useMemo(() => exprRegions(round.expr, 2), [round]);

  const geometry = useMemo(() => getGeometry2('overlap'), []);

  // 19 tester tokens
  const rawTokens = useMemo(() => {
    const list = [];
    let idx = 0;
    const names = NAME_POOL;
    for (let m = 0; m < FIXED_COUNTS.length; m++) {
      for (let i = 0; i < FIXED_COUNTS[m]; i++) {
        list.push({
          id: `st_${idx}`,
          name: names[idx % names.length],
          avatar: ['🧑🏻', '👧🏽', '🧑🏾', '👧🏻', '🧑🏼', '👧🏾'][idx % 6],
          mask: m,
        });
        idx++;
      }
    }
    return list;
  }, []);

  const positionedTokens = useMemo(() => {
    return generateTokenSlots(rawTokens, geometry, 26);
  }, [rawTokens, geometry]);

  const targetTokenIds = useMemo(() => {
    return rawTokens.filter((t) => targetMasks.includes(t.mask)).map((t) => t.id);
  }, [rawTokens, targetMasks]);

  const shadedTokenIds = useMemo(() => {
    return rawTokens.filter((t) => shadedMasks.includes(t.mask)).map((t) => t.id);
  }, [rawTokens, shadedMasks]);

  // Check if shadedMasks match targetMasks
  const isMatch = useMemo(() => {
    if (shadedMasks.length !== targetMasks.length) return false;
    return targetMasks.every((m) => shadedMasks.includes(m));
  }, [shadedMasks, targetMasks]);

  function handleToggleRegion(mask) {
    if (showSuccessRound) return;
    const next = shadedMasks.includes(mask)
      ? shadedMasks.filter((m) => m !== mask)
      : [...shadedMasks, mask];
    setShadedMasks(next);

    // If it matches exactly, advance
    if (next.length === targetMasks.length && targetMasks.every((m) => next.includes(m))) {
      setShowSuccessRound(true);
      setTimeout(() => {
        if (currentRoundIdx + 1 < TARGET_ROUNDS.length) {
          setCurrentRoundIdx((prev) => prev + 1);
          setShadedMasks([]);
          setShowSuccessRound(false);
        } else {
          // Finished all rounds!
          setShowSuccessRound(true);
        }
      }, 1200);
    }
  }

  const allCompleted = currentRoundIdx >= TARGET_ROUNDS.length - 1 && isMatch;

  return (
    <div className="station-wrap shade-the-target">
      {/* Station Header */}
      <div className="station-header">
        <div className="station-title-group">
          <h2 className="station-title">Station B · Shade the Target 🖍️</h2>
          <p className="station-desc">
            Tap or paint regions to match the set expression card!
          </p>
        </div>

        {/* Round Progress Tracker */}
        <div className="station-target-box">
          <span className="station-target-label">Round</span>
          <span className="station-target-num">{currentRoundIdx + 1} / {TARGET_ROUNDS.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Venn Canvas */}
        <div className="station-col-left">
          <VennCanvas
            descriptor={{
              sets: 2,
              names: ['Racing', 'Puzzle'],
              shape: 'overlap',
              regions: [
                { mask: 0, label: 'Outside', text: '4' },
                { mask: 1, label: 'Only A', text: '5' },
                { mask: 2, label: 'Only B', text: '6' },
                { mask: 3, label: 'Both', text: '4' },
              ],
            }}
            mode="paint"
            shadeMasks={shadedMasks}
            onRegionTap={handleToggleRegion}
          >
            <TokenCrowd
              tokens={positionedTokens}
              highlightedTokenIds={shadedTokenIds}
              outlinedTokenIds={targetTokenIds}
            />
          </VennCanvas>

          {showSuccessRound && (
            <div className="station-success-modal glass-card anim-bounce-in" style={{ background: 'rgba(15, 12, 40, 0.95)', border: '2px solid #22c55e' }}>
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>🎯</span>
              <h3 style={{ color: '#86efac', fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '6px 0 2px' }}>
                {allCompleted ? 'All Set Expressions Mastered!' : 'Target Locked & Matched!'}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.82rem', margin: 0 }}>
                {round.title}: {round.desc}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Mission Card & Feedback */}
        <div className="station-col-right">
          {/* Target Expression Card */}
          <div className="glass-card" style={{ borderColor: 'var(--gold)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(22, 18, 48, 0.9) 100%)' }}>
            <span className="station-card-title" style={{ color: 'var(--gold)' }}>
              Target Set Expression
            </span>
            <div style={{ fontSize: 'clamp(1.4rem, 1.8vw, 1.8rem)', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '2px 0 4px' }}>
              {round.title}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#ffd54f', fontWeight: 700 }}>
              {round.desc}
            </div>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)', margin: '4px 0 0 0' }}>
              💡 Hint: {round.hint}
            </p>
          </div>

          {/* Quick-tap Region Toggles */}
          <div className="glass-card">
            <span className="station-card-title" style={{ color: '#60a5fa' }}>
              Tap Regions to Paint / Unpaint
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '4px' }}>
              <button
                className={`btn btn-sm ${shadedMasks.includes(1) ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleToggleRegion(1)}
              >
                {shadedMasks.includes(1) ? '✓ ' : ''}Only A (Left)
              </button>
              <button
                className={`btn btn-sm ${shadedMasks.includes(3) ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleToggleRegion(3)}
              >
                {shadedMasks.includes(3) ? '✓ ' : ''}A ∩ B (Both)
              </button>
              <button
                className={`btn btn-sm ${shadedMasks.includes(2) ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleToggleRegion(2)}
              >
                {shadedMasks.includes(2) ? '✓ ' : ''}Only B (Right)
              </button>
              <button
                className={`btn btn-sm ${shadedMasks.includes(0) ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleToggleRegion(0)}
              >
                {shadedMasks.includes(0) ? '✓ ' : ''}Outside (Neither)
              </button>
            </div>
          </div>

          {/* Status feedback */}
          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: isMatch ? '#86efac' : 'rgba(255, 255, 255, 0.7)' }}>
              {isMatch
                ? '✅ Excellent! Shaded regions match the expression perfectly.'
                : 'Tap regions until your shaded areas match the target expression.'}
            </div>
          </div>

          {/* Completion CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', gap: '6px' }}>
            {currentRoundIdx > 0 && !allCompleted && (
              <button
                className="btn btn-outline btn-sm"
                style={{ flex: 1, minHeight: '34px', fontSize: '0.82rem' }}
                onClick={() => onComplete && onComplete(1)}
              >
                Complete Station B ✓
              </button>
            )}
            {allCompleted && (
              <button
                className="btn btn-green btn-sm"
                style={{ width: '100%', minHeight: '36px', fontSize: '0.88rem', fontWeight: 900 }}
                onClick={() => onComplete && onComplete(1)}
              >
                Complete Station B ✓ 🌟
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

