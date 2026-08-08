import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameHUD } from './components/game/GameHUD'
import { ThemeSync } from './engine/windWakerEasterEgg'
import { Home } from './pages/Home'
import { TrackMapPage } from './pages/TrackMapPage'
import { ExercisePage } from './pages/ExercisePage'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter basename="/code-learn.io">
      <div className="app-shell">
        <ThemeSync />
        <GameHUD />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track/:trackId" element={<TrackMapPage />} />
            <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
