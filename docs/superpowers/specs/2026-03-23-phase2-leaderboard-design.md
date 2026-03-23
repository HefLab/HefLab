# Phase 2: Score Submission + Daily Leaderboard — Design Spec
**Date:** 2026-03-23
**Project:** Do You Know Ball? (Mostly Ball)
**Phase:** 2 — Backend integration (Supabase), score submission, daily leaderboard

---

## Overview

Extend the existing local player identity system (Phase 1) with a Supabase backend. Each player's score is automatically submitted when the game ends. A daily leaderboard shows how all players ranked on today's puzzle — accessible from the end-game modal and from a trophy button in the header at any time.

---

## Architecture

### Approach

Load `@supabase/supabase-js` via CDN. Submit scores and fetch the leaderboard directly from the browser using Supabase's anon key. All new code lives in `index.html` — no new files, no build step. The existing `usePlayerIdentity` hook is unchanged; the new Supabase client and hooks sit alongside it.

### Why Direct Client (No Edge Function)

Score validation at the database level (CHECK constraint) is sufficient for a casual game. Server-side validation via an Edge Function would add deployment complexity without meaningful security benefit — the risk of a player cheating their score on a friends' leaderboard is low-stakes.

---

## Supabase Setup

### Table: `scores`

```sql
CREATE TABLE scores (
  id            BIGSERIAL PRIMARY KEY,
  player_token  UUID        NOT NULL,
  player_name   TEXT        NOT NULL,
  correct       SMALLINT    NOT NULL CHECK (correct >= 0 AND correct <= 16),
  puzzle_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_player_per_day UNIQUE (player_token, puzzle_date)
);
```

### Row Level Security

RLS must be enabled. Three policies on the anon key:
- **INSERT**: allowed — any user can submit a score
- **SELECT**: allowed — anyone can read leaderboard entries
- **UPDATE / DELETE**: denied — no modifications after submission

### Index

```sql
CREATE INDEX idx_scores_date ON scores (puzzle_date, correct DESC);
```

Supports efficient leaderboard queries filtered by date, sorted by score.

---

## Data Layer

### Config Constants

Added near the top of the script block alongside existing constants (`GAME_URL`, etc.):

