import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useYesterdaysLegend } from './useYesterdaysLegend.js'

// Mock the supabase client
vi.mock('../utils/supabase.js', () => ({
  supabaseClient: {
    from: vi.fn(),
  },
}))

import { supabaseClient } from '../utils/supabase.js'

function makeMockQuery(data, error = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnValue(Promise.resolve({ data, error })),
  }
  supabaseClient.from.mockReturnValue(chain)
  return chain
}

const MOCK_PUZZLES = {
  '2026-03-24': { gridLabel: 'GRID #3: THREE POINT LAND' },
}

// Pin "today" so yesterday is always 2026-03-24 in tests
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-03-25T12:00:00Z'))
  vi.clearAllMocks()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useYesterdaysLegend', () => {
  it('returns legend with player_name, correct, and gridLabel when data exists', async () => {
    makeMockQuery([{ player_name: 'HoopDreams', correct: 16 }])

    const { result } = renderHook(() => useYesterdaysLegend(MOCK_PUZZLES))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.legend).toEqual({
      player_name: 'HoopDreams',
      correct: 16,
      gridLabel: 'GRID #3: THREE POINT LAND',
    })
    expect(result.current.error).toBe(false)
  })

  it('returns legend with gridLabel undefined when yesterday is not in puzzles', async () => {
    vi.useRealTimers()
    try {
      makeMockQuery([{ player_name: 'HoopDreams', correct: 16 }])

      const { result } = renderHook(() => useYesterdaysLegend({}))

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.legend).toEqual({
        player_name: 'HoopDreams',
        correct: 16,
        gridLabel: undefined,
      })
    } finally {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-03-25T12:00:00Z'))
    }
  })

  it('returns legend as null when no scores exist for yesterday', async () => {
    makeMockQuery([])

    const { result } = renderHook(() => useYesterdaysLegend(MOCK_PUZZLES))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.legend).toBeNull()
    expect(result.current.error).toBe(false)
  })

  it('returns error true and legend null when fetch fails', async () => {
    makeMockQuery(null, { message: 'network error' })

    const { result } = renderHook(() => useYesterdaysLegend(MOCK_PUZZLES))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(true)
    expect(result.current.legend).toBeNull()
  })

  it('queries scores table filtered by yesterday with correct ordering', async () => {
    const chain = makeMockQuery([{ player_name: 'HoopDreams', correct: 16 }])

    const { result } = renderHook(() => useYesterdaysLegend(MOCK_PUZZLES))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(supabaseClient.from).toHaveBeenCalledWith('scores')
    expect(chain.eq).toHaveBeenCalledWith('puzzle_date', '2026-03-24')
    expect(chain.order).toHaveBeenCalledWith('correct', { ascending: false })
    expect(chain.order).toHaveBeenCalledWith('submitted_at', { ascending: true })
    expect(chain.limit).toHaveBeenCalledWith(1)
  })
})
