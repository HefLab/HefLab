# Build Puzzle v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the `build-puzzle` skill to run 16 parallel cell agents, add a viability gate, fix source reliability, and add an autonomy mode that reduces required user confirmations.

**Architecture:** Single file edit — the entire skill lives in `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md`. Changes are made section by section: add autonomy mode to Phase 1, rewrite Phase 2 agent dispatch, insert viability gate logic, and update Phase 3 UNCERTAIN handling.

**Tech Stack:** Markdown skill file, Claude Code Agent tool (for dispatching subagents at runtime)

---

### Task 1: Add Autonomy Mode to Phase 1

**Files:**
- Modify: `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` (Phase 1 section)

- [ ] **Step 1: Read the current Phase 1 section**

Read `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` lines 1–115 to understand the exact current text before editing.

- [ ] **Step 2: Insert autonomy mode question before Q1**

Find the line `### Q1: Date` and insert the following block immediately before it:

```markdown
### Q0: Autonomy Mode

Ask: **"How hands-on do you want to be?
(A) Full auto — run everything, show me the final entry only.
(B) Check-ins — pause at any EMPTY tiles, show me the final entry.
(C) Manual — step through everything like before."**

Store as `autonomyMode`:
- A → `full`
- B → `checkin`
- C → `manual`

> Note: Even in `full` mode, EMPTY cells (zero valid players) always surface for your decision. The difference is that UNCERTAIN players are auto-included and no intermediate gates appear.
```

- [ ] **Step 3: Verify the edit looks correct**

Read the Phase 1 section again and confirm:
- Q0 appears before Q1
- The autonomyMode variable is defined with all three values
- The note about EMPTY cells in `full` mode is present
- No existing questions were accidentally removed or shifted

- [ ] **Step 4: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add /home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md
git commit -m "feat(build-puzzle): add autonomy mode question to Phase 1"
```

---

### Task 2: Rewrite Phase 2 — 16 Parallel Cell Agents

**Files:**
- Modify: `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` (Phase 2 section)

- [ ] **Step 1: Read the current Phase 2 section**

Read the full Phase 2 section to understand the current 4-agent prompt template and key mapping.

- [ ] **Step 2: Replace the Phase 2 header and dispatch instruction**

Find the line:
```
In **one single message**, dispatch all 4 Agent tool calls simultaneously. Do not send them one at a time.
```

Replace with:
```markdown
In **one single message**, dispatch all 16 Agent tool calls simultaneously — one per cell. Do not send them one at a time or in groups.
```

- [ ] **Step 3: Replace the 4-agent prompt template with the 16-agent cell template**

Remove the existing prompt template block (the ``` block starting with "You are researching valid player answers for one column...") and replace it with:

````markdown
Use this prompt for each of the 16 agents (fill in the values for each cell):

```
You are researching valid player answers for one specific cell of a March Madness trivia grid.

YOUR TEAM: [Team Name] ([Nickname])
YOUR CATEGORY: [Category Name] — [Category Description]
YOUR CELL: row [0–3], col [0–3]

RESEARCH SCOPE:
- Players who played for [Team Name] during their COLLEGE career (any era)
- Focus on NCAA Tournament history
- Do NOT include professional career accomplishments

SOURCES — try in this exact order, skip immediately to next if no response on first attempt (no retries):
1. Wikipedia
2. ESPN (espn.com)
3. NCAA.com
4. basketball-reference.com / sports-reference.com/cbb (last resort — known to block automated requests)

TASK: Find all players who satisfy BOTH [Team Name] AND [Category Name — Category Description].

CONFIDENCE:
- HIGH: confident, clear evidence found
- UNCERTAIN: meaningful doubt — include a one-sentence explanation
- EMPTY: zero players found

TARGET: 3–15 HIGH players. If fewer than 3 HIGH, include your best UNCERTAIN candidates. If zero players total, report EMPTY.

RETURN exactly this format:

[Team] × [Category] (row R, col C):
  HIGH: [Player 1], [Player 2], [Player 3]
  UNCERTAIN: [Player Name] — [one-sentence reason]
  EMPTY: (no)

(Write "none" if a section has no entries. Write "yes" for EMPTY if no players were found at all.)
```
````

