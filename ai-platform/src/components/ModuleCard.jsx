import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ModuleCard({ module, progressData, index }) {
  const [hovered, setHovered] = useState(false)
  const { percent, completed, total } = progressData
  const isStarted = completed > 0
  const isCompleted = completed === total

  const levelColors = {
    'Débutant': { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.25)' },
    'Intermédiaire': { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
    'Avancé': { bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
    'Expert': { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', border: 'rgba(168,85,247,0.25)' },
    'Tous niveaux': { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  }
  const levelStyle = levelColors[module.level] || levelColors['Tous niveaux']

  return (
    <Link
      to={`/module/${module.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          border: `1px solid ${hovered ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${module.color}22` : '0 4px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
          animation: `fadeInUp 0.5s ease ${index * 0.07}s both`,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Gradient background accent */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 150, height: 150,
          background: `radial-gradient(ellipse at top right, ${module.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          opacity: hovered ? 1 : 0.5,
        }} />

        {/* Module number */}
        <div style={{
          position: 'absolute',
          top: 20, right: 20,
          width: 28, height: 28,
          borderRadius: 8,
          background: `${module.color}22`,
          border: `1px solid ${module.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: module.colorLight,
          fontFamily: 'var(--font-mono)',
        }}>
          {String(module.id).padStart(2, '0')}
        </div>

        {/* Top: icon + status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: `${module.color}20`,
            border: `1px solid ${module.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          }}>
            {module.icon}
          </div>
          {isCompleted && (
            <div style={{
              width: 24, height: 24,
              borderRadius: '50%',
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem',
              marginTop: 6,
            }}>
              ✓
            </div>
          )}
        </div>

        {/* Content */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 6,
          letterSpacing: '-0.01em',
        }}>
          {module.title}
        </h3>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginBottom: 16,
          lineHeight: 1.5,
          flex: 1,
        }}>
          {module.subtitle}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: levelStyle.bg,
            color: levelStyle.text,
            border: `1px solid ${levelStyle.border}`,
          }}>
            {module.level}
          </span>
          <span style={{
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            ⏱ {module.duration}
          </span>
          <span style={{
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            📖 {module.lessons.length} leçons
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isStarted ? (isCompleted ? '✅ Complété' : `${completed}/${total} leçons`) : 'Non commencé'}
            </span>
            <span style={{ fontSize: '0.72rem', color: module.colorLight, fontWeight: 700 }}>
              {percent}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, ${module.color}, ${module.colorLight})`,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
