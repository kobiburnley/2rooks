import { makeObservable, observable, computed, action, runInAction } from 'mobx'
import { Chess } from 'chess.js'
import type { CSSProperties } from 'react'
import type { Opening, HintState } from '../types'
import { loadOpenings, saveOpenings } from '../data/openings'

export class OpeningStore {
  // ── Navigation ─────────────────────────────────────────────────────────────
  view: 'browse' | 'study' | 'manage' | 'add' = 'browse'
  browserId: string | null = null   // which opening's children are shown; null = root

  // ── Openings list ──────────────────────────────────────────────────────────
  openings: Opening[] = []
  isLoading = true

  // ── Study state ────────────────────────────────────────────────────────────
  selectedOpening: Opening | null = null
  currentMoveIndex = 0
  hintState: HintState = null
  wrongMove = false
  toast: string | null = null
  toastKey = 0

  _toastTimer: ReturnType<typeof setTimeout> | null = null
  _wrongMoveTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    makeObservable(this, {
      view:             observable.ref,
      browserId:        observable.ref,
      openings:         observable.ref,
      isLoading:        observable.ref,
      selectedOpening:  observable.ref,
      currentMoveIndex: observable.ref,
      hintState:        observable.ref,
      wrongMove:        observable.ref,
      toast:            observable.ref,
      toastKey:         observable.ref,
      // browse computed
      browsedOpenings:  computed,
      browseTitle:      computed,
      breadcrumbs:      computed,
      childIds:         computed,
      // study computed
      totalMoves:       computed,
      fen:              computed,
      highlightSquares: computed,
      lastMove:         computed,
      // actions
      navigate:         action,
      startStudying:    action,
      openBrowser:      action,
      openManage:       action,
      openAdd:          action,
      selectOpening:    action,
      saveOpenings:     action,
      goForward:        action,
      goBack:           action,
      cycleHint:        action,
      reset:            action,
      handlePlayerMove: action,
      load:             action,
    })
    void this.load()
  }

  async load() {
    const openings = await loadOpenings()
    runInAction(() => {
      this.openings = openings
      this.isLoading = false
    })
  }

  // ── Browse computed ─────────────────────────────────────────────────────────

  get browsedOpenings(): Opening[] {
    return this.openings.filter(o => (o.parentId ?? null) === this.browserId)
  }

  get browseTitle(): string {
    if (!this.browserId) return 'All Openings'
    return this.openings.find(o => o.id === this.browserId)?.name ?? 'All Openings'
  }

  /** Path from root to current browserId, for breadcrumb rendering */
  get breadcrumbs(): Opening[] {
    const crumbs: Opening[] = []
    let id: string | null = this.browserId
    while (id) {
      const opening = this.openings.find(o => o.id === id)
      if (!opening) break
      crumbs.unshift(opening)
      id = opening.parentId ?? null
    }
    return crumbs
  }

  /** Set of opening IDs that have at least one child */
  get childIds(): Set<string> {
    const ids = new Set<string>()
    for (const o of this.openings) {
      if (o.parentId) ids.add(o.parentId)
    }
    return ids
  }

  // ── Browse actions ──────────────────────────────────────────────────────────

  navigate(id: string | null) {
    this.browserId = id
  }

  startStudying(opening: Opening) {
    this.selectOpening(opening)
    this.view = 'study'
  }

  openBrowser() {
    // Return to the level of the currently selected opening so context is preserved
    this.browserId = this.selectedOpening?.parentId ?? null
    this.view = 'browse'
  }

  openManage() {
    this.view = 'manage'
  }

  openAdd() {
    this.view = 'add'
  }

  // ── Study computed ──────────────────────────────────────────────────────────

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

  get highlightSquares(): Record<string, CSSProperties> {
    const squares: Record<string, CSSProperties> = {}
    const moves = this.selectedOpening?.moves
    if (!moves) return squares

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

  // ── Study actions ───────────────────────────────────────────────────────────

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
    if (this.selectedOpening && !openings.find(o => o.id === this.selectedOpening!.id)) {
      this.selectedOpening = null
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
    if (this.hintState === null)         this.hintState = 'piece'
    else if (this.hintState === 'piece') this.hintState = 'destination'
    else                                 this.hintState = null
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
