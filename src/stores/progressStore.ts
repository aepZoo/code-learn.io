import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlayerProgress } from '../types'
import { levelFromXP, titleForLevel } from '../engine/xpCalculator'
import { SPEED_BONUS_TIME_MS } from '../engine/timerUtils'
import { achievements, SECRET_ACHIEVEMENT_IDS } from '../content/achievements'
import { webExercises } from '../content/tracks/web/exercises'
import { useWorkspaceStore } from './workspaceStore'

const LOCAL_ID = crypto.randomUUID()

function createInitialProgress(): PlayerProgress {
  return {
    version: 1,
    player: {
      level: 0,
      totalXP: 0,
      avatar: '🧑‍💻',
      title: 'Apprenti',
    },
    tracks: {
      web: {
        xp: 0,
        completedLessons: [],
        currentLesson: webExercises[0]?.id ?? null,
        stars: {},
      },
      python: { locked: true },
      rust: { locked: true },
    },
    achievements: { unlocked: [], dates: {} },
    settings: { theme: 'light', editorFontSize: 14, soundEnabled: true },
    stats: { errorsFixed: 0, hintsUsed: 0, exercisesCompleted: 0 },
    _migration: { readyForSync: true, localId: LOCAL_ID },
  }
}

function checkAchievements(state: PlayerProgress, exerciseId?: string): string[] {
  const newlyUnlocked: string[] = []
  const unlock = (id: string) => {
    if (!state.achievements.unlocked.includes(id)) {
      newlyUnlocked.push(id)
      state.achievements.unlocked.push(id)
      state.achievements.dates[id] = new Date().toISOString()
      const ach = achievements.find((a) => a.id === id)
      if (ach) state.player.totalXP += ach.xpBonus
    }
  }

  if (exerciseId && state.stats.exercisesCompleted === 1) unlock('first_code')
  if (state.player.level >= 5) unlock('level_5')
  if (state.player.level >= 10) unlock('level_10')

  const htmlDone = webExercises.filter((e) => e.chapterId.startsWith('html')).every((e) =>
    state.tracks.web.completedLessons.includes(e.id),
  )
  if (htmlDone) unlock('html_master')

  const cssDone = webExercises.filter((e) => e.chapterId.startsWith('css')).every((e) =>
    state.tracks.web.completedLessons.includes(e.id),
  )
  if (cssDone) unlock('css_artist')

  const allWeb = webExercises.every((e) => state.tracks.web.completedLessons.includes(e.id))
  if (allWeb) unlock('web_complete')

  if (state.stats.errorsFixed >= 10) unlock('bug_hunter')

  const hour = new Date().getHours()
  if (hour >= 22 || hour < 5) unlock('night_owl')

  return newlyUnlocked
}

interface ProgressState extends PlayerProgress {
  addXP: (amount: number, trackId?: 'web') => { leveledUp: boolean; newLevel: number }
  completeExercise: (
    exerciseId: string,
    xp: number,
    stars: 1 | 2 | 3,
    meta?: { noHints?: boolean; timeMs?: number },
  ) => { leveledUp: boolean; newLevel: number; newAchievements: string[]; xpEarned: number }
  useHint: () => void
  recordError: () => void
  isExerciseUnlocked: (exerciseId: string) => boolean
  isExerciseCompleted: (exerciseId: string) => boolean
  resetProgress: () => void
  unlockSecretAchievement: (id: string) => { unlocked: boolean; message: string }
  toggleTheme: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...createInitialProgress(),

      addXP: (amount, trackId) => {
        let leveledUp = false
        let newLevel = get().player.level
        set((state) => {
          const oldLevel = levelFromXP(state.player.totalXP)
          state.player.totalXP += amount
          if (trackId === 'web') state.tracks.web.xp += amount
          newLevel = levelFromXP(state.player.totalXP)
          state.player.level = newLevel
          state.player.title = titleForLevel(newLevel)
          leveledUp = newLevel > oldLevel
          checkAchievements(state)
          return { ...state }
        })
        return { leveledUp, newLevel }
      },

