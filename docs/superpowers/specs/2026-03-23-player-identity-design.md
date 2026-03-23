# Player Identity System — Design Spec
**Date:** 2026-03-23
**Project:** Do You Know Ball? (Mostly Ball)
**Phase:** 1 — Local-only identity (no backend)

---

## Overview

Implement a persistent, anonymous player identity system using localStorage. Each player receives a unique browser token and chooses a display nickname. This is the foundation for Phase 2 leaderboard functionality.

---

## Architecture

### Approach
Custom React hook (`usePlayerIdentity`) added to the top of the existing `index.html` script block, above the main game component. All localStorage I/O is isolated in the hook. The main component consumes the hook's return values — no localStorage calls scattered in the component body.

This preserves the single-file architecture and creates a clean boundary that Phase 2 can extend (e.g., swapping localStorage reads for Supabase calls) without touching component logic.

---

## Data Layer

Two localStorage keys are introduced. No existing keys conflict (confirmed: zero current localStorage usage in the codebase).

| Key | Type | Description |
|---|---|---|
| `player_token` | UUID string | Anonymous browser identifier. Generated once on first visit, never changed. |
| `player_nickname` | String | Player-chosen display name. Written on first submission, updateable via settings. |

### Token Generation
Uses `crypto.randomUUID()` (native, modern browsers) with a manual UUID v4 fallback for older browser compatibility:
```js
'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});
```

### Nickname Validation Rules
- Minimum 2 characters
- Maximum 20 characters
- Allowed characters: `a-zA-Z0-9_-` (letters, digits, underscores, hyphens)
- Applied identically at both the initial modal and the settings change input

---

## `usePlayerIdentity` Hook

**Location:** Top of `<script type="text/babel">` block in `index.html`, before the main component definition.

**Responsibilities:**
- Read `player_token` from localStorage on mount; generate and write if absent
- Read `player_nickname` from localStorage; set initial `showModal` state based on whether it exists
- Expose `saveNickname(val)` which validates, writes to localStorage, updates state, and closes the modal

**Return shape:**
```js
{ token, nickname, showModal, saveNickname }
```

**Token is memoized** (`useMemo`) so it is computed once per component mount, not on every render.

---

## Nickname Entry Modal

**Trigger:** `showModal === true` (first visit, or no `player_nickname` in localStorage)

**Behavior:**
- Rendered at the top of the main component's return tree
- Full-viewport dark overlay blocks all game interaction (`pointer-events: none` on game content beneath; overlay has `pointer-events: all`)
- Centered card using existing palette: `#1B2A6B` background, `#FFD700` gold border, white text
- Single labeled text input, Submit button
- Validation on submit — inline error message on failure (no alert dialogs), using `#CC1122` red consistent with game styling
- No dismiss/close — player cannot bypass; must submit a valid nickname

---

## Nickname Display + Settings

**Nickname Display:** A small pill element in the game header, right-aligned. Shows `▶ [Nickname]` in the existing gold/navy palette. Unobtrusive — does not compete with the title.

**Settings Icon:** A `⚙` character button rendered inside the nickname pill, to the right of the displayed name. Clicking opens a compact inline popover (not a full modal) containing:
- A pre-filled text input with the current nickname
- A "Save" button
- Same validation rules as the initial modal

**Popover behavior:**
- Clicking outside (click-away) closes without saving
- On valid save: localStorage updated, nickname state updated, popover closes, display reflects new name immediately
- `player_token` is never modified during a nickname change

---

## Share Function Integration

**File:** `index.html`, `handleCopyResults` function (line ~195)

**Change:** Minimal — one variable read at the top, one conditional prepend to the message string. Existing clipboard logic is untouched.

```js
const handleCopyResults = () => {
  const playerName = localStorage.getItem('player_nickname');
  const pct = Math.round((correct / TOTAL_TILES) * 100);
  const base = `${GRID_LABEL}\nI shot ${correct} / ${TOTAL_TILES} (${pct}% Correct) — Balls in your court now!\n\n${GAME_URL}`;
  const msg = playerName ? `${playerName} — ${base}` : base;
  // existing clipboard logic...
};
```

**Fallback:** If `player_nickname` is null or empty, share text falls back to the existing format with no changes. No error thrown.

---

## Integration Points Summary

| What | Where in `index.html` | Change type |
|---|---|---|
| `usePlayerIdentity` hook | Top of script block | New addition |
| Hook call + destructuring | Top of main component | New addition |
| Nickname modal | Main component return, before game content | New addition |
| Nickname pill + settings popover | Header section | New addition |
| `handleCopyResults` | Existing function | Minimal modification (3 lines) |

**Nothing else in the game is modified.** No core game logic, no scoring system, no state management beyond the identity hook.

---

## Acceptance Criteria

- [ ] First-time visitor sees nickname modal before any game content is accessible
- [ ] Returning visitor with saved nickname goes directly to game
- [ ] `player_token` in localStorage persists across sessions and is never shown in UI
- [ ] `player_token` does not change when nickname is updated
- [ ] Nickname is visible in header during play
- [ ] Settings icon opens nickname change popover; valid save updates display immediately
- [ ] Share output includes nickname prefix when nickname exists
- [ ] Share output falls back gracefully when nickname is null
- [ ] No existing game functionality is broken

---

## Out of Scope (Phase 2)

- Supabase / backend integration
- Score submission
- Leaderboard display
- Cross-device identity sync
