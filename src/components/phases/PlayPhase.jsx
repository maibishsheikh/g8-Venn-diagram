// src/components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PlayPhase.css';
import KingdomMap from '../gamification/KingdomMap.jsx';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import BossBattleModal from '../quiz/BossBattleModal.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { DISTRICTS } from '../../data/questionBank.js';
import {
  playQuestionNarration,
  playCorrectNarration,
  playWrongNarration,
  districtCompleteNarration,
} from '../../utils/narration.js';

export default function PlayPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [showMap, setShowMap] = useState(state?.currentQuestion === 0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  const feedbackTimer = useRef(null);

  const qs = state?.questionSet || [];
  const qIdx = state?.currentQuestion || 0;
  const question = qs[qIdx];
  const distIdx = state?.currentDistrict || 0;
  const district = DISTRICTS[distIdx] || DISTRICTS[0];
  const qInDistrict = qIdx % 10;
  const isPlayDone = state?.phaseComplete?.play;

  // Narrate question text on change
  useEffect(() => {
    if (!showMap && !showBoss && question && !state?.showFeedback) {
      const timer = setTimeout(() => {
        narrate(playQuestionNarration(question.questionText));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [qIdx, showMap, showBoss, narrate, question, state?.showFeedback]);

  // Auto-dismiss popup after 2.2s
  useEffect(() => {
    if (state?.showFeedback) {
      feedbackTimer.current = setTimeout(() => {
        if (state?.showFeedback === 'correct') {
          dispatch({ type: 'CLEAR_FEEDBACK' });
          advanceQuestion();
        } else {
          dispatch({ type: 'CLEAR_FEEDBACK' });
        }
      }, 2200);
    }
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state?.showFeedback]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopAll();
    };
  }, [stopAll]);

  function handleAnswer(answer) {
    stopAll();
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      dispatch({ type: 'ANSWER_CORRECT' });
      narrate(playCorrectNarration((state?.streak || 0) + 1));
    } else {
      sounds.wrong();
      dispatch({ type: 'ANSWER_INCORRECT', payload: question.explanation });
      narrate(playWrongNarration());
      setHintsShown(0);
    }
  }

  function advanceQuestion() {
    setHintsShown(0);
    setShowHint(false);
    const nextIdx = qIdx + 1;

    if (nextIdx % 10 === 0 && nextIdx <= 100) {
      sounds.levelUp ? sounds.levelUp() : sounds.badge();
      narrate(districtCompleteNarration());
      dispatch({ type: 'NEXT_QUESTION' });
      setShowMap(true);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handleShowHint() {
    if (hintsShown < 2) {
      const nextCount = hintsShown + 1;
      setHintsShown(nextCount);
      setShowHint(nextCount);
      dispatch({ type: 'USE_HINT' });
    }
  }

  function handleSelectDistrict(idx) {
    stopAll();
    dispatch({ type: 'SELECT_DISTRICT', payload: idx });
    setShowMap(false);
  }

  function handleChallengeBoss() {
    stopAll();
    setShowBoss(true);
  }

  function handleJumpToReflect() {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: 'reflect' });
  }

  return (
    <div className="play-wrap">
      {/* Top Banner Navigation */}
      <div className="play-sub-header">
        <button
          className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? '← Resume Quest' : '🗺️ World Map'}
        </button>

        {!showMap && (
          <div className="play-district-indicator">
            <span className="dist-icon">{district.icon}</span>
            <span className="dist-name">{district.name}</span>
            <span className="dist-progress">Q{qInDistrict + 1} / 10</span>
          </div>
        )}

        {!showMap && district.boss && (
          <button
            className="btn btn-outline btn-sm play-boss-btn"
            onClick={() => setShowBoss(true)}
          >
            ⚔️ Boss Battle
          </button>
        )}
      </div>

      {/* Main Content: Map or Question */}
      <div className="play-main-view">
        {showMap ? (
          <div className="anim-slide-up" style={{ width: '100%' }}>
            <KingdomMap
              districtScores={state?.districtScores}
              districtCorrect={state?.districtCorrect}
              unlockedWorlds={state?.unlockedWorlds}
              currentDistrict={distIdx}
              totalStars={state?.totalStars}
              onSelectDistrict={handleSelectDistrict}
              onChallengeBoss={handleChallengeBoss}
              onJumpToReflect={handleJumpToReflect}
            />
          </div>
        ) : (
          question && (
            <QuestionRenderer
              question={question}
              onAnswer={handleAnswer}
              hintsShown={hintsShown}
              showHint={showHint}
              onHint={handleShowHint}
              isLocked={Boolean(state?.showFeedback)}
              onPrev={() => dispatch({ type: 'PREV_QUESTION' })}
              onNext={advanceQuestion}
              canPrev={qInDistrict > 0}
            />
          )
        )}
      </div>

      {/* Feedback Overlay Popup */}
      {state?.showFeedback && (
        <FeedbackOverlay
          isCorrect={state.showFeedback === 'correct'}
          explanation={state.feedbackMsg}
          onContinue={() => {
            dispatch({ type: 'CLEAR_FEEDBACK' });
            if (state.showFeedback === 'correct') advanceQuestion();
          }}
        />
      )}

      {/* Boss Battle Modal */}
      {showBoss && district.boss && (
        <BossBattleModal
          boss={district.boss}
          questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
          onWin={() => {
            setShowBoss(false);
            dispatch({ type: 'UNLOCK_BADGE', payload: 'bug_squashed' });
          }}
          onClose={() => setShowBoss(false)}
          audioEnabled={state?.audioEnabled}
        />
      )}
    </div>
  );
}

