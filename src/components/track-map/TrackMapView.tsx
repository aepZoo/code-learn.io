import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../../stores/progressStore'
import { webChapters } from '../../content/tracks/web/chapters'
import { webExercises } from '../../content/tracks/web/exercises'

export function TrackMapView() {
  const navigate = useNavigate()
  const { isExerciseUnlocked, isExerciseCompleted, tracks } = useProgressStore()
  const webTrack = tracks.web

  return (
    <div>
      <div className="track-map-header">
        <h1>🌐 Parcours Web</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {webTrack.completedLessons.length} / {webExercises.length} exercices · {webTrack.xp} XP gagnés
        </p>
      </div>

      {webChapters.map((chapter) => {
        const exercises = webExercises.filter((e) => e.chapterId === chapter.id)
        return (
          <section key={chapter.id} className="chapter-section">
            <h2>
              <span>{chapter.order}.</span> {chapter.title}
            </h2>
            <div className="node-list">
              {exercises.map((ex) => {
                const unlocked = isExerciseUnlocked(ex.id)
                const completed = isExerciseCompleted(ex.id)
                const isCurrent = webTrack.currentLesson === ex.id
                const stars = webTrack.stars[ex.id]

                return (
                  <div
                    key={ex.id}
                    className={`track-node ${completed ? 'completed' : ''} ${isCurrent && !completed ? 'current' : ''} ${!unlocked ? 'locked' : 'clickable'}`}
                    onClick={() => unlocked && navigate(`/exercise/${ex.id}`)}
                    role="button"
                    tabIndex={unlocked ? 0 : -1}
                  >
                    {!unlocked && <span className="track-node__lock">🔒</span>}
                    <div className="track-node__num">#{ex.order}</div>
                    <div className="track-node__title">{ex.title}</div>
                    {completed && (
                      <div className="track-node__stars">
                        {'★'.repeat(stars ?? 1)}{'☆'.repeat(3 - (stars ?? 1))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
