import React from 'react'
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'
import OpeningManager from './OpeningManager'

const ManagerPortal = observer(({ store }: { store: OpeningStore }) =>
  store.showManager ? <OpeningManager store={store} /> : null
)

export default ManagerPortal
