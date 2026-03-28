
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'
import ChessBoard from './ChessBoard'

const BoardArea = observer(({ store }: { store: OpeningStore }) => (
  <div className="board-area">
    <ChessBoard
      position={store.fen}
      highlightSquares={store.highlightSquares}
      onPieceDrop={(from, to) => store.handlePlayerMove(from, to)}
      wrongMove={store.wrongMove}
    />
  </div>
))

export default BoardArea
