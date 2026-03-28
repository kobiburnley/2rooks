import React from 'react'

export default function ExplanationPanel({ opening, currentMoveIndex, totalMoves }) {
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

  const getMoveLabel = () => {
    if (isStart) return 'Opening Overview'
    if (isComplete) return `Complete · ${totalMoves} moves`
    const moveNum = Math.ceil(currentMoveIndex / 2)
    const isWhiteTurn = currentMoveIndex % 2 === 0
    return `Move ${moveNum} · ${isWhiteTurn ? 'White' : 'Black'} to play`
  }

  const getExplanation = () => {
    if (isStart) {
      return null // show description instead
    }
    if (isComplete) {
      return null
    }
    // Show explanation for the NEXT move to be played
    const move = opening.moves[currentMoveIndex]
    if (!move) return null
    return move.explanation || 'No explanation provided.'
  }

  const getNextMoveSan = () => {
    if (isStart || isComplete) return null
    return opening.moves[currentMoveIndex]?.san
  }

  const explanation = getExplanation()
  const nextSan = getNextMoveSan()

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
