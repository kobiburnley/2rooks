import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

export const ManageScreen = observer(({ store }: { store: OpeningStore }) => (
  <div className="browser">
    <header className="browser-header">
      <button
        className="browser-back-btn"
        onClick={() => store.openBrowser()}
        aria-label="Go back"
      >
        ←
      </button>
      <span className="browser-title">Manage Openings</span>
      <button
        className="manage-btn"
        onClick={() => store.openAdd()}
        aria-label="Add opening"
      >
        + Add
      </button>
    </header>

    <div className="browser-list">
      {store.openings.length === 0 && (
        <div className="browser-empty">No openings yet. Tap + Add to create one.</div>
      )}
      {store.openings.map(opening => (
        <div className="opening-card" key={opening.id}>
          <div className="opening-card-body">
            <div className="opening-card-name">{opening.name}</div>
            {opening.moves.length > 0 && (
              <div className="opening-card-badges">
                <span className="badge badge-moves">{opening.moves.length} moves</span>
              </div>
            )}
          </div>
          <button
            className="item-action-btn select-opening-btn"
            onClick={() => store.startStudying(opening)}
          >
            Study
          </button>
          <button
            className="item-action-btn delete-opening-btn"
            onClick={() => store.saveOpenings(store.openings.filter(o => o.id !== opening.id))}
            aria-label={`Delete ${opening.name}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
))
