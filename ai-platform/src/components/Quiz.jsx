import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Quiz({ questions, moduleSlug, moduleName, onComplete, savedScore }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const question = questions[currentQ]
  const percent = Math.round((score / questions.length) * 100)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    setShowExplanation(false)
    const isCorrect = idx === question.correct
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { questionId: question.id, selected: idx, correct: question.correct }])
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setAnswered(false)
      setShowExplanation(false)
    } else {
      setFinished(true)
      onComplete(score + (selected === question.correct ? 1 : 0) - (selected === question.correct ? 1 : 0), questions.length)
      // recalculate final score
      const finalScore = answers.filter(a => a.selected === a.correct).length + (selected === question.correct ? 1 : 0)
      onComplete(finalScore, questions.length)
    }
  }

  if (finished) {
    const finalScore = answers.filter(a => a.selected === a.correct).length
    const finalPercent = Math.round((finalScore / questions.length) * 100)
    const stars = finalPercent >= 80 ? 3 : finalPercent >= 60 ? 2 : finalPercent >= 40 ? 1 : 0

    return (
      <div style={{ animation: 'fadeInUp 0.5s ease' }}>
        {/* Results header */}
        <div style={{
          background: finalPercent >= 60
            ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.07))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.07))',
          border: `1px solid ${finalPercent >= 60 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: 40,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>
            {stars === 3 ? '🏆' : stars === 2 ? '🎯' : stars === 1 ? '📚' : '💪'}
          </div>
          <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <h2 style={{ marginBottom: 8 }}>
            {finalPercent >= 80 ? 'Excellent !' : finalPercent >= 60 ? 'Bien joué !' : finalPercent >= 40 ? 'Pas mal !' : 'Continue à apprendre !'}
          </h2>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            {finalPercent}%
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            {finalScore} bonne{finalScore > 1 ? 's' : ''} réponse{finalScore > 1 ? 's' : ''} sur {questions.length}
          </p>
        </div>

        {/* Question review */}
        <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Révision des questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {questions.map((q, i) => {
            const ans = answers[i]
            const wasCorrect = ans && ans.selected === ans.correct
            return (
              <div
                key={q.id}
                style={{
                  background: wasCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${wasCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{wasCorrect ? '✅' : '❌'}</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginBottom: 4 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Q{i+1}.</strong> {q.question}
                    </p>
                    {!wasCorrect && ans && (
                      <p style={{ fontSize: '0.8rem', color: '#34d399', margin: 0 }}>
                        ✓ Réponse correcte : {q.options[q.correct]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setCurrentQ(0)
              setSelected(null)
              setAnswered(false)
              setScore(0)
              setAnswers([])
              setFinished(false)
            }}
            className="btn btn-secondary"
          >
            🔄 Refaire le quiz
          </button>
          <Link to={`/module/${moduleSlug}`} className="btn btn-ghost">
            ← Retour au module
          </Link>
          <Link to="/modules" className="btn btn-primary">
            Modules suivants →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Quiz progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Question {currentQ + 1} sur {questions.length}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
            {score} ✓
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQ) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        key={currentQ}
        style={{ animation: 'fadeInUp 0.35s ease' }}
      >
        <div style={{
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: 20,
        }}>
          <div style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.15)',
            color: 'var(--color-primary-light)',
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: 12,
            fontFamily: 'var(--font-mono)',
          }}>
            Q{String(currentQ + 1).padStart(2, '0')}
          </div>
          <h3 style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {question.options.map((option, idx) => {
            let bg = 'rgba(255,255,255,0.03)'
            let border = 'rgba(255,255,255,0.08)'
            let color = 'var(--text-secondary)'
            let icon = null

            if (answered) {
              if (idx === question.correct) {
                bg = 'rgba(16,185,129,0.1)'
                border = 'rgba(16,185,129,0.35)'
                color = '#34d399'
                icon = '✓'
              } else if (idx === selected && idx !== question.correct) {
                bg = 'rgba(239,68,68,0.1)'
                border = 'rgba(239,68,68,0.35)'
                color = '#f87171'
                icon = '✗'
              }
            } else if (selected === idx) {
              bg = 'rgba(99,102,241,0.12)'
              border = 'rgba(99,102,241,0.4)'
              color = 'var(--text-primary)'
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  transform: answered ? 'none' : 'translateX(0)',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => {
                  if (!answered) {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={e => {
                  if (!answered) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  borderRadius: 8,
                  background: answered && idx === question.correct
                    ? 'rgba(16,185,129,0.2)'
                    : answered && idx === selected
                    ? 'rgba(239,68,68,0.2)'
                    : 'rgba(99,102,241,0.1)',
                  border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: answered ? color : 'var(--color-primary-light)',
                  flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {icon || String.fromCharCode(65 + idx)}
                </div>
                <span style={{ fontSize: '0.9rem', color, lineHeight: 1.5 }}>{option}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: showExplanation ? 12 : 0,
                fontFamily: 'var(--font-sans)',
                padding: 0,
              }}
            >
              {showExplanation ? '▼' : '▶'} Voir l'explication
            </button>
            {showExplanation && (
              <div style={{
                background: 'rgba(34,211,238,0.06)',
                border: '1px solid rgba(34,211,238,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                marginBottom: 16,
                animation: 'fadeInUp 0.25s ease',
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{ animation: 'fadeInUp 0.3s ease 0.1s both', marginTop: 8 }}
          >
            {currentQ < questions.length - 1 ? 'Question suivante →' : 'Voir les résultats 🏆'}
          </button>
        )}
      </div>
    </div>
  )
}
