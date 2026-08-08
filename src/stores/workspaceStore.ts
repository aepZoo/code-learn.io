import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT_WEB_WORKSPACE = {
  html: '',
  css: '',
  js: '',
}

const LEGACY_DEFAULT_HTML = new Set([
  '<!-- Mon projet web -->\n<h1>Titre coloré</h1>\n',
  '<h1>Mon site</h1>\n',
  '<!-- Écrivez votre code ici -->\n',
])

function isLegacyWorkspace(html: string, css: string, js: string) {
  const trimmedHtml = html.trim()
  if (LEGACY_DEFAULT_HTML.has(html) || LEGACY_DEFAULT_HTML.has(trimmedHtml)) return true
  if (/^<h1>Titre coloré<\/h1>$/i.test(trimmedHtml)) return true
  if (/^<h1>Mon site<\/h1>$/i.test(trimmedHtml)) return true
  const legacyCss = css.trim() === '/* Mes styles */' || css.trim() === '/* Mes styles */\n'
  const legacyJs = js.trim() === '// Mon JavaScript' || js.trim() === '// Mon JavaScript\n'
  return legacyCss && legacyJs && trimmedHtml.includes('<h1>')
}

function normalizeWeb(web: WorkspaceState['web']): WorkspaceState['web'] {
  if (isLegacyWorkspace(web.html, web.css, web.js)) {
    return { ...DEFAULT_WEB_WORKSPACE, initialized: web.initialized }
  }
  return web
}

interface WorkspaceState {
  web: {
    html: string
    css: string
    js: string
    initialized: boolean
  }
  setHtml: (html: string) => void
  setCss: (css: string) => void
  setJs: (js: string) => void
  initWebIfNeeded: () => void
  resetWeb: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      web: { ...DEFAULT_WEB_WORKSPACE, initialized: false },

      setHtml: (html) => set((s) => ({ web: { ...s.web, html } })),
      setCss: (css) => set((s) => ({ web: { ...s.web, css } })),
      setJs: (js) => set((s) => ({ web: { ...s.web, js } })),

      initWebIfNeeded: () => {
        const web = get().web
        if (isLegacyWorkspace(web.html, web.css, web.js)) {
          set({ web: { ...DEFAULT_WEB_WORKSPACE, initialized: true } })
          return
        }
        if (!web.initialized) {
          set({ web: { ...DEFAULT_WEB_WORKSPACE, initialized: true } })
        }
      },

      resetWeb: () => set({ web: { ...DEFAULT_WEB_WORKSPACE, initialized: true } }),
    }),
    {
      name: 'code-learn-workspace',
      version: 1,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== 'object') return persisted as WorkspaceState
        const state = persisted as WorkspaceState
        if (state.web) state.web = normalizeWeb(state.web)
        return state
      },
    },
  ),
)
