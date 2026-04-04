import { useState, useEffect, useCallback, useRef } from 'react'
import { ACHIEVEMENTS } from '../data/achievements.js'

const STORAGE_KEY = 'ai_academy_progress'

const defaultProgress = {
  completedLessons: [],
  completedQuizzes: [],
  quizScores: {},
  startedModules: [],
  totalXP: 0,
  streak: 0,
  lastVisit: null,
  unlockedAchievements: [],
}

function computeNewAchievements(newProgress, modules) {
  const currentUnlocked = newProgress.unlockedAchievements || []
  const newIds = ACHIEVEMENTS
    .filter(a => !currentUnlocked.includes(a.id) && a.check(newProgress, modules))
    .map(a => a.id)
  if (newIds.length === 0) return currentUnlocked
  return [...currentUnlocked, ...newIds]
}

export function useProgress(modules) {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  // Queue of newly unlocked achievement objects for toasts
  const [newlyUnlocked, setNewlyUnlocked] = useState([])
  const modulesRef = useRef(modules)

  useEffect(() => {
    modulesRef.current = modules
  }, [modules])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  // Detect achievement unlocks by watching the unlockedAchievements array
  const prevUnlockedRef = useRef(new Set(progress.unlockedAchievements || []))
  useEffect(() => {
    const current = new Set(progress.unlockedAchievements || [])
    const freshIds = [...current].filter(id => !prevUnlockedRef.current.has(id))
    if (freshIds.length > 0) {
      const fresh = ACHIEVEMENTS.filter(a => freshIds.includes(a.id))
      setNewlyUnlocked(prev => [...prev, ...fresh])
    }
    prevUnlockedRef.current = current
  }, [progress.unlockedAchievements])

  const completeLesson = useCallback((lessonId, moduleSlug) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const next = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        startedModules: prev.startedModules.includes(moduleSlug)
          ? prev.startedModules
          : [...prev.startedModules, moduleSlug],
        totalXP: prev.totalXP + 50,
      }
      next.unlockedAchievements = computeNewAchievements(next, modulesRef.current)
      return next
    })
  }, [])

  const saveQuizScore = useCallback((moduleSlug, score, total) => {
    setProgress(prev => {
      const xpGained = Math.round((score / total) * 100)
      const alreadyCompleted = prev.completedQuizzes.includes(moduleSlug)
      const next = {
        ...prev,
        completedQuizzes: alreadyCompleted
          ? prev.completedQuizzes
          : [...prev.completedQuizzes, moduleSlug],
        quizScores: {
          ...prev.quizScores,
          [moduleSlug]: Math.max(prev.quizScores[moduleSlug] || 0, Math.round((score / total) * 100)),
        },
        totalXP: alreadyCompleted ? prev.totalXP : prev.totalXP + xpGained,
      }
      next.unlockedAchievements = computeNewAchievements(next, modulesRef.current)
      return next
    })
  }, [])

  const isLessonCompleted = useCallback(
    lessonId => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  )

  const isModuleCompleted = useCallback(
    (moduleSlug, lessons) => lessons.every(l => progress.completedLessons.includes(l.id)),
    [progress.completedLessons]
  )

  const getModuleProgress = useCallback(
    (moduleSlug, lessons) => {
      const completed = lessons.filter(l => progress.completedLessons.includes(l.id)).length
      return { completed, total: lessons.length, percent: Math.round((completed / lessons.length) * 100) }
    },
    [progress.completedLessons]
  )

  const getOverallProgress = useCallback(
    modules => {
      const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
      const completedCount = progress.completedLessons.length
      return {
        completed: completedCount,
        total: totalLessons,
        percent: Math.round((completedCount / totalLessons) * 100),
      }
    },
    [progress.completedLessons]
  )

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), [])

  const shiftNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(prev => prev.slice(1))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
  }, [])

  return {
    progress,
    completeLesson,
    saveQuizScore,
    isLessonCompleted,
    isModuleCompleted,
    getModuleProgress,
    getOverallProgress,
    newlyUnlocked,
    clearNewlyUnlocked,
    shiftNewlyUnlocked,
    resetProgress,
  }
}
