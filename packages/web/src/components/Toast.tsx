
import { observer } from 'mobx-react-lite'
import type { OpeningStore } from '../stores/OpeningStore'

export const Toast = observer(({ store }: { store: OpeningStore }) => {
  if (!store.toast) return null
  return (
    <div className="toast-container" key={store.toastKey}>
      <div className="toast">{store.toast}</div>
    </div>
  )
})

