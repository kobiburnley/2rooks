import React, { useState } from 'react'
import { OpeningStore } from './stores/OpeningStore'
import OpeningSelector from './components/OpeningSelector'
import ProgressBar from './components/ProgressBar'
import BoardArea from './components/BoardArea'
import ExplanationPanel from './components/ExplanationPanel'
import MoveControls from './components/MoveControls'
import Toast from './components/Toast'
import ManagerPortal from './components/ManagerPortal'

export default function App() {
  const [store] = useState(() => new OpeningStore())

  return (
    <div className="app">
      <header className="app-header">
        <h1>2<span>Rooks</span></h1>
        <button
          className="manage-btn"
          onClick={() => { store.showManager = true }}
          aria-label="Manage openings"
        >
          Openings
        </button>
      </header>
      <OpeningSelector store={store} />
      <ProgressBar store={store} />
      <BoardArea store={store} />
      <ExplanationPanel store={store} />
      <MoveControls store={store} />
      <Toast store={store} />
      <ManagerPortal store={store} />
    </div>
  )
}
