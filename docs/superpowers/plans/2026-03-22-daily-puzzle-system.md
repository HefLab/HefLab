# Daily Puzzle System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a date-driven daily puzzle rotation so each day a new grid of teams, row categories, and answer pools loads automatically.

**Architecture:** All puzzle data moves out of `index.html` into a new `puzzles.js` file as a date-keyed object. A ~15-line loader added to the top of the Babel script block reads today's date, picks the right puzzle, and re-declares `COLUMNS`, `ROWS`, and `ANSWER_POOL` under the same names — so all existing game logic continues to work unchanged.

**Tech Stack:** Vanilla JS (no build step), React 18 CDN + Babel Standalone, GitHub Pages static hosting.

**Spec:** `docs/superpowers/specs/2026-03-22-daily-puzzle-system-design.md`

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| **Create** | `puzzles.js` | New file; contains `PUZZLES` object with all daily puzzle data |
| **Modify** | `index.html` | Add script tag (head), add loader (top of Babel block), remove hardcoded COLUMNS/ROWS/ANSWER_POOL, wire two header strings, add null guard |

---

## Task 1: Create `puzzles.js` with the Day 1 puzzle

**Files:**
- Create: `puzzles.js` (project root, alongside `players.js`)

This file migrates the current hardcoded puzzle data out of `index.html`. The date key must be today's date or any past date — the fallback chain will find it.

- [ ] **Step 1.1: Create `puzzles.js`**

Create `/home/lucasmhefner/MOSTLY BALL/puzzles.js` with this exact content (the current Day 1 data):

```js
// Daily puzzle schedule for Do You Know Ball?
// To add a new day: add a new "YYYY-MM-DD" entry and push to GitHub.
// weekBadge: plain text, ~30 chars max. gridLabel: plain text, ~35 chars max.
const PUZZLES = {
  "2026-03-22": {
    weekBadge: "WEEK 1: THIS IS MARCH",
    gridLabel: "GRID #1: BLUE BLOOD BALLERS",
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
      "0-0": ["Christian Laettner","J.J. Redick","Jay Williams","Shane Battier","Nolan Smith","Tyus Jones","Paolo Banchero","Grayson Allen","Zion Williamson","Johnny Dawkins","Danny Ferry","Jahlil Okafor"],
      "0-1": ["Kemba Walker","Rip Hamilton","Ben Gordon","Shabazz Napier","Ray Allen","Emeka Okafor","Tristen Newton","Jordan Hawkins"],
      "0-2": ["Jalen Brunson","Scottie Reynolds","Allan Ray","Randy Foye","Collin Gillespie","Ryan Arcidiacono","Kris Jenkins","Donte DiVincenzo","Ed Pinckney","Dwayne McClain"],
      "0-3": ["James Worthy","Donald Williams","Sean May","Tyler Hansbrough","Joel Berry II","Wayne Ellington","Marvin Williams","Caleb Love"],
      "1-0": ["Christian Laettner","Tyus Jones"],
      "1-1": ["Kemba Walker","Shabazz Napier","Khalid El-Amin","Rip Hamilton"],
      "1-2": ["Kris Jenkins","Scottie Reynolds","Jalen Brunson"],
      "1-3": ["Charlie Scott","Michael Jordan","Luke Maye","Donald Williams","Caleb Love"],
      "2-0": ["Grant Hill","Jay Bilas","J.J. Redick","Dick Vitale","Seth Davis","Jay Williams","Jim Spanarkel"],
      "2-1": ["Donny Marshall","Rebecca Lobo","Gino Auriemma","Tate George","Donyell Marshall"],
      "2-2": ["Jay Wright","Ed Pinckney"],
      "2-3": ["Antawn Jamison","Brad Daugherty","Eric Montross","Hubert Davis","James Worthy","Joel Berry II","Justin Jackson","Kenny Smith","Marcus Ginyard","Pete Chilcutt","Phil Ford","Rasheed Wallace","Rick Fox","Theo Pinson","Tyler Hansbrough","Tyler Zeller","Vince Carter","Billy Cunningham"],
      "3-0": ["Shane Battier","Clay Buckley","Ron Burt","Ryan Caldbeck","Quinn Cook","Jordan Davidson","Brian Davis","Nate James","Sean Kelly","Greg Koubek","Christian Laettner","J.D. Simpson","Jon Scheyer","Lance Thomas","Brian Zoubek"],
      "3-1": ["Antric Klaiber","Andrew Hurley","Charles Okwandu","Donnell Beverly","E.J. Harrison","Joey Calcaterra","Justin Evanovich","Kyle Bailey","Lasan Kromah","Nahiem Alleyne","Niels Giffey","Rashamel Jones","Ricky Moore","Ryan Swaller","Shabazz Napier","Shamon Tooles","Taliek Brown","Tristen Newton","Tyler Olander"],
      "3-2": ["Ed Pinckney","Dwayne McClain","Gary McLain","Brian Harrington","Ryan Arcidiacono","Daniel Ochefu","Patrick Farrell","Kevin Rafferty","Henry Lowe","Denny Grace","Matt Kennedy","Tom Leibig","Eric Paschall"],
      "3-3": ["Lennie Rosenbluth","Tony Radovich","Bob Young","Jimmy Black","Chris Brust","Jeb Barlow","George Lynch","Henrik Rodl","Matt Wenstrom","Scott Cherry","Travis Stephenson","Jawad Williams","Jackie Manuel","Melvin Scott","C.J. Hooker","Tyler Hansbrough","Danny Green","Bobby Frasor","J.B. Tanner","Patrick Moody","Mike Copeland","Jack Wooten","Marcus Ginyard","Kennedy Meeks","Isaiah Hicks","Nate Britt","Stilman White","Kanler Coker"],
    },
  },
};
```

