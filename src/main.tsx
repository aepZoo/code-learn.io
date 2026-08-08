import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { installConsoleSecrets } from './engine/consoleSecrets'
import { installWindWakerEasterEgg } from './engine/windWakerEasterEgg'

installConsoleSecrets()
installWindWakerEasterEgg()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
