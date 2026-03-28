
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

export const ProgressBar = observer(({ store }: { store: OpeningStore }) => {
  const pct = store.totalMoves > 0
    ? Math.round((store.currentMoveIndex / store.totalMoves) * 100)
    : 0
  return (
    <div className="progress-bar-area">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">{store.currentMoveIndex}/{store.totalMoves}</div>
    </div>
  )
})

