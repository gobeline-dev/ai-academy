import { useState } from 'react'
import { AutoTooltipText } from './Tooltip.jsx'
import { GradientDescentWidget, TemperatureWidget } from './InteractiveWidgets.jsx'

// Language preference is NOT persisted — Java is always the default.
// Remove any stale localStorage value from a previous session.
if (typeof localStorage !== 'undefined') localStorage.removeItem('codeLang')

// ── HTML escape ───────────────────────────────────────────────────────────────
function escapeHtml(code) {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ── Python syntax highlighter ─────────────────────────────────────────────────
function highlightPython(code) {
  const escaped = escapeHtml(code)

  const TOKEN = new RegExp(
    '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\')'
    + '|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')'
    + '|(#[^\\n]*)'
    + '|(f(?=["\']))'
    + '|(@\\w+)'
    + '|\\b(def|class|return|import|from|as|if|else|elif|for|while|in|not|and|or|True|False|None|with|try|except|raise|yield|lambda|pass|break|continue|async|await)\\b'
    + '|\\b(print|len|range|enumerate|zip|map|filter|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|max|min|sum|sorted|any|all)\\b'
    + '|\\b(\\d+\\.?\\d*)\\b',
    'g'
  )

  return escaped.replace(TOKEN, (_, tripleStr, str, comment, fPrefix, decorator, keyword, builtin, number) => {
    if (tripleStr !== undefined) return `<span style="color:#86efac">${tripleStr}</span>`
    if (str       !== undefined) return `<span style="color:#86efac">${str}</span>`
    if (comment   !== undefined) return `<span style="color:#475569;font-style:italic">${comment}</span>`
    if (fPrefix   !== undefined) return `<span style="color:#c084fc">${fPrefix}</span>`
    if (decorator !== undefined) return `<span style="color:#fbbf24">${decorator}</span>`
    if (keyword   !== undefined) return `<span style="color:#c084fc;font-weight:600">${keyword}</span>`
    if (builtin   !== undefined) return `<span style="color:#67e8f9">${builtin}</span>`
    if (number    !== undefined) return `<span style="color:#fbbf24">${number}</span>`
    return _
  })
}

// ── Java syntax highlighter ───────────────────────────────────────────────────
function highlightJava(code) {
  const escaped = escapeHtml(code)

  const TOKEN = new RegExp(
    // 1. Block comments
    '(\\/\\*[\\s\\S]*?\\*\\/)'
    // 2. Line comments
    + '|(\\/\\/[^\\n]*)'
    // 3. Double-quoted strings
    + '|("(?:[^"\\\\]|\\\\.)*")'
    // 4. Char literals
    + "|('(?:[^'\\\\]|\\\\.)')"
    // 5. Annotations
    + '|(@\\w+)'
    // 6. Keywords
    + '|\\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|record|sealed|permits)\\b'
    // 7. Common classes / literals
    + '|\\b(String|Integer|Double|Float|Boolean|Long|Short|Byte|List|Map|Set|Optional|System|Math|Arrays|Collections|ArrayList|HashMap|HashSet|LinkedList|TreeMap|Object|StringBuilder|ObjectMapper|Random|Instances|Attribute|DenseInstance|true|false|null)\\b'
    // 8. Numbers
    + '|\\b(\\d+\\.?\\d*[fFdDlL]?)\\b',
    'g'
  )

  return escaped.replace(TOKEN, (_, blockCmt, lineCmt, str, charLit, annotation, keyword, builtIn, number) => {
    if (blockCmt   !== undefined) return `<span style="color:#475569;font-style:italic">${blockCmt}</span>`
    if (lineCmt    !== undefined) return `<span style="color:#475569;font-style:italic">${lineCmt}</span>`
    if (str        !== undefined) return `<span style="color:#86efac">${str}</span>`
    if (charLit    !== undefined) return `<span style="color:#86efac">${charLit}</span>`
    if (annotation !== undefined) return `<span style="color:#fbbf24">${annotation}</span>`
    if (keyword    !== undefined) return `<span style="color:#c084fc;font-weight:600">${keyword}</span>`
    if (builtIn    !== undefined) return `<span style="color:#67e8f9">${builtIn}</span>`
    if (number     !== undefined) return `<span style="color:#fbbf24">${number}</span>`
    return _
  })
}

