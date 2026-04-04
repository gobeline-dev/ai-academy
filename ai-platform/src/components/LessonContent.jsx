import { useState } from 'react'
import { AutoTooltipText } from './Tooltip.jsx'

function CodeBlock({ content, label, language = 'python' }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const highlighted = highlightPython(content)

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
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            padding: '2px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
          }}>
            {language}
          </span>
          <button
            onClick={copy}
            style={{
              background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`,
              color: copied ? '#34d399' : 'var(--text-muted)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
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
    </div>
  )
}

function highlightPython(code) {
  // Escape HTML entities first (on raw code, before any tagging)
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Single-pass tokenizer: alternatives are tried left-to-right, first match wins.
  // This prevents later patterns from re-matching already-tagged content.
  const TOKEN = new RegExp(
    // 1. Triple-quoted strings
    '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\')'
    // 2. Single-quoted strings
    + '|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')'
    // 3. Comments
    + '|(#[^\\n]*)'
    // 4. f-string prefix
    + '|(f(?=["\']))'
    // 5. Decorators
    + '|(@\\w+)'
    // 6. Keywords
    + '|\\b(def|class|return|import|from|as|if|else|elif|for|while|in|not|and|or|True|False|None|with|try|except|raise|yield|lambda|pass|break|continue|async|await)\\b'
    // 7. Built-ins
    + '|\\b(print|len|range|enumerate|zip|map|filter|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|max|min|sum|sorted|any|all)\\b'
    // 8. Numbers
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

// Renders markdown AND wraps glossary terms with tooltips
function RichText({ text, style, tag = 'p' }) {
  if (!text) return null

  // First, split by markdown bold/code/italic
  // We'll render via dangerouslySetInnerHTML for bold/italic/code,
  // but overlay AutoTooltipText on top for tooltip detection.
  // Simplest approach: use AutoTooltipText with raw text (no markdown),
  // then render bold/code separately inside.
  return <AutoTooltipText text={text} style={style} tag={tag} />
}

export default function LessonContent({ sections }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {sections.map((section, i) => (
        <Section key={i} section={section} />
      ))}
    </div>
  )
}

function Section({ section }) {
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
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 12,
          marginTop: 8,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
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
          label={section.label}
          language={section.language}
        />
      )

    case 'tip':
      return (
        <div style={{
          display: 'flex',
          gap: 12,
          background: 'rgba(34,211,238,0.07)',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>💡</span>
          <RichText text={section.content} tag="p"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }} />
        </div>
      )

    case 'warning':
      return (
        <div style={{
          display: 'flex',
          gap: 12,
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: 20,
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
          overflow: 'hidden',
          marginBottom: 20,
        }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(16,185,129,0.1)',
            borderBottom: '1px solid rgba(16,185,129,0.15)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>📌</span> {section.title}
          </div>
          <pre style={{
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            margin: 0,
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
              display: 'flex',
              gap: 10,
              padding: '8px 0',
              borderBottom: i < section.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontSize: '0.9rem',
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
          gap: 12,
          marginBottom: 24,
        }}>
          {section.items.map((card, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
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
            position: 'absolute',
            left: 7, top: 8, bottom: 8, width: 2,
            background: 'linear-gradient(180deg, var(--color-primary), var(--color-accent))',
            opacity: 0.3,
            borderRadius: 2,
          }} />
          {section.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 14, position: 'relative' }}>
              <div style={{
                width: 16, height: 16,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                flexShrink: 0,
                marginTop: 3,
                boxShadow: '0 0 8px rgba(99,102,241,0.5)',
              }} />
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--color-primary-light)',
                  display: 'block',
                  marginBottom: 2,
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

    default:
      return null
  }
}
