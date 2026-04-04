import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'

function getReadingTime(sections) {
  if (!sections || sections.length === 0) return 1
  const words = sections.flatMap(s => [
    s.title || '', s.body || '', ...(s.items || []),
  ]).join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function ModulePage({ modules, progressHook }) {
  const { slug } = useParams()
  const module = modules.find(m => m.slug === slug)
  const { getModuleProgress, isLessonCompleted, progress } = progressHook
  const [hoveredLesson, setHoveredLesson] = useState(null)

  if (!module) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Module introuvable</h2>
        <Link to="/modules" className="btn btn-primary" style={{ marginTop: 16 }}>
          Retour aux modules
        </Link>
      </div>
    )
  }

  const progressData = getModuleProgress(module.slug, module.lessons)
  const quizScore = progress.quizScores[module.slug]
  const quizCompleted = progress.completedQuizzes.includes(module.slug)
  const moduleIndex = modules.findIndex(m => m.slug === slug)
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null
  const firstIncompleteLesson = module.lessons.find(l => !isLessonCompleted(l.id)) ?? module.lessons[0]

  return (
    <div className="section-padding">
      {/* Background gradient */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 70% 20%, ${module.color}0a 0%, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
          <span>›</span>
          <Link to="/modules" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Modules</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{module.title}</span>
        </nav>

        <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {/* Module header */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              marginBottom: 24,
              animation: 'fadeInUp 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0, right: 0,
                width: 250, height: 250,
                background: `radial-gradient(ellipse at top right, ${module.color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{
                  width: 72, height: 72,
                  borderRadius: 18,
                  background: `${module.color}20`,
                  border: `2px solid ${module.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                  boxShadow: `0 8px 20px ${module.color}20`,
                }}>
                  {module.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: module.colorLight,
                      background: `${module.color}15`,
                      border: `1px solid ${module.color}30`,
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 700,
                    }}>
                      MODULE {String(module.id).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}>
                      {module.level} • {module.duration}
                    </span>
                  </div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>{module.title}</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{module.subtitle}</p>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {progressData.completed}/{progressData.total} leçons complétées
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: module.colorLight }}>
                    {progressData.percent}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progressData.percent}%`,
                      background: `linear-gradient(90deg, ${module.color}, ${module.colorLight})`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons list */}
            <h2 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Leçons ({module.lessons.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {module.lessons.map((lesson, index) => {
                const completed = isLessonCompleted(lesson.id)
                const isHovered = hoveredLesson === lesson.id

                return (
                  <Link
                    key={lesson.id}
                    to={`/module/${module.slug}/lesson/${lesson.id}`}
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={() => setHoveredLesson(lesson.id)}
                    onMouseLeave={() => setHoveredLesson(null)}
                  >
                    <div style={{
                      background: isHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                      border: `1px solid ${isHovered ? `${module.color}35` : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'translateX(4px)' : 'none',
                      animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
                    }}>
                      {/* Step number */}
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: completed
                          ? 'rgba(16,185,129,0.15)'
                          : `${module.color}15`,
                        border: `1px solid ${completed ? 'rgba(16,185,129,0.3)' : `${module.color}30`}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: completed ? '0.9rem' : '0.75rem',
                        fontWeight: 800,
                        color: completed ? '#34d399' : module.colorLight,
                        fontFamily: completed ? 'inherit' : 'var(--font-mono)',
                        flexShrink: 0,
                      }}>
                        {completed ? '✓' : String(index + 1).padStart(2, '0')}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1rem' }}>{lesson.icon}</span>
                          <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: isHovered ? 'var(--text-primary)' : (completed ? 'var(--text-secondary)' : 'var(--text-primary)'),
                            margin: 0,
                            transition: 'color 0.2s',
                          }}>
                            {lesson.title}
                          </h4>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{
                          fontSize: '0.72rem', color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 6,
                        }}>
                          📖 ~{getReadingTime(lesson.sections)} min
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.04)',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}>
                          ⏱ {lesson.duration}
                        </span>
                        {completed && (
                          <span style={{
                            fontSize: '0.72rem',
                            color: '#34d399',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                          }}>
                            Complété
                          </span>
                        )}
                        <span style={{ color: isHovered ? module.colorLight : 'var(--text-muted)', fontSize: '0.8rem', transition: 'color 0.2s' }}>
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, flexWrap: 'wrap', gap: 12 }}>
              {prevModule ? (
                <Link to={`/module/${prevModule.slug}`} className="btn btn-ghost">
                  ← {prevModule.title}
                </Link>
              ) : <div />}
              {nextModule && (
                <Link to={`/module/${nextModule.slug}`} className="btn btn-secondary">
                  {nextModule.title} →
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 80 }}>
            {/* Quick start */}
            <div style={{
              background: 'var(--bg-card)',
              border: `1px solid ${module.color}30`,
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: 16,
              animation: 'fadeInUp 0.4s ease 0.1s both',
            }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--text-primary)' }}>
                🚀 Actions rapides
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link
                  to={`/module/${module.slug}/lesson/${firstIncompleteLesson?.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {progressData.completed > 0 ? '▶ Continuer' : '▶ Commencer'} le module
                </Link>
                <Link
                  to={`/module/${module.slug}/quiz`}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  🎯 {quizCompleted ? `Revoir le quiz (${quizScore}%)` : 'Passer le quiz'}
                </Link>
                <Link
                  to={`/module/${module.slug}/flashcards`}
                  className="btn btn-ghost"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  🃏 Flashcards de révision
                </Link>
              </div>
            </div>

            {/* Module info */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              animation: 'fadeInUp 0.4s ease 0.15s both',
            }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--text-primary)' }}>
                ℹ️ Infos du module
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Durée estimée', value: module.duration, icon: '⏱' },
                  { label: 'Niveau', value: module.level, icon: '📊' },
                  { label: 'Leçons', value: module.lessons.length, icon: '📖' },
                  { label: 'Quiz', value: quizCompleted ? `Passé (${quizScore}%)` : 'Non passé', icon: '🎯' },
                ].map(info => (
                  <div key={info.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {info.icon} {info.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