- [ ] **Step 1.2: Verify the file exists and is valid JS**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
node -e "$(cat puzzles.js); const p = Object.values(PUZZLES)[0]; console.log('Keys:', Object.keys(PUZZLES)); console.log('Columns:', p.columns.length, '(expected 4)'); console.log('AnswerPool cells:', Object.keys(p.answerPool).length, '(expected 16)');"
```

Expected output:
```
Keys: [ '2026-03-22' ]
Columns: 4 (expected 4)
AnswerPool cells: 16 (expected 16)
```

- [ ] **Step 1.3: Commit `puzzles.js`**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add puzzles.js
git commit -m "Add puzzles.js with Day 1 puzzle data migrated from index.html"
```

---

## Task 2: Update `index.html` — the atomic change

**CRITICAL:** All edits in this task must be made and committed together. Adding the loader without removing the old `const COLUMNS/ROWS/ANSWER_POOL` declarations (or vice versa) causes a `const` redeclaration SyntaxError that breaks the page. Do all sub-steps before committing.

**Files:**
- Modify: `index.html`
  - Line 7: add `<script src="puzzles.js"></script>` after players.js
  - Lines 19–53: replace hardcoded constants with loader block
  - Line ~208 (in JSX): wire WEEK_BADGE
  - Line ~215 (in JSX): wire GRID_LABEL
  - Line ~201 (before `return (`): add null guard

### Step 2.1 — Add `<script src="puzzles.js"></script>` to `<head>`

- [ ] In `index.html`, find this line (line 7):
```html
  <script src="players.js"></script>
```
Add the new script tag immediately after it:
```html
  <script src="players.js"></script>
  <script src="puzzles.js"></script>
```

### Step 2.2 — Replace hardcoded constants with the loader block

- [ ] Find this block in `index.html` (lines 22–53, right after `const { useState, useRef, useEffect } = React;`):

