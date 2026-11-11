// src/components/quiz/QuestionRenderer.jsx
import React from 'react';
import './QuestionRenderer.css';
import VennCanvas from '../shared/VennCanvas.jsx';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
}) {
  if (!question) return null;

  const { category, questionText, options, visualData, hint1, hint2 } = question;
  const categoryTag = category || 'VENN DIAGRAMS';

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Category badge */}
      <div className="qr-category-badge">
        <span className="cat-icon">📊</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Live Venn diagram visual */}
      {visualData && (
        <div className="qr-visual">
          <VennCanvas descriptor={visualData} compact={true} />
        </div>
      )}

      {/* Options 2x2 grid */}
      <div className="options-grid">
        {options?.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => !isLocked && onAnswer(opt)}
            disabled={isLocked}
            aria-label={`Option: ${opt}`}
          >
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {/* Hints */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Actions Row */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary btn-sm qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

