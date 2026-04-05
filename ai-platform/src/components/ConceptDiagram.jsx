/**
 * SVG concept diagrams injected into lessons.
 * Each diagram is keyed to a lesson ID.
 */

// ── Diagram: IA > ML > DL hierarchy ───────────────────────────────────────
function DiagramHierarchyIA() {
  const circles = [
    { r: 130, label: 'Intelligence Artificielle', color: '#6366f1', textY: -100 },
    { r: 88,  label: 'Machine Learning',          color: '#8b5cf6', textY: -55 },
    { r: 46,  label: 'Deep Learning',             color: '#ec4899', textY: 0   },
  ]
  return (
    <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      <defs>
        {circles.map((c, i) => (
          <radialGradient key={i} id={`hg${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={c.color} stopOpacity="0.04" />
          </radialGradient>
        ))}
      </defs>
      {circles.map((c, i) => (
        <g key={i}>
          <circle cx={150} cy={150} r={c.r} fill={`url(#hg${i})`} stroke={c.color} strokeWidth={1.2} strokeOpacity={0.4} />
          <text x={150} y={150 + c.textY} textAnchor="middle" fontSize={i === 0 ? 11 : i === 1 ? 10 : 9}
            fill={c.color} fontWeight={700} fontFamily="Inter, sans-serif">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ── Diagram: Perceptron / neurone unique ──────────────────────────────────
function DiagramPerceptron() {
  const inputs = ['x₁', 'x₂', 'x₃', 'x₄']
  const cx = 200, cy = 130, r = 28
  return (
    <svg viewBox="0 0 340 260" style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(99,102,241,0.6)" />
        </marker>
      </defs>
      {/* Inputs */}
      {inputs.map((label, i) => {
        const y = 50 + i * 54
        return (
          <g key={i}>
            <rect x={20} y={y - 14} width={36} height={28} rx={6}
              fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth={1} />
            <text x={38} y={y + 5} textAnchor="middle" fontSize={12} fill="#818cf8" fontWeight={700}>{label}</text>
            <line x1={56} y1={y} x2={cx - r} y2={cy} stroke="rgba(99,102,241,0.35)" strokeWidth={1}
              markerEnd="url(#arr)" />
            <text x={115} y={(y + cy) / 2 - 4} textAnchor="middle" fontSize={8} fill="rgba(148,163,184,0.6)">w{i + 1}</text>
          </g>
        )
      })}
      {/* Neuron */}
      <circle cx={cx} cy={cy} r={r + 4} fill="rgba(99,102,241,0.06)" />
      <circle cx={cx} cy={cy} r={r} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth={1.5} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={8} fill="#a5b4fc">Σ + f(x)</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7} fill="rgba(148,163,184,0.7)">activation</text>
      {/* Output */}
      <line x1={cx + r} y1={cy} x2={290} y2={cy} stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} markerEnd="url(#arr)" />
      <rect x={293} y={cy - 14} width={36} height={28} rx={6}
        fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth={1} />
      <text x={311} y={cy + 5} textAnchor="middle" fontSize={11} fill="#34d399" fontWeight={700}>ŷ</text>
      {/* Labels */}
      <text x={170} style={{ fontSize: 8 }} fill="rgba(148,163,184,0.5)" textAnchor="middle" y={240}>Sortie du neurone</text>
    </svg>
  )
}

// ── Diagram: Réseau de neurones (couches) ─────────────────────────────────
function DiagramNeuralNet() {
  const layers = [
    { label: 'Entrée', nodes: 3, color: '#6366f1' },
    { label: 'Cachée 1', nodes: 5, color: '#8b5cf6' },
    { label: 'Cachée 2', nodes: 4, color: '#a855f7' },
    { label: 'Sortie', nodes: 2, color: '#ec4899' },
  ]
  const W = 360, H = 260
  const lx = layers.map((_, i) => 50 + (i / (layers.length - 1)) * (W - 80))

  const allNodes = []
  layers.forEach((layer, li) => {
    const x = lx[li]
    const spacing = (H - 60) / (layer.nodes + 1)
    for (let ni = 0; ni < layer.nodes; ni++) {
      allNodes.push({ x, y: 30 + spacing * (ni + 1), li, color: layer.color })
    }
  })

  const edges = []
  for (let li = 0; li < layers.length - 1; li++) {
    const from = allNodes.filter(n => n.li === li)
    const to = allNodes.filter(n => n.li === li + 1)
    from.forEach(f => to.forEach(t => edges.push({ f, t })))
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}>
      {edges.map((e, i) => (
        <line key={i} x1={e.f.x} y1={e.f.y} x2={e.t.x} y2={e.t.y}
          stroke="rgba(99,102,241,0.1)" strokeWidth={0.8} />
      ))}
      {allNodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={7}
          fill={`${n.color}22`} stroke={n.color} strokeWidth={1.2} strokeOpacity={0.6} />
      ))}
      {layers.map((layer, li) => (
        <text key={li} x={lx[li]} y={H - 6} textAnchor="middle"
          fontSize={9} fill="rgba(148,163,184,0.55)" fontFamily="monospace">
          {layer.label}
        </text>
      ))}
    </svg>
  )
}

// ── Diagram: Gradient Descent ─────────────────────────────────────────────
function DiagramGradientDescent() {
  // Parabola-like loss curve
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59
    const y = 0.9 * (x - 0.6) ** 2 + 0.08
    return [30 + x * 280, 20 + (1 - y) * 180]
  })
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  // Gradient steps
  const steps = [0.05, 0.18, 0.31, 0.44, 0.54, 0.61]
  const getY = x => 0.9 * (x - 0.6) ** 2 + 0.08

  return (
    <svg viewBox="0 0 340 240" style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="arr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
        </marker>
        <linearGradient id="lossGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Axes */}
      <line x1={30} y1={200} x2={310} y2={200} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <line x1={30} y1={20}  x2={30}  y2={200} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text x={170} y={220} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.5)">Paramètre θ</text>
      <text x={12} y={110} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.5)" transform="rotate(-90,12,110)">Erreur L</text>
      {/* Loss curve */}
      <path d={path} fill="none" stroke="url(#lossGrad)" strokeWidth={2} />
      {/* Steps */}
      {steps.map((x, i) => {
        const px = 30 + x * 280
        const py = 20 + (1 - getY(x)) * 180
        const nx = steps[i + 1]
        if (!nx) return null
        const npx = 30 + nx * 280
        const npy = 20 + (1 - getY(nx)) * 180
        return (
          <g key={i}>
            <line x1={px} y1={py} x2={npx} y2={npy} stroke="#f87171" strokeWidth={1.5}
              strokeDasharray="3,2" markerEnd="url(#arr2)" />
            <circle cx={px} cy={py} r={4} fill="#f87171" fillOpacity={0.8} />
          </g>
        )
      })}
      {/* Minimum */}
      <circle cx={30 + 0.6 * 280} cy={20 + (1 - 0.08) * 180} r={5} fill="#34d399" />
      <text x={30 + 0.6 * 280 + 8} y={20 + (1 - 0.08) * 180 - 6} fontSize={8} fill="#34d399">min</text>
      <text x={180} y={14} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">Descente de gradient</text>
    </svg>
  )
}

