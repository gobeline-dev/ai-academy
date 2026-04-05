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
      <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        🏠 Cas concret : prédire le prix d'une maison — x @ W + b = sortie
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
        Maison : <strong style={{ color: '#a5b4fc' }}>100 m²</strong>, <strong style={{ color: '#a5b4fc' }}>3 chambres</strong>, <strong style={{ color: '#a5b4fc' }}>5 km</strong> du centre → le réseau produit 2 valeurs en parallèle
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 620 158" style={{ width: '100%', minWidth: 440, maxWidth: 620, height: 'auto', display: 'block' }}>

          {/* ── x : vecteur d'entrée ── */}
          <rect x="4" y="18" width="78" height="90" rx="5" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
          <text x="43" y="13" textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="sans-serif">x (caractéristiques)</text>
          {/* valeurs + étiquettes */}
          <text x="40" y="42" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily="'JetBrains Mono',monospace" fontWeight="700">100</text>
          <text x="74" y="42" textAnchor="end" fill="#475569" fontSize="8" fontFamily="sans-serif">m²</text>
          <text x="40" y="65" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily="'JetBrains Mono',monospace" fontWeight="700">3</text>
          <text x="74" y="65" textAnchor="end" fill="#475569" fontSize="8" fontFamily="sans-serif">ch.</text>
          <text x="40" y="88" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily="'JetBrains Mono',monospace" fontWeight="700">5</text>
          <text x="74" y="88" textAnchor="end" fill="#475569" fontSize="8" fontFamily="sans-serif">km</text>
          <text x="43" y="118" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">3 features</text>

          {/* ── @ ── */}
          <text x="94" y="70" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="700">@</text>

          {/* ── W : matrice des poids ── */}
          <rect x="104" y="18" width="124" height="90" rx="5" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
          <text x="166" y="13" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="sans-serif">W (poids appris)</text>
          {/* Séparateur de colonnes */}
          <line x1="166" y1="19" x2="166" y2="106" stroke="rgba(139,92,246,0.25)" strokeWidth="1"/>
          {/* En-têtes colonnes */}
          <text x="135" y="30" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="sans-serif">→ prix k€</text>
          <text x="197" y="30" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="sans-serif">→ score</text>
          {/* Valeurs : [m² row, ch. row, km row] */}
          {[['2.0','0.5'],['15.0','8.0'],['-5.0','-3.0']].map((row, ri) =>
            row.map((v, ci) => (
              <text key={`w${ri}${ci}`} x={ci===0 ? 135 : 197} y={44+ri*22} textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="'JetBrains Mono',monospace">{v}</text>
            ))
          )}
          <text x="166" y="118" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">3 features → 2 sorties</text>

          {/* ── + ── */}
          <text x="238" y="70" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="700">+</text>

          {/* ── b : biais ── */}
          <rect x="248" y="32" width="66" height="62" rx="5" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.45)" strokeWidth="1.5"/>
          <text x="281" y="27" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="sans-serif">b (biais)</text>
          <text x="281" y="56" textAnchor="middle" fill="#67e8f9" fontSize="12" fontFamily="'JetBrains Mono',monospace">50.0</text>
          <text x="281" y="78" textAnchor="middle" fill="#67e8f9" fontSize="12" fontFamily="'JetBrains Mono',monospace">20.0</text>
          <text x="281" y="105" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">2 valeurs</text>

          {/* ── = ── */}
          <text x="326" y="70" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="700">=</text>

          {/* ── Sortie ── */}
          <rect x="338" y="32" width="82" height="62" rx="5" fill="rgba(52,211,153,0.18)" stroke="rgba(52,211,153,0.6)" strokeWidth="2"/>
          <text x="379" y="27" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="sans-serif">sortie</text>
          <text x="379" y="55" textAnchor="middle" fill="#6ee7b7" fontSize="15" fontFamily="'JetBrains Mono',monospace" fontWeight="700">270</text>
          <text x="413" y="55" textAnchor="start" fill="#475569" fontSize="8" fontFamily="sans-serif">k€</text>
          <text x="379" y="78" textAnchor="middle" fill="#6ee7b7" fontSize="15" fontFamily="'JetBrains Mono',monospace" fontWeight="700">79</text>
          <text x="413" y="78" textAnchor="start" fill="#475569" fontSize="8" fontFamily="sans-serif">score</text>
          <text x="379" y="105" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">2 neurones</text>

          {/* ── Détail des calculs ── */}
          <line x1="432" y1="18" x2="432" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <text x="438" y="14" fill="#818cf8" fontSize="8" fontFamily="sans-serif" fontWeight="700">Détail des calculs :</text>
          {/* Calcul sortie 0 : prix */}
          <text x="438" y="30" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">100×2.0 = 200  (surface)</text>
          <text x="438" y="42" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">  3×15.0 = 45   (chambres)</text>
          <text x="438" y="54" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">  5×(−5.0) = −25 (distance)</text>
          <text x="438" y="66" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">  biais    = +50</text>
          <text x="438" y="79" fill="#34d399" fontSize="9.5" fontFamily="'JetBrains Mono',monospace" fontWeight="700">→ prix = 270 k€ ✓</text>
          {/* Séparateur */}
          <line x1="438" y1="87" x2="615" y2="87" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          {/* Calcul sortie 1 : score */}
          <text x="438" y="99" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">100×0.5 = 50   3×8.0 = 24</text>
          <text x="438" y="111" fill="#475569" fontSize="8" fontFamily="'JetBrains Mono',monospace">5×(−3.0) = −15  biais = +20</text>
          <text x="438" y="124" fill="#34d399" fontSize="9.5" fontFamily="'JetBrains Mono',monospace" fontWeight="700">→ score = 79/100 ✓</text>
        </svg>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5, padding: '8px 12px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
        💡 <strong>Interprétation des poids :</strong> chaque m² ajoute <strong>+2 000 €</strong> au prix, chaque chambre <strong>+15 000 €</strong>, chaque km du centre <strong>−5 000 €</strong> (poids négatif = pénalité). Le biais (50 k€) représente un prix de base.
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
      <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        🧠 MLP([3, 4, 3, 1]) — 35 paramètres apprenables (27 poids + 8 biais)
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
        Cas concret : <strong style={{ color: '#a5b4fc' }}>est-ce que cette maison (100 m², 3 ch., 5 km) dépasse mon budget de 280 k€ ?</strong>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 490 210" style={{ width: '100%', minWidth: 320, maxWidth: 490, height: 'auto', display: 'block' }}>
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
              textAnchor="end" fill="#6366f1" fontSize="7.5" fontFamily="sans-serif" fontWeight="600">
              {lbl.replace('\n', ' ')}
            </text>
          ))}
          {/* Valeur d'entrée de notre maison */}
          {['100', '3', '5'].map((v, ni) => (
            <text key={`iv${ni}`} cx={layerX[0]} cy={layerNeurons[0][ni]}
              x={layerX[0]} y={layerNeurons[0][ni] + 4}
              textAnchor="middle" fill="#a5b4fc" fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
              {v}
            </text>
          ))}
          {/* Sortie : probabilité */}
          <text x={layerX[3]} y={layerNeurons[3][0] + 4}
            textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
            0.04
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] - 8}
            textAnchor="start" fill="#34d399" fontSize="7.5" fontFamily="sans-serif">
            → 4%
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] + 4}
            textAnchor="start" fill="#475569" fontSize="7" fontFamily="sans-serif">
            chance de
          </text>
          <text x={layerX[3] + 18} y={layerNeurons[3][0] + 14}
            textAnchor="start" fill="#475569" fontSize="7" fontFamily="sans-serif">
            dépasser budget
          </text>
          {/* Labels couches */}
          {layerX.map((x, li) => (
            <g key={`lbl${li}`}>
              <text x={x} y="187" textAnchor="middle" fill={layerColors[li]} fontSize="9.5"
                fontFamily="sans-serif" fontWeight="600">{layerLabels[li]}</text>
              <text x={x} y="200" textAnchor="middle" fill="#475569" fontSize="8.5"
                fontFamily="sans-serif">{layerSubs[li]}</text>
            </g>
          ))}
          {/* Nombre de poids entre les couches */}
          {layerX.slice(0, -1).map((x, li) => (
            <text key={`pw${li}`} x={(x + layerX[li + 1]) / 2} y="10" textAnchor="middle"
              fill="#334155" fontSize="8" fontFamily="sans-serif">
              {layerNeurons[li].length * layerNeurons[li + 1].length} poids
            </text>
          ))}
        </svg>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5, padding: '8px 12px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
        💡 <strong>Comment lire ce schéma :</strong> les 3 valeurs de la maison entrent à gauche. Chaque couche "cachée" recombine les informations différemment (via ReLU). La sortie Sigmoid écrase tout entre 0 et 1 → probabilité que le prix dépasse votre budget. Ici : 4%, donc la maison est dans le budget.
      </div>
    </div>
  )
}

