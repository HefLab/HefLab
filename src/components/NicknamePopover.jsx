export default function NicknamePopover({ nickname, show, input, setInput, error, onToggle, onSave }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0d1a3a', border: '2px solid #FFD700', borderRadius: 3, padding: '5px 11px', cursor: 'default', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
      <span style={{ fontSize: 12, color: '#FFD700', fontFamily: "'Arial', sans-serif", fontWeight: 700, letterSpacing: 0.5 }}>
        {nickname}
      </span>
      <button
        onClick={onToggle}
        aria-label="Change nickname"
        aria-expanded={show}
        style={{ background: 'none', border: 'none', color: 'rgba(255,212,0,0.6)', cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1 }}>
        ⚙
      </button>
      {show && (
        <>
          <div onClick={() => onToggle(false)} style={{ position: 'fixed', inset: 0, zIndex: 149, cursor: 'default' }} />
          <div role="dialog" aria-modal="true" aria-label="Change nickname"
               style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1B2A6B', border: '2px solid #FFD700', borderRadius: 10, padding: '16px', zIndex: 150, minWidth: 220, boxShadow: '0 6px 24px rgba(0,0,0,0.5)', textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'Arial', sans-serif", marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Change Nickname</div>
            <input
              type="text" maxLength={20}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onToggle(false) }}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 5, border: '2px solid #FFD700', background: '#0d1a4a', color: '#fff', fontSize: 14, fontFamily: "'Arial', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 6 }}
              autoFocus
            />
            {error && <div style={{ color: '#CC1122', fontSize: 11, fontFamily: "'Arial', sans-serif", marginBottom: 8 }}>{error}</div>}
            <button onClick={onSave} style={{ width: '100%', padding: '8px 0', borderRadius: 6, background: '#FFD700', border: 'none', color: '#1B2A6B', fontWeight: 900, cursor: 'pointer', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Arial Black', sans-serif" }}>Save</button>
          </div>
        </>
      )}
    </div>
  )
}
