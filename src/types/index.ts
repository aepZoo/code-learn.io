export type ValidationType = 'dom-exists' | 'css-property' | 'css-source' | 'html-structure' | 'js-output'

export interface ValidationCheck {
  property?: string
  equals?: string
  contains?: string
  matches?: string
}

export interface ValidationRule {
  type: ValidationType
  selector?: string
  checks: ValidationCheck[]
  minCount?: number
}

export interface Exercise {
  id: string
  chapterId: string
  title: string
  description: string
  difficulty: 1 | 2 | 3
  xpReward: number
  hints: string[]
  hintCost: number
  starterCode: {
    html?: string
    css?: string
    js?: string
  }
  validation: ValidationRule[]
  mode: 'preview' | 'console' | 'desktop'
  order: number
}

export interface Chapter {
  id: string
  title: string
  description: string
  order: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpBonus: number
}

export interface Track {
  id: string
  title: string
  description: string
  icon: string
  locked: boolean
  comingSoon?: boolean
}

export interface PlayerProgress {
  version: 1
  player: {
    level: number
    totalXP: number
    avatar: string
    title: string
  }
  tracks: {
    web: {
      xp: number
      completedLessons: string[]
      currentLesson: string | null
      stars: Record<string, 1 | 2 | 3>
    }
    python: { locked: true }
    rust: { locked: true }
  }
  achievements: {
    unlocked: string[]
    dates: Record<string, string>
  }
  settings: {
    theme: 'light' | 'dark'
    editorFontSize: number
    soundEnabled: boolean
  }
  stats: {
    errorsFixed: number
    hintsUsed: number
    exercisesCompleted: number
  }
  _migration?: {
    readyForSync: boolean
    localId: string
  }
}
