import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { OpeningStore } from './stores/OpeningStore'
import { OpeningBrowser } from './components/OpeningBrowser'
import { ProgressBar } from './components/ProgressBar'
import { BoardArea } from './components/BoardArea'
import { ExplanationPanel } from './components/ExplanationPanel'
import { MoveControls } from './components/MoveControls'
import { Toast } from './components/Toast'
import { ManageScreen } from './components/ManageScreen'
import { AddOpeningScreen } from './components/AddOpeningScreen'

const StudyHeader = observer(({ store }: { store: OpeningStore }) => (
  <header className="study-header">
    <button
      className="study-back-btn"
      onClick={() => store.openBrowser()}
      aria-label="Back to openings"
    >
      ←
    </button>
    <span className="study-opening-name">
      {store.selectedOpening?.name ?? ''}
    </span>
  </header>
))

const StudyView = ({ store }: { store: OpeningStore }) => (
  <div className="app">
    <StudyHeader store={store} />
    <ProgressBar store={store} />
    <BoardArea store={store} />
    <ExplanationPanel store={store} />
    <MoveControls store={store} />
    <Toast store={store} />
  </div>
)

const ViewRouter = observer(({ store }: { store: OpeningStore }) => {
  if (store.view === 'browse')  return <OpeningBrowser store={store} />
  if (store.view === 'manage')  return <ManageScreen store={store} />
  if (store.view === 'add')     return <AddOpeningScreen store={store} />
  return <StudyView store={store} />
})

export function App() {
  const [store] = useState(() => new OpeningStore())
  return <ViewRouter store={store} />
}
