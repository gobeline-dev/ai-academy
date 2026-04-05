import { useState, useMemo } from 'react'

// ── GradientDescentWidget ──────────────────────────────────────────────────────
// Shows how learning rate affects convergence on a simple quadratic loss curve.
export function GradientDescentWidget() {
  const [lr, setLr] = useState(0.3)
  const [steps, setSteps] = useState(0)
  const [running, setRunning] = useState(false)

  // f(x) = x², f'(x) = 2x, start at x = 3
  const START_X = 3
  const ITERATIONS = 12

  const trajectory = useMemo(() => {
    const pts = []
    let x = START_X
    for (let i = 0; i <= ITERATIONS; i++) {
      pts.push({ i, x, y: x * x })
      x = x - lr * 2 * x
    }
    return pts
  }, [lr])

  // SVG viewport: x ∈ [-3.5, 3.5], y ∈ [0, 10]
  const W = 400, H = 220
  const PAD = 30
  const toSvg = (x, y) => ({
    cx: PAD + ((x + 3.5) / 7) * (W - PAD * 2),
    cy: H - PAD - (y / 10) * (H - PAD * 2),
  })

  // Parabola path
  const parabolaPoints = []
  for (let xi = -3.5; xi <= 3.5; xi += 0.07) {
    const { cx, cy } = toSvg(xi, xi * xi)
    parabolaPoints.push(`${cx},${cy}`)
  }

  const shown = trajectory.slice(0, steps + 1)
  const lastPt = shown[shown.length - 1]

  const converged = Math.abs(lastPt?.x ?? START_X) < 0.05

  return (
    <div style={{
      background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '1.1rem' }}>🏔️</span>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          Descente de gradient interactive
        </h4>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
        Cas concret : le réseau prédit <strong style={{ color: '#f97316' }}>310 k€</strong> au lieu de <strong style={{ color: '#34d399' }}>250 k€</strong> (erreur = <em>perte</em>). Il faut ajuster le poids <em>x</em> le long de la courbe L(x) = x² pour réduire l'erreur. Chaque étape déplace le poids d'un pas proportionnel au taux d'apprentissage α.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1={PAD + (W - PAD * 2) / 2} y1={PAD} x2={PAD + (W - PAD * 2) / 2} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,3" />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">x</text>
        <text x={8} y={PAD + 4} fontSize="10" fill="rgba(255,255,255,0.3)">perte</text>

        {/* Parabola */}
        <polyline points={parabolaPoints.join(' ')} fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2" strokeLinejoin="round" />

        {/* Trajectory path */}
        {shown.length > 1 && (
          <polyline
            points={shown.map(p => { const { cx, cy } = toSvg(p.x, p.y); return `${cx},${cy}` }).join(' ')}
            fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7"
          />
        )}

        {/* Dots */}
        {shown.map((p, i) => {
          const { cx, cy } = toSvg(p.x, p.y)
          const isLast = i === shown.length - 1
          return (
            <circle key={i} cx={cx} cy={cy} r={isLast ? 6 : 3.5}
              fill={isLast ? '#f97316' : 'rgba(251,146,60,0.5)'}
              stroke={isLast ? '#fed7aa' : 'none'} strokeWidth="1.5"
            />
          )
        })}

        {/* Minimum marker */}
        <circle cx={toSvg(0, 0).cx} cy={toSvg(0, 0).cy} r={4} fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={toSvg(0, 0).cx + 6} y={toSvg(0, 0).cy + 4} fontSize="9" fill="#34d399">min</text>

        {/* Current loss label */}
        {lastPt && (
          <text x={W - PAD} y={PAD + 12} textAnchor="end" fontSize="10" fill="rgba(251,146,60,0.9)">
            perte = {lastPt.y.toFixed(3)}
          </text>
        )}
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
        {/* LR slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Taux d'apprentissage (α)</label>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>{lr.toFixed(3)}</span>
          </div>
          <input type="range" min="0.01" max="1.5" step="0.01" value={lr}
            onChange={e => { setLr(+e.target.value); setSteps(0) }}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            <span>0.01 (lent)</span><span>0.5 (ok)</span><span>1.5 (diverge!)</span>
          </div>
        </div>

        {/* Step controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setSteps(s => Math.min(s + 1, ITERATIONS))}
            className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            +1 étape
          </button>
          <button onClick={() => setSteps(ITERATIONS)}
            className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            Tout montrer
          </button>
          <button onClick={() => setSteps(0)}
            className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            ↺ Reset
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Étape {steps}/{ITERATIONS}
          </span>
          {converged && steps > 0 && (
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>✓ Convergé !</span>
          )}
          {lr > 1.0 && steps > 3 && !converged && Math.abs(lastPt?.x ?? 0) > START_X && (
            <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 600 }}>⚠️ Diverge !</span>
          )}
        </div>

        {/* Insight */}
        <div style={{
          fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6,
          padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8,
        }}>
          {lr < 0.1 && '🐢 Trop faible : la convergence est très lente, beaucoup d\'étapes nécessaires.'}
          {lr >= 0.1 && lr <= 0.9 && '✅ Bon réglage : le gradient descend régulièrement vers le minimum.'}
          {lr > 0.9 && lr <= 1.1 && '⚡ Limite critique : risque d\'oscillations autour du minimum.'}
          {lr > 1.1 && '💥 Trop élevé : le gradient oscille ou diverge et ne converge jamais.'}
        </div>
      </div>
    </div>
  )
}