// ── AnnotationLegend ─────────────────────────────────────────────────────────
function AnnotationLegend({ annotations }) {
  if (!annotations || annotations.length === 0) return null
  return (
    <div style={{
      borderTop: '1px solid rgba(99,102,241,0.15)',
      padding: '12px 18px',
      background: 'rgba(10,12,26,0.7)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
        <span style={{ fontSize: '0.8rem' }}>🔍</span>
        <span style={{
          fontSize: '0.63rem', fontWeight: 700, color: '#818cf8',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Décryptage ligne par ligne</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {annotations.map((ann, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <code style={{
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 4, padding: '1px 7px', fontSize: '0.63rem',
              fontWeight: 700, color: '#a5b4fc', flexShrink: 0, whiteSpace: 'nowrap', lineHeight: 1.9,
            }}>L.{ann.line}</code>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {ann.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MatrixMultiplyDiagram ─────────────────────────────────────────────────────
function MatrixMultiplyDiagram() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px 10px', background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        🏠 Cas concret : prédire le prix d'une maison — x @ W + b = sortie
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
        Maison : <strong style={{ color: '#a5b4fc' }}>100 m²</strong>, <strong style={{ color: '#a5b4fc' }}>3 chambres</strong>, <strong style={{ color: '#a5b4fc' }}>5 km</strong> du centre → le réseau produit 2 valeurs en parallèle grâce à une seule multiplication matricielle
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 620 158" style={{ width: '100%', minWidth: 480, maxWidth: 900, height: 'auto', display: 'block' }}>

          {/* ── x : vecteur d'entrée ── */}
          <rect x="4" y="18" width="78" height="90" rx="5" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
          <text x="43" y="13" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="sans-serif">x (caractéristiques)</text>
          <text x="40" y="42" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700">100</text>
          <text x="74" y="42" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="sans-serif">m²</text>
          <text x="40" y="65" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700">3</text>
          <text x="74" y="65" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="sans-serif">ch.</text>
          <text x="40" y="88" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700">5</text>
          <text x="74" y="88" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="sans-serif">km</text>
          <text x="43" y="118" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">3 features</text>

          {/* ── @ ── */}
          <text x="94" y="70" textAnchor="middle" fill="#94a3b8" fontSize="20" fontWeight="700">@</text>

          {/* ── W : matrice des poids ── */}
          <rect x="104" y="18" width="124" height="90" rx="5" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
          <text x="166" y="13" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="sans-serif">W (poids appris)</text>
          <line x1="166" y1="19" x2="166" y2="106" stroke="rgba(139,92,246,0.25)" strokeWidth="1"/>
          {/* En-têtes colonnes avec interprétation */}
          <text x="135" y="30" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="sans-serif">→ prix k€</text>
          <text x="197" y="30" textAnchor="middle" fill="#f472b6" fontSize="10" fontFamily="sans-serif">→ attract.</text>
          {[['2.0','0.5'],['15.0','8.0'],['-5.0','-3.0']].map((row, ri) =>
            row.map((v, ci) => (
              <text key={`w${ri}${ci}`} x={ci===0 ? 135 : 197} y={44+ri*22} textAnchor="middle"
                fill={ci===0 ? '#c4b5fd' : '#f9a8d4'} fontSize="12" fontFamily="'JetBrains Mono',monospace">{v}</text>
            ))
          )}
          <text x="166" y="118" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">3 features → 2 sorties</text>

          {/* ── + ── */}
          <text x="238" y="70" textAnchor="middle" fill="#94a3b8" fontSize="20" fontWeight="700">+</text>

          {/* ── b : biais ── */}
          <rect x="248" y="32" width="66" height="62" rx="5" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.45)" strokeWidth="1.5"/>
          <text x="281" y="27" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="sans-serif">b (biais)</text>
          <text x="281" y="56" textAnchor="middle" fill="#67e8f9" fontSize="13" fontFamily="'JetBrains Mono',monospace">50.0</text>
          <text x="281" y="78" textAnchor="middle" fill="#67e8f9" fontSize="13" fontFamily="'JetBrains Mono',monospace">20.0</text>
          <text x="281" y="105" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">2 valeurs</text>

          {/* ── = ── */}
          <text x="326" y="70" textAnchor="middle" fill="#94a3b8" fontSize="20" fontWeight="700">=</text>

          {/* ── Sortie ── */}
          <rect x="338" y="32" width="82" height="62" rx="5" fill="rgba(52,211,153,0.18)" stroke="rgba(52,211,153,0.6)" strokeWidth="2"/>
          <text x="379" y="27" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="sans-serif">sortie</text>
          <text x="379" y="53" textAnchor="middle" fill="#6ee7b7" fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700">270 k€</text>
          <text x="379" y="65" textAnchor="middle" fill="#64748b" fontSize="9.5" fontFamily="sans-serif">prix estimé</text>
          <text x="379" y="80" textAnchor="middle" fill="#f9a8d4" fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700">79 pts</text>
          <text x="379" y="92" textAnchor="middle" fill="#64748b" fontSize="9.5" fontFamily="sans-serif">attractivité</text>
          <text x="379" y="105" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">2 neurones</text>

          {/* ── Détail des calculs ── */}
          <line x1="432" y1="18" x2="432" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <text x="438" y="14" fill="#818cf8" fontSize="10" fontFamily="sans-serif" fontWeight="700">Détail des calculs :</text>
          <text x="438" y="30" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">100×2.0 = 200  (surface)</text>
          <text x="438" y="42" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">  3×15.0 = 45   (chambres)</text>
          <text x="438" y="54" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">  5×(−5.0) = −25 (distance)</text>
          <text x="438" y="66" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">  biais    = +50</text>
          <text x="438" y="79" fill="#34d399" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">→ prix = 270 k€ ✓</text>
          <line x1="438" y1="87" x2="615" y2="87" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <text x="438" y="99" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">100×0.5 = 50   3×8.0 = 24</text>
          <text x="438" y="111" fill="#94a3b8" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">5×(−3.0) = −15  biais = +20</text>
          <text x="438" y="124" fill="#f472b6" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">→ attract. = 79 pts ✓</text>
        </svg>
      </div>

      {/* Explication poids */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>
          💡 <strong>Neurone 1 — Prix estimé (k€) :</strong> chaque m² ajoute <strong>+2 000 €</strong>, chaque chambre <strong>+15 000 €</strong>, chaque km du centre <strong>−5 000 €</strong>. Le biais 50 k€ est le prix plancher (même à 0 m², 0 chambre, 0 km). Résultat : <strong>270 000 €</strong>.
        </div>
        <div>
          🌟 <strong>Neurone 2 — Score d'attractivité (0–100 pts) :</strong> ce n'est pas un prix — c'est une <em>note synthétique</em> que le réseau a <em>appris à calculer</em> pour résumer le désir d'achat. Ici : +50 pts pour la surface, +24 pts pour les chambres, −15 pts pour l'éloignement, +20 pts de base = <strong>79/100</strong>. Plus ce score est élevé, plus la maison sera vendue rapidement d'après les données d'entraînement.
        </div>
      </div>

      {/* Encadré : qu'est-ce qu'un "score" ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(244,114,182,0.06)', borderRadius: 8, borderLeft: '3px solid rgba(244,114,182,0.4)' }}>
        <strong style={{ color: '#f472b6' }}>Qu'est-ce qu'un "score" dans un réseau de neurones ?</strong><br/>
        Un score (aussi appelé <em>logit</em> ou <em>activation</em>) est simplement un <strong>nombre réel</strong> produit par un neurone — sans unité physique imposée. Il n'a de sens que parce que le réseau a <em>appris</em> à lui en donner un au fil de l'entraînement. Dans les couches cachées, ces scores sont des représentations intermédiaires invisibles (le réseau décide lui-même ce qu'il encode). En sortie, on leur donne un nom métier : "prix", "attractivité", "probabilité de fraude", etc. Le même calcul x @ W + b peut donc produire un euro, une probabilité, ou une note — tout dépend des données sur lesquelles W a été entraîné.
      </div>
    </div>
  )
}

// ── MLPArchitectureDiagram ────────────────────────────────────────────────────
function MLPArchitectureDiagram() {
  // Cas concret : prédire si une maison (100m², 3ch, 5km) dépasse le budget
  // Entrée : 3 features, Cachée 1 : 4 neurones ReLU, Cachée 2 : 3 neurones ReLU, Sortie : 1 (probabilité)
  const layerX = [68, 188, 308, 410]
  const layerNeurons = [[42, 100, 158], [22, 68, 114, 160], [42, 100, 158], [100]]
  const layerColors = ['#6366f1', '#8b5cf6', '#8b5cf6', '#34d399']
  const layerLabels = ['Entrée', 'Cachée 1', 'Cachée 2', 'Sortie']
  const layerSubs = ['3 features', '4 — ReLU', '3 — ReLU', '1 — Sigmoid']
  // Étiquettes des neurones d'entrée
  const inputLabels = ['surface\nm²', 'chambres', 'distance\nkm']

  // Paramètres : 3×4 + 4×3 + 3×1 = 12+12+3 = 27 poids, 4+3+1 = 8 biais → 35 total
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px 10px', background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        🧠 MLP([3, 4, 3, 1]) — 35 paramètres apprenables (27 poids + 8 biais)
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
        Cas concret : <strong style={{ color: '#a5b4fc' }}>est-ce que cette maison (100 m², 3 ch., 5 km) dépasse mon budget de 280 k€ ?</strong>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 490 210" style={{ width: '100%', minWidth: 380, maxWidth: 760, height: 'auto', display: 'block' }}>
          {/* Connexions */}
          {layerX.slice(0, -1).map((x1, li) =>
            layerNeurons[li].flatMap((y1, fi) =>
              layerNeurons[li + 1].map((y2, ti) => (
                <line key={`c${li}${fi}${ti}`} x1={x1} y1={y1} x2={layerX[li + 1]} y2={y2}
                  stroke="rgba(99,102,241,0.15)" strokeWidth="0.8" />
              ))
            )
          )}
          {/* Neurones */}
          {layerX.map((x, li) =>
            layerNeurons[li].map((y, ni) => (
              <circle key={`n${li}${ni}`} cx={x} cy={y} r="13"
                fill={`rgba(${li === 3 ? '52,211,153' : li === 0 ? '99,102,241' : '139,92,246'},0.15)`}
                stroke={layerColors[li]} strokeWidth="1.5" />
            ))
          )}
          {/* Étiquettes neurones d'entrée */}
          {inputLabels.map((lbl, ni) => (
            <text key={`il${ni}`} x={layerX[0] - 20} y={layerNeurons[0][ni] + 4}
              textAnchor="end" fill="#6366f1" fontSize="10" fontFamily="sans-serif" fontWeight="600">
              {lbl.replace('\n', ' ')}
            </text>
          ))}
          {/* Valeur d'entrée de notre maison */}
          {['100', '3', '5'].map((v, ni) => (
            <text key={`iv${ni}`} cx={layerX[0]} cy={layerNeurons[0][ni]}
              x={layerX[0]} y={layerNeurons[0][ni] + 4}
              textAnchor="middle" fill="#a5b4fc" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
              {v}
            </text>
          ))}
          {/* Sortie : probabilité */}
          <text x={layerX[3]} y={layerNeurons[3][0] + 4}
            textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
            0.04
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] - 8}
            textAnchor="start" fill="#34d399" fontSize="10" fontFamily="sans-serif">
            → 4%
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] + 6}
            textAnchor="start" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            chance de dépasser
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] + 17}
            textAnchor="start" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            le budget
          </text>
          {/* Labels couches */}
          {layerX.map((x, li) => (
            <g key={`lbl${li}`}>
              <text x={x} y="187" textAnchor="middle" fill={layerColors[li]} fontSize="11"
                fontFamily="sans-serif" fontWeight="600">{layerLabels[li]}</text>
              <text x={x} y="200" textAnchor="middle" fill="#94a3b8" fontSize="10"
                fontFamily="sans-serif">{layerSubs[li]}</text>
            </g>
          ))}
          {/* Nombre de poids entre les couches */}
          {layerX.slice(0, -1).map((x, li) => (
            <text key={`pw${li}`} x={(x + layerX[li + 1]) / 2} y="10" textAnchor="middle"
              fill="#475569" fontSize="10" fontFamily="sans-serif">
              {layerNeurons[li].length * layerNeurons[li + 1].length} poids
            </text>
          ))}
        </svg>
      </div>
      {/* Explication du flux */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
        <div style={{ marginBottom: 6 }}><strong>Étape par étape pour notre maison :</strong></div>
        <div>1️⃣ <strong>Entrée :</strong> [100, 3, 5] — surface, chambres, km du centre</div>
        <div>2️⃣ <strong>Couche cachée 1 (4 neurones, ReLU) :</strong> chaque neurone calcule x@W₁+b₁, puis applique ReLU → produit 4 représentations intermédiaires</div>
        <div>3️⃣ <strong>Couche cachée 2 (3 neurones, ReLU) :</strong> recombine les 4 valeurs → 3 représentations plus abstraites</div>
        <div>4️⃣ <strong>Sortie (1 neurone, Sigmoid) :</strong> compresse le résultat entre 0 et 1 → <strong>0.04 = 4%</strong> de probabilité de dépasser le budget</div>
      </div>

      {/* Qu'est-ce que ReLU ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(139,92,246,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(139,92,246,0.4)' }}>
        <strong style={{ color: '#a78bfa' }}>Qu'est-ce que ReLU ?</strong><br/>
        ReLU signifie <em>Rectified Linear Unit</em>. C'est la fonction d'activation la plus courante. Sa règle est ultra-simple :<br/>
        — si le score du neurone est <strong>négatif</strong> → il retourne <strong>0</strong> (le neurone "ne s'active pas")<br/>
        — si le score est <strong>positif</strong> → il retourne <strong>la valeur telle quelle</strong><br/>
        <em>Exemple : ReLU(−3.2) = 0 &nbsp;|&nbsp; ReLU(7.5) = 7.5 &nbsp;|&nbsp; ReLU(0) = 0</em><br/>
        Pourquoi ? Sans cette non-linéarité, empiler des couches serait inutile (tout se réduirait à une seule multiplication matricielle). ReLU permet au réseau d'apprendre des formes complexes.
      </div>

      {/* Qu'est-ce que Sigmoid ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(52,211,153,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(52,211,153,0.4)' }}>
        <strong style={{ color: '#34d399' }}>Qu'est-ce que Sigmoid ?</strong><br/>
        Sigmoid est la fonction qui convertit <em>n'importe quel nombre réel</em> en un nombre entre 0 et 1. C'est ce qui transforme le score brut du neurone de sortie en <strong>probabilité interprétable</strong>.<br/>
        <em>Exemple : σ(−3.2) ≈ 0.04 → 4% &nbsp;|&nbsp; σ(0) = 0.5 → 50% &nbsp;|&nbsp; σ(2.5) ≈ 0.92 → 92%</em><br/>
        Ici, le neurone de sortie a produit le score brut ≈ −3.2 ; Sigmoid le transforme en 0.04 = <strong>4% de probabilité de dépasser votre budget</strong>. Conclusion : la maison est très probablement dans le budget.
      </div>
    </div>
  )
}

// ── AttentionQKVDiagram ───────────────────────────────────────────────────────
function AttentionQKVDiagram() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px 10px', background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        🔀 Mécanisme Scaled Dot-Product Attention
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
        Cas concret : phrase <em>"Le chat mange du poisson"</em> → pour comprendre "mange", le modèle doit savoir <em>qui</em> mange (→ "chat") et <em>quoi</em> (→ "poisson"). L'attention calcule ces liens automatiquement.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 580 155" style={{ width: '100%', minWidth: 480, maxWidth: 860, height: 'auto', display: 'block' }}>
          <rect x="4" y="40" width="52" height="75" rx="5" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
          {[0,1,2,3,4].map(i => (
            <circle key={i} cx="30" cy={55+i*14} r="4" fill="rgba(99,102,241,0.4)" stroke="#6366f1" strokeWidth="1"/>
          ))}
          <text x="30" y="124" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="sans-serif">X</text>
          <text x="30" y="137" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">5 tokens</text>
          {[45,77,109].map((y2, i) => (
            <line key={i} x1="56" y1="77" x2="72" y2={y2} stroke="rgba(99,102,241,0.4)" strokeWidth="1.2"/>
          ))}
          {[['×WQ','→ Q','#a78bfa',35],['×WK','→ K','#f472b6',67],['×WV','→ V','#34d399',99]].map(([top,bot,color,cy]) => (
            <g key={top}>
              <rect x="73" y={cy-13} width="52" height="28" rx="4" fill={`${color}22`} stroke={color} strokeWidth="1.2"/>
              <text x="99" y={cy+1} textAnchor="middle" fill={color} fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{top}</text>
              <text x="99" y={cy+13} textAnchor="middle" fill={color} fontSize="10" fontFamily="sans-serif">{bot}</text>
            </g>
          ))}
          <line x1="125" y1="48" x2="180" y2="60" stroke="rgba(167,139,250,0.5)" strokeWidth="1.2"/>
          <line x1="125" y1="80" x2="180" y2="73" stroke="rgba(244,114,182,0.5)" strokeWidth="1.2"/>
          <rect x="182" y="42" width="108" height="42" rx="5" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.45)" strokeWidth="1.5"/>
          <text x="236" y="60" textAnchor="middle" fill="#f9a8d4" fontSize="11" fontFamily="'JetBrains Mono',monospace">Q @ Kᵀ / √d_k</text>
          <text x="236" y="76" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">pertinence entre tokens</text>
          <line x1="290" y1="63" x2="310" y2="63" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
          <polygon points="310,59 318,63 310,67" fill="rgba(245,158,11,0.5)"/>
          <rect x="320" y="42" width="88" height="42" rx="5" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
          <text x="364" y="60" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="'JetBrains Mono',monospace">softmax</text>
          <text x="364" y="76" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">poids ∑=1</text>
          <line x1="125" y1="112" x2="416" y2="112" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2"/>
          <line x1="416" y1="112" x2="416" y2="91" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2"/>
          <polygon points="412,91 416,82 420,91" fill="rgba(52,211,153,0.3)"/>
          <line x1="408" y1="63" x2="428" y2="63" stroke="rgba(52,211,153,0.5)" strokeWidth="1.2"/>
          <polygon points="428,59 436,63 428,67" fill="rgba(52,211,153,0.5)"/>
          <rect x="438" y="42" width="108" height="42" rx="5" fill="rgba(52,211,153,0.18)" stroke="rgba(52,211,153,0.6)" strokeWidth="2"/>
          <text x="492" y="60" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">weights @ V</text>
          <text x="492" y="76" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="sans-serif">repr. contextuelle</text>
          {[['Entrée',30],['Projections',99],['Score brut',236],['Poids att.',364],['Sortie',492]].map(([lbl,x]) => (
            <text key={lbl} x={x} y="150" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="sans-serif">{lbl}</text>
          ))}
        </svg>
      </div>

      {/* Qu'est-ce que Q, K, V ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(167,139,250,0.06)', borderRadius: 8, borderLeft: '3px solid rgba(167,139,250,0.4)' }}>
        <strong style={{ color: '#a78bfa' }}>Qu'est-ce que Q, K et V ?</strong><br/>
        Ce sont 3 copies du même texte d'entrée X, transformées par 3 matrices de poids différentes :<br/>
        — <strong style={{ color: '#a78bfa' }}>Q (Query = requête)</strong> : "Qu'est-ce que je cherche ?" — chaque mot formule une question sur les autres.<br/>
        <em>Exemple : le token "mange" demande "qui fait l'action ?" et "sur quoi ?"</em><br/>
        — <strong style={{ color: '#f472b6' }}>K (Key = clé)</strong> : "Est-ce que j'ai ce que tu cherches ?" — chaque mot annonce ce qu'il peut offrir.<br/>
        <em>Exemple : "chat" signale "je suis un sujet animé", "poisson" signale "je suis un objet comestible"</em><br/>
        — <strong style={{ color: '#34d399' }}>V (Value = valeur)</strong> : "Voici mon contenu réel" — ce qui sera effectivement copié si la pertinence est élevée.<br/>
        <em>Exemple : si "chat" est très pertinent pour "mange", son vecteur V sera fortement inclus dans la représentation finale de "mange"</em>
      </div>

      {/* Qu'est-ce que Q @ Kᵀ / √d_k ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(244,114,182,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(244,114,182,0.4)' }}>
        <strong style={{ color: '#f9a8d4' }}>Qu'est-ce que Q @ Kᵀ / √d_k ?</strong><br/>
        C'est le calcul de <strong>pertinence</strong> entre chaque paire de tokens :<br/>
        — <strong>Q @ Kᵀ</strong> : produit scalaire entre la requête d'un token et la clé d'un autre. Plus deux vecteurs pointent dans la même direction, plus le score est élevé → le token est "intéressant" pour la requête.<br/>
        — <strong>/ √d_k</strong> : on divise par la racine de la taille des vecteurs pour éviter que les scores deviennent trop grands (ce qui rendrait le softmax instable). C'est le "scaled" dans Scaled Dot-Product.<br/>
        <em>Résultat : une matrice 5×5 où la case [i, j] = "à quel point le token i fait attention au token j"</em>
      </div>

      {/* Qu'est-ce que softmax ici ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(245,158,11,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(245,158,11,0.4)' }}>
        <strong style={{ color: '#fbbf24' }}>Qu'est-ce que softmax fait ici ?</strong><br/>
        Softmax convertit les scores bruts (n'importe quels nombres réels) en <strong>poids qui somment à 1</strong> — exactement comme des pourcentages.<br/>
        <em>Exemple pour le token "mange" : scores bruts [1.2, 3.8, 0.4, 0.9, 2.1] → softmax → [4%, 78%, 2%, 4%, 12%]</em><br/>
        Interprétation : "mange" fait attention à 78% à "chat" (sujet), 12% à "poisson" (objet), et ignore presque les mots grammaticaux. Ces poids servent ensuite à combiner les vecteurs V pour produire la <strong>représentation contextuelle</strong> finale de "mange" — un vecteur qui sait maintenant qui mange et quoi.
      </div>
    </div>
  )
}

// ── BackpropFlowDiagram ───────────────────────────────────────────────────────
function BackpropFlowDiagram() {
  // Cas concret : maison 100m², 3ch, 5km → prédiction 310 k€, vrai prix 250 k€ → erreur 60 k€ → correction des poids
  const boxes = [
    { x: 4,   label: 'X',      sub: '100, 3, 5',    color: '#6366f1' },
    { x: 116, label: 'z1, a1', sub: 'couche 1',     color: '#8b5cf6' },
    { x: 228, label: 'z2, a2', sub: 'couche 2',     color: '#8b5cf6' },
    { x: 340, label: 'Loss',   sub: '(310−250)²',   color: '#ef4444' },
  ]
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px 10px', background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        🔄 Flux forward → calcul de la perte → backward (gradients)
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
        Cas concret : le réseau prédit <strong style={{ color: '#f87171' }}>310 k€</strong>, le vrai prix est <strong style={{ color: '#34d399' }}>250 k€</strong> → erreur de <strong style={{ color: '#f97316' }}>60 k€</strong> → les poids sont corrigés via backprop
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 460 135" style={{ width: '100%', minWidth: 380, maxWidth: 720, height: 'auto', display: 'block' }}>
          {/* Forward pass label */}
          <text x="222" y="12" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="sans-serif" fontWeight="700">→ FORWARD PASS →</text>
          {/* Boîtes */}
          {boxes.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="20" width="92" height="44" rx="5" fill={`${b.color}20`} stroke={b.color} strokeWidth="1.5" />
              <text x={b.x + 46} y="38" textAnchor="middle" fill={b.color} fontSize="12"
                fontFamily="'JetBrains Mono',monospace" fontWeight="700">{b.label}</text>
              <text x={b.x + 46} y="55" textAnchor="middle" fill="#94a3b8" fontSize="10"
                fontFamily="sans-serif">{b.sub}</text>
            </g>
          ))}
          {/* Flèches forward */}
          {boxes.slice(0, -1).map((b, i) => (
            <g key={i}>
              <line x1={b.x + 92} y1="42" x2={boxes[i + 1].x} y2="42" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
              <polygon points={`${boxes[i + 1].x},37 ${boxes[i + 1].x - 7},42 ${boxes[i + 1].x},47`}
                fill="rgba(99,102,241,0.5)" />
            </g>
          ))}
          {/* Labels opérations forward */}
          {[['X@W1+b1', 162], ['a1@W2+b2', 274]].map(([lbl, x]) => (
            <text key={lbl} x={x} y="17" textAnchor="middle" fill="#475569" fontSize="9.5"
              fontFamily="'JetBrains Mono',monospace">{lbl}</text>
          ))}
          {/* Sortie prédite + vraie valeur */}
          <text x="386" y="76" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="sans-serif">prédit: 310 k€</text>
          <text x="386" y="87" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="sans-serif">réel:   250 k€</text>
          <text x="386" y="98" textAnchor="middle" fill="#f97316" fontSize="10.5" fontFamily="sans-serif" fontWeight="700">erreur: −60 k€</text>
          {/* Backward pass label */}
          <text x="222" y="128" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="sans-serif" fontWeight="700">
            ← BACKWARD PASS (gradient de l'erreur remonte couche par couche) ←
          </text>
          {/* Flèches backward */}
          {boxes.slice(0, -1).map((b, i) => (
            <g key={i}>
              <line x1={boxes[i + 1].x} y1="82" x2={b.x + 92} y2="82"
                stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
              <polygon points={`${b.x + 92},77 ${b.x + 99},82 ${b.x + 92},87`}
                fill="rgba(239,68,68,0.4)" />
            </g>
          ))}
          {/* Labels gradient backward */}
          {[['∂L/∂W1', 162], ['∂L/∂W2', 274]].map(([lbl, x]) => (
            <text key={lbl} x={x} y="97" textAnchor="middle" fill="#fca5a5" fontSize="10"
              fontFamily="'JetBrains Mono',monospace">{lbl}</text>
          ))}
        </svg>
      </div>
      {/* Explication pas à pas */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
        <div style={{ marginBottom: 6 }}><strong>Ce qui se passe exactement pour notre maison :</strong></div>
        <div>1️⃣ <strong>Forward pass :</strong> [100, 3, 5] traverse les couches → le réseau calcule <span style={{ color: '#f87171' }}>310 k€</span></div>
        <div>2️⃣ <strong>Calcul de la perte :</strong> Loss = (310 − 250)² = 3 600 — un nombre qui mesure "à quel point on s'est trompé"</div>
        <div>3️⃣ <strong>Backward pass :</strong> on calcule ∂L/∂W pour chaque poids — cela indique dans quelle direction corriger chaque poids</div>
        <div>4️⃣ <strong>Mise à jour :</strong> W ← W − α × ∂L/∂W. Avec α = 0.001 : le poids "m²" passe de 2.0 à 1.94, rapprochant la prédiction de 250 k€</div>
      </div>

      {/* Qu'est-ce que z et a ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(139,92,246,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(139,92,246,0.4)' }}>
        <strong style={{ color: '#a78bfa' }}>Qu'est-ce que z et a dans "z1, a1" ?</strong><br/>
        Pour chaque couche, il y a <strong>deux valeurs</strong> distinctes :<br/>
        — <strong>z</strong> (pré-activation) : le résultat brut de la multiplication matricielle, <em>avant</em> la fonction d'activation. Ex : z₁ = x@W₁+b₁ = −1.4<br/>
        — <strong>a</strong> (post-activation) : z passé dans ReLU ou Sigmoid. Ex : a₁ = ReLU(−1.4) = 0 (le neurone est "éteint")<br/>
        La distinction est cruciale pour la backprop : le gradient traverse <em>a</em> avant de remonter vers <em>z</em> puis vers <em>W</em>.
      </div>

      {/* Qu'est-ce que la Loss ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(239,68,68,0.05)', borderRadius: 8, borderLeft: '3px solid rgba(239,68,68,0.4)' }}>
        <strong style={{ color: '#f87171' }}>Qu'est-ce que la Loss (perte) ?</strong><br/>
        La Loss est un <strong>nombre unique</strong> qui mesure à quel point le réseau se trompe sur un exemple. Ici on utilise MSE (<em>Mean Squared Error</em>) :<br/>
        <em>Loss = (prédiction − valeur_réelle)² = (310 − 250)² = 3 600</em><br/>
        On met au carré pour deux raisons : (1) rendre l'erreur toujours positive, (2) pénaliser davantage les grosses erreurs. L'objectif de l'entraînement est de minimiser cette valeur sur des milliers d'exemples.
      </div>

      {/* Qu'est-ce que ∂L/∂W ? */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.7, padding: '12px 16px', background: 'rgba(239,68,68,0.04)', borderRadius: 8, borderLeft: '3px solid rgba(239,68,68,0.3)' }}>
        <strong style={{ color: '#fca5a5' }}>Qu'est-ce que ∂L/∂W (le gradient) ?</strong><br/>
        ∂L/∂W se lit "dérivée partielle de la Loss par rapport au poids W". En pratique, ça répond à la question :<br/>
        <em>"Si j'augmente ce poids d'un tout petit peu (+0.001), est-ce que l'erreur monte ou descend, et de combien ?"</em><br/>
        — ∂L/∂W &gt; 0 → ce poids est trop élevé, il faut le <strong>baisser</strong><br/>
        — ∂L/∂W &lt; 0 → ce poids est trop faible, il faut l'<strong>augmenter</strong><br/>
        La mise à jour est : <strong>W ← W − α × ∂L/∂W</strong> (on avance dans la direction opposée au gradient). Après des milliers d'exemples de maisons, les poids convergent vers les vraies valeurs du marché immobilier.
      </div>
    </div>
  )
}

// ── CodeDiagram dispatcher ────────────────────────────────────────────────────
function CodeDiagram({ type }) {
  if (type === 'matrix-multiply') return <MatrixMultiplyDiagram />
  if (type === 'mlp-architecture') return <MLPArchitectureDiagram />
  if (type === 'attention-qkv') return <AttentionQKVDiagram />
  if (type === 'backprop-flow') return <BackpropFlowDiagram />
  return null
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────
function CodeBlock({ content, contentJava, label, language = 'python', lang, onLangChange, annotations, annotationsJava, diagram }) {
  const [copied, setCopied] = useState(false)

  const hasJava      = Boolean(contentJava)
  const activeLang   = hasJava ? lang : 'python'
  const activeContent = activeLang === 'java' && contentJava ? contentJava : content

  let highlighted
  if (language === 'text') {
    highlighted = escapeHtml(activeContent)
  } else if (activeLang === 'java') {
    highlighted = highlightJava(activeContent)
  } else {
    highlighted = highlightPython(activeContent)
  }

  const displayLang = activeLang === 'java' ? 'java 11' : (language || 'python')

  const copy = () => {
    navigator.clipboard.writeText(activeContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-block" style={{ marginBottom: 24 }}>
      <div className="code-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="code-block-dots">
            <span /><span /><span />
          </div>
          {label && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {label}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Language toggle — shown only when Java version exists */}
          {hasJava && (
            <div style={{
              display: 'flex', gap: 2,
              background: 'rgba(0,0,0,0.35)',
              borderRadius: 6, padding: 2,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['java', 'python'].map(l => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  style={{
                    padding: '2px 10px', borderRadius: 4,
                    fontSize: '0.68rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    background: activeLang === l
                      ? (l === 'python' ? 'rgba(99,102,241,0.4)' : 'rgba(251,146,60,0.4)')
                      : 'transparent',
                    color: activeLang === l
                      ? (l === 'python' ? '#818cf8' : '#fb923c')
                      : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {l === 'python' ? '🐍 Python' : '☕ Java'}
                </button>
              ))}
            </div>
          )}

          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            padding: '2px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
          }}>
            {displayLang}
          </span>

          <button
            onClick={copy}
            style={{
              background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`,
              color: copied ? '#34d399' : 'var(--text-muted)',
              borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {copied ? '✓ Copié' : '⎘ Copier'}
          </button>
        </div>
      </div>

      <div
        className="code-block-content"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />

      <AnnotationLegend annotations={activeLang === 'java' && annotationsJava ? annotationsJava : annotations} />
      {diagram && <CodeDiagram type={diagram} />}
    </div>
  )
}

// ── RichText ──────────────────────────────────────────────────────────────────
function RichText({ text, style, tag = 'p' }) {
  if (!text) return null
  return <AutoTooltipText text={text} style={style} tag={tag} />
}

// ── MultiParaRichText — splits on \n\n into multiple paragraphs ───────────────
function MultiParaRichText({ text, style }) {
  if (!text) return null
  const paras = text.split('\n\n').filter(p => p.trim())
  if (paras.length <= 1) {
    // Single paragraph — still handle single \n as <br>
    return (
      <p style={{ margin: 0, ...style }}>
        {text.split('\n').flatMap((line, i, arr) => {
          const node = <AutoTooltipText key={i} text={line} tag="span" style={{}} />
          return i < arr.length - 1 ? [node, <br key={`br${i}`} />] : [node]
        })}
      </p>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {paras.map((para, i) => (
        <p key={i} style={{ margin: 0, ...style }}>
          {para.split('\n').flatMap((line, j, arr) => {
            const node = <AutoTooltipText key={j} text={line} tag="span" style={{}} />
            return j < arr.length - 1 ? [node, <br key={`br${j}`} />] : [node]
          })}
        </p>
      ))}
    </div>
  )
}

// ── LessonContent — owns the language preference ──────────────────────────────
export default function LessonContent({ sections }) {
  const [lang, setLang] = useState('java')

  const handleLangChange = (newLang) => {
    setLang(newLang)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {sections.map((section, i) => (
        <Section key={i} section={section} lang={lang} onLangChange={handleLangChange} />
      ))}
    </div>
  )
}

// ── Section dispatcher ────────────────────────────────────────────────────────
function Section({ section, lang, onLangChange }) {
  switch (section.type) {
    case 'intro':
      return (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: 24,
          borderLeft: '3px solid var(--color-primary)',
        }}>
          <RichText text={section.content} tag="p"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0, fontSize: '1.05rem' }} />
        </div>
      )

    case 'heading':
      return (
        <h3 style={{
          fontSize: '1.25rem', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 12, marginTop: 8,
          paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {section.content}
        </h3>
      )

    case 'text':
      return (
        <RichText text={section.content} tag="p"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }} />
      )

    case 'code':
      return (
        <CodeBlock
          content={section.content}
          contentJava={section.contentJava}
          label={section.label}
          language={section.language}
          lang={lang}
          onLangChange={onLangChange}
          annotations={section.annotations}
          annotationsJava={section.annotationsJava}
          diagram={section.diagram}
        />
      )

    case 'tip':
      return (
        <div style={{
          display: 'flex', gap: 12,
          background: 'rgba(34,211,238,0.07)',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px', marginBottom: 20,
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>💡</span>
          <MultiParaRichText text={section.content}
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }} />
        </div>
      )

    case 'warning':
      return (
        <div style={{
          display: 'flex', gap: 12,
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px', marginBottom: 20,
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <MultiParaRichText text={section.content}
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }} />
        </div>
      )

    case 'example':
      return (
        <div style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden', marginBottom: 20,
        }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(16,185,129,0.1)',
            borderBottom: '1px solid rgba(16,185,129,0.15)',
            fontSize: '0.8rem', fontWeight: 600, color: '#34d399',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>📌</span> {section.title}
          </div>
          <pre style={{
            padding: '16px', fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem', color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0,
          }}>
            {section.content}
          </pre>
        </div>
      )

    case 'list':
      return (
        <ul style={{ marginBottom: 20, paddingLeft: 0, listStyle: 'none' }}>
          {section.items.map((item, i) => (
            <li key={i} style={{
              display: 'flex', gap: 10, padding: '8px 0',
              borderBottom: i < section.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem',
            }}>
              <span style={{ color: 'var(--color-primary-light)', flexShrink: 0, marginTop: 2 }}>▸</span>
              <RichText text={item} tag="span" />
            </li>
          ))}
        </ul>
      )

    case 'cards':
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12, marginBottom: 24,
        }}>
          {section.items.map((card, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)', padding: 16,
              transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{card.icon}</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {card.title}
              </h4>
              <RichText text={card.description} tag="p"
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }} />
            </div>
          ))}
        </div>
      )

    case 'timeline':
      return (
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 7, top: 8, bottom: 8, width: 2,
            background: 'linear-gradient(180deg, var(--color-primary), var(--color-accent))',
            opacity: 0.3, borderRadius: 2,
          }} />
          {section.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 14, position: 'relative' }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--gradient-primary)', flexShrink: 0, marginTop: 3,
                boxShadow: '0 0 8px rgba(99,102,241,0.5)',
              }} />
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                  color: 'var(--color-primary-light)', display: 'block', marginBottom: 2,
                }}>
                  {item.year}
                </span>
                <RichText text={item.event} tag="span"
                  style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} />
              </div>
            </div>
          ))}
        </div>
      )

    case 'check':
      return <CheckSection section={section} />

    case 'summary':
      return <SummarySection section={section} />

    case 'compare':
      return <CompareSection section={section} />

    case 'interactive':
      return <InteractiveSection section={section} />

    case 'prereq':
      return (
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px', marginBottom: 20,
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)', flexShrink: 0 }}>
            📚 Prérequis :
          </span>
          {section.items.map((item, i) => (
            <span key={i} style={{
              fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              color: 'var(--text-secondary)',
            }}>
              {item}
            </span>
          ))}
        </div>
      )

    case 'usecase':
      return (
        <div style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            padding: '10px 18px',
            background: 'rgba(16,185,129,0.09)',
            borderBottom: '1px solid rgba(16,185,129,0.15)',
            fontSize: '0.8rem', fontWeight: 700, color: '#34d399',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>🌍</span> {section.title || 'Cas d\'usage réels'}
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(16,185,129,0.12)', color: '#34d399', flexShrink: 0, marginTop: 2,
                }}>{item.company}</span>
                <RichText text={item.desc} tag="span"
                  style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }} />
              </div>
            ))}
          </div>
        </div>
      )

    case 'params':
      return (
        <div style={{
          background: 'rgba(139,92,246,0.05)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            padding: '10px 18px',
            background: 'rgba(139,92,246,0.09)',
            borderBottom: '1px solid rgba(139,92,246,0.15)',
            fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>⚙️</span> {section.title || 'Effet des hyperparamètres'}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(139,92,246,0.07)' }}>
                  {section.columns.map((col, i) => (
                    <th key={i} style={{
                      padding: '8px 14px', textAlign: 'left', color: '#a78bfa',
                      fontWeight: 700, borderBottom: '1px solid rgba(139,92,246,0.15)',
                      whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < section.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '8px 14px', color: j === 0 ? '#c4b5fd' : 'var(--text-secondary)',
                        fontFamily: j === 0 ? 'var(--font-mono)' : 'inherit', fontWeight: j === 0 ? 600 : 400,
                      }}>
                        <RichText text={cell} tag="span" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'decide':
      return (
        <div style={{
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            padding: '10px 18px',
            background: 'rgba(245,158,11,0.08)',
            borderBottom: '1px solid rgba(245,158,11,0.15)',
            fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>🤔</span> {section.title || 'Quand choisir quel algorithme ?'}
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {section.rules.map((rule, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '8px 12px',
                background: 'rgba(255,255,255,0.02)', borderRadius: 8,
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(245,158,11,0.12)', color: '#fbbf24',
                  flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap',
                }}>Si {rule.condition}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600, flexShrink: 0, marginTop: 2 }}>→</span>
                <RichText text={rule.choice} tag="span"
                  style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }} />
              </div>
            ))}
          </div>
        </div>
      )

    case 'fill':
      return <FillSection section={section} />

    default:
      return null
  }
}

// ── CheckSection — mini-quiz intercalé ────────────────────────────────────────
function CheckSection({ section }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const choose = (i) => {
    if (revealed) return
    setSelected(i)
  }

  const confirm = () => {
    if (selected === null) return
    setRevealed(true)
  }

  const reset = () => { setSelected(null); setRevealed(false) }

  const isCorrect = selected === section.correct

  return (
    <div style={{
      background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: '1rem' }}>✅</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary-light)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Vérification rapide
        </span>
      </div>
      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 16 }}>
        {section.question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {section.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)'
          let border = '1px solid rgba(255,255,255,0.08)'
          let color = 'var(--text-secondary)'
          if (selected === i && !revealed) { bg = 'rgba(99,102,241,0.15)'; border = '1px solid rgba(99,102,241,0.4)'; color = 'var(--text-primary)' }
          if (revealed && i === section.correct) { bg = 'rgba(16,185,129,0.12)'; border = '1px solid rgba(16,185,129,0.35)'; color = '#34d399' }
          if (revealed && selected === i && i !== section.correct) { bg = 'rgba(239,68,68,0.1)'; border = '1px solid rgba(239,68,68,0.3)'; color = '#fca5a5' }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              background: bg, border, borderRadius: 'var(--radius-md)',
              padding: '10px 14px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
              color, fontSize: '0.88rem', lineHeight: 1.4, transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.7 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {revealed && i === section.correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {revealed && selected === i && i !== section.correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </button>
          )
        })}
      </div>
      {!revealed ? (
        <button onClick={confirm} disabled={selected === null} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 16px' }}>
          Valider
        </button>
      ) : (
        <div style={{ marginTop: 4 }}>
          <div style={{
            padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: 10,
            background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: isCorrect ? '#34d399' : '#fbbf24', fontWeight: 600, marginBottom: 4 }}>
              {isCorrect ? '🎉 Bonne piste !' : '💡 Pas tout à fait — voici pourquoi :'}
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {section.explanation}
            </p>
          </div>
          <button onClick={reset} className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
            ↺ Réessayer
          </button>
        </div>
      )}
    </div>
  )
}

// ── FillSection — exercice à trous interactif ────────────────────────────────
function FillSection({ section }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)

  const check = (idx, val) => {
    if (revealed) return
    setAnswers(prev => ({ ...prev, [idx]: val }))
  }

  const allFilled = section.blanks.every((_, i) => answers[i] !== undefined && answers[i] !== '')
  const score = revealed ? section.blanks.filter((b, i) =>
    (answers[i] || '').trim().toLowerCase() === b.answer.toLowerCase()
  ).length : 0

  return (
    <div style={{
      background: 'rgba(99,102,241,0.06)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: '1rem' }}>✏️</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          {section.title || 'Complétez les phrases'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {section.blanks.map((blank, i) => {
          const val = answers[i] || ''
          const isCorrect = revealed && val.trim().toLowerCase() === blank.answer.toLowerCase()
          const isWrong = revealed && !isCorrect
          return (
            <div key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <RichText text={blank.before} tag="span" />
              <input
                type="text"
                value={val}
                onChange={e => check(i, e.target.value)}
                disabled={revealed}
                placeholder="…"
                style={{
                  display: 'inline-block',
                  width: blank.width || 120,
                  padding: '2px 8px',
                  margin: '0 4px',
                  borderRadius: 6,
                  border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.6)' : isWrong ? 'rgba(239,68,68,0.6)' : 'rgba(99,102,241,0.35)'}`,
                  background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.08)',
                  color: isCorrect ? '#34d399' : isWrong ? '#f87171' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.82rem', outline: 'none',
                }}
              />
              {isWrong && (
                <span style={{ color: '#34d399', fontSize: '0.78rem', marginLeft: 4 }}>→ {blank.answer}</span>
              )}
              <RichText text={blank.after || ''} tag="span" />
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={!allFilled}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600,
              background: allFilled ? 'var(--gradient-primary)' : 'rgba(99,102,241,0.1)',
              border: 'none', color: allFilled ? '#fff' : 'var(--text-muted)', cursor: allFilled ? 'pointer' : 'not-allowed',
            }}
          >
            Vérifier
          </button>
        ) : (
          <>
            <span style={{
              fontSize: '0.88rem', fontWeight: 700,
              color: score === section.blanks.length ? '#34d399' : '#fbbf24',
            }}>
              {score}/{section.blanks.length} correct{score > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { setAnswers({}); setRevealed(false) }}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── SummarySection — récapitulatif visuel ─────────────────────────────────────
function SummarySection({ section }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(6,182,212,0.04))',
      border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: '1.1rem' }}>🗒️</span>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
          {section.title || 'Ce qu\'on a appris'}
        </h4>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {section.items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 800, color: '#34d399', marginTop: 1,
            }}>{i + 1}</span>
            <AutoTooltipText text={item} tag="span"
              style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }} />
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── CompareSection — côte à côte ──────────────────────────────────────────────
function CompareSection({ section }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}
      className="compare-grid">
      {[section.before, section.after].map((col, ci) => {
        const isAfter = ci === 1
        return (
          <div key={ci} style={{
            background: isAfter ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
            border: `1px solid ${isAfter ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius: 'var(--radius-md)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '8px 14px',
              background: isAfter ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
              borderBottom: `1px solid ${isAfter ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
              fontSize: '0.8rem', fontWeight: 700,
              color: isAfter ? '#34d399' : '#fca5a5',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {isAfter ? '✓' : '✗'} {col.label}
            </div>
            <ul style={{ margin: 0, padding: '12px 14px 14px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {col.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: isAfter ? '#34d399' : '#fca5a5', flexShrink: 0, fontSize: '0.75rem', marginTop: 3 }}>
                    {isAfter ? '▸' : '▸'}
                  </span>
                  <AutoTooltipText text={item} tag="span"
                    style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }} />
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

// ── InteractiveSection — widgets paramétriques ────────────────────────────────
function InteractiveSection({ section }) {
  if (section.widget === 'gradient-descent') return <GradientDescentWidget />
  if (section.widget === 'temperature') return <TemperatureWidget />
  return null
}
