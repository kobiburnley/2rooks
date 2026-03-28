import React, { useRef, useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'

interface ChessBoardProps {
  position: string
  highlightSquares: Record<string, React.CSSProperties>
  onPieceDrop: (from: string, to: string) => boolean
  wrongMove: boolean
  orientation?: 'white' | 'black'
}

export default function ChessBoard({
  position,
  highlightSquares,
  onPieceDrop,
  wrongMove,
  orientation = 'white',
}: ChessBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [boardWidth, setBoardWidth] = useState(360)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        setBoardWidth(Math.min(w, 448))
      }
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`board-wrapper${wrongMove ? ' wrong-move' : ''}`}
    >
      <Chessboard
        position={position}
        onPieceDrop={onPieceDrop}
        customSquareStyles={highlightSquares}
        boardWidth={boardWidth}
        boardOrientation={orientation}
        animationDuration={200}
        customDarkSquareStyle={{ backgroundColor: '#b58863' }}
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  )
}
