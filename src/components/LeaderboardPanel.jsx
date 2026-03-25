export default function LeaderboardPanel({ entries, totalCount, loading, error, token, onClose, legend, legendLoading, legendError }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 300 }}>
      <div
        role="dialog" aria-modal="true" aria-label="Leaderboard"
        onClick={e => e.stopPropagation()}
        style={{ background: '#1B2A6B', border: '3px solid #FFD700', borderRadius: 14, padding: '24px 20px', maxWidth: 380, width: '100%', boxShadow: '6px 6px 0 rgba(0,0,0,0.5)' }}>

        {/* Yesterday's Biggest Baller Banner */}
        {!legendError && (
          <div style={{ marginBottom: 16, background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.35)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Arial Black', sans-serif", marginBottom: 6 }}>
              <span aria-hidden="true">⭐ </span><span>YESTERDAY'S BIGGEST BALLER</span>
            </div>
            {legendLoading && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Arial', sans-serif" }}>Loading…</div>
            )}
            {!legendLoading && legend === null && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Arial', sans-serif" }}>No Ballers Yet</div>
            )}
            {!legendLoading && legend !== null && (
              <>
                {legend.gridLabel && (
                  <div style={{ fontSize: 10, color: 'rgba(255,215,0,0.6)', fontFamily: "'Arial', sans-serif", marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {legend.gridLabel}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Arial', sans-serif" }}>{legend.player_name}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', fontFamily: "'Arial Black', sans-serif" }}>{legend.correct}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        {!legendError && (
          <div style={{ borderTop: '1px solid rgba(255,215,0,0.2)', marginBottom: 14 }} />
        )}

        {/* Today's Leaderboard */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Arial Black', sans-serif" }}>🏆 Today's Leaderboard</div>
          {!loading && !error && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Arial', sans-serif" }}>
              {totalCount} {totalCount === 1 ? 'player' : 'players'}
            </div>
          )}
        </div>
        {loading && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: "'Arial', sans-serif", padding: '24px 0' }}>Loading…</div>}
        {error && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: "'Arial', sans-serif", padding: '24px 0' }}>Leaderboard unavailable</div>}
        {!loading && !error && entries.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: "'Arial', sans-serif", padding: '16px 0' }}>No scores yet today</div>
        )}
        {!loading && !error && entries.length > 0 && (
          <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {entries.map((entry) => {
              const isMe = entry.player_token === token
              return (
                <div key={entry.player_token} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', borderRadius: 5, marginBottom: 4, background: isMe ? 'rgba(255,215,0,0.10)' : 'transparent', border: isMe ? '1px solid rgba(255,215,0,0.25)' : '1px solid transparent', fontFamily: "'Arial', sans-serif" }}>
                  <span style={{ fontSize: 12, color: entry.rank <= 3 ? (['#FFD700','#C0C0C0','#CD7F32'][entry.rank - 1]) : 'rgba(255,255,255,0.4)', width: 20, textAlign: 'right', flexShrink: 0 }}>{entry.rank}</span>
                  <span style={{ flex: 1, fontSize: 13, color: isMe ? '#FFD700' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.player_name}
                    {isMe && <span style={{ marginLeft: 6, fontSize: 9, background: '#FFD700', color: '#1B2A6B', padding: '1px 5px', borderRadius: 3, fontWeight: 900 }}>YOU</span>}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#FFD700', flexShrink: 0 }}>{entry.correct}</span>
                </div>
              )
            })}
          </div>
        )}
        <button
          onClick={onClose}
          style={{ marginTop: 16, width: '100%', padding: '10px 0', borderRadius: 7, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontWeight: 700, cursor: 'pointer', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Arial', sans-serif" }}>
          Close
        </button>
      </div>
    </div>
  )
}
