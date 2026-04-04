import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'ai_academy_progress'

const defaultProgress = {
  completedLessons: [],
  completedQuizzes: [],
  quizScores: {},
  startedModules: [],
  totalXP: 0,
  streak: 0,
  lastVisit: null,
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const completeLesson = useCallback((lessonId, moduleSlug) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const xpGained = 50
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        startedModules: prev.startedModules.includes(moduleSlug)
          ? prev.startedModules
          : [...prev.startedModules, moduleSlug],
        totalXP: prev.totalXP + xpGained,
      }
    })
  }, [])

  const saveQuizScore = useCallback((moduleSlug, score, total) => {
    setProgress(prev => {
      const xpGained = Math.round((score / total) * 100)
      const alreadyCompleted = prev.completedQuizzes.includes(moduleSlug)
      return {
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
    })
  }, [])

  const isLessonCompleted = useCallback(
    lessonId => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  )

  const isModuleCompleted = useCallback(
    (moduleSlug, lessons) => {
      return lessons.every(l => progress.completedLessons.includes(l.id))
    },
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
    resetProgress,
  }
}
