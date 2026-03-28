import React from 'react'
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

const MoveControls = observer(({ store }: { store: OpeningStore }) => {
  const { currentMoveIndex, totalMoves, hintState } = store

  const canGoBack    = currentMoveIndex > 0
  const canGoForward = currentMoveIndex < totalMoves
  const isComplete   = currentMoveIndex >= totalMoves

  const hintLabel = hintState === 'piece' ? 'Hint (where)' : hintState === 'destination' ? 'Hide' : 'Hint'
  const hintIcon  = hintState === 'destination' ? '◉' : '💡'

  return (
    <div className="move-controls">
      <button
        className="ctrl-btn"
        onClick={() => store.goBack()}
        disabled={!canGoBack}
        aria-label="Go back one move"
      >
        <span className="btn-icon">←</span>
        <span className="btn-label">Back</span>
      </button>

      <button
        className={`ctrl-btn hint-btn${hintState ? ' active' : ''}`}
        onClick={() => store.cycleHint()}
        disabled={isComplete}
        aria-label="Show hint"
      >
        <span className="btn-icon">{hintIcon}</span>
        <span className="btn-label">{hintLabel}</span>
      </button>

      <button
        className="ctrl-btn"
        onClick={() => store.goForward()}
        disabled={!canGoForward}
        aria-label="Go forward one move"
      >
        <span className="btn-icon">→</span>
        <span className="btn-label">Forward</span>
      </button>

      <button
        className="ctrl-btn reset-btn"
        onClick={() => store.reset()}
        aria-label="Reset opening"
      >
        <span className="btn-icon">⟳</span>
        <span className="btn-label">Reset</span>
      </button>
    </div>
  )
})

export default MoveControls
