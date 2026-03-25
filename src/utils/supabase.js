import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function submitScore(token, name, correct, puzzleDate) {
  try {
    await supabaseClient
      .from('scores')
      .upsert(
        { player_token: token, player_name: name, correct, puzzle_date: puzzleDate },
        { onConflict: 'player_token,puzzle_date', ignoreDuplicates: true }
      )
  } catch (e) { /* silent */ }
}
