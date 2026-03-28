import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { OpeningStore, StoreContext } from './stores/OpeningStore'
import ChessBoard from './components/ChessBoard'
import MoveControls from './components/MoveControls'
import ExplanationPanel from './components/ExplanationPanel'
import OpeningManager from './components/OpeningManager'

const App = observer(() => {
  const [store] = useState(() => new OpeningStore())

  const pct = store.totalMoves > 0
    ? Math.round((store.currentMoveIndex / store.totalMoves) * 100)
    : 0

  return (
    <StoreContext.Provider value={store}>
    <div className="app">
      <header className="app-header">
        <h1>2<span>Rooks</span></h1>
        <button
          className="manage-btn"
          onClick={() => { store.showManager = true }}
          aria-label="Manage openings"
        >
          Openings
        </button>
      </header>

      <div className="opening-selector">
        <label htmlFor="opening-select">Current Opening</label>
        <select
          id="opening-select"
          value={store.selectedOpening?.id ?? ''}
          onChange={e => {
            const found = store.openings.find(o => o.id === e.target.value)
            if (found) store.selectOpening(found)
          }}
        >
          {store.openings.length === 0 && <option value="">No openings — add one</option>}
          {store.openings.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>

      <div className="progress-bar-area">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label">{store.currentMoveIndex}/{store.totalMoves}</div>
      </div>

      <div className="board-area">
        <ChessBoard
          position={store.fen}
          highlightSquares={store.highlightSquares}
          onPieceDrop={(from, to) => store.handlePlayerMove(from, to)}
          wrongMove={store.wrongMove}
        />
      </div>

      <ExplanationPanel />
      <MoveControls />

      {store.toast && (
        <div className="toast-container" key={store.toastKey}>
          <div className="toast">{store.toast}</div>
        </div>
      )}

      {store.showManager && <OpeningManager />}
    </div>
    </StoreContext.Provider>
  )
})

export default App