- [ ] **Step 4: Replace the key mapping section**

Find the "Key mapping" section and replace with:

```markdown
**Key mapping:** After all 16 agents return, merge into answerPool:
- Each agent returns its row index and col index
- Key format: `"row-col"` (e.g., row 2 col 1 → `"2-1"`)
- answerPool cell values = array of HIGH player name strings only

Full key map:
          col 0    col 1    col 2    col 3
row 0:   "0-0"   "0-1"   "0-2"   "0-3"
row 1:   "1-0"   "1-1"   "1-2"   "1-3"
row 2:   "2-0"   "2-1"   "2-2"   "2-3"
row 3:   "3-0"   "3-1"   "3-2"   "3-3"
```

- [ ] **Step 5: Verify the Phase 2 section**

Read the updated Phase 2 section and confirm:
- Dispatch instruction says 16 agents
- Each agent handles exactly 1 cell (1 team × 1 category)
- Source priority order is: Wikipedia → ESPN → NCAA.com → basketball-reference (last)
- "No retries" instruction is explicit
- Return format is unchanged from v1 (HIGH / UNCERTAIN / EMPTY)
- Key mapping covers all 16 cells

- [ ] **Step 6: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add /home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md
git commit -m "feat(build-puzzle): replace 4-agent Phase 2 with 16 parallel cell agents"
```

---

### Task 3: Insert Viability Gate Between Phase 2 and Phase 3

**Files:**
- Modify: `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` (insert new section after Phase 2)

- [ ] **Step 1: Read the boundary between Phase 2 and Phase 3**

Locate the exact line where Phase 2 ends and Phase 3 begins to find the correct insertion point.

- [ ] **Step 2: Insert the viability gate section**

Insert the following complete section between the end of Phase 2 and the `## Phase 3` heading. Use the Edit tool to insert this exact text:

```
---

## Viability Gate (runs automatically after Phase 2)

After all 16 agents return and before showing any results to the user, run this check silently.

### Rule 1 — Broken category (row problem)

If any single row has **2 or more cells** that are EMPTY or have fewer than 3 HIGH players → **full pause**.

Report to the user:

    ⚠️  Category problem: [Category Name] (row R)

    Results for this row:
      [Team 0] × [Category]: [X HIGH players] — [EMPTY / thin]
      [Team 1] × [Category]: [X HIGH players] — [EMPTY / thin]
      [Team 2] × [Category]: [X HIGH players] — [EMPTY / thin]
      [Team 3] × [Category]: [X HIGH players] — [EMPTY / thin]

    Options:
      A) Swap this category — provide a new name and description.
         I'll re-research the 4 cells in this row only. Other columns' results are preserved.
      B) Continue anyway — keep going with thin results for this row.

Wait for user response before proceeding.

### Rule 2 — Broken team (column problem)

If any single column has **3 or more cells** that are EMPTY or have fewer than 3 HIGH players → **soft pause**.

Report to the user:

    ⚠️  Team problem: [Team Name] (col C)

    Results for this column:
      [Team] × [Category 0]: [X HIGH players] — [EMPTY / thin]
      [Team] × [Category 1]: [X HIGH players] — [EMPTY / thin]
      [Team] × [Category 2]: [X HIGH players] — [EMPTY / thin]
      [Team] × [Category 3]: [X HIGH players] — [EMPTY / thin]

    Options:
      A) Swap this team — provide a replacement.
         I'll re-research only this column's 4 cells. Other columns' results are preserved.
      B) Continue anyway.

Wait for user response before proceeding.

### Healthy grid

No rule violations → proceed directly to Phase 3 with no user interaction.

### Re-research after swap

**Category swap (Rule 1):** Dispatch 4 new agents — one per cell in the affected row — using the new category definition. Merge results back in for that row's keys only. Re-run the viability gate after.

**Team swap (Rule 2):** Dispatch 4 new agents — one per cell in the affected column — using the new team. Merge results back in for that column's keys only. Re-run the viability gate after.
```

