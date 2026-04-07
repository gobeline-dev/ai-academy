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
  const W = 560, H = 240
  const stages = [
    { icon: '🖼️', title: 'Image',      sub: '28×28 px',   detail: 'Entrée brute',           color: '#6366f1' },
    { icon: '🔍', title: 'Convolution', sub: 'Filtres 3×3', detail: 'Détecte bords & textures', color: '#8b5cf6' },
    { icon: '⬇️', title: 'Pooling',     sub: 'Max 2×2',    detail: 'Résolution ÷ 2',          color: '#a855f7' },
    { icon: '🧠', title: 'FC + Sortie', sub: '128 → 10',   detail: 'Classification finale',   color: '#34d399' },
  ]
  const pad = 16, bw = (W - pad * 2 - 30 * (stages.length - 1)) / stages.length
  const bh = 120, cy = 50, arrowGap = 30

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="cnnArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Architecture CNN — Vision par ordinateur
      </text>
      {stages.map((s, i) => {
        const x = pad + i * (bw + arrowGap)
        const nextX = pad + (i + 1) * (bw + arrowGap)
        return (
          <g key={i}>
            {i < stages.length - 1 && (
              <line x1={x + bw} y1={cy + bh / 2} x2={nextX} y2={cy + bh / 2}
                stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#cnnArr)" />
            )}
            <rect x={x} y={cy} width={bw} height={bh} rx={10}
              fill={`${s.color}18`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={x + bw / 2} y={cy + 24} textAnchor="middle" fontSize={20}>{s.icon}</text>
            <text x={x + bw / 2} y={cy + 48} textAnchor="middle" fontSize={12} fill={s.color} fontWeight={700}>
              {s.title}
            </text>
            <text x={x + bw / 2} y={cy + 65} textAnchor="middle" fontSize={10} fill={s.color} fillOpacity={0.8}>
              {s.sub}
            </text>
            <text x={x + bw / 2} y={cy + 82} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.7)">
              {s.detail}
            </text>
          </g>
        )
      })}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={11} fill="rgba(148,163,184,0.5)">
        Features locales → Features globales → Classification
      </text>
    </svg>
  )
}

// ── Diagram: RNN / LSTM ───────────────────────────────────────────────────
function DiagramRNN() {
  const W = 560, H = 260
  const steps = [
    { t: 't−1', x: 'x₁', h: 'h₁', word: '"Le"' },
    { t: 't',   x: 'x₂', h: 'h₂', word: '"chat"' },
    { t: 't+1', x: 'x₃', h: 'h₃', word: '"mange"' },
  ]
  const bw = 110, bh = 70, gap = 60
  const startX = 40, cy = 120
  const color = '#8b5cf6'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="rnnArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
        <marker id="rnnArrGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        RNN / LSTM — Mémoire sur séquence temporelle
      </text>
      {steps.map((s, i) => {
        const x = startX + i * (bw + gap)
        return (
          <g key={i}>
            {/* État caché horizontal */}
            {i < steps.length - 1 && (
              <line x1={x + bw} y1={cy} x2={x + bw + gap} y2={cy}
                stroke={color} strokeWidth={2} markerEnd="url(#rnnArr)" />
            )}
            {/* Boîte LSTM */}
            <rect x={x} y={cy - bh / 2} width={bw} height={bh} rx={10}
              fill={`${color}18`} stroke={color} strokeWidth={1.5} strokeOpacity={0.7} />
            <text x={x + bw / 2} y={cy - 10} textAnchor="middle" fontSize={14} fill={color} fontWeight={700}>
              LSTM
            </text>
            <text x={x + bw / 2} y={cy + 8} textAnchor="middle" fontSize={12} fill="rgba(148,163,184,0.8)">
              {s.t}
            </text>
            <text x={x + bw / 2} y={cy + 24} textAnchor="middle" fontSize={11} fill="rgba(148,163,184,0.6)">
              {s.word}
            </text>
            {/* Entrée x_t */}
            <line x1={x + bw / 2} y1={cy + bh / 2} x2={x + bw / 2} y2={cy + bh / 2 + 30}
              stroke="rgba(148,163,184,0.4)" strokeWidth={1.5} markerEnd="url(#rnnArrGray)" />
            <text x={x + bw / 2} y={cy + bh / 2 + 47} textAnchor="middle" fontSize={12}
              fill="rgba(148,163,184,0.7)">{s.x}</text>
            {/* Sortie h_t */}
            <line x1={x + bw / 2} y1={cy - bh / 2 - 30} x2={x + bw / 2} y2={cy - bh / 2}
              stroke={color} strokeWidth={1.5} strokeOpacity={0.6} markerEnd="url(#rnnArr)" />
            <text x={x + bw / 2} y={cy - bh / 2 - 35} textAnchor="middle" fontSize={12} fill={color}>
              {s.h}
            </text>
          </g>
        )
      })}
      {/* Légende */}
      <text x={W / 2} y={H - 25} textAnchor="middle" fontSize={11} fill={color} fontWeight={600}>
        → État caché h (mémoire du contexte précédent)
      </text>
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.55)">
        Chaque cellule lit le mot courant + se souvient des mots précédents
      </text>
    </svg>
  )
}

// ── Diagram: Prompt Engineering chain ────────────────────────────────────
function DiagramPromptEngineering() {
  const W = 560, H = 240
  const steps = [
    { icon: '👤', title: 'Utilisateur', sub: 'Question brute', color: '#6366f1' },
    { icon: '🔧', title: 'Prompt', sub: 'Rôle + contexte\n+ format attendu', color: '#8b5cf6' },
    { icon: '🤖', title: 'LLM', sub: 'Claude / GPT-4\n/ Llama', color: '#a855f7' },
    { icon: '✅', title: 'Réponse', sub: 'JSON / Markdown\n/ Code', color: '#34d399' },
  ]
  const bw = 100, bh = 110, gap = (W - steps.length * bw) / (steps.length + 1)
  const cy = 60

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="peArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Pipeline Prompt Engineering
      </text>
      {steps.map((s, i) => {
        const x = gap + i * (bw + gap)
        return (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={x + bw} y1={cy + bh / 2} x2={x + bw + gap} y2={cy + bh / 2}
                stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#peArr)" />
            )}
            <rect x={x} y={cy} width={bw} height={bh} rx={10}
              fill={`${s.color}18`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={x + bw / 2} y={cy + 26} textAnchor="middle" fontSize={22}>{s.icon}</text>
            <text x={x + bw / 2} y={cy + 50} textAnchor="middle" fontSize={13} fill={s.color} fontWeight={700}>
              {s.title}
            </text>
            {s.sub.split('\n').map((line, li) => (
              <text key={li} x={x + bw / 2} y={cy + 68 + li * 16}
                textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.75)">{line}</text>
            ))}
          </g>
        )
      })}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={11} fill="rgba(148,163,184,0.5)">
        Le prompt est une interface de programmation en langage naturel
      </text>
    </svg>
  )
}

