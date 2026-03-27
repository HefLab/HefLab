import { useState, useRef, useEffect } from 'react'
import PLAYER_DB from './data/players.js'
import { PUZZLES, ACTIVE_OVERRIDE, SITE_NOTICE } from './data/puzzles.js'
import { loadPuzzle } from './utils/puzzle.js'
import { validate, nc, buildRevealMap, getVerdict, navBtn } from './utils/validate.js'
import { validateNickname } from './utils/validate.js'
import { submitScore } from './utils/supabase.js'
import { usePlayerIdentity } from './hooks/usePlayerIdentity.js'
import { useLeaderboard } from './hooks/useLeaderboard.js'
import { useYesterdaysLegend } from './hooks/useYesterdaysLegend.js'
import Header from './components/Header.jsx'
import Grid from './components/Grid.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import NicknameModal from './components/NicknameModal.jsx'
import SiteNoticeModal from './components/SiteNoticeModal.jsx'
import LeaderboardPanel from './components/LeaderboardPanel.jsx'

const TOTAL_TILES = 16
const GAME_URL = "https://heflab.github.io/HefLab/"

const { puzzle, today, columns, rows, answerPool, weekBadge, gridLabel, cornerPhrase } =
  loadPuzzle(PUZZLES, ACTIVE_OVERRIDE)

const poolNames = Object.values(answerPool).flat()
const ALL_PLAYERS = [...new Set([...PLAYER_DB, ...poolNames])]

const bgStyle = {
  minHeight: "100vh",
  backgroundColor: "#0a0f1a",
  backgroundImage: "url('stadium.png')",
  backgroundSize: "cover",
  backgroundPosition: "top center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "scroll",
  fontFamily: "'Arial Black', 'Impact', 'Segoe UI Black', system-ui, sans-serif",
  color: "#fff",
  paddingBottom: 40,
}

