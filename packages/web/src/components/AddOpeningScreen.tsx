import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Chess } from 'chess.js'
import type { OpeningStore } from '../stores/OpeningStore'
import type { Opening, Move } from '../types'
import { buildAiPrompt } from '../data/aiPrompt'

function validateOpenings(raw: unknown): Opening[] {
  const items: unknown[] = Array.isArray(raw) ? raw : [raw]
  const chess = new Chess()
  const result: Opening[] = []

  for (const item of items) {
    if (typeof item !== 'object' || item === null) throw new Error('Each opening must be an object.')
    const o = item as Record<string, unknown>

    if (typeof o.id !== 'string' || !o.id) throw new Error('Each opening must have a string "id".')
    if (typeof o.name !== 'string' || !o.name) throw new Error(`Opening "${o.id}" must have a string "name".`)
    if (typeof o.description !== 'string') throw new Error(`Opening "${o.id}" must have a string "description".`)
    if (!Array.isArray(o.moves)) throw new Error(`Opening "${o.id}" must have a "moves" array.`)
    if (o.parentId !== undefined && typeof o.parentId !== 'string') throw new Error(`Opening "${o.id}" parentId must be a string.`)

    chess.reset()
    const moves: Move[] = []
    for (const m of o.moves as unknown[]) {
      if (typeof m !== 'object' || m === null) throw new Error(`Moves in "${o.id}" must be objects.`)
      const mv = m as Record<string, unknown>
      if (typeof mv.san !== 'string') throw new Error(`Each move in "${o.id}" must have a string "san".`)
      try {
        const played = chess.move(mv.san)
        moves.push({ san: played.san, explanation: typeof mv.explanation === 'string' ? mv.explanation : '' })
      } catch {
        throw new Error(`Invalid move "${mv.san}" in opening "${o.id}".`)
      }
    }

    result.push({
      id: o.id as string,
      name: o.name as string,
      description: o.description as string,
      moves,
      ...(o.parentId ? { parentId: o.parentId as string } : {}),
    })
  }

  return result
}

export const AddOpeningScreen = observer(({ store }: { store: OpeningStore }) => {
  const [request, setRequest]   = useState('')
  const [jsonText, setJsonText] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [copied, setCopied]     = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildAiPrompt(request))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAdd = () => {
    setError(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText.trim())
    } catch {
      setError('Invalid JSON. Paste the AI response exactly as-is.')
      return
    }
    try {
      const openings = validateOpenings(parsed)
      store.saveOpenings([...store.openings, ...openings])
      const firstWithMoves = openings.find(o => o.moves.length > 0)
      if (firstWithMoves) store.startStudying(firstWithMoves)
      else store.openManage()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="browser">
      <header className="browser-header">
        <button
          className="browser-back-btn"
          onClick={() => store.openManage()}
          aria-label="Go back"
        >
          ←
        </button>
        <span className="browser-title">Add Opening</span>
        <span />
      </header>

      <div className="browser-list">
        <div className="form-group">
          <label htmlFor="request-input">Step 1 — What opening do you want to learn?</label>
          <input
            id="request-input"
            type="text"
            value={request}
            onChange={e => { setRequest(e.target.value); setCopied(false) }}
            placeholder="e.g. King's Indian Defense classical variation"
          />
        </div>

        <button
          className="parse-btn"
          onClick={handleCopy}
          disabled={!request.trim()}
          style={{ marginBottom: '24px' }}
        >
          {copied ? 'Copied!' : 'Generate & Copy Prompt'}
        </button>

        <div className="form-group">
          <label htmlFor="json-input">Step 2 — Paste the AI response</label>
          <p className="form-hint">
            Paste the prompt into any AI (ChatGPT, Claude, Gemini…) then paste the JSON reply here.
          </p>
          <textarea
            id="json-input"
            value={jsonText}
            onChange={e => { setJsonText(e.target.value); setError(null) }}
            placeholder="Paste the JSON here…"
            rows={8}
          />
        </div>

        {error && <div className="parse-error">{error}</div>}

        <button
          className="parse-btn"
          onClick={handleAdd}
          disabled={!jsonText.trim()}
        >
          Add Opening
        </button>
      </div>
    </div>
  )
})
