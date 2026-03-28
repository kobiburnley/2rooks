import React from 'react'
import { observer } from 'mobx-react-lite'
import type { Opening } from '../types'
import type { OpeningStore } from '../stores/OpeningStore'

// ── Breadcrumbs ──────────────────────────────────────────────────────────────

const Breadcrumbs = observer(({ store }: { store: OpeningStore }) => {
  const { breadcrumbs } = store
  if (breadcrumbs.length === 0) return null
  return (
    <div className="breadcrumb">
      <span
        className="breadcrumb-item"
        onClick={() => store.navigate(null)}
      >
        All
      </span>
      {breadcrumbs.map((crumb, i) => (
        <React.Fragment key={crumb.id}>
          <span className="breadcrumb-sep">›</span>
          {i < breadcrumbs.length - 1 ? (
            <span
              className="breadcrumb-item"
              onClick={() => store.navigate(crumb.id)}
            >
              {crumb.name}
            </span>
          ) : (
            <span className="breadcrumb-current">{crumb.name}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
})

// ── Opening Card ─────────────────────────────────────────────────────────────

interface CardProps {
  opening: Opening
  store: OpeningStore
}

const OpeningCard = observer(({ opening, store }: CardProps) => {
  const hasChildren = store.childIds.has(opening.id)
  const hasMoves    = opening.moves.length > 0
  const childCount  = store.openings.filter(o => o.parentId === opening.id).length

  const handleCardClick = () => {
    if (hasChildren) store.navigate(opening.id)
    else if (hasMoves) store.startStudying(opening)
  }

  return (
    <div className="opening-card" onClick={handleCardClick}>
      <div className="opening-card-body">
        <div className="opening-card-name">{opening.name}</div>
        {opening.description && (
          <div className="opening-card-desc">{opening.description}</div>
        )}
        <div className="opening-card-badges">
          {hasMoves && (
            <span className="badge badge-moves">{opening.moves.length} moves</span>
          )}
          {hasChildren && (
            <span className="badge badge-variations">{childCount} variation{childCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {hasChildren && hasMoves && (
        <button
          className="opening-card-study-btn"
          onClick={e => { e.stopPropagation(); store.startStudying(opening) }}
        >
          Study
        </button>
      )}

      {hasChildren && (
        <span className="opening-card-arrow">›</span>
      )}
    </div>
  )
})

// ── Browser Header ───────────────────────────────────────────────────────────

const BrowserHeader = observer(({ store }: { store: OpeningStore }) => {
  const parentId = store.browserId
    ? (store.openings.find(o => o.id === store.browserId)?.parentId ?? null)
    : null

  return (
    <header className="browser-header">
      {store.browserId !== null ? (
        <button
          className="browser-back-btn"
          onClick={() => store.navigate(parentId)}
          aria-label="Go back"
        >
          ←
        </button>
      ) : (
        <span className="browser-logo">2<b>Rooks</b></span>
      )}
      <span className="browser-title">{store.browseTitle}</span>
      <button
        className="manage-btn"
        onClick={() => store.openManage()}
        aria-label="Add opening"
      >
        + Add
      </button>
    </header>
  )
})

// ── Main Browser ─────────────────────────────────────────────────────────────

export const OpeningBrowser = observer(({ store }: { store: OpeningStore }) => (
  <div className="browser">
    <BrowserHeader store={store} />
    <Breadcrumbs store={store} />
    <div className="browser-list">
      {store.isLoading ? (
        <div className="browser-empty">Loading openings…</div>
      ) : store.browsedOpenings.length === 0 ? (
        <div className="browser-empty">No openings here yet. Tap + Add to create one.</div>
      ) : (
        store.browsedOpenings.map(opening => (
          <OpeningCard key={opening.id} opening={opening} store={store} />
        ))
      )}
    </div>
  </div>
))

