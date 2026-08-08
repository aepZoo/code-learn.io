import Editor from '@monaco-editor/react'

type Tab = 'html' | 'css' | 'js'

interface CodeEditorProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  html: string
  css: string
  js: string
  onHtmlChange: (v: string) => void
  onCssChange: (v: string) => void
  onJsChange: (v: string) => void
  visibleTabs?: Tab[]
}

const LANG_MAP: Record<Tab, string> = { html: 'html', css: 'css', js: 'javascript' }

export function CodeEditor({
  activeTab,
  onTabChange,
  html,
  css,
  js,
  onHtmlChange,
  onCssChange,
  onJsChange,
  visibleTabs = ['html', 'css', 'js'],
}: CodeEditorProps) {
  const values: Record<Tab, string> = { html, css, js }
  const onChange: Record<Tab, (v: string) => void> = {
    html: onHtmlChange,
    css: onCssChange,
    js: onJsChange,
  }

  return (
    <div className="exercise-editor-panel">
      <div className="editor-tabs">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            className={`editor-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="code-editor-wrap">
        <Editor
          height="100%"
          language={LANG_MAP[activeTab]}
          theme="vs-dark"
          value={values[activeTab]}
          onChange={(v) => onChange[activeTab](v ?? '')}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
