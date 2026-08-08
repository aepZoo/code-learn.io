export const SPEED_BONUS_TIME_MS = 120_000

export function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function timerBarState(elapsedMs: number): {
  percent: number
  variant: 'good' | 'warn' | 'danger' | 'over'
} {
  const percent = Math.min(100, (elapsedMs / SPEED_BONUS_TIME_MS) * 100)
  if (elapsedMs >= SPEED_BONUS_TIME_MS) return { percent: 100, variant: 'over' }
  if (percent >= 85) return { percent, variant: 'danger' }
  if (percent >= 50) return { percent, variant: 'warn' }
  return { percent, variant: 'good' }
}
