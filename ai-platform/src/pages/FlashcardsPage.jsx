import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { GLOSSARY } from '../components/Tooltip.jsx'

function getModuleTerms(module) {
  const text = module.lessons.flatMap(l =>
    (l.sections || []).flatMap(s => [s.title || '', s.body || '', ...(s.items || [])])
  ).join(' ').toLowerCase()

  const seen = new Set()
  return Object.entries(GLOSSARY).filter(([key, val]) => {
    if (!text.includes(key.toLowerCase())) return false
    if (seen.has(val.fr)) return false
    seen.add(val.fr)
    return true
  })
}

export default function FlashcardsPage({ modules }) {
  const { slug } = useParams()
  const module = modules.find(m => m.slug === slug)

  if (!module) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Module introuvable</h2>
        <Link to="/modules" className="btn btn-primary" style={{ marginTop: 16 }}>Retour</Link>
      </div>
    )
  }

  const terms = getModuleTerms(module)

  const [flipped, setFlipped] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState('grid')

  const toggleFlip = key => setFlipped(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="section-padding">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.82rem' }}>
          <Link to={`/module/${module.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {module.title}
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <span style={{ color: 'var(--text-primary)' }}>Flashcards</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32, animation: 'fadeInUp 0.4s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: `${module.color}15`, border: `1px solid ${module.color}30`,
            fontSize: '0.78rem', fontWeight: 600, color: module.colorLight,
            marginBottom: 16, fontFamily: 'var(--font-mono)',
          }}>
            🃏 FLASHCARDS
          </div>
          <h1 style={{ marginBottom: 8 }}>
            Révision — <span className="gradient-text">{module.title}</span>
          </h1>
          {terms.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucun terme du glossaire détecté dans ce module.</p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              {terms.length} terme{terms.length > 1 ? 's' : ''} à réviser.
              Cliquez sur une carte pour la retourner.
            </p>
          )}
        </div>

        {terms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <Link to={`/module/${module.slug}`} className="btn btn-secondary" style={{ marginTop: 8 }}>
              Retour au module
            </Link>
          </div>
        ) : (
          <>
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              {[['grid', '⊞ Grille'], ['study', '▶ Étude']].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setCurrentIndex(0) }} style={{
                  padding: '7px 16px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem', fontWeight: 600,
                  background: mode === m ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: `1px solid ${mode === m ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: mode === m ? 'var(--color-primary-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {mode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}>
                {terms.map(([key, entry], i) => (
                  <FlashCard
                    key={key}
                    term={entry.fr}
                    definition={entry.def}
                    isFlipped={!!flipped[key]}
                    onFlip={() => toggleFlip(key)}
                    index={i}
                    color={module.color}
                    colorLight={module.colorLight}
                  />
                ))}
              </div>
            ) : (
              <StudyMode
                terms={terms}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                module={module}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FlashCard({ term, definition, isFlipped, onFlip, index, color, colorLight }) {
  return (
    <div
      onClick={onFlip}
      style={{ height: 160, perspective: '1000px', cursor: 'pointer', animation: `fadeInUp 0.4s ease ${index * 0.04}s both` }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'var(--bg-card)',
          border: `1px solid ${color}30`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', gap: 6,
        }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Terme</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: colorLight, textAlign: 'center', lineHeight: 1.3 }}>{term}</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>↻ retourner</div>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: `${color}0f`,
          border: `1px solid ${color}40`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55, textAlign: 'center' }}>
            {definition}
          </div>
        </div>
      </div>
    </div>
  )
}

function StudyMode({ terms, currentIndex, setCurrentIndex, module }) {
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())

  const total = terms.length
  const [key, entry] = terms[currentIndex]

  const goTo = (nextIdx, wasKnown = null) => {
    if (wasKnown === true) setKnown(prev => new Set([...prev, terms[currentIndex][0]]))
    setFlipped(false)
    setTimeout(() => setCurrentIndex((nextIdx + total) % total), 60)
  }

  const pct = Math.round((known.size / total) * 100)

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{currentIndex + 1} / {total}</span>
        <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>✓ {known.size} connus ({pct}%)</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 28, height: 4 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
      </div>

      {/* Card */}
      <div onClick={() => setFlipped(f => !f)} style={{ height: 240, perspective: '1000px', cursor: 'pointer', marginBottom: 20 }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-card)',
            border: `2px solid ${module.color}40`,
            borderRadius: 'var(--radius-xl)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '32px',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Définir ce terme</div>
            <div style={{ fontSize: '1.55rem', fontWeight: 800, color: module.colorLight, textAlign: 'center' }}>{entry.fr}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cliquer pour voir la définition</div>
          </div>
          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `${module.color}0d`,
            border: `2px solid ${module.color}50`,
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '28px',
          }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.65, textAlign: 'center' }}>
              {entry.def}
            </div>
          </div>
        </div>
      </div>

      {/* Actions (after flip) */}
      {flipped ? (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', animation: 'fadeIn 0.2s ease', marginBottom: 16 }}>
          <button onClick={() => goTo(currentIndex + 1, false)} style={{
            padding: '10px 24px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
          }}>✗ À revoir</button>
          <button onClick={() => goTo(currentIndex + 1, true)} style={{
            padding: '10px 24px', borderRadius: 'var(--radius-md)',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
          }}>✓ Je sais !</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={() => goTo(currentIndex - 1)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem',
          }}>← Précédent</button>
          <button onClick={() => goTo(currentIndex + 1)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem',
          }}>Suivant →</button>
        </div>
      )}
    </div>
  )
}
