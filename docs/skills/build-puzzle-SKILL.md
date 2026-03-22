---
name: build-puzzle
description: >
  Use this skill to build a new daily puzzle entry for the Do You Know Ball?
  trivia game. Trigger when the user says they want to create a new puzzle,
  set up tomorrow's game, build a grid, or says things like "I'm ready to
  build tomorrow's puzzle", "let's make a new puzzle", "set up the next grid",
  or "build-puzzle". Runs a 5-phase workflow: concept conversation, parallel
  research agents, flagged review, final approval, then writes to puzzles.js
  and commits.
---

# Build Puzzle Workflow

You are helping the creator of "Do You Know Ball?" build a new daily puzzle entry for `puzzles.js`. This file powers the game at https://lhefner4.github.io/Mostly-Ball-s-V1/

Follow the 5 phases below exactly, in order.

**Project location:** `/home/lucasmhefner/MOSTLY BALL/`
**Puzzle data file:** `/home/lucasmhefner/MOSTLY BALL/puzzles.js`

---

## Setup

Before asking any questions, silently read `/home/lucasmhefner/MOSTLY BALL/puzzles.js` to understand the current puzzle schedule. Note:
- All existing date keys (to avoid creating duplicates)
- The most recent date key and its `weekBadge` value (needed in Phase 1, Q2)

---

## Phase 1: Concept (5 Questions, One at a Time)

Ask each question, wait for the answer, then ask the next. Never batch questions.

### Q1: Date

Ask: **"What date is this puzzle for? (e.g., 'tomorrow', '2026-03-25', etc.)"**

Resolve the answer to a `YYYY-MM-DD` string:
- "tomorrow" → today's date + 1 day
- A weekday name → nearest upcoming date for that day
- A specific date → use as-is

Store as `puzzleDate`. Warn the user if this date already exists in `puzzles.js`.

### Q2: Week Badge

Determine if `puzzleDate` falls in the same **calendar week (Sunday through Saturday)** as the most recent existing puzzle entry.

- **Same week:** Carry over `weekBadge` automatically. Say: *"Using the same week badge: '[value]' — continuing from the last puzzle."* No question needed.
- **New week OR no existing entries:** Ask: **"What's the week badge text? This is the small stamp above the title. (~30 chars max, e.g., 'WEEK 2: BRACKET CHAOS')"**

Store as `weekBadge`.

### Q3: Grid Label

Ask: **"What's the grid name? This appears as the red banner below the title. (~35 chars max, e.g., 'GRID #2: BIG TEN BALLERS')"**

If the user says "suggest one" or "you pick it", defer until after Q4, then generate a name that reflects the theme of the chosen teams.

Store as `gridLabel`.

### Q4: Teams (Columns)

Ask: **"Which 4 teams should be in this grid? Name specific schools, give me a theme and I'll suggest some, or say 'surprise me'."**

- **User names 4 teams:** use them.
- **User gives a theme or 'surprise me':** propose 4 teams with a coherent theme and good player intersections. Explain reasoning briefly. Wait for approval before proceeding.

For each confirmed team, **web search** `"[Team Name] basketball official colors hex"` to find:
- Primary color → `color` hex (e.g., `"#00539B"`)
- Accent/border color → `border` hex, a lighter shade (e.g., `"#1a7fd4"`)

Store as array of 4 objects: `{ name, nickname, color, border }`

### Q5: Categories (Rows)

Ask: **"Which 4 row categories? Each needs a short name and a description of who qualifies. Define them, give me a theme, or say 'use the standard categories'."**

Standard categories (use when user says "same as always" or "standard"):
```
{ name: "Ball Hog",     desc: "Led team in scoring during a Tournament run" }
{ name: "Clutch Balls", desc: "Hit a game-winning shot in March Madness" }
{ name: "Ball Knower",  desc: "Became a broadcaster, analyst, or major media figure" }
{ name: "Ball & Chain", desc: "Won a national championship in their 4th year or more" }
```

