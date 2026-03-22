# Site Notice Popup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global dismissible popup to the game that shows a creator-written message on load when `SITE_NOTICE` is set to a string in `puzzles.js`.

**Architecture:** A single constant `SITE_NOTICE` in `puzzles.js` controls the feature — `null` means no popup, any non-empty string triggers a modal overlay. Inside `index.html`, a new `showNotice` state drives a fixed overlay rendered at the top of the App return, above all other content.

**Tech Stack:** Vanilla React 18 (CDN/Babel), no build step, no test runner — verification is manual browser checks via `file://` or local server.

---

## File Map

| File | Change |
|------|--------|
| `puzzles.js` | Add `const SITE_NOTICE = null;` near top, alongside `ACTIVE_OVERRIDE` |
| `index.html` | Add `showNotice` state + modal overlay block inside `App` component |

---

### Task 1: Add `SITE_NOTICE` constant to `puzzles.js`

**Files:**
- Modify: `puzzles.js` (top of file, line ~5, alongside `ACTIVE_OVERRIDE`)

- [ ] **Step 1: Open `puzzles.js` and locate `ACTIVE_OVERRIDE`**

It's at the top of the file:
```js
const ACTIVE_OVERRIDE = "2026-03-23";
const PUZZLES = { ...
```

- [ ] **Step 2: Add `SITE_NOTICE` on the line directly after `ACTIVE_OVERRIDE`**

Result should look like:
```js
const ACTIVE_OVERRIDE = "2026-03-23";
const SITE_NOTICE = null;
const PUZZLES = { ...
```

- [ ] **Step 3: Verify the file is valid JS — open `index.html` in a browser and confirm the game loads normally with no console errors**

Open browser dev tools (F12 → Console). Expected: no errors, game loads as usual.

- [ ] **Step 4: Commit**

```bash
git add puzzles.js
git commit -m "feat: add SITE_NOTICE constant to puzzles.js"
```

---

### Task 2: Add `showNotice` state to `index.html`

**Files:**
- Modify: `index.html` — inside `App()` function, in the `useState` block (around line 115–127)

- [ ] **Step 1: Locate the useState declarations block in `App()`**

It starts at line ~115:
```js
function App() {
  const [cells, setCells] = useState({});
  const [used, setUsed] = useState(new Set());
  const [active, setActive] = useState(null);
  ...
  const [acOpen, setAcOpen] = useState(false);
```

- [ ] **Step 2: Add `showNotice` state as the last item in the useState block**

```js
const [showNotice, setShowNotice] = useState(
  typeof SITE_NOTICE === 'string' && SITE_NOTICE.length > 0
);
```

Place it directly after the `acOpen` line.

- [ ] **Step 3: Commit this state addition on its own**

```bash
git add index.html
git commit -m "feat: add showNotice state for site notice popup"
```

---

### Task 3: Render the notice modal overlay

**Files:**
- Modify: `index.html` — inside the `App` return block, just before the closing `</div>` of the root wrapper

- [ ] **Step 1: Locate the end of the App return block**

The return opens at line ~206:
```jsx
return (
  <div style={bgStyle}>
    {/* HEADER */}
    ...
```
Find the closing `</div>` of the outermost `<div style={bgStyle}>` — this is where the modal goes, as the last child.

- [ ] **Step 2: Add the notice modal as the last child inside the root div**

```jsx
{/* SITE NOTICE POPUP */}
{showNotice && (
  <div
    onClick={() => setShowNotice(false)}
    style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, zIndex: 1000
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: "#1B2A6B",
        border: "3px solid #FFD700",
        borderRadius: 12,
        padding: "28px 24px 22px",
        maxWidth: 360,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
      }}
    >
      <p style={{
        color: "#F5F0E0",
        fontFamily: "'Arial', sans-serif",
        fontSize: 15,
        lineHeight: 1.55,
        marginBottom: 22,
        whiteSpace: "pre-wrap"
      }}>
        {SITE_NOTICE}
      </p>
      <button
        onClick={() => setShowNotice(false)}
        style={{
          background: "#FFD700",
          color: "#1B2A6B",
          border: "none",
          borderRadius: 6,
          padding: "10px 36px",
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
          cursor: "pointer"
        }}
      >
        OK
      </button>
    </div>
  </div>
)}
```

Note: `zIndex: 1000` places this above all existing modals (rules: 100, end-game: 200, autocomplete: 999).

The outer div click-to-dismiss (`onClick={() => setShowNotice(false)}`) is a convenience — clicking outside the card also closes it. `e.stopPropagation()` on the inner card prevents accidental dismissal when clicking inside the card.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: render site notice modal overlay"
```

---

### Task 4: Manual verification — popup inactive

- [ ] **Step 1: Confirm `SITE_NOTICE = null` in `puzzles.js`**

- [ ] **Step 2: Open `index.html` in a browser**

Expected: game loads normally, no popup appears, no console errors.

---

### Task 5: Manual verification — popup active

- [ ] **Step 1: Temporarily set `SITE_NOTICE` to a test message in `puzzles.js`**

```js
const SITE_NOTICE = "Hey! You're playing a prototype. Some features may be disabled. Thanks for testing!";
```

Do NOT commit this change — it's verification only.

- [ ] **Step 2: Hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)**

Expected: popup appears over the game immediately on load. Game is not accessible behind it.

- [ ] **Step 3: Click the OK button**

Expected: popup dismisses instantly, full game is accessible, no errors in console.

- [ ] **Step 4: Click outside the card (on the dark overlay)**

Expected: popup also dismisses — convenience dismiss works.

- [ ] **Step 5: Revert `SITE_NOTICE` back to `null`**

```js
const SITE_NOTICE = null;
```

- [ ] **Step 6: Hard-refresh and confirm no popup appears**

- [ ] **Step 7: Commit the reverted state**

```bash
git add puzzles.js
git commit -m "chore: reset SITE_NOTICE to null after verification"
```

---

### Task 6: Push to GitHub

- [ ] **Step 1: Confirm both files are committed and clean**

```bash
git status
```
Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Push**

```bash
git push https://lhefner4:TOKEN@github.com/lhefner4/Mostly-Ball-s-V1.git main
```
Replace `TOKEN` with your current GitHub PAT.

- [ ] **Step 3: Open the live URL and verify the game loads normally with no popup**

Live URL: https://lhefner4.github.io/Mostly-Ball-s-V1/

---

## Usage Going Forward

**To activate a notice:**
1. Open `puzzles.js`
2. Change `const SITE_NOTICE = null;` to `const SITE_NOTICE = "Your message here";`
3. Push

**To deactivate:**
1. Change back to `const SITE_NOTICE = null;`
2. Push