```js
const SUPABASE_URL = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### `submitScore(token, name, correct)`

Standalone async function. Called once when the game ends. Uses `upsert` with `onConflict: 'player_token,puzzle_date'` and `ignoreDuplicates: true` — if the same player submits twice on the same day, the first score stands and the second call is silently ignored. All errors are swallowed silently — submission failure does not affect game flow.

```js
async function submitScore(token, name, correct) {
  try {
    await supabaseClient
      .from('scores')
      .upsert({ player_token: token, player_name: name, correct },
               { onConflict: 'player_token,puzzle_date', ignoreDuplicates: true });
  } catch (e) { /* silent */ }
}
```

### `useLeaderboard(puzzleDate, playerToken)`

React hook. Fetches today's scores sorted by `correct DESC`, limited to top 100. Returns:

```js
{ entries: [{ player_name, correct, rank }], totalCount, playerRank, loading }
```

- `playerRank`: the current player's rank (1-based), or `null` if their token isn't in the results
- `totalCount`: total number of players who submitted today (shown as "N players")
- `loading`: boolean, true while fetching
- Called at the top of the main component alongside `usePlayerIdentity()`
- Fetches on mount and after score submission completes

---

## Score Submission Flow

1. Game end is detected by existing logic (all tiles played or no guesses remaining)
2. `submitScore(token, nickname, correct)` is called automatically — no player action required
3. After submission resolves (success or silent failure), `useLeaderboard` re-fetches to pick up the new entry
4. End-game modal renders with leaderboard data
5. If submission fails silently, leaderboard still shows (player just won't appear in it)

---

## UI

### Header Trophy Button

A `🏆` icon button added to the right of the existing nickname pill. Toggles a `showLeaderboard` boolean state (`useState(false)`). Same style as the gear button — gold, unobtrusive.

```
[DO YOU KNOW BALL?]          [🏆] [LucasH ⚙]
```

Clicking `🏆` opens the standalone leaderboard modal (see below).

### Standalone Leaderboard Modal

Opens when the trophy button is clicked during play (before game ends). Full-viewport backdrop, centered navy card — same pattern as the nickname modal. Shows today's leaderboard in the same scrollable format as the end-game modal. Includes a player count ("247 players"). Player's own entry is highlighted. Closeable via backdrop click or Escape key.

### End-Game Modal (Extended)

The existing end-game results modal is extended with a leaderboard section below the Copy Results button:

```
┌─────────────────────────────┐
│       Today's Results        │
│         12 / 16              │
│   [📋 Copy Results]          │
│ ─────────────────────────── │
│ 🏆 Today's Leaderboard       │
│                 (247 players)│
│  1  HoopDreams          16  │
│  2  BallKnower99        15  │
│  3  CoachK_Fan          14  │
│  4  SportsGuy88         13  │
│ ▶5  You                 12  │  ← player row highlighted
│  6  NetBaller           11  │
│  7  Duke4Ever           10  │
│      [scrollable]            │
└─────────────────────────────┘
```

- Max height with `overflow-y: auto` so the modal doesn't grow unbounded
- Player's own row is highlighted (gold-tinted background, "YOU" badge)
- Shows player count in subtitle
- Loading state: spinner/skeleton while fetching
- If leaderboard fetch fails: section is hidden (no error shown to player)

---

## Integration Points in `index.html`

| What | Location | Change type |
|---|---|---|
| Supabase CDN `<script>` | `<head>` | New addition |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `supabaseClient` | Top of script block, constants section | New addition |
| `submitScore()` function | Script block, after hook definitions | New addition |
| `useLeaderboard()` hook | Script block, after `usePlayerIdentity` | New addition |
| Hook call + destructuring | Top of main component | New addition |
| `submitScore()` call | Existing game-end handler | Minimal modification |
| Trophy button `🏆` | Header, right of nickname pill | New addition |
| `showLeaderboard` state | Main component state | New addition |
| Standalone leaderboard modal | Main component return | New addition |
| End-game modal leaderboard section | Existing end-game modal | Extension |

**Nothing else in the game is modified.** No core game logic, no scoring system, no existing state.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Score submission fails (network) | Silent — game unaffected, player won't appear on leaderboard |
| Score submitted twice same day | Silent — first score stands (upsert ignoreDuplicates) |
| Leaderboard fetch fails | Section hidden in modal; no error shown |
| Leaderboard loading | Spinner/skeleton shown while fetching |
| Supabase completely down | Game functions normally; leaderboard section absent |

---

## Acceptance Criteria

- [ ] Score is automatically submitted at game end with no player action required
- [ ] Submitting the same player_token twice on the same day results in one entry (first score wins)
- [ ] Score submission failure is silent — game flow unaffected
- [ ] End-game modal shows a scrollable leaderboard with player count below Copy Results button
- [ ] Player's own row is visually highlighted with rank position
- [ ] Trophy button `🏆` in header opens a standalone leaderboard modal at any time
- [ ] Standalone leaderboard modal is closeable via backdrop click or Escape key
- [ ] Leaderboard shows today's scores only (resets daily)
- [ ] Player count ("N players") is shown
- [ ] Loading state shown while leaderboard fetches
- [ ] If leaderboard fetch fails, section is hidden — no error shown
- [ ] No existing game functionality is broken
- [ ] All new code lives in `index.html` — no new files

---

## Out of Scope

- All-time / cumulative leaderboards
- Per-puzzle historical leaderboards
- Cross-device identity sync
- Optional or required account creation
- Score breakdown by category (row/column performance)
- Real-time leaderboard updates (polling or subscriptions)
