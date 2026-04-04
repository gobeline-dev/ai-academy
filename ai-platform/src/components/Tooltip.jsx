import { useState, useRef, useEffect } from 'react'

// ── Glossaire IA ──────────────────────────────────────────────────────────────
export const GLOSSARY = {
  // Fondations
  'gradient descent':     { fr: 'Descente de gradient', def: 'Algorithme d\'optimisation qui ajuste les paramètres d\'un modèle en suivant la direction opposée au gradient de la fonction de perte.' },
  'descente de gradient': { fr: 'Descente de gradient', def: 'Algorithme d\'optimisation qui ajuste les paramètres d\'un modèle en suivant la direction opposée au gradient de la fonction de perte.' },
  'backpropagation':      { fr: 'Rétropropagation', def: 'Algorithme calculant le gradient de chaque paramètre en propageant l\'erreur de la sortie vers l\'entrée via la règle de dérivation en chaîne.' },
  'rétropropagation':     { fr: 'Rétropropagation', def: 'Algorithme calculant le gradient de chaque paramètre en propageant l\'erreur de la sortie vers l\'entrée via la règle de dérivation en chaîne.' },
  'overfitting':          { fr: 'Surapprentissage', def: 'Le modèle mémorise les données d\'entraînement au lieu de généraliser : très performant sur les données vues, moins sur les nouvelles.' },
  'surapprentissage':     { fr: 'Surapprentissage', def: 'Le modèle mémorise les données d\'entraînement au lieu de généraliser : très performant sur les données vus, moins sur les nouvelles.' },
  'underfitting':         { fr: 'Sous-apprentissage', def: 'Le modèle est trop simple pour capturer les patterns des données — il échoue même sur les données d\'entraînement.' },
  'dropout':              { fr: 'Dropout', def: 'Technique de régularisation : désactive aléatoirement des neurones durant l\'entraînement pour forcer le réseau à ne pas dépendre d\'une seule connexion.' },
  'batch normalization':  { fr: 'Batch Normalization', def: 'Normalise les activations intermédiaires d\'un réseau pour stabiliser et accélérer l\'entraînement.' },
  'hyperparameter':       { fr: 'Hyperparamètre', def: 'Paramètre défini avant l\'entraînement (learning rate, taille de batch, nombre de couches...) et non appris par le modèle.' },
  'hyperparamètre':       { fr: 'Hyperparamètre', def: 'Paramètre défini avant l\'entraînement (learning rate, taille de batch, nombre de couches...) et non appris par le modèle.' },
  'learning rate':        { fr: 'Taux d\'apprentissage', def: 'Contrôle la taille des pas lors de la mise à jour des paramètres. Trop élevé → instabilité. Trop faible → convergence lente.' },
  'taux d\'apprentissage':{ fr: 'Taux d\'apprentissage', def: 'Contrôle la taille des pas lors de la mise à jour des paramètres. Trop élevé → instabilité. Trop faible → convergence lente.' },

  // Modèles
  'transformer':          { fr: 'Transformer', def: 'Architecture basée sur le mécanisme d\'attention, introduite en 2017. Fondation de tous les LLMs modernes (GPT, BERT, Llama...).' },
  'attention':            { fr: 'Attention', def: 'Mécanisme permettant au modèle de pondérer l\'importance de chaque token par rapport aux autres lors du traitement d\'une séquence.' },
  'embedding':            { fr: 'Embedding', def: 'Représentation vectorielle dense d\'un token, mot ou document dans un espace continu. Les mots sémantiquement proches ont des vecteurs proches.' },
  'token':                { fr: 'Token', def: 'Unité de base du texte pour un LLM. Peut être un mot, un sous-mot ou un caractère selon le tokenizer. GPT-4 utilise ~75% de mots entiers.' },
  'llm':                  { fr: 'Large Language Model', def: 'Modèle de langage entraîné sur des milliards de tokens. Peut générer, résumer, traduire et raisonner en langage naturel.' },
  'fine-tuning':          { fr: 'Fine-tuning', def: 'Ré-entraînement partiel d\'un modèle pré-entraîné sur un dataset spécifique pour l\'adapter à une tâche précise.' },
  'rag':                  { fr: 'RAG', def: 'Retrieval-Augmented Generation — combine un LLM avec une base de connaissances externe pour répondre avec des informations à jour et sourcées.' },
  'vector database':      { fr: 'Base de données vectorielle', def: 'Base de données optimisée pour stocker et rechercher des vecteurs par similarité cosinus ou euclidienne (ex: Pinecone, Weaviate, Chroma).' },
  'base vectorielle':     { fr: 'Base de données vectorielle', def: 'Base de données optimisée pour stocker et rechercher des vecteurs par similarité cosinus ou euclidienne (ex: Pinecone, Weaviate, Chroma).' },
  'prompt':               { fr: 'Prompt', def: 'Instruction ou contexte textuel fourni à un LLM. La qualité du prompt influence directement la qualité de la réponse.' },
  'context window':       { fr: 'Fenêtre de contexte', def: 'Nombre maximal de tokens qu\'un LLM peut traiter en une seule fois (entrée + sortie). GPT-4 Turbo : 128k, Claude 3.5 : 200k.' },
  'fenêtre de contexte':  { fr: 'Fenêtre de contexte', def: 'Nombre maximal de tokens qu\'un LLM peut traiter en une seule fois. Limite la longueur des conversations et des documents analysables.' },

  // Architectures
  'cnn':                  { fr: 'CNN (Réseau Convolutif)', def: 'Architecture idéale pour les images : utilise des filtres coulissants pour détecter des features locales (bords, textures, formes).' },
  'rnn':                  { fr: 'RNN (Réseau Récurrent)', def: 'Traite des séquences en maintenant un état caché. Remplacé par les Transformers pour la plupart des tâches NLP.' },
  'lstm':                 { fr: 'LSTM', def: 'Long Short-Term Memory — variant du RNN avec une mémoire à long terme explicite pour éviter le problème du gradient qui disparaît.' },

  // Entraînement
  'epoch':                { fr: 'Epoch', def: 'Un passage complet sur l\'ensemble du dataset d\'entraînement. Plusieurs epochs sont nécessaires pour converger.' },
  'batch':                { fr: 'Batch', def: 'Sous-ensemble des données utilisé pour calculer le gradient avant chaque mise à jour des poids.' },
  'loss function':        { fr: 'Fonction de perte', def: 'Mesure l\'écart entre la prédiction du modèle et la valeur réelle. L\'objectif est de minimiser cette valeur durant l\'entraînement.' },
  'fonction de perte':    { fr: 'Fonction de perte', def: 'Mesure l\'écart entre la prédiction du modèle et la valeur réelle. L\'objectif est de minimiser cette valeur durant l\'entraînement.' },

  // Agents / MCP
  'agent':                { fr: 'Agent IA', def: 'Programme autonome qui perçoit son environnement, planifie et exécute des actions (appels d\'outils, recherches...) pour atteindre un objectif.' },
  'mcp':                  { fr: 'MCP (Model Context Protocol)', def: 'Protocole open-source d\'Anthropic permettant aux LLMs de se connecter à des outils et sources de données externes de façon standardisée.' },
  'tool use':             { fr: 'Tool Use / Function Calling', def: 'Capacité d\'un LLM à appeler des fonctions externes (APIs, recherches, calculs) intégrées dans son contexte de réponse.' },
  'temperature':          { fr: 'Température', def: 'Paramètre contrôlant le degré de créativité du LLM. 0 = déterministe, 1+ = plus aléatoire et créatif.' },
}