      completeExercise: (exerciseId, xp, stars, meta) => {
        let leveledUp = false
        let newLevel = get().player.level
        let newAchievements: string[] = []
        let xpEarned = 0
        set((state) => {
          const alreadyDone = state.tracks.web.completedLessons.includes(exerciseId)
          xpEarned = alreadyDone ? 0 : xp

          if (!alreadyDone) {
            state.tracks.web.completedLessons.push(exerciseId)
            state.stats.exercisesCompleted += 1
          }

          state.tracks.web.stars[exerciseId] = Math.max(
            state.tracks.web.stars[exerciseId] ?? 0,
            stars,
          ) as 1 | 2 | 3

          if (xpEarned > 0) {
            const oldLevel = levelFromXP(state.player.totalXP)
            state.player.totalXP += xpEarned
            state.tracks.web.xp += xpEarned
            newLevel = levelFromXP(state.player.totalXP)
            state.player.level = newLevel
            state.player.title = titleForLevel(newLevel)
            leveledUp = newLevel > oldLevel
          }

          const idx = webExercises.findIndex((e) => e.id === exerciseId)
          if (idx >= 0 && idx < webExercises.length - 1) {
            state.tracks.web.currentLesson = webExercises[idx + 1].id
          }

          if (!alreadyDone && meta?.noHints) {
            const ach = achievements.find((a) => a.id === 'no_hints')
            if (ach && !state.achievements.unlocked.includes('no_hints')) {
              state.achievements.unlocked.push('no_hints')
              state.achievements.dates['no_hints'] = new Date().toISOString()
              state.player.totalXP += ach.xpBonus
            }
          }
          if (!alreadyDone && meta?.timeMs && meta.timeMs < SPEED_BONUS_TIME_MS) {
            const ach = achievements.find((a) => a.id === 'speed_run')
            if (ach && !state.achievements.unlocked.includes('speed_run')) {
              state.achievements.unlocked.push('speed_run')
              state.achievements.dates['speed_run'] = new Date().toISOString()
              state.player.totalXP += ach.xpBonus
            }
          }

          newAchievements = alreadyDone ? [] : checkAchievements(state, exerciseId)
          return { ...state }
        })
        return { leveledUp, newLevel, newAchievements, xpEarned }
      },

      useHint: () =>
        set((state) => {
          state.stats.hintsUsed += 1
          state.player.totalXP = Math.max(0, state.player.totalXP - 5)
          return { ...state }
        }),

      recordError: () =>
        set((state) => {
          state.stats.errorsFixed += 1
          checkAchievements(state)
          return { ...state }
        }),

      isExerciseUnlocked: (exerciseId) => {
        const idx = webExercises.findIndex((e) => e.id === exerciseId)
        if (idx <= 0) return true
        const prev = webExercises[idx - 1]
        return get().tracks.web.completedLessons.includes(prev.id)
      },

      isExerciseCompleted: (exerciseId) =>
        get().tracks.web.completedLessons.includes(exerciseId),

      resetProgress: () => {
        set(createInitialProgress())
        useWorkspaceStore.getState().resetWeb()
      },

      toggleTheme: () =>
        set((state) => {
          state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light'
          return { ...state }
        }),

      unlockSecretAchievement: (id) => {
        if (!SECRET_ACHIEVEMENT_IDS.has(id)) {
          return { unlocked: false, message: 'Achievement inconnu.' }
        }
        const ach = achievements.find((a) => a.id === id)
        if (!ach) return { unlocked: false, message: 'Achievement inconnu.' }

        if (get().achievements.unlocked.includes(id)) {
          return { unlocked: false, message: 'Achievement déjà débloqué.' }
        }

        set((state) => {
          state.achievements.unlocked.push(id)
          state.achievements.dates[id] = new Date().toISOString()
          state.player.totalXP += ach.xpBonus
          const newLevel = levelFromXP(state.player.totalXP)
          state.player.level = newLevel
          state.player.title = titleForLevel(newLevel)
          return { ...state }
        })

        return {
          unlocked: true,
          message: `🏅 Achievement débloqué : ${ach.revealedTitle ?? ach.title} (+${ach.xpBonus} XP)`,
        }
      },
    }),
    { name: 'code-learn-progress' },
  ),
)