```js
    const COLUMNS = [
      { name: "Duke",      nickname: "Blue Devils", color: "#00539B", border: "#1a7fd4" },
      { name: "UConn",     nickname: "Huskies",     color: "#000E2F", border: "#1a3a88" },
      { name: "Villanova", nickname: "Wildcats",    color: "#003366", border: "#1a5599" },
      { name: "UNC",       nickname: "Tar Heels",   color: "#4B9CD3", border: "#7bbde8" },
    ];

    const ROWS = [
      { name: "Ball Hog",     desc: "Led team in scoring during a Tournament run" },
      { name: "Clutch Balls", desc: "Hit a game-winning shot in March Madness" },
      { name: "Ball Knower",  desc: "Became a broadcaster, analyst, or major media figure" },
      { name: "Ball & Chain", desc: "Won a national championship in their 4th year or more" },
    ];

    const ANSWER_POOL = {
      "0-0": ["Christian Laettner","J.J. Redick","Jay Williams","Shane Battier","Nolan Smith","Tyus Jones","Paolo Banchero","Grayson Allen","Zion Williamson","Johnny Dawkins","Danny Ferry","Jahlil Okafor"],
      "0-1": ["Kemba Walker","Rip Hamilton","Ben Gordon","Shabazz Napier","Ray Allen","Emeka Okafor","Tristen Newton","Jordan Hawkins"],
      "0-2": ["Jalen Brunson","Scottie Reynolds","Allan Ray","Randy Foye","Collin Gillespie","Ryan Arcidiacono","Kris Jenkins","Donte DiVincenzo","Ed Pinckney","Dwayne McClain"],
      "0-3": ["James Worthy","Donald Williams","Sean May","Tyler Hansbrough","Joel Berry II","Wayne Ellington","Marvin Williams","Caleb Love"],
      "1-0": ["Christian Laettner","Tyus Jones"],
      "1-1": ["Kemba Walker","Shabazz Napier","Khalid El-Amin","Rip Hamilton"],
      "1-2": ["Kris Jenkins","Scottie Reynolds","Jalen Brunson"],
      "1-3": ["Charlie Scott","Michael Jordan","Luke Maye","Donald Williams","Caleb Love"],
      "2-0": ["Grant Hill","Jay Bilas","J.J. Redick","Dick Vitale","Seth Davis","Jay Williams","Jim Spanarkel"],
      "2-1": ["Donny Marshall","Rebecca Lobo","Gino Auriemma","Tate George","Donyell Marshall"],
      "2-2": ["Jay Wright","Ed Pinckney"],
      "2-3": ["Antawn Jamison","Brad Daugherty","Eric Montross","Hubert Davis","James Worthy","Joel Berry II","Justin Jackson","Kenny Smith","Marcus Ginyard","Pete Chilcutt","Phil Ford","Rasheed Wallace","Rick Fox","Theo Pinson","Tyler Hansbrough","Tyler Zeller","Vince Carter","Billy Cunningham"],
      "3-0": ["Shane Battier","Clay Buckley","Ron Burt","Ryan Caldbeck","Quinn Cook","Jordan Davidson","Brian Davis","Nate James","Sean Kelly","Greg Koubek","Christian Laettner","J.D. Simpson","Jon Scheyer","Lance Thomas","Brian Zoubek"],
      "3-1": ["Antric Klaiber","Andrew Hurley","Charles Okwandu","Donnell Beverly","E.J. Harrison","Joey Calcaterra","Justin Evanovich","Kyle Bailey","Lasan Kromah","Nahiem Alleyne","Niels Giffey","Rashamel Jones","Ricky Moore","Ryan Swaller","Shabazz Napier","Shamon Tooles","Taliek Brown","Tristen Newton","Tyler Olander"],
      "3-2": ["Ed Pinckney","Dwayne McClain","Gary McLain","Brian Harrington","Ryan Arcidiacono","Daniel Ochefu","Patrick Farrell","Kevin Rafferty","Henry Lowe","Denny Grace","Matt Kennedy","Tom Leibig","Eric Paschall"],
      "3-3": ["Lennie Rosenbluth","Tony Radovich","Bob Young","Jimmy Black","Chris Brust","Jeb Barlow","George Lynch","Henrik Rodl","Matt Wenstrom","Scott Cherry","Travis Stephenson","Jawad Williams","Jackie Manuel","Melvin Scott","C.J. Hooker","Tyler Hansbrough","Danny Green","Bobby Frasor","J.B. Tanner","Patrick Moody","Mike Copeland","Jack Wooten","Marcus Ginyard","Kennedy Meeks","Isaiah Hicks","Nate Britt","Stilman White","Kanler Coker"],
    };
```

Replace the entire block with the loader:

```js
    // --- Puzzle loader ---
    // Leading underscore = loader-only variables; do not reference below this block.
    const _today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD" local timezone

    let _puzzle = null;
    if (typeof PUZZLES !== 'undefined' && Object.keys(PUZZLES).length > 0) {
      _puzzle = PUZZLES[_today];
      if (!_puzzle) {
        const _past = Object.keys(PUZZLES).filter(k => k <= _today).sort().reverse();
        _puzzle = _past.length > 0
          ? PUZZLES[_past[0]]
          : PUZZLES[Object.keys(PUZZLES).sort()[0]];
      }
    }

    const COLUMNS     = _puzzle ? _puzzle.columns    : [];
    const ROWS        = _puzzle ? _puzzle.rows       : [];
    const ANSWER_POOL = _puzzle ? _puzzle.answerPool : {};
    const WEEK_BADGE  = _puzzle ? _puzzle.weekBadge  : "—";
    const GRID_LABEL  = _puzzle ? _puzzle.gridLabel  : "—";
    // --- End loader ---
```

### Step 2.3 — Wire WEEK_BADGE in header JSX

- [ ] Find this string in `index.html` (around line 208):
```jsx
              WEEK 1: THIS IS MARCH
```
Replace with:
```jsx
              {WEEK_BADGE}
```

### Step 2.4 — Wire GRID_LABEL in header JSX

- [ ] Find this string in `index.html` (around line 215):
```jsx
              GRID #1: BLUE BLOOD BALLERS
```
Replace with:
```jsx
              {GRID_LABEL}
```

### Step 2.5 — Add null guard before `return (`

- [ ] Find this section in `index.html` (around lines 197–202):

```js
      const verdict  = getVerdict(correct);
      const pct      = Math.round((correct / TOTAL_TILES) * 100);
      const gridCols = "106px 1fr 1fr 1fr 1fr";
      const hasRevealable = incorrect > 0 || (TOTAL_TILES - totalPlayed) > 0;

      return (
```

Insert the null guard as a standalone `if` statement immediately before `return (`, shifting `return (` down by one line. **Do not put it inside the JSX return block** — it must be a JS early-return that fully short-circuits before the grid renders:

