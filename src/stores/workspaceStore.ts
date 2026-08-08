import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT_WEB_WORKSPACE = {
  html: '<!-- Mon projet web -->\n<h1>Titre coloré</h1>\n',
  css: '/* Mes styles */\n',
  js: '// Mon JavaScript\n',
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
        if (!get().web.initialized) {
          set({ web: { ...DEFAULT_WEB_WORKSPACE, initialized: true } })
        }
      },

      resetWeb: () => set({ web: { ...DEFAULT_WEB_WORKSPACE, initialized: true } }),
    }),
    { name: 'code-learn-workspace' },
  ),
)