// ── AttentionQKVDiagram ───────────────────────────────────────────────────────
function AttentionQKVDiagram() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px 10px', background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        🔀 Mécanisme Scaled Dot-Product Attention
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 580 155" style={{ width: '100%', minWidth: 420, maxWidth: 580, height: 'auto', display: 'block' }}>
          <rect x="4" y="40" width="52" height="75" rx="5" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
          {[0,1,2,3,4].map(i => (
            <circle key={i} cx="30" cy={55+i*14} r="4" fill="rgba(99,102,241,0.4)" stroke="#6366f1" strokeWidth="1"/>
          ))}
          <text x="30" y="124" textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="sans-serif">X</text>
          <text x="30" y="135" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">5 tokens</text>
          {[45,77,109].map((y2, i) => (
            <line key={i} x1="56" y1="77" x2="72" y2={y2} stroke="rgba(99,102,241,0.4)" strokeWidth="1.2"/>
          ))}
          {[['×WQ','→ Q','#a78bfa',35],['×WK','→ K','#f472b6',67],['×WV','→ V','#34d399',99]].map(([top,bot,color,cy]) => (
            <g key={top}>
              <rect x="73" y={cy-13} width="52" height="28" rx="4" fill={`${color}22`} stroke={color} strokeWidth="1.2"/>
              <text x="99" y={cy+1} textAnchor="middle" fill={color} fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{top}</text>
              <text x="99" y={cy+12} textAnchor="middle" fill={color} fontSize="9" fontFamily="sans-serif">{bot}</text>
            </g>
          ))}
          <line x1="125" y1="48" x2="180" y2="60" stroke="rgba(167,139,250,0.5)" strokeWidth="1.2"/>
          <line x1="125" y1="80" x2="180" y2="73" stroke="rgba(244,114,182,0.5)" strokeWidth="1.2"/>
          <rect x="182" y="42" width="108" height="42" rx="5" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.45)" strokeWidth="1.5"/>
          <text x="236" y="60" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontFamily="'JetBrains Mono',monospace">Q @ Kᵀ / √d_k</text>
          <text x="236" y="75" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">pertinence entre tokens</text>
          <line x1="290" y1="63" x2="310" y2="63" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
          <polygon points="310,59 318,63 310,67" fill="rgba(245,158,11,0.5)"/>
          <rect x="320" y="42" width="88" height="42" rx="5" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5"/>
          <text x="364" y="60" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="'JetBrains Mono',monospace">softmax</text>
          <text x="364" y="75" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">poids ∑=1</text>
          <line x1="125" y1="112" x2="416" y2="112" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2"/>
          <line x1="416" y1="112" x2="416" y2="91" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2"/>
          <polygon points="412,91 416,82 420,91" fill="rgba(52,211,153,0.3)"/>
          <line x1="408" y1="63" x2="428" y2="63" stroke="rgba(52,211,153,0.5)" strokeWidth="1.2"/>
          <polygon points="428,59 436,63 428,67" fill="rgba(52,211,153,0.5)"/>
          <rect x="438" y="42" width="108" height="42" rx="5" fill="rgba(52,211,153,0.18)" stroke="rgba(52,211,153,0.6)" strokeWidth="2"/>
          <text x="492" y="60" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700">weights @ V</text>
          <text x="492" y="75" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontFamily="sans-serif">repr. contextuelle</text>
          {[['Entrée',30],['Projections',99],['Score',236],['Attention',364],['Sortie',492]].map(([lbl,x]) => (
            <text key={lbl} x={x} y="150" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">{lbl}</text>
          ))}
        </svg>
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
      <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        🔄 Flux forward → calcul de la perte → backward (gradients)
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
        Cas concret : le réseau prédit <strong style={{ color: '#f87171' }}>310 k€</strong>, le vrai prix est <strong style={{ color: '#34d399' }}>250 k€</strong> → erreur de <strong style={{ color: '#f97316' }}>60 k€</strong> → les poids sont corrigés via backprop
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 460 135" style={{ width: '100%', minWidth: 340, maxWidth: 460, height: 'auto', display: 'block' }}>
          {/* Forward pass label */}
          <text x="222" y="12" textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="sans-serif" fontWeight="700">→ FORWARD PASS →</text>
          {/* Boîtes */}
          {boxes.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="20" width="92" height="44" rx="5" fill={`${b.color}20`} stroke={b.color} strokeWidth="1.5" />
              <text x={b.x + 46} y="38" textAnchor="middle" fill={b.color} fontSize="11"
                fontFamily="'JetBrains Mono',monospace" fontWeight="700">{b.label}</text>
              <text x={b.x + 46} y="55" textAnchor="middle" fill="#475569" fontSize="8.5"
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
            <text key={lbl} x={x} y="17" textAnchor="middle" fill="#334155" fontSize="8"
              fontFamily="'JetBrains Mono',monospace">{lbl}</text>
          ))}
          {/* Sortie prédite + vraie valeur */}
          <text x="386" y="76" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="sans-serif">prédit: 310 k€</text>
          <text x="386" y="86" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="sans-serif">réel:   250 k€</text>
          <text x="386" y="96" textAnchor="middle" fill="#f97316" fontSize="8.5" fontFamily="sans-serif" fontWeight="700">erreur: −60 k€</text>
          {/* Backward pass label */}
          <text x="222" y="128" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="sans-serif" fontWeight="700">
            ← BACKWARD PASS (le gradient de l'erreur remonte couche par couche) ←
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
            <text key={lbl} x={x} y="97" textAnchor="middle" fill="#fca5a5" fontSize="8"
              fontFamily="'JetBrains Mono',monospace">{lbl}</text>
          ))}
        </svg>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5, padding: '8px 12px', background: 'rgba(239,68,68,0.04)', borderRadius: 8 }}>
        💡 <strong>Comment ça corrige les poids :</strong> le gradient ∂L/∂W mesure "si j'augmente ce poids d'un tout petit peu, est-ce que l'erreur monte ou descend ?". On le soustrait (× taux d'apprentissage) pour réduire l'erreur. Après des milliers d'exemples de maisons, les poids convergent vers les vraies valeurs du marché.
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

// ── Pyodide singleton loader ───────────────────────────────────────────────────
let pyodideInstance = null
let pyodideLoading = null

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoading) return pyodideLoading

  pyodideLoading = (async () => {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js'
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
    }
    pyodideInstance = await window.loadPyodide()
    return pyodideInstance
  })()

  return pyodideLoading
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────
function CodeBlock({ content, contentJava, label, language = 'python', lang, onLangChange, annotations, diagram }) {
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)

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

  const runPython = async () => {
    setRunning(true)
    setOutput(null)
    try {
      const py = await getPyodide()
      const lines = []
      py.setStdout({ batched: s => lines.push(s) })
      py.setStderr({ batched: s => lines.push('⚠ ' + s) })
      await py.runPythonAsync(activeContent)
      setOutput({ ok: true, text: lines.join('\n') || '(aucune sortie)' })
    } catch (e) {
      setOutput({ ok: false, text: String(e.message || e) })
    } finally {
      setRunning(false)
    }
  }

  const canRun = activeLang === 'python' && language !== 'text'

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

          {canRun && (
            <button
              onClick={runPython}
              disabled={running}
              style={{
                background: running ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: running ? 'var(--text-muted)' : '#34d399',
                borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem',
                cursor: running ? 'default' : 'pointer', transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {running ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Chargement…</> : '▶ Exécuter'}
            </button>
          )}

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

      {output !== null && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: output.ok ? '#86efac' : '#fca5a5',
          background: output.ok ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', marginBottom: 4 }}>
            {output.ok ? '▶ Sortie' : '✗ Erreur'}
          </span>
          {output.text}
        </div>
      )}
      <AnnotationLegend annotations={annotations} />
      {diagram && <CodeDiagram type={diagram} />}
    </div>
  )
}

// ── RichText ──────────────────────────────────────────────────────────────────
function RichText({ text, style, tag = 'p' }) {
  if (!text) return null
  return <AutoTooltipText text={text} style={style} tag={tag} />
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
          <RichText text={section.content} tag="p"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }} />
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
          <RichText text={section.content} tag="p"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }} />
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