// ── Diagram: Architecture MCP ─────────────────────────────────────────────
function DiagramMCP() {
  const W = 560, H = 280
  const servers = [
    { icon: '📂', title: 'Filesystem', sub: 'Lire / écrire des fichiers', color: '#10b981' },
    { icon: '🔍', title: 'Web Search', sub: 'Brave, Tavily, DuckDuckGo', color: '#f59e0b' },
    { icon: '🗄️', title: 'Database', sub: 'PostgreSQL, SQLite', color: '#ec4899' },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="mcpArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.45)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Model Context Protocol (MCP) — Architecture
      </text>

      {/* LLM + Host (gauche) */}
      <rect x={20} y={35} width={130} height={100} rx={12}
        fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth={1.5} strokeOpacity={0.6} />
      <text x={85} y={58} textAnchor="middle" fontSize={16}>🖥️</text>
      <text x={85} y={76} textAnchor="middle" fontSize={13} fill="#818cf8" fontWeight={700}>Host App</text>
      <text x={85} y={93} textAnchor="middle" fontSize={10.5} fill="rgba(148,163,184,0.7)">Claude Desktop</text>
      <text x={85} y={108} textAnchor="middle" fontSize={10.5} fill="rgba(148,163,184,0.7)">VS Code / App custom</text>

      <rect x={20} y={150} width={130} height={60} rx={12}
        fill="rgba(236,72,153,0.1)" stroke="#ec4899" strokeWidth={1.5} strokeOpacity={0.5} />
      <text x={85} y={173} textAnchor="middle" fontSize={16}>🤖</text>
      <text x={85} y={192} textAnchor="middle" fontSize={13} fill="#f472b6" fontWeight={700}>LLM</text>
      <text x={85} y={207} textAnchor="middle" fontSize={10.5} fill="rgba(148,163,184,0.6)">Claude / GPT-4</text>

      <line x1={85} y1={135} x2={85} y2={150} stroke="rgba(236,72,153,0.5)" strokeWidth={1.5} markerEnd="url(#mcpArr)" />

      {/* MCP Client (milieu) */}
      <rect x={185} y={85} width={130} height={60} rx={12}
        fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth={1.5} strokeOpacity={0.6} />
      <text x={250} y={108} textAnchor="middle" fontSize={16}>🔌</text>
      <text x={250} y={127} textAnchor="middle" fontSize={13} fill="#a78bfa" fontWeight={700}>MCP Client</text>
      <text x={250} y={142} textAnchor="middle" fontSize={10.5} fill="rgba(148,163,184,0.6)">JSON-RPC 2.0</text>

      <line x1={150} y1={115} x2={185} y2={115} stroke="rgba(99,102,241,0.5)" strokeWidth={1.5} markerEnd="url(#mcpArr)" />

      {/* Serveurs MCP (droite) */}
      {servers.map((s, i) => {
        const sy = 35 + i * 75
        return (
          <g key={i}>
            <rect x={360} y={sy} width={175} height={58} rx={10}
              fill={`${s.color}14`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.5} />
            <text x={370} y={sy + 23} fontSize={18}>{s.icon}</text>
            <text x={400} y={sy + 22} fontSize={13} fill={s.color} fontWeight={700}>{s.title}</text>
            <text x={400} y={sy + 39} fontSize={10} fill="rgba(148,163,184,0.7)">{s.sub}</text>
            <line x1={315} y1={115} x2={360} y2={sy + 29}
              stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} markerEnd="url(#mcpArr)" />
          </g>
        )
      })}

      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={11} fill="rgba(148,163,184,0.5)">
        MCP standardise la communication LLM ↔ outils — comme un USB-C pour l'IA
      </text>
    </svg>
  )
}

// ── Diagram: Statistiques — Distribution normale ──────────────────────────
function DiagramStats() {
  const W = 540, H = 220
  const PL = 44, PR = 20, PT = 28, PB = 48
  const IW = W - PL - PR, IH = H - PT - PB
  const bell = x => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
  const MAX_Y = bell(0)
  const tx = x => PL + ((x + 3.5) / 7) * IW
  const ty = y => PT + (1 - y / (MAX_Y * 1.08)) * IH

  const pts = (a, b) => {
    const arr = []
    for (let x = a; x <= b; x += 0.06) arr.push([tx(x), ty(bell(x))])
    return arr
  }
  const toPath = (a, b) => {
    const p = pts(a, b)
    return p.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
      + ` L${tx(b).toFixed(1)},${ty(0)} L${tx(a).toFixed(1)},${ty(0)} Z`
  }
  const curvePts = pts(-3.5, 3.5).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="stArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Distribution normale (courbe en cloche) — Notes d'un examen
      </text>
      {/* Axes */}
      <line x1={PL} y1={PT + IH} x2={PL + IW} y2={PT + IH} stroke="rgba(255,255,255,0.15)" strokeWidth={1} markerEnd="url(#stArr)" />
      <line x1={PL} y1={PT + IH} x2={PL} y2={PT} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text x={PL + IW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">Score (μ=70, σ=10)</text>
      <text x={8} y={PT + IH / 2 + 4} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.4)" transform={`rotate(-90,8,${PT + IH / 2})`}>Fréquence</text>
      {/* Zones colorées */}
      <path d={toPath(-2, 2)} fill="rgba(99,102,241,0.18)" />
      <path d={toPath(-1, 1)} fill="rgba(99,102,241,0.28)" />
      {/* Courbe */}
      <polyline points={curvePts} fill="none" stroke="#818cf8" strokeWidth={2.5} />
      {/* Lignes μ, σ */}
      {[-2, -1, 0, 1, 2].map(v => (
        <line key={v} x1={tx(v)} y1={PT} x2={tx(v)} y2={PT + IH}
          stroke={v === 0 ? 'rgba(52,211,153,0.6)' : 'rgba(255,255,255,0.08)'} strokeWidth={v === 0 ? 1.5 : 1} strokeDasharray={v === 0 ? '4,3' : '3,3'} />
      ))}
      {/* Labels axe x */}
      {[[-2, '50'], [-1, '60'], [0, '70 (μ)'], [1, '80'], [2, '90']].map(([v, lbl]) => (
        <text key={v} x={tx(v)} y={PT + IH + 16} textAnchor="middle" fontSize={9} fill={v === 0 ? '#6ee7b7' : 'rgba(148,163,184,0.6)'}>{lbl}</text>
      ))}
      {/* Annotations zones */}
      <text x={tx(0)} y={ty(bell(0)) - 8} textAnchor="middle" fontSize={11} fill="#6ee7b7" fontWeight={700}>μ</text>
      <text x={tx(0.5)} y={ty(0.15)} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.8)" fontWeight={600}>68%</text>
      <text x={tx(0)} y={ty(0.03)} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.55)">95%</text>
      {/* Accolade μ ± σ */}
      <text x={tx(-1) - 4} y={PT + IH + 30} textAnchor="middle" fontSize={9} fill="#a5b4fc">μ−σ</text>
      <text x={tx(1) + 4} y={PT + IH + 30} textAnchor="middle" fontSize={9} fill="#a5b4fc">μ+σ</text>
      <text x={tx(-2) - 4} y={PT + IH + 30} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.45)">μ−2σ</text>
      <text x={tx(2) + 4} y={PT + IH + 30} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.45)">μ+2σ</text>
    </svg>
  )
}

