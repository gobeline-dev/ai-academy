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
  const W = 560, H = 260
  const stages = [
    { icon: '🖼️', title: 'Image', sub: '28 × 28 px', detail: 'Entrée brute', color: '#6366f1', x: 30 },
    { icon: '🔍', title: 'Convolution', sub: 'Filtres 3×3', detail: 'Détecte bords & textures', color: '#8b5cf6', x: 160 },
    { icon: '⬇️', title: 'Pooling', sub: 'Max 2×2', detail: 'Réduit la résolution ÷2', color: '#a855f7', x: 290 },
    { icon: '🧠', title: 'Couches FC', sub: '256 → 128', detail: 'Combine les features', color: '#ec4899', x: 420 },
  ]
  const bw = 100, bh = 120, cy = 80

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
      {stages.map((s, i) => (
        <g key={i}>
          {i < stages.length - 1 && (
            <line x1={s.x + bw} y1={cy + bh / 2} x2={stages[i + 1].x} y2={cy + bh / 2}
              stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} markerEnd="url(#cnnArr)" />
          )}
          <rect x={s.x} y={cy} width={bw} height={bh} rx={10}
            fill={`${s.color}18`} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.6} />
          <text x={s.x + bw / 2} y={cy + 24} textAnchor="middle" fontSize={22}>{s.icon}</text>
          <text x={s.x + bw / 2} y={cy + 50} textAnchor="middle" fontSize={12} fill={s.color} fontWeight={700}>
            {s.title}
          </text>
          <text x={s.x + bw / 2} y={cy + 67} textAnchor="middle" fontSize={10.5} fill={s.color} fontWeight={500}>
            {s.sub}
          </text>
          <text x={s.x + bw / 2} y={cy + 85} textAnchor="middle" fontSize={9.5} fill="rgba(148,163,184,0.75)">
            {s.detail}
          </text>
        </g>
      ))}
      {/* Sortie finale */}
      <rect x={420 + bw + 30} y={cy + 30} width={70} height={60} rx={10}
        fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth={1.5} />
      <text x={420 + bw + 65} y={cy + 55} textAnchor="middle" fontSize={20}>🏷️</text>
      <text x={420 + bw + 65} y={cy + 73} textAnchor="middle" fontSize={11} fill="#34d399" fontWeight={700}>Classe</text>
      <text x={420 + bw + 65} y={cy + 87} textAnchor="middle" fontSize={10} fill="rgba(52,211,153,0.7)">10 sorties</text>
      <line x1={420 + bw} y1={cy + bh / 2} x2={420 + bw + 30} y2={cy + 60}
        stroke="rgba(52,211,153,0.4)" strokeWidth={1.5} markerEnd="url(#cnnArr)" />
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="rgba(148,163,184,0.55)">
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
