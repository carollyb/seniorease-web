---
name: verify-code
description: Verify a SeniorEase implementation after code changes. Use when the developer workflow needs to run task gates, lint, tests, build, browser checks for frontend changes, and acceptance-criteria review before completion. Do NOT use to implement code, update task checkboxes, or emit final task completion events.
---

# Verify Code

Verify one SeniorEase implementation task before completion. Prefer evidence over optimism: passing commands are necessary, but acceptance criteria, architecture boundaries, accessibility obligations, and changed-file fit must also be checked.

## Core Inputs

Read these sources as needed:

1. `.specs/features/seniorease-platform/tasks.md` for the task section, dependencies, `Done when` criteria, tests, gate, and requirement IDs.
2. `.specs/codebase/TESTING.md` for gate commands and expected results.
3. `.specs/features/seniorease-platform/spec.md` and `.specs/features/seniorease-platform/design.md` for acceptance criteria, edge cases, architecture boundaries, accessibility premises, and Multi-Zone constraints.
4. `AGENTS.md` and `.agents/developer.md` for repo workflow rules when verification routing is unclear.
5. Git state from `git status --short`, `git diff --name-only`, and targeted diffs for changed files.
6. Source files, tests, config, and docs named by the active task or changed paths.

## Workflow

### Step 1: Resolve The Verification Target

Identify exactly one task or inline brief.

- For file-backed tasks, accept identifiers such as `T7`, `7`, `007`, a task title fragment, `next`, or the task from the current developer workflow.
- For inline briefs, use the embedded title, acceptance criteria, tests, and verification notes as the source of truth.
- If no task is clear, infer from changed paths and ask for clarification only when multiple plausible tasks remain.
- If the implementation appears to target a blocked dependency or a different task than requested, report the mismatch before running broad gates.

Expected result: one verification target with title, requirement IDs if present, done criteria, tests, and gate.

### Step 2: Select Commands

Choose the smallest useful verification set first, then add broader checks when risk warrants it.

- Always read `.specs/codebase/TESTING.md` before choosing commands.
- Run the task gate from `tasks.md`: `lint`, `unit`, `e2e`, `build`, or `full`.
- Map gates to commands from the testing matrix: `lint` -> `npm run lint`, `unit` -> `npm test -- --watchAll=false`, `e2e` -> `npm run test:e2e`, `build` -> `npm run build`, `full` -> `npm run lint && npm test -- --watchAll=false && npm run build`.
- Prefer a focused test command before the full unit gate when a changed test file or package script supports it, then run the required gate before completion.
- Run `npm run lint` before build or full verification when TypeScript, React, Next, theme, or config files changed and lint is not already included in the task gate.
- Run `npm run build` before completion when pages, Next config, dependency declarations, MUI theme wiring, or provider composition changed and build is not already included in the task gate.
- Run browser automation after meaningful frontend changes to verify nonblank rendering, responsiveness, keyboard access, focus behavior, accessible names, live regions, and reduced-motion behavior that cannot be proven from unit tests alone.
- If the project is not scaffolded or a required script is missing, do not invent a replacement gate. Inspect files for evidence, report the missing command, and mark verification as blocked unless the caller explicitly accepts the limitation.

Expected result: an ordered command and browser-check plan with the reason each item is needed.

### Step 3: Run Verification

Execute commands carefully and capture concise evidence.

- Use repo-defined scripts rather than direct tool invocations unless the script is missing and the caller accepts a fallback.
- Stop on the first failing required gate unless a later command is needed to understand the same failure.
- Summarize failures with the command, exit status, and the smallest relevant error excerpt.
- If a command fails because of missing dependencies, missing scaffold, unavailable Playwright browsers, or environment constraints, report that as `blocked` with the exact missing prerequisite.
- Do not edit code, specs, task status, snapshots, lockfiles, or generated artifacts during verification.

Expected result: pass/fail/blocked evidence for each required command.

### Step 4: Check Acceptance Criteria

Compare implementation evidence against every task criterion.

