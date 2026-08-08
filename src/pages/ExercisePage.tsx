import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { CodeEditor } from '../components/editor/CodeEditor'
import { LivePreview, runValidation, type LivePreviewHandle } from '../components/preview/LivePreview'
import { DesktopSimulator } from '../components/desktop/DesktopSimulator'
import { LevelUpModal } from '../components/game/LevelUpModal'
import { ToastContainer, type ToastItem } from '../components/game/ToastContainer'
import { webExercises } from '../content/tracks/web/exercises'
import { validateExercise } from '../engine/validator'
import { calculateExerciseXP, starsForCompletion } from '../engine/xpCalculator'
import { ExerciseTimer } from '../components/game/ExerciseTimer'
import { achievements } from '../content/achievements'
import { useProgressStore } from '../stores/progressStore'
import { useWorkspaceStore } from '../stores/workspaceStore'

type Tab = 'html' | 'css' | 'js'

function defaultEditorTab(exercise: { id: string; chapterId: string }): Tab {
  if (exercise.id.startsWith('css-') || exercise.chapterId.startsWith('css')) return 'css'
  if (exercise.id.startsWith('js-') || exercise.chapterId.startsWith('js')) return 'js'
  return 'html'
}

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const navigate = useNavigate()
  const exercise = webExercises.find((e) => e.id === exerciseId)
  const previewRef = useRef<LivePreviewHandle>(null)
  const startTime = useRef(Date.now())
  const hintsUsedRef = useRef(0)
  const failedAttemptsRef = useRef(0)

  const { completeExercise, useHint, recordError, isExerciseUnlocked, isExerciseCompleted } = useProgressStore()
  const { web, setHtml, setCss, setJs, initWebIfNeeded } = useWorkspaceStore()

  const [activeTab, setActiveTab] = useState<Tab>('html')
  const [validationMsg, setValidationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hintIndex, setHintIndex] = useState(-1)
  const [levelUp, setLevelUp] = useState<{ level: number; title: string } | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [shake, setShake] = useState(false)
  const [showVignette, setShowVignette] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)

  useEffect(() => {
    initWebIfNeeded()
  }, [initWebIfNeeded])

  useEffect(() => {
    if (!exercise) return
    setActiveTab(defaultEditorTab(exercise))
    startTime.current = Date.now()
    hintsUsedRef.current = 0
    failedAttemptsRef.current = 0
    setHintIndex(-1)
    setValidationMsg(null)
    setHintsUsed(0)
    setFailedAttempts(0)
    setTimerRunning(true)
  }, [exercise])

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  const triggerFailureFX = useCallback(() => {
    setShake(true)
    setShowVignette(true)
    setTimeout(() => setShake(false), 500)
    setTimeout(() => setShowVignette(false), 700)
  }, [])

  if (!exercise) {
    return (
      <div>
        <p>Exercice introuvable.</p>
        <Link to="/track/web">Retour au parcours</Link>
      </div>
    )
  }

  if (!isExerciseUnlocked(exercise.id)) {
    return (
      <div>
        <p>Cet exercice est verrouillé. Complétez le précédent d'abord.</p>
        <Link to="/track/web">Retour au parcours</Link>
      </div>
    )
  }

  const alreadyCompleted = isExerciseCompleted(exercise.id)
  const estimatedXP = alreadyCompleted
    ? 0
    : calculateExerciseXP(exercise.xpReward, failedAttempts, hintsUsed)
  const nextExercise = webExercises.find((e) => e.order === exercise.order + 1)
  const showExplanation =
    isExerciseCompleted(exercise.id) || validationMsg?.type === 'success'

  const handleRun = () => previewRef.current?.refresh()

  const handleHint = () => {
    const next = hintIndex + 1
    if (next < exercise.hints.length) {
      setHintIndex(next)
      useHint()
      hintsUsedRef.current += 1
      setHintsUsed((n) => n + 1)
    }
  }

  const handleValidate = async () => {
    let result: { success: boolean; message: string }

    if (exercise.mode === 'console') {
      result = await runValidation(web.html, web.css, web.js, exercise.validation, true)
    } else {
      const doc = await previewRef.current?.getDocument()
      if (doc?.defaultView) {
        result = validateExercise(doc, exercise.validation, {
          html: web.html,
          css: web.css,
          js: web.js,
        })
      } else {
        result = await runValidation(web.html, web.css, web.js, exercise.validation)
      }
    }

    setValidationMsg({ type: result.success ? 'success' : 'error', text: result.message })

    if (!result.success) {
      recordError()
      failedAttemptsRef.current += 1
      setFailedAttempts((n) => n + 1)
      triggerFailureFX()
      return
    }

    setTimerRunning(false)
    const timeMs = Date.now() - startTime.current
    const earnedXP = calculateExerciseXP(
      exercise.xpReward,
      failedAttemptsRef.current,
      hintsUsedRef.current,
    )
    const stars = starsForCompletion(timeMs, hintsUsedRef.current, failedAttemptsRef.current)
    const { leveledUp, newLevel, newAchievements, xpEarned } = completeExercise(
      exercise.id,
      earnedXP,
      stars,
      { noHints: hintsUsedRef.current === 0, timeMs },
    )

    if (xpEarned > 0) {
      addToast('xp', `+${xpEarned} XP`)
    }

    for (const achId of newAchievements) {
      const ach = achievements.find((a) => a.id === achId)
      if (ach) addToast('achievement', `🏅 ${ach.title}`)
    }

    if (leveledUp) {
      const store = useProgressStore.getState()
      setLevelUp({ level: newLevel, title: store.player.title })
    }
  }

  const handleContinue = () => {
    if (nextExercise) navigate(`/exercise/${nextExercise.id}`)
    else navigate('/track/web')
  }

  const previewContent =
    exercise.mode === 'desktop' ? (
      <DesktopSimulator html={web.html} css={web.css} js={web.js} />
    ) : (
      <LivePreview
        ref={previewRef}
        html={web.html}
        css={web.css}
        js={web.js}
        captureConsole={exercise.mode === 'console'}
      />
    )

  return (
    <>
      {showVignette && <div className="failure-vignette" aria-hidden />}

      <header className="exercise-header">
        <div>
          <Link to="/track/web" className="exercise-header__back">← Parcours Web</Link>
          <h1 className="exercise-header__title">#{exercise.order} {exercise.title}</h1>
        </div>
        <span className="track-card__badge" title={alreadyCompleted ? 'Exercice déjà complété — rejouer sans XP' : 'XP estimé selon essais et indices'}>
          {alreadyCompleted ? '✓ Complété' : `+${estimatedXP} XP`}
          {!alreadyCompleted && (failedAttempts > 0 || hintsUsed > 0) && (
            <span className="exercise-xp-penalty"> / {exercise.xpReward}</span>
          )}
        </span>
      </header>

      <section className="exercise-instructions exercise-instructions--inline">
        <p>{exercise.description}</p>
        <p className="exercise-workspace-note">
          Vous travaillez sur <strong>le même projet</strong> — votre code est conservé entre les exercices.
        </p>
        {hintIndex >= 0 && (
          <div className="hint-box">💡 {exercise.hints[hintIndex]}</div>
        )}
        {(failedAttempts > 0 || hintsUsed > 0) && (
          <p className="exercise-penalty-note">
            {failedAttempts > 0 && `${failedAttempts} essai(s) raté(s) · -${failedAttempts * 5} XP`}
            {failedAttempts > 0 && hintsUsed > 0 && ' · '}
            {hintsUsed > 0 && `${hintsUsed} indice(s) · -${hintsUsed * 5} XP`}
          </p>
        )}
        {showExplanation && (
          <div className="exercise-explanation">
            <strong>Ce que vous avez appris</strong>
            <p>{exercise.explanation}</p>
          </div>
        )}
      </section>

      <ExerciseTimer running={timerRunning} resetKey={exercise.id} />

      <div className="exercise-layout">
        <CodeEditor
          activeTab={activeTab}
          onTabChange={setActiveTab}
          html={web.html}
          css={web.css}
          js={web.js}
          onHtmlChange={setHtml}
          onCssChange={setCss}
          onJsChange={setJs}
          visibleTabs={['html', 'css', 'js']}
        />

        <div className={`exercise-preview-col ${shake ? 'shake' : ''}`}>
          <div className="exercise-preview-area">
            {previewContent}
          </div>

          <div className="exercise-actions">
            <button className="btn btn-secondary" onClick={handleRun}>▶ Exécuter</button>
            <button className="btn btn-success" onClick={handleValidate}>✓ Valider</button>
            {hintIndex < exercise.hints.length - 1 && (
              <button className="btn btn-ghost" onClick={handleHint}>
                💡 Indice (-5 XP)
              </button>
            )}
          </div>

          {validationMsg && (
            <div className={`validation-msg ${validationMsg.type}`}>{validationMsg.text}</div>
          )}

          {validationMsg?.type === 'success' && (
            <button className="btn btn-primary" onClick={handleContinue}>
              {nextExercise ? `Exercice suivant →` : 'Retour au parcours →'}
            </button>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
      {levelUp && (
        <LevelUpModal
          level={levelUp.level}
          title={levelUp.title}
          onClose={() => setLevelUp(null)}
        />
      )}
    </>
  )
}
