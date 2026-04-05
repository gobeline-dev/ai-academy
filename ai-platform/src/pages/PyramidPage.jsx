import { Link } from 'react-router-dom'
import { useState } from 'react'

// ── Prerequisite tree ──────────────────────────────────────────────────────────
// Each tier = one level in the learning pyramid (bottom → top)
const TIERS = [
  {
    id: 'fondations',
    label: 'Fondations',
    sublabel: 'Les bases mathématiques et statistiques indispensables',
    moduleIds: [1],
    width: '100%',
    color: '#6366f1',
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    sublabel: 'Algorithmes classiques et réseaux de neurones',
    moduleIds: [2, 3, 4],
    width: '88%',
    color: '#8b5cf6',
  },
  {
    id: 'llm',
    label: 'Grands Modèles de Langage',
    sublabel: 'NLP, embeddings et architecture Transformer',
    moduleIds: [5, 6],
    width: '74%',
    color: '#ec4899',
  },
  {
    id: 'applications',
    label: 'Ingénierie LLM',
    sublabel: 'Prompt engineering et retrieval augmenté',
    moduleIds: [7, 8],
    width: '58%',
    color: '#f97316',
  },
  {
    id: 'agentique',
    label: 'IA Agentique',
    sublabel: 'Agents autonomes et protocoles avancés',
    moduleIds: [9, 10],
    width: '40%',
    color: '#ef4444',
  },
]

const PREREQS = {
  1: [],
  2: [1],
  3: [2],
  4: [2],
  5: [3, 4],
  6: [5],
  7: [6],
  8: [6],
  9: [7, 8],
  10: [9],
}

