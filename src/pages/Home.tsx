import { Link } from 'react-router-dom'
import { tracks } from '../content/tracks'
import { useProgressStore } from '../stores/progressStore'

export function Home() {
  const { player, tracks: progress } = useProgressStore()
  const webProgress = progress.web

  return (
    <>
      <section className="hero">
        <h1>Apprenez à coder en jouant</h1>
        <p>
          Bonjour {player.title} ! Progressez à travers des exercices interactifs,
          gagnez de l'XP et débloquez des achievements.
        </p>
      </section>

      <div className="track-grid">
        {tracks.map((track) => {
          const isWeb = track.id === 'web'
          const progressText = isWeb
            ? `${webProgress.completedLessons.length}/${15} exercices`
            : null

          if (track.comingSoon) {
            return (
              <div key={track.id} className="track-card locked">
                <div className="track-card__icon">{track.icon}</div>
                <div className="track-card__title">{track.title}</div>
                <div className="track-card__desc">{track.description}</div>
                <span className="track-card__badge soon">Bientôt</span>
              </div>
            )
          }

          return (
            <Link key={track.id} to={`/track/${track.id}`} className="track-card">
              <div className="track-card__icon">{track.icon}</div>
              <div className="track-card__title">{track.title}</div>
              <div className="track-card__desc">{track.description}</div>
              {progressText && <span className="track-card__badge">{progressText}</span>}
            </Link>
          )
        })}
      </div>
    </>
  )
}