// ── Diagram: Train / Val / Test split ─────────────────────────────────────
function DiagramTrainValTest() {
  const W = 560, H = 200
  const bx = 30, by = 60, bw = 500, bh = 52
  const splits = [
    { pct: 0.70, label: '70% — Entraînement', sub: 'Ajuste les poids (W)', color: '#6366f1' },
    { pct: 0.15, label: '15% — Validation', sub: 'Règle les hyperparamètres', color: '#f59e0b' },
    { pct: 0.15, label: '15% — Test', sub: 'Évaluation finale (1×)', color: '#10b981' },
  ]
  let cx = bx
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={20} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Découpage du jeu de données — règle d'or
      </text>
      <text x={W / 2} y={37} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.45)">
        Exemple : 10 000 exemples de maisons → 7 000 train, 1 500 val, 1 500 test
      </text>
      {splits.map((s, i) => {
        const sw = bw * s.pct
        const rx = cx
        cx += sw
        return (
          <g key={i}>
            <rect x={rx} y={by} width={sw} height={bh} fill={`${s.color}22`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.6} rx={i === 0 ? 8 : i === 2 ? 8 : 0} style={{ borderRadius: 0 }} />
            <text x={rx + sw / 2} y={by + 22} textAnchor="middle" fontSize={s.pct > 0.2 ? 11 : 9} fill={s.color} fontWeight={700}>{s.label}</text>
            <text x={rx + sw / 2} y={by + 38} textAnchor="middle" fontSize={s.pct > 0.2 ? 9 : 8} fill="rgba(148,163,184,0.7)">{s.sub}</text>
          </g>
        )
      })}
      {/* Légende bonne pratique */}
      <text x={W / 2} y={135} textAnchor="middle" fontSize={10.5} fill="#f87171" fontWeight={600}>
        ⚠️ Le jeu de test ne doit JAMAIS être vu pendant l'entraînement ou le tuning
      </text>
      <text x={W / 2} y={153} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.55)">
        Le regarder "trop tôt" → data leakage → métriques optimistes → surprises en production
      </text>
      {/* Flèche validation loop */}
      <path d={`M ${bx + bw * 0.7 + bw * 0.075} ${by + bh} q 0 20 -${bw * 0.225} 0`}
        fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth={1.2} strokeDasharray="3,2" />
      <text x={bx + bw * 0.7 + bw * 0.075 - bw * 0.115} y={by + bh + 30} textAnchor="middle" fontSize={9} fill="rgba(245,158,11,0.7)">
        boucle d'optimisation
      </text>
    </svg>
  )
}

// ── Diagram: Overfitting / Underfitting ───────────────────────────────────
function DiagramOverfitting() {
  const W = 560, H = 240
  const PL = 44, PR = 20, PT = 28, PB = 44
  const IW = W - PL - PR, IH = H - PT - PB
  const tx = x => PL + x * IW
  const ty = y => PT + (1 - y) * IH

  // Training error: always decreasing
  const trainPts = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59
    const y = 0.8 * Math.exp(-4 * x) + 0.05
    return `${tx(x).toFixed(1)},${ty(y).toFixed(1)}`
  })
  // Validation error: U-shape
  const valPts = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59
    const y = 0.55 * (x - 0.38) ** 2 + 0.15
    return `${tx(x).toFixed(1)},${ty(y).toFixed(1)}`
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="ofArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(148,163,184,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Underfitting · Bonne généralisation · Overfitting
      </text>
      {/* Zones */}
      <rect x={PL} y={PT} width={IW * 0.28} height={IH} fill="rgba(239,68,68,0.05)" />
      <rect x={PL + IW * 0.28} y={PT} width={IW * 0.44} height={IH} fill="rgba(52,211,153,0.05)" />
      <rect x={PL + IW * 0.72} y={PT} width={IW * 0.28} height={IH} fill="rgba(245,158,11,0.06)" />
      {/* Zone labels */}
      <text x={PL + IW * 0.14} y={PT + 14} textAnchor="middle" fontSize={10} fill="#f87171" fontWeight={600}>Sous-apprentissage</text>
      <text x={PL + IW * 0.5} y={PT + 14} textAnchor="middle" fontSize={10} fill="#34d399" fontWeight={600}>Bonne généralisation ✓</text>
      <text x={PL + IW * 0.86} y={PT + 14} textAnchor="middle" fontSize={10} fill="#fbbf24" fontWeight={600}>Surapprentissage</text>
      {/* Axes */}
      <line x1={PL} y1={PT + IH} x2={PL + IW + 8} y2={PT + IH} stroke="rgba(255,255,255,0.12)" strokeWidth={1} markerEnd="url(#ofArr)" />
      <line x1={PL} y1={PT + IH} x2={PL} y2={PT - 4} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text x={PL + IW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">Complexité du modèle →</text>
      <text x={8} y={PT + IH / 2 + 4} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.4)" transform={`rotate(-90,8,${PT + IH / 2})`}>Erreur</text>
      {/* Courbes */}
      <polyline points={trainPts.join(' ')} fill="none" stroke="#6366f1" strokeWidth={2.5} />
      <polyline points={valPts.join(' ')} fill="none" stroke="#f97316" strokeWidth={2.5} strokeDasharray="6,3" />
      {/* Légende */}
      <rect x={PL + 10} y={PT + IH - 36} width={12} height={3} fill="#6366f1" />
      <text x={PL + 26} y={PT + IH - 31} fontSize={10} fill="#818cf8">Erreur entraînement</text>
      <rect x={PL + 10} y={PT + IH - 20} width={12} height={3} fill="#f97316" />
      <text x={PL + 26} y={PT + IH - 15} fontSize={10} fill="#fb923c">Erreur validation (généralisation)</text>
      {/* Sweet spot */}
      <line x1={PL + IW * 0.38} y1={PT + 20} x2={PL + IW * 0.38} y2={PT + IH}
        stroke="rgba(52,211,153,0.5)" strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={PL + IW * 0.38} y={PT + IH + 16} textAnchor="middle" fontSize={9} fill="#34d399">↑ sweet spot</text>
    </svg>
  )
}

// ── Diagram: Régression linéaire & logistique ─────────────────────────────
function DiagramRegression() {
  const W = 560, H = 220
  // Left: linear regression
  const pts = [
    [0.1, 0.15], [0.18, 0.22], [0.25, 0.28], [0.30, 0.35], [0.38, 0.38],
    [0.45, 0.50], [0.52, 0.55], [0.60, 0.62], [0.68, 0.70], [0.75, 0.78],
  ]
  const lx = (x, offset = 0) => 24 + offset + x * 210
  const ly = y => 30 + (1 - y) * 150
  // Right: logistic / S-curve
  const sigmoid = x => 1 / (1 + Math.exp(-x))
  const rx = (x, offset = 290) => offset + x * 220
  const ry = y => 30 + (1 - y) * 150

  const sCurvePts = Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * 8 - 4
    return `${rx((x + 4) / 8).toFixed(1)},${ry(sigmoid(x)).toFixed(1)}`
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={15} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Régression linéaire (gauche) · Régression logistique (droite)
      </text>
      {/* GAUCHE: Linear regression */}
      <text x={129} y={195} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">Surface → Prix (k€)</text>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={lx(x)} cy={ly(y)} r={4} fill="rgba(99,102,241,0.7)" />
      ))}
      {/* Regression line */}
      <line x1={lx(0.05)} y1={ly(0.08)} x2={lx(0.8)} y2={ly(0.83)} stroke="#34d399" strokeWidth={2.5} />
      <line x1={24} y1={180} x2={234} y2={180} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <line x1={24} y1={30} x2={24} y2={180} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text x={24} y={192} fontSize={8} fill="rgba(148,163,184,0.4)">40m²</text>
      <text x={194} y={192} fontSize={8} fill="rgba(148,163,184,0.4)">150m²</text>
      <text x={10} y={180} fontSize={8} fill="rgba(148,163,184,0.4)" textAnchor="end">100</text>
      <text x={10} y={35} fontSize={8} fill="rgba(148,163,184,0.4)" textAnchor="end">500</text>

      {/* Séparateur */}
      <line x1={265} y1={25} x2={265} y2={195} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

      {/* DROITE: Logistic */}
      <text x={400} y={195} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">Score d'email → Spam (oui/non)</text>
      <line x1={290} y1={180} x2={510} y2={180} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <line x1={290} y1={30} x2={290} y2={180} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      {/* Frontière de décision */}
      <line x1={rx(0.5)} y1={30} x2={rx(0.5)} y2={180} stroke="rgba(245,158,11,0.3)" strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={rx(0.5) + 4} y={50} fontSize={8} fill="#fbbf24">⟵ pas spam  spam ⟶</text>
      {/* S-curve */}
      <polyline points={sCurvePts} fill="none" stroke="#f472b6" strokeWidth={2.5} />
      {/* Points positifs/négatifs */}
      {[[0.05, 0], [0.1, 0], [0.2, 0], [0.3, 0.05], [0.7, 0.95], [0.8, 1], [0.9, 1], [0.95, 1]].map(([x, y], i) => (
        <circle key={i} cx={rx(x)} cy={ry(y > 0.5 ? 1 : 0)} r={4}
          fill={y > 0.5 ? 'rgba(244,114,182,0.8)' : 'rgba(99,102,241,0.8)'} />
      ))}
      <text x={290} y={192} fontSize={8} fill="rgba(148,163,184,0.4)">faible</text>
      <text x={490} y={192} fontSize={8} fill="rgba(148,163,184,0.4)">élevé</text>
      <text x={278} y={180} fontSize={8} fill="rgba(148,163,184,0.4)" textAnchor="end">0%</text>
      <text x={278} y={35} fontSize={8} fill="rgba(148,163,184,0.4)" textAnchor="end">100%</text>
    </svg>
  )
}

