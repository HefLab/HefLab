# Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the single-file `index.html` React + Babel CDN app to a Vite project with proper file structure and GitHub Actions auto-deploy to GitHub Pages.

**Architecture:** Extract the 914-line `index.html` into focused modules: utilities, hooks, components, and data files — all wired together in `App.jsx`. Static assets move to `public/`. GitHub Actions builds and deploys `dist/` to the `gh-pages` branch on every push to `main`.

**Tech Stack:** Vite 5, React 18, @supabase/supabase-js 2, @vitejs/plugin-react, peaceiris/actions-gh-pages

**Spec:** `docs/superpowers/specs/2026-03-24-vite-migration-design.md`

---

## Source Reference

All code in this plan is extracted from `index.html`. Exact line numbers are provided so you can copy accurately:
- `lsGet / lsSet`: lines 119–120
- `validateNickname`: lines 122–125
- `usePlayerIdentity`: lines 127–153
- `submitScore`: lines 155–164
- `useLeaderboard`: lines 166–202
- `validate / nc / buildRevealMap / getVerdict / bgStyle / navBtn`: lines 54–117
- Puzzle loader block: lines 24–47
- `App()` state declarations: lines 204–231
- `App()` handlers (submit, reset, handleCopyResults, etc.): lines 268–333
- Header JSX: lines 386–474
- Grid JSX: lines 492–620 (approx)
- Results screen JSX: search `showEndGame &&`
- NicknameModal JSX: lines 347–381
- SiteNoticeModal JSX: search `showNotice &&`
- LeaderboardPanel JSX: search `showLeaderboard &&`

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html` (replace existing)
- Create: `src/main.jsx`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "do-you-know-ball",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Mostly-Ball-s-V1/'
})
```

- [ ] **Step 3: Install dependencies**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Replace `index.html` with Vite shell**

Overwrite the existing `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Mostly Immaculate Grid — Do You Know Ball?</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 6: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add package.json vite.config.js index.html src/main.jsx && git commit -m "feat: scaffold Vite project structure"
```

---

## Task 2: Static Assets + CSS

**Files:**
- Create: `public/` directory with image assets
- Create: `src/styles/main.css`

- [ ] **Step 1: Copy background images to `public/`**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
cp retro-composite.png public/retro-composite.png
cp retro-left.png public/retro-left.png
cp retro-right.png public/retro-right.png
cp retro-overlay.png public/retro-overlay.png
```

- [ ] **Step 2: Create `src/styles/main.css`**

Extract the `<style>` block from the original `index.html` (lines 13–16). It's small — just two rules:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #CC1122; }
```

- [ ] **Step 3: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add public/ src/styles/main.css && git commit -m "feat: add static assets and base CSS"
```

---

## Task 3: Data Files

**Files:**
- Create: `src/data/players.js`
- Create: `src/data/puzzles.js`

- [ ] **Step 1: Create `src/data/players.js`**

Read the existing `players.js` in the project root. It declares `const PLAYER_DB = [...]`. Convert to ES module:

```js
// Copy the full array content from the existing players.js root file.
// Change: const PLAYER_DB = [...] → export default [...]
const PLAYER_DB = [ /* copy array contents verbatim from root players.js */ ]
export default PLAYER_DB
```

- [ ] **Step 2: Create `src/data/puzzles.js`**

Read the existing `puzzles.js` in the project root. It declares three top-level constants. Convert to named exports:

```js
// Copy puzzle entries verbatim from the existing root puzzles.js.
// Change three globals to named exports:

export const ACTIVE_OVERRIDE = "2026-03-23" // copy exact value from root puzzles.js

export const SITE_NOTICE = "Warning: This is an active prototype. Log-in, Sign-up and Leaderboard features are currently disabled. -THANKS FOR TESTING!" // copy exact value

export const PUZZLES = {
  // copy all date-keyed puzzle entries verbatim from root puzzles.js
}
```

**Important:** Preserve `ACTIVE_OVERRIDE` and `SITE_NOTICE` exactly. Do not alter puzzle entry contents.

- [ ] **Step 3: Verify files are syntactically valid**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && node --input-type=module < src/data/puzzles.js 2>&1 | head -5
```

