import React, { useState, useCallback } from 'react'
import ChessBoard from './components/ChessBoard.jsx'
import MoveControls from './components/MoveControls.jsx'
import ExplanationPanel from './components/ExplanationPanel.jsx'
import OpeningManager from './components/OpeningManager.jsx'
import { useOpening } from './hooks/useOpening.js'
import { loadOpenings, saveOpenings } from './data/openings.js'

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="progress-bar-area">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">{current}/{total}</div>
    </div>
  )
}

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="toast-container">
      <div className="toast">
        {message}
      </div>
    </div>
  )
}

export default function App() {
  const [openings, setOpenings] = useState(() => loadOpenings())
  const [selectedOpening, setSelectedOpening] = useState(() => {
    const all = loadOpenings()
    return all[0] ?? null
  })
  const [showManager, setShowManager] = useState(false)

  const {
    currentMoveIndex,
    totalMoves,
    fen,
    hintState,
    wrongMove,
    toast,
    toastKey,
    highlightSquares,
    goForward,
    goBack,
    showHint,
    reset,
    handlePlayerMove,
  } = useOpening(selectedOpening)

  const handleOpeningChange = useCallback((e) => {
    const id = e.target.value
    const found = openings.find(o => o.id === id)
    if (found) setSelectedOpening(found)
  }, [openings])

  const handleSaveOpenings = useCallback((updated) => {
    saveOpenings(updated)
    setOpenings(updated)
    // If current opening was deleted, switch to first available
    if (!updated.find(o => o.id === selectedOpening?.id)) {
      setSelectedOpening(updated[0] ?? null)
    }
  }, [selectedOpening])

  const handleSelectOpening = useCallback((opening) => {
    setSelectedOpening(opening)
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>2<span>Rooks</span></h1>
        <button
          className="manage-btn"
          onClick={() => setShowManager(true)}
          aria-label="Manage openings"
        >
          Openings
        </button>
      </header>

      {/* Opening Selector */}
      <div className="opening-selector">
        <label htmlFor="opening-select">Current Opening</label>
        <select
          id="opening-select"
          value={selectedOpening?.id ?? ''}
          onChange={handleOpeningChange}
        >
          {openings.length === 0 && (
            <option value="">No openings — add one</option>
          )}
          {openings.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      {/* Progress */}
      <ProgressBar current={currentMoveIndex} total={totalMoves} />

      {/* Board */}
      <div className="board-area">
        <ChessBoard
          position={fen}
          highlightSquares={highlightSquares}
          onPieceDrop={handlePlayerMove}
          wrongMove={wrongMove}
          orientation="white"
        />
      </div>

      {/* Explanation */}
      <ExplanationPanel
        opening={selectedOpening}
        currentMoveIndex={currentMoveIndex}
        totalMoves={totalMoves}
      />

      {/* Controls */}
      <MoveControls
        onBack={goBack}
        onForward={goForward}
        onHint={showHint}
        onReset={reset}
        hintState={hintState}
        currentMoveIndex={currentMoveIndex}
        totalMoves={totalMoves}
      />

      {/* Toast */}
      <Toast key={toastKey} message={toast} />

      {/* Opening Manager Modal */}
      {showManager && (
        <OpeningManager
          openings={openings}
          onClose={() => setShowManager(false)}
          onSelect={handleSelectOpening}
          onSave={handleSaveOpenings}
        />
      )}
    </div>
  )
}
