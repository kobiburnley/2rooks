import React from 'react'
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

const OpeningSelector = observer(({ store }: { store: OpeningStore }) => (
  <div className="opening-selector">
    <label htmlFor="opening-select">Current Opening</label>
    <select
      id="opening-select"
      value={store.selectedOpening?.id ?? ''}
      onChange={e => {
        const found = store.openings.find(o => o.id === e.target.value)
        if (found) store.selectOpening(found)
      }}
    >
      {store.openings.length === 0 && <option value="">No openings — add one</option>}
      {store.openings.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>
))

export default OpeningSelector
