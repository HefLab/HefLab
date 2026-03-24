# Vite Migration Design Spec
**Date:** 2026-03-24
**Status:** Approved

## Context

The game's entire codebase lives in a single `index.html` (914 lines) using React + Babel via CDN with no build step. The `App()` component alone is ~710 lines. With leaderboard and player identity features actively being built, the monolith is becoming hard to navigate and extend. This migration moves the project to Vite to enable proper file splitting, real npm packages, and automated GitHub Actions deployment — while keeping the game functionally identical.

## Goals

- Enable file-level code splitting (components, hooks, utilities)
- Replace CDN-loaded React, Babel, and Supabase with proper npm packages
- Maintain automated deployment to GitHub Pages on every push to `main`
- Keep plain JavaScript (no TypeScript)
- Big bang migration — game downtime is acceptable, no incremental compatibility required

## File Structure

```
MOSTLY BALL/
├── index.html                      ← minimal Vite HTML shell (<div id="root">)
├── vite.config.js                  ← base path config for GitHub Pages
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml              ← auto-build + deploy on push to main
│
├── public/
│   ├── retro-composite.png         ← static asset served at root URL (used in Header CSS)
│   ├── retro-left.png
│   ├── retro-right.png
│   └── retro-overlay.png
│
├── src/
│   ├── main.jsx                    ← ReactDOM.createRoot entry point
│   ├── App.jsx                     ← orchestrator: all game state, renders sub-components
│   │
│   ├── components/
│   │   ├── Header.jsx              ← retro banner, week badge, grid label, corner phrase, nickname display + change popover
│   │   ├── Grid.jsx                ← 4×4 tile grid + column/row headers + autocomplete input
│   │   ├── ResultsScreen.jsx       ← end-game score, verdict, share button, leaderboard
│   │   ├── NicknameModal.jsx       ← first-time player identity setup modal
│   │   ├── NicknamePopover.jsx     ← inline nickname display + gear icon + change-nickname popover
│   │   ├── SiteNoticeModal.jsx     ← site-wide notice popup (driven by SITE_NOTICE in puzzles.js)
│   │   └── LeaderboardPanel.jsx    ← leaderboard table, rank, total count
│   │
│   ├── hooks/
│   │   ├── usePlayerIdentity.js    ← token generation, nickname state, modal control
│   │   └── useLeaderboard.js       ← Supabase leaderboard fetch, rank resolution
│   │
│   ├── utils/
│   │   ├── validate.js             ← validate(), nc(), buildRevealMap(), getVerdict(), validateNickname()
│   │   ├── storage.js              ← lsGet(), lsSet()
│   │   ├── puzzle.js               ← loadPuzzle(puzzles, activeOverride): resolves today's puzzle
│   │   └── supabase.js             ← createClient() instance + submitScore() async function
│   │
│   ├── data/
│   │   ├── players.js              ← moved from root; export default PLAYER_DB
│   │   └── puzzles.js              ← moved from root; export default { PUZZLES, ACTIVE_OVERRIDE, SITE_NOTICE }
│   │
│   └── styles/
│       └── main.css                ← extracted from index.html <style> block
```

## Component Responsibilities

**`App.jsx`** — Orchestrator only. Holds all game state (`cells`, `used`, `active`, `inputVal`, `feedback`, `showNotice`, game phase). Calls `loadPuzzle()` at top level. Passes data and handlers to sub-components as props. Imports and calls `usePlayerIdentity` and `useLeaderboard`. Calls `submitScore()` on game end.

**`Header.jsx`** — Receives `weekBadge`, `gridLabel`, `cornerPhrase`, `nickname`, `showPopover`, `popoverInput`, `popoverError`, `onPopoverSave`, `onPopoverToggle`. Renders retro composite banner with radial overlay, badge, label, and the `NicknamePopover` component.

**`Grid.jsx`** — Receives `cells`, `columns`, `rows`, `active`, `inputVal`, `onTileClick`, `onSubmit`, `onInputChange`. Renders 4×4 grid with column/row headers and the autocomplete input field.

**`ResultsScreen.jsx`** — Receives `correct`, `cells`, `nickname`, and leaderboard props. Renders end-game score, verdict message, share button, and leaderboard.

**`NicknameModal.jsx`** — Receives `onSave`, `error`. Renders the first-time nickname input overlay shown when no nickname exists in localStorage.

**`NicknamePopover.jsx`** — Receives `nickname`, `show`, `input`, `error`, `onToggle`, `onSave`. Renders the settings gear icon, current nickname display, and the inline popover for changing an existing nickname.

**`SiteNoticeModal.jsx`** — Receives `notice` (string), `onClose`. Renders the site-wide notice popup. Only shown when `SITE_NOTICE` is a non-empty string.

**`LeaderboardPanel.jsx`** — Receives `entries`, `playerRank`, `totalCount`, `loading`. Renders the leaderboard table with rank highlights.

## Hooks (unchanged logic, new files)

**`usePlayerIdentity.js`** — Generates UUID token, manages nickname in localStorage, controls modal visibility. Returns `{ token, nickname, showModal, saveNickname }`.

