export default function Grid({
  columns, rows, answerPool, cells, active, inputVal, feedback,
  suggestions, suggIdx, acOpen,
  inputRef, dropdownRef,
  onTileClick, onInputChange, onKeyDown, onSuggestionSelect,
  onSubmit, onCancel,
  revealMap, cornerPhrase
}) {
  const gridCols = "106px 1fr 1fr 1fr 1fr"

  const activeInfo = active
    ? (() => { const [r, c] = active.split("-").map(Number); return { row: rows[r], col: columns[c] } })()
    : null

  const showDropdown = acOpen && suggestions.length > 0
  const showNoResults = acOpen && suggestions.length === 0 && inputVal.trim().length >= 3
  const inputConnected = showDropdown || showNoResults

  return (
    <>
      {/* GAME GRID */}
      <div style={{ maxWidth: 680, margin: "12px auto 0", padding: "0 8px" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 540 }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 5, marginBottom: 5 }}>
          <div style={{ background: "#CC1122", border: "3px solid #FFD700", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0px rgba(0,0,0,0.4)", padding: "6px" }}>
            {cornerPhrase && <div style={{ fontSize: 11, color: "#FFD700", fontStyle: "italic", fontWeight: 400, textAlign: "center", lineHeight: 1.5, fontFamily: "Georgia, serif", whiteSpace: "pre-line" }}>"{cornerPhrase}"</div>}
          </div>
          {columns.map((col, ci) => (
            <div key={ci} style={{ background: "#1B2A6B", borderRadius: 8, padding: "10px 4px", textAlign: "center", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "3px solid #FFD700", boxShadow: "3px 3px 0px rgba(0,0,0,0.4)", overflow: "hidden" }}>
              <div style={{ fontWeight: 900, fontSize: 12, color: "#fff", textTransform: "uppercase", textShadow: "1px 1px 0 rgba(0,0,0,0.5)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{col.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 2, fontFamily: "'Arial', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{col.nickname}</div>
            </div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "grid", gridTemplateColumns: gridCols, gap: 5, marginBottom: 5 }}>
            <div style={{ background: "#1B2A6B", border: "3px solid #FFD700", borderRadius: 8, padding: "8px 6px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 88, boxShadow: "3px 3px 0px rgba(0,0,0,0.4)" }}>
              <div style={{ fontWeight: 900, fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.name}</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.5)", marginTop: 4, lineHeight: 1.4, fontFamily: "'Arial', sans-serif" }}>{row.desc}</div>
            </div>
            {columns.map((_, ci) => {
              const k = `${ri}-${ci}`
              const cell = cells[k]
              const isCorrect = cell?.status === "correct"
              const isWrong   = cell?.status === "wrong"
              const isLocked  = isCorrect || isWrong
              const isEmpty   = (answerPool[k] || []).length === 0
              const isAct     = active === k
              let bg = "#1B2A6B"
              let bd = isEmpty ? "#243050" : "#4a6aaf"
              if (isCorrect) { bg = "#145a2e"; bd = "#22c55e" }
              if (isWrong)   { bg = "#5a0a0a"; bd = "#dc2626" }
              if (isAct)     { bg = "#2a3d7a"; bd = "#FFD700" }
              return (
                <div key={ci} onClick={() => !isLocked && onTileClick(ri, ci)}
                  style={{ background: bg, border: `3px solid ${bd}`, borderRadius: 8, minHeight: 88, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: isLocked ? "default" : "pointer", transition: "all 0.12s", padding: 6, textAlign: "center", boxShadow: "3px 3px 0px rgba(0,0,0,0.35)" }}
                  onMouseEnter={e => { if (!isLocked && !isEmpty) { e.currentTarget.style.borderColor = "#FFD700"; e.currentTarget.style.background = "#2a3d7a" } }}
                  onMouseLeave={e => { if (!isLocked && !isAct) { e.currentTarget.style.borderColor = isEmpty ? "#243050" : "#4a6aaf"; e.currentTarget.style.background = "#1B2A6B" } }}
                >
                  {isCorrect && <><div style={{ fontSize: 16, marginBottom: 3 }}>✅</div><div style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", lineHeight: 1.3, fontFamily: "'Arial', sans-serif" }}>{cell.name}</div></>}
                  {isWrong   && <><div style={{ fontSize: 18, marginBottom: 3 }}>❌</div><div style={{ fontSize: 9, color: "#f87171", fontWeight: 700, textTransform: "uppercase" }}>Locked Out</div></>}
                  {!isLocked && isEmpty  && <div style={{ fontSize: 8.5, color: "#4a6aaf", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Arial', sans-serif" }}>Coming Soon</div>}
                  {!isLocked && !isEmpty && <div style={{ fontSize: 28, color: "#4a6aaf" }}>+</div>}
                </div>
              )
            })}
          </div>
        ))}
        </div>
        </div>
      </div>

      {/* INPUT MODAL */}
      {active && !cells[active] && (
        <div onClick={e => { if (e.target === e.currentTarget) onCancel() }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 100 }}>
          <div style={{ background: "#1B2A6B", border: "4px solid #FFD700", borderRadius: 14, padding: "28px 24px", width: "100%", maxWidth: 420, boxShadow: "6px 6px 0px rgba(0,0,0,0.5)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "rgba(255,215,0,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Arial', sans-serif" }}>You need a...</div>
              <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1.4, textTransform: "uppercase" }}>
                <span style={{ color: "#60a5fa" }}>{activeInfo?.col.name}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 8px" }}>×</span>
                <span style={{ color: "#FFD700" }}>{activeInfo?.row.name}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 6, fontFamily: "'Arial', sans-serif" }}>{activeInfo?.row.desc}</div>
            </div>
            <div style={{ position: "relative" }}>
              <input ref={inputRef} value={inputVal}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="Type a player's name..."
                style={{ width: "100%", boxSizing: "border-box", background: "#0d1833", color: "#fff", border: "3px solid #4a6aaf", borderRadius: 8, padding: "13px 16px", fontSize: 15, outline: "none", fontFamily: "'Arial', sans-serif", ...(inputConnected && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: "none" }) }}
                onFocus={e => e.target.style.borderColor = "#FFD700"}
                onBlur={e => { e.target.style.borderColor = "#4a6aaf"; setTimeout(() => onSuggestionSelect(null), 150) }}
              />
              {showDropdown && (
                <div ref={dropdownRef} style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0d1833", border: "3px solid #FFD700", borderTop: "none", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, zIndex: 999, maxHeight: 196, overflowY: "auto", WebkitOverflowScrolling: "touch", boxShadow: "4px 6px 0px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding: "5px 16px 4px", fontSize: 10, color: "rgba(255,215,0,0.45)", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Arial', sans-serif" }}>
                    {suggestions.length} player{suggestions.length !== 1 ? "s" : ""} found{suggestions.length > 4 ? " — scroll for more ▼" : ""}
                  </div>
                  {suggestions.map((name, i) => (
                    <div key={name}
                      data-highlighted={i === suggIdx ? "true" : "false"}
                      onMouseDown={() => onSuggestionSelect(name)}
                      style={{ padding: "10px 16px", fontSize: 13, color: i === suggIdx ? "#fff" : "#ccc", background: i === suggIdx ? "rgba(255,215,0,0.12)" : "transparent", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", fontFamily: "'Arial', sans-serif" }}>
                      {name}
                    </div>
                  ))}
                </div>
              )}
              {showNoResults && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0d1833", border: "3px solid #FFD700", borderTop: "none", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, zIndex: 999, padding: "12px 16px", fontSize: 12, color: "rgba(255,255,255,0.3)", fontStyle: "italic", fontFamily: "'Arial', sans-serif", boxShadow: "4px 6px 0px rgba(0,0,0,0.5)" }}>
                  No players found
                </div>
              )}
            </div>
            {feedback && (
              <div style={{ marginTop: 12, padding: "11px 14px", borderRadius: 8, background: feedback.type === "correct" ? "#145a2e" : "#5a0a0a", color: feedback.type === "correct" ? "#4ade80" : "#fca5a5", fontWeight: 700, fontSize: 13, textAlign: "center", border: `2px solid ${feedback.type === "correct" ? "#22c55e" : "#dc2626"}`, fontFamily: "'Arial', sans-serif" }}>
                {feedback.msg}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={onCancel} style={{ flex: 1, padding: "13px 0", borderRadius: 8, background: "#0d1833", border: "2px solid #4a6aaf", color: "#aaa", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Arial', sans-serif" }}>Cancel</button>
              <button onClick={onSubmit} style={{ flex: 2, padding: "13px 0", borderRadius: 8, background: "#CC1122", border: "2px solid #FFD700", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15, textTransform: "uppercase", letterSpacing: 1, boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}>SUBMIT 🏀</button>
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Arial', sans-serif" }}>↑↓ arrows or scroll to browse • Enter to select • Escape to cancel</div>
          </div>
        </div>
      )}
    </>
  )
}
