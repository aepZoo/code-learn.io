import { Link, useLocation } from 'react-router-dom'
import { useProgressStore } from '../../stores/progressStore'
import { xpProgressInLevel } from '../../engine/xpCalculator'

export function GameHUD() {
  const { player } = useProgressStore()
  const xp = xpProgressInLevel(player.totalXP)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="game-hud">
      <Link to="/" className="game-hud__brand">
        <span>⚡</span> code-learn.io
      </Link>

      <div className="game-hud__player">
        <div className="game-hud__avatar">{player.avatar}</div>
        <div>
          <div className="game-hud__level">Niv. {player.level} — {player.title}</div>
          <div className="game-hud__xp-bar">
            <div className="game-hud__xp-fill" style={{ width: `${xp.percent}%` }} />
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.totalXP} XP</span>
      </div>

      <nav className="game-hud__nav">
        <Link to="/" className={`nav-btn ${isActive('/') ? 'active' : ''}`}>Accueil</Link>
        <Link to="/track/web" className={`nav-btn ${location.pathname.includes('/track') ? 'active' : ''}`}>Parcours</Link>
        <Link to="/profile" className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}>Profil</Link>
      </nav>
    </header>
  )
}
