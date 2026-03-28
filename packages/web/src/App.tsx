import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { OpeningStore } from './stores/OpeningStore'
import { OpeningBrowser } from './components/OpeningBrowser'
import { ProgressBar } from './components/ProgressBar'
import { BoardArea } from './components/BoardArea'
import { ExplanationPanel } from './components/ExplanationPanel'
import { MoveControls } from './components/MoveControls'
import { Toast } from './components/Toast'
import { ManagerPortal } from './components/ManagerPortal'

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
    <ManagerPortal store={store} />
  </div>
)

const ViewRouter = observer(({ store }: { store: OpeningStore }) =>
  store.view === 'browse'
    ? <OpeningBrowser store={store} />
    : <StudyView store={store} />
)

export function App() {
  const [store] = useState(() => new OpeningStore())
  return <ViewRouter store={store} />
}
