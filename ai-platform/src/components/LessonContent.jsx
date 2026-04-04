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
function CodeBlock({ content, contentJava, label, language = 'python', lang, onLangChange }) {
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
