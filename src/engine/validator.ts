import type { ValidationRule, ValidationCheck } from '../types'

function normalizeCssValue(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase()
}

function parseRgbComponents(color: string): [number, number, number] | null {
  const c = normalizeCssValue(color)
  const hex = c.match(/^#([0-9a-f]{6})$/)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const shortHex = c.match(/^#([0-9a-f]{3})$/)
  if (shortHex) {
    const [r, g, b] = shortHex[1].split('').map((x) => parseInt(x + x, 16))
    return [r, g, b]
  }
  const rgb = c.match(/^rgba?\((\d+),(\d+),(\d+)/)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

function parseExpectedRgb(needle: string): [number, number, number] | null {
  const parts = needle.split(',').map((p) => parseInt(p.trim(), 10))
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
    return [parts[0], parts[1], parts[2]]
  }
  return parseRgbComponents(needle)
}

function colorsMatch(actual: string, expected: string): boolean {
  const a = parseRgbComponents(actual)
  const b = parseExpectedRgb(expected)
  if (a && b) return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
  return normalizeCssValue(actual).includes(normalizeCssValue(expected))
}

function checkCssValue(actual: string, check: ValidationCheck): boolean {
  if (check.equals !== undefined) {
    if (check.property?.includes('color') || check.property === 'background-color') {
      return colorsMatch(actual, check.equals)
    }
    return normalizeCssValue(actual) === normalizeCssValue(check.equals)
  }
  if (check.contains !== undefined) {
    if (
      check.property?.includes('color') ||
      check.property === 'background-color' ||
      /^\d+\s*,\s*\d+\s*,\s*\d+/.test(check.contains) ||
      check.contains.startsWith('#')
    ) {
      return colorsMatch(actual, check.contains)
    }
    return normalizeCssValue(actual).includes(normalizeCssValue(check.contains))
  }
  if (check.matches !== undefined) {
    return new RegExp(check.matches, 'i').test(actual)
  }
  return true
}

function checkValue(actual: string, check: ValidationCheck): boolean {
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

function getComputedCssValue(doc: Document, el: Element, property: string): string {
  const computed = doc.defaultView?.getComputedStyle(el)
  if (!computed) return ''
  let value = computed.getPropertyValue(property)
  if (!value && property === 'background-color') {
    value = computed.getPropertyValue('background')
  }
  return value
}

export function validateExercise(
  doc: Document,
  rules: ValidationRule[],
  sources: { html?: string; css?: string; js?: string } = {},
): { success: boolean; message: string } {
  for (const rule of rules) {
    if (rule.type === 'css-source') {
      const cssText = sources.css ?? ''
      for (const check of rule.checks) {
        if (check.contains && !cssText.includes(check.contains)) {
          return { success: false, message: `Ajoutez au CSS : ${check.contains}` }
        }
        if (check.matches && !new RegExp(check.matches, 'i').test(cssText)) {
          return { success: false, message: 'Le CSS ne contient pas la règle attendue.' }
        }
      }
      continue
    }

    if (rule.type === 'html-structure') {
      const html = doc.documentElement.outerHTML
      for (const check of rule.checks) {
        if (check.contains && !html.includes(check.contains)) {
          return { success: false, message: `Le HTML doit contenir : ${check.contains}` }
        }
        if (check.matches && !new RegExp(check.matches, 'is').test(html)) {
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
      if (rule.minCount !== undefined && elements.length < rule.minCount) {
        return {
          success: false,
          message: `Il faut au moins ${rule.minCount} élément(s) "${rule.selector}" (trouvé : ${elements.length})`,
        }
      }
      if (elements.length === 0) {
        return { success: false, message: `Élément manquant : ${rule.selector}` }
      }
      const el = elements[0]

      if (rule.type === 'css-property') {
        for (const check of rule.checks) {
          if (!check.property) continue
          const value = getComputedCssValue(doc, el, check.property)
          if (!value) {
            return {
              success: false,
              message: `Propriété CSS manquante : ${rule.selector} { ${check.property} }`,
            }
          }
          if (!checkCssValue(value, check)) {
            return {
              success: false,
              message: `Style incorrect sur ${rule.selector} (${check.property}: "${value.trim()}")`,
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