// ── TemperatureWidget ──────────────────────────────────────────────────────────
// Shows how LLM temperature affects the probability distribution over tokens.
const RAW_LOGITS = [3.2, 2.1, 1.8, 0.9, 0.3, -0.5, -1.2]
const TOKEN_LABELS = ['chat', 'IA', 'aide', 'robot', 'code', 'bonjour', 'fin']
const COLORS = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#f97316']

function softmax(logits, temp) {
  const scaled = logits.map(l => l / temp)
  const max = Math.max(...scaled)
  const exps = scaled.map(l => Math.exp(l - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map(e => e / sum)
}

export function TemperatureWidget() {
  const [temp, setTemp] = useState(1.0)
  const [picked, setPicked] = useState(null)

  const probs = useMemo(() => softmax(RAW_LOGITS, temp), [temp])

  const BAR_MAX_H = 100
  const BAR_W = 34

  const pick = () => {
    const r = Math.random()
    let cum = 0
    for (let i = 0; i < probs.length; i++) {
      cum += probs[i]
      if (r < cum) { setPicked(i); return }
    }
    setPicked(probs.length - 1)
  }

  return (
    <div style={{
      background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)',
      borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: '1.1rem' }}>🌡️</span>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          Température LLM — distribution de probabilité
        </h4>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
        Contexte : <em>"Bonjour, je suis un…"</em> — quelle est la prochaine probabilité de chaque token ?
      </p>

      {/* Bar chart */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', justifyContent: 'center', height: BAR_MAX_H + 40, marginBottom: 16 }}>
        {probs.map((p, i) => {
          const h = Math.max(4, Math.round(p * BAR_MAX_H))
          const isPicked = picked === i
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: COLORS[i], fontWeight: 700 }}>
                {(p * 100).toFixed(1)}%
              </span>
              <div style={{
                width: BAR_W, height: h,
                background: isPicked ? '#34d399' : COLORS[i],
                borderRadius: '4px 4px 0 0',
                opacity: isPicked ? 1 : 0.75,
                transition: 'height 0.35s ease, background 0.2s',
                border: isPicked ? '2px solid #6ee7b7' : '2px solid transparent',
                boxShadow: isPicked ? '0 0 12px rgba(52,211,153,0.5)' : 'none',
              }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: BAR_W, wordBreak: 'break-word', lineHeight: 1.2 }}>
                {TOKEN_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Temperature slider */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Température (T)</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a78bfa' }}>{temp.toFixed(2)}</span>
        </div>
        <input type="range" min="0.1" max="2.5" step="0.05" value={temp}
          onChange={e => { setTemp(+e.target.value); setPicked(null) }}
          style={{ width: '100%', accentColor: '#a78bfa' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
          <span>0.1 (déterministe)</span><span>1.0 (normal)</span><span>2.5 (créatif/aléatoire)</span>
        </div>
      </div>

      {/* Sampling button */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={pick} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
          🎲 Tirer un token
        </button>
        {picked !== null && (
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
            → "{TOKEN_LABELS[picked]}" sélectionné !
          </span>
        )}
      </div>

      {/* Insight */}
      <div style={{
        fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6,
        padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, marginTop: 12,
      }}>
        {temp < 0.4 && '🥶 Froid : quasi-déterministe, le token le plus probable est toujours choisi. Peu de créativité.'}
        {temp >= 0.4 && temp <= 1.2 && '✅ Normal : bonne diversité tout en restant cohérent. Réglage par défaut.'}
        {temp > 1.2 && temp <= 1.8 && '🌶️ Chaud : réponses variées et créatives, mais parfois incohérentes.'}
        {temp > 1.8 && '🔥 Très chaud : distribution presque uniforme, le modèle "hallucine" davantage.'}
      </div>
    </div>
  )
}
