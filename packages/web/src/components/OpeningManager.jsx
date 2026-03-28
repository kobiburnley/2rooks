import React, { useState } from 'react'
import { Chess } from 'chess.js'

function parseMoves(text) {
  // Try to detect format and extract SAN moves
  const trimmed = text.trim()
  if (!trimmed) throw new Error('No moves entered.')

  let tokens = []

  // Check if it looks like PGN (has move numbers like "1." or "1.")
  const hasMoveNumbers = /\d+\./.test(trimmed)

  if (hasMoveNumbers) {
    // PGN format: "1. e4 e5 2. Nf3 Nc6" or "1.e4 e5 2.Nf3"
    // Remove move numbers (e.g. "1.", "1...")
    const cleaned = trimmed
      .replace(/\d+\.\.\./g, '') // remove "1..." black move numbers
      .replace(/\d+\./g, '')      // remove "1." white move numbers
      .replace(/\{[^}]*\}/g, '')  // remove PGN comments
      .replace(/\([^)]*\)/g, '')  // remove PGN variations
      .replace(/\$\d+/g, '')      // remove NAG annotations
      .replace(/[*10½\-]+$/g, '') // remove result
      .trim()
    tokens = cleaned.split(/\s+/).filter(Boolean)
  } else if (trimmed.includes('\n')) {
    // One move per line
    tokens = trimmed.split('\n').map(s => s.trim()).filter(Boolean)
  } else {
    // Space separated
    tokens = trimmed.split(/\s+/).filter(Boolean)
  }

  if (tokens.length === 0) throw new Error('Could not find any moves.')

  // Validate each move with chess.js
  const chess = new Chess()
  const validatedMoves = []

  for (const token of tokens) {
    if (!token || token === '*' || /^(1-0|0-1|1\/2-1\/2)$/.test(token)) continue
    try {
      const result = chess.move(token)
      if (result) {
        validatedMoves.push({ san: result.san, explanation: '' })
      }
    } catch {
      throw new Error(`Invalid move: "${token}". Please check your input.`)
    }
  }

  if (validatedMoves.length === 0) {
    throw new Error('No valid moves found.')
  }

  return validatedMoves
}

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
}

export default function OpeningManager({ openings, onClose, onSelect, onSave }) {
  const [movesText, setMovesText] = useState('')
  const [nameText, setNameText] = useState('')
  const [descText, setDescText] = useState('')
  const [parseError, setParseError] = useState(null)
  const [parseSuccess, setParseSuccess] = useState(null)
  const [parsedMoves, setParsedMoves] = useState(null)

  const handleParse = () => {
    setParseError(null)
    setParseSuccess(null)
    setParsedMoves(null)

    try {
      const moves = parseMoves(movesText)
      setParsedMoves(moves)
      setParseSuccess(`Parsed ${moves.length} moves successfully. Enter a name and save.`)
    } catch (err) {
      setParseError(err.message)
    }
  }

  const handleSave = () => {
    if (!parsedMoves) {
      setParseError('Parse moves first before saving.')
      return
    }
    const name = nameText.trim() || 'Custom Opening'
    const newOpening = {
      id: generateId(name),
      name,
      description: descText.trim() || 'A custom opening.',
      moves: parsedMoves,
    }
    const updated = [...openings, newOpening]
    onSave(updated)
    setMovesText('')
    setNameText('')
    setDescText('')
    setParsedMoves(null)
    setParseSuccess(null)
    setParseError(null)
    onSelect(newOpening)
    onClose()
  }

  const handleDelete = (id) => {
    const updated = openings.filter(o => o.id !== id)
    onSave(updated)
  }

  const handleSelect = (opening) => {
    onSelect(opening)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Manage Openings">
        <div className="modal-header">
          <h2>Manage Openings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Openings List */}
        <div className="modal-section">
          <h3>Your Openings</h3>
          <div className="opening-list">
            {openings.length === 0 && (
              <div style={{ color: '#888', fontSize: '0.85rem' }}>No openings saved yet.</div>
            )}
            {openings.map((opening) => (
              <div className="opening-list-item" key={opening.id}>
                <div className="item-info">
                  <div className="item-name">{opening.name}</div>
                  <div className="item-moves">{opening.moves.length} moves</div>
                </div>
                <button
                  className="item-action-btn select-opening-btn"
                  onClick={() => handleSelect(opening)}
                >
                  Study
                </button>
                <button
                  className="item-action-btn delete-opening-btn"
                  onClick={() => handleDelete(opening.id)}
                  aria-label={`Delete ${opening.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Opening */}
        <div className="modal-section">
          <h3>Add Custom Opening</h3>

          <div className="form-group">
            <label htmlFor="moves-input">Moves</label>
            <textarea
              id="moves-input"
              value={movesText}
              onChange={(e) => {
                setMovesText(e.target.value)
                setParseError(null)
                setParseSuccess(null)
                setParsedMoves(null)
              }}
              placeholder={'1. e4 e5 2. Nf3 Nc6 3. Bb5\n\nor one move per line:\ne4\ne5\nNf3'}
              rows={5}
            />
            <div className="form-hint">
              Accepts: PGN format (1. e4 e5 2. Nf3), one move per line, or space-separated moves.
            </div>
          </div>

          <button className="parse-btn" onClick={handleParse} style={{ marginBottom: '12px' }}>
            Parse Moves
          </button>

          {parseError && <div className="parse-error">{parseError}</div>}
          {parseSuccess && <div className="parse-success">{parseSuccess}</div>}

          {parsedMoves && (
            <>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label htmlFor="name-input">Opening Name</label>
                <input
                  id="name-input"
                  type="text"
                  value={nameText}
                  onChange={(e) => setNameText(e.target.value)}
                  placeholder="e.g. King's Indian Defense"
                />
              </div>

              <div className="form-group">
                <label htmlFor="desc-input">Description (optional)</label>
                <input
                  id="desc-input"
                  type="text"
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  placeholder="Brief description of this opening..."
                />
              </div>

              <button className="parse-btn" onClick={handleSave}>
                Save Opening
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
