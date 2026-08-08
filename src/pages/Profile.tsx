import { useProgressStore } from '../stores/progressStore'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { achievements } from '../content/achievements'
import { webExercises } from '../content/tracks/web/exercises'

export function Profile() {
  const { player, achievements: ach, tracks, stats, resetProgress } = useProgressStore()

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{player.avatar}</div>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{player.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Niveau {player.level} · {player.totalXP} XP total
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-card__value">{stats.exercisesCompleted}</div>
          <div className="stat-card__label">Exercices</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{tracks.web.xp}</div>
          <div className="stat-card__label">XP Web</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{ach.unlocked.length}</div>
          <div className="stat-card__label">Badges</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.errorsFixed}</div>
          <div className="stat-card__label">Bugs corrigés</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Achievements</h2>
      <div className="achievement-grid">
        {achievements.map((a) => {
          const unlocked = ach.unlocked.includes(a.id)
          return (
            <div key={a.id} className={`achievement-card ${unlocked ? '' : 'locked'}`}>
              <div className="achievement-card__icon">{a.icon}</div>
              <div className="achievement-card__title">{a.title}</div>
              <div className="achievement-card__desc">{a.description}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '32px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
          Progression Web : {tracks.web.completedLessons.length} / {webExercises.length}
        </p>
        <button className="btn btn-secondary" onClick={() => {
          if (confirm('Réinitialiser toute la progression ?')) resetProgress()
        }}>
          Réinitialiser la progression
        </button>
        <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={() => {
          if (confirm('Réinitialiser votre projet web (HTML/CSS/JS) ?')) {
            useWorkspaceStore.getState().resetWeb()
          }
        }}>
          Réinitialiser le projet
        </button>
      </div>
    </>
  )
}