**`useLeaderboard.js`** — Fetches leaderboard from Supabase, resolves player rank. Returns `{ entries, totalCount, playerRank, loading, error }`.

## Data Files

`players.js` and `puzzles.js` move from root to `src/data/` and become ES modules.

```js
// src/data/players.js
export default [ /* PLAYER_DB array */ ]

// src/data/puzzles.js
export const PUZZLES = { /* date-keyed puzzle entries */ }
export const ACTIVE_OVERRIDE = "2026-03-23"  // or null if not active
export const SITE_NOTICE = "..."             // or "" if no notice
```

**Important:** The `build-puzzle` skill currently writes `const PUZZLES = {...}` global syntax to `puzzles.js`. After migration, the write template must be updated to use `export const PUZZLES = { ...existing, [newDate]: newEntry }` syntax instead. `ACTIVE_OVERRIDE` and `SITE_NOTICE` are manually maintained by the developer and should not be touched by the skill.

## Utilities

**`validate.js`** — Exports `validate()`, `nc()`, `buildRevealMap()`, `getVerdict()`, `validateNickname()`. Pure functions, no logic changes.

**`storage.js`** — Exports `lsGet()`, `lsSet()`. Pure functions.

**`puzzle.js`** — Exports `loadPuzzle(puzzles, activeOverride)`. Accepts the full `PUZZLES` object and the `ACTIVE_OVERRIDE` string (or null). Resolves today's date via `?date=` URL param or `activeOverride`, finds the matching puzzle entry (or nearest past entry), returns `{ columns, rows, answerPool, weekBadge, gridLabel, cornerPhrase }`.

**`supabase.js`** — Creates and exports the Supabase client instance. Also exports `submitScore(token, name, correct, puzzleDate)` async function. Supabase URL and anon key are hardcoded here (the anon key is a public publishable key — not a secret, no `.env` needed). Both were previously inline in `index.html`.

## Static Assets

All images referenced by URL in CSS or inline styles must live in the `public/` folder so Vite copies them to `dist/` at their original path. The `retro-composite.png` background in `Header.jsx` is the critical one — it's referenced as `url('retro-composite.png')` in the background style.

After migration, all references become `url('/retro-composite.png')` (the leading `/` is required — Vite resolves `public/` assets from root, and this differs from the current no-build convention where no leading slash is used).

`peaceiris/actions-gh-pages` automatically adds a `.nojekyll` file to the `gh-pages` branch, preventing Jekyll from stripping Vite's `_assets/` directory.

## Vite Config

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Mostly-Ball-s-V1/'
})
```

The `base` path must match the GitHub Pages repo name exactly, or all asset URLs will 404.

## GitHub Actions Deployment

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

Pushes built `dist/` to a `gh-pages` branch. No secrets to configure — `GITHUB_TOKEN` is built-in. The action automatically adds `.nojekyll` to the `gh-pages` branch.

**Post-migration GitHub setting:** In repo Settings → Pages, change source branch from `main` to `gh-pages`.

## Dependencies (package.json)

```json
{
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

## Migration Sequence

1. Scaffold Vite project into a temp folder (`npm create vite@latest`); copy `package.json`, `vite.config.js` into project root
2. Run `npm install`
3. Copy background images → `public/` folder
4. Extract `<style>` block → `src/styles/main.css`; update any relative image URLs to `/retro-composite.png` (leading slash)
5. Move `players.js` → `src/data/players.js`; convert to `export default`
6. Move `puzzles.js` → `src/data/puzzles.js`; convert to named exports (`PUZZLES`, `ACTIVE_OVERRIDE`, `SITE_NOTICE`)
7. Extract utilities → `src/utils/validate.js` (incl. `validateNickname`), `storage.js`, `puzzle.js`, `supabase.js`
8. Extract hooks → `src/hooks/usePlayerIdentity.js`, `useLeaderboard.js`
9. Extract components → `src/components/` (Header, Grid, ResultsScreen, NicknameModal, NicknamePopover, SiteNoticeModal, LeaderboardPanel)
10. Build `App.jsx` as orchestrator importing all of the above
11. Write `src/main.jsx` entry point
12. Write minimal `index.html` shell
13. Add `.github/workflows/deploy.yml`
14. Run `npm run dev` locally — verify game works end to end
15. Commit, push to `main`, verify Actions deploy succeeds
16. In GitHub repo Settings → Pages, switch source branch to `gh-pages`
17. Update `build-puzzle` skill write template for new `puzzles.js` export format

## Verification

- `npm run dev` — game loads locally, all 16 tiles interactive, autocomplete works
- Submit a correct answer — score updates, tile marks correct
- Play through all 16 tiles — results screen appears, score submits to Supabase
- Leaderboard renders with player rank
- Nickname modal appears on first visit; gear icon + popover works for returning users
- Site notice modal appears if `SITE_NOTICE` is non-empty
- Push to `main` — GitHub Actions workflow passes, live URL updates within ~60 seconds
- Verify `?date=YYYY-MM-DD` URL param still works for puzzle date override
