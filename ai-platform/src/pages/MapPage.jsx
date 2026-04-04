import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'

// ── Layout math ────────────────────────────────────────────────────────────────
function polarToCart(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function getHeadings(lesson) {
  if (!lesson.sections) return []
  return lesson.sections
    .filter(s => s.type === 'heading')
    .map(s => s.content)
    .slice(0, 4)
}

// ── Node component ─────────────────────────────────────────────────────────────
function MapNode({ x, y, label, icon, r, fontSize, color, colorLight, href, active, onClick }) {
  const [hov, setHov] = useState(false)
  const isHov = hov || active

  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: href ? 'pointer' : 'default' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <circle r={r + (isHov ? 3 : 0)}
        fill={isHov ? `${color}22` : `${color}12`}
        stroke={isHov ? color : `${color}55`}
        strokeWidth={isHov ? 1.5 : 1}
        style={{ transition: 'all 0.2s' }}
      />
      {icon && (
        <text textAnchor="middle" dominantBaseline="middle" fontSize={r * 0.6}
          y={-r * 0.22} style={{ userSelect: 'none' }}>
          {icon}
        </text>
      )}
      <foreignObject
        x={-r * 0.9} y={icon ? r * 0.1 : -r * 0.5}
        width={r * 1.8} height={r * (icon ? 0.85 : 1)}
        style={{ overflow: 'visible' }}
      >
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          textAlign: 'center', fontSize: fontSize,
          color: isHov ? colorLight : 'rgba(255,255,255,0.75)',
          fontWeight: icon ? 700 : 500,
          lineHeight: 1.25,
          wordBreak: 'break-word',
          transition: 'color 0.2s',
        }}>
          {label}
        </div>
      </foreignObject>
    </g>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function MapPage({ modules }) {
  const { slug } = useParams()
  const module = modules.find(m => m.slug === slug)
  const [activeLesson, setActiveLesson] = useState(null)

  if (!module) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Module introuvable</h2>
        <Link to="/modules" className="btn btn-primary" style={{ marginTop: 16 }}>Retour</Link>
      </div>
    )
  }

  const lessons = module.lessons
  const N = lessons.length

  // SVG dimensions
  const W = 900
  const H = 640
  const CX = W / 2
  const CY = H / 2
  const R_CENTER = 54
  const R_LESSON = 42
  const R_HEADING = 28
  const LESSON_ORBIT = 200
  const HEADING_ORBIT = 90

  const lessonNodes = lessons.map((l, i) => {
    const angle = (360 / N) * i
    const pos = polarToCart(CX, CY, LESSON_ORBIT, angle)
    const headings = getHeadings(l)
    const headingNodes = headings.map((h, j) => {
      const hAngle = angle - 30 + (60 / Math.max(headings.length - 1, 1)) * j
      const hPos = polarToCart(pos.x, pos.y, HEADING_ORBIT, hAngle)
      return { ...hPos, label: h }
    })
    return { ...pos, lesson: l, angle, headingNodes }
  })

  const activeLessonData = activeLesson !== null ? lessonNodes[activeLesson] : null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to={`/module/${module.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>
          ← Retour au module
        </Link>
        <span style={{ color: 'var(--border-subtle)' }}>|</span>
        <span style={{ fontSize: '1.1rem' }}>{module.icon}</span>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{module.title}</h1>
        <span style={{
          fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4,
          background: `${module.color}15`, color: module.colorLight,
          border: `1px solid ${module.color}30`, fontFamily: 'var(--font-mono)',
        }}>
          Carte mentale
        </span>
      </div>

      {/* Hint */}
      <div style={{ textAlign: 'center', paddingTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        Survolez ou cliquez une leçon pour voir ses concepts clés · Cliquez "Ouvrir" pour y accéder
      </div>

      {/* SVG Map */}
      <div style={{ overflowX: 'auto', padding: '0 16px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto', minWidth: 500 }}>
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor={module.color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={module.color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={LESSON_ORBIT + R_LESSON + 10} fill="url(#bgGrad)" />

          {/* Connector lines — center to lessons */}
          {lessonNodes.map((n, i) => (
            <line key={`cl-${i}`} x1={CX} y1={CY} x2={n.x} y2={n.y}
              stroke={module.color} strokeWidth={activeLesson === i ? 1.5 : 0.8}
              opacity={activeLesson === i ? 0.6 : 0.25}
              style={{ transition: 'all 0.2s' }}
            />
          ))}

          {/* Connector lines — lessons to headings (only when active) */}
          {activeLessonData && activeLessonData.headingNodes.map((h, j) => (
            <line key={`hl-${j}`} x1={activeLessonData.x} y1={activeLessonData.y} x2={h.x} y2={h.y}
              stroke={module.colorLight} strokeWidth={0.8} opacity={0.4} strokeDasharray="4,3"
            />
          ))}

          {/* Heading nodes (only when active) */}
          {activeLessonData && activeLessonData.headingNodes.map((h, j) => (
            <MapNode key={`h-${j}`} x={h.x} y={h.y} label={h.label}
              r={R_HEADING} fontSize="7px"
              color={module.colorLight} colorLight="#fff"
              active={false}
            />
          ))}

          {/* Lesson nodes */}
          {lessonNodes.map((n, i) => (
            <MapNode key={`l-${i}`} x={n.x} y={n.y}
              label={n.lesson.title} icon={n.lesson.icon}
              r={R_LESSON} fontSize="8px"
              color={module.color} colorLight={module.colorLight}
              active={activeLesson === i}
              onClick={() => setActiveLesson(activeLesson === i ? null : i)}
            />
          ))}

          {/* Center node */}
          <MapNode x={CX} y={CY} label={module.title} icon={module.icon}
            r={R_CENTER} fontSize="9px"
            color={module.color} colorLight={module.colorLight}
            active={false}
          />
        </svg>
      </div>

      {/* Active lesson detail panel */}
      {activeLessonData && (
        <div style={{
          maxWidth: 480, margin: '0 auto 24px', padding: '0 16px',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{
            background: 'var(--bg-card)', border: `1px solid ${module.color}30`,
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>{activeLessonData.lesson.icon}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leçon {activeLesson + 1}/{N}</div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{activeLessonData.lesson.title}</h3>
                </div>
              </div>
              <Link
                to={`/module/${module.slug}/lesson/${activeLessonData.lesson.id}`}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Ouvrir →
              </Link>
            </div>
            {activeLessonData.headingNodes.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeLessonData.headingNodes.map((h, j) => (
                  <span key={j} style={{
                    fontSize: '0.72rem', padding: '3px 9px', borderRadius: 'var(--radius-full)',
                    background: `${module.color}12`, border: `1px solid ${module.color}25`,
                    color: module.colorLight,
                  }}>
                    {h.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', paddingBottom: 32, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${module.color}20`, border: `1px solid ${module.color}` }} />
          Leçon
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: `${module.colorLight}20`, border: `1px solid ${module.colorLight}` }} />
          Concept clé (cliquer pour révéler)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${module.color}15`, border: `2px solid ${module.color}` }} />
          Module
        </div>
      </div>
    </div>
  )
}
