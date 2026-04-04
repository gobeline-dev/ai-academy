import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header({ modules, progressHook }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { getOverallProgress, progress } = progressHook

  const overall = getOverallProgress(modules)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled
        ? 'rgba(4, 6, 15, 0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        gap: 24,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 15px rgba(99,102,241,0.4)',
          }}>
            🧠
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">AI</span>
            <span style={{ color: 'var(--text-primary)' }}> Academy</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <NavLink to="/" label="Accueil" active={location.pathname === '/'} />
          <NavLink to="/modules" label="Modules" active={location.pathname.startsWith('/module')} />
        </nav>

        {/* XP & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {overall.completed > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <span style={{ fontSize: '0.8rem' }}>⚡</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                  {progress.totalXP} XP
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <span style={{ fontSize: '0.8rem' }}>✅</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
                  {overall.completed}/{overall.total}
                </span>
              </div>
            </div>
          )}
          <Link to="/modules" className="btn btn-primary btn-sm">
            Commencer →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.target.style.color = 'var(--text-primary)'
          e.target.style.background = 'rgba(255,255,255,0.05)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.target.style.color = 'var(--text-secondary)'
          e.target.style.background = 'transparent'
        }
      }}
    >
      {label}
    </Link>
  )
}
