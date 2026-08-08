import { useEffect, useRef, useState } from 'react'
import { buildPreviewDocument } from '../../engine/validator'

interface DesktopSimulatorProps {
  html: string
  css: string
  js: string
}

function getTimeString() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

export function DesktopSimulator({ html, css, js }: DesktopSimulatorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [time, setTime] = useState(getTimeString())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeString()), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    iframe.srcdoc = buildPreviewDocument(html, css, js)
  }, [html, css, js])

  return (
    <div className="desktop-sim">
      <div className="desktop-sim__menubar">
        <span>🖥️ CodeDesk OS</span>
        <span>🔋 {time} 📶</span>
      </div>

      <div className="desktop-sim__workspace">
        <div className="desktop-window">
          <div className="desktop-window__titlebar">
            <div className="desktop-window__dots">
              <span /><span /><span />
            </div>
            📁 Fichiers
          </div>
          <div className="desktop-window__content">
            <div className="file-tree">
              <div className="file-tree__item active">📄 index.html</div>
              <div className="file-tree__item">📄 style.css</div>
              <div className="file-tree__item">📄 script.js</div>
            </div>
          </div>
        </div>

        <div className="desktop-window">
          <div className="desktop-window__titlebar">
            <div className="desktop-window__dots">
              <span /><span /><span />
            </div>
            🌐 Mon App
          </div>
          <div className="desktop-window__content">
            <iframe
              ref={iframeRef}
              className="preview-frame"
              title="Mon App"
              sandbox="allow-scripts"
              style={{ height: '100%', minHeight: '300px' }}
            />
          </div>
        </div>
      </div>

      <div className="desktop-sim__taskbar">
        <span className="taskbar-icon">🚀</span>
        <span className="taskbar-icon">📂</span>
        <span className="taskbar-icon">🌐</span>
        <span className="taskbar-icon">💻</span>
        <span className="taskbar-icon">⚙️</span>
      </div>
    </div>
  )
}

