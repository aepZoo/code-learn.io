import type { Track } from '../../types'

export const tracks: Track[] = [
  {
    id: 'web',
    title: 'Développement Web',
    description: 'HTML, CSS et JavaScript — le trio indispensable du web',
    icon: '🌐',
    locked: false,
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Le langage le plus populaire pour débuter',
    icon: '🐍',
    locked: true,
    comingSoon: true,
  },
  {
    id: 'rust',
    title: 'Rust',
    description: 'Performance et sécurité pour les projets avancés',
    icon: '🦀',
    locked: true,
    comingSoon: true,
  },
]
