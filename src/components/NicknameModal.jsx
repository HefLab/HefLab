export default function NicknameModal({ modalInput, setModalInput, modalError, onSubmit, fontFamily, weekBadge, gridLabel }) {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily,
      backgroundColor: '#0a0f1a',
      backgroundImage: "url('stadium.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
    }}
    role="dialog" aria-modal="true" aria-label="Welcome to The Mostly Immaculate Grid">

      {/* ── HEADER — identical to game header ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(to bottom, rgba(8,12,28,0.82), rgba(20,34,88,0.78))',
        borderBottom: '5px solid #FFD700',
        boxShadow: '0 0 0 1px rgba(255,215,0,0.3), 0 6px 28px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '18px 14px 10px', gap: 4,
      }}>
        {/* Scanlines */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.09) 3px, rgba(0,0,0,0.09) 4px)', pointerEvents: 'none', zIndex: 1 }} />
        {/* Top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent 0%, rgba(255,215,0,0.4) 20%, rgba(255,215,0,0.7) 50%, rgba(255,215,0,0.4) 80%, transparent 100%)', zIndex: 3 }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}>
          {weekBadge && (
            <span style={{ display: 'inline-block', background: '#F5F0E0', color: '#1B2A6B', fontSize: 10, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2, boxShadow: '2px 2px 0 rgba(0,0,0,0.4)', transform: 'rotate(-1.5deg)' }}>
              {weekBadge}
            </span>
          )}
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ fontSize: 'clamp(34px,9vw,56px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1, color: '#fff', whiteSpace: 'nowrap', textShadow: '2px 2px 0 #CC1122, 4px 4px 0 #8a0a15, 5px 5px 0 rgba(0,0,0,0.4)', lineHeight: 1 }}>THE MOSTLY</div>
            <div style={{ fontSize: 'clamp(34px,9vw,56px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1, color: '#FFD700', whiteSpace: 'nowrap', textShadow: '2px 2px 0 #CC1122, 4px 4px 0 #8a0a15, 5px 5px 0 rgba(0,0,0,0.5)', lineHeight: 1 }}>IMMACULATE GRID</div>
          </div>
          {gridLabel && (
            <span style={{ display: 'inline-block', background: '#CC1122', color: '#fff', fontSize: 'clamp(9px,2.4vw,14px)', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 2, border: '2px solid #FFD700', textShadow: '-1px -1px 0 #1B2A6B, 1px -1px 0 #1B2A6B, -1px 1px 0 #1B2A6B, 1px 1px 0 #1B2A6B', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>
              {gridLabel}
            </span>
          )}
        </div>
      </div>

      {/* Red subline + fade — mirrors game */}
      <div style={{ background: '#CC1122', height: 3 }} />
      <div style={{ height: 8, background: 'linear-gradient(to bottom, rgba(10,15,35,0.35), transparent)' }} />

      {/* ── WELCOME CARD ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '10px 14px 40px' }}>
        <div style={{ width: '100%', maxWidth: 420, position: 'relative', overflow: 'hidden', background: 'rgba(8,12,28,0.84)', border: '2px solid #FFD700', borderRadius: 5, padding: '20px 20px 22px', boxShadow: '2px 2px 0 rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          {/* Card scanlines */}
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>

            {/* Card title badge */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ display: 'inline-block', background: '#CC1122', color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px', borderRadius: 2, border: '2px solid #FFD700', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)', marginBottom: 12 }}>
                Welcome to the Ball Park
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', fontFamily: "'Arial', sans-serif", lineHeight: 1.75 }}>
                A <span style={{ color: '#FFD700', fontWeight: 700 }}>daily auto-generated</span> sports trivia challenge. Each week brings a fresh theme built around the biggest stories and focal points in sports — trades, rivalries, records, and current events. Every day within that week adds a new puzzle under the same theme. Name a player who satisfies both their <span style={{ color: '#60a5fa', fontWeight: 700 }}>column</span> and <span style={{ color: '#FFD700', fontWeight: 700 }}>row</span> to fill all 16 tiles.
              </div>
            </div>

            {/* Rules row */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {[
                { icon: '⚾', label: '16 tiles' },
                { icon: '🚫', label: 'No reuse' },
                { icon: '🏆', label: 'Leaderboard' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ flex: 1, background: 'rgba(27,42,107,0.6)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 3, padding: '6px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, lineHeight: 1 }}>{icon}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,215,0,0.8)', fontFamily: "'Arial', sans-serif", letterSpacing: 1, marginTop: 3, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)', margin: '2px 0 12px' }} />

            {/* Nickname input */}
            <div style={{ fontSize: 10, color: 'rgba(255,215,0,0.75)', fontFamily: "'Arial', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 7, fontWeight: 700 }}>
              Set Your Nickname to Join the Leaderboard
            </div>
            <input
              type="text" maxLength={20} placeholder="Enter your nickname..."
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 3, border: '2px solid #4a6aaf', background: 'rgba(13,26,51,0.9)', color: '#fff', fontSize: 14, fontFamily: "'Arial', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 6, textAlign: 'center', letterSpacing: 0.5 }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = '#4a6aaf'}
              autoFocus
            />
            {modalError && (
              <div style={{ color: '#f87171', fontSize: 10, fontFamily: "'Arial', sans-serif", marginBottom: 8, textAlign: 'center', letterSpacing: 0.5 }}>{modalError}</div>
            )}
            <button
              onClick={onSubmit}
              style={{ width: '100%', padding: '12px 0', borderRadius: 3, background: '#FFD700', border: '2px solid #FFD700', color: '#0d1a3a', fontWeight: 900, cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, fontFamily: "'Arial Black', sans-serif", boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
              onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#fff' }}
              onMouseLeave={e => { e.target.style.background = '#FFD700'; e.target.style.borderColor = '#FFD700' }}
            >
              Play Ball ⚾
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
