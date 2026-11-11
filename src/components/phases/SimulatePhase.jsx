// src/components/phases/SimulatePhase.jsx
// S4 Binding: 4 Animated, Interactive, non-MCQ simulation stations
import React, { useEffect, useRef } from 'react';
import './SimulatePhase.css';
import TheOverlapLab from '../simulations/TheOverlapLab.jsx';
import ShadeTheTarget from '../simulations/ShadeTheTarget.jsx';
import FillTheDiagram from '../simulations/FillTheDiagram.jsx';
import AuditTheAnalyst from '../simulations/AuditTheAnalyst.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { simStationIntro } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, label: 'A', name: 'Overlap Lab',       icon: '🧪', desc: 'Drag circles & count overlaps live' },
  { id: 1, label: 'B', name: 'Shade the Target',  icon: '🖍️', desc: 'Paint regions to match expressions' },
  { id: 2, label: 'C', name: 'Fill Diagram',      icon: '📄', desc: 'Construct Venn from survey totals' },
  { id: 3, label: 'D', name: 'Audit Analyst',     icon: '🔍', desc: 'Find & repair rival survey errors' },
];

export default function SimulatePhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const prevStation = useRef(-1);

  const s = state?.currentSimStation || 0;

  useEffect(() => {
    if (prevStation.current !== s) {
      prevStation.current = s;
      stopAll();
      setTimeout(() => narrate(simStationIntro(s)), 400);
    }
  }, [s, narrate, stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  function handleStationComplete(stationIdx) {
    stopAll();
    dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });
    if (stationIdx < 3) {
      setTimeout(() => dispatch({ type: 'ADVANCE_SIM_STATION' }), 600);
    } else {
      setTimeout(() => dispatch({ type: 'SET_PHASE', payload: 'play' }), 900);
    }
  }

  function goToPrev() {
    stopAll();
    dispatch({ type: 'PREV_SIM_STATION' });
  }

  function goToNext() {
    stopAll();
    if (s < 3) {
      dispatch({ type: 'ADVANCE_SIM_STATION' });
    } else {
      dispatch({ type: 'SET_PHASE', payload: 'play' });
    }
  }

  return (
    <div className="sim-wrap">
      <div className="sim-card glass-card">
        {/* Stations Tab Bar */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map((st) => {
            const isCurrent = s === st.id;
            const isDone = state?.simStationsComplete?.[st.id];
            const isUnlocked = st.id <= s || state?.simStationsComplete?.[st.id - 1];

            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={isCurrent}
                className={`sim-tab ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  if (!isUnlocked && st.id > s) return;
                  stopAll();
                  if (st.id > s) {
                    for (let i = 0; i < st.id - s; i++) dispatch({ type: 'ADVANCE_SIM_STATION' });
                  } else if (st.id < s) {
                    for (let i = 0; i < s - st.id; i++) dispatch({ type: 'PREV_SIM_STATION' });
                  }
                }}
                disabled={!isUnlocked && st.id > s}
                aria-label={`Station ${st.label}: ${st.name}`}
              >
                <span className="tab-icon">{isDone ? '✅' : st.icon}</span>
                <span className="tab-name">{st.name}</span>
              </button>
            );
          })}
        </div>

        {/* Station Content Area */}
        <div className="sim-station-area" role="tabpanel" key={s}>
          {s === 0 && <TheOverlapLab onComplete={() => handleStationComplete(0)} audioEnabled={state?.audioEnabled} />}
          {s === 1 && <ShadeTheTarget onComplete={() => handleStationComplete(1)} audioEnabled={state?.audioEnabled} />}
          {s === 2 && <FillTheDiagram onComplete={() => handleStationComplete(2)} audioEnabled={state?.audioEnabled} />}
          {s === 3 && <AuditTheAnalyst onComplete={() => handleStationComplete(3)} audioEnabled={state?.audioEnabled} />}
        </div>

        {/* Footer Navigation */}
        <div className="sim-footer">
          <button className="btn btn-outline btn-sm" onClick={goToPrev} disabled={s === 0}>
            ← Previous Station
          </button>
          <div className="sim-progress-dots">
            {STATIONS.map((st) => (
              <span
                key={st.id}
                className={`sim-dot ${s === st.id ? 'active' : ''} ${state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              />
            ))}
          </div>
          {s < 3 ? (
            <button
              className={state?.simStationsComplete?.[s] ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
              onClick={goToNext}
              disabled={!state?.simStationsComplete?.[s]}
            >
              Next Station →
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={goToNext}
              disabled={!state?.simStationsComplete?.[3]}
            >
              Practice! 🎮
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