export default function App() {
  const { token, nickname, showModal, saveNickname } = usePlayerIdentity()
  const [showPopover, setShowPopover] = useState(false)
  const [modalInput, setModalInput] = useState('')
  const [modalError, setModalError] = useState('')
  const [popoverInput, setPopoverInput] = useState('')
  const [popoverError, setPopoverError] = useState('')
  const [cells, setCells] = useState({})
  const [used, setUsed] = useState(new Set())
  const [active, setActive] = useState(null)
  const [inputVal, setInputVal] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [showRules, setShowRules] = useState(false)
  const [showEndGame, setShowEndGame] = useState(false)
  const [revealMap, setRevealMap] = useState(null)
  const [copyToast, setCopyToast] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggIdx, setSuggIdx] = useState(-1)
  const [acOpen, setAcOpen] = useState(false)
  const [showNotice, setShowNotice] = useState(typeof SITE_NOTICE === 'string' && SITE_NOTICE.length > 0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const { entries, totalCount, playerRank, loading: lbLoading, error: lbError } = useLeaderboard(today, token, refreshKey)
  const { legend, loading: legendLoading, error: legendError } = useYesterdaysLegend(PUZZLES)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const correct   = Object.values(cells).filter(c => c?.status === "correct").length
  const incorrect = Object.values(cells).filter(c => c?.status === "wrong").length
  const totalPlayed = correct + incorrect

  useEffect(() => {
    if (totalPlayed === TOTAL_TILES) {
      submitScore(token, nickname, correct, today).then(() => setRefreshKey(k => k + 1))
      setTimeout(() => setShowEndGame(true), 600)
    }
  }, [totalPlayed])

  useEffect(() => { if (active) setTimeout(() => inputRef.current?.focus(), 60) }, [active])

  useEffect(() => {
    if (suggIdx >= 0 && dropdownRef.current) {
      const el = dropdownRef.current.querySelector('[data-highlighted="true"]')
      if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [suggIdx])

  useEffect(() => {
    if (!showNotice) return
    const onKey = (e) => { if (e.key === 'Escape') setShowNotice(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showNotice])

  useEffect(() => {
    if (!showLeaderboard) return
    const onKey = (e) => { if (e.key === 'Escape') setShowLeaderboard(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showLeaderboard])

  // --- Handlers ---
  const openCell = (r, c) => {
    const k = `${r}-${c}`
    if (cells[k]) return
    setActive(k); setInputVal(""); setFeedback(null); setSuggestions([]); setSuggIdx(-1); setAcOpen(false)
  }

  const submit = () => {
    if (!active || !inputVal.trim()) return
    const res = validate(inputVal, active, used, answerPool)
    if (!res) return
    if (res.reason === "empty") { setFeedback({ type: "error", msg: "⏳ Answer pool coming soon!" }); return }
    if (res.ok) {
      const nu = new Set(used); nu.add(nc(res.name)); setUsed(nu)
      setCells(p => ({ ...p, [active]: { status: "correct", name: res.name } }))
      setFeedback({ type: "correct", msg: `✅ ${res.name} — BUCKETS!` })
      setTimeout(() => { setActive(null); setFeedback(null); setInputVal("") }, 1400)
    } else if (res.reason === "used") {
      setFeedback({ type: "error", msg: `❌ ${res.name} already used!` })
    } else {
      setCells(p => ({ ...p, [active]: { status: "wrong" } }))
      setFeedback(null); setActive(null); setInputVal("")
    }
  }

  const reset = () => {
    setCells({}); setUsed(new Set()); setActive(null); setInputVal(""); setFeedback(null)
    setShowRules(false); setShowEndGame(false); setRevealMap(null); setCopyToast(false)
    setSuggestions([]); setSuggIdx(-1); setAcOpen(false)
  }

  const handleReveal = () => setRevealMap(buildRevealMap(cells, answerPool, rows, columns))

  const handleCopyResults = () => {
    const pctVal = Math.round((correct / TOTAL_TILES) * 100)
    const base = `${gridLabel}\nI shot ${correct} / ${TOTAL_TILES} (${pctVal}% Correct) — Balls in your court now!\n\n${GAME_URL}`
    const msg = nickname ? `${nickname} — ${base}` : base
    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(() => { const ta = document.createElement('textarea'); ta.value = msg; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) })
    } else { const ta = document.createElement('textarea'); ta.value = msg; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
    setCopyToast(true); setTimeout(() => setCopyToast(false), 2200)
  }

  const handleModalSubmit = () => {
    const val = modalInput.trim()
    if (!validateNickname(val)) { setModalError('2–20 characters. Letters, numbers, _ and - only.'); return }
    setModalError(''); saveNickname(val)
  }

  const handlePopoverSave = () => {
    const val = popoverInput.trim()
    if (!validateNickname(val)) { setPopoverError('2–20 characters. Letters, numbers, _ and - only.'); return }
    saveNickname(val); setShowPopover(false); setPopoverError('')
  }

  const handleInputChange = (e) => {
    const v = e.target.value
    setInputVal(v); setFeedback(null); setSuggIdx(-1)
    const q = v.trim().toLowerCase()
    if (q.length >= 3) {
      setSuggestions(ALL_PLAYERS.filter(p => p.toLowerCase().startsWith(q) || p.toLowerCase().split(" ").some(w => w.startsWith(q))).slice(0, 30))
      setAcOpen(true)
    } else { setSuggestions([]); setAcOpen(false) }
  }

  const handleSuggestionSelect = (name) => {
    if (name !== null) setInputVal(name)
    setSuggestions([]); setSuggIdx(-1); setAcOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === "Enter") {
      if (suggIdx >= 0 && suggestions[suggIdx]) { handleSuggestionSelect(suggestions[suggIdx]) }
      else { submit() }
    } else if (e.key === "Escape") {
      if (acOpen) { setSuggestions([]); setSuggIdx(-1); setAcOpen(false) }
      else { setActive(null); setFeedback(null) }
    }
  }

  const verdict = getVerdict(correct)
  const pct     = Math.round((correct / TOTAL_TILES) * 100)
  const hasRevealable = incorrect > 0 || (TOTAL_TILES - totalPlayed) > 0

  if (!puzzle) return <div style={{ color: '#fff', textAlign: 'center', padding: 40, fontFamily: 'sans-serif', fontSize: 20 }}>Game unavailable — check back soon.</div>

  if (showModal) {
    return (
      <NicknameModal
        modalInput={modalInput}
        setModalInput={setModalInput}
        modalError={modalError}
        onSubmit={handleModalSubmit}
        fontFamily={bgStyle.fontFamily}
      />
    )
  }

  return (
    <div style={bgStyle}>
      {showNotice && <SiteNoticeModal notice={SITE_NOTICE} onClose={() => setShowNotice(false)} />}
      <Header
        weekBadge={weekBadge} gridLabel={gridLabel} rows={rows}
        correct={correct} incorrect={incorrect} totalPlayed={totalPlayed} totalTiles={TOTAL_TILES}
        showRules={showRules}
        nickname={nickname}
        showPopover={showPopover} popoverInput={popoverInput} setPopoverInput={setPopoverInput}
        popoverError={popoverError}
        onPopoverToggle={(val) => { if (val === false) { setShowPopover(false); return } setShowPopover(p => !p); setPopoverInput(nickname); setPopoverError('') }}
        onPopoverSave={handlePopoverSave}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      {/* Top divider: red subline + fade gap */}
      <div style={{ background: "#CC1122", height: 3 }} />
      <div style={{ height: 8, background: "linear-gradient(to bottom, rgba(10,15,35,0.35), transparent)" }} />
      <Grid
        columns={columns} rows={rows} answerPool={answerPool}
        cells={cells} active={active} inputVal={inputVal} feedback={feedback}
        suggestions={suggestions} suggIdx={suggIdx} acOpen={acOpen}
        inputRef={inputRef} dropdownRef={dropdownRef}
        onTileClick={openCell} onInputChange={handleInputChange}
        onSuggestionSelect={handleSuggestionSelect}
        onSubmit={submit} onKeyDown={handleKeyDown}
        onCancel={() => { setActive(null); setFeedback(null) }}
        revealMap={revealMap} cornerPhrase={cornerPhrase}
      />
      {/* Bottom divider + action buttons */}
      <div style={{ height: 8, background: "linear-gradient(to top, rgba(10,15,35,0.35), transparent)" }} />
      <div style={{ background: "#CC1122", height: 3 }} />
      <div style={{ background: "#FFD700", height: 5 }} />
      <div style={{ height: 8, background: "linear-gradient(to bottom, rgba(10,15,35,0.35), transparent)" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "6px 14px 20px" }}>
        <button onClick={() => setShowRules(p => !p)} style={{ background: "#0d1a3a", border: "2px solid #FFD700", borderRadius: 3, color: "#FFD700", fontSize: 10, fontWeight: 900, padding: "7px 16px", cursor: "pointer", fontFamily: "'Arial Black', sans-serif", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>
          📋 {showRules ? "Hide Rules" : "How to Play"}
        </button>
        {totalPlayed > 0 && totalPlayed < TOTAL_TILES && (
          <button onClick={() => { submitScore(token, nickname, correct, today).then(() => setRefreshKey(k => k + 1)); setShowEndGame(true) }} style={{ background: "#3a0808", border: "2px solid #f87171", borderRadius: 3, color: "#fca5a5", fontSize: 10, fontWeight: 900, padding: "7px 16px", cursor: "pointer", fontFamily: "'Arial Black', sans-serif", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>
            End Game
          </button>
        )}
        <button onClick={reset} style={{ background: "#3a0808", border: "2px solid #f87171", borderRadius: 3, color: "#fca5a5", fontSize: 10, fontWeight: 900, padding: "7px 16px", cursor: "pointer", fontFamily: "'Arial Black', sans-serif", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>
          🔄 Reset
        </button>
      </div>
      {showLeaderboard && (
        <LeaderboardPanel
          entries={entries}
          totalCount={totalCount}
          loading={lbLoading}
          error={lbError}
          token={token}
          onClose={() => setShowLeaderboard(false)}
          legend={legend}
          legendLoading={legendLoading}
          legendError={legendError}
        />
      )}
      {showEndGame && (
        <ResultsScreen
          correct={correct} totalTiles={TOTAL_TILES} totalPlayed={totalPlayed}
          cells={cells} columns={columns} rows={rows} answerPool={answerPool} revealMap={revealMap}
          verdict={verdict} pct={pct} gridLabel={gridLabel} nickname={nickname}
          copyToast={copyToast} onCopyResults={handleCopyResults} onReset={reset}
          onKeepPlaying={() => setShowEndGame(false)}
          hasRevealable={hasRevealable} onReveal={handleReveal}
          entries={entries} totalCount={totalCount} token={token}
          lbLoading={lbLoading} lbError={lbError}
        />
      )}
    </div>
  )
}
