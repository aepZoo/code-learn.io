export function xpForLevel(level: number): number {
  return level * level * 100
}

export function levelFromXP(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100))
}

export function xpProgressInLevel(totalXP: number): { current: number; needed: number; percent: number } {
  const level = levelFromXP(totalXP)
  const currentLevelXP = xpForLevel(level)
  const nextLevelXP = xpForLevel(level + 1)
  const current = totalXP - currentLevelXP
  const needed = nextLevelXP - currentLevelXP
  return {
    current,
    needed,
    percent: Math.min(100, (current / needed) * 100),
  }
}

export function titleForLevel(level: number): string {
  if (level >= 20) return 'Architecte'
  if (level >= 10) return 'Développeur'
  if (level >= 5) return 'Codeur'
  return 'Apprenti'
}

export function starsForCompletion(
  timeMs: number,
  hintsUsed: number,
  failedAttempts: number,
): 1 | 2 | 3 {
  if (failedAttempts === 0 && hintsUsed === 0 && timeMs < 120000) return 3
  if (failedAttempts <= 1 && hintsUsed <= 1) return 2
  return 1
}

/** XP earned after penalties for hints and failed validation attempts. */
export function calculateExerciseXP(
  baseXP: number,
  failedAttempts: number,
  hintsUsed: number,
): number {
  const penalty = failedAttempts * 5 + hintsUsed * 5
  return Math.max(Math.floor(baseXP * 0.4), baseXP - penalty)
}