For custom categories, help craft a clear `desc` (~60 chars) that unambiguously defines who qualifies.

Store as array of 4 objects: `{ name, desc }`

### Concept Summary Gate

Display:

```
PUZZLE: [puzzleDate]
WEEK BADGE: [weekBadge]
GRID LABEL: [gridLabel]

TEAMS (columns): [Team0] | [Team1] | [Team2] | [Team3]

CATEGORIES (rows):
  0. [Cat0Name] — [Cat0Desc]
  1. [Cat1Name] — [Cat1Desc]
  2. [Cat2Name] — [Cat2Desc]
  3. [Cat3Name] — [Cat3Desc]
```

Ask: **"Ready to research? I'll dispatch 4 agents simultaneously to find valid players for all 16 cells."**

**Do NOT proceed until the user confirms.** Hard gate.

---

## Phase 2: Research (4 Parallel Agents)

In **one single message**, dispatch all 4 Agent tool calls simultaneously. Do not send them one at a time.

Use this prompt template for each agent (fill in the blanks for each team):

```
You are researching valid player answers for one column of a March Madness trivia grid.

YOUR TEAM: [Team Name] ([Nickname])
YOUR COLUMN INDEX: [0 / 1 / 2 / 3]

YOUR 4 CATEGORIES (rows):
  Row 0: [Category 0 Name] — [Category 0 Description]
  Row 1: [Category 1 Name] — [Category 1 Description]
  Row 2: [Category 2 Name] — [Category 2 Description]
  Row 3: [Category 3 Name] — [Category 3 Description]

RESEARCH SCOPE:
- Players who played for [Team Name] during their COLLEGE career (any era)
- Focus on NCAA Tournament history
- Do NOT include professional career accomplishments

SOURCES: basketball-reference.com, Sports Reference CBB, Wikipedia, ESPN, NCAA.com

TASK: For each of your 4 cells ([Team] × each category), web search and find all players who satisfy BOTH the team AND the category.

CONFIDENCE:
- HIGH: confident, clear evidence found
- UNCERTAIN: meaningful doubt — include a one-sentence explanation
- EMPTY: zero players found (no HIGH, no UNCERTAIN)

TARGET: 3–15 HIGH players per cell. If fewer than 3 HIGH, include your best UNCERTAIN candidates. If zero players total, report EMPTY.

RETURN exactly this format for all 4 cells:

[Team] × [Category] (row R, col C):
  HIGH: [Player 1], [Player 2], [Player 3]
  UNCERTAIN: [Player Name] — [one-sentence reason]
  EMPTY: (no)

(Write "none" if a section has no entries, "(no)" for EMPTY if players were found.)
```

**Key mapping:** After all 4 agents return, merge into answerPool:
- Col 0 agent → keys `"0-0"`, `"1-0"`, `"2-0"`, `"3-0"`
- Col 1 agent → keys `"0-1"`, `"1-1"`, `"2-1"`, `"3-1"`
- Col 2 agent → keys `"0-2"`, `"1-2"`, `"2-2"`, `"3-2"`
- Col 3 agent → keys `"0-3"`, `"1-3"`, `"2-3"`, `"3-3"`

answerPool cell values = array of player name strings (HIGH players only at this point).

---

## Phase 3: Flagged Items Review

### UNCERTAIN items

Present all UNCERTAIN players one at a time or as a grouped list:

```
A few items need your call:

  [Team] × [Category] — [Player Name]:
  [Agent's one-sentence reasoning]
  Include? (yes / no)
```

- **Yes** → add to that cell's answerPool array
- **No** → drop entirely

### EMPTY cells

For any cell with zero players:

```
⚠️  [Team] × [Category] — no valid players found.

Options:
  A) Provide player names yourself
  B) Change this category (I'll re-research)
  C) Keep empty — written as `[]` in answerPool. This is a pre-confirmed contract: `validate()` in `index.html` line 71 checks `pool.length === 0` and returns `{ reason: "empty" }`, which the game renders as "⏳ Answer pool coming soon!" — no further verification needed.
```

