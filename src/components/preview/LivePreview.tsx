import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { validateExercise } from '../../engine/validator'
import { buildPreviewDocument } from '../../engine/validator'
import type { ValidationRule } from '../../types'

export interface LivePreviewHandle {
  getDocument: () => Promise<Document | null>
  refresh: () => void
}

interface LivePreviewProps {
  html: string
  css: string
  js: string
  captureConsole?: boolean
}

export const LivePreview = forwardRef<LivePreviewHandle, LivePreviewProps>(function LivePreview(
  { html, css, js, captureConsole },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [consoleLines, setConsoleLines] = useState<string[]>([])
  const codeRef = useRef({ html, css, js, captureConsole })
  codeRef.current = { html, css, js, captureConsole }

  const applyPreview = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    const { html: h, css: c, js: j, captureConsole: cap } = codeRef.current
    iframe.srcdoc = buildPreviewDocument(h, c, j, cap)
  }

  useImperativeHandle(ref, () => ({
    refresh: applyPreview,
    getDocument: () =>
      new Promise((resolve) => {
        const iframe = iframeRef.current
        if (!iframe) {
          resolve(null)
          return
        }
        applyPreview()
        const done = () => {
          setTimeout(() => {
            resolve(iframe.contentDocument)
            if (codeRef.current.captureConsole) {
              try {
                const win = iframe.contentWindow as Window & { __consoleOutput?: string[] }
                setConsoleLines(win?.__consoleOutput ?? [])
              } catch {
                setConsoleLines([])
              }
            }
          }, codeRef.current.captureConsole ? 200 : 80)
        }
        iframe.onload = done
        if (iframe.contentDocument?.readyState === 'complete') done()
      }),
  }))

  useEffect(() => {
    applyPreview()
    if (!captureConsole) return
    const timer = setTimeout(() => {
      try {
        const win = iframeRef.current?.contentWindow as Window & { __consoleOutput?: string[] }
        setConsoleLines(win?.__consoleOutput ?? [])
      } catch {
        setConsoleLines([])
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [html, css, js, captureConsole])

  return (
    <>
      <div className="preview-panel">
        <div className="preview-panel__header">Preview live — votre projet</div>
        <iframe
          ref={iframeRef}
          className="preview-frame"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      {captureConsole && (
        <div className="console-panel">
          {consoleLines.length === 0 ? (
            <span style={{ color: '#8b949e' }}>&gt; En attente de sortie...</span>
          ) : (
            consoleLines.map((line, i) => (
              <div key={i}>&gt; {line}</div>
            ))
          )}
        </div>
      )}
    </>
  )
})

export function runValidation(
  html: string,
  css: string,
  js: string,
  rules: ValidationRule[],
  captureConsole = false,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;left:-9999px;width:800px;height:600px;'
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')

    iframe.onload = () => {
      setTimeout(() => {
        const doc = iframe.contentDocument
        if (!doc?.defaultView) {
          iframe.remove()
          resolve({ success: false, message: 'Impossible de charger la preview.' })
          return
        }
        const result = validateExercise(doc, rules, { html, css, js })
        iframe.remove()
        resolve(result)
      }, captureConsole ? 250 : 120)
    }

    document.body.appendChild(iframe)
    iframe.srcdoc = buildPreviewDocument(html, css, js, captureConsole)
  })
}
