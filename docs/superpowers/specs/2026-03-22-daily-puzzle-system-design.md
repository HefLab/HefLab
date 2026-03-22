# Daily Puzzle System — Design Spec
**Date:** 2026-03-22
**Project:** Do You Know Ball? (Mostly Immaculate Grid)

---

## Overview

Add a daily puzzle rotation to the existing immaculate grid game. Each day a new puzzle loads automatically based on the current date. Puzzles share a weekly theme but vary in teams (columns), row categories, and answer pools each day. If no puzzle exists for today, the most recent available puzzle is shown.

---

## Data Structure — `puzzles.js`

A new file `puzzles.js` lives alongside `players.js` in the project root. It defines a single global object `PUZZLES` keyed by date strings in `"YYYY-MM-DD"` format.

```js
const PUZZLES = {
  "2026-03-22": {
    weekBadge: "WEEK 1: THIS IS MARCH",       // plain text, ~30 chars max (author responsibility)
    gridLabel: "GRID #1: BLUE BLOOD BALLERS", // plain text, ~35 chars max (author responsibility)
    columns: [
      { name: "Duke",      nickname: "Blue Devils", color: "#00539B", border: "#1a7fd4" },
      { name: "UConn",     nickname: "Huskies",     color: "#000E2F", border: "#1a3a88" },
      { name: "Villanova", nickname: "Wildcats",    color: "#003366", border: "#1a5599" },
      { name: "UNC",       nickname: "Tar Heels",   color: "#4B9CD3", border: "#7bbde8" },
    ],
    rows: [
      { name: "Ball Hog",     desc: "Led team in scoring during a Tournament run" },
      { name: "Clutch Balls", desc: "Hit a game-winning shot in March Madness" },
      { name: "Ball Knower",  desc: "Became a broadcaster, analyst, or major media figure" },
      { name: "Ball & Chain", desc: "Won a national championship in their 4th year or more" },
    ],
    answerPool: {
      "0-0": ["Christian Laettner", "J.J. Redick", /* ... */],
      "0-1": ["Kemba Walker", /* ... */],
      // all 16 cells, "row-col" format, 0-indexed
    }
  },
  "2026-03-23": {
    weekBadge: "WEEK 1: THIS IS MARCH",
    gridLabel: "GRID #2: ...",
    columns: [ /* 4 different teams */ ],
    rows: [ /* 4 different categories */ ],
    answerPool: { /* all 16 cells */ }
  }
};
```

**Adding a new day:** Add a new date-keyed entry and push to GitHub. No changes to `index.html` needed.

**String fields:** Plain text only (no HTML). Rendered via React JSX `{WEEK_BADGE}` / `{GRID_LABEL}`, which auto-escapes. Length limits are author responsibility — no runtime enforcement.

**Requirement:** `puzzles.js` must always contain at least one entry.

---

## Puzzle Loading Logic

The loading logic runs **at the very top of the `<script type="text/babel">` block**, before all other `const` declarations and component definitions.

```js
// --- Puzzle loader ---
// Leading underscore = loader-only variables; do not reference below this block.
const _today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD" in user's local timezone
                                                        // Puzzle rolls over at midnight local time.
                                                        // Users in different timezones see the puzzle
                                                        // roll over at different moments — this is
                                                        // intentional and accepted behavior.

let _puzzle = null;
if (typeof PUZZLES !== 'undefined' && Object.keys(PUZZLES).length > 0) {
  _puzzle = PUZZLES[_today];
  if (!_puzzle) {
    // Fall back to most recent puzzle at or before today
    const _past = Object.keys(PUZZLES).filter(k => k <= _today).sort().reverse();
    _puzzle = _past.length > 0
      ? PUZZLES[_past[0]]
      : PUZZLES[Object.keys(PUZZLES).sort()[0]]; // all future-dated → use earliest available
  }
}

const COLUMNS     = _puzzle ? _puzzle.columns    : [];
const ROWS        = _puzzle ? _puzzle.rows       : [];
const ANSWER_POOL = _puzzle ? _puzzle.answerPool : {};
const WEEK_BADGE  = _puzzle ? _puzzle.weekBadge  : "—";
const GRID_LABEL  = _puzzle ? _puzzle.gridLabel  : "—";
// --- End loader ---
```

**Note on `ALL_PLAYERS`:** The existing line `const ALL_PLAYERS = typeof PLAYER_DB !== 'undefined' ? PLAYER_DB : [...new Set(Object.values(ANSWER_POOL).flat())]...` comes after this loader block in the Babel scope. Since `ANSWER_POOL` is declared by the loader before `ALL_PLAYERS`, this fallback continues to work correctly with no changes.

**Fallback chain:**
1. Today's date key exists → use it
2. Past keys exist → use the most recent one before today
3. All keys are future-dated → use the earliest available (prevents crash)
4. `PUZZLES` undefined or empty → `_puzzle` stays `null`; app renders error state

---

## Changes to `index.html`

**Add (1 line, in `<head>`):**
```html
<script src="puzzles.js"></script>
```
Place immediately after `<script src="players.js"></script>`. Must be synchronous — no `defer` or `async`. The Babel block reads `PUZZLES` at parse time.

**Add (~15 lines):** The puzzle loader block above, at the very top of the `<script type="text/babel">` block.

**Remove (atomic — must happen in the same edit as adding the loader):**
The three hardcoded constants at the top of the Babel block:
```js
const COLUMNS = [ ... ];    // ← delete
const ROWS    = [ ... ];    // ← delete
const ANSWER_POOL = { ... }; // ← delete
```
These move into `puzzles.js` and are re-declared by the loader under the same names. **Do not add the loader in one commit and remove the old declarations in another** — that would create a `const` redeclaration SyntaxError that breaks the page.

**Update (2 strings in header JSX):**
- Line 208: `"WEEK 1: THIS IS MARCH"` → `{WEEK_BADGE}`
- Line 215: `"GRID #1: BLUE BLOOD BALLERS"` → `{GRID_LABEL}`

**Add null guard (top of `App()` function's return statement, before the main div):**
```jsx
if (!_puzzle) return <div style={{ color: '#fff', textAlign: 'center', padding: 40 }}>Game unavailable — check back soon.</div>;
```
This replaces the entire page with a plain error message if `puzzles.js` failed to load or is empty. Place it as the very first line of the return, before all other JSX.

---

## Migration Plan

When implementing, key the initial puzzle entry by the **date the file is first deployed**. Use any date at or before today — the fallback chain ensures the puzzle loads correctly regardless of which past date is used as the key. Move the current `COLUMNS`, `ROWS`, and `ANSWER_POOL` data from `index.html` into `puzzles.js` under that key. Day one game behavior is identical to today.

---

## What Stays the Same

- All game logic: `validate()`, `buildRevealMap()`, `nc()` normalizer
- All UI components and layout
- All styling and theme colors
- Autocomplete (`PLAYER_DB` from `players.js`)
- Results screen, scoring, and share functionality

---

## Out of Scope (future work)

- **Replay prevention:** Per-date completion tracking in localStorage — natural next feature
- **Player database with metadata:** Auto-computing answer pools from tagged player records — excluded in favor of manual curation for correctness