// ── Diagram: Attention Transformer ────────────────────────────────────────
function DiagramAttention() {
  const tokens = ['Le', 'chat', 'mange', 'du', 'poisson']
  const n = tokens.length
  const W = 340, cellSize = 42, offsetX = 80, offsetY = 30

  // Fake attention weights (higher on diagonal + some cross-attention)
  const weights = [
    [0.7, 0.1, 0.05, 0.1, 0.05],
    [0.1, 0.6, 0.15, 0.05, 0.1],
    [0.05, 0.1, 0.5, 0.25, 0.1],
    [0.05, 0.05, 0.2, 0.55, 0.15],
    [0.05, 0.1, 0.15, 0.1, 0.6],
  ]

  return (
    <svg viewBox={`0 0 ${W} ${n * cellSize + offsetY + 60}`}
      style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      {/* Title */}
      <text x={W / 2} y={16} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Matrice d'attention (Head 1)
      </text>
      {/* Column headers */}
      {tokens.map((t, i) => (
        <text key={i} x={offsetX + i * cellSize + cellSize / 2} y={offsetY + 14}
          textAnchor="middle" fontSize={8.5} fill="#a5b4fc" fontFamily="monospace">
          {t}
        </text>
      ))}
      {/* Row headers + cells */}
      {tokens.map((t, ri) => (
        <g key={ri}>
          <text x={offsetX - 6} y={offsetY + 24 + ri * cellSize + cellSize / 2}
            textAnchor="end" fontSize={8.5} fill="#a5b4fc" fontFamily="monospace">{t}</text>
          {tokens.map((_, ci) => {
            const w = weights[ri][ci]
            return (
              <rect key={ci}
                x={offsetX + ci * cellSize + 1}
                y={offsetY + 24 + ri * cellSize + 1}
                width={cellSize - 2} height={cellSize - 2}
                rx={3}
                fill={`rgba(99,102,241,${w * 0.9 + 0.05})`}
              />
            )
          })}
        </g>
      ))}
      <text x={W / 2} y={n * cellSize + offsetY + 50}
        textAnchor="middle" fontSize={8} fill="rgba(148,163,184,0.4)">
        Plus clair = attention plus forte
      </text>
    </svg>
  )
}