- Mark each `Done when` item as `satisfied`, `partial`, `not satisfied`, or `unknown`.
- Use source, test, command, browser, or documentation evidence for each satisfied criterion.
- Keep criteria open when behavior, accessibility, persistence, validation, or integration is implied but not proven.
- Confirm tests exist or were updated in the same layer when the task requires unit, integration, or e2e coverage.
- Confirm requirement IDs from `spec.md` are represented in implementation and tests where applicable.
- Confirm dependency tasks are complete or explicitly waived before recommending completion.

Expected result: criterion-by-criterion evidence that can feed `dev-workflow/complete-task`.

### Step 5: Check Quality Standards

Look for blockers that commands may miss.

- Domain files must not import React, Next.js, Material UI, Zustand, browser APIs, or infrastructure.
- Application use cases must depend on domain models and ports, not UI, stores, or storage implementations.
- Infrastructure must own adapters, browser storage, and local repositories.
- Zustand stores must own persistence boundaries and SSR-safe hydration when relevant.
- Presentation and pages must use semantic HTML, accessible labels, keyboard operation, focus management, live regions, responsive layout, and Material UI patterns appropriate to the task.
- Activity Multi-Zone work must use Next.js Multi-Zones and Web Components for embedded remote subsections; do not accept Module Federation evidence.
- Production code must avoid hardcoded secrets, accidental `console.log`, broad re-render patterns, unnecessary effects, and unrelated refactors.

Expected result: a quality verdict of `pass`, `fail`, or `needs-follow-up`.

### Step 6: Return The Verification Brief

Return results in this exact shape:

```markdown
**Verification**
- Task:
- Status:
- Commands run:
- Browser checks:

**Gate Results**
- Required gate:
- Additional checks:
- Failures or blockers:

**Acceptance Criteria**
- Satisfied:
- Partial:
- Not satisfied:
- Unknown:

**Quality Review**
- Architecture:
- Accessibility:
- Tests:
- Risks:

**Handoff**
- Completion readiness:
- Next step:
```

Use `Status: passed`, `failed`, `blocked`, or `needs-follow-up`. Use `Completion readiness: ready for complete-task` only when required gates pass, all criteria are satisfied, and no unresolved blocker remains.

## Handoff Rules

- Do not mark tasks complete; hand ready tasks to `dev-workflow/complete-task`.
- Do not update `.specs/features/seniorease-platform/tasks.md`; completion owns write-back.
- Do not treat a passing build as acceptance-criteria proof for behavior, accessibility, persistence, or tests.
- If verification fails, summarize the smallest actionable fix area and hand back to implementation.
- If verification is blocked by missing setup, report the missing setup and the evidence inspected manually.
- If unrelated working tree changes exist, avoid using them as verification evidence unless they map directly to the active task.

## Examples

### Unit-Gated Domain Task

User says: "Verify T3"

Actions:
1. Read T3 from `tasks.md` and the unit gate from `TESTING.md`.
2. Inspect changed domain files and co-located tests.
3. Run `npm test -- --watchAll=false`.
4. Confirm domain purity and criteria for defaults, validation, and completion transitions.
5. Return `Status: passed` only if tests pass and every T3 criterion has evidence.

Result: a verification brief ready for `complete-task`, or a focused failure report.

### Frontend Task

User says: "Verify the personalization dashboard"

Actions:
1. Resolve the task to T7 by title/path evidence.
2. Run the unit/integration gate from `tasks.md`.
3. Run lint or build if changed files affect React, theme wiring, or pages.
4. Use browser automation to check visible UI, keyboard operation, accessible names, helper text, and polite live-region feedback.
5. Return criteria evidence and any accessibility blockers.

Result: verification includes both command results and browser/accessibility evidence.

## Troubleshooting

### Required Script Is Missing

Report the missing script, cite `.specs/codebase/TESTING.md`, inspect relevant files for partial evidence, and return `Status: blocked` unless the caller approves a fallback.

### Gate Fails

Stop before completion, summarize the failing command and actionable error, and return `Completion readiness: not ready`.

### Criteria Are Ambiguous

Keep the criterion `unknown`, name the missing proof, and recommend a focused test, browser check, or source inspection that would settle it.

### Browser Check Cannot Run

Report the environment limitation, keep frontend-only evidence `unknown` when it cannot be proven otherwise, and do not recommend completion unless the caller explicitly accepts the exception.
