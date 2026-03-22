import { DifficultyLevel, GameMode, HistoryEntry } from './types'

const KEY = 'base-certa-history'

function makeKey(mode: GameMode, level: DifficultyLevel): string {
  return `${mode}__${level}`
}

export function saveResult(mode: GameMode, level: DifficultyLevel, score: number): void {
  try {
    const history = loadHistory()
    history.unshift({ mode, level, score, date: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, 100)))
  } catch {
    // silently fail if storage is unavailable
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function getBestScore(mode: GameMode, level: DifficultyLevel): number | null {
  const key = makeKey(mode, level)
  const history = loadHistory().filter((e) => makeKey(e.mode, e.level) === key)
  if (history.length === 0) return null
  return Math.max(...history.map((e) => e.score))
}
