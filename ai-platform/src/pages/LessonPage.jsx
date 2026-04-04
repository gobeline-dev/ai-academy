import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LessonContent from '../components/LessonContent.jsx'
import ConceptDiagram from '../components/ConceptDiagram.jsx'

function getReadingTime(sections) {
  if (!sections || sections.length === 0) return 1
  const words = sections.flatMap(s => [
    s.title || '', s.body || '', ...(s.items || []),
  ]).join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function LessonPage({ modules, progressHook }) {
  const { slug, lessonId } = useParams()
  const navigate = useNavigate()
  const { completeLesson, isLessonCompleted, getModuleProgress } = progressHook

  const module = modules.find(m => m.slug === slug)
  const lesson = module?.lessons.find(l => l.id === lessonId)

  const [completed, setCompleted] = useState(false)
  const [showCompletedBanner, setShowCompletedBanner] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    if (lesson) setCompleted(isLessonCompleted(lesson.id))
  }, [lesson, isLessonCompleted])

  // Reading progress based on scroll
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      if (total > 0) setReadingProgress(Math.min(100, Math.round((el.scrollTop / total) * 100)))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Focus mode — toggle body class
  useEffect(() => {
    document.body.classList.toggle('focus-mode', focusMode)
    return () => document.body.classList.remove('focus-mode')
  }, [focusMode])

  if (!module || !lesson) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Leçon introuvable</h2>
        <Link to="/modules" className="btn btn-primary" style={{ marginTop: 16 }}>Retour</Link>
      </div>
    )
  }

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null
  const progressData = getModuleProgress(module.slug, module.lessons)
  const readingMinutes = getReadingTime(lesson.sections)

  const handleComplete = () => {
    completeLesson(lesson.id, module.slug)
    setCompleted(true)
    setShowCompletedBanner(true)
    setTimeout(() => setShowCompletedBanner(false), 3000)
  }

  const handleNext = () => {
    if (!completed) handleComplete()
    if (nextLesson) {
      navigate(`/module/${module.slug}/lesson/${nextLesson.id}`)
    } else {
      navigate(`/module/${module.slug}/quiz`)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Reading progress bar */}
      <div style={{
        position: 'fixed',
        top: focusMode ? 0 : 64, left: 0,
        height: 2,
        width: `${readingProgress}%`,
        background: `linear-gradient(90deg, ${module.color}, ${module.colorLight})`,
        zIndex: 99,
        transition: 'width 0.1s linear, top 0.3s ease',
      }} />

      {/* Sidebar - lesson list */}
      <aside style={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        padding: '24px 0',
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="lesson-sidebar"
      >
        {/* Module info */}
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link
            to={`/module/${module.slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12, color: 'var(--text-muted)', fontSize: '0.78rem' }}
          >
            ← Retour au module
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }}>{module.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                MODULE {String(module.id).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {module.title}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="progress-bar" style={{ height: 3 }}>
              <div className="progress-bar-fill" style={{ width: `${progressData.percent}%`, background: `linear-gradient(90deg, ${module.color}, ${module.colorLight})` }} />
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {progressData.completed}/{progressData.total} complétées
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div style={{ flex: 1, padding: '12px 12px' }}>
          {module.lessons.map((l, i) => {
            const isActive = l.id === lessonId
            const isDone = isLessonCompleted(l.id)
            return (
              <Link key={l.id} to={`/module/${module.slug}/lesson/${l.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: isActive ? `${module.color}18` : 'transparent',
                  border: `1px solid ${isActive ? `${module.color}35` : 'transparent'}`,
                  transition: 'all 0.15s ease',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: isDone ? 'rgba(16,185,129,0.2)' : isActive ? `${module.color}25` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isDone ? 'rgba(16,185,129,0.35)' : isActive ? `${module.color}45` : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 800,
                    color: isDone ? '#34d399' : isActive ? module.colorLight : 'var(--text-muted)',
                    flexShrink: 0,
                    fontFamily: isDone ? 'inherit' : 'var(--font-mono)',
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-muted)' : 'var(--text-secondary)',
                    lineHeight: 1.3,
                  }}>
                    {l.title}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quiz button */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link to={`/module/${module.slug}/quiz`} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
            🎯 Passer le quiz du module
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className={focusMode ? undefined : 'lesson-main'} style={focusMode ? { flex: 1, padding: '40px 80px', transition: 'all 0.3s ease' } : undefined}>
        {/* Completed banner */}
        {showCompletedBanner && (
          <div style={{
            position: 'fixed', top: 80, right: 24, zIndex: 200,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: 'var(--radius-md)', padding: '12px 18px',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'slideInRight 0.3s ease', backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🎉</span>
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>Leçon complétée ! +50 XP</span>
          </div>
        )}

        {/* Lesson header */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.4s ease' }}>
          {/* Breadcrumb + focus toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
              <span>›</span>
              <Link to={`/module/${module.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{module.title}</Link>
              <span>›</span>
              <span style={{ color: 'var(--text-secondary)' }}>{lesson.title}</span>
            </div>
            <button
              onClick={() => setFocusMode(f => !f)}
              title={focusMode ? 'Quitter le mode focus' : 'Mode focus'}
              style={{
                padding: '5px 12px', borderRadius: 'var(--radius-md)',
                background: focusMode ? `${module.color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${focusMode ? `${module.color}40` : 'var(--border-subtle)'}`,
                color: focusMode ? module.colorLight : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              {focusMode ? '⊠ Quitter focus' : '⊡ Focus'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>{lesson.icon}</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem', fontWeight: 600,
                background: `${module.color}15`, color: module.colorLight, border: `1px solid ${module.color}30`,
                fontFamily: 'var(--font-mono)',
              }}>
                {lessonIndex + 1}/{module.lessons.length}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem', color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                ⏱ {lesson.duration}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem', color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                📖 ~{readingMinutes} min de lecture
              </span>
              {completed && (
                <span style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem', fontWeight: 600,
                  background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  ✓ Complété
                </span>
              )}
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', lineHeight: 1.25 }}>{lesson.title}</h1>
          <div style={{ height: 1, background: 'var(--border-subtle)', marginTop: 20 }} />
        </div>

        {/* Content */}
        <div style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <ConceptDiagram lessonId={lesson.id} />
          <LessonContent sections={lesson.sections} />
        </div>

        {/* Footer actions */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 32, marginTop: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
          animation: 'fadeInUp 0.4s ease 0.2s both',
        }}>
          <div>
            {!completed && (
              <button onClick={handleComplete} className="btn btn-secondary" style={{ marginRight: 8 }}>
                ✓ Marquer comme lu
              </button>
            )}
            {prevLesson && (
              <Link to={`/module/${module.slug}/lesson/${prevLesson.id}`} className="btn btn-ghost">
                ← Précédent
              </Link>
            )}
          </div>
          <button onClick={handleNext} className="btn btn-primary">
            {nextLesson ? `Leçon suivante : ${nextLesson.title} →` : '🎯 Passer le quiz →'}
          </button>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="lesson-mobile-nav">
        <div style={{ flex: 1 }}>
          {prevLesson ? (
            <Link
              to={`/module/${module.slug}/lesson/${prevLesson.id}`}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              ← Préc.
            </Link>
          ) : (
            <Link
              to={`/module/${module.slug}`}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              ← Module
            </Link>
          )}
        </div>
        <div style={{ flex: 2 }}>
          <button
            onClick={handleNext}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {nextLesson ? `Suivant →` : '🎯 Quiz'}
          </button>
        </div>
      </div>

      <style>{`
        .lesson-sidebar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99,102,241,0.3) transparent;
        }
        @media (max-width: 768px) {
          .lesson-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