Expected: no output (no syntax errors).

- [ ] **Step 4: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/data/ && git commit -m "feat: migrate data files to ES modules"
```

---

## Task 4: Utilities

**Files:**
- Create: `src/utils/storage.js`
- Create: `src/utils/validate.js`
- Create: `src/utils/puzzle.js`
- Create: `src/utils/supabase.js`

- [ ] **Step 1: Create `src/utils/storage.js`**

Extract from `index.html` lines 119–120:

```js
export const lsGet = (key) => { try { return localStorage.getItem(key); } catch(e) { return null; } }
export const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch(e) {} }
```

- [ ] **Step 2: Create `src/utils/validate.js`**

Extract from `index.html` lines 54–125. This file needs `ANSWER_POOL`, `ROWS`, `COLUMNS`, and `TOTAL_TILES` — pass them as parameters rather than relying on module-level globals:

```js
export const nc = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

export const validateNickname = (val) => {
  if (!val || val.length < 2 || val.length > 20) return false
  return /^[a-zA-Z0-9_-]+$/.test(val)
}

// answerPool, rows, columns are passed in from App — avoids circular imports
export const buildRevealMap = (cells, answerPool, rows, columns) => {
  const assigned = new Set()
  const map = {}
  for (let ri = 0; ri < rows.length; ri++) {
    for (let ci = 0; ci < columns.length; ci++) {
      const k = `${ri}-${ci}`
      const cell = cells[k]
      const isCorrect = cell?.status === "correct"
      const pool = answerPool[k] || []
      if (isCorrect || pool.length === 0) continue
      const pick = pool.find(a => !assigned.has(nc(a)))
      if (pick) { map[k] = pick; assigned.add(nc(pick)) }
      else { map[k] = pool[0] }
    }
  }
  return map
}

export const validate = (input, key, used, answerPool) => {
  const pool = answerPool[key] || []
  if (pool.length === 0) return { ok: false, reason: "empty" }
  const ni = nc(input.trim())
  if (!ni) return null
  let matched = pool.find(a => nc(a) === ni)
  if (!matched) {
    const byLast = pool.filter(a => { const p = a.split(" "); return nc(p[p.length-1]) === ni })
    if (byLast.length === 1) matched = byLast[0]
  }
  if (!matched) {
    const byFirst = pool.filter(a => nc(a.split(" ")[0]) === ni)
    if (byFirst.length === 1) matched = byFirst[0]
  }
  if (!matched) return { ok: false, reason: "wrong" }
  if (used.has(nc(matched))) return { ok: false, reason: "used", name: matched }
  return { ok: true, name: matched }
}

const TOTAL_TILES = 16
export const getVerdict = (correct) => {
  const pct = correct / TOTAL_TILES
  if (correct === TOTAL_TILES) return { label: "IMMACULATE",   sub: "A perfect board. You absolutely know ball.", color: "#FFD700" }
  if (pct >= 0.75)             return { label: "ELITE",        sub: "Near flawless. You know ball.",             color: "#4ade80" }
  if (pct >= 0.5)              return { label: "SOLID",        sub: "More than half right. Decent hoops IQ.",    color: "#60a5fa" }
  if (pct >= 0.25)             return { label: "BENCH WARMER", sub: "You've watched a game or two... maybe.",    color: "#fb923c" }
  return                              { label: "RIDE THE PINE", sub: "Turn in your sneakers. Study up.",         color: "#f87171" }
}