// ── Diagram: Arbre de décision ────────────────────────────────────────────
function DiagramDecisionTree() {
  const W = 560, H = 280
  const nodes = [
    { id: 0, x: 280, y: 35, label: 'Surface > 80m² ?', color: '#6366f1', root: true },
    { id: 1, x: 150, y: 100, label: 'Étage > 3 ?', color: '#8b5cf6' },
    { id: 2, x: 410, y: 100, label: 'Quartier = Centre ?', color: '#8b5cf6' },
    { id: 3, x: 80,  y: 170, label: '🏚️ 180k€', color: '#ef4444', leaf: true },
    { id: 4, x: 220, y: 170, label: '🏠 260k€', color: '#10b981', leaf: true },
    { id: 5, x: 340, y: 170, label: '🏠 310k€', color: '#10b981', leaf: true },
    { id: 6, x: 480, y: 170, label: '🏙️ 420k€', color: '#10b981', leaf: true },
  ]
  const edges = [
    { from: 0, to: 1, label: 'Non' }, { from: 0, to: 2, label: 'Oui' },
    { from: 1, to: 3, label: 'Non' }, { from: 1, to: 4, label: 'Oui' },
    { from: 2, to: 5, label: 'Non' }, { from: 2, to: 6, label: 'Oui' },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={16} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Arbre de décision — Prédire le prix d'une maison
      </text>
      {edges.map((e, i) => {
        const n1 = nodes[e.from], n2 = nodes[e.to]
        const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2
        return (
          <g key={i}>
            <line x1={n1.x} y1={n1.y + 14} x2={n2.x} y2={n2.y - 14}
              stroke="rgba(99,102,241,0.35)" strokeWidth={1.5} />
            <text x={mx} y={my} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.7)">{e.label}</text>
          </g>
        )
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <rect x={n.x - (n.root ? 72 : n.leaf ? 44 : 64)} y={n.y - 14} width={n.root ? 144 : n.leaf ? 88 : 128} height={28} rx={n.leaf ? 14 : 8}
            fill={`${n.color}20`} stroke={n.color} strokeWidth={1.5} strokeOpacity={0.7} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={n.leaf ? 11 : 9.5} fill={n.color} fontWeight={600}>{n.label}</text>
        </g>
      ))}
      {/* Random Forest legend */}
      <rect x={30} y={210} width={500} height={55} rx={10} fill="rgba(139,92,246,0.07)" stroke="rgba(139,92,246,0.25)" strokeWidth={1} />
      <text x={280} y={228} textAnchor="middle" fontSize={11} fill="#a78bfa" fontWeight={700}>🌲 Random Forest = 100+ arbres de ce type, chacun entraîné sur un sous-ensemble aléatoire des données</text>
      <text x={280} y={246} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.7)">Vote majoritaire sur tous les arbres → moins d'overfitting, plus robuste qu'un seul arbre</text>
      <text x={280} y={260} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.55)">Exemple : 70 arbres prédisent 300k€, 30 prédisent 320k€ → prédiction finale = 300k€</text>
    </svg>
  )
}

// ── Diagram: Clustering K-Means ───────────────────────────────────────────
function DiagramClustering() {
  const W = 540, H = 240
  const PL = 30, PT = 28, IW = 480, IH = 180
  const clusters = [
    { cx: 0.25, cy: 0.7, color: '#6366f1', label: 'Cluster A', points: [[0.15, 0.75], [0.22, 0.62], [0.30, 0.68], [0.18, 0.55], [0.28, 0.80], [0.35, 0.73]] },
    { cx: 0.55, cy: 0.3, color: '#ec4899', label: 'Cluster B', points: [[0.45, 0.25], [0.52, 0.40], [0.60, 0.28], [0.48, 0.18], [0.62, 0.38], [0.57, 0.22]] },
    { cx: 0.78, cy: 0.65, color: '#10b981', label: 'Cluster C', points: [[0.70, 0.72], [0.78, 0.58], [0.85, 0.70], [0.72, 0.60], [0.83, 0.62], [0.76, 0.80]] },
  ]
  const px = x => PL + x * IW
  const py = y => PT + (1 - y) * IH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        K-Means clustering (k=3) — Segmentation clients
      </text>
      {/* Axes */}
      <line x1={PL} y1={PT + IH} x2={PL + IW} y2={PT + IH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <line x1={PL} y1={PT} x2={PL} y2={PT + IH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text x={PL + IW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.4)">Revenu annuel →</text>
      <text x={8} y={PT + IH / 2 + 4} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.4)" transform={`rotate(-90,8,${PT + IH / 2})`}>Fréquence d'achat</text>
      {clusters.map((c, ci) => (
        <g key={ci}>
          {/* Points */}
          {c.points.map(([x, y], pi) => (
            <circle key={pi} cx={px(x)} cy={py(y)} r={5} fill={c.color} fillOpacity={0.7} />
          ))}
          {/* Centroid */}
          <circle cx={px(c.cx)} cy={py(c.cy)} r={10} fill="none" stroke={c.color} strokeWidth={2.5} />
          <text x={px(c.cx)} y={py(c.cy) + 4} textAnchor="middle" fontSize={13} fill={c.color}>✦</text>
          {/* Lines to centroid */}
          {c.points.map(([x, y], pi) => (
            <line key={pi} x1={px(x)} y1={py(y)} x2={px(c.cx)} y2={py(c.cy)}
              stroke={c.color} strokeWidth={0.8} strokeOpacity={0.3} strokeDasharray="3,2" />
          ))}
          {/* Label */}
          <text x={px(c.cx)} y={py(c.cy) + 26} textAnchor="middle" fontSize={10} fill={c.color} fontWeight={600}>{c.label}</text>
        </g>
      ))}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9.5} fill="rgba(148,163,184,0.5)">
        ✦ = centroïde (barycentre du cluster). L'algorithme itère : assigner les points → recalculer les centroïdes → répéter
      </text>
    </svg>
  )
}