// ── Diagram: Pipeline RAG ─────────────────────────────────────────────────
function DiagramRAG() {
  const steps = [
    { icon: '📄', label: 'Documents', sub: 'Sources', color: '#6366f1' },
    { icon: '✂️', label: 'Chunks', sub: 'Découpage', color: '#8b5cf6' },
    { icon: '🔢', label: 'Embeddings', sub: 'Vectorisation', color: '#a855f7' },
    { icon: '🗃️', label: 'Vector DB', sub: 'Stockage', color: '#c084fc' },
    { icon: '🔍', label: 'Retrieval', sub: 'Recherche', color: '#ec4899' },
    { icon: '🤖', label: 'LLM', sub: 'Génération', color: '#f472b6' },
  ]
  const W = 360, boxW = 48, boxH = 52, gapX = (W - steps.length * boxW) / (steps.length + 1)

  return (
    <svg viewBox={`0 0 ${W} 140`} style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="arr3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(99,102,241,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">Pipeline RAG</text>
      {steps.map((step, i) => {
        const x = gapX + i * (boxW + gapX)
        const y = 22
        return (
          <g key={i}>
            {/* Arrow */}
            {i < steps.length - 1 && (
              <line x1={x + boxW} y1={y + boxH / 2} x2={x + boxW + gapX} y2={y + boxH / 2}
                stroke="rgba(99,102,241,0.4)" strokeWidth={1.2} markerEnd="url(#arr3)" />
            )}
            {/* Box */}
            <rect x={x} y={y} width={boxW} height={boxH} rx={8}
              fill={`${step.color}18`} stroke={step.color} strokeWidth={1} strokeOpacity={0.4} />
            <text x={x + boxW / 2} y={y + 20} textAnchor="middle" fontSize={16}>{step.icon}</text>
            <text x={x + boxW / 2} y={y + boxH + 12} textAnchor="middle" fontSize={7.5}
              fill={step.color} fontWeight={700}>{step.label}</text>
            <text x={x + boxW / 2} y={y + boxH + 22} textAnchor="middle" fontSize={7}
              fill="rgba(148,163,184,0.5)">{step.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagram: Boucle Agent ─────────────────────────────────────────────────
function DiagramAgentLoop() {
  const cx = 175, cy = 100, rx = 110, ry = 65
  const nodes = [
    { angle: -90, label: 'Objectif', icon: '🎯', color: '#6366f1' },
    { angle: -10, label: 'Outils', icon: '🔧', color: '#8b5cf6' },
    { angle: 70,  label: 'Mémoire', icon: '🧠', color: '#a855f7' },
    { angle: 150, label: 'Action', icon: '⚡', color: '#ec4899' },
    { angle: 210, label: 'Réflexion', icon: '💭', color: '#f472b6' },
  ]

  const toXY = (angle, rScale = 1) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * rx * rScale,
    y: cy + Math.sin((angle * Math.PI) / 180) * ry * rScale,
  })

  return (
    <svg viewBox="0 0 350 210" style={{ width: '100%', maxWidth: 580, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="agentArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(99,102,241,0.5)" />
        </marker>
      </defs>
      <text x={cx} y={14} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">Boucle agentique</text>
      {/* Orbit ellipse */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
        stroke="rgba(99,102,241,0.12)" strokeWidth={1.5} strokeDasharray="4,3" />
      {/* LLM center */}
      <circle cx={cx} cy={cy} r={22} fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth={1.2} strokeOpacity={0.5} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={10}>🤖</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7.5} fill="#818cf8" fontWeight={700}>LLM</text>
      {/* Nodes */}
      {nodes.map((n, i) => {
        const pos = toXY(n.angle)
        const next = nodes[(i + 1) % nodes.length]
        const npos = toXY(next.angle)
        // Arrow along orbit
        const midAngle = (n.angle + next.angle) / 2
        const mid = toXY(midAngle, 1.05)
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
              stroke="rgba(99,102,241,0.15)" strokeWidth={0.8} />
            <circle cx={pos.x} cy={pos.y} r={18}
              fill={`${n.color}18`} stroke={n.color} strokeWidth={1} strokeOpacity={0.5} />
            <text x={pos.x} y={pos.y - 3} textAnchor="middle" fontSize={12}>{n.icon}</text>
            <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize={7} fill={n.color} fontWeight={700}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagram: Types de ML ──────────────────────────────────────────────────
function DiagramMLTypes() {
  const types = [
    {
      title: 'Supervisé',
      icon: '👨‍🏫',
      desc: 'Données étiquetées',
      examples: ['Classification', 'Régression'],
      color: '#6366f1',
    },
    {
      title: 'Non supervisé',
      icon: '🔍',
      desc: 'Données brutes',
      examples: ['Clustering', 'Réduction dim.'],
      color: '#8b5cf6',
    },
    {
      title: 'Renforcement',
      icon: '🎮',
      desc: 'Reward signal',
      examples: ['DQN', 'PPO'],
      color: '#ec4899',
    },
  ]

  return (
    <svg viewBox="0 0 360 170" style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}>
      <text x={180} y={14} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Types d'apprentissage automatique
      </text>
      {types.map((t, i) => {
        const x = 20 + i * 115
        const y = 22
        const w = 105, h = 130
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx={10}
              fill={`${t.color}0e`} stroke={t.color} strokeWidth={1} strokeOpacity={0.35} />
            <text x={x + w / 2} y={y + 20} textAnchor="middle" fontSize={18}>{t.icon}</text>
            <text x={x + w / 2} y={y + 38} textAnchor="middle" fontSize={9.5}
              fill={t.color} fontWeight={700}>{t.title}</text>
            <text x={x + w / 2} y={y + 52} textAnchor="middle" fontSize={8}
              fill="rgba(148,163,184,0.6)">{t.desc}</text>
            {t.examples.map((ex, ei) => (
              <g key={ei}>
                <rect x={x + 10} y={y + 62 + ei * 28} width={w - 20} height={22} rx={5}
                  fill={`${t.color}15`} />
                <text x={x + w / 2} y={y + 77 + ei * 28} textAnchor="middle"
                  fontSize={8} fill={t.color}>{ex}</text>
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagram: Embedding ────────────────────────────────────────────────────
function DiagramEmbedding() {
  const words = [
    { label: 'Roi', x: 0.8, y: 0.2, color: '#6366f1' },
    { label: 'Reine', x: 0.75, y: 0.7, color: '#8b5cf6' },
    { label: 'Homme', x: 0.3, y: 0.25, color: '#6366f1' },
    { label: 'Femme', x: 0.25, y: 0.72, color: '#8b5cf6' },
    { label: 'Chat', x: 0.2, y: 0.5, color: '#ec4899' },
    { label: 'Chien', x: 0.35, y: 0.55, color: '#ec4899' },
  ]
  const W = 320, H = 200, pad = 36

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="embArr" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(99,102,241,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Espace d'embeddings (2D projeté)
      </text>
      {/* Axes */}
      <line x1={pad} y1={H - pad + 16} x2={W - pad / 2} y2={H - pad + 16}
        stroke="rgba(255,255,255,0.1)" strokeWidth={1} markerEnd="url(#embArr)" />
      <line x1={pad} y1={H - pad + 16} x2={pad} y2={16}
        stroke="rgba(255,255,255,0.1)" strokeWidth={1} markerEnd="url(#embArr)" />
      {/* Semantic arrows */}
      {[
        ['Homme', 'Roi'], ['Femme', 'Reine'], ['Homme', 'Femme'], ['Roi', 'Reine'],
      ].map(([a, b], i) => {
        const wa = words.find(w => w.label === a)
        const wb = words.find(w => w.label === b)
        const ax = pad + wa.x * (W - pad * 2), ay = 16 + (1 - wa.y) * (H - pad * 2) + 16
        const bx = pad + wb.x * (W - pad * 2), by = 16 + (1 - wb.y) * (H - pad * 2) + 16
        return (
          <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
            stroke="rgba(99,102,241,0.2)" strokeWidth={1} strokeDasharray="3,2" />
        )
      })}
      {/* Points */}
      {words.map((w, i) => {
        const x = pad + w.x * (W - pad * 2)
        const y = 16 + (1 - w.y) * (H - pad * 2) + 16
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={5} fill={w.color} fillOpacity={0.8} />
            <text x={x + 7} y={y + 4} fontSize={9} fill={w.color} fontWeight={600}>{w.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagram: CNN (Réseau convolutif) ──────────────────────────────────────
function DiagramCNN() {
  const W = 400, H = 220
  const layers = [
    { label: 'Image\n(28×28)', type: 'input', x: 30, w: 40, h: 100, color: '#6366f1' },
    { label: 'Conv\n5×5', type: 'conv', x: 100, w: 28, h: 80, color: '#8b5cf6' },
    { label: 'Pool\n2×2', type: 'pool', x: 155, w: 20, h: 60, color: '#a855f7' },
    { label: 'Conv\n3×3', type: 'conv', x: 200, w: 24, h: 50, color: '#c084fc' },
    { label: 'Pool\n2×2', type: 'pool', x: 248, w: 16, h: 36, color: '#d946ef' },
    { label: 'Flatten', type: 'flat', x: 286, w: 12, h: 80, color: '#ec4899' },
    { label: 'FC\n128', type: 'fc', x: 316, w: 20, h: 64, color: '#f43f5e' },
    { label: 'Sortie\n10', type: 'out', x: 358, w: 16, h: 40, color: '#34d399' },
  ]
  const cy = H / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="cnnArr" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(148,163,184,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Architecture CNN — Vision par ordinateur
      </text>
      {layers.map((l, i) => {
        const x = l.x, y = cy - l.h / 2
        const next = layers[i + 1]
        return (
          <g key={i}>
            {next && (
              <line x1={x + l.w} y1={cy} x2={next.x} y2={cy}
                stroke="rgba(148,163,184,0.25)" strokeWidth={1} markerEnd="url(#cnnArr)" />
            )}
            <rect x={x} y={y} width={l.w} height={l.h} rx={3}
              fill={`${l.color}20`} stroke={l.color} strokeWidth={1} strokeOpacity={0.5} />
            {l.label.split('\n').map((line, li) => (
              <text key={li} x={x + l.w / 2} y={cy + (li - 0.5) * 10 + 4}
                textAnchor="middle" fontSize={7} fill={l.color} fontWeight={li === 0 ? 700 : 400}>
                {line}
              </text>
            ))}
            <text x={x + l.w / 2} y={H - 4} textAnchor="middle" fontSize={6.5}
              fill="rgba(148,163,184,0.4)">{l.type === 'conv' ? 'Conv' : l.type === 'pool' ? 'Pool' : ''}</text>
          </g>
        )
      })}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.45)">
        Features locales → Features globales → Classification
      </text>
    </svg>
  )
}

// ── Diagram: RNN / LSTM ───────────────────────────────────────────────────
function DiagramRNN() {
  const W = 380, H = 200
  const steps = ['t-2', 't-1', 't', 't+1']
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc']
  const bw = 60, bh = 50, gap = 75
  const startX = 30, cy = 90

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="rnnArr" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        RNN — Mémoire sur séquences temporelles
      </text>
      {steps.map((step, i) => {
        const x = startX + i * gap
        return (
          <g key={i}>
            {/* Hidden state arrow (h_t → h_{t+1}) */}
            {i < steps.length - 1 && (
              <line x1={x + bw} y1={cy} x2={x + gap} y2={cy}
                stroke={colors[i]} strokeWidth={1.5} markerEnd="url(#rnnArr)" />
            )}
            {/* Cell box */}
            <rect x={x} y={cy - bh / 2} width={bw} height={bh} rx={6}
              fill={`${colors[i]}18`} stroke={colors[i]} strokeWidth={1.2} strokeOpacity={0.6} />
            <text x={x + bw / 2} y={cy - 6} textAnchor="middle" fontSize={9} fill={colors[i]} fontWeight={700}>
              LSTM
            </text>
            <text x={x + bw / 2} y={cy + 8} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.7)">
              {step}
            </text>
            {/* Input arrow */}
            <line x1={x + bw / 2} y1={cy + bh / 2} x2={x + bw / 2} y2={cy + bh / 2 + 22}
              stroke="rgba(148,163,184,0.35)" strokeWidth={1} markerEnd="url(#rnnArr)" />
            <text x={x + bw / 2} y={cy + bh / 2 + 35} textAnchor="middle" fontSize={7} fill="rgba(148,163,184,0.55)">
              x_{step}
            </text>
            {/* Output arrow */}
            <line x1={x + bw / 2} y1={cy - bh / 2} x2={x + bw / 2} y2={cy - bh / 2 - 22}
              stroke={colors[i]} strokeWidth={1} strokeOpacity={0.5} markerEnd="url(#rnnArr)" />
            <text x={x + bw / 2} y={cy - bh / 2 - 26} textAnchor="middle" fontSize={7} fill={colors[i]}>
              h_{step}
            </text>
          </g>
        )
      })}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.45)">
        Chaque cellule reçoit x_t + état caché h_{"{t-1}"} → mémorise le contexte
      </text>
    </svg>
  )
}

// ── Diagram: Prompt Engineering chain ────────────────────────────────────
function DiagramPromptEngineering() {
  const W = 380, H = 200
  const steps = [
    { icon: '👤', label: 'Utilisateur', sub: 'Question brute', color: '#6366f1' },
    { icon: '🔧', label: 'Prompt\nEngineering', sub: 'Contexte + rôle + format', color: '#8b5cf6' },
    { icon: '🤖', label: 'LLM', sub: 'GPT-4 / Claude / Llama', color: '#a855f7' },
    { icon: '✅', label: 'Réponse\nformatée', sub: 'JSON / Markdown / Code', color: '#34d399' },
  ]
  const bw = 68, bh = 56, gap = (W - steps.length * bw) / (steps.length + 1)
  const cy = 95

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="peArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(148,163,184,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Pipeline Prompt Engineering
      </text>
      {steps.map((s, i) => {
        const x = gap + i * (bw + gap)
        return (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={x + bw} y1={cy} x2={x + bw + gap} y2={cy}
                stroke="rgba(148,163,184,0.3)" strokeWidth={1.2} markerEnd="url(#peArr)" />
            )}
            <rect x={x} y={cy - bh / 2} width={bw} height={bh} rx={8}
              fill={`${s.color}18`} stroke={s.color} strokeWidth={1} strokeOpacity={0.5} />
            <text x={x + bw / 2} y={cy - 14} textAnchor="middle" fontSize={16}>{s.icon}</text>
            {s.label.split('\n').map((line, li) => (
              <text key={li} x={x + bw / 2} y={cy + li * 11 + 3}
                textAnchor="middle" fontSize={7.5} fill={s.color} fontWeight={700}>{line}</text>
            ))}
            <text x={x + bw / 2} y={cy + bh / 2 + 14} textAnchor="middle" fontSize={6.5}
              fill="rgba(148,163,184,0.5)">{s.sub}</text>
          </g>
        )
      })}
      <rect x={gap + bw + gap / 4} y={cy - bh / 2 - 8} width={bw + gap / 2} height={bh + 16} rx={10}
        fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth={1} strokeDasharray="4,3" />
      <text x={gap + bw + gap * 0.75} y={cy - bh / 2 - 13} textAnchor="middle"
        fontSize={6.5} fill="rgba(139,92,246,0.5)">à maîtriser</text>
    </svg>
  )
}

// ── Diagram: Architecture MCP ─────────────────────────────────────────────
function DiagramMCP() {
  const W = 380, H = 220
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="mcpArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(148,163,184,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={14} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.6)">
        Model Context Protocol (MCP) — Architecture
      </text>

      {/* Host box */}
      <rect x={20} y={30} width={100} height={70} rx={10}
        fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth={1} strokeOpacity={0.5} />
      <text x={70} y={52} textAnchor="middle" fontSize={9} fill="#818cf8" fontWeight={700}>🖥️ Host</text>
      <text x={70} y={65} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.7)">Claude Desktop</text>
      <text x={70} y={77} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.7)">VS Code + Copilot</text>
      <text x={70} y={89} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.7)">App custom</text>

      {/* Client box */}
      <rect x={140} y={40} width={90} height={50} rx={10}
        fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth={1} strokeOpacity={0.5} />
      <text x={185} y={62} textAnchor="middle" fontSize={9} fill="#a78bfa" fontWeight={700}>🔌 MCP Client</text>
      <text x={185} y={76} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.6)">Protocole JSON-RPC</text>

      {/* Server boxes */}
      {[
        { label: '📂 Filesystem', sub: 'lecture/écriture', y: 30, color: '#10b981' },
        { label: '🔍 Web Search', sub: 'Brave / Tavily', y: 85, color: '#f59e0b' },
        { label: '🗄️ Database', sub: 'PostgreSQL / SQLite', y: 140, color: '#ec4899' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={255} y={s.y} width={105} height={44} rx={8}
            fill={`${s.color}12`} stroke={s.color} strokeWidth={1} strokeOpacity={0.45} />
          <text x={307} y={s.y + 17} textAnchor="middle" fontSize={8} fill={s.color} fontWeight={700}>{s.label}</text>
          <text x={307} y={s.y + 30} textAnchor="middle" fontSize={7} fill="rgba(148,163,184,0.55)">{s.sub}</text>
          <line x1={230} y1={65} x2={255} y2={s.y + 22}
            stroke="rgba(148,163,184,0.2)" strokeWidth={1} markerEnd="url(#mcpArr)" />
        </g>
      ))}

      {/* LLM box */}
      <rect x={20} y={115} width={100} height={44} rx={10}
        fill="rgba(236,72,153,0.1)" stroke="#ec4899" strokeWidth={1} strokeOpacity={0.4} />
      <text x={70} y={134} textAnchor="middle" fontSize={9} fill="#f472b6" fontWeight={700}>🤖 LLM</text>
      <text x={70} y={148} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.6)">Claude / GPT-4</text>

      {/* Arrows */}
      <line x1={120} y1={65} x2={140} y2={65} stroke="rgba(99,102,241,0.5)" strokeWidth={1.2} markerEnd="url(#mcpArr)" />
      <line x1={70} y1={100} x2={70} y2={115} stroke="rgba(236,72,153,0.4)" strokeWidth={1} markerEnd="url(#mcpArr)" />

      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={7.5} fill="rgba(148,163,184,0.4)">
        Le LLM appelle des outils externes via MCP pour enrichir ses réponses
      </text>
    </svg>
  )
}

// ── Registry: lessonId → component ────────────────────────────────────────
const DIAGRAMS = {
  '1-1': DiagramHierarchyIA,
  '2-1': DiagramMLTypes,
  '1-4': DiagramGradientDescent,
  '3-1': DiagramPerceptron,
  '3-2': DiagramNeuralNet,
  '3-4': DiagramCNN,
  '4-1': DiagramRNN,
  '5-2': DiagramEmbedding,
  '6-1': DiagramAttention,
  '7-1': DiagramPromptEngineering,
  '8-1': DiagramRAG,
  '9-1': DiagramAgentLoop,
  '10-1': DiagramMCP,
}

export function getLessonDiagram(lessonId) {
  return DIAGRAMS[lessonId] || null
}

export default function ConceptDiagram({ lessonId }) {
  const Diagram = DIAGRAMS[lessonId]
  if (!Diagram) return null

  return (
    <div style={{
      background: 'rgba(10,14,30,0.8)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 16,
      padding: '20px 16px 12px',
      margin: '28px 0',
      textAlign: 'center',
    }}>
      <Diagram />
      <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.5)', marginTop: 10 }}>
        Illustration du concept — non exhaustive
      </div>
    </div>
  )
}
