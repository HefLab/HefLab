export default function NicknameModal({ modalInput, setModalInput, modalError, onSubmit, fontFamily }) {
  return (
    <div style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily }}
         role="dialog" aria-modal="true" aria-label="Enter your nickname">
      <div style={{ maxWidth: 360, width: '90%', textAlign: 'center' }}>
        <div style={{ background: '#1B2A6B', border: '3px solid #FFD700', borderRadius: 12, padding: '28px 24px 22px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontFamily: "'Arial', sans-serif", lineHeight: 1.65, marginBottom: 24 }}>
            Welcome to the{' '}
            <strong style={{ color: '#CC1122', fontFamily: "'Arial Black', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mostly Immaculate Grid
            </strong>
            {' '}— a daily trivia game for real ball knowers. Each week brings a new theme built around what's happening in sports right now.
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'Arial', sans-serif", marginBottom: 6, letterSpacing: '0.5px' }}>
            Join the leaderboard & track your stats
          </div>
          <input
            type="text" maxLength={20} placeholder="Your nickname"
            value={modalInput}
            onChange={(e) => setModalInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '2px solid #FFD700', background: '#0d1a4a', color: '#fff', fontSize: 15, fontFamily: "'Arial', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            autoFocus
          />
          {modalError && (
            <div style={{ color: '#CC1122', fontSize: 11, fontFamily: "'Arial', sans-serif", marginBottom: 10, textAlign: 'left' }}>{modalError}</div>
          )}
          <button onClick={onSubmit} style={{ width: '100%', padding: '11px 0', borderRadius: 7, background: '#FFD700', border: 'none', color: '#1B2A6B', fontWeight: 900, cursor: 'pointer', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Arial Black', sans-serif", marginTop: 4 }}>
            Let's Play
          </button>
        </div>
      </div>
    </div>
  )
}