// ── Diagram: Fonctions d'activation ──────────────────────────────────────
function DiagramActivation() {
  const W = 560, H = 210
  const funcs = [
    {
      name: 'ReLU', key: 'relu', color: '#6366f1',
      fn: x => Math.max(0, x),
      desc: 'max(0, x)',
      note: 'La + utilisée\ndans les couches cachées',
      xRange: [-2.5, 2.5], yRange: [-0.2, 2.5],
    },
    {
      name: 'Sigmoid', key: 'sig', color: '#ec4899',
      fn: x => 1 / (1 + Math.exp(-x)),
      desc: '1 / (1+e⁻ˣ)',
      note: 'Sortie entre 0 et 1\nClassification binaire',
      xRange: [-5, 5], yRange: [-0.1, 1.1],
    },
    {
      name: 'Tanh', key: 'tanh', color: '#10b981',
      fn: x => Math.tanh(x),
      desc: '(eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)',
      note: 'Sortie entre −1 et +1\nRNN / LSTM',
      xRange: [-3, 3], yRange: [-1.2, 1.2],
    },
  ]
  const slotW = W / 3, slotH = 160, PT = 28, PB = 20, PL = 14, PR = 14

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={16} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Fonctions d'activation — transformer les scores bruts des neurones
      </text>
      {funcs.map((f, fi) => {
        const ox = fi * slotW + PL
        const iw = slotW - PL - PR
        const ih = slotH - PT - PB
        const [xMin, xMax] = f.xRange
        const [yMin, yMax] = f.yRange
        const tx = x => ox + ((x - xMin) / (xMax - xMin)) * iw
        const ty = y => PT + (1 - (y - yMin) / (yMax - yMin)) * ih
        const zero_y = ty(0), zero_x = tx(0)

        const curvePts = Array.from({ length: 50 }, (_, i) => {
          const x = xMin + (i / 49) * (xMax - xMin)
          return `${tx(x).toFixed(1)},${ty(f.fn(x)).toFixed(1)}`
        }).join(' ')

        return (
          <g key={fi}>
            {/* Background */}
            <rect x={ox - 2} y={PT - 4} width={iw + 4} height={ih + 8} rx={6}
              fill={`${f.color}08`} stroke={f.color} strokeWidth={1} strokeOpacity={0.3} />
            {/* Axes */}
            <line x1={ox} y1={zero_y} x2={ox + iw} y2={zero_y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <line x1={zero_x} y1={PT} x2={zero_x} y2={PT + ih} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            {/* Curve */}
            <polyline points={curvePts} fill="none" stroke={f.color} strokeWidth={2.2} />
            {/* Labels */}
            <text x={ox + iw / 2} y={PT - 8} textAnchor="middle" fontSize={12} fill={f.color} fontWeight={700}>{f.name}</text>
            <text x={ox + iw / 2} y={PT + ih + 13} textAnchor="middle" fontSize={9} fill={f.color} fillOpacity={0.8}>{f.desc}</text>
            {f.note.split('\n').map((line, li) => (
              <text key={li} x={ox + iw / 2} y={PT + ih + 26 + li * 13} textAnchor="middle" fontSize={8.5} fill="rgba(148,163,184,0.6)">{line}</text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ── Diagram: Boucle d'entraînement ────────────────────────────────────────
function DiagramTrainingLoop() {
  const W = 560, H = 250
  const steps = [
    { icon: '📦', label: 'Mini-batch', sub: '32 exemples', color: '#6366f1', x: 100, y: 80 },
    { icon: '➡️', label: 'Forward pass', sub: 'x → ŷ', color: '#8b5cf6', x: 280, y: 50 },
    { icon: '📉', label: 'Loss', sub: '(ŷ − y)²', color: '#ef4444', x: 450, y: 80 },
    { icon: '⬅️', label: 'Backward', sub: '∂L/∂W', color: '#f97316', x: 450, y: 170 },
    { icon: '🔧', label: 'Mise à jour', sub: 'W ← W − α∇W', color: '#10b981', x: 280, y: 200 },
    { icon: '🔁', label: 'Suivant batch', sub: '→ étape suivante', color: '#6366f1', x: 100, y: 170 },
  ]
  const arrows = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="loopArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.5)" />
        </marker>
      </defs>
      <text x={W / 2} y={20} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Boucle d'entraînement — 1 époque = toutes les données parcourues une fois
      </text>
      {arrows.map(([a, b], i) => {
        const s = steps[a], e = steps[b]
        return (
          <line key={i} x1={s.x} y1={s.y} x2={e.x} y2={e.y}
            stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} markerEnd="url(#loopArr)" />
        )
      })}
      {steps.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={30} fill={`${s.color}18`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.7} />
          <text x={s.x} y={s.y - 6} textAnchor="middle" fontSize={14}>{s.icon}</text>
          <text x={s.x} y={s.y + 8} textAnchor="middle" fontSize={9} fill={s.color} fontWeight={700}>{s.label}</text>
          <text x={s.x} y={s.y + 48} textAnchor="middle" fontSize={8.5} fill="rgba(148,163,184,0.6)">{s.sub}</text>
        </g>
      ))}
      {/* Epoch counter */}
      <text x={W / 2} y={235} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">
        1 époque = 1 tour complet sur tous les batches. 100 époques = 100 tours = modèle de plus en plus précis
      </text>
    </svg>
  )
}

// ── Diagram: Transfer Learning ────────────────────────────────────────────
function DiagramTransferLearning() {
  const W = 560, H = 260
  const layers = [
    { label: 'Couches basses', sub: 'Bords, textures, formes simples', frozen: true, h: 40, y: 30 },
    { label: 'Couches intermédiaires', sub: "Parties d'objets, patterns complexes", frozen: true, h: 40, y: 80 },
    { label: 'Couches hautes', sub: 'Concepts abstraits (visage, roue…)', frozen: true, h: 40, y: 130 },
    { label: 'Nouvelle tête (ajoutée)', sub: 'Spécifique à votre tâche', frozen: false, h: 40, y: 185 },
  ]
  const LX = 60, LW = 200
  const RX = 320, RW = 200

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Transfer Learning — Réutiliser un modèle pré-entraîné
      </text>
      {/* Labels colonnes */}
      <text x={LX + LW / 2} y={22} textAnchor="middle" fontSize={11} fill="#94a3b8">Modèle pré-entraîné (ImageNet)</text>
      <text x={RX + RW / 2} y={22} textAnchor="middle" fontSize={11} fill="#34d399">Votre modèle fine-tuné</text>
      {layers.map((l, i) => {
        const frozenColor = '#475569'
        const newColor = '#10b981'
        return (
          <g key={i}>
            {/* Gauche: original */}
            <rect x={LX} y={l.y} width={LW} height={l.h} rx={8}
              fill={l.frozen ? 'rgba(71,85,105,0.15)' : 'rgba(16,185,129,0.15)'}
              stroke={l.frozen ? frozenColor : newColor} strokeWidth={1.5} strokeOpacity={0.5}
              strokeDasharray={l.frozen ? 'none' : 'none'} />
            <text x={LX + LW / 2} y={l.y + 16} textAnchor="middle" fontSize={10}
              fill={l.frozen ? '#94a3b8' : '#34d399'} fontWeight={600}>{l.label}</text>
            <text x={LX + LW / 2} y={l.y + 29} textAnchor="middle" fontSize={8.5}
              fill="rgba(148,163,184,0.6)">{l.sub}</text>
            {l.frozen && (
              <text x={LX + LW - 8} y={l.y + 20} textAnchor="end" fontSize={12}>🔒</text>
            )}
            {/* Droite: fine-tuned */}
            <rect x={RX} y={l.y} width={RW} height={l.h} rx={8}
              fill={l.frozen ? 'rgba(71,85,105,0.1)' : 'rgba(16,185,129,0.2)'}
              stroke={l.frozen ? frozenColor : newColor}
              strokeWidth={l.frozen ? 1 : 2} strokeOpacity={l.frozen ? 0.3 : 0.8} />
            <text x={RX + RW / 2} y={l.y + 16} textAnchor="middle" fontSize={10}
              fill={l.frozen ? 'rgba(148,163,184,0.5)' : '#34d399'} fontWeight={600}>{l.label}</text>
            <text x={RX + RW / 2} y={l.y + 29} textAnchor="middle" fontSize={8.5}
              fill={l.frozen ? 'rgba(148,163,184,0.35)' : 'rgba(52,211,153,0.8)'}>{l.sub}</text>
            {!l.frozen && (
              <text x={RX + RW - 8} y={l.y + 20} textAnchor="end" fontSize={12}>✏️</text>
            )}
            {/* Flèche copie */}
            <line x1={LX + LW + 4} y1={l.y + l.h / 2} x2={RX - 4} y2={l.y + l.h / 2}
              stroke={l.frozen ? 'rgba(71,85,105,0.4)' : 'rgba(16,185,129,0.6)'} strokeWidth={1.5} />
          </g>
        )
      })}
      <text x={W / 2} y={243} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.55)">
        🔒 Couches gelées : poids copiés, non modifiés · ✏️ Nouvelle tête : entraînée sur vos données (quelques centaines suffisent)
      </text>
    </svg>
  )
}

// ── Diagram: Tokenisation ─────────────────────────────────────────────────
function DiagramTokenization() {
  const W = 560, H = 230
  const examples = [
    {
      text: '"développeur"',
      tokens: [{ t: 'développ', id: 15023, color: '#6366f1' }, { t: 'eur', id: 593, color: '#8b5cf6' }],
      note: 'Mot rare → scindé en 2 sous-mots',
    },
    {
      text: '"Je suis"',
      tokens: [{ t: 'Je', id: 1474, color: '#ec4899' }, { t: ' suis', id: 6090, color: '#f472b6' }],
      note: 'Mots courants → 1 token chacun',
    },
    {
      text: '"ChatGPT"',
      tokens: [{ t: 'Chat', id: 13437, color: '#10b981' }, { t: 'G', id: 38, color: '#34d399' }, { t: 'PT', id: 2898, color: '#6ee7b7' }],
      note: 'Nom propre → 3 tokens',
    },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Tokenisation — comment le LLM découpe le texte en morceaux
      </text>
      <text x={W / 2} y={33} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.45)">
        Le vocabulaire contient ~50 000 tokens. Chaque token a un identifiant numérique unique.
      </text>
      {examples.map((ex, ei) => {
        const baseY = 55 + ei * 57
        return (
          <g key={ei}>
            <text x={30} y={baseY + 12} fontSize={11} fill="rgba(148,163,184,0.7)" fontStyle="italic">{ex.text} →</text>
            {ex.tokens.map((tok, ti) => {
              const tx = 150 + ti * 110
              return (
                <g key={ti}>
                  <rect x={tx} y={baseY} width={100} height={30} rx={8}
                    fill={`${tok.color}22`} stroke={tok.color} strokeWidth={1.5} strokeOpacity={0.8} />
                  <text x={tx + 50} y={baseY + 13} textAnchor="middle" fontSize={11} fill={tok.color} fontWeight={700}>{tok.t}</text>
                  <text x={tx + 50} y={baseY + 24} textAnchor="middle" fontSize={8} fill="rgba(148,163,184,0.5)">id={tok.id}</text>
                </g>
              )
            })}
            <text x={30} y={baseY + 46} fontSize={9} fill="rgba(148,163,184,0.5)">💡 {ex.note}</text>
          </g>
        )
      })}
      <text x={W / 2} y={218} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.45)">
        Les LLMs ne lisent pas des lettres ni des mots entiers — ils lisent des IDs de tokens, puis les convertissent en vecteurs (embeddings)
      </text>
    </svg>
  )
}

// ── Diagram: Fine-tuning & RLHF pipeline ─────────────────────────────────
function DiagramRLHF() {
  const W = 560, H = 240
  const stages = [
    { icon: '📚', title: 'Modèle de base', sub: 'Pré-entraîné sur\ndes milliards de textes', color: '#475569', detail: 'Prédiction de token' },
    { icon: '👩‍🏫', title: 'SFT', sub: 'Supervised Fine-Tuning\n(milliers d\'exemples annotés)', color: '#6366f1', detail: 'Suit les instructions' },
    { icon: '👍', title: 'Reward Model', sub: 'Apprend les préférences\nhumaines (A > B ?)', color: '#f59e0b', detail: 'Note les réponses' },
    { icon: '🏆', title: 'PPO / RLHF', sub: 'Optimise avec la\nrécompense du RM', color: '#10b981', detail: 'Aligné humain' },
  ]
  const bw = 110, bh = 120, gap = (W - stages.length * bw) / (stages.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="rlhfArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.45)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Pipeline RLHF — comment naît ChatGPT à partir de GPT
      </text>
      {stages.map((s, i) => {
        const x = gap + i * (bw + gap)
        const cy = 45
        return (
          <g key={i}>
            {i < stages.length - 1 && (
              <line x1={x + bw} y1={cy + bh / 2} x2={x + bw + gap} y2={cy + bh / 2}
                stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#rlhfArr)" />
            )}
            <rect x={x} y={cy} width={bw} height={bh} rx={10}
              fill={`${s.color}18`} stroke={s.color} strokeWidth={i === 3 ? 2 : 1.5} strokeOpacity={i === 3 ? 1 : 0.6} />
            <text x={x + bw / 2} y={cy + 24} textAnchor="middle" fontSize={20}>{s.icon}</text>
            <text x={x + bw / 2} y={cy + 44} textAnchor="middle" fontSize={11} fill={s.color} fontWeight={700}>{s.title}</text>
            {s.sub.split('\n').map((line, li) => (
              <text key={li} x={x + bw / 2} y={cy + 60 + li * 14} textAnchor="middle" fontSize={8.5} fill="rgba(148,163,184,0.7)">{line}</text>
            ))}
            <rect x={x + 8} y={cy + bh - 22} width={bw - 16} height={16} rx={4} fill={`${s.color}25`} />
            <text x={x + bw / 2} y={cy + bh - 11} textAnchor="middle" fontSize={8.5} fill={s.color}>{s.detail}</text>
          </g>
        )
      })}
      {/* Human feedback annotation */}
      <path d={`M ${gap + bw + gap / 2} ${45 + bh / 2} q 0 50 ${-(gap + bw) * 0.5} 40`}
        fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={gap + bw + gap * 1.5 + bw * 0.5} y={45 + bh + 30} textAnchor="middle" fontSize={9} fill="rgba(245,158,11,0.8)">
        👤 Annotateurs humains comparent 2 réponses → A &gt; B
      </text>
      <text x={gap + bw + gap * 1.5 + bw * 0.5} y={45 + bh + 44} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.5)">
        Ces préférences entraînent le Reward Model
      </text>
    </svg>
  )
}

