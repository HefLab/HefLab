import { useState } from 'react'

export default function ResultsScreen({
  correct, totalTiles, totalPlayed, cells, columns, rows, answerPool, revealMap,
  verdict, pct, gridLabel, nickname,
  copyToast, onCopyResults, onReset, onKeepPlaying, hasRevealable, onReveal,
  entries, totalCount, token, lbLoading, lbError
}) {
  const [openCell, setOpenCell] = useState(null)
  const toggleCell = (k) => setOpenCell(prev => prev === k ? null : k)
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 200, overflowY: "auto" }}>
      <div style={{ background: "#1B2A6B", border: `4px solid ${verdict.color}`, borderRadius: 16, padding: "28px 20px", maxWidth: 560, width: "100%", textAlign: "center", boxShadow: "6px 6px 0px rgba(0,0,0,0.5)", margin: "auto" }}>

        {/* Final Score */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#FFD700", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Arial', sans-serif" }}>Final Score</div>

        {/* Verdict label */}
        <div style={{ fontSize: 38, fontWeight: 900, color: verdict.color, marginBottom: 10, textTransform: "uppercase", textShadow: "3px 3px 0 rgba(0,0,0,0.3)", letterSpacing: -1, lineHeight: 1 }}>{verdict.label}</div>

        {/* Percentage block */}
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "8px 28px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: verdict.color, lineHeight: 1, textShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}>{pct}%</div>
          <div style={{ fontSize: 10, color: "#FFD700", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Arial', sans-serif", marginTop: 3 }}>Correct</div>
        </div>

        {/* Verdict sub */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#FFD700", marginBottom: 18, fontFamily: "'Arial', sans-serif", letterSpacing: 0.3 }}>{verdict.sub}</div>

        {/* Score cards */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
          {[
            { val: correct,                   label: "CORRECT",   bg: "#145a2e", bd: "#22c55e", vc: "#4ade80", lc: "#86efac" },
            { val: totalPlayed - correct,      label: "INCORRECT", bg: "#5a0a0a", bd: "#dc2626", vc: "#f87171", lc: "#fca5a5" },
            { val: totalTiles - totalPlayed,   label: "SKIPPED",   bg: "#0d1833", bd: "#4a6aaf", vc: "#aaa",    lc: "#666" },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `2px solid ${s.bd}`, borderRadius: 8, padding: "9px 12px", minWidth: 76, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.vc, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: s.lc, fontFamily: "'Arial', sans-serif", marginTop: 3, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 14 }} />

        {/* REVEAL GRID */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
            <div />
            {columns.map((col, ci) => (
              <div key={ci} style={{ background: col.color, border: `2px solid ${col.border}`, borderRadius: 6, padding: "6px 2px", textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 9, color: "#fff", textTransform: "uppercase" }}>{col.name}</div>
              </div>
            ))}
          </div>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
              <div style={{ background: "#0d1833", border: "2px solid #FFD700", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", minHeight: 54 }}>
                <div style={{ fontWeight: 900, fontSize: 8.5, color: "#fff", textTransform: "uppercase", lineHeight: 1.3 }}>{row.name}</div>
              </div>
              {columns.map((_, ci) => {
                const k = `${ri}-${ci}`
                const cell = cells[k]
                const isCorrect  = cell?.status === "correct"
                const isWrong    = cell?.status === "wrong"
                const isEmpty    = (answerPool[k] || []).length === 0
                const revealList = revealMap ? (revealMap[k] || null) : null
                const showReveal = !!revealList
                let bg = "#0d1833", bd = "#243050"
                if (isCorrect)       { bg = "#145a2e"; bd = "#22c55e" }
                else if (showReveal) { bg = "#2a1a00"; bd = "#FFD700" }
                else if (isWrong)    { bg = "#5a0a0a"; bd = "#dc2626" }
                const isOpen = openCell === k
                const topName = showReveal ? revealList[0] : null
                const restCount = showReveal ? revealList.length - 1 : 0
                return (
                  <div key={ci} style={{ position: "relative" }}>
                    <div
                      onClick={showReveal ? () => toggleCell(k) : undefined}
                      style={{ background: bg, border: `2px solid ${bd}`, borderRadius: 6, minHeight: 54, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 4, textAlign: "center", transition: "all 0.25s", cursor: showReveal ? "pointer" : "default" }}
                    >
                      {showReveal && (
                        <div style={{ width: "100%" }}>
                          <div style={{ fontSize: 8, fontWeight: 700, color: isCorrect ? "#4ade80" : "#FFD700", lineHeight: 1.3, fontFamily: "'Arial', sans-serif" }}>{topName}</div>
                          {restCount > 0 && (
                            <div style={{ fontSize: 7, color: "rgba(255,215,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginTop: 2, fontFamily: "'Arial', sans-serif" }}>
                              <span style={{ display: "inline-block", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                              {restCount} more
                            </div>
                          )}
                        </div>
                      )}
                      {!showReveal && isWrong && <div style={{ fontSize: 9, color: "#f87171", fontWeight: 700, fontFamily: "'Arial', sans-serif" }}>X</div>}
                      {!showReveal && !isWrong && (
                        <div style={{ fontSize: 9, color: isEmpty ? "#333" : "#4a6aaf", fontWeight: 700, fontFamily: "'Arial', sans-serif" }}>{isEmpty ? "N/A" : "—"}</div>
                      )}
                    </div>
                    {showReveal && isOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, right: 0, background: "#1a2540", border: "1px solid #FFD700", borderRadius: 5, zIndex: 100, padding: "5px 4px", maxHeight: 180, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>
                        {revealList.map((name, idx) => (
                          <div key={idx} style={{ fontSize: 8, padding: "2px 4px", borderRadius: 3, lineHeight: 1.5, textAlign: "left", color: idx === 0 && isCorrect ? "#4ade80" : "#FFD700", fontWeight: idx === 0 && isCorrect ? 700 : 500, borderBottom: idx === 0 && isCorrect && revealList.length > 1 ? "1px solid rgba(255,255,255,0.1)" : "none", marginBottom: idx === 0 && isCorrect && revealList.length > 1 ? 2 : 0, paddingBottom: idx === 0 && isCorrect && revealList.length > 1 ? 4 : 2, fontFamily: "'Arial', sans-serif" }}>{name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Reveal button */}
        {!revealMap && hasRevealable && (
          <button onClick={onReveal} style={{ width: "100%", padding: "11px 0", borderRadius: 8, marginBottom: 10, background: "#2a1a00", border: "3px solid #FFD700", color: "#FFD700", fontWeight: 900, cursor: "pointer", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, boxShadow: "3px 3px 0 rgba(0,0,0,0.4)", fontFamily: "'Arial Black', sans-serif" }}>
            Reveal Correct Answers
          </button>
        )}
        {revealMap && (
          <div style={{ fontSize: 10, color: "rgba(255,215,0,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontFamily: "'Arial', sans-serif" }}>
            All correct answers revealed
          </div>
        )}

        {/* Action row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {totalPlayed < totalTiles && (
            <button onClick={onKeepPlaying} style={{ flex: 1, padding: "11px 0", borderRadius: 7, background: "#0d1833", border: "2px solid #4a6aaf", color: "#aaa", fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "'Arial', sans-serif", textTransform: "uppercase" }}>Keep Playing</button>
          )}
          <button onClick={onCopyResults} style={{ flex: 1, padding: "11px 0", borderRadius: 7, background: copyToast ? "#0d2d1a" : "#1e1800", border: `2px solid ${copyToast ? "#22c55e" : "#FFD700"}`, color: copyToast ? "#4ade80" : "#FFD700", fontWeight: 900, cursor: "pointer", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Arial Black', sans-serif", transition: "all 0.15s" }}>
            {copyToast ? "Copied!" : "Copy Results"}
          </button>
          <button onClick={onReset} style={{ flex: 1, padding: "11px 0", borderRadius: 7, background: "#16a34a", border: "2px solid #000", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, boxShadow: "3px 3px 0 rgba(0,0,0,0.5)", fontFamily: "'Arial Black', sans-serif" }}>Play Again</button>
        </div>

        {/* Leaderboard section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#FFD700", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Arial Black', sans-serif" }}>🏆 Today's Leaderboard</div>
            {!lbLoading && !lbError && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Arial', sans-serif" }}>
                {totalCount} {totalCount === 1 ? "player" : "players"}
              </div>
            )}
          </div>
          {lbLoading && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Arial', sans-serif", padding: "16px 0" }}>Loading…</div>}
          {lbError && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Arial', sans-serif", padding: "16px 0" }}>Leaderboard unavailable</div>}
          {!lbLoading && !lbError && entries.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Arial', sans-serif", padding: "12px 0" }}>No scores yet today</div>
          )}
          {!lbLoading && !lbError && entries.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
              {entries.map((entry) => {
                const isMe = entry.player_token === token
                return (
                  <div key={entry.player_token} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 5, marginBottom: 4, background: isMe ? "rgba(255,215,0,0.10)" : "transparent", border: isMe ? "1px solid rgba(255,215,0,0.25)" : "1px solid transparent", fontFamily: "'Arial', sans-serif" }}>
                    <span style={{ fontSize: 12, color: entry.rank <= 3 ? (["#FFD700", "#C0C0C0", "#CD7F32"][entry.rank - 1]) : "rgba(255,255,255,0.4)", width: 20, textAlign: "right", flexShrink: 0 }}>{entry.rank}</span>
                    <span style={{ flex: 1, fontSize: 13, color: isMe ? "#FFD700" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.player_name}
                      {isMe && <span style={{ marginLeft: 6, fontSize: 9, background: "#FFD700", color: "#1B2A6B", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>YOU</span>}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#FFD700", flexShrink: 0 }}>{entry.correct}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
