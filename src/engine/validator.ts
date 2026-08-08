import type { ValidationRule } from '../types'

function checkValue(actual: string, check: ValidationRule['checks'][0]): boolean {
  if (check.equals !== undefined && actual !== check.equals) return false
  if (check.contains !== undefined && !actual.includes(check.contains)) return false
  if (check.matches !== undefined && !new RegExp(check.matches).test(actual)) return false
  return true
}

function getPropertyValue(el: Element, property: string): string {
  if (property === 'textContent') return el.textContent?.trim() ?? ''
  if (property === 'innerHTML') return el.innerHTML
  if (property === 'tagName') return el.tagName.toLowerCase()
  const attr = el.getAttribute(property)
  if (attr !== null) return attr
  return (el as HTMLElement).style.getPropertyValue(property)
}

export function validateExercise(
  doc: Document,
  rules: ValidationRule[],
): { success: boolean; message: string } {
  for (const rule of rules) {
    if (rule.type === 'html-structure') {
      const html = doc.documentElement.outerHTML
      for (const check of rule.checks) {
        if (check.contains && !html.includes(check.contains)) {
          return { success: false, message: `Le HTML doit contenir : ${check.contains}` }
        }
        if (check.matches && !new RegExp(check.matches, 'i').test(html)) {
          return { success: false, message: 'La structure HTML ne correspond pas.' }
        }
      }
      continue
    }

    if (rule.type === 'dom-exists' || rule.type === 'css-property') {
      if (!rule.selector) {
        return { success: false, message: 'Règle de validation invalide.' }
      }
      const elements = doc.querySelectorAll(rule.selector)
      if (elements.length === 0) {
        return { success: false, message: `Élément manquant : ${rule.selector}` }
      }
      const el = elements[0]

      if (rule.type === 'css-property') {
        const computed = doc.defaultView?.getComputedStyle(el)
        if (!computed) {
          return { success: false, message: 'Impossible de lire les styles.' }
        }
        for (const check of rule.checks) {
          if (!check.property) continue
          const value = computed.getPropertyValue(check.property)
          if (!checkValue(value, check)) {
            return {
              success: false,
              message: `Style incorrect sur ${rule.selector} (${check.property})`,
            }
          }
        }
        continue
      }

      for (const check of rule.checks) {
        if (!check.property) continue
        const value = getPropertyValue(el, check.property)
        if (!checkValue(value, check)) {
          return {
            success: false,
            message: `Valeur incorrecte pour ${rule.selector}.${check.property}`,
          }
        }
      }
    }

    if (rule.type === 'js-output') {
      const output = (doc.defaultView as Window & { __consoleOutput?: string[] })?.__consoleOutput ?? []
      for (const check of rule.checks) {
        const joined = output.join('\n')
        if (check.contains && !joined.includes(check.contains)) {
          return { success: false, message: `Sortie console attendue : ${check.contains}` }
        }
      }
    }
  }

  return { success: true, message: 'Bravo ! Exercice réussi !' }
}

export function buildPreviewDocument(html: string, css: string, js: string, captureConsole = false): string {
  const consoleCapture = captureConsole
    ? `
    const __logs = [];
    const _log = console.log;
    console.log = (...args) => {
      __logs.push(args.map(a => String(a)).join(' '));
      window.__consoleOutput = __logs;
      _log.apply(console, args);
    };`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${css}</style>
</head>
<body>
${html}
<script>
${consoleCapture}
try {
${js}
} catch (e) {
  console.error(e.message);
}
</script>
</body>
</html>`
}
