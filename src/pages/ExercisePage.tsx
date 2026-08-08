import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { CodeEditor } from '../components/editor/CodeEditor'
import { LivePreview, loadPreviewDocument } from '../components/preview/LivePreview'
import { DesktopSimulator } from '../components/desktop/DesktopSimulator'
import { LevelUpModal } from '../components/game/LevelUpModal'
import { ToastContainer, type ToastItem } from '../components/game/ToastContainer'
import { webExercises } from '../content/tracks/web/exercises'
import { validateExercise } from '../engine/validator'
import { starsForCompletion } from '../engine/xpCalculator'
import { achievements } from '../content/achievements'
import { useProgressStore } from '../stores/progressStore'

type Tab = 'html' | 'css' | 'js'

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const navigate = useNavigate()
  const exercise = webExercises.find((e) => e.id === exerciseId)
  const startTime = useRef(Date.now())
  const hintsUsedRef = useRef(0)

  const { completeExercise, useHint, recordError, isExerciseUnlocked } = useProgressStore()

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [js, setJs] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('html')
  const [validationMsg, setValidationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hintIndex, setHintIndex] = useState(-1)
  const [runKey, setRunKey] = useState(0)
  const [levelUp, setLevelUp] = useState<{ level: number; title: string } | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    if (!exercise) return
    setHtml(exercise.starterCode.html ?? '')
    setCss(exercise.starterCode.css ?? '')
    setJs(exercise.starterCode.js ?? '')
    setActiveTab(exercise.starterCode.html !== undefined ? 'html' : exercise.starterCode.css !== undefined ? 'css' : 'js')
    startTime.current = Date.now()
    hintsUsedRef.current = 0
    setHintIndex(-1)
    setValidationMsg(null)
  }, [exercise])

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
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

  const handleRun = () => setRunKey((k) => k + 1)

  const handleHint = () => {
    const next = hintIndex + 1
    if (next < exercise.hints.length) {
      setHintIndex(next)
      useHint()
      hintsUsedRef.current += 1
    }
  }

  const handleValidate = async () => {
    const doc = await loadPreviewDocument(html, css, js, exercise.mode === 'console')
    if (!doc) {
      setValidationMsg({ type: 'error', text: 'Impossible de charger la preview.' })
      recordError()
      return
    }

    const result = validateExercise(doc, exercise.validation)
    setValidationMsg({ type: result.success ? 'success' : 'error', text: result.message })

    if (!result.success) {
      recordError()
      return
    }

    const timeMs = Date.now() - startTime.current
    const stars = starsForCompletion(timeMs, hintsUsedRef.current)
    const { leveledUp, newLevel, newAchievements } = completeExercise(
      exercise.id,
      exercise.xpReward,
      stars,
      { noHints: hintsUsedRef.current === 0, timeMs },
    )

    addToast('xp', `+${exercise.xpReward} XP`)

    for (const achId of newAchievements) {
      const ach = achievements.find((a) => a.id === achId)
      if (ach) addToast('achievement', `🏅 ${ach.title}`)
    }

    if (leveledUp) {
      const store = useProgressStore.getState()
      setLevelUp({ level: newLevel, title: store.player.title })
    }
  }

  const visibleTabs: Tab[] = [
    ...(exercise.starterCode.html !== undefined ? (['html'] as Tab[]) : []),
    ...(exercise.starterCode.css !== undefined ? (['css'] as Tab[]) : []),
    ...(exercise.starterCode.js !== undefined || exercise.mode === 'console' ? (['js'] as Tab[]) : []),
  ]

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/track/web" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Parcours Web</Link>
          <h1 style={{ fontSize: '1.2rem', marginTop: '4px' }}>#{exercise.order} {exercise.title}</h1>
        </div>
        <span className="track-card__badge">+{exercise.xpReward} XP</span>
      </div>

      <div className="exercise-layout">
        <CodeEditor
          activeTab={activeTab}
          onTabChange={setActiveTab}
          html={html}
          css={css}
          js={js}
          onHtmlChange={setHtml}
          onCssChange={setCss}
          onJsChange={setJs}
          visibleTabs={visibleTabs.length ? visibleTabs : ['html', 'css', 'js']}
        />

        <div className="exercise-sidebar">
          <div className="exercise-instructions">
            <h2>Consignes</h2>
            <p>{exercise.description}</p>
            {hintIndex >= 0 && (
              <div className="hint-box">
                💡 {exercise.hints[hintIndex]}
              </div>
            )}
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

          {exercise.mode === 'desktop' ? (
            <DesktopSimulator key={runKey} html={html} css={css} js={js} />
          ) : exercise.mode === 'console' ? (
            <LivePreview key={runKey} html={html} css={css} js={js} captureConsole />
          ) : (
            <LivePreview key={runKey} html={html} css={css} js={js} />
          )}

          {validationMsg?.type === 'success' && (
            <button className="btn btn-primary" onClick={() => navigate('/track/web')}>
              Continuer le parcours →
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
