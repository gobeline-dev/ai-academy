import ModuleCard from '../components/ModuleCard.jsx'

export default function ModulesPage({ modules, progressHook }) {
  const { getModuleProgress, getOverallProgress, progress } = progressHook
  const overall = getOverallProgress(modules)

  const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert', 'Tous niveaux']

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 48, animation: 'fadeInUp 0.4s ease' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-primary-light)',
            marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>
            {modules.length} MODULES
          </div>
          <h1 style={{ marginBottom: 12 }}>
            Tous les modules
          </h1>
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
          marginBottom: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 20,
          animation: 'fadeInUp 0.4s ease 0.1s both',
        }}>
          {[
            { label: 'Leçons complétées', value: `${overall.completed}/${overall.total}`, icon: '📖', color: 'var(--color-primary-light)' },
            { label: 'XP gagnés', value: progress.totalXP, icon: '⚡', color: '#fbbf24' },
            { label: 'Quiz complétés', value: progress.completedQuizzes.length, icon: '🎯', color: '#34d399' },
            { label: 'Progression', value: `${overall.percent}%`, icon: '📊', color: '#c084fc' },
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

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.4s ease 0.15s both',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 4 }}>Niveaux :</span>
          {[
            { label: 'Débutant', color: '#34d399' },
            { label: 'Intermédiaire', color: '#fbbf24' },
            { label: 'Avancé', color: '#f87171' },
            { label: 'Expert', color: '#c084fc' },
          ].map(l => (
            <span key={l.label} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: `${l.color}18`,
              color: l.color,
              border: `1px solid ${l.color}30`,
            }}>
              {l.label}
            </span>
          ))}
        </div>

        {/* Modules grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
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
    </div>
  )
}