export const navBtn = (bg, color) => ({
  background: bg, color, border: `2px solid ${color}`, borderRadius: 6, padding: "5px 14px",
  fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", fontFamily: "'Arial', sans-serif"
})
```

- [ ] **Step 3: Create `src/utils/puzzle.js`**

Extract and refactor the puzzle loader block from `index.html` lines 24–47:

```js
export function loadPuzzle(puzzles, activeOverride) {
  const todayReal = new Date().toLocaleDateString('en-CA')
  const dateParam = new URLSearchParams(window.location.search).get('date')
  const today = dateParam || (typeof activeOverride === 'string' ? activeOverride : todayReal)

  let puzzle = null
  if (puzzles && Object.keys(puzzles).length > 0) {
    puzzle = puzzles[today]
    if (!puzzle) {
      const past = Object.keys(puzzles).filter(k => k <= today).sort().reverse()
      puzzle = past.length > 0
        ? puzzles[past[0]]
        : puzzles[Object.keys(puzzles).sort()[0]]
    }
  }

  return {
    puzzle,
    today,
    columns:     puzzle?.columns     ?? [],
    rows:        puzzle?.rows        ?? [],
    answerPool:  puzzle?.answerPool  ?? {},
    weekBadge:   puzzle?.weekBadge   ?? "—",
    gridLabel:   puzzle?.gridLabel   ?? "—",
    cornerPhrase: puzzle?.cornerPhrase ?? "",
  }
}
```

- [ ] **Step 4: Create `src/utils/supabase.js`**

Extract Supabase setup and `submitScore` from `index.html` lines 51–164:

```js
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
```

- [ ] **Step 5: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/utils/ && git commit -m "feat: extract utilities to src/utils"
```

---

## Task 5: Hooks

**Files:**
- Create: `src/hooks/usePlayerIdentity.js`
- Create: `src/hooks/useLeaderboard.js`

- [ ] **Step 1: Create `src/hooks/usePlayerIdentity.js`**

Extract from `index.html` lines 127–153. Import dependencies:

```js
import { useState, useRef } from 'react'
import { lsGet, lsSet } from '../utils/storage.js'

export function usePlayerIdentity() {
  const tokenRef = useRef(null)
  if (!tokenRef.current) {
    let t = lsGet('player_token')
    if (!t) {
      t = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
          })
      lsSet('player_token', t)
    }
    tokenRef.current = t
  }

  const [nickname, setNickname] = useState(() => lsGet('player_nickname') || '')
  const [showModal, setShowModal] = useState(() => !lsGet('player_nickname'))

  const saveNickname = (val) => {
    lsSet('player_nickname', val)
    setNickname(val)
    setShowModal(false)
  }

  return { token: tokenRef.current, nickname, showModal, saveNickname }
}
```

- [ ] **Step 2: Create `src/hooks/useLeaderboard.js`**

Extract from `index.html` lines 166–202:

```js
import { useState, useEffect } from 'react'
import { supabaseClient } from '../utils/supabase.js'

export function useLeaderboard(puzzleDate, playerToken, refreshKey) {
  const [entries, setEntries] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [playerRank, setPlayerRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    supabaseClient
      .from('scores')
      .select('player_token, player_name, correct', { count: 'exact' })
      .eq('puzzle_date', puzzleDate)
      .order('correct', { ascending: false })
      .limit(100)
      .then(({ data, count, error: err }) => {
        if (cancelled) return
        if (err) { setError(true); setLoading(false); return }
        const rows = (data || []).map((row, i) => ({ ...row, rank: i + 1 }))
        setEntries(rows)
        setTotalCount(count || 0)
        const myRow = rows.find(r => r.player_token === playerToken)
        setPlayerRank(myRow ? myRow.rank : null)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [puzzleDate, refreshKey])

  return { entries, totalCount, playerRank, loading, error }
}
```

