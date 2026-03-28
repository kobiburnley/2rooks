import React, { useState, useCallback } from 'react'
import ChessBoard from './components/ChessBoard'
import MoveControls from './components/MoveControls'
import ExplanationPanel from './components/ExplanationPanel'
import OpeningManager from './components/OpeningManager'
import { useOpening } from './hooks/useOpening'
import { loadOpenings, saveOpenings } from './data/openings'
import type { Opening } from './types'

interface ProgressBarProps {
  current: number
  total: number
}

function ProgressBar({ current, total }: ProgressBarProps) {
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

interface ToastProps {
  message: string | null
}

function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  )
}

export default function App() {
  const [openings, setOpenings] = useState<Opening[]>(() => loadOpenings())
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(() => loadOpenings()[0] ?? null)
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

  const handleOpeningChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = openings.find(o => o.id === e.target.value)
    if (found) setSelectedOpening(found)
  }, [openings])

  const handleSaveOpenings = useCallback((updated: Opening[]) => {
    saveOpenings(updated)
    setOpenings(updated)
    if (!updated.find(o => o.id === selectedOpening?.id)) {
      setSelectedOpening(updated[0] ?? null)
    }
  }, [selectedOpening])

  const handleSelectOpening = useCallback((opening: Opening) => {
    setSelectedOpening(opening)
  }, [])

  return (
    <div className="app">
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

      <ProgressBar current={currentMoveIndex} total={totalMoves} />

      <div className="board-area">
        <ChessBoard
          position={fen}
          highlightSquares={highlightSquares}
          onPieceDrop={handlePlayerMove}
          wrongMove={wrongMove}
          orientation="white"
        />
      </div>

      <ExplanationPanel
        opening={selectedOpening}
        currentMoveIndex={currentMoveIndex}
        totalMoves={totalMoves}
      />

      <MoveControls
        onBack={goBack}
        onForward={goForward}
        onHint={showHint}
        onReset={reset}
        hintState={hintState}
        currentMoveIndex={currentMoveIndex}
        totalMoves={totalMoves}
      />

      <Toast key={toastKey} message={toast} />

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