// ── Diagram: Techniques de prompting ─────────────────────────────────────
function DiagramFewShot() {
  const W = 560, H = 250
  const cols = [
    {
      title: 'Zero-shot', icon: '🎯', color: '#6366f1',
      lines: ['Prompt :', '"Traduis en anglais :', '"Bonjour le monde"', '', '→ modèle devine la tâche', 'sans exemple'],
    },
    {
      title: 'One-shot', icon: '1️⃣', color: '#f59e0b',
      lines: ['Prompt :', '"FR→EN : Bonjour → Hello', '"FR→EN : Bonjour le monde"', '', '→ 1 exemple montre', 'le format attendu'],
    },
    {
      title: 'Few-shot', icon: '🔢', color: '#10b981',
      lines: ['Prompt :', '"FR→EN : Bonjour → Hello', 'FR→EN : Chat → Cat', '"FR→EN : Bonjour le monde"', '→ plusieurs exemples', '→ plus précis ✓'],
    },
  ]
  const cw = W / 3

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Zero-shot · One-shot · Few-shot — niveaux d'exemples dans le prompt
      </text>
      {cols.map((c, ci) => {
        const x = ci * cw + 8
        const w = cw - 16
        return (
          <g key={ci}>
            <rect x={x} y={25} width={w} height={H - 40} rx={10}
              fill={`${c.color}0e`} stroke={c.color} strokeWidth={1.5} strokeOpacity={0.5} />
            <text x={x + 14} y={46} fontSize={18}>{c.icon}</text>
            <text x={x + w / 2} y={46} textAnchor="middle" fontSize={12} fill={c.color} fontWeight={700}>{c.title}</text>
            {c.lines.map((line, li) => (
              <text key={li} x={x + 10} y={65 + li * 20} fontSize={9}
                fill={line.startsWith('→') ? c.color : line.startsWith('"') ? '#a5b4fc' : 'rgba(148,163,184,0.6)'}
                fontFamily={line.startsWith('"') ? 'monospace' : 'inherit'}
                fontWeight={line.startsWith('→') && line.includes('✓') ? 700 : 400}>
                {line}
              </text>
            ))}
          </g>
        )
      })}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">
        Chain-of-thought = demander "réfléchis étape par étape" → le modèle raisonne mieux sur les problèmes complexes
      </text>
    </svg>
  )
}