// Lookup case-insensitive
function lookupTerm(text) {
  const lower = text.toLowerCase().trim()
  return GLOSSARY[lower] || null
}

// ── Tooltip component ─────────────────────────────────────────────────────────
export function GlossaryTooltip({ term, children }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: true })
  const ref = useRef(null)

  useEffect(() => {
    if (!open || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ top: rect.top > 160 })
  }, [open])

  const entry = lookupTerm(term)
  if (!entry) return <>{children}</>

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{
        borderBottom: '1px dashed rgba(129,140,248,0.6)',
        color: 'var(--color-primary-light)',
        cursor: 'help',
        textDecorationSkipInk: 'none',
      }}>
        {children}
      </span>

      {open && (
        <span style={{
          position: 'absolute',
          [pos.top ? 'bottom' : 'top']: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          width: 260,
          background: 'rgba(10, 14, 30, 0.98)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 10,
          padding: '10px 13px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.15)',
          backdropFilter: 'blur(16px)',
          display: 'block',
          animation: 'tooltipIn 0.15s ease',
          pointerEvents: 'none',
        }}>
          <style>{`
            @keyframes tooltipIn {
              from { opacity:0; transform:translateX(-50%) translateY(4px); }
              to   { opacity:1; transform:translateX(-50%) translateY(0); }
            }
          `}</style>
          {/* Caret */}
          <span style={{
            position: 'absolute',
            [pos.top ? 'bottom' : 'top']: -5,
            left: '50%',
            transform: pos.top ? 'translateX(-50%) rotate(-45deg)' : 'translateX(-50%) rotate(135deg)',
            width: 8, height: 8,
            background: 'rgba(10,14,30,0.98)',
            border: `1px solid rgba(99,102,241,0.35)`,
            borderRight: 'none', borderTop: 'none',
          }} />
          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', marginBottom: 5, letterSpacing: '0.02em' }}>
            📖 {entry.fr}
          </span>
          <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.55 }}>
            {entry.def}
          </span>
        </span>
      )}
    </span>
  )
}

