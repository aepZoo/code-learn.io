import type { Achievement } from '../types'

export const achievements: Achievement[] = [
  { id: 'first_code', title: 'Première ligne', description: 'Compléter votre premier exercice', icon: '🎯', xpBonus: 15 },
  { id: 'html_master', title: 'Maître HTML', description: 'Terminer tous les exercices HTML', icon: '📄', xpBonus: 15 },
  { id: 'css_artist', title: 'Artiste CSS', description: 'Terminer tous les exercices CSS', icon: '🎨', xpBonus: 15 },
  { id: 'no_hints', title: 'Sans filet', description: 'Réussir un exercice sans indice', icon: '🧠', xpBonus: 15 },
  { id: 'speed_run', title: 'Speed run', description: 'Exercice en moins de 2 minutes', icon: '⚡', xpBonus: 15 },
  { id: 'bug_hunter', title: 'Chasseur de bugs', description: 'Corriger 10 erreurs', icon: '🐛', xpBonus: 15 },
  { id: 'night_owl', title: 'Oiseau de nuit', description: 'Coder après 22h', icon: '🦉', xpBonus: 15 },
  { id: 'level_5', title: 'Codeur', description: 'Atteindre le niveau 5', icon: '⭐', xpBonus: 15 },
  { id: 'level_10', title: 'Développeur', description: 'Atteindre le niveau 10', icon: '🌟', xpBonus: 15 },
  { id: 'web_complete', title: 'Web Warrior', description: 'Terminer le parcours Web', icon: '🏆', xpBonus: 15 },
]
