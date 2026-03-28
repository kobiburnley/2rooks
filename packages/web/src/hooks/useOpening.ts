import { useState, useCallback, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import type { Opening, HintState } from '../types'

interface HighlightSquares {
  [square: string]: React.CSSProperties
}

interface UseOpeningReturn {
  currentMoveIndex: number
  totalMoves: number
  fen: string
  hintState: HintState
  wrongMove: boolean
  toast: string | null
  toastKey: number
  highlightSquares: HighlightSquares
  goForward: () => void
  goBack: () => void
  showHint: () => void
  reset: () => void
  handlePlayerMove: (from: string, to: string) => boolean
}

function replayMoves(moves: Opening['moves'], upTo: number): Chess {
  const chess = new Chess()
  for (let i = 0; i < upTo; i++) {
    try { chess.move(moves[i].san) } catch { break }
  }
  return chess
}

export function useOpening(opening: Opening | null): UseOpeningReturn {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [hintState, setHintState] = useState<HintState>(null)
  const [wrongMove, setWrongMove] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [toastKey, setToastKey] = useState(0)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrongMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when opening changes
  useEffect(() => {
    setCurrentMoveIndex(0)
    setHintState(null)
    setWrongMove(false)
    setToast(null)
  }, [opening?.id])

  const totalMoves = opening?.moves?.length ?? 0

  // Derive current position by replaying moves — no stale state
  const chess = opening ? replayMoves(opening.moves, currentMoveIndex) : new Chess()

  const highlightSquares = useCallback((): HighlightSquares => {
    const squares: HighlightSquares = {}

    // Last move highlight (light blue)
    if (currentMoveIndex > 0 && opening?.moves) {
      const tempChess = new Chess()
      for (let i = 0; i < currentMoveIndex - 1; i++) {
        try { tempChess.move(opening.moves[i].san) } catch { break }
      }
      try {
        const moveResult = tempChess.move(opening.moves[currentMoveIndex - 1].san)
        if (moveResult) {
          squares[moveResult.from] = { backgroundColor: 'rgba(100, 180, 255, 0.35)' }
          squares[moveResult.to] = { backgroundColor: 'rgba(100, 180, 255, 0.45)' }
        }
      } catch {
        // ignore
      }
    }

    // Hint highlights
    if (hintState && opening?.moves && currentMoveIndex < totalMoves) {
      const nextMove = opening.moves[currentMoveIndex]
      const tempChess = new Chess()
      for (let i = 0; i < currentMoveIndex; i++) {
        try { tempChess.move(opening.moves[i].san) } catch { break }
      }
      try {
        const verbose = tempChess.moves({ verbose: true })
        const match = verbose.find(m => m.san === nextMove.san)
        if (match) {
          if (hintState === 'piece' || hintState === 'destination') {
            squares[match.from] = { backgroundColor: 'rgba(255, 193, 7, 0.65)' }
          }
          if (hintState === 'destination') {
            squares[match.to] = { backgroundColor: 'rgba(46, 213, 115, 0.65)' }
          }
        }
      } catch {
        // ignore
      }
    }

    return squares
  }, [currentMoveIndex, hintState, opening, totalMoves])

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(message)
    setToastKey(k => k + 1)
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
    }, 2200)
  }, [])

  const goForward = useCallback(() => {
    if (currentMoveIndex >= totalMoves) return
    setCurrentMoveIndex(idx => idx + 1)
    setHintState(null)
  }, [currentMoveIndex, totalMoves])

  const goBack = useCallback(() => {
    if (currentMoveIndex <= 0) return
    setCurrentMoveIndex(idx => idx - 1)
    setHintState(null)
  }, [currentMoveIndex])

  const showHint = useCallback(() => {
    if (currentMoveIndex >= totalMoves) return
    setHintState(prev => {
      if (prev === null) return 'piece'
      if (prev === 'piece') return 'destination'
      return null
    })
  }, [currentMoveIndex, totalMoves])

  const reset = useCallback(() => {
    setCurrentMoveIndex(0)
    setHintState(null)
    setWrongMove(false)
    setToast(null)
  }, [])

  const handlePlayerMove = useCallback((from: string, to: string): boolean => {
    if (!opening?.moves || currentMoveIndex >= totalMoves) return false

    const expectedMove = opening.moves[currentMoveIndex]
    const tempChess = new Chess(chess.fen())
    const legalMoves = tempChess.moves({ verbose: true })
    const match = legalMoves.find(m => m.san === expectedMove.san)

    if (match && match.from === from && match.to === to) {
      setCurrentMoveIndex(idx => idx + 1)
      setHintState(null)
      return true
    } else {
      const isLegalMove = legalMoves.some(m => m.from === from && m.to === to)
      if (!isLegalMove) return false

      if (wrongMoveTimerRef.current) clearTimeout(wrongMoveTimerRef.current)
      setWrongMove(true)
      showToast('Wrong move! Try again')
      wrongMoveTimerRef.current = setTimeout(() => {
        setWrongMove(false)
      }, 600)

      return false
    }
  }, [chess, currentMoveIndex, opening, totalMoves, showToast])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      if (wrongMoveTimerRef.current) clearTimeout(wrongMoveTimerRef.current)
    }
  }, [])

  return {
    currentMoveIndex,
    totalMoves,
    fen: chess.fen(),
    hintState,
    wrongMove,
    toast,
    toastKey,
    highlightSquares: highlightSquares(),
    goForward,
    goBack,
    showHint,
    reset,
    handlePlayerMove,
  }
}
