import { useEffect, useRef } from 'react'

const LAYERS = [3, 5, 4, 5, 2]
const NODE_RADIUS = 6
const W = 520
const H = 320

function buildNetwork() {
  const nodes = []
  const edges = []
  const layerX = LAYERS.map((_, i) => 60 + (i / (LAYERS.length - 1)) * (W - 120))

  LAYERS.forEach((count, li) => {
    const x = layerX[li]
    const spacing = H / (count + 1)
    for (let ni = 0; ni < count; ni++) {
      nodes.push({ id: `${li}-${ni}`, x, y: spacing * (ni + 1), layer: li })
    }
  })

  for (let li = 0; li < LAYERS.length - 1; li++) {
    const fromNodes = nodes.filter(n => n.layer === li)
    const toNodes = nodes.filter(n => n.layer === li + 1)
    fromNodes.forEach(from => {
      toNodes.forEach(to => {
        edges.push({ from, to, id: `${from.id}-${to.id}` })
      })
    })
  }

  return { nodes, edges }
}

const { nodes, edges } = buildNetwork()

export default function NeuralNetHero() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    let frame = 0
    let animId

    const pulses = []

    function spawnPulse() {
      const startLayer = 0
      const fromNodes = nodes.filter(n => n.layer === startLayer)
      const from = fromNodes[Math.floor(Math.random() * fromNodes.length)]

      const path = [from]
      let current = from
      for (let li = 1; li < LAYERS.length; li++) {
        const candidates = nodes.filter(n => n.layer === li)
        current = candidates[Math.floor(Math.random() * candidates.length)]
        path.push(current)
      }

      pulses.push({ path, t: 0, speed: 0.008 + Math.random() * 0.006, seg: 0 })
    }

    // Spawn initial pulses — store IDs so they can be cleared on unmount
    const initTimeouts = Array.from({ length: 4 }, (_, i) =>
      setTimeout(() => spawnPulse(), i * 400)
    )

    const spawnInterval = setInterval(spawnPulse, 700)

    function tick() {
      frame++

      // Update pulse positions
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.speed
        if (p.t >= 1) {
          p.t = 0
          p.seg++
          if (p.seg >= p.path.length - 1) {
            pulses.splice(i, 1)
            continue
          }
        }
      }

      // Draw pulses
      const existing = svg.querySelectorAll('.pulse-dot')
      existing.forEach(el => el.remove())

      pulses.forEach(p => {
        const from = p.path[p.seg]
        const to = p.path[p.seg + 1]
        if (!from || !to) return

        const x = from.x + (to.x - from.x) * p.t
        const y = from.y + (to.y - from.y) * p.t

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', x)
        circle.setAttribute('cy', y)
        circle.setAttribute('r', 3.5)
        circle.setAttribute('fill', '#818cf8')
        circle.setAttribute('class', 'pulse-dot')
        circle.style.filter = 'drop-shadow(0 0 4px #6366f1)'
        svg.appendChild(circle)
      })

      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(spawnInterval)
      initTimeouts.forEach(clearTimeout)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ maxWidth: W, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="node-grad-active" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
        <radialGradient id="node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e2235" />
          <stop offset="100%" stopColor="#111827" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map(e => (
        <line
          key={e.id}
          x1={e.from.x} y1={e.from.y}
          x2={e.to.x}   y2={e.to.y}
          stroke="rgba(99,102,241,0.12)"
          strokeWidth={0.8}
        />
      ))}

      {/* Layer labels */}
      {['Input', 'Hidden', 'Hidden', 'Hidden', 'Output'].map((label, li) => {
        const x = 60 + (li / (LAYERS.length - 1)) * (W - 120)
        return (
          <text
            key={li}
            x={x} y={H - 8}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(148,163,184,0.5)"
            fontFamily="monospace"
          >
            {label}
          </text>
        )
      })}

      {/* Nodes */}
      {nodes.map(n => (
        <g key={n.id}>
          <circle
            cx={n.x} cy={n.y} r={NODE_RADIUS + 3}
            fill={`${n.layer === 0 || n.layer === LAYERS.length - 1 ? '#6366f1' : '#4f46e5'}08`}
          />
          <circle
            cx={n.x} cy={n.y} r={NODE_RADIUS}
            fill="url(#node-grad)"
            stroke={n.layer === 0 || n.layer === LAYERS.length - 1 ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.25)'}
            strokeWidth={1}
          />
        </g>
      ))}
    </svg>
  )
}
