// src/components/quiz/BossBattleModal.jsx
import React, { useState } from 'react';
import './BossBattleModal.css';
import QuestionRenderer from './QuestionRenderer.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { bossStartNarration, bossWinNarration } from '../../utils/narration.js';

export default function BossBattleModal({ boss, questions, onWin, onClose, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const question = questions[qIndex];

  function startBattle() {
    setStarted(true);
    narrate(bossStartNarration());
  }

  function handleAnswer(ans) {
    const isCorrect = String(ans).trim() === String(question.correctAnswer).trim();
    if (isCorrect) {
      sounds.correct();
      if (qIndex + 1 >= questions.length) {
        setWon(true);
        sounds.badge();
        narrate(bossWinNarration());
      } else {
        setQIndex(qIndex + 1);
      }
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setLost(true);
        sounds.defeat();
      }
    }
  }

  if (!started) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-bounce-in">
          <div className="boss-avatar-pulse">
            <span className="boss-emoji">{boss.emoji}</span>
          </div>
          <h2 className="boss-title">{boss.name}</h2>
          <p className="boss-desc">
            Answer {questions.length} Venn diagram questions correctly to defeat the boss and secure your report!
          </p>
          <div className="boss-lives-preview">
            Lives: {'❤️'.repeat(3)}
          </div>
          <div className="boss-reward-preview">
            Reward: <strong>{boss.reward}</strong> (+50 XP)
          </div>
          <div className="boss-actions">
            <button className="btn btn-primary" onClick={startBattle}>
              ⚔️ Begin Boss Battle!
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Back to World
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-celebrate">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(39, 174, 143, 0.4)' }}>
            <span className="boss-emoji">🏆</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--green-light)' }}>Boss Defeated!</h2>
          <p className="boss-desc">
            You conquered {boss.name} and claimed the <strong>{boss.reward}</strong>!
          </p>
          <button className="btn btn-green" onClick={onWin}>
            Claim Reward &amp; Continue ✨
          </button>
        </div>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-shake">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(235, 87, 87, 0.4)' }}>
            <span className="boss-emoji">💔</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--red-light)' }}>Battle Lost!</h2>
          <p className="boss-desc">
            You ran out of lives against {boss.name}. Review the diagram rules and try again!
          </p>
          <div className="boss-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setLives(3);
                setQIndex(0);
                setLost(false);
              }}
            >
              🔄 Retry Battle
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boss-modal-backdrop">
      <div className="boss-modal-card boss-question-view glass-card">
        <div className="boss-header-bar">
          <div className="boss-info-pill">
            <span>{boss.emoji}</span>
            <span>{boss.name}</span>
          </div>
          <div className="boss-lives-counter">
            {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
          </div>
          <div className="boss-q-progress">
            Q{qIndex + 1} / {questions.length}
          </div>
        </div>

        <QuestionRenderer
          question={question}
          onAnswer={handleAnswer}
          hintsShown={0}
          showHint={false}
          onHint={null}
          isLocked={false}
        />
      </div>
    </div>
  );
}

