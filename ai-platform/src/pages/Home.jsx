import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import ModuleCard from '../components/ModuleCard.jsx'

export default function Home({ modules, progressHook }) {
  const { getModuleProgress, getOverallProgress, progress } = progressHook
  const overall = getOverallProgress(modules)
  const heroRef = useRef(null)

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '100px 0 80px',
        }}
      >
        {/* Animated background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="bg-grid" style={{
          position: 'absolute', inset: 0,
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '8%',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%',
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-primary-light)',
            marginBottom: 28,
            animation: 'fadeInUp 0.5s ease',
          }}>
            <span style={{ animation: 'float 2s ease-in-out infinite' }}>🚀</span>
            De zéro à l'expertise en IA — 10 modules progressifs
          </div>

          {/* Title */}
          <h1 style={{
            marginBottom: 24,
            animation: 'fadeInUp 0.5s ease 0.1s both',
            maxWidth: 800,
            margin: '0 auto 24px',
          }}>
            Comprenez l'IA{' '}
            <span className="gradient-text">de A à Z</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.75,
            animation: 'fadeInUp 0.5s ease 0.2s both',
          }}>
            Des fondations mathématiques aux LLMs, RAG, Agents et MCP.
            Une plateforme interactive pensée pour les développeurs.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.5s ease 0.3s both',
          }}>
            <Link to="/modules" className="btn btn-primary btn-lg">
              Commencer l'aventure →
            </Link>
            <Link to="/module/fondations" className="btn btn-ghost btn-lg">
              Module 1 : Les Fondations
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginTop: 56,
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.5s ease 0.4s both',
          }}>
            {[
              { value: '10', label: 'Modules', icon: '📚' },
              { value: '30+', label: 'Leçons', icon: '📖' },
              { value: '50+', label: 'Exemples de code', icon: '💻' },
              { value: '80+', label: 'Questions quiz', icon: '🎯' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{stat.icon}</div>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRESS BANNER (si en cours) ─────────────── */}
      {overall.completed > 0 && (
        <section style={{ padding: '0 0 32px' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.5s ease',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Votre progression
                </div>
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
              <Link to="/modules" className="btn btn-secondary">
                Continuer l'apprentissage →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── LEARNING PATH ──────────────────────────────── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ marginBottom: 12 }}>
              Parcours d'apprentissage
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              10 modules ordonnés du plus accessible au plus avancé. Chaque module s'appuie sur le précédent.
            </p>
          </div>

          {/* Modules grid */}
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
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
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
              {
                icon: '💻',
                title: 'Code production-ready',
                desc: 'Chaque concept illustré par du code Python réel, avec PyTorch, TensorFlow, HuggingFace, LangChain...',
              },
              {
                icon: '🎯',
                title: 'Quiz progressifs',
                desc: 'Validez vos acquis avec des quiz interactifs après chaque module. Réponses expliquées.',
              },
              {
                icon: '📊',
                title: 'Progression sauvegardée',
                desc: 'Votre avancée est mémorisée. Reprenez exactement où vous vous êtes arrêté.',
              },
              {
                icon: '🌊',
                title: 'Du fondamental au SOTA',
                desc: 'Des bases mathématiques jusqu\'aux MCP, RAG et agents IA — l\'état de l\'art 2025.',
              },
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
