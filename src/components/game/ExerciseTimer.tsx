import { useEffect, useState } from 'react'
import { formatElapsed, SPEED_BONUS_TIME_MS, timerBarState } from '../../engine/timerUtils'

interface ExerciseTimerProps {
  running: boolean
  resetKey: string
}

export function ExerciseTimer({ running, resetKey }: ExerciseTimerProps) {
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    setElapsedMs(0)
    if (!running) return

    const startedAt = Date.now()
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startedAt)
    }, 200)

    return () => clearInterval(id)
  }, [running, resetKey])

  const { percent, variant } = timerBarState(elapsedMs)
  const targetLabel = formatElapsed(SPEED_BONUS_TIME_MS)

  return (
    <div className="exercise-timer">
      <div className="exercise-timer__header">
        <span className="exercise-timer__label">⏱ {formatElapsed(elapsedMs)}</span>
        <span className="exercise-timer__target">
          {elapsedMs < SPEED_BONUS_TIME_MS
            ? `Bonus vitesse : ${targetLabel}`
            : 'Bonus vitesse perdu'}
        </span>
      </div>
      <div className="exercise-timer__track">
        <div
          className={`exercise-timer__fill exercise-timer__fill--${variant}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
