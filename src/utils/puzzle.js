export function loadPuzzle(puzzles, activeOverride) {
  const todayReal = new Date().toLocaleDateString('en-CA')
  const dateParam = new URLSearchParams(window.location.search).get('date')
  const today = dateParam || (typeof activeOverride === 'string' ? activeOverride : todayReal)

  let puzzle = null
  if (puzzles && Object.keys(puzzles).length > 0) {
    puzzle = puzzles[today]
    if (!puzzle) {
      const past = Object.keys(puzzles).filter(k => k <= today).sort().reverse()
      puzzle = past.length > 0
        ? puzzles[past[0]]
        : puzzles[Object.keys(puzzles).sort()[0]]
    }
  }

  return {
    puzzle,
    today,
    columns:     puzzle?.columns     ?? [],
    rows:        puzzle?.rows        ?? [],
    answerPool:  puzzle?.answerPool  ?? {},
    weekBadge:   puzzle?.weekBadge   ?? "—",
    gridLabel:   puzzle?.gridLabel   ?? "—",
    cornerPhrase: puzzle?.cornerPhrase ?? "",
  }
}
