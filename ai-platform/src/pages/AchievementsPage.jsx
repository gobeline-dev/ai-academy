import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ACHIEVEMENTS, RARITY_CONFIG } from '../data/achievements.js'

const RARITIES = ['all', 'bronze', 'silver', 'gold', 'platinum']
const STATUS = ['all', 'unlocked', 'locked']

const RARITY_LABELS = { all: 'Tous', bronze: 'Bronze', silver: 'Argent', gold: 'Or', platinum: 'Platine' }
const STATUS_LABELS = { all: 'Tous', unlocked: 'Débloqués', locked: 'Verrouillés' }

export default function AchievementsPage({ modules, progressHook }) {
  const { progress } = progressHook
  const unlocked = new Set(progress.unlockedAchievements || [])

  const [rarityFilter, setRarityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return ACHIEVEMENTS.filter(a => {
      if (rarityFilter !== 'all' && a.rarity !== rarityFilter) return false
      if (statusFilter === 'unlocked' && !unlocked.has(a.id)) return false
      if (statusFilter === 'locked' && unlocked.has(a.id)) return false
      return true
    })
  }, [rarityFilter, statusFilter, unlocked])

  // Count by rarity
  const counts = useMemo(() => {
    const result = {}
    for (const r of ['bronze', 'silver', 'gold', 'platinum']) {
      const total = ACHIEVEMENTS.filter(a => a.rarity === r).length
      const done = ACHIEVEMENTS.filter(a => a.rarity === r && unlocked.has(a.id)).length
      result[r] = { total, done }
    }
    return result
  }, [unlocked])

  const totalDone = unlocked.size
  const totalAll = ACHIEVEMENTS.length

  return (
    <div className="section-padding">
      <div className="container">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.82rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <span style={{ color: 'var(--text-primary)' }}>Trophées</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40, animation: 'fadeInUp 0.4s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
            fontSize: '0.78rem', fontWeight: 600, color: '#fbbf24',
            marginBottom: 16, fontFamily: 'var(--font-mono)',
          }}>
            🏆 TROPHÉES
          </div>
          <h1 style={{ marginBottom: 12 }}>Tes <span className="gradient-text">Trophées</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.7 }}>
            Débloque des trophées en progressant dans ton parcours IA.
            Chaque accomplissement est récompensé.
          </p>
        </div>

        {/* Trophy case — rarity summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 40,
          animation: 'fadeInUp 0.4s ease 0.1s both',
        }}>
          {/* Total */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ fontSize: '2.5rem' }}>🏆</div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg,#fbbf24,#fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {totalDone}/{totalAll}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>trophées débloqués</div>
            </div>
            {/* progress */}
            <div style={{ flex: 1, maxWidth: 260, marginLeft: 'auto' }}>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.round((totalDone / totalAll) * 100)}%`, background: 'linear-gradient(90deg, #78350f, #fbbf24, #fde68a)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
                {Math.round((totalDone / totalAll) * 100)}%
              </div>
            </div>
          </div>

          {/* Per rarity */}
          {['bronze', 'silver', 'gold', 'platinum'].map(r => {
            const cfg = RARITY_CONFIG[r]
            const { done, total } = counts[r]
            return (
              <div key={r} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${done === total && total > 0 ? cfg.border : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex', flexDirection: 'column', gap: 8,
                boxShadow: done === total && total > 0 ? cfg.glow : 'none',
                transition: 'all 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrophyIcon rarity={r} size={24} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: done > 0 ? cfg.colorLight : 'var(--text-muted)', lineHeight: 1 }}>
                  {done}<span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>/{total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${Math.round((done / total) * 100)}%`, background: cfg.gradient }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          marginBottom: 32,
          animation: 'fadeInUp 0.4s ease 0.15s both',
        }}>
          {/* Rarity filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>Rareté :</span>
            {RARITIES.map(r => {
              const active = rarityFilter === r
              const cfg = r !== 'all' ? RARITY_CONFIG[r] : null
              return (
                <button key={r} onClick={() => setRarityFilter(r)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem', fontWeight: 600,
                  border: `1px solid ${active ? (cfg?.border || 'rgba(99,102,241,0.5)') : 'rgba(255,255,255,0.08)'}`,
                  background: active ? (cfg?.bg || 'rgba(99,102,241,0.15)') : 'transparent',
                  color: active ? (cfg?.colorLight || 'var(--color-primary-light)') : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: active && cfg ? cfg.glow : 'none',
                }}>
                  {r !== 'all' && <TrophyIcon rarity={r} size={14} />}
                  {RARITY_LABELS[r]}
                </button>
              )
            })}
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>Statut :</span>
            {STATUS.map(s => {
              const active = statusFilter === s
              return (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: '5px 14px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem', fontWeight: 600,
                  border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? 'var(--color-primary-light)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  {s === 'unlocked' ? '✅ ' : s === 'locked' ? '🔒 ' : ''}{STATUS_LABELS[s]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {filtered.length} trophée{filtered.length !== 1 ? 's' : ''}
          {rarityFilter !== 'all' || statusFilter !== 'all' ? ' (filtré)' : ''}
        </div>

        {/* Achievement grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: '0.9rem' }}>Aucun trophée pour ces filtres</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filtered.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlocked.has(achievement.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AchievementCard({ achievement, isUnlocked, index }) {
  const [hovered, setHovered] = useState(false)
  const rarity = RARITY_CONFIG[achievement.rarity]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isUnlocked
          ? hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)'
          : 'rgba(8, 12, 23, 0.6)',
        border: `1px solid ${isUnlocked ? (hovered ? rarity.border : rarity.border + '88') : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        transition: 'all 0.3s ease',
        transform: hovered && isUnlocked ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isUnlocked && hovered ? rarity.glow + ', 0 16px 40px rgba(0,0,0,0.4)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeInUp 0.5s ease ${index * 0.04}s both`,
        opacity: isUnlocked ? 1 : 0.6,
        cursor: isUnlocked ? 'default' : 'not-allowed',
      }}
    >
      {/* Gradient accent (unlocked only) */}
      {isUnlocked && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: rarity.gradient,
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.3s',
        }} />
      )}

      {/* Shimmer on hover (unlocked only) */}
      {isUnlocked && hovered && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', right: 0, bottom: 0,
          background: `linear-gradient(105deg, transparent 40%, ${rarity.shimmer}22 50%, transparent 60%)`,
          animation: 'rarityShimmerCard 0.8s ease',
          pointerEvents: 'none',
        }} />
      )}

      <style>{`
        @keyframes rarityShimmerCard {
          from { left: -100%; }
          to   { left: 100%; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, flexShrink: 0,
          borderRadius: 14,
          background: isUnlocked ? rarity.bg : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isUnlocked ? rarity.border : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isUnlocked ? '1.7rem' : '1.5rem',
          filter: isUnlocked ? 'none' : 'grayscale(1) opacity(0.4)',
          transition: 'transform 0.3s ease',
          transform: hovered && isUnlocked ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {isUnlocked ? achievement.icon : '🔒'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Rarity badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <TrophyIcon rarity={achievement.rarity} size={12} />
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: isUnlocked ? rarity.color : 'var(--text-muted)',
            }}>
              {rarity.label}
            </span>
            {isUnlocked && (
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.68rem', fontWeight: 700,
                color: '#34d399',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                ✓ Débloqué
              </span>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontSize: '0.95rem', fontWeight: 700,
            color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
            marginBottom: 4, letterSpacing: '-0.01em',
          }}>
            {achievement.title}
          </div>

          {/* Description / Hint */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {isUnlocked ? achievement.description : achievement.hint}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrophyIcon({ rarity, size = 16 }) {
  const cfg = RARITY_CONFIG[rarity]
  const icons = { bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💠' }
  return <span style={{ fontSize: size, lineHeight: 1, filter: `drop-shadow(0 0 4px ${cfg.color}88)` }}>{icons[rarity]}</span>
}
