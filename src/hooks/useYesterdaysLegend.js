import { useState, useEffect } from 'react'
import { supabaseClient } from '../utils/supabase.js'

export function useYesterdaysLegend(puzzles) {
  const [legend, setLegend] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    supabaseClient
      .from('scores')
      .select('player_name, correct')
      .eq('puzzle_date', yesterdayStr)
      .order('correct', { ascending: false })
      .order('submitted_at', { ascending: true })
      .limit(1)
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) { setError(true); setLoading(false); return }
        if (!data || data.length === 0) { setLegend(null); setLoading(false); return }
        const winner = data[0]
        setLegend({
          player_name: winner.player_name,
          correct: winner.correct,
          gridLabel: puzzles[yesterdayStr]?.gridLabel,
        })
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [puzzles])

  return { legend, loading, error }
}
