# Build Puzzle Skill v2 — Design Spec
**Date:** 2026-03-23
**Status:** Approved

---

## Problem

The existing `build-puzzle` skill (v1) has three bottlenecks:
1. **Hidden sequential work in Phase 2** — 4 agents each process 4 cells one at a time internally, so parallelism is shallower than it appears.
2. **No early exit on bad grids** — all 16 cells are researched before the user learns a category or team is a dead end.
3. **Too many confirmation prompts** — the user must stay at the keyboard throughout, hitting confirm at every gate.

Additionally, Sports Reference (basketball-reference.com) blocks automated requests, causing agents to hang on retries.

---

## Approach

Surgical upgrade to the existing 5-phase structure. No structural redesign — the flow the user already knows is preserved. Four targeted changes are made:

1. Autonomy mode flag in Phase 1
2. 16 parallel cell agents in Phase 2 with a new source priority order
3. Viability gate inserted between Phase 2 and Phase 3
4. Phase 3 auto-include behavior based on autonomy mode

Phases 4 and 5 are unchanged.

---

## Design

### Phase 1 Change: Autonomy Mode

A new question is added at the very top of Phase 1, before any other questions:

> *"How hands-on do you want to be?*
> *(A) Full auto — run everything, show me the final entry only.*
> *(B) Check-ins — pause at any EMPTY tiles, show me the final entry.*
> *(C) Manual — step through everything like before."*

This sets `autonomyMode`:
- `A` → `full`
- `B` → `checkin`
- `C` → `manual`

The existing 5 concept questions (date, week badge, grid label, teams, categories) follow unchanged.

---

### Phase 2 Change: 16 Parallel Cell Agents

**Before:** 4 agents dispatched simultaneously, each handling 1 team × 4 categories (4 cells per agent, processed sequentially within the agent).

**After:** 16 agents dispatched simultaneously, each handling exactly 1 cell (1 team × 1 category).

Each agent receives:
- The team name and nickname
- The single category name and description
- Its row index (0–3) and column index (0–3)
- Research scope (college career only, any era, Tournament focus)
- Source priority order (see below)
- Return format: HIGH / UNCERTAIN / EMPTY

**Source priority order** (try in order, skip to next immediately on no response — no retries):
1. Wikipedia
2. ESPN (espn.com)
3. NCAA.com
4. Sports Reference / basketball-reference.com *(last resort)*

**Target:** 3–15 HIGH confidence players per cell.

**Return format** (unchanged from v1):
```
[Team] × [Category] (row R, col C):
  HIGH: [Player 1], [Player 2], ...
  UNCERTAIN: [Player Name] — [one-sentence reason]
  EMPTY: (no) / yes
```

After all 16 agents return, results are merged into `answerPool` using the same key map:
- Row index × col index → `"row-col"` string key

---

### Viability Gate (new — between Phase 2 and Phase 3)

After all 16 agents return and before any results are shown to the user, run a viability check:

**Rule 1 — Broken category (row problem):**
If any single row has **2 or more cells** that are EMPTY or have fewer than 3 HIGH players → **full pause**.

Action:
- Report which category is the problem and show its cell-by-cell results
- Options: (A) swap the category and re-research the 4 cells in that row only (other columns' results are preserved), (B) continue anyway

**Rule 2 — Broken team (column problem):**
If any single column has **3 or more cells** that are EMPTY or have fewer than 3 HIGH players → **soft pause**.

Action:
- Report which team is the problem and show that column's results
- Options: (A) swap the team and re-research only that column's 4 cells, (B) continue anyway
- The other 3 columns' results are preserved regardless

**Healthy grid:** No viability issues found → proceed directly to Phase 3 with no user interaction.

---

### Phase 3 Change: Autonomy-Aware Review

| autonomyMode | UNCERTAIN handling | EMPTY handling |
|---|---|---|
| `full` | Auto-include all UNCERTAIN | Surface EMPTY cells only (EMPTY cells always surface regardless of mode) |
| `checkin` | Auto-include all UNCERTAIN | Surface EMPTY cells only |
| `manual` | Review one-by-one (unchanged) | Review one-by-one (unchanged) |

In `full` and `checkin` modes, the one-at-a-time UNCERTAIN review loop is skipped entirely. The user only sees and acts on cells that returned zero valid players.

---

### Phases 4 & 5: Unchanged

Phase 4 (final approval) and Phase 5 (write and commit) are identical to v1. The final approval gate — user must say "looks good" before anything is written to `puzzles.js` — is preserved regardless of autonomy mode.

---

## What Does Not Change

- The 5-phase structure and phase names
- The concept question content (Q1–Q5)
- The `answerPool` key map format
- The final approval gate before writing
- The write-and-commit logic in Phase 5
- The `manual` autonomy mode behavior (identical to v1)

---

## Success Criteria

- All 16 cells researched in a single parallel wave
- No agent retries a blocked source more than once
- Viability problems surface before the user reviews results
- In `full` or `checkin` mode, user interaction between Phase 1 confirmation and final approval is limited to viability gate decisions and EMPTY cell resolutions only
