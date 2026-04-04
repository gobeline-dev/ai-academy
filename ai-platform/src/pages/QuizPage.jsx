import { useParams, Link } from 'react-router-dom'
import Quiz from '../components/Quiz.jsx'
import quizzesData from '../data/quizzes.json'

export default function QuizPage({ modules, progressHook }) {
  const { slug } = useParams()
  const module = modules.find(m => m.slug === slug)
  const { saveQuizScore, progress } = progressHook

  if (!module) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Module introuvable</h2>
        <Link to="/modules" className="btn btn-primary" style={{ marginTop: 16 }}>Retour</Link>
      </div>
    )
  }

  const questions = quizzesData[module.slug] || []
  const savedScore = progress.quizScores[module.slug]

  if (questions.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
        <h2>Quiz en cours de préparation</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
          Le quiz pour ce module arrive bientôt !
        </p>
        <Link to={`/module/${module.slug}`} className="btn btn-secondary" style={{ marginTop: 20 }}>
          ← Retour au module
        </Link>
      </div>
    )
  }

  const handleComplete = (score, total) => {
    saveQuizScore(module.slug, score, total)
  }

  return (
    <div className="section-padding">
      <div style={{
        position: 'fixed', inset: 0,
        background: `radial-gradient(ellipse 50% 40% at 50% 0%, ${module.color}0a 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ maxWidth: 700, position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.4s ease' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link to={`/module/${module.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{module.title}</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>Quiz</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: 16,
              background: `${module.color}20`,
              border: `2px solid ${module.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'var(--font-mono)' }}>
                QUIZ — {module.title.toUpperCase()}
              </div>
              <h1 style={{ fontSize: '1.6rem' }}>Testez vos connaissances</h1>
            </div>
          </div>

          {/* Quiz info */}
          <div style={{
            display: 'flex',
            gap: 16,
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
          }}>
            <InfoItem icon="❓" label={`${questions.length} questions`} />
            <InfoItem icon="💡" label="Réponses expliquées" />
            <InfoItem icon="🔄" label="Illimité, refaisable" />
            {savedScore !== undefined && (
              <InfoItem icon="🏆" label={`Meilleur score : ${savedScore}%`} color="#fbbf24" />
            )}
          </div>
        </div>

        {/* Quiz component */}
        <div className="quiz-card-inner" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          animation: 'fadeInUp 0.4s ease 0.1s both',
        }}>
          <Quiz
            questions={questions}
            moduleSlug={module.slug}
            moduleName={module.title}
            onComplete={handleComplete}
            savedScore={savedScore}
          />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: color || 'var(--text-muted)' }}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
