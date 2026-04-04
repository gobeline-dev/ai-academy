import { useState, useMemo } from 'react'
import ModuleCard from '../components/ModuleCard.jsx'

const LEVELS = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé', 'Expert']
const STATUSES = ['Tous', 'Non commencé', 'En cours', 'Complété']

const LEVEL_COLORS = {
  'Débutant':      { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  'Intermédiaire': { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  'Avancé':        { color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)'  },
  'Expert':        { color: '#c084fc', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)' },
}

export default function ModulesPage({ modules, progressHook }) {
  const { getModuleProgress, getOverallProgress, progress } = progressHook
  const overall = getOverallProgress(modules)

  const [search, setSearch]           = useState('')
  const [levelFilter, setLevelFilter] = useState('Tous')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const { percent } = getModuleProgress(module.slug, module.lessons)

      if (search) {
        const q = search.toLowerCase()
        if (!module.title.toLowerCase().includes(q) && !module.subtitle.toLowerCase().includes(q)) return false
      }

      if (levelFilter !== 'Tous' && module.level !== levelFilter) return false

      if (statusFilter === 'Non commencé' && percent !== 0) return false
      if (statusFilter === 'En cours' && (percent === 0 || percent === 100)) return false
      if (statusFilter === 'Complété' && percent !== 100) return false

      return true
    })
  }, [modules, search, levelFilter, statusFilter, progress.completedLessons])

  const isFiltered = search || levelFilter !== 'Tous' || statusFilter !== 'Tous'

  return (
    <div className="section-padding">
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 40, animation: 'fadeInUp 0.4s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-light)',
            marginBottom: 16, fontFamily: 'var(--font-mono)',
          }}>
            {modules.length} MODULES
          </div>
          <h1 style={{ marginBottom: 12 }}>Tous les modules</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 550, lineHeight: 1.7 }}>
            Un parcours complet de l'algèbre linéaire aux serveurs MCP.
            Suivez l'ordre recommandé ou plongez directement dans le sujet qui vous intéresse.
          </p>
        </div>

        {/* Overall progress */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 20,
          animation: 'fadeInUp 0.4s ease 0.1s both',
        }}>
          {[
            { label: 'Leçons complétées', value: `${overall.completed}/${overall.total}`, icon: '📖', color: 'var(--color-primary-light)' },
            { label: 'XP gagnés',         value: progress.totalXP,                          icon: '⚡', color: '#fbbf24' },
            { label: 'Quiz complétés',    value: progress.completedQuizzes.length,            icon: '🎯', color: '#34d399' },
            { label: 'Progression',       value: `${overall.percent}%`,                      icon: '📊', color: '#c084fc' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, lineHeight: 1.1, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ──────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          animation: 'fadeInUp 0.4s ease 0.15s both',
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.9rem', color: 'var(--text-muted)', pointerEvents: 'none',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher un module…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${search ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = search ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '1rem', padding: '0 4px',
              }}>✕</button>
            )}
          </div>

          {/* Level + Status filters */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {/* Level */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Niveau :</span>
              {LEVELS.map(level => {
                const active = levelFilter === level
                const cfg = LEVEL_COLORS[level]
                return (
                  <FilterPill
                    key={level}
                    label={level}
                    active={active}
                    onClick={() => setLevelFilter(level)}
                    color={active && cfg ? cfg.color : undefined}
                    bg={active && cfg ? cfg.bg : undefined}
                    border={active && cfg ? cfg.border : undefined}
                  />
                )
              })}
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Statut :</span>
              {STATUSES.map(status => (
                <FilterPill
                  key={status}
                  label={status === 'Non commencé' ? 'Non commencé' : status === 'En cours' ? '🔥 En cours' : status === 'Complété' ? '✅ Complété' : status}
                  active={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                />
              ))}
            </div>
          </div>

          {/* Reset + count */}
          {isFiltered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''} affiché{filteredModules.length !== 1 ? 's' : ''}
              </span>
              <button onClick={() => { setSearch(''); setLevelFilter('Tous'); setStatusFilter('Tous') }} style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-light)',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px',
              }}>
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Modules grid */}
        {filteredModules.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: '0.9rem', marginBottom: 8 }}>Aucun module pour ces filtres</div>
            <button onClick={() => { setSearch(''); setLevelFilter('Tous'); setStatusFilter('Tous') }} style={{
              marginTop: 8, padding: '7px 16px', borderRadius: 'var(--radius-full)',
              background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-light)',
              border: '1px solid rgba(99,102,241,0.3)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            }}>
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 20,
          }}>
            {filteredModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                progressData={getModuleProgress(module.slug, module.lessons)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ label, active, onClick, color, bg, border }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem', fontWeight: 600,
      border: `1px solid ${active ? (border || 'rgba(99,102,241,0.5)') : 'rgba(255,255,255,0.08)'}`,
      background: active ? (bg || 'rgba(99,102,241,0.15)') : 'transparent',
      color: active ? (color || 'var(--color-primary-light)') : 'var(--text-muted)',
      cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  )
}
