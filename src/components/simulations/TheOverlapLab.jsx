// src/components/simulations/TheOverlapLab.jsx
// S4 Binding: Concept Discovery Lab — Pure Free-Play with animated tokens, draggable circles, and inclusion-exclusion demonstration
import React, { useState, useMemo } from 'react';
import VennCanvas from '../shared/VennCanvas.jsx';
import TokenCrowd from '../shared/TokenCrowd.jsx';
import { getGeometry2, getGeometry3 } from '../../utils/vennGeometry.js';
import { NAME_POOL } from '../../data/namePool.js';
import { generateTokenSlots } from '../../utils/tokenLayout.js';
import { nSet, nAnd, nOr, nNeither } from '../../utils/vennMath.js';

const INITIAL_COUNTS_2 = [4, 6, 8, 5]; // outside: 4, only A: 6, only B: 8, both: 5
const INITIAL_COUNTS_3 = [4, 4, 3, 3, 3, 2, 2, 2];

export default function TheOverlapLab({ onComplete, audioEnabled }) {
  const [isThreeSets, setIsThreeSets] = useState(false);
  const [overlapState, setOverlapState] = useState('overlap'); // 'overlap' | 'disjoint' | 'subset'
  const [customDistance, setCustomDistance] = useState(150);
  const [counts, setCounts] = useState(INITIAL_COUNTS_2);
  const [selectedToken, setSelectedToken] = useState(null);
  const [highlightedRegion, setHighlightedRegion] = useState(null);
  const [countingStep, setCountingStep] = useState(0); // 0 = idle, 1 = circle A, 2 = circle B, 3 = subtract overlap, 4 = done
  const [exploredFeatures, setExploredFeatures] = useState({
    changedOverlap: false,
    flippedToken: false,
    tappedRegion: false,
    ranCountIt: false,
  });

  const survey = useMemo(() => {
    return {
      sets: isThreeSets ? 3 : 2,
      names: isThreeSets ? ['Racing', 'Puzzle', 'Strategy'] : ['Racing', 'Puzzle'],
      shape: overlapState,
      counts,
    };
  }, [isThreeSets, overlapState, counts]);

  const geometry = useMemo(() => {
    if (isThreeSets) return getGeometry3();
    return getGeometry2(overlapState, customDistance);
  }, [isThreeSets, overlapState, customDistance]);

  // Generate tokens based on counts
  const rawTokens = useMemo(() => {
    const list = [];
    let idx = 0;
    const names = NAME_POOL;
    for (let m = 0; m < counts.length; m++) {
      for (let i = 0; i < counts[m]; i++) {
        list.push({
          id: `t_${idx}`,
          name: names[idx % names.length],
          avatar: ['🧑🏻', '👧🏽', '🧑🏾', '👧🏻', '🧑🏼', '👧🏾'][idx % 6],
          mask: m,
        });
        idx++;
      }
    }
    return list;
  }, [counts]);

  const positionedTokens = useMemo(() => {
    return generateTokenSlots(rawTokens, geometry, 24);
  }, [rawTokens, geometry]);

  // Derived counts
  const countA = nSet(survey, 'A');
  const countB = nSet(survey, 'B');
  const countOverlap = nAnd(survey, ['A', 'B']);
  const countUnion = nOr(survey, ['A', 'B']);
  const countOutside = nNeither(survey);

  function handleSetOverlapState(state) {
    setOverlapState(state);
    if (state === 'disjoint') {
      setCustomDistance(280);
      setCounts([counts[0], counts[1] + counts[3], counts[2], 0]);
    } else if (state === 'subset') {
      setCounts([counts[0], 0, counts[2], counts[3] + counts[1]]);
    } else {
      setCustomDistance(150);
      setCounts(INITIAL_COUNTS_2);
    }
    setExploredFeatures((prev) => ({ ...prev, changedOverlap: true }));
  }

  function handleFlipMembership(token, bit) {
    const newMask = token.mask ^ bit;
    const newCounts = [...counts];
    newCounts[token.mask] = Math.max(0, newCounts[token.mask] - 1);
    newCounts[newMask] = (newCounts[newMask] || 0) + 1;
    setCounts(newCounts);
    setSelectedToken((prev) => (prev ? { ...prev, mask: newMask } : null));
    setExploredFeatures((prev) => ({ ...prev, flippedToken: true }));
  }

  function handleHighlightRegion(mask, name) {
    setHighlightedRegion(highlightedRegion === mask ? null : mask);
    setExploredFeatures((prev) => ({ ...prev, tappedRegion: true }));
  }

  function runCountIt() {
    setCountingStep(1);
    setExploredFeatures((prev) => ({ ...prev, ranCountIt: true }));
    setTimeout(() => setCountingStep(2), 900);
    setTimeout(() => setCountingStep(3), 1800);
    setTimeout(() => setCountingStep(4), 2800);
    setTimeout(() => setCountingStep(0), 4500);
  }

  const isExplorationDone =
    exploredFeatures.changedOverlap &&
    exploredFeatures.flippedToken &&
    exploredFeatures.tappedRegion &&
    exploredFeatures.ranCountIt;

  return (
    <div className="station-wrap overlap-lab">
      {/* Station Header */}
      <div className="station-header">
        <div className="station-title-group">
          <h2 className="station-title">Station A · The Overlap Lab 🧪</h2>
          <p className="station-desc">
            Pure Free-Play: Drag circles, flip memberships, and observe how regions update live!
          </p>
        </div>

        {/* Live Counters Readout */}
        <div className="station-target-box">
          <span className="station-target-label">n(A)=<strong style={{ color: '#fff' }}>{countA}</strong></span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span className="station-target-label">n(B)=<strong style={{ color: '#fff' }}>{countB}</strong></span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span className="station-target-label">∩=<strong style={{ color: '#ffd54f' }}>{countOverlap}</strong></span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span className="station-target-label">∪=<strong style={{ color: '#86efac' }}>{countUnion}</strong></span>
        </div>
      </div>

      {/* Main Grid: Responsive Diagram on Left, Controls on Right */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Diagram */}
        <div className="station-col-left">
          <VennCanvas
            descriptor={{
              sets: isThreeSets ? 3 : 2,
              names: survey.names,
              shape: overlapState,
              regions: [
                { mask: 0, label: 'Outside', text: String(countOutside) },
                { mask: 1, label: `Only ${survey.names[0]}`, text: String(counts[1] || 0) },
                { mask: 2, label: `Only ${survey.names[1]}`, text: String(counts[2] || 0) },
                { mask: 3, label: 'Both', text: String(countOverlap) },
                ...(isThreeSets
                  ? [
                      { mask: 4, label: `Only ${survey.names[2]}`, text: String(counts[4] || 0) },
                      { mask: 5, label: 'AC only', text: String(counts[5] || 0) },
                      { mask: 6, label: 'BC only', text: String(counts[6] || 0) },
                      { mask: 7, label: 'All 3', text: String(counts[7] || 0) },
                    ]
                  : []),
              ],
            }}
            customGeometry={geometry}
            highlightMasks={
              countingStep === 1 ? [1, 3] :
              countingStep === 2 ? [2, 3] :
              countingStep === 3 ? [3] :
              highlightedRegion !== null ? [highlightedRegion] : []
            }
            onRegionTap={(mask) => handleHighlightRegion(mask)}
          >
            {/* Tokens Layer */}
            <TokenCrowd
              tokens={positionedTokens}
              selectedTokenId={selectedToken?.id}
              onTokenTap={(t) => setSelectedToken(t)}
            />
          </VennCanvas>

          {/* "Count It!" Visual Banner Overlay (Safe z-index, no clipping) */}
          {countingStep > 0 && (
            <div className="station-overlay-banner glass-card anim-bounce-in" style={{ background: 'rgba(15, 12, 40, 0.96)', border: '2px solid #f59e0b' }}>
              {countingStep === 1 && <span style={{ color: '#60a5fa', fontWeight: 800 }}>Step 1: Count Set A = <strong>{countA}</strong> (including overlap)</span>}
              {countingStep === 2 && <span style={{ color: '#fb923c', fontWeight: 800 }}>Step 2: Add Set B = <strong>{countB}</strong> — overlap counted TWICE!</span>}
              {countingStep === 3 && <span style={{ color: '#f87171', fontWeight: 800 }}>Step 3: Subtract Overlap Once (−{countOverlap}) so no one is double-counted!</span>}
              {countingStep === 4 && <span style={{ color: '#86efac', fontWeight: 800 }}>n(A ∪ B) = {countA} + {countB} − {countOverlap} = {countUnion} ✅</span>}
            </div>
          )}
        </div>

        {/* Right Column: Lab Controls */}
        <div className="station-col-right">
          {/* Overlap Shape Modes */}
          <div className="glass-card">
            <span className="station-card-title" style={{ color: 'var(--gold)' }}>
              Circle Overlap Mode
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '4px' }}>
              <button
                className={`btn btn-sm ${overlapState === 'overlap' && !isThreeSets ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => { setIsThreeSets(false); handleSetOverlapState('overlap'); }}
              >
                Standard Overlap
              </button>
              <button
                className={`btn btn-sm ${overlapState === 'disjoint' ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => { setIsThreeSets(false); handleSetOverlapState('disjoint'); }}
              >
                Disjoint (Apart)
              </button>
              <button
                className={`btn btn-sm ${overlapState === 'subset' ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => { setIsThreeSets(false); handleSetOverlapState('subset'); }}
              >
                Subset (A ⊂ B)
              </button>
              <button
                className={`btn btn-sm ${isThreeSets ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => { setIsThreeSets(true); setCounts(INITIAL_COUNTS_3); }}
              >
                3 Circles 🔺
              </button>
            </div>
          </div>

          {/* Highlight Region Buttons */}
          <div className="glass-card">
            <span className="station-card-title" style={{ color: '#60a5fa' }}>
              Highlight Region (Tap to Glow)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '4px' }}>
              <button
                className={`btn btn-sm ${highlightedRegion === 1 ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleHighlightRegion(1)}
              >
                A Only
              </button>
              <button
                className={`btn btn-sm ${highlightedRegion === 3 ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleHighlightRegion(3)}
              >
                A ∩ B (Both)
              </button>
              <button
                className={`btn btn-sm ${highlightedRegion === 2 ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleHighlightRegion(2)}
              >
                B Only
              </button>
              <button
                className={`btn btn-sm ${highlightedRegion === 0 ? 'btn-primary' : 'btn-outline'}`}
                style={{ minHeight: '30px', padding: '3px 6px', fontSize: '0.8rem' }}
                onClick={() => handleHighlightRegion(0)}
              >
                Outside (Neither)
              </button>
            </div>
          </div>

          {/* Action: Count It! Animation */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Inclusion-Exclusion Demo
              </div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                Watch overlap get subtracted once
              </div>
            </div>
            <button
              className="btn btn-green btn-sm"
              style={{ minHeight: '32px', padding: '4px 12px', fontSize: '0.82rem', flexShrink: 0 }}
              onClick={runCountIt}
              disabled={countingStep > 0}
            >
              ▶ Count It!
            </button>
          </div>

          {/* Selected Token Inspector */}
          {selectedToken && (
            <div className="glass-card anim-slide-up" style={{ borderColor: 'var(--gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{selectedToken.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{selectedToken.name}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)', display: 'block' }}>
                    Zone: {selectedToken.mask === 3 ? 'Both A & B' : selectedToken.mask === 1 ? 'Only A' : selectedToken.mask === 2 ? 'Only B' : 'Neither'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className={`btn btn-sm ${(selectedToken.mask & 1) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ minHeight: '28px', padding: '2px 8px', fontSize: '0.76rem', flex: 1 }}
                  onClick={() => handleFlipMembership(selectedToken, 1)}
                >
                  {(selectedToken.mask & 1) ? '✓ Plays ' : '+ Add '} {survey.names[0]}
                </button>
                <button
                  className={`btn btn-sm ${(selectedToken.mask & 2) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ minHeight: '28px', padding: '2px 8px', fontSize: '0.76rem', flex: 1 }}
                  onClick={() => handleFlipMembership(selectedToken, 2)}
                >
                  {(selectedToken.mask & 2) ? '✓ Plays ' : '+ Add '} {survey.names[1]}
                </button>
              </div>
            </div>
          )}

          {/* Completion CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
            <button
              className={`btn ${isExplorationDone ? 'btn-green' : 'btn-primary'} btn-sm`}
              style={{ width: '100%', minHeight: '36px', fontSize: '0.88rem', fontWeight: 900 }}
              onClick={() => onComplete && onComplete(0)}
            >
              Complete Station A ✓ {isExplorationDone ? '🌟' : ''}
            </button>
            {!isExplorationDone && (
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)', textAlign: 'center', marginTop: '4px' }}>
                💡 Tip: Try overlap modes, flip testers, highlight regions, or run "Count It!"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

