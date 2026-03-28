
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

const ExplanationPanel = observer(({ store }: { store: OpeningStore }) => {
  const { selectedOpening, currentMoveIndex, totalMoves, lastMove } = store

  if (!selectedOpening) {
    return (
      <div className="explanation-panel">
        <div className="explanation-text" style={{ color: '#888' }}>
          Select an opening above to begin.
        </div>
      </div>
    )
  }

  const isStart    = currentMoveIndex === 0
  const isComplete = currentMoveIndex >= totalMoves

  const getMoveLabel = () => {
    if (isStart) return 'Opening Overview'
    const lastIndex = currentMoveIndex - 1
    const moveNum = Math.floor(lastIndex / 2) + 1
    const color = lastIndex % 2 === 0 ? 'White' : 'Black'
    if (isComplete) return `Complete · ${color} played move ${moveNum}`
    return `Move ${moveNum} · ${color}`
  }

  return (
    <div className="explanation-panel">
      <div className="move-label">{getMoveLabel()}</div>

      {isStart && (
        <>
          <div className="opening-title">{selectedOpening.name}</div>
          <div className="explanation-text">{selectedOpening.description}</div>
        </>
      )}

      {isComplete && <div className="complete-badge">Opening complete! ✓</div>}

      {!isStart && lastMove && (
        <>
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
              {lastMove.san}
            </span>
          </div>
          <div className="explanation-text">
            {lastMove.explanation || 'No explanation provided.'}
          </div>
        </>
      )}
    </div>
  )
})

export default ExplanationPanel
