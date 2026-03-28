import React, { useRef, useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'

export default function ChessBoard({
  position,
  highlightSquares,
  onPieceDrop,
  wrongMove,
  orientation = 'white',
}) {
  const containerRef = useRef(null)
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

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    return onPieceDrop(sourceSquare, targetSquare)
  }

  return (
    <div
      ref={containerRef}
      className={`board-wrapper${wrongMove ? ' wrong-move' : ''}`}
    >
      <Chessboard
        position={position}
        onPieceDrop={handlePieceDrop}
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