// ── Diagram: Chunking avec overlap ────────────────────────────────────────
function DiagramChunking() {
  const W = 560, H = 220
  const docH = 36, chunkH = 30, overlapColor = 'rgba(245,158,11,0.35)'

  // Document bar
  const docX = 30, docW = 500, docY = 35
  // 3 chunks with overlap
  const chunkSize = 0.42, overlap = 0.14
  const chunks = [
    { x: 0, w: chunkSize, color: '#6366f1' },
    { x: chunkSize - overlap, w: chunkSize, color: '#8b5cf6' },
    { x: (chunkSize - overlap) * 2, w: Math.min(chunkSize, 1 - (chunkSize - overlap) * 2), color: '#a855f7' },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Chunking avec overlap — découper un document pour le RAG
      </text>
      {/* Document original */}
      <text x={docX} y={30} fontSize={10} fill="rgba(148,163,184,0.5)">Document original (ex: PDF de 20 pages)</text>
      <rect x={docX} y={docY} width={docW} height={docH} rx={6} fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth={1.5} />
      {/* Contenu simulé */}
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={docX + 10 + i * 16} y={docY + 8} width={12} height={6} rx={2}
          fill="rgba(148,163,184,0.15)" />
      ))}
      <text x={docX + docW / 2} y={docY + docH / 2 + 5} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.4)">
        texte complet...
      </text>
      {/* Flèche découpage */}
      <text x={W / 2} y={90} textAnchor="middle" fontSize={12} fill="rgba(148,163,184,0.5)">↓ chunk_size=500, overlap=100</text>
      {/* Chunks */}
      <text x={docX} y={105} fontSize={10} fill="rgba(148,163,184,0.5)">Chunks (avec overlap pour ne pas couper le contexte)</text>
      {chunks.map((c, i) => {
        const cx = docX + c.x * docW
        const cw = c.w * docW
        return (
          <g key={i}>
            <rect x={cx} y={112} width={cw} height={chunkH} rx={6}
              fill={`${c.color}25`} stroke={c.color} strokeWidth={1.5} strokeOpacity={0.7} />
            <text x={cx + cw / 2} y={112 + 19} textAnchor="middle" fontSize={10} fill={c.color} fontWeight={600}>Chunk {i + 1}</text>
          </g>
        )
      })}
      {/* Zones d'overlap */}
      {[1, 2].map(i => {
        const overlapX = docX + (chunks[i].x) * docW
        const overlapW = overlap * docW
        return (
          <g key={i}>
            <rect x={overlapX} y={112} width={overlapW} height={chunkH} rx={0}
              fill={overlapColor} />
            <text x={overlapX + overlapW / 2} y={112 + chunkH + 14} textAnchor="middle" fontSize={9} fill="#fbbf24">overlap</text>
          </g>
        )
      })}
      {/* Légende */}
      <rect x={30} y={168} width={20} height={12} rx={3} fill={overlapColor} />
      <text x={56} y={179} fontSize={10} fill="rgba(148,163,184,0.7)">Zone overlap : texte répété entre 2 chunks pour éviter de couper une phrase à cheval</text>
      <text x={W / 2} y={200} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">
        Sans overlap : "Le paiement est validé. Votre commande..." → coupé entre 2 chunks → contexte perdu
      </text>
    </svg>
  )
}