// ── Module card ────────────────────────────────────────────────────────────────
function ModuleCard({ module, isCompleted, isUnlocked }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/module/${module.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 16px',
        borderRadius: 12,
        background: hov
          ? `${module.color}20`
          : isCompleted
            ? `${module.color}14`
            : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov || isCompleted ? module.color + '60' : 'rgba(255,255,255,0.08)'}`,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        flex: 1,
        minWidth: 110,
        maxWidth: 200,
        cursor: isUnlocked ? 'pointer' : 'default',
        opacity: isUnlocked ? 1 : 0.45,
        position: 'relative',
        transform: hov && isUnlocked ? 'translateY(-2px)' : 'none',
        boxShadow: hov && isUnlocked ? `0 8px 24px ${module.color}30` : 'none',
      }}
    >
      {isCompleted && (
        <div style={{
          position: 'absolute', top: 6, right: 8,
          fontSize: '0.65rem', color: '#34d399', fontWeight: 700,
        }}>✓</div>
      )}
      {!isUnlocked && (
        <div style={{
          position: 'absolute', top: 6, right: 8,
          fontSize: '0.7rem', color: 'var(--text-muted)',
        }}>🔒</div>
      )}
      <span style={{ fontSize: '1.4rem' }}>{module.icon}</span>
      <div style={{
        fontSize: '0.72rem', fontWeight: 700,
        color: hov && isUnlocked ? module.colorLight : 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.3, transition: 'color 0.2s',
      }}>
        {module.title}
      </div>
      <div style={{
        fontSize: '0.62rem', color: 'var(--text-muted)',
        textAlign: 'center', lineHeight: 1.3,
      }}>
        {module.subtitle}
      </div>
      <div style={{
        fontSize: '0.58rem', padding: '2px 8px', borderRadius: 99,
        background: `${module.color}20`, color: module.colorLight,
        border: `1px solid ${module.color}35`, fontFamily: 'var(--font-mono)',
        marginTop: 2,
      }}>
        {module.level}
      </div>
    </Link>
  )
}

// ── Pyramid tier ──────────────────────────────────────────────────────────────
function Tier({ tier, modules, progressHook, isLast }) {
  const { getModuleProgress, progress } = progressHook
  const tierModules = modules.filter(m => tier.moduleIds.includes(m.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Tier row */}
      <div style={{
        width: tier.width,
        maxWidth: 900,
        transition: 'width 0.3s ease',
        position: 'relative',
      }}>
        {/* Tier background band */}
        <div style={{
          borderRadius: isLast ? '12px 12px 0 0' : '0',
          background: `linear-gradient(135deg, ${tier.color}18, ${tier.color}08)`,
          border: `1px solid ${tier.color}30`,
          borderBottom: isLast ? undefined : 'none',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          {/* Tier label */}
          <div style={{ flexShrink: 0, minWidth: 140 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {tier.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 3 }}>
              {tier.sublabel}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, alignSelf: 'stretch', background: `${tier.color}30`, flexShrink: 0 }} />

          {/* Module cards */}
          <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
            {tierModules.map(m => {
              const prog = getModuleProgress(m)
              const prereqs = PREREQS[m.id] || []
              const isCompleted = prog.completed === prog.total && prog.total > 0
              const isUnlocked = prereqs.every(pid => {
                const pm = modules.find(mod => mod.id === pid)
                if (!pm) return true
                const pp = getModuleProgress(pm)
                return pp.completed > 0
              }) || prereqs.length === 0

              return (
                <ModuleCard
                  key={m.id}
                  module={m}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  modules={modules}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Arrow between tiers */}
      {!isLast && (
        <div style={{
          width: tier.width,
          maxWidth: 900,
          display: 'flex',
          justifyContent: 'center',
          padding: '2px 0',
          background: `${tier.color}18`,
          borderLeft: `1px solid ${tier.color}30`,
          borderRight: `1px solid ${tier.color}30`,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 2 L10 14 M5 9 L10 15 L15 9" stroke={tier.color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ── Prereq legend row ─────────────────────────────────────────────────────────
function PrereqItem({ from, to, modules }) {
  const fromMod = modules.find(m => m.id === from)
  const toMod = modules.find(m => m.id === to)
  if (!fromMod || !toMod) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
      <span style={{ color: fromMod.colorLight }}>{fromMod.icon} {fromMod.title}</span>
      <span style={{ color: 'var(--text-muted)' }}>→</span>
      <span style={{ color: toMod.colorLight }}>{toMod.icon} {toMod.title}</span>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PyramidPage({ modules, progressHook }) {
  const { getOverallProgress } = progressHook
  const overall = getOverallProgress(modules)
  const completedCount = modules.filter(m => {
    const p = progressHook.getModuleProgress(m)
    return p.completed === p.total && p.total > 0
  }).length

  const prereqPairs = Object.entries(PREREQS).flatMap(([to, froms]) =>
    froms.map(from => ({ from: Number(from), to: Number(to) }))
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link to="/modules" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>
          ← Tous les modules
        </Link>
        <span style={{ color: 'var(--border-subtle)' }}>|</span>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Parcours d'apprentissage</h1>
        <span style={{
          fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4,
          background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary-light)',
          border: '1px solid rgba(99,102,241,0.25)', fontFamily: 'var(--font-mono)',
        }}>
          Pyramide des prérequis
        </span>
        {overall.total > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.78rem',
            color: completedCount > 0 ? '#34d399' : 'var(--text-muted)',
          }}>
            {completedCount}/{modules.length} modules complétés
          </span>
        )}
      </div>

      {/* Intro */}
      <div style={{ textAlign: 'center', padding: '32px 24px 8px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Comme la pyramide de Maslow, chaque niveau s'appuie sur les fondations du niveau inférieur.
          Commencez par la base — chaque brique posée ouvre les portes du niveau suivant.
        </p>
      </div>

      {/* Pyramid — bottom-to-top visually */}
      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        padding: '24px 16px 48px',
        gap: 0,
      }}>
        {TIERS.map((tier, i) => (
          <Tier
            key={tier.id}
            tier={tier}
            modules={modules}
            progressHook={progressHook}
            isLast={i === TIERS.length - 1}
          />
        ))}
      </div>

      {/* Bottom base cap */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
        <div style={{
          width: '100%', maxWidth: 900,
          height: 6,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.4), rgba(99,102,241,0.3), transparent)',
          borderRadius: '0 0 4px 4px',
          marginTop: -24,
        }} />
      </div>

      {/* Prerequisite legend */}
      <div style={{ maxWidth: 900, margin: '48px auto 48px', padding: '0 24px' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Chaîne des prérequis
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {prereqPairs.map(({ from, to }) => (
              <div key={`${from}-${to}`} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 99,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontSize: '0.72rem',
              }}>
                <PrereqItem from={from} to={to} modules={modules} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
