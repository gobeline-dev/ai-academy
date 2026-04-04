import { useEffect, useState } from 'react'
import { RARITY_CONFIG } from '../data/achievements.js'

const DISPLAY_DURATION = 4500

export default function AchievementToast({ newlyUnlocked, onShift }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const current = newlyUnlocked[0]

  useEffect(() => {
    if (!current) { setVisible(false); return }
    setExiting(false)
    setVisible(true)

    const exitTimer = setTimeout(() => setExiting(true), DISPLAY_DURATION - 400)
    const shiftTimer = setTimeout(() => { onShift() }, DISPLAY_DURATION)

    return () => { clearTimeout(exitTimer); clearTimeout(shiftTimer) }
  }, [current?.id])

  if (!current || !visible) return null

  const rarity = RARITY_CONFIG[current.rarity]

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: 28,
      zIndex: 9999,
      maxWidth: 340,
      animation: exiting ? 'toastOut 0.4s ease forwards' : 'toastIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    }}>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-60px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(-40px) scale(0.95); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes iconBounce {
          0%,100% { transform: scale(1); }
          30% { transform: scale(1.3) rotate(-10deg); }
          60% { transform: scale(0.95) rotate(5deg); }
        }
        @keyframes rarityShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div style={{
        background: 'rgba(10, 12, 24, 0.97)',
        border: `1px solid ${rarity.border}`,
        borderLeft: `4px solid ${rarity.color}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `${rarity.glow}, 0 20px 60px rgba(0,0,0,0.7)`,
        backdropFilter: 'blur(20px)',
      }}>
        {/* Top label */}
        <div style={{
          padding: '10px 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: rarity.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            🏆 Trophée débloqué
          </span>
          <span style={{
            marginLeft: 'auto',
            padding: '2px 8px',
            borderRadius: 99,
            fontSize: '0.62rem',
            fontWeight: 800,
            background: rarity.bg,
            color: rarity.color,
            border: `1px solid ${rarity.border}`,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {rarity.label}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '10px 16px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, flexShrink: 0,
            borderRadius: 14,
            background: rarity.bg,
            border: `1px solid ${rarity.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
            animation: 'iconBounce 0.6s ease 0.2s both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: `linear-gradient(105deg, transparent 40%, ${rarity.shimmer} 50%, transparent 60%)`,
              animation: 'rarityShimmer 1.5s ease 0.4s',
            }} />
            {current.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '1rem', fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.01em',
              marginBottom: 3,
              lineHeight: 1.2,
            }}>
              {current.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
              {current.description}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            background: rarity.gradient,
            borderRadius: 2,
            animation: `toastProgress ${DISPLAY_DURATION}ms linear forwards`,
          }} />
        </div>
      </div>
    </div>
  )
}
