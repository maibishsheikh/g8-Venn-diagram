// src/components/simulations/FillTheDiagram.jsx
// S4 Binding: Multi-Step / Composite Construction — Fill Venn diagram from survey totals inside-out
import React, { useState } from 'react';
import VennCanvas from '../shared/VennCanvas.jsx';

const ROUNDS = [
  {
    roundNum: 1,
    sets: 2,
    tot: 50,
    names: ['Racing', 'Puzzle'],
    nA: 30,
    nB: 24,
    neither: 6,
    // Solution: union = 44, overlap = 30 + 24 - 44 = 10, onlyA = 20, onlyB = 14, neither = 6
    targetOverlap: 10,
    targetNeither: 6,
  },
  {
    roundNum: 2,
    sets: 2,
    tot: 40,
    names: ['Robotics', 'Chess'],
    nA: 22,
    nB: 20,
    neither: 8,
    // Solution: union = 32, overlap = 42 - 32 = 10, onlyA = 12, onlyB = 10, neither = 8
    targetOverlap: 10,
    targetNeither: 8,
  },
  {
    roundNum: 3,
    sets: 3,
    tot: 60,
    names: ['Racing', 'Puzzle', 'Strategy'],
    centreTarget: 2,
    abTarget: 4,
    acTarget: 3,
    bcTarget: 5,
    neitherTarget: 22,
  },
];