// ── Parse markdown into typed segments ───────────────────────────────────────
function parseMarkdown(text) {
  const segments = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let lastIndex = 0
  let match
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }
    const raw = match[0]
    if (raw.startsWith('**')) {
      segments.push({ type: 'bold', text: raw.slice(2, -2) })
    } else if (raw.startsWith('`')) {
      segments.push({ type: 'code', text: raw.slice(1, -1) })
    } else {
      segments.push({ type: 'italic', text: raw.slice(1, -1) })
    }
    lastIndex = match.index + raw.length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) })
  }
  return segments
}

// ── Annotate a plain-text string with glossary tooltips ──────────────────────
const SORTED_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)

function annotateGlossary(text, baseKey) {
  const nodes = []
  let remaining = text
  let key = baseKey * 10000

  while (remaining.length > 0) {
    let foundAt = -1
    let foundTerm = null

    for (const term of SORTED_TERMS) {
      const idx = remaining.toLowerCase().indexOf(term)
      if (idx === -1) continue
      // Ensure it's a word boundary (not inside a larger word)
      const before = idx === 0 ? '' : remaining[idx - 1]
      const after = remaining[idx + term.length] ?? ''
      const wordChar = /\w/
      if (wordChar.test(before) || wordChar.test(after)) continue
      if (foundAt === -1 || idx < foundAt) {
        foundAt = idx
        foundTerm = term
      }
    }

    if (foundAt === -1 || !foundTerm) {
      nodes.push(<span key={key++}>{remaining}</span>)
      break
    }

    if (foundAt > 0) {
      nodes.push(<span key={key++}>{remaining.slice(0, foundAt)}</span>)
    }

    const originalText = remaining.slice(foundAt, foundAt + foundTerm.length)
    nodes.push(
      <GlossaryTooltip key={key++} term={foundTerm}>
        {originalText}
      </GlossaryTooltip>
    )
    remaining = remaining.slice(foundAt + foundTerm.length)
  }
  return nodes
}

// ── AutoTooltipText: renders markdown + glossary tooltips ────────────────────
export function AutoTooltipText({ text, style, tag: Tag = 'span' }) {
  if (!text) return null

  const mdSegments = parseMarkdown(text)
  const nodes = []
  let key = 0

  for (const seg of mdSegments) {
    if (seg.type === 'code') {
      nodes.push(<code key={key++}>{seg.text}</code>)
    } else if (seg.type === 'bold') {
      nodes.push(
        <strong key={key++} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {annotateGlossary(seg.text, key)}
        </strong>
      )
    } else if (seg.type === 'italic') {
      nodes.push(<em key={key++}>{seg.text}</em>)
    } else {
      nodes.push(...annotateGlossary(seg.text, key))
    }
    key++
  }

  return <Tag style={style}>{nodes}</Tag>
}
