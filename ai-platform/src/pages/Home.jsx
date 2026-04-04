import { Link } from 'react-router-dom'
import { useState } from 'react'
import ModuleCard from '../components/ModuleCard.jsx'
import NeuralNetHero from '../components/NeuralNetHero.jsx'

export default function Home({ modules, progressHook }) {
  const { getModuleProgress, getOverallProgress, progress } = progressHook
  const overall = getOverallProgress(modules)

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 72px' }}>
        {/* Background layers */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}
          className="hero-grid"
          >
            {/* Left: text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-light)',
                marginBottom: 24, animation: 'fadeInUp 0.5s ease',
              }}>
                <span style={{ animation: 'float 2s ease-in-out infinite' }}>🚀</span>
                De zéro à l'expertise — 10 modules progressifs
              </div>

              <h1 style={{ marginBottom: 20, animation: 'fadeInUp 0.5s ease 0.1s both', lineHeight: 1.15 }}>
                Comprenez l'IA<br />
                <span className="gradient-text">de A à Z</span>
              </h1>

              <p style={{
                fontSize: '1.05rem', color: 'var(--text-secondary)',
                maxWidth: 480, lineHeight: 1.8,
                animation: 'fadeInUp 0.5s ease 0.2s both', marginBottom: 32,
              }}>
                Des fondations mathématiques aux LLMs, RAG, Agents et MCP.
                Une plateforme interactive pensée pour les développeurs.
              </p>

              <div style={{
                display: 'flex', gap: 12, flexWrap: 'wrap',
                animation: 'fadeInUp 0.5s ease 0.3s both',
              }}>
                <Link to="/modules" className="btn btn-primary btn-lg">
                  Commencer l'aventure →
                </Link>
                <Link to="/module/fondations" className="btn btn-ghost btn-lg">
                  Module 1 : Les Fondations
                </Link>
              </div>

              {/* Quick stats inline */}
              <div style={{
                display: 'flex', gap: 24, marginTop: 36, flexWrap: 'wrap',
                animation: 'fadeInUp 0.5s ease 0.4s both',
              }}>
                {[
                  { value: '10', label: 'Modules' },
                  { value: '30+', label: 'Leçons' },
                  { value: '17', label: 'Trophées' },
                  { value: '80+', label: 'Quiz' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{
                      fontSize: '1.6rem', fontWeight: 900, lineHeight: 1,
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: neural net animation */}
            <div style={{
              position: 'relative',
              animation: 'fadeIn 0.8s ease 0.3s both',
              display: 'flex',
              justifyContent: 'center',
            }}>
              {/* Glow behind */}
              <div style={{
                position: 'absolute', inset: -20,
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                background: 'rgba(10,14,30,0.7)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 20,
                padding: '20px 16px 12px',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: 480,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 10, paddingLeft: 4,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ marginLeft: 8, fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontFamily: 'monospace' }}>
                    neural_network.py
                  </span>
                </div>
                <NeuralNetHero />
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.7rem', color: 'rgba(148,163,184,0.4)', fontFamily: 'monospace' }}>
                  Deep Neural Network — 5 couches — signaux en temps réel
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-grid > div:last-child { display: none; }
          }
        `}</style>
      </section>

      {/* ── PROGRESS BANNER ───────────────────────────────────────────── */}
      {overall.completed > 0 && (
        <section style={{ padding: '0 0 32px' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 20, flexWrap: 'wrap',
              animation: 'fadeInUp 0.5s ease',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Votre progression</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary-light)' }}>
                    {overall.percent}%
                  </span>
                  <div>
                    <div style={{ width: 200, maxWidth: '100%' }}>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${overall.percent}%` }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                      {overall.completed}/{overall.total} leçons • {progress.totalXP} XP
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/modules" className="btn btn-secondary">Continuer l'apprentissage →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── VISUAL ROADMAP ────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ marginBottom: 12 }}>Parcours d'apprentissage</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              10 modules ordonnés du plus accessible au plus avancé. Chaque module s'appuie sur le précédent.
            </p>
          </div>

          {/* Timeline roadmap */}
          <div style={{ position: 'relative', marginBottom: 60 }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: 28,
              left: '5%', right: '5%',
              height: 2,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
              backgroundSize: '200% 100%',
              opacity: 0.25,
              borderRadius: 2,
            }} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8,
              position: 'relative',
            }}
            className="roadmap-grid"
            >
              {modules.map((module, index) => (
                <RoadmapStop
                  key={module.id}
                  module={module}
                  index={index}
                  progressData={getModuleProgress(module.slug, module.lessons)}
                  row={Math.floor(index / 5)}
                />
              ))}
            </div>
          </div>

          {/* Full module cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                progressData={getModuleProgress(module.slug, module.lessons)}
                index={index}
              />
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .roadmap-grid { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section style={{
        padding: '80px 0',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ marginBottom: 12 }}>Une plateforme faite pour les développeurs</h2>
            <p style={{ color: 'var(--text-muted)' }}>Du contenu actionnable, pas de la théorie abstraite</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {[
              { icon: '💻', title: 'Code production-ready', desc: 'Chaque concept illustré par du code Python réel, avec PyTorch, HuggingFace, LangChain...' },
              { icon: '🗺️', title: 'Diagrammes interactifs', desc: 'SVG illustrés pour chaque architecture : réseau de neurones, attention, RAG, boucle agent.' },
              { icon: '🏆', title: 'Système de trophées', desc: '17 achievements à débloquer (Bronze → Platine). Chaque progression est récompensée.' },
              { icon: '🌊', title: 'Du fondamental au SOTA', desc: 'Des bases mathématiques jusqu\'aux MCP, RAG et agents IA — l\'état de l\'art 2025.' },
            ].map(feature => (
              <div
                key={feature.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 12,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                  marginBottom: 14,
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ marginBottom: 8, fontSize: '1rem' }}>{feature.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Roadmap stop component ────────────────────────────────────────────────────
function RoadmapStop({ module, index, progressData, row }) {
  const [hovered, setHovered] = useState(false)
  const { percent } = progressData
  const isDone = percent === 100
  const isStarted = percent > 0

  const levelColors = {
    'Débutant':      '#34d399',
    'Intermédiaire': '#fbbf24',
    'Avancé':        '#f87171',
    'Expert':        '#c084fc',
    'Tous niveaux':  '#22d3ee',
  }
  const levelColor = levelColors[module.level] || '#818cf8'

  return (
    <Link
      to={`/module/${module.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle stop */}
      <div style={{
        width: 56, height: 56,
        borderRadius: '50%',
        background: isDone
          ? `radial-gradient(circle, ${module.color}40, ${module.color}20)`
          : isStarted
          ? `radial-gradient(circle, ${module.color}25, rgba(17,24,39,0.9))`
          : 'rgba(17,24,39,0.9)',
        border: `2px solid ${isDone ? module.color : isStarted ? `${module.color}88` : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem',
        transition: 'all 0.25s ease',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        boxShadow: hovered ? `0 0 20px ${module.color}44` : isDone ? `0 0 12px ${module.color}33` : 'none',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
      }}>
        {isDone ? '✓' : module.icon}

        {/* Progress ring */}
        {isStarted && !isDone && (
          <svg style={{ position: 'absolute', inset: -3, width: 62, height: 62 }} viewBox="0 0 62 62">
            <circle cx={31} cy={31} r={28} fill="none" stroke={module.color}
              strokeWidth={2} strokeOpacity={0.3} />
            <circle cx={31} cy={31} r={28} fill="none" stroke={module.color}
              strokeWidth={2}
              strokeDasharray={`${2 * Math.PI * 28 * percent / 100} ${2 * Math.PI * 28 * (1 - percent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 31 31)"
            />
          </svg>
        )}
      </div>

      {/* Module number */}
      <div style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 6 }}>
        {String(module.id).padStart(2, '0')}
      </div>

      {/* Title */}
      <div style={{
        fontSize: '0.72rem',
        fontWeight: hovered ? 700 : 600,
        color: hovered ? 'var(--text-primary)' : 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: 80,
        lineHeight: 1.3,
        marginTop: 2,
        transition: 'color 0.2s',
      }}>
        {module.title}
      </div>

      {/* Level badge */}
      <div style={{
        marginTop: 4,
        width: 6, height: 6,
        borderRadius: '50%',
        background: levelColor,
        opacity: 0.8,
      }} />
    </Link>
  )
}
