import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const XP_LEVELS = [
  { min: 0,    max: 100,  name: 'Novice',     color: '#94a3b8' },
  { min: 100,  max: 300,  name: 'Apprenti',   color: '#34d399' },
  { min: 300,  max: 600,  name: 'Pratiquant', color: '#60a5fa' },
  { min: 600,  max: 1000, name: 'Expert',     color: '#c084fc' },
  { min: 1000, max: 2000, name: 'Maître',     color: '#fbbf24' },
  { min: 2000, max: null, name: 'Légende',    color: '#f87171' },
]

function getXPInfo(xp) {
  let idx = 0
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i].min) idx = i
  }
  const level = XP_LEVELS[idx]
  const next = XP_LEVELS[idx + 1] || null
  const progress = next
    ? Math.min(100, Math.round(((xp - level.min) / (next.min - level.min)) * 100))
    : 100
  return { level, next, progress }
}

export default function Header({ modules, progressHook, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const { getOverallProgress, progress } = progressHook

  const overall = getOverallProgress(modules)
  const unlockedCount = (progress.unlockedAchievements || []).length
  const { level, next, progress: xpPct } = getXPInfo(progress.totalXP)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [mobileOpen])

  return (
    <header
      ref={menuRef}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled || mobileOpen
          ? 'var(--header-bg, rgba(4,6,15,0.95))'
          : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled || mobileOpen
          ? '1px solid var(--border-subtle)'
          : '1px solid transparent',
      }}
    >
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64, gap: 12,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 15px rgba(99,102,241,0.4)',
          }}>🧠</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">AI</span>
            <span style={{ color: 'var(--text-primary)' }}> Academy</span>
          </span>
        </Link>

        {/* Nav — desktop only */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <NavLink to="/" label="Accueil" active={location.pathname === '/'} />
          <NavLink to="/modules" label="Modules" active={location.pathname.startsWith('/module')} />
          <NavLink
            to="/achievements"
            label={
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                Trophées
                {unlockedCount > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 18, height: 18, borderRadius: 99,
                    background: 'linear-gradient(135deg,#78350f,#fbbf24)',
                    color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '0 4px', lineHeight: 1,
                  }}>{unlockedCount}</span>
                )}
              </span>
            }
            active={location.pathname === '/achievements'}
          />
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* XP Level widget — desktop only */}
          {progress.totalXP > 0 && (
            <div className="xp-level-widget" style={{
              display: 'flex', flexDirection: 'column', gap: 3,
              padding: '5px 12px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
              minWidth: 110,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: level.color }}>{level.name}</span>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>⚡{progress.totalXP}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${xpPct}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${next?.color || level.color})`,
                  borderRadius: 99, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
              {next && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>→ {next.name}</div>}
            </div>
          )}

          {/* Lesson count — desktop only */}
          {overall.completed > 0 && (
            <div className="lesson-completed-count desktop-nav" style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <span style={{ fontSize: '0.75rem' }}>✅</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                {overall.completed}/{overall.total}
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.95rem', transition: 'all 0.2s ease', color: 'var(--text-secondary)', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Commencer — desktop only */}
          <Link to="/modules" className="btn btn-primary btn-sm desktop-nav">
            Commencer →
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-nav-menu">
          <MobileNavLink to="/" label="🏠 Accueil" active={location.pathname === '/'} />
          <MobileNavLink to="/modules" label="📚 Modules" active={location.pathname.startsWith('/module')} />
          <MobileNavLink
            to="/achievements"
            label={`🏆 Trophées${unlockedCount > 0 ? ` (${unlockedCount})` : ''}`}
            active={location.pathname === '/achievements'}
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />

          {/* XP in mobile menu */}
          {progress.totalXP > 0 && (
            <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: level.color }}>{level.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚡ {progress.totalXP} XP</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${xpPct}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${next?.color || level.color})`,
                  borderRadius: 99,
                }} />
              </div>
              {next && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Prochain niveau : {next.name} ({next.min} XP)
                </div>
              )}
            </div>
          )}

          {/* Start CTA */}
          <Link to="/modules" className="btn btn-primary" style={{ marginTop: 4, textAlign: 'center' }}>
            Commencer l'apprentissage →
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 641px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
          .mobile-nav-menu { display: none !important; }
        }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      padding: '6px 14px', borderRadius: 'var(--radius-md)',
      fontSize: '0.875rem', fontWeight: 500,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
      textDecoration: 'none', transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' } }}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      padding: '12px 14px', borderRadius: 'var(--radius-md)',
      fontSize: '1rem', fontWeight: active ? 700 : 500,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
      border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
      textDecoration: 'none', display: 'block',
      transition: 'all 0.15s ease',
    }}>
      {label}
    </Link>
  )
}
