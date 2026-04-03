import { navBtn } from '../utils/validate.js'
import NicknamePopover from './NicknamePopover.jsx'

export default function Header({
  weekBadge, gridLabel, rows,
  correct, incorrect, totalPlayed, totalTiles,
  showRules, onToggleRules,
  onEndGame, onReset,
  nickname, showPopover, popoverInput, setPopoverInput, popoverError, onPopoverToggle, onPopoverSave,
  onShowLeaderboard
}) {
  return (
    <>
      {/* HEADER */}
      <div style={{ background: "#1B2A6B", borderBottom: "6px solid #FFD700", padding: "20px 16px 18px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.4)", backgroundImage: "radial-gradient(ellipse 55% 90% at 50% 50%, rgba(27,42,107,0.97) 0%, rgba(27,42,107,0.92) 35%, rgba(27,42,107,0.55) 60%, rgba(27,42,107,0.15) 80%, rgba(27,42,107,0.0) 100%), url('retro-composite.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div style={{ display: "inline-block", background: "#F5F0E0", color: "#1B2A6B", fontSize: 11, fontWeight: 1000, letterSpacing: 1, textTransform: "uppercase", padding: "0.5px 4px", borderRadius: 3, marginBottom: -8, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", transform: "rotate(-1.5deg)", position: "relative", zIndex: 2 }}>
          {weekBadge}
        </div>
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: "clamp(42px,10.8vw,60px)", fontWeight: 900, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1, color: "#fff", textShadow: "4px 4px 0px #CC1122, 6px 6px 0px rgba(0,0,0,0.3)" }}>THE MOSTLY</div>
          <div style={{ fontSize: "clamp(42px,10.8vw,60px)", fontWeight: 900, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1, color: "#FFD700", textShadow: "4px 4px 0px #CC1122, 6px 6px 0px rgba(0,0,0,0.4)" }}>IMMACULATE GRID</div>
        </div>
        <div style={{ display: "inline-block", background: "#CC1122", color: "#fff", fontSize: "clamp(11px,2.8vw,16px)", fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", padding: "5px 20px", borderRadius: 3, marginTop: 10, marginBottom: 14, border: "2px solid #FFD700", textShadow: "-1px -1px 0 #1B2A6B, 1px -1px 0 #1B2A6B, -1px 1px 0 #1B2A6B, 1px 1px 0 #1B2A6B", boxShadow: "3px 3px 0px rgba(0,0,0,0.3)" }}>
          {gridLabel}
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <NicknamePopover
            nickname={nickname} show={showPopover}
            input={popoverInput} setInput={setPopoverInput} error={popoverError}
            onToggle={onPopoverToggle} onSave={onPopoverSave}
          />
          <button onClick={onShowLeaderboard} style={navBtn("#1B2A6B", "#FFD700")}>🏆 Leaderboard</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { val: correct,                  label: "CORRECT",   bg: "#145a2e", bd: "#22c55e", vc: "#4ade80", lc: "#86efac" },
            { val: incorrect,                label: "INCORRECT", bg: "#5a0a0a", bd: "#dc2626", vc: "#f87171", lc: "#fca5a5" },
            { val: totalTiles - totalPlayed, label: "LEFT",      bg: "#1B2A6B", bd: "#FFD700", vc: "#FFD700", lc: "rgba(255,212,0,0.7)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: s.bg, border: `2px solid ${s.bd}`, borderRadius: 8, padding: "8px 18px", boxShadow: "0 3px 0px rgba(0,0,0,0.3)", minWidth: 80 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.vc, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: s.lc, fontWeight: 700, letterSpacing: 1.5, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button onClick={onToggleRules} style={navBtn("#1B2A6B", "#FFD700")}>{showRules ? "Hide Rules" : "How to Play"}</button>
          {totalPlayed > 0 && totalPlayed < totalTiles && <button onClick={onEndGame} style={navBtn("#5a0a0a", "#f87171")}>End Game</button>}
          <button onClick={onReset} style={navBtn("#5a0a0a", "#f87171")}>Reset</button>
        </div>
      </div>

      {/* Rules box */}
      {showRules && (
        <div style={{ maxWidth: 393, margin: "12px auto", background: "#1B2A6B", border: "3px solid #FFD700", borderRadius: 10, padding: "16px 20px", fontSize: 12, lineHeight: 1.9, fontFamily: "'Arial', sans-serif", boxShadow: "4px 4px 0px rgba(0,0,0,0.4)" }}>
          <div style={{ fontWeight: 900, color: "#FFD700", marginBottom: 8, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>How to Play</div>
          {["Click any open tile to enter a player's name", "Player must satisfy both the column team and the row category", "One guess per tile — wrong answer locks it red permanently", "Each player can only be used once across the whole board"].map((t, i) => (
            <div key={i} style={{ color: "#ccc" }}>• {t}</div>
          ))}
          <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,215,0,0.3)", paddingTop: 10, color: "#FFD700", fontWeight: 700, fontSize: 12 }}>
            Each tile has a minimum of 3 possible correct answers.
          </div>
          <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,215,0,0.3)", paddingTop: 10 }}>
            {rows.map((r, i) => <div key={i} style={{ color: "#ccc" }}><strong style={{ color: "#FFD700" }}>{r.name}</strong> — {r.desc}</div>)}
          </div>
        </div>
      )}
    </>
  )
}
