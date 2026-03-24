import { useState, useEffect } from 'react'
import { supabaseClient } from '../utils/supabase.js'

export function useLeaderboard(puzzleDate, playerToken, refreshKey) {
  const [entries, setEntries] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [playerRank, setPlayerRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    supabaseClient
      .from('scores')
      .select('player_token, player_name, correct', { count: 'exact' })
      .eq('puzzle_date', puzzleDate)
      .order('correct', { ascending: false })
      .limit(100)
      .then(({ data, count, error: err }) => {
        if (cancelled) return
        if (err) { setError(true); setLoading(false); return }
        const rows = (data || []).map((row, i) => ({ ...row, rank: i + 1 }))
        setEntries(rows)
        setTotalCount(count || 0)
        const myRow = rows.find(r => r.player_token === playerToken)
        setPlayerRank(myRow ? myRow.rank : null)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [puzzleDate, refreshKey])

  return { entries, totalCount, playerRank, loading, error }
}
