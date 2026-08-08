import { useProgressStore } from '../stores/progressStore'

/** Backdoor console — discoverable via l'inspecteur JS */
export function installConsoleSecrets() {
  const w = window as Window & { give?: (id: string) => string }

  Object.defineProperty(w, 'give', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: (id: string) => {
      const { unlocked, message } = useProgressStore.getState().unlockSecretAchievement(id)
      if (unlocked) console.info('%c' + message, 'color: #6C5CE7; font-weight: bold;')
      return message
    },
  })
}
