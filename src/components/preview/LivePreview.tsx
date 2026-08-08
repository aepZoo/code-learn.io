import { useEffect, useRef, useState } from 'react'
import { buildPreviewDocument } from '../../engine/validator'

interface LivePreviewProps {
  html: string
  css: string
  js: string
  captureConsole?: boolean
}

export function LivePreview({ html, css, js, captureConsole }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [consoleLines, setConsoleLines] = useState<string[]>([])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    iframe.srcdoc = buildPreviewDocument(html, css, js, captureConsole)

    if (captureConsole) {
      const timer = setTimeout(() => {
        try {
          const win = iframe.contentWindow as Window & { __consoleOutput?: string[] }
          setConsoleLines(win?.__consoleOutput ?? [])
        } catch {
          setConsoleLines([])
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [html, css, js, captureConsole])

  return (
    <>
      <div className="preview-panel">
        <div className="preview-panel__header">Preview live</div>
        <iframe ref={iframeRef} className="preview-frame" title="Preview" sandbox="allow-scripts" />
      </div>
      {captureConsole && (
        <div className="console-panel">
          {consoleLines.length === 0 ? (
            <span style={{ color: '#8b949e' }}>&gt; En attente de sortie...</span>
          ) : (
            consoleLines.map((line, i) => <div key={i}>&gt; {line}</div>)
          )}
        </div>
      )}
    </>
  )
}

export function loadPreviewDocument(
  html: string,
  css: string,
  js: string,
  captureConsole = false,
): Promise<Document | null> {
  return new Promise((resolve) => {
    let settled = false
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;left:-9999px;width:800px;height:600px;'
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')

    const finish = () => {
      if (settled) return
      settled = true
      const doc = iframe.contentDocument
      iframe.remove()
      resolve(doc)
    }

    iframe.onload = () => setTimeout(finish, captureConsole ? 200 : 150)
    document.body.appendChild(iframe)
    iframe.srcdoc = buildPreviewDocument(html, css, js, captureConsole)
    setTimeout(finish, 800)
  })
}
