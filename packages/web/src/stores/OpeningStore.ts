import { makeObservable, observable, computed, action } from 'mobx'
import { createContext, useContext } from 'react'
import { Chess } from 'chess.js'
import type { Opening, HintState } from '../types'
import { loadOpenings, saveOpenings } from '../data/openings'

export class OpeningStore {
  openings: Opening[] = loadOpenings()
  selectedOpening: Opening | null = loadOpenings()[0] ?? null
  showManager = false

  currentMoveIndex = 0
  hintState: HintState = null
  wrongMove = false
  toast: string | null = null
  toastKey = 0

  // Not observable — just mutable refs for timer handles
  _toastTimer: ReturnType<typeof setTimeout> | null = null
  _wrongMoveTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    makeObservable(this, {
      openings:         observable.ref,
      selectedOpening:  observable.ref,
      showManager:      observable.ref,
      currentMoveIndex: observable.ref,
      hintState:        observable.ref,
      wrongMove:        observable.ref,
      toast:            observable.ref,
      toastKey:         observable.ref,
      totalMoves:       computed,
      fen:              computed,
      highlightSquares: computed,
      lastMove:         computed,
      selectOpening:    action,
      saveOpenings:     action,
      goForward:        action,
      goBack:           action,
      cycleHint:        action,
      reset:            action,
      handlePlayerMove: action,
    })
  }

  get totalMoves() {
    return this.selectedOpening?.moves.length ?? 0
  }

  get fen() {
    const chess = new Chess()
    if (this.selectedOpening) {
      for (let i = 0; i < this.currentMoveIndex; i++) {
        try { chess.move(this.selectedOpening.moves[i].san) } catch { break }
      }
    }
    return chess.fen()
  }

  get highlightSquares(): Record<string, React.CSSProperties> {
    const squares: Record<string, React.CSSProperties> = {}
    const moves = this.selectedOpening?.moves
    if (!moves) return squares

    // Last move (light blue)
    if (this.currentMoveIndex > 0) {
      const chess = new Chess()
      for (let i = 0; i < this.currentMoveIndex - 1; i++) {
        try { chess.move(moves[i].san) } catch { break }
      }
      try {
        const result = chess.move(moves[this.currentMoveIndex - 1].san)
        if (result) {
          squares[result.from] = { backgroundColor: 'rgba(100, 180, 255, 0.35)' }
          squares[result.to]   = { backgroundColor: 'rgba(100, 180, 255, 0.45)' }
        }
      } catch { /* ignore */ }
    }

    // Hint (yellow piece, green destination)
    if (this.hintState && this.currentMoveIndex < this.totalMoves) {
      const chess = new Chess()
      for (let i = 0; i < this.currentMoveIndex; i++) {
        try { chess.move(moves[i].san) } catch { break }
      }
      try {
        const match = chess.moves({ verbose: true }).find(m => m.san === moves[this.currentMoveIndex].san)
        if (match) {
          squares[match.from] = { backgroundColor: 'rgba(255, 193, 7, 0.65)' }
          if (this.hintState === 'destination') {
            squares[match.to] = { backgroundColor: 'rgba(46, 213, 115, 0.65)' }
          }
        }
      } catch { /* ignore */ }
    }

    return squares
  }

  get lastMove() {
    if (this.currentMoveIndex === 0 || !this.selectedOpening) return null
    return this.selectedOpening.moves[this.currentMoveIndex - 1]
  }

  selectOpening(opening: Opening) {
    this.selectedOpening = opening
    this.currentMoveIndex = 0
    this.hintState = null
    this.wrongMove = false
    this.toast = null
  }

  saveOpenings(openings: Opening[]) {
    this.openings = openings
    saveOpenings(openings)
    if (!openings.find(o => o.id === this.selectedOpening?.id)) {
      this.selectedOpening = openings[0] ?? null
    }
  }

  goForward() {
    if (this.currentMoveIndex < this.totalMoves) {
      this.currentMoveIndex++
      this.hintState = null
    }
  }

  goBack() {
    if (this.currentMoveIndex > 0) {
      this.currentMoveIndex--
      this.hintState = null
    }
  }

  cycleHint() {
    if (this.currentMoveIndex >= this.totalMoves) return
    if (this.hintState === null)          this.hintState = 'piece'
    else if (this.hintState === 'piece')  this.hintState = 'destination'
    else                                  this.hintState = null
  }

  reset() {
    this.currentMoveIndex = 0
    this.hintState = null
    this.wrongMove = false
    this.toast = null
  }

  handlePlayerMove(from: string, to: string): boolean {
    const moves = this.selectedOpening?.moves
    if (!moves || this.currentMoveIndex >= this.totalMoves) return false

    const chess = new Chess()
    for (let i = 0; i < this.currentMoveIndex; i++) {
      try { chess.move(moves[i].san) } catch { break }
    }

    const legalMoves = chess.moves({ verbose: true })
    const expected = legalMoves.find(m => m.san === moves[this.currentMoveIndex].san)

    if (expected && expected.from === from && expected.to === to) {
      this.currentMoveIndex++
      this.hintState = null
      return true
    }

    if (!legalMoves.some(m => m.from === from && m.to === to)) return false

    // Legal but wrong for this opening
    this.wrongMove = true
    this.toast = 'Wrong move! Try again'
    this.toastKey++

    if (this._toastTimer) clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(action(() => { this.toast = null }), 2200)

    if (this._wrongMoveTimer) clearTimeout(this._wrongMoveTimer)
    this._wrongMoveTimer = setTimeout(action(() => { this.wrongMove = false }), 600)

    return false
  }
}

export const StoreContext = createContext<OpeningStore | null>(null)

export function useStore(): OpeningStore {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreContext.Provider')
  return store
}
