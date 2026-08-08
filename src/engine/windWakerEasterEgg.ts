import { useEffect } from 'react'
import { useProgressStore } from '../stores/progressStore'

export function ThemeSync() {
  const theme = useProgressStore((s) => s.settings.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

const SEQUENCE = ['ArrowRight', 'ArrowLeft', 'ArrowDown'] as const
const RESET_MS = 2500

/** Easter egg Wind Waker : → ← ↓ bascule le thème */
export function installWindWakerEasterEgg() {
  let index = 0
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  const reset = () => {
    index = 0
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = undefined
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return

    const target = e.target as HTMLElement
    if (target.closest('textarea, input, .monaco-editor, [contenteditable="true"]')) return

    const expected = SEQUENCE[index]
    if (e.key === expected) {
      e.preventDefault()
      index++
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(reset, RESET_MS)

      if (index >= SEQUENCE.length) {
        reset()
        useProgressStore.getState().toggleTheme()
        flashWindWakerToast()
      }
      return
    }

    index = e.key === SEQUENCE[0] ? 1 : 0
    if (index === 1) {
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(reset, RESET_MS)
    }
  })
}

function flashWindWakerToast() {
  const theme = useProgressStore.getState().settings.theme
  const el = document.createElement('div')
  el.className = 'wind-waker-toast'
  el.textContent = theme === 'dark' ? '🌙 Thème sombre' : '☀️ Thème clair'
  document.body.appendChild(el)
  requestAnimationFrame(() => el.classList.add('visible'))
  setTimeout(() => {
    el.classList.remove('visible')
    setTimeout(() => el.remove(), 400)
  }, 1800)
}
