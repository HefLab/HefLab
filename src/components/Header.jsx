import NicknamePopover from './NicknamePopover.jsx'

export default function Header({
  weekBadge, gridLabel, rows,
  correct, incorrect, totalPlayed, totalTiles,
  showRules,
  nickname, showPopover, popoverInput, setPopoverInput, popoverError, onPopoverToggle, onPopoverSave,
  onShowLeaderboard
}) {
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

        {/* All content above overlays */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>

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