- [ ] **Step 3: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/hooks/ && git commit -m "feat: extract hooks to src/hooks"
```

---

## Task 6: Simple Components

**Files:**
- Create: `src/components/NicknameModal.jsx`
- Create: `src/components/NicknamePopover.jsx`
- Create: `src/components/SiteNoticeModal.jsx`
- Create: `src/components/LeaderboardPanel.jsx`

- [ ] **Step 1: Create `src/components/NicknameModal.jsx`**

Extract from `index.html` lines 347–381. Receives `modalInput`, `setModalInput`, `modalError`, `onSubmit` as props (handlers stay in App):

```jsx
export default function NicknameModal({ modalInput, setModalInput, modalError, onSubmit, fontFamily }) {
  return (
    <div style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily }}
         role="dialog" aria-modal="true" aria-label="Enter your nickname">
      <div style={{ background: '#1B2A6B', border: '3px solid #FFD700', borderRadius: 12, padding: '36px 32px', maxWidth: 340, width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#FFD700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Welcome</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: "'Arial', sans-serif", marginBottom: 24, lineHeight: 1.5 }}>
          Choose a nickname to track your scores.
        </div>
        <input
          type="text" maxLength={20} placeholder="Your nickname"
          value={modalInput}
          onChange={(e) => setModalInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '2px solid #FFD700', background: '#0d1a4a', color: '#fff', fontSize: 16, fontFamily: "'Arial', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
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
  )
}
```

- [ ] **Step 2: Create `src/components/NicknamePopover.jsx`**

Extract from `index.html` lines 405–455. Receives `nickname`, `show`, `input`, `setInput`, `error`, `onToggle`, `onSave` as props:

```jsx
export default function NicknamePopover({ nickname, show, input, setInput, error, onToggle, onSave }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,212,0,0.12)', border: '1px solid rgba(255,212,0,0.35)', borderRadius: 20, padding: '4px 10px 4px 12px', cursor: 'default' }}>
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
```

- [ ] **Step 3: Create `src/components/SiteNoticeModal.jsx`**

Extracted from `index.html` lines 849–905:

```jsx
export default function SiteNoticeModal({ notice, onClose }) {
  if (!notice) return null
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 1000 }}
    >
      <div
        role="dialog" aria-modal="true" aria-label="Site Notice"
        onClick={e => e.stopPropagation()}
        style={{ background: "#1B2A6B", border: "3px solid #FFD700", borderRadius: 12, padding: "28px 24px 22px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
      >
        <p style={{ color: "#F5F0E0", fontFamily: "'Arial', sans-serif", fontSize: 15, lineHeight: 1.55, marginBottom: 22, whiteSpace: "pre-wrap" }}>
          {notice}
        </p>
        <button
          autoFocus
          onClick={onClose}
          style={{ background: "#FFD700", color: "#1B2A6B", border: "none", borderRadius: 6, padding: "10px 36px", fontSize: 15, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}
        >
          OK
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/LeaderboardPanel.jsx`**

Extracted from `index.html` lines 782–846 (the `LEADERBOARD MODAL` block). Receives `entries`, `totalCount`, `loading`, `error`, `token`, `onClose` as props:

```jsx
export default function LeaderboardPanel({ entries, totalCount, loading, error, token, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 300 }}>
      <div
        role="dialog" aria-modal="true" aria-label="Today's leaderboard"
        onClick={e => e.stopPropagation()}
        style={{ background: '#1B2A6B', border: '3px solid #FFD700', borderRadius: 14, padding: '24px 20px', maxWidth: 380, width: '100%', boxShadow: '6px 6px 0 rgba(0,0,0,0.5)' }}>
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
```

- [ ] **Step 5: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/components/ && git commit -m "feat: add simple components (modals, leaderboard panel)"
```

---

## Task 7: Complex Components

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Grid.jsx`
- Create: `src/components/ResultsScreen.jsx`

- [ ] **Step 1: Create `src/components/Header.jsx`**

Extract the `{/* HEADER */}` block from `index.html` lines 386–490. Start the file with imports, define the prop signature, then paste the JSX block — replacing globals with props per the mapping below. **Do not leave `return null`.**

```jsx
import { navBtn } from '../utils/validate.js'
import NicknamePopover from './NicknamePopover.jsx'

export default function Header({
  weekBadge, gridLabel, rows,
  correct, incorrect, totalPlayed, totalTiles,
  showRules, onToggleRules,
  onEndGame, onReset,
  nickname, showPopover, popoverInput, setPopoverInput, popoverError, onPopoverToggle, onPopoverSave,
  onShowLeaderboard
}) {
  return (
    // PASTE index.html lines 386–490 here verbatim, then apply these replacements:
    // WEEK_BADGE       → weekBadge
    // GRID_LABEL       → gridLabel
    // ROWS             → rows
    // TOTAL_TILES      → totalTiles
    // correct          → correct  (already a prop, no change)
    // incorrect        → incorrect
    // TOTAL_TILES - totalPlayed → totalTiles - totalPlayed
    // showRules state  → showRules prop;  setShowRules(p => !p) → onToggleRules()
    // setShowLeaderboard(true) → onShowLeaderboard()
    // submitScore(...).then(...); setShowEndGame(true) → onEndGame()
    // reset()          → onReset()
    // Replace the inline nickname/popover JSX (lines 405-455) with:
    //   <NicknamePopover nickname={nickname} show={showPopover}
    //     input={popoverInput} setInput={setPopoverInput} error={popoverError}
    //     onToggle={onPopoverToggle} onSave={onPopoverSave} />
  )
}
```

Key prop mappings:
- `WEEK_BADGE` → `weekBadge`
- `GRID_LABEL` → `gridLabel`
- `CORNER_PHRASE` → `cornerPhrase` (used in grid corner cell, not header — leave in Grid)
- `correct`, `incorrect`, `TOTAL_TILES - totalPlayed` → from props
- `showRules && (...)` → conditional render using `showRules` prop; rows passed as prop for the rules box

- [ ] **Step 2: Create `src/components/Grid.jsx`**

Extract `{/* GAME GRID */}` (lines 492–539) and `{/* INPUT MODAL */}` (lines 541–627) from `index.html`. **Do not leave `return null`.**

```jsx
export default function Grid({
  columns, rows, answerPool, cells, active, inputVal, feedback,
  suggestions, suggIdx, acOpen,
  inputRef, dropdownRef,
  onTileClick, onInputChange, onKeyDown,
  onSubmit, onCancel,
  revealMap, cornerPhrase
}) {
  const activeInfo = active
    ? (() => { const [r, c] = active.split("-").map(Number); return { row: rows[r], col: columns[c] } })()
    : null
  const showDropdown = acOpen && suggestions.length > 0
  const showNoResults = acOpen && suggestions.length === 0 && inputVal.trim().length >= 3

  return (
    <>
      {/* PASTE index.html lines 492–539 (the grid) here verbatim, then apply: */}
      {/* COLUMNS → columns, ROWS → rows, ANSWER_POOL → answerPool              */}
      {/* openCell(ri, ci) → onTileClick(ri, ci)                                */}

      {/* PASTE index.html lines 541–627 (the input modal) here verbatim, then: */}
      {/* onChange handler: replace inline logic with onInputChange(e)           */}
      {/* onKeyDown handler: replace inline logic with onKeyDown(e)              */}
      {/* submit() → onSubmit(); setActive(null)/setFeedback(null) → onCancel() */}
      {/* inputRef and dropdownRef come from props — no useRef needed here       */}
    </>
  )
}
```

- [ ] **Step 3: Create `src/components/ResultsScreen.jsx`**

Extract `{/* END GAME MODAL */}` from `index.html` lines 629–780. The leaderboard section (lines 731–776) is embedded inline — keep it here, do not extract to `LeaderboardPanel`. **Do not leave `return null`.**

```jsx
export default function ResultsScreen({
  correct, totalTiles, totalPlayed, cells, columns, rows, answerPool, revealMap,
  verdict, pct, gridLabel, nickname,
  copyToast, onCopyResults, onReset, onKeepPlaying, hasRevealable, onReveal,
  entries, totalCount, token, lbLoading, lbError
}) {
  return (
    // PASTE index.html lines 629–780 here verbatim, then apply:
    // COLUMNS → columns, ROWS → rows, ANSWER_POOL → answerPool
    // TOTAL_TILES → totalTiles
    // handleCopyResults() → onCopyResults()
    // reset() → onReset()
    // setShowEndGame(false) → onKeepPlaying()
    // handleReveal() → onReveal()
    // token in the leaderboard row loop — passed as prop
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/components/Header.jsx src/components/Grid.jsx src/components/ResultsScreen.jsx && git commit -m "feat: add complex components (Header, Grid, ResultsScreen)"
```

---

## Task 8: App.jsx Orchestrator

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Create `src/App.jsx`**

Wire everything together. App holds all state and passes handlers down as props:

```jsx
import { useState, useRef, useEffect } from 'react'
import PLAYER_DB from './data/players.js'
import { PUZZLES, ACTIVE_OVERRIDE, SITE_NOTICE } from './data/puzzles.js'
import { loadPuzzle } from './utils/puzzle.js'
import { validate, nc, buildRevealMap, getVerdict, navBtn } from './utils/validate.js'
import { validateNickname } from './utils/validate.js'
import { submitScore } from './utils/supabase.js'
import { usePlayerIdentity } from './hooks/usePlayerIdentity.js'
import { useLeaderboard } from './hooks/useLeaderboard.js'
import Header from './components/Header.jsx'
import Grid from './components/Grid.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import NicknameModal from './components/NicknameModal.jsx'
import SiteNoticeModal from './components/SiteNoticeModal.jsx'

const TOTAL_TILES = 16
const GAME_URL = "https://lhefner4.github.io/Mostly-Ball-s-V1/"

const { puzzle, today, columns, rows, answerPool, weekBadge, gridLabel, cornerPhrase } =
  loadPuzzle(PUZZLES, ACTIVE_OVERRIDE)

const poolNames = Object.values(answerPool).flat()
const ALL_PLAYERS = [...new Set([...PLAYER_DB, ...poolNames])]

const bgStyle = {
  minHeight: "100vh",
  background: "#7a0a00",
  backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)`,
  backgroundSize: "18px 18px",
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
  const { entries, totalCount, loading: lbLoading, error: lbError } = useLeaderboard(today, token, refreshKey)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const correct   = Object.values(cells).filter(c => c?.status === "correct").length
  const incorrect = Object.values(cells).filter(c => c?.status === "wrong").length
  const totalPlayed = correct + incorrect

  // --- useEffects (copy lines 236–266 verbatim) ---
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
  // Autocomplete input change handler (needs ALL_PLAYERS — defined at module level above App)
  const handleInputChange = (e) => {
    const v = e.target.value
    setInputVal(v); setFeedback(null); setSuggIdx(-1)
    const q = v.trim().toLowerCase()
    if (q.length >= 3) {
      setSuggestions(ALL_PLAYERS.filter(p => p.toLowerCase().startsWith(q) || p.toLowerCase().split(" ").some(w => w.startsWith(q))).slice(0, 30))
      setAcOpen(true)
    } else { setSuggestions([]); setAcOpen(false) }
  }
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === "Enter") {
      if (suggIdx >= 0 && suggestions[suggIdx]) { setInputVal(suggestions[suggIdx]); setSuggestions([]); setSuggIdx(-1); setAcOpen(false) }
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
        showRules={showRules} onToggleRules={() => setShowRules(p => !p)}
        onEndGame={() => { submitScore(token, nickname, correct, today).then(() => setRefreshKey(k => k+1)); setShowEndGame(true) }}
        onReset={reset}
        nickname={nickname}
        showPopover={showPopover} popoverInput={popoverInput} setPopoverInput={setPopoverInput}
        popoverError={popoverError}
        onPopoverToggle={(val) => { if (val === false) { setShowPopover(false); return; } setShowPopover(p => !p); setPopoverInput(nickname); setPopoverError('') }}
        onPopoverSave={handlePopoverSave}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        token={token} today={today}
      />
      <div style={{ height: 22, background: "linear-gradient(to bottom, #1B2A6B, #7a0a00)", width: "100%" }} />
      <Grid
        columns={columns} rows={rows} answerPool={answerPool}
        cells={cells} active={active} inputVal={inputVal} feedback={feedback}
        suggestions={suggestions} suggIdx={suggIdx} acOpen={acOpen}
        inputRef={inputRef} dropdownRef={dropdownRef}
        onTileClick={openCell} onInputChange={handleInputChange}
        onSubmit={submit} onKeyDown={handleKeyDown}
        onCancel={() => { setActive(null); setFeedback(null) }}
        revealMap={revealMap} cornerPhrase={cornerPhrase}
      />
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
```

**Note:** Any handler functions that reference `ALL_PLAYERS` for autocomplete (e.g., `handleInputChange`) must be defined in App.jsx since `ALL_PLAYERS` is module-level there.

- [ ] **Step 2: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add src/App.jsx && git commit -m "feat: add App.jsx orchestrator"
```

---

## Task 9: Local Verification

- [ ] **Step 1: Run dev server**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && npm run dev
```

Expected: `Local: http://localhost:5173/Mostly-Ball-s-V1/` (note the base path)

- [ ] **Step 2: Open in browser and verify**

Navigate to `http://localhost:5173/Mostly-Ball-s-V1/`. Check:
- Nickname modal appears on first load
- Header renders with retro background image
- 4×4 grid renders with team columns and category rows
- Clicking a tile opens the input
- Autocomplete suggestions appear when typing
- Correct answer marks tile green, wrong answer marks red
- Score counters update correctly
- End game / results screen appears after all tiles played
- Site notice modal appears (if `SITE_NOTICE` is non-empty)

- [ ] **Step 3: Fix any import errors shown in terminal or browser console**

Common issues:
- Missing export from a utility (check `src/utils/validate.js` exports)
- JSX syntax error in an extracted component (check curly braces, semicolons)
- Handler references undefined function (check all handlers defined before JSX return)

- [ ] **Step 4: Commit once working**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add -A && git commit -m "feat: Vite migration complete — game verified locally"
```

---

## Task 10: GitHub Actions + Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 2: Add `.gitignore` entry for `node_modules` and `dist`**

Check if `.gitignore` already excludes `node_modules/` and `dist/`. If not, add them:

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && echo "node_modules/\ndist/" >> .gitignore
```

- [ ] **Step 3: Commit the workflow file**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add .github/ .gitignore && git commit -m "feat: add GitHub Actions deploy workflow"
```

- [ ] **Step 3b: Push to GitHub**

⚠️ **Human step required.** Pushing requires a GitHub Personal Access Token (PAT). If you are an agentic worker, stop here and ask the user to push, or ask them to provide their PAT.

If the user provides a PAT, push with:
```bash
git push https://lhefner4:PAT_HERE@github.com/lhefner4/Mostly-Ball-s-V1.git main
```

Alternatively, if the user has already configured SSH or credential helper, just run:
```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git push
```

- [ ] **Step 4: Watch the Actions run**

Go to `https://github.com/lhefner4/Mostly-Ball-s-V1/actions`. The deploy workflow should run within 30 seconds of the push. Wait for it to complete (green checkmark).

- [ ] **Step 5: Flip GitHub Pages source branch**

In the GitHub repo: Settings → Pages → Branch → change from `main` to `gh-pages` → Save.

- [ ] **Step 6: Verify live URL**

Navigate to `https://lhefner4.github.io/Mostly-Ball-s-V1/`. Game should load. Allow up to 2 minutes for Pages to propagate.

---

## Task 11: Update build-puzzle Skill

**Files:**
- Modify: `~/.claude/skills/build-puzzle/SKILL.md`

- [ ] **Step 1: Find the write template in the skill**

```bash
grep -n "const PUZZLES\|puzzles.js\|ACTIVE_OVERRIDE" ~/.claude/skills/build-puzzle/SKILL.md | head -20
```

- [ ] **Step 2: Update the write template**

Find the section in the skill that describes how to write to `puzzles.js`. Update:

Old pattern:
```js
const PUZZLES = { ...existingEntries, "[date]": newEntry }
```

New pattern (ES module named export, append only — do not replace existing entries):
```js
// Read src/data/puzzles.js, locate the closing }; of the PUZZLES export
// Insert the new entry immediately before it:
export const PUZZLES = {
  ...existingEntries,
  "[date]": { weekBadge: "...", gridLabel: "...", ... }
}
```

The skill should also update the file path from `puzzles.js` (root) to `src/data/puzzles.js`.

- [ ] **Step 3: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL" && git add -A && git commit -m "docs: update build-puzzle skill for Vite module format"
```

---

## Final Verification Checklist

- [ ] `npm run dev` — game works locally end-to-end
- [ ] GitHub Actions deploy — workflow passes on push to `main`
- [ ] Live URL — `https://lhefner4.github.io/Mostly-Ball-s-V1/` loads the Vite build
- [ ] `?date=YYYY-MM-DD` URL param — still overrides puzzle date
- [ ] Nickname modal — appears for new users
- [ ] Nickname change popover — works for returning users
- [ ] Score submission — submits to Supabase on game end and "End Game" button
- [ ] Leaderboard — renders in both header and results screen
- [ ] Site notice — appears if `SITE_NOTICE` is non-empty
- [ ] `build-puzzle` skill — write template updated to `src/data/puzzles.js` with `export const` syntax
