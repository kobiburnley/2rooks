import React from 'react'
import type { Opening } from '../types'

interface ExplanationPanelProps {
  opening: Opening | null
  currentMoveIndex: number
  totalMoves: number
}

export default function ExplanationPanel({ opening, currentMoveIndex, totalMoves }: ExplanationPanelProps) {
  if (!opening) {
    return (
      <div className="explanation-panel">
        <div className="explanation-text" style={{ color: '#888' }}>
          Select an opening above to begin.
        </div>
      </div>
    )
  }

  const isComplete = currentMoveIndex >= totalMoves
  const isStart = currentMoveIndex === 0

  const getMoveLabel = (): string => {
    if (isStart) return 'Opening Overview'
    if (isComplete) return `Complete · ${totalMoves} moves`
    const moveNum = Math.ceil(currentMoveIndex / 2)
    const isWhiteTurn = currentMoveIndex % 2 === 0
    return `Move ${moveNum} · ${isWhiteTurn ? 'White' : 'Black'} to play`
  }

  const explanation = (!isStart && !isComplete)
    ? (opening.moves[currentMoveIndex]?.explanation || 'No explanation provided.')
    : null

  const nextSan = (!isStart && !isComplete)
    ? opening.moves[currentMoveIndex]?.san
    : null

  return (
    <div className="explanation-panel">
      <div className="move-label">{getMoveLabel()}</div>

      {isStart && (
        <>
          <div className="opening-title">{opening.name}</div>
          <div className="explanation-text">{opening.description}</div>
        </>
      )}

      {isComplete && (
        <>
          <div className="opening-title">{opening.name}</div>
          <div className="complete-badge">Opening complete! ✓</div>
        </>
      )}

      {!isStart && !isComplete && explanation && (
        <>
          {nextSan && (
            <div style={{ marginBottom: '6px' }}>
              <span style={{
                background: '#0f3460',
                color: '#e94560',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}>
                {nextSan}
              </span>
            </div>
          )}
          <div className="explanation-text">{explanation}</div>
        </>
      )}
    </div>
  )
}