export default function FillTheDiagram({ onComplete, audioEnabled }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1 = set overlap, 2 = confirm onlys, 3 = set outside, 4 = sum check
  const [studentOverlap, setStudentOverlap] = useState(6);
  const [studentNeither, setStudentNeither] = useState(0);
  const [studentCentre, setStudentCentre] = useState(0);
  const [sumCheckStatus, setSumCheckStatus] = useState(null); // 'checking' | 'correct' | 'wrong'

  const round = ROUNDS[roundIdx];

  // Calculated regions for 2-set
  const calculatedOnlyA = Math.max(0, (round.nA || 30) - studentOverlap);
  const calculatedOnlyB = Math.max(0, (round.nB || 24) - studentOverlap);
  const currentSum = calculatedOnlyA + studentOverlap + calculatedOnlyB + studentNeither;

  function handleNextStep() {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      runSumCheck();
    }
  }

  function runSumCheck() {
    setSumCheckStatus('checking');
    setTimeout(() => {
      const isCorrect =
        round.sets === 2
          ? studentOverlap === round.targetOverlap && studentNeither === round.targetNeither
          : studentCentre === round.centreTarget;

      if (isCorrect) {
        setSumCheckStatus('correct');
        setTimeout(() => {
          if (roundIdx + 1 < ROUNDS.length) {
            setRoundIdx((prev) => prev + 1);
            setCurrentStep(1);
            setStudentOverlap(5);
            setStudentNeither(0);
            setSumCheckStatus(null);
          } else {
            // Done all rounds
            setSumCheckStatus('all-done');
          }
        }, 1200);
      } else {
        setSumCheckStatus('wrong');
      }
    }, 800);
  }

  const allRoundsDone = roundIdx >= ROUNDS.length - 1 && sumCheckStatus === 'all-done';

  return (
    <div className="station-wrap fill-the-diagram">
      {/* Station Header */}
      <div className="station-header">
        <div className="station-title-group">
          <h2 className="station-title">Station C · Fill the Diagram 📄</h2>
          <p className="station-desc">
            Construct inside-out from totals using animated subtraction.
          </p>
        </div>

        <div className="station-target-box">
          <span className="station-target-label">Round</span>
          <span className="station-target-num">{roundIdx + 1} / {ROUNDS.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Venn Diagram */}
        <div className="station-col-left">
          <VennCanvas
            descriptor={{
              sets: round.sets,
              names: round.names,
              universalTotal: round.tot,
              regions: round.sets === 2 ? [
                { mask: 0, label: 'Outside (Neither)', text: currentStep >= 3 ? String(studentNeither) : '?' },
                { mask: 1, label: `Only ${round.names[0]}`, text: currentStep >= 2 ? String(calculatedOnlyA) : '?' },
                { mask: 2, label: `Only ${round.names[1]}`, text: currentStep >= 2 ? String(calculatedOnlyB) : '?' },
                { mask: 3, label: 'Overlap (Both)', text: String(studentOverlap) },
              ] : [
                { mask: 0, label: 'Outside', text: '22' },
                { mask: 1, label: 'Only A', text: '10' },
                { mask: 2, label: 'Only B', text: '8' },
                { mask: 4, label: 'Only C', text: '6' },
                { mask: 3, label: 'AB only', text: '4' },
                { mask: 5, label: 'AC only', text: '3' },
                { mask: 6, label: 'BC only', text: '5' },
                { mask: 7, label: 'Centre (All 3)', text: String(studentCentre) },
              ],
            }}
            highlightMasks={
              currentStep === 1 ? [round.sets === 2 ? 3 : 7] :
              currentStep === 2 ? [1, 2] :
              currentStep === 3 ? [0] : [0, 1, 2, 3]
            }
          />

          {/* Sum Check Status Banner (Safe z-index, no clipping) */}
          {sumCheckStatus === 'correct' && (
            <div className="station-overlay-banner glass-card anim-bounce-in" style={{ background: 'rgba(15, 12, 40, 0.96)', border: '2px solid #22c55e' }}>
              <strong style={{ fontSize: '0.92rem', color: '#86efac' }}>🎉 Sum Check Passed! {currentSum} = n(ξ) {round.tot}</strong>
            </div>
          )}
          {sumCheckStatus === 'wrong' && (
            <div className="station-overlay-banner glass-card anim-bounce-in" style={{ background: 'rgba(15, 12, 40, 0.96)', border: '2px solid #ef4444' }}>
              <strong style={{ fontSize: '0.86rem', color: '#fca5a5' }}>⚠️ Mismatch: Regions sum to {currentSum}, but n(ξ) is {round.tot}! Adjust values.</strong>
            </div>
          )}
        </div>

        {/* Right Column: Step-by-Step Construction Panel */}
        <div className="station-col-right">
          {/* Survey Brief Card */}
          <div className="glass-card" style={{ borderColor: 'var(--blue)' }}>
            <span className="station-card-title" style={{ color: '#60a5fa' }}>
              Survey Clues Report
            </span>
            <div style={{ marginTop: '2px', fontSize: '0.8rem', lineHeight: '1.4' }}>
              <div>• Total Surveyed <strong>n(ξ) = {round.tot}</strong></div>
              {round.sets === 2 ? (
                <>
                  <div>• Plays {round.names[0]} <strong>n(A) = {round.nA}</strong> | Plays {round.names[1]} <strong>n(B) = {round.nB}</strong></div>
                  <div>• Neither game = <strong>{round.neither}</strong></div>
                </>
              ) : (
                <>
                  <div>• Centre = <strong>2</strong> | Pairs: AB=4, AC=3, BC=5 | Outside=22</div>
                </>
              )}
            </div>
          </div>

          {/* Step 1: Set Overlap */}
          {currentStep === 1 && (
            <div className="glass-card anim-slide-up" style={{ borderColor: 'var(--gold)' }}>
              <span className="station-card-title" style={{ color: 'var(--gold)' }}>
                Step 1: Set the Overlap First
              </span>
              <p style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.65)', margin: '2px 0 6px' }}>
                {round.sets === 2
                  ? `Overlap = (${round.nA} + ${round.nB}) − (${round.tot} − ${round.neither})`
                  : 'Set the centre where all three intersect.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ minHeight: '28px', width: '28px', padding: 0 }}
                  onClick={() => round.sets === 2 ? setStudentOverlap((o) => Math.max(0, o - 1)) : setStudentCentre((c) => Math.max(0, c - 1))}
                >
                  −
                </button>
                <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--gold)', minWidth: '32px', textAlign: 'center' }}>
                  {round.sets === 2 ? studentOverlap : studentCentre}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ minHeight: '28px', width: '28px', padding: 0 }}
                  onClick={() => round.sets === 2 ? setStudentOverlap((o) => o + 1) : setStudentCentre((c) => c + 1)}
                >
                  +
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: 'auto', minHeight: '28px', padding: '3px 10px', fontSize: '0.8rem' }}
                  onClick={handleNextStep}
                >
                  Lock Overlap ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Auto Subtraction for Onlys */}
          {currentStep === 2 && (
            <div className="glass-card anim-slide-up" style={{ borderColor: '#22c55e' }}>
              <span className="station-card-title" style={{ color: '#86efac' }}>
                Step 2: Subtraction Fills the "Only" Zones
              </span>
              <div style={{ marginTop: '4px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                <div>• Only {round.names[0]} = {round.nA} − {studentOverlap} = <strong>{calculatedOnlyA}</strong></div>
                <div>• Only {round.names[1]} = {round.nB} − {studentOverlap} = <strong>{calculatedOnlyB}</strong></div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '6px', minHeight: '28px', padding: '3px 10px', fontSize: '0.8rem' }}
                onClick={handleNextStep}
              >
                Confirm "Only" Zones ➔
              </button>
            </div>
          )}

          {/* Step 3: Outside Count */}
          {currentStep === 3 && (
            <div className="glass-card anim-slide-up" style={{ borderColor: '#60a5fa' }}>
              <span className="station-card-title" style={{ color: '#60a5fa' }}>
                Step 3: Place the Outside Count
              </span>
              <p style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.65)', margin: '2px 0 6px' }}>
                Set how many testers played neither game.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ minHeight: '28px', width: '28px', padding: 0 }}
                  onClick={() => setStudentNeither((n) => Math.max(0, n - 1))}
                >
                  −
                </button>
                <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#fff', minWidth: '32px', textAlign: 'center' }}>
                  {studentNeither}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ minHeight: '28px', width: '28px', padding: 0 }}
                  onClick={() => setStudentNeither((n) => n + 1)}
                >
                  +
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: 'auto', minHeight: '28px', padding: '3px 10px', fontSize: '0.8rem' }}
                  onClick={handleNextStep}
                >
                  Run Sum Check ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Sum Check Feedback */}
          {currentStep === 4 && (
            <div className="glass-card anim-slide-up">
              <span className="station-card-title" style={{ color: 'var(--gold)' }}>
                Step 4: Universal Sum Check
              </span>
              <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                {calculatedOnlyA} + {studentOverlap} + {calculatedOnlyB} + {studentNeither} = <strong>{currentSum}</strong>
              </div>
              <div style={{ marginTop: '2px', fontSize: '0.78rem', color: currentSum === round.tot ? '#86efac' : '#f87171' }}>
                Target: {round.tot}
              </div>
              <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ minHeight: '28px', padding: '3px 8px', fontSize: '0.78rem' }}
                  onClick={() => setCurrentStep(1)}
                >
                  ← Adjust
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ minHeight: '28px', padding: '3px 8px', fontSize: '0.78rem' }}
                  onClick={runSumCheck}
                >
                  Re-test Check
                </button>
              </div>
            </div>
          )}

          {/* Completion CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', gap: '6px' }}>
            {roundIdx > 0 && !allRoundsDone && (
              <button
                className="btn btn-outline btn-sm"
                style={{ flex: 1, minHeight: '34px', fontSize: '0.82rem' }}
                onClick={() => onComplete && onComplete(2)}
              >
                Complete Station C ✓
              </button>
            )}
            {allRoundsDone && (
              <button
                className="btn btn-green btn-sm"
                style={{ width: '100%', minHeight: '36px', fontSize: '0.88rem', fontWeight: 900 }}
                onClick={() => onComplete && onComplete(2)}
              >
                Complete Station C ✓ 🌟
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

