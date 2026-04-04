// ── Achievement definitions ───────────────────────────────────────────────────
// check(progress, modules) → boolean

export const ACHIEVEMENTS = [
  // ── BRONZE ─────────────────────────────────────────────────────────────────
  {
    id: 'first_lesson',
    title: 'Premier Pas',
    description: 'Compléter ta première leçon',
    hint: 'Lis et valide n\'importe quelle leçon',
    icon: '🎮',
    rarity: 'bronze',
    check: (p) => p.completedLessons.length >= 1,
  },
  {
    id: 'first_module_started',
    title: 'En Route',
    description: 'Commencer ton premier module',
    hint: 'Accède à n\'importe quel module',
    icon: '🚀',
    rarity: 'bronze',
    check: (p) => p.startedModules.length >= 1,
  },
  {
    id: 'first_quiz',
    title: 'Baptême du Feu',
    description: 'Compléter ton premier quiz',
    hint: 'Réponds à toutes les questions d\'un quiz',
    icon: '🎯',
    rarity: 'bronze',
    check: (p) => p.completedQuizzes.length >= 1,
  },
  {
    id: 'lessons_5',
    title: 'Lecteur Assidu',
    description: 'Compléter 5 leçons',
    hint: '5 leçons validées au total',
    icon: '📚',
    rarity: 'bronze',
    check: (p) => p.completedLessons.length >= 5,
  },

  // ── ARGENT ──────────────────────────────────────────────────────────────────
  {
    id: 'xp_500',
    title: 'Accumulateur',
    description: 'Gagner 500 XP',
    hint: 'Continue les leçons et les quiz',
    icon: '⚡',
    rarity: 'silver',
    check: (p) => p.totalXP >= 500,
  },
  {
    id: 'lessons_10',
    title: 'En Feu',
    description: 'Compléter 10 leçons',
    hint: '10 leçons validées au total',
    icon: '🔥',
    rarity: 'silver',
    check: (p) => p.completedLessons.length >= 10,
  },
  {
    id: 'perfect_quiz',
    title: 'Sans Faute',
    description: 'Obtenir 100% à un quiz',
    hint: 'Score parfait sur n\'importe quel quiz',
    icon: '💯',
    rarity: 'silver',
    check: (p) => Object.values(p.quizScores).some(s => s === 100),
  },
  {
    id: 'module_fondations',
    title: 'Fondations Solides',
    description: 'Compléter le module Fondations',
    hint: 'Toutes les leçons du module 1 validées',
    icon: '🧱',
    rarity: 'silver',
    check: (p, modules) => {
      const m = modules?.find(m => m.slug === 'fondations')
      return m ? m.lessons.every(l => p.completedLessons.includes(l.id)) : false
    },
  },
  {
    id: 'quizzes_3',
    title: 'Testeur Confirmé',
    description: 'Compléter 3 quiz',
    hint: '3 quiz terminés, peu importe le score',
    icon: '🏅',
    rarity: 'silver',
    check: (p) => p.completedQuizzes.length >= 3,
  },

  // ── OR ──────────────────────────────────────────────────────────────────────
  {
    id: 'lessons_20',
    title: 'Chercheur',
    description: 'Compléter 20 leçons',
    hint: '20 leçons validées au total',
    icon: '🔬',
    rarity: 'gold',
    check: (p) => p.completedLessons.length >= 20,
  },
  {
    id: 'quizzes_5',
    title: 'Quiz Master',
    description: 'Compléter 5 quiz',
    hint: '5 quiz terminés',
    icon: '🎖️',
    rarity: 'gold',
    check: (p) => p.completedQuizzes.length >= 5,
  },
  {
    id: 'xp_1000',
    title: 'Chasseur de XP',
    description: 'Gagner 1000 XP',
    hint: 'Cumule 1000 XP au total',
    icon: '💥',
    rarity: 'gold',
    check: (p) => p.totalXP >= 1000,
  },
  {
    id: 'module_agents',
    title: 'Maître des Agents',
    description: 'Compléter le module Agents & IA Agentique',
    hint: 'Toutes les leçons du module 9 validées',
    icon: '🤖',
    rarity: 'gold',
    check: (p, modules) => {
      const m = modules?.find(m => m.slug === 'agents')
      return m ? m.lessons.every(l => p.completedLessons.includes(l.id)) : false
    },
  },
  {
    id: 'half_modules',
    title: 'Mi-Parcours',
    description: 'Compléter 5 modules en entier',
    hint: 'Toutes les leçons de 5 modules différents',
    icon: '🌗',
    rarity: 'gold',
    check: (p, modules) => {
      if (!modules) return false
      return modules.filter(m => m.lessons.every(l => p.completedLessons.includes(l.id))).length >= 5
    },
  },

  // ── PLATINE ─────────────────────────────────────────────────────────────────
  {
    id: 'all_modules',
    title: 'IA Master',
    description: 'Compléter tous les modules et toutes les leçons',
    hint: 'L\'intégralité du parcours validé',
    icon: '🏆',
    rarity: 'platinum',
    check: (p, modules) =>
      modules ? modules.every(m => m.lessons.every(l => p.completedLessons.includes(l.id))) : false,
  },
  {
    id: 'perfect_all_quizzes',
    title: 'Perfectionniste',
    description: 'Obtenir 100% à tous les quiz (min. 5)',
    hint: 'Score parfait sur au moins 5 quiz',
    icon: '💎',
    rarity: 'platinum',
    check: (p) => {
      const scores = Object.values(p.quizScores)
      return scores.length >= 5 && scores.every(s => s === 100)
    },
  },
  {
    id: 'xp_2000',
    title: 'Légende',
    description: 'Gagner 2000 XP',
    hint: 'Cumule 2000 XP au total',
    icon: '🌟',
    rarity: 'platinum',
    check: (p) => p.totalXP >= 2000,
  },
]

