import type { Opening } from '../types'

// Version bump when the default data shape changes, to avoid stale localStorage merges
const STORAGE_VERSION = 2
const STORAGE_KEY = '2rooks-openings'

export async function loadOpenings(): Promise<Opening[]> {
  const { default: DEFAULT_OPENINGS } = await import('./defaultOpenings')
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { version?: number; openings?: Opening[] }
      if (parsed.version === STORAGE_VERSION && Array.isArray(parsed.openings)) {
        const stored = parsed.openings
        const storedIds = new Set(stored.map(o => o.id))
        const newDefaults = DEFAULT_OPENINGS.filter(o => !storedIds.has(o.id))
        return [...stored, ...newDefaults]
      }
    }
  } catch { /* ignore */ }
  return DEFAULT_OPENINGS
}

export function saveOpenings(openings: Opening[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, openings }))
  } catch { /* ignore */ }
}
