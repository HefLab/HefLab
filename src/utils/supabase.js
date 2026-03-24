import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lvskvhkzpjxhidqowbls.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_FxT1q_Elb2QcaOX6L0vlCQ_qe0GaTxh'

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
