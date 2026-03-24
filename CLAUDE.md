# CLAUDE.md — Do You Know Ball?

## Project Purpose
March Madness Immaculate Grid-style trivia game. Players fill a 4×4 grid by naming college basketball players
who satisfy both a team (column) and a category (row) condition simultaneously.
Inspired by Barstool Mostly Sports podcast.

## Architecture
- **Single-file app:** `index.html` — React + Babel via CDN. No build step. No npm.
- **Data files (separate from index.html):**
  - `players.js` — player database
  - `puzzles.js` — daily puzzle entries (date-keyed objects)
- **Reference images:** `Photo Ref Folder For UI Dev/` — never overwrite originals
- **Background assets:** `retro-composite.png`, `retro-left.png`, `retro-right.png`, `retro-overlay.png`

## Key Workflows
- **UI changes:** Always use `web-ui-dev` skill (preview gate → implement → push gate). Trigger: "show me what you got"
- **New puzzles:** Use `build-puzzle` skill. Phase 2 dispatches 16 parallel research agents — heaviest step.
- **Answer auditing:** Use `game-research-assistant` skill (read-only). Shorthand: "i need rere"

## Response Rules
- Focus on the specific request. No multiple-option responses unless asked.
- Default to read-only mode — multiple conversations may be active simultaneously.
- Never push to GitHub without explicit user confirmation in that request.
- Always read a file before editing it.
- Commit messages describe what changed and why.

## Conventions
- PIL (Python Pillow) available for image processing — run inline via `python3 << 'EOF'`
- Preview HTML files saved to project root (e.g., `preview_*.html`)
- Prototype styles/theme should NOT change unless explicitly discussed
