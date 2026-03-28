import React from 'react'

export default function MoveControls({
  onBack,
  onForward,
  onHint,
  onReset,
  hintState,
  currentMoveIndex,
  totalMoves,
}) {
  const canGoBack = currentMoveIndex > 0
  const canGoForward = currentMoveIndex < totalMoves
  const isComplete = currentMoveIndex >= totalMoves

  const getHintLabel = () => {
    if (hintState === 'piece') return 'Hint (where)'
    if (hintState === 'destination') return 'Hide'
    return 'Hint'
  }

  const getHintIcon = () => {
    if (hintState === 'destination') return '◉'
    return '💡'
  }

  return (
    <div className="move-controls">
      <button
        className="ctrl-btn"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back one move"
        title="Back"
      >
        <span className="btn-icon">←</span>
        <span className="btn-label">Back</span>
      </button>

      <button
        className={`ctrl-btn hint-btn${hintState ? ' active' : ''}`}
        onClick={onHint}
        disabled={isComplete}
        aria-label="Show hint"
        title="Hint"
      >
        <span className="btn-icon">{getHintIcon()}</span>
        <span className="btn-label">{getHintLabel()}</span>
      </button>

      <button
        className="ctrl-btn"
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Go forward one move"
        title="Forward"
      >
        <span className="btn-icon">→</span>
        <span className="btn-label">Forward</span>
      </button>

      <button
        className="ctrl-btn reset-btn"
        onClick={onReset}
        aria-label="Reset opening"
        title="Reset"
      >
        <span className="btn-icon">⟳</span>
        <span className="btn-label">Reset</span>
      </button>
    </div>
  )
}
