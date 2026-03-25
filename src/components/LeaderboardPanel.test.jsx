import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LeaderboardPanel from './LeaderboardPanel.jsx'

const defaultProps = {
  entries: [],
  totalCount: 0,
  loading: false,
  error: false,
  token: 'test-token',
  onClose: vi.fn(),
  legend: null,
  legendLoading: false,
  legendError: false,
}

describe("LeaderboardPanel — Yesterday's Biggest Baller banner", () => {
  it('shows player name, score, and gridLabel when legend is present', () => {
    render(<LeaderboardPanel
      {...defaultProps}
      legend={{ player_name: 'HoopDreams', correct: 16, gridLabel: 'GRID #3: THREE POINT LAND' }}
    />)

    expect(screen.getByText("YESTERDAY'S BIGGEST BALLER")).toBeInTheDocument()
    expect(screen.getByText('HoopDreams')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
    expect(screen.getByText('GRID #3: THREE POINT LAND')).toBeInTheDocument()
  })

  it('shows name and score without gridLabel when gridLabel is undefined', () => {
    render(<LeaderboardPanel
      {...defaultProps}
      legend={{ player_name: 'HoopDreams', correct: 16, gridLabel: undefined }}
    />)

    expect(screen.getByText('HoopDreams')).toBeInTheDocument()
    expect(screen.queryByText(/GRID/)).not.toBeInTheDocument()
  })

  it('shows "No Ballers Yet" when legend is null and not loading', () => {
    render(<LeaderboardPanel {...defaultProps} legend={null} legendLoading={false} />)

    expect(screen.getByText('No Ballers Yet')).toBeInTheDocument()
  })

  it('hides banner entirely when legendError is true', () => {
    render(<LeaderboardPanel {...defaultProps} legendError={true} />)

    expect(screen.queryByText("YESTERDAY'S BIGGEST BALLER")).not.toBeInTheDocument()
    expect(screen.queryByText('No Ballers Yet')).not.toBeInTheDocument()
  })

  it('shows loading indicator inside banner when legendLoading is true', () => {
    render(<LeaderboardPanel {...defaultProps} legendLoading={true} />)

    expect(screen.getByText("YESTERDAY'S BIGGEST BALLER")).toBeInTheDocument()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('has aria-label "Leaderboard" on the dialog', () => {
    render(<LeaderboardPanel {...defaultProps} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Leaderboard')
  })
})