// ── Rarity visual config ────────────────────────────────────────────────────
export const RARITY_CONFIG = {
  bronze: {
    label: 'Bronze',
    order: 1,
    color: '#cd7f32',
    colorLight: '#e8a85f',
    bg: 'rgba(205, 127, 50, 0.12)',
    border: 'rgba(205, 127, 50, 0.35)',
    glow: '0 0 20px rgba(205, 127, 50, 0.3)',
    gradient: 'linear-gradient(135deg, #7c4a1a 0%, #cd7f32 50%, #e8a85f 100%)',
    shimmer: 'rgba(232, 168, 95, 0.4)',
  },
  silver: {
    label: 'Argent',
    order: 2,
    color: '#94a3b8',
    colorLight: '#cbd5e1',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.3)',
    glow: '0 0 20px rgba(148, 163, 184, 0.25)',
    gradient: 'linear-gradient(135deg, #334155 0%, #94a3b8 50%, #e2e8f0 100%)',
    shimmer: 'rgba(203, 213, 225, 0.4)',
  },
  gold: {
    label: 'Or',
    order: 3,
    color: '#fbbf24',
    colorLight: '#fde68a',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.35)',
    glow: '0 0 25px rgba(251, 191, 36, 0.35)',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 40%, #fbbf24 70%, #fde68a 100%)',
    shimmer: 'rgba(253, 230, 138, 0.5)',
  },
  platinum: {
    label: 'Platine',
    order: 4,
    color: '#7dd3fc',
    colorLight: '#e0f2fe',
    bg: 'rgba(125, 211, 252, 0.08)',
    border: 'rgba(125, 211, 252, 0.35)',
    glow: '0 0 30px rgba(125, 211, 252, 0.4)',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 40%, #38bdf8 70%, #e0f2fe 100%)',
    shimmer: 'rgba(186, 230, 253, 0.5)',
  },
}
