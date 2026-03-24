export const nc = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

export const validateNickname = (val) => {
  if (!val || val.length < 2 || val.length > 20) return false
  return /^[a-zA-Z0-9_-]+$/.test(val)
}

// answerPool, rows, columns are passed in from App — avoids circular imports
export const buildRevealMap = (cells, answerPool, rows, columns) => {
  const map = {}
  for (let ri = 0; ri < rows.length; ri++) {
    for (let ci = 0; ci < columns.length; ci++) {
      const k = `${ri}-${ci}`
      const pool = answerPool[k] || []
      if (pool.length === 0) continue
      const cell = cells[k]
      const playerAnswer = cell?.status === 'correct' ? cell.name : null
      if (playerAnswer) {
        const rest = pool.filter(a => nc(a) !== nc(playerAnswer))
        map[k] = [playerAnswer, ...rest]
      } else {
        map[k] = [...pool]
      }
    }
  }
  return map
}

export const validate = (input, key, used, answerPool) => {
  const pool = answerPool[key] || []
  if (pool.length === 0) return { ok: false, reason: "empty" }
  const ni = nc(input.trim())
  if (!ni) return null
  let matched = pool.find(a => nc(a) === ni)
  if (!matched) {
    const byLast = pool.filter(a => { const p = a.split(" "); return nc(p[p.length-1]) === ni })
    if (byLast.length === 1) matched = byLast[0]
  }
  if (!matched) {
    const byFirst = pool.filter(a => nc(a.split(" ")[0]) === ni)
    if (byFirst.length === 1) matched = byFirst[0]
  }
  if (!matched) return { ok: false, reason: "wrong" }
  if (used.has(nc(matched))) return { ok: false, reason: "used", name: matched }
  return { ok: true, name: matched }
}

const TOTAL_TILES = 16
export const getVerdict = (correct) => {
  const pct = correct / TOTAL_TILES
  if (correct === TOTAL_TILES) return { label: "IMMACULATE",   sub: "A perfect board. You absolutely know ball.", color: "#FFD700" }
  if (pct >= 0.75)             return { label: "ELITE",        sub: "Near flawless. You know ball.",             color: "#4ade80" }
  if (pct >= 0.5)              return { label: "SOLID",        sub: "More than half right. Decent hoops IQ.",    color: "#60a5fa" }
  if (pct >= 0.25)             return { label: "BENCH WARMER", sub: "You've watched a game or two... maybe.",    color: "#fb923c" }
  return                              { label: "RIDE THE PINE", sub: "Turn in your sneakers. Study up.",         color: "#f87171" }
}

export const navBtn = (bg, color) => ({
  background: bg, color, border: `2px solid ${color}`, borderRadius: 6, padding: "5px 14px",
  fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", fontFamily: "'Arial', sans-serif"
})
