// src/components/simulations/AuditTheAnalyst.jsx
// S4 Binding: Error-Detective — Replay a rival analyst's flawed count, spot the error, and repair it
import React, { useState, useMemo } from 'react';
import VennCanvas from '../shared/VennCanvas.jsx';
import { generateSurvey, seedErrorInDiagram } from '../../utils/vennMath.js';

const ERROR_ROUNDS = [
  { id: 1, misconceptionId: 'double-count-overlap', name: 'Rival Analyst Bob' },
  { id: 2, misconceptionId: 'n-as-only', name: 'Rival Analyst Chuck' },
  { id: 3, misconceptionId: 'forget-outside', name: 'Rival Analyst Dave' },
  { id: 4, misconceptionId: 'and-or-swap', name: 'Rival Analyst Eve' },
];

export default function AuditTheAnalyst({ onComplete, audioEnabled }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedErrorStep, setSelectedErrorStep] = useState(null);
  const [isRepaired, setIsRepaired] = useState(false);
  const [repairedValue, setRepairedValue] = useState(0);

  const roundConfig = ERROR_ROUNDS[roundIdx];

  const survey = useMemo(() => {
    return generateSurvey({
      sets: 2,
      shape: 'overlap',
      contentArea: roundIdx % 2 === 0 ? 'games' : 'clubs',
      id: 20 + roundIdx,
    });
  }, [roundIdx]);

  const auditData = useMemo(() => {
    return seedErrorInDiagram(survey, roundConfig.misconceptionId);
  }, [survey, roundConfig]);

  function handleSelectStep(stepObj, idx) {
    setSelectedErrorStep(idx);
    if (stepObj.isFlawed) {
      setRepairedValue(auditData.correctValue);
    }
  }

  function handleRepair() {
    setIsRepaired(true);
    setTimeout(() => {
      if (roundIdx + 1 < ERROR_ROUNDS.length) {
        setRoundIdx((r) => r + 1);
        setSelectedErrorStep(null);
        setIsRepaired(false);
      } else {
        // All rounds complete
        setIsRepaired('all-done');
      }
    }, 1400);
  }

  const allDone = isRepaired === 'all-done';

  return (
    <div className="station-wrap audit-the-analyst">
      {/* Station Header */}
      <div className="station-header">
        <div className="station-title-group">
          <h2 className="station-title">Station D · Audit the Analyst 🔍</h2>
          <p className="station-desc">
            Spot the rival analyst's flawed step in the log and repair the survey!
          </p>
        </div>

        <div className="station-target-box">
          <span className="station-target-label">Audit</span>
          <span className="station-target-num">{roundIdx + 1} / {ERROR_ROUNDS.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Venn Diagram Visual */}
        <div className="station-col-left">
          <VennCanvas
            descriptor={{
              sets: 2,
              names: survey.names,
              regions: [
                { mask: 0, label: 'Outside', text: isRepaired ? String(survey.counts[0]) : String(auditData.flawedCounts[0]) },
                { mask: 1, label: `Only ${survey.names[0]}`, text: isRepaired ? String(survey.counts[1]) : String(auditData.flawedCounts[1]) },
                { mask: 2, label: `Only ${survey.names[1]}`, text: isRepaired ? String(survey.counts[2]) : String(auditData.flawedCounts[2]) },
                { mask: 3, label: 'Both', text: isRepaired ? String(survey.counts[3]) : String(auditData.flawedCounts[3]) },
              ],
            }}
            highlightMasks={isRepaired ? [0, 1, 2, 3] : []}
          />

          {isRepaired && (
            <div className="station-success-modal glass-card anim-bounce-in" style={{ background: 'rgba(15, 12, 40, 0.95)', border: '2px solid #22c55e' }}>
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>🛡️</span>
              <h3 style={{ color: '#86efac', fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '6px 0 2px' }}>
                {allDone ? 'All 4 Survey Audits Repaired!' : 'Report Successfully Repaired!'}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.8rem', margin: 0, maxWidth: '360px' }}>
                {auditData.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Replay Steps Audit */}
        <div className="station-col-right">
          <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
            <span className="station-card-title" style={{ color: '#ffd54f' }}>
              {roundConfig.name}'s Calculation Log
            </span>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)', margin: '1px 0 6px' }}>
              Tap the step where the error occurred:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {auditData.replaySteps.map((s, idx) => {
                const isSelected = selectedErrorStep === idx;
                const isTheFlaw = s.isFlawed;

                return (
                  <button
                    key={idx}
                    className={`btn btn-sm ${isSelected ? (isTheFlaw ? 'btn-primary' : 'btn-outline') : 'btn-outline'}`}
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '5px 10px',
                      minHeight: '28px',
                      fontSize: '0.78rem',
                      borderColor: isSelected && !isTheFlaw ? '#ef4444' : undefined,
                    }}
                    onClick={() => handleSelectStep(s, idx)}
                  >
                    <span style={{ fontWeight: 800, marginRight: '4px' }}>Step {s.step}:</span>
                    <span>{s.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Repair Action */}
          {selectedErrorStep !== null && (
            <div className="glass-card anim-slide-up">
              {auditData.replaySteps[selectedErrorStep]?.isFlawed ? (
                <>
                  <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.86rem' }}>
                    🎯 Flawed Step Detected!
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.7)', margin: '3px 0 6px' }}>
                    {auditData.explanation}
                  </p>
                  <button
                    className="btn btn-green btn-sm"
                    style={{ minHeight: '30px', padding: '3px 12px', fontSize: '0.82rem' }}
                    onClick={handleRepair}
                  >
                    Apply Fix ({repairedValue}) &amp; Recalculate ➔
                  </button>
                </>
              ) : (
                <div style={{ color: '#fca5a5', fontSize: '0.8rem' }}>
                  ❌ That step is mathematically sound. Check the other steps in the log!
                </div>
              )}
            </div>
          )}

          {/* Completion CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', gap: '6px' }}>
            {roundIdx > 0 && !allDone && (
              <button
                className="btn btn-outline btn-sm"
                style={{ flex: 1, minHeight: '34px', fontSize: '0.82rem' }}
                onClick={() => onComplete && onComplete(3)}
              >
                Complete Station D ✓
              </button>
            )}
            {allDone && (
              <button
                className="btn btn-green btn-sm"
                style={{ width: '100%', minHeight: '36px', fontSize: '0.88rem', fontWeight: 900 }}
                onClick={() => onComplete && onComplete(3)}
              >
                Complete Station D ✓ 🌟
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