```js
      const verdict  = getVerdict(correct);
      const pct      = Math.round((correct / TOTAL_TILES) * 100);
      const gridCols = "106px 1fr 1fr 1fr 1fr";
      const hasRevealable = incorrect > 0 || (TOTAL_TILES - totalPlayed) > 0;

      if (!_puzzle) return <div style={{ color: '#fff', textAlign: 'center', padding: 40, fontFamily: 'sans-serif', fontSize: 20 }}>Game unavailable — check back soon.</div>;

      return (
```

### Step 2.6 — Verify no stray `const COLUMNS/ROWS/ANSWER_POOL` remain in the Babel block

- [ ] Search the file to confirm the old declarations are gone:

```bash
grep -n "^    const COLUMNS\|^    const ROWS\|^    const ANSWER_POOL" "/home/lucasmhefner/MOSTLY BALL/index.html"
```

Expected output: **empty** (no matches). If anything prints, that line still has the old declaration and must be removed.

### Step 2.7 — Commit the atomic change

- [ ] Commit everything together:

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add index.html
git commit -m "Wire index.html to load daily puzzle from puzzles.js"
```

---

## Task 3: Verify the game works in the browser

**No test runner exists — verification is done by loading the file and checking behavior.**

- [ ] **Step 3.1: Open the game in a browser and confirm it loads**

Open `/home/lucasmhefner/MOSTLY BALL/index.html` in a browser. Confirm:
- The page loads without a blank white screen or console errors
- The header shows "WEEK 1: THIS IS MARCH" in the rotated badge
- The header shows "GRID #1: BLUE BLOOD BALLERS" in the red banner
- The 4×4 grid renders with Duke, UConn, Villanova, UNC as column headers
- The 4 row categories (Ball Hog, Clutch Balls, Ball Knower, Ball & Chain) appear

- [ ] **Step 3.2: Confirm a correct answer is accepted**

Click any grid tile, type "Kemba Walker", submit. Confirm the tile turns green and the answer is accepted. (Cell `0-1` = UConn × Ball Hog, Kemba Walker is in that pool.)

- [ ] **Step 3.3: Confirm the fallback works**

Temporarily edit `puzzles.js` to change `"2026-03-22"` to `"2024-01-01"` (a past date). Reload the page. Confirm the game still loads and shows the same puzzle (fallback to most recent past key). Then revert the date back to `"2026-03-22"` and save.

- [ ] **Step 3.4: Confirm null guard works**

Temporarily add `const PUZZLES = {};` at the top of `puzzles.js` (making it empty), reload the page. Confirm you see "Game unavailable — check back soon." Then remove the override and revert to the correct file.

---

## Task 4: Push to GitHub and verify live site

- [ ] **Step 4.1: Push both files**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git log --oneline -3
```

Confirm the two commits from Tasks 1 and 2 are present. Then push (replace TOKEN with your GitHub PAT):

```bash
git push https://lhefner4:TOKEN@github.com/lhefner4/Mostly-Ball-s-V1.git main
```

- [ ] **Step 4.2: Verify live site**

Wait ~60 seconds, then open `https://lhefner4.github.io/Mostly-Ball-s-V1/` and confirm the game loads and plays identically to before.

---

## Adding Future Daily Puzzles

Once this system is live, adding a new day is:

1. Open `puzzles.js`
2. Add a new entry after the last one:

```js
  "2026-03-23": {
    weekBadge: "WEEK 1: THIS IS MARCH",
    gridLabel: "GRID #2: YOUR THEME HERE",
    columns: [
      { name: "Kentucky",  nickname: "Wildcats",  color: "#0033A0", border: "#3366cc" },
      { name: "Kansas",    nickname: "Jayhawks",  color: "#0051A5", border: "#3374c8" },
      { name: "Syracuse",  nickname: "Orange",    color: "#D44500", border: "#ff6a1a" },
      { name: "Michigan",  nickname: "Wolverines",color: "#00274C", border: "#1a4a70" },
    ],
    rows: [
      { name: "Ball Hog",     desc: "Led team in scoring during a Tournament run" },
      { name: "Clutch Balls", desc: "Hit a game-winning shot in March Madness" },
      { name: "Ball Knower",  desc: "Became a broadcaster, analyst, or major media figure" },
      { name: "Ball & Chain", desc: "Won a national championship in their 4th year or more" },
    ],
    answerPool: {
      "0-0": [ /* players who led Kentucky in scoring during a Tournament run */ ],
      "0-1": [ /* players who led Kansas in scoring during a Tournament run */ ],
      // ... all 16 cells
    },
  },
```

3. `git add puzzles.js && git commit -m "Add GRID #2 puzzle" && git push ...`

That's it — the game picks it up automatically the next day.