- **A:** User provides names → add to that cell's array
- **B:** User updates the category desc → dispatch a single-cell agent (see Phase 4 cell redo format), fold results in
- **C:** Write `[]` as the answerPool value (the game handles this gracefully)

### Skip condition

No UNCERTAIN and no EMPTY → skip Phase 3, go directly to Phase 4.

---

## Phase 4: Final Approval

Show the complete formatted entry:

```js
"[puzzleDate]": {
  weekBadge: "[weekBadge]",
  gridLabel: "[gridLabel]",
  columns: [
    { name: "[Team0]", nickname: "[Nick0]", color: "[color0]", border: "[border0]" },
    { name: "[Team1]", nickname: "[Nick1]", color: "[color1]", border: "[border1]" },
    { name: "[Team2]", nickname: "[Nick2]", color: "[color2]", border: "[border2]" },
    { name: "[Team3]", nickname: "[Nick3]", color: "[color3]", border: "[border3]" },
  ],
  rows: [
    { name: "[Cat0Name]", desc: "[Cat0Desc]" },
    { name: "[Cat1Name]", desc: "[Cat1Desc]" },
    { name: "[Cat2Name]", desc: "[Cat2Desc]" },
    { name: "[Cat3Name]", desc: "[Cat3Desc]" },
  ],
  answerPool: {
    "0-0": [...], "0-1": [...], "0-2": [...], "0-3": [...],
    "1-0": [...], "1-1": [...], "1-2": [...], "1-3": [...],
    "2-0": [...], "2-1": [...], "2-2": [...], "2-3": [...],
    "3-0": [...], "3-1": [...], "3-2": [...], "3-3": [...],
  },
},
```

Tell the user: **"Here's the complete entry. Say 'looks good' to write it, request specific edits (e.g., 'remove Player X from 1-2'), or ask to redo a cell (e.g., 'redo Duke × Ball Knower')."**

**Specific edit:** Make it inline, show updated entry.

**Cell redo:** Dispatch a new single Agent:

```
Research valid players for one specific trivia grid cell.

TEAM: [Team Name] ([Nickname])
CATEGORY: [Category Name] — [Category Description]
COLUMN INDEX: [0-3]   ROW INDEX: [0-3]

Scope: college career only, any era, Tournament focus
Sources: basketball-reference, Sports Reference CBB, Wikipedia, ESPN

Return:
  HIGH: [players]
  UNCERTAIN: [player] — [reason]
```

Fold results in, show updated entry. Repeat until user approves.

---

## Phase 5: Write and Commit

### Step 1: Write to puzzles.js

Read `/home/lucasmhefner/MOSTLY BALL/puzzles.js` as text. Insert the new entry using **text manipulation only** (no JSON parsing):

1. Find the line containing exactly `};` with **no leading whitespace** — this is the unique closing line of the top-level `PUZZLES` const. (All entry closers use `  },` with 2-space indent.)
2. Find the last non-blank line before `};`. If it ends with `}` only (no comma), add a trailing comma to make it `},`.
3. Insert the new entry — indented 2 spaces throughout, ending with `  },` — immediately before the `};` line.

Write the modified content back to the file.

### Step 2: Commit

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add puzzles.js
git commit -m "Add puzzle for [puzzleDate]: [gridLabel]"
```

### Step 3: Offer push

Ask: **"Push to GitHub now?"**

If yes:
```bash
git push
```

If no: *"Commit saved locally. Push whenever you're ready."*

---

## Quick Reference: answerPool Key Map

```
          col 0    col 1    col 2    col 3
row 0:   "0-0"   "0-1"   "0-2"   "0-3"
row 1:   "1-0"   "1-1"   "1-2"   "1-3"
row 2:   "2-0"   "2-1"   "2-2"   "2-3"
row 3:   "3-0"   "3-1"   "3-2"   "3-3"

Rows = categories (0–3 top to bottom)
Cols = teams (0–3 left to right)
```