// ── Diagram: Recherche vectorielle ────────────────────────────────────────
function DiagramVectorSearch() {
  const W = 540, H = 250
  const PL = 30, PT = 30, IW = 480, IH = 190
  const px = x => PL + x * IW
  const py = y => PT + (1 - y) * IH

  const docs = [
    { x: 0.15, y: 0.82, label: '📄 Doc 1', sub: 'Python asyncio', color: '#6366f1', near: true },
    { x: 0.25, y: 0.70, label: '📄 Doc 2', sub: 'Python multithreading', color: '#6366f1', near: true },
    { x: 0.18, y: 0.60, label: '📄 Doc 3', sub: 'Python GIL', color: '#6366f1', near: false },
    { x: 0.72, y: 0.25, label: '📄 Doc 4', sub: 'Java Spring Boot', color: '#94a3b8', near: false },
    { x: 0.82, y: 0.35, label: '📄 Doc 5', sub: 'Java JVM', color: '#94a3b8', near: false },
    { x: 0.55, y: 0.65, label: '📄 Doc 6', sub: 'Rust ownership', color: '#94a3b8', near: false },
    { x: 0.65, y: 0.55, label: '📄 Doc 7', sub: 'C++ pointers', color: '#94a3b8', near: false },
  ]
  const query = { x: 0.20, y: 0.75, label: '🔍 Requête', sub: '"Parallélisme Python"' }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Recherche vectorielle — trouver les k chunks les plus proches
      </text>
      {/* Axes */}
      <line x1={PL} y1={PT + IH} x2={PL + IW} y2={PT + IH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <line x1={PL} y1={PT} x2={PL} y2={PT + IH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <text x={PL + IW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.35)">Dimension 1 de l'embedding</text>
      <text x={8} y={PT + IH / 2 + 4} textAnchor="middle" fontSize={9} fill="rgba(148,163,184,0.35)" transform={`rotate(-90,8,${PT + IH / 2})`}>Dimension 2</text>
      {/* Cercle de proximité */}
      <circle cx={px(query.x)} cy={py(query.y)} r={55} fill="none"
        stroke="rgba(52,211,153,0.2)" strokeWidth={1.5} strokeDasharray="5,4" />
      <text x={px(query.x) + 58} y={py(query.y) - 40} fontSize={9} fill="rgba(52,211,153,0.6)">k-voisins</text>
      {/* Lines to near docs */}
      {docs.filter(d => d.near).map((d, i) => (
        <line key={i} x1={px(query.x)} y1={py(query.y)} x2={px(d.x)} y2={py(d.y)}
          stroke="rgba(52,211,153,0.4)" strokeWidth={1.5} strokeDasharray="3,2" />
      ))}
      {/* Documents */}
      {docs.map((d, i) => (
        <g key={i}>
          <circle cx={px(d.x)} cy={py(d.y)} r={d.near ? 7 : 5}
            fill={d.near ? 'rgba(99,102,241,0.7)' : 'rgba(148,163,184,0.3)'}
            stroke={d.near ? '#818cf8' : 'rgba(148,163,184,0.3)'} strokeWidth={1} />
          <text x={px(d.x) + 10} y={py(d.y) + 4} fontSize={9}
            fill={d.near ? '#a5b4fc' : 'rgba(148,163,184,0.45)'}>{d.label}</text>
          <text x={px(d.x) + 10} y={py(d.y) + 14} fontSize={7.5}
            fill={d.near ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.3)'}>{d.sub}</text>
        </g>
      ))}
      {/* Query point */}
      <circle cx={px(query.x)} cy={py(query.y)} r={9} fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth={2} />
      <text x={px(query.x)} y={py(query.y) + 4} textAnchor="middle" fontSize={11}>🔍</text>
      <text x={px(query.x)} y={py(query.y) + 24} textAnchor="middle" fontSize={10} fill="#34d399" fontWeight={700}>{query.label}</text>
      <text x={px(query.x)} y={py(query.y) + 36} textAnchor="middle" fontSize={9} fill="rgba(52,211,153,0.7)">{query.sub}</text>
    </svg>
  )
}

// ── Diagram: Systèmes Multi-Agents ────────────────────────────────────────
function DiagramMultiAgent() {
  const W = 560, H = 260
  const agents = [
    { icon: '🔎', title: 'Agent Recherche', sub: 'Cherche l\'info\n(web, docs, DB)', color: '#6366f1', x: 90, y: 160 },
    { icon: '✍️', title: 'Agent Rédaction', sub: 'Génère le contenu\nformaté', color: '#8b5cf6', x: 280, y: 160 },
    { icon: '✅', title: 'Agent Validation', sub: 'Vérifie la qualité\net la cohérence', color: '#10b981', x: 470, y: 160 },
  ]
  const orchestrator = { icon: '🤖', title: 'Orchestrateur', sub: 'Décompose la tâche\net coordonne', color: '#ec4899', x: 280, y: 60 }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="maArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.4)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Système multi-agents — division du travail entre agents spécialisés
      </text>
      {/* Orchestrator box */}
      <rect x={orchestrator.x - 70} y={orchestrator.y - 28} width={140} height={56} rx={12}
        fill={`${orchestrator.color}20`} stroke={orchestrator.color} strokeWidth={2} strokeOpacity={0.8} />
      <text x={orchestrator.x} y={orchestrator.y - 10} textAnchor="middle" fontSize={18}>{orchestrator.icon}</text>
      <text x={orchestrator.x} y={orchestrator.y + 6} textAnchor="middle" fontSize={11} fill={orchestrator.color} fontWeight={700}>{orchestrator.title}</text>
      {orchestrator.sub.split('\n').map((line, li) => (
        <text key={li} x={orchestrator.x} y={orchestrator.y + 18 + li * 12} textAnchor="middle" fontSize={8.5} fill="rgba(148,163,184,0.6)">{line}</text>
      ))}
      {/* Agent boxes */}
      {agents.map((a, i) => (
        <g key={i}>
          <line x1={orchestrator.x} y1={orchestrator.y + 28} x2={a.x} y2={a.y - 28}
            stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#maArr)" strokeDasharray="5,3" />
          <rect x={a.x - 65} y={a.y - 28} width={130} height={56} rx={10}
            fill={`${a.color}18`} stroke={a.color} strokeWidth={1.5} strokeOpacity={0.7} />
          <text x={a.x} y={a.y - 10} textAnchor="middle" fontSize={18}>{a.icon}</text>
          <text x={a.x} y={a.y + 6} textAnchor="middle" fontSize={10} fill={a.color} fontWeight={700}>{a.title}</text>
          {a.sub.split('\n').map((line, li) => (
            <text key={li} x={a.x} y={a.y + 18 + li * 12} textAnchor="middle" fontSize={8.5} fill="rgba(148,163,184,0.6)">{line}</text>
          ))}
        </g>
      ))}
      {/* Sequential flow arrows between agents */}
      <line x1={agents[0].x + 65} y1={agents[0].y} x2={agents[1].x - 65} y2={agents[1].y}
        stroke="rgba(99,102,241,0.4)" strokeWidth={1.5} markerEnd="url(#maArr)" />
      <line x1={agents[1].x + 65} y1={agents[1].y} x2={agents[2].x - 65} y2={agents[2].y}
        stroke="rgba(99,102,241,0.4)" strokeWidth={1.5} markerEnd="url(#maArr)" />
      {/* Use case */}
      <text x={W / 2} y={235} textAnchor="middle" fontSize={10.5} fill="rgba(148,163,184,0.6)">
        Exemple : "Rédige un rapport sur l'IA" → Recherche cherche les sources → Rédaction rédige → Validation corrige
      </text>
      <text x={W / 2} y={250} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.45)">
        Chaque agent a ses propres outils et son propre contexte. L'orchestrateur divise et réassemble.
      </text>
    </svg>
  )
}

// ── Diagram: ML Pipeline (En pratique module 2) ───────────────────────────
function DiagramMLPipeline() {
  const W = 560, H = 200
  const steps = [
    { icon: '📊', label: 'Données brutes', sub: 'CSV, JSON, DB', color: '#6366f1' },
    { icon: '🧹', label: 'Prétraitement', sub: 'Nettoyage, normalisation', color: '#8b5cf6' },
    { icon: '✂️', label: 'Split', sub: 'Train / Val / Test', color: '#f59e0b' },
    { icon: '🧠', label: 'Entraînement', sub: 'Fit le modèle', color: '#ec4899' },
    { icon: '📐', label: 'Évaluation', sub: 'Accuracy, F1, AUC…', color: '#10b981' },
    { icon: '🚀', label: 'Déploiement', sub: 'API, microservice', color: '#34d399' },
  ]
  const bw = 70, bh = 90, gap = (W - steps.length * bw) / (steps.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}>
      <defs>
        <marker id="mlpArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.45)" />
        </marker>
      </defs>
      <text x={W / 2} y={18} textAnchor="middle" fontSize={13} fill="rgba(148,163,184,0.7)" fontWeight={600}>
        Pipeline ML complet — de la donnée brute au modèle en production
      </text>
      {steps.map((s, i) => {
        const x = gap + i * (bw + gap), cy = 40
        return (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={x + bw} y1={cy + bh / 2} x2={x + bw + gap} y2={cy + bh / 2}
                stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#mlpArr)" />
            )}
            <rect x={x} y={cy} width={bw} height={bh} rx={10}
              fill={`${s.color}18`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={x + bw / 2} y={cy + 22} textAnchor="middle" fontSize={18}>{s.icon}</text>
            <text x={x + bw / 2} y={cy + 42} textAnchor="middle" fontSize={9.5} fill={s.color} fontWeight={700}>{s.label}</text>
            <text x={x + bw / 2} y={cy + 56} textAnchor="middle" fontSize={8} fill="rgba(148,163,184,0.6)">{s.sub}</text>
          </g>
        )
      })}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="rgba(148,163,184,0.5)">
        En pratique : 80% du temps est passé sur les étapes 1 et 2 (données). Le modèle n'est que 20%.
      </text>
    </svg>
  )
}

// ── Registry: lessonId → component ────────────────────────────────────────
const DIAGRAMS = {
  '1-1':  DiagramHierarchyIA,
  '1-3':  DiagramStats,
  '1-4':  DiagramGradientDescent,
  '1-p':  DiagramTrainValTest,
  '2-1':  DiagramMLTypes,
  '2-2':  DiagramRegression,
  '2-3':  DiagramDecisionTree,
  '2-4':  DiagramClustering,
  '2-p':  DiagramMLPipeline,
  '3-1':  DiagramPerceptron,
  '3-2':  DiagramNeuralNet,
  '3-3':  DiagramActivation,
  '3-4':  DiagramOverfitting,
  '3-p':  DiagramTrainingLoop,
  '4-1':  DiagramCNN,
  '4-2':  DiagramTransferLearning,
  '4-3':  DiagramRNN,
  '5-1':  DiagramTokenization,
  '5-2':  DiagramEmbedding,
  '6-1':  DiagramAttention,
  '6-2':  DiagramRLHF,
  '7-1':  DiagramPromptEngineering,
  '7-2':  DiagramFewShot,
  '8-1':  DiagramRAG,
  '8-2':  DiagramChunking,
  '8-3':  DiagramVectorSearch,
  '9-1':  DiagramAgentLoop,
  '9-2':  DiagramMultiAgent,
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
      <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.6)', marginTop: 12 }}>
        Illustration du concept — non exhaustive
      </div>
    </div>
  )
}