- [ ] **Step 3: Verify the viability gate section**

Read the new section and confirm:
- It sits between Phase 2 and Phase 3 headings
- Rule 1 covers rows (categories), Rule 2 covers columns (teams)
- Row swap re-researches 4 cells, column swap re-researches 4 cells
- Viability gate re-runs after a swap
- Healthy grid path goes straight to Phase 3

- [ ] **Step 4: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add /home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md
git commit -m "feat(build-puzzle): add viability gate between Phase 2 and Phase 3"
```

---

### Task 4: Update Phase 3 for Autonomy-Aware Behavior

**Files:**
- Modify: `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` (Phase 3 section)

- [ ] **Step 1: Read the current Phase 3 section**

Read the full Phase 3 section (UNCERTAIN items, EMPTY cells, skip condition).

- [ ] **Step 2: Replace the UNCERTAIN items subsection**

Find the `### UNCERTAIN items` subsection and replace its content with:

```markdown
### UNCERTAIN items

**If `autonomyMode` is `full` or `checkin`:** Auto-include all UNCERTAIN players into their cell's answerPool array. No user interaction needed. Skip to EMPTY cells.

**If `autonomyMode` is `manual`:** Present all UNCERTAIN players one at a time or as a grouped list:

```
A few items need your call:

  [Team] × [Category] — [Player Name]:
  [Agent's one-sentence reasoning]
  Include? (yes / no)
```

- **Yes** → add to that cell's answerPool array
- **No** → drop entirely
```

- [ ] **Step 3: Update the skip condition**

Find the `### Skip condition` line and replace its content with:

```markdown
### Skip condition

- **`full` or `checkin` mode:** No UNCERTAIN review occurs. Skip to EMPTY cells only. If no EMPTY cells exist, skip Phase 3 entirely.
- **`manual` mode:** No UNCERTAIN and no EMPTY → skip Phase 3, go directly to Phase 4.
```

- [ ] **Step 4: Verify Phase 3**

Read the updated Phase 3 section and confirm:
- UNCERTAIN items are auto-included in `full` and `checkin` mode
- Manual mode behavior is unchanged
- Skip condition correctly handles all three autonomy modes
- EMPTY cell handling (options A/B/C) is unchanged

- [ ] **Step 5: Commit**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add /home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md
git commit -m "feat(build-puzzle): autonomy-aware Phase 3 UNCERTAIN handling"
```

---

### Task 5: Final Read-Through and Smoke Check

**Files:**
- Read: `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md`

- [ ] **Step 1: Read the complete updated skill file**

Read the entire `/home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md` from top to bottom.

- [ ] **Step 2: Verify end-to-end flow**

Confirm the following sequence is intact and coherent:
1. Setup (read puzzles.js) — unchanged
2. Phase 1: Q0 (autonomy mode) → Q1–Q5 (concept questions) → Concept Summary Gate
3. Phase 2: 16 parallel agents dispatched, source priority listed, key mapping present
4. Viability Gate: Rule 1 (row), Rule 2 (column), healthy path, re-research logic
5. Phase 3: UNCERTAIN auto-include for full/checkin, manual unchanged, EMPTY options unchanged
6. Phase 4: Final approval — unchanged
7. Phase 5: Write and commit — unchanged
8. Quick Reference key map — still present at bottom

- [ ] **Step 3: Check for broken references or leftover v1 text**

Scan for any remaining references to "4 agents", "one column", "dispatch all 4" that weren't updated.

- [ ] **Step 4: Commit if any cleanup fixes were needed**

```bash
cd "/home/lucasmhefner/MOSTLY BALL"
git add /home/lucasmhefner/.claude/skills/build-puzzle/SKILL.md
git commit -m "chore(build-puzzle): cleanup leftover v1 references"
```

If no cleanup was needed, skip this step.
