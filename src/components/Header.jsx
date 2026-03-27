import { useRef, useEffect } from 'react'
import NicknamePopover from './NicknamePopover.jsx'

function useFireworks(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const header = canvas.parentElement
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    function resize() {
      canvas.width  = header.offsetWidth
      canvas.height = header.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(header)

    function drawBurst(x, y, radius, rayCount, color, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      const angleStep  = (Math.PI * 2) / rayCount
      const spokeW     = radius > 14 ? 1.5 : 1
      const tipDotR    = radius > 14 ? 2   : 1.2
      const midDotR    = tipDotR * 0.65
      const shortRatio = 0.52
      const r = parseInt(color.slice(1,3),16)
      const g = parseInt(color.slice(3,5),16)
      const b = parseInt(color.slice(5,7),16)
      for (let i = 0; i < rayCount; i++) {
        const angle  = angleStep * i
        const isMain = i % 2 === 0
        const len    = isMain ? radius : radius * shortRatio
        const ex     = x + Math.cos(angle) * len
        const ey     = y + Math.sin(angle) * len
        const grad   = ctx.createLinearGradient(x, y, ex, ey)
        grad.addColorStop(0,    `rgba(255,255,255,0.9)`)
        grad.addColorStop(0.25, `rgba(${r},${g},${b},1)`)
        grad.addColorStop(1,    `rgba(${r},${g},${b},0.15)`)
        ctx.beginPath()
        ctx.moveTo(Math.round(x), Math.round(y))
        ctx.lineTo(Math.round(ex), Math.round(ey))
        ctx.strokeStyle = grad
        ctx.lineWidth   = spokeW
        ctx.stroke()
        if (isMain) {
          ctx.beginPath()
          ctx.arc(Math.round(ex), Math.round(ey), tipDotR, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
        if (isMain && radius > 10) {
          const mx = x + Math.cos(angle) * len * 0.52
          const my = y + Math.sin(angle) * len * 0.52
          ctx.beginPath()
          ctx.arc(Math.round(mx), Math.round(my), midDotR, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},0.7)`
          ctx.fill()
        }
      }
      const sparkCount = Math.floor(radius * 0.9)
      const seed = (x * 7 + y * 13) % 1000
      for (let i = 0; i < sparkCount; i++) {
        const ang  = ((seed + i * 137.5) % 360) * Math.PI / 180
        const dist = radius * (0.6 + ((seed + i * 97) % 100) / 200)
        const sx   = Math.round(x + Math.cos(ang) * dist)
        const sy   = Math.round(y + Math.sin(ang) * dist)
        ctx.beginPath()
        ctx.arc(sx, sy, 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${0.4 + (i % 3) * 0.1})`
        ctx.fill()
      }
      ctx.shadowBlur  = radius > 12 ? 5 : 3
      ctx.shadowColor = color
      ctx.beginPath()
      ctx.arc(Math.round(x), Math.round(y), radius > 14 ? 2.5 : 1.8, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.restore()
    }

    function drawTrail(x, y, angle, length, color, alpha) {
      if (alpha <= 0 || length < 4) return
      ctx.save()
      ctx.globalAlpha = alpha * 0.55
      const tx = x - Math.cos(angle) * length
      const ty = y - Math.sin(angle) * length
      const r  = parseInt(color.slice(1,3),16)
      const g2 = parseInt(color.slice(3,5),16)
      const b  = parseInt(color.slice(5,7),16)
      const grad = ctx.createLinearGradient(tx, ty, x, y)
      grad.addColorStop(0,   `rgba(${r},${g2},${b},0)`)
      grad.addColorStop(0.6, `rgba(${r},${g2},${b},0.3)`)
      grad.addColorStop(1,   `rgba(255,255,255,0.7)`)
      ctx.beginPath()
      ctx.moveTo(Math.round(tx), Math.round(ty))
      ctx.lineTo(Math.round(x), Math.round(y))
      ctx.strokeStyle = grad
      ctx.lineWidth   = 1
      ctx.stroke()
      ctx.restore()
    }

    function mkBurst(xPct, yPct, radius, rays, color, cycleS, phase) {
      return { xPct, yPct, radius, rays, color,
               cycle: cycleS * 1000,
               phase: phase * cycleS * 1000,
               trailAngle: -Math.PI/2 + (Math.random()-0.5)*0.6 }
    }

    const BURSTS = [
      mkBurst(0.07, 0.16, 18, 12, '#FFD700', 5.2, 0.0),
      mkBurst(0.16, 0.58, 12, 10, '#CC1122', 4.8, 0.3),
      mkBurst(0.04, 0.74,  8,  8, '#FFD700', 4.0, 0.6),
      mkBurst(0.19, 0.30,  9,  8, '#CC1122', 5.5, 0.8),
      mkBurst(0.10, 0.90, 14, 10, '#FFD700', 4.3, 0.15),
      mkBurst(0.93, 0.20, 16, 12, '#FFD700', 5.0, 0.45),
      mkBurst(0.82, 0.62, 11, 10, '#CC1122', 4.6, 0.7),
      mkBurst(0.96, 0.80,  8,  8, '#FFD700', 3.9, 0.2),
      mkBurst(0.77, 0.40, 10,  8, '#CC1122', 5.3, 0.55),
    ]

    function burstAlpha(t) {
      const MAX = 0.42
      if (t < 0.12) return (t / 0.12) * MAX
      if (t < 0.60) return MAX
      if (t < 0.88) return (1 - (t - 0.60) / 0.28) * MAX
      return 0
    }

    let rafId
    function loop(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width
      const h = canvas.height
      for (const b of BURSTS) {
        const t     = ((ts + b.phase) % b.cycle) / b.cycle
        const alpha = burstAlpha(t)
        if (alpha <= 0) continue
        const x = Math.round(b.xPct * w)
        const y = Math.round(b.yPct * h)
        const expandScale = t < 0.12 ? 0.4 + (t / 0.12) * 0.6 : 1.0
        const r = b.radius * expandScale
        if (t < 0.18) {
          const trailLen = r * 2.5 * (1 - t / 0.18)
          drawTrail(x, y, b.trailAngle, trailLen, b.color, alpha)
        }
        drawBurst(x, y, r, b.rays, b.color, alpha)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])
}

export default function Header({
  weekBadge, gridLabel, rows,
  correct, incorrect, totalPlayed, totalTiles,
  showRules,
  nickname, showPopover, popoverInput, setPopoverInput, popoverError, onPopoverToggle, onPopoverSave,
  onShowLeaderboard
}) {
  const canvasRef = useRef(null)
  useFireworks(canvasRef)

  return (
    <>
      {/* ══ HEADER — retro 8-bit, semi-transparent over stadium ══ */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, rgba(8,12,28,0.82), rgba(20,34,88,0.78))",
        borderBottom: "5px solid #FFD700",
        boxShadow: "0 0 0 1px rgba(255,215,0,0.3), 0 6px 28px rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "18px 14px 10px",
        gap: 4,
      }}>
        {/* Scanline overlay */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.09) 3px, rgba(0,0,0,0.09) 4px)", pointerEvents: "none", zIndex: 1 }} />
        {/* Top shimmer */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent 0%, rgba(255,215,0,0.4) 20%, rgba(255,215,0,0.7) 50%, rgba(255,215,0,0.4) 80%, transparent 100%)", zIndex: 3 }} />
        {/* Fireworks canvas */}
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, imageRendering: "pixelated" }} />

        {/* All content above overlays */}
        <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>

          {/* Week badge */}
          <span style={{ display: "inline-block", background: "#F5F0E0", color: "#1B2A6B", fontSize: 10, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase", padding: "2px 7px", borderRadius: 2, boxShadow: "2px 2px 0 rgba(0,0,0,0.4)", transform: "rotate(-1.5deg)" }}>
            {weekBadge}
          </span>

          {/* Main title — stepped 8-bit shadow, always 1 line */}
          <div style={{ textAlign: "center", lineHeight: 1 }}>
            <div style={{ fontSize: "clamp(34px,9vw,56px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: -1, color: "#fff", whiteSpace: "nowrap", textShadow: "2px 2px 0 #CC1122, 4px 4px 0 #8a0a15, 5px 5px 0 rgba(0,0,0,0.4)", lineHeight: 1 }}>THE MOSTLY</div>
            <div style={{ fontSize: "clamp(34px,9vw,56px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: -1, color: "#FFD700", whiteSpace: "nowrap", textShadow: "2px 2px 0 #CC1122, 4px 4px 0 #8a0a15, 5px 5px 0 rgba(0,0,0,0.5)", lineHeight: 1 }}>IMMACULATE GRID</div>
          </div>

          {/* Grid label */}
          <span style={{ display: "inline-block", background: "#CC1122", color: "#fff", fontSize: "clamp(9px,2.4vw,14px)", fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 2, border: "2px solid #FFD700", textShadow: "-1px -1px 0 #1B2A6B, 1px -1px 0 #1B2A6B, -1px 1px 0 #1B2A6B, 1px 1px 0 #1B2A6B", boxShadow: "2px 2px 0 rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
            {gridLabel}
          </span>

          {/* Nickname + Leaderboard */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <NicknamePopover nickname={nickname} show={showPopover} input={popoverInput} setInput={setPopoverInput} error={popoverError} onToggle={onPopoverToggle} onSave={onPopoverSave} />
            <button onClick={onShowLeaderboard} style={{ background: "#0d1a3a", border: "2px solid #FFD700", borderRadius: 3, color: "#FFD700", fontSize: 10, fontWeight: 900, padding: "5px 11px", cursor: "pointer", fontFamily: "'Arial Black', sans-serif", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>🏆 Leaderboard</button>
          </div>

          {/* Scoreboard — LED display style */}
          <div style={{ display: "flex", justifyContent: "center", gap: 7 }}>
            {[
              { val: correct,                  label: "CORRECT",   bg: "#0d3a1e", bd: "#22c55e", vc: "#4ade80", lc: "#86efac" },
              { val: incorrect,                label: "INCORRECT", bg: "#3a0d0d", bd: "#dc2626", vc: "#f87171", lc: "#fca5a5" },
              { val: totalTiles - totalPlayed, label: "LEFT",      bg: "#080f22", bd: "#FFD700", vc: "#FFD700", lc: "rgba(255,212,0,0.7)" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: s.bg, border: `2px solid ${s.bd}`, borderRadius: 3, padding: "6px 14px", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", minWidth: 72 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.vc, lineHeight: 1, letterSpacing: -0.5, fontFamily: "'Courier New', monospace", textShadow: `0 0 8px ${s.vc}` }}>{s.val}</div>
                <div style={{ fontSize: 8, color: s.lc, fontWeight: 700, letterSpacing: 2, marginTop: 3, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Rules box — shown when How to Play is active */}
      {showRules && (
        <div style={{ maxWidth: 480, margin: "8px auto", padding: "0 14px" }}>
          <div style={{ background: "rgba(20,34,88,0.92)", border: "2px solid #FFD700", borderRadius: 5, padding: "14px 18px", fontSize: 12, lineHeight: 1.9, fontFamily: "'Arial', sans-serif", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}>
            <div style={{ fontWeight: 900, color: "#FFD700", marginBottom: 8, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>How to Play</div>
            {["Click any open tile to enter a player's name", "Player must satisfy both the column division and the row category", "One guess per tile — wrong answer locks it red permanently", "Each player can only be used once across the whole board"].map((t, i) => (
              <div key={i} style={{ color: "#ccc" }}>• {t}</div>
            ))}
            <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,215,0,0.3)", paddingTop: 10, color: "#FFD700", fontWeight: 700, fontSize: 12 }}>
              Each tile has a minimum of 3 possible correct answers.
            </div>
            <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,215,0,0.3)", paddingTop: 10 }}>
              {rows.map((r, i) => <div key={i} style={{ color: "#ccc" }}><strong style={{ color: "#FFD700" }}>{r.name}</strong> — {r.desc}</div>)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
