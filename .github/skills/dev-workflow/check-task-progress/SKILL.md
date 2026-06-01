---
name: check-task-progress
description: Analyze modified SeniorEase source, spec, test, and config files to infer whether in-progress tasks in `.specs/features/seniorease-platform/tasks.md` have satisfied done criteria. Use when code files change during the developer workflow, before completion, or when asked to "check progress", "what task criteria are done", or "suggest task updates". Do NOT use to implement code, run final verification, or mark tasks complete without evidence.
---

# Check Task Progress

Analyze repository changes against SeniorEase task criteria and suggest progress updates for in-progress tasks. Prefer evidence over optimism; this skill proposes updates but does not write them unless the caller explicitly asks.

## Core Inputs

Read these sources as needed:

1. `.specs/features/seniorease-platform/tasks.md` for task sections, dependencies, `Where`, `Requirement`, `Done when`, `Tests`, and `Gate`.
2. `.specs/features/seniorease-platform/spec.md` for requirement acceptance criteria and edge cases.
3. `.specs/features/seniorease-platform/design.md` for architecture contracts, data models, accessibility premises, and Multi-Zone constraints.
4. `.specs/codebase/TESTING.md` for gate commands and test expectations.
5. Git state from `git status --short`, `git diff --name-only`, and targeted diffs for changed files.
6. Source files, tests, and config files named by changed paths or matching task `Where` fields.

## Workflow

### Step 1: Identify Candidate Tasks

Find tasks that may be affected by current changes.

- Start with `git status --short` and changed file paths.
- Map changed paths to task `Where` entries and nearby folders in `.specs/features/seniorease-platform/tasks.md`.
- Include tasks whose requirements or done criteria mention the changed layer, framework, tests, or documentation.
- Treat tasks with unchecked criteria, partial implementation evidence, or explicit in-progress status as candidates.
- If no files are modified, inspect the requested task id if one was provided; otherwise report that there is no changed-file signal.

Expected result: a candidate task list with the path evidence that caused each match.

### Step 2: Evaluate Done Criteria

For each candidate task, compare every `Done when` checkbox with repository evidence.

- Mark a criterion `satisfied` only when the expected file, code behavior, test, or config exists and matches the task intent.
- Mark a criterion `partial` when files exist but behavior, tests, accessibility, boundaries, or validation are incomplete.
- Mark a criterion `not satisfied` when evidence is missing or contradicts the task.
- Mark a criterion `unknown` when it requires a command or browser check that has not been run.
- Check dependency criteria separately; do not suggest completing a task if a dependency remains incomplete.
- For source code tasks, inspect tests near the modified layer before claiming test criteria are satisfied.

Expected result: criterion-by-criterion status with file evidence.

### Step 3: Check Architecture And Accessibility Fit

Look for task-specific regressions before suggesting progress.

- Domain files must not import React, Next.js, Material UI, Zustand, browser APIs, or infrastructure.
- Application use cases must depend on domain models and ports, not UI, stores, or storage implementations.
- Infrastructure owns adapters, browser storage, and local repositories.
- Stores own Zustand and persistence boundaries, including SSR-safe hydration where relevant.
- Presentation and pages own React, Material UI, semantic HTML, ARIA labels, focus behavior, keyboard operation, live regions, and responsive accessibility.
- Multi-Zone work must use Next.js Multi-Zones for route ownership and Web Components for embedded remote subsections; do not accept Module Federation evidence.

Expected result: any blocker or caveat that affects whether a criterion should be considered done.

### Step 4: Decide Suggested Task Updates

Suggest only updates that are backed by evidence.

- Use high confidence when implementation, tests, and required gate evidence all exist.
- Use medium confidence when implementation evidence exists but the gate has not been run.
- Use low confidence when changed files look related but behavior or tests are not yet inspectable.
- Never suggest changing a checkbox to done based only on file existence when the criterion describes behavior, accessibility, persistence, or tests.
- If a task appears fully satisfied but verification has not run, suggest running `dev-workflow/verify-code` before `dev-workflow/complete-task`.
- If a task is partially satisfied, suggest exactly which criteria can be checked and which should remain open.

Expected result: proposed task progress updates, not direct edits.

### Step 5: Return The Progress Brief

Return results in this exact shape:

```markdown
**Progress Check**
- Changed files reviewed:
- Candidate tasks:
- Overall recommendation:

**Task Findings**
- Task:
- Confidence:
- Criteria satisfied:
- Criteria partial:
- Criteria not satisfied:
- Criteria unknown:
- Evidence:

**Suggested Updates**
- Safe checkbox updates:
- Status wording to suggest:
- Do not update yet:

**Next Verification**
- Commands to run:
- Browser/accessibility checks:
- Handoff:
```

Use `Overall recommendation: no update`, `partial update`, `ready for verification`, or `ready for completion after verification`.

## Handoff Rules

- Do not edit `tasks.md` unless the caller explicitly asks to apply suggested updates.
- Do not run broad gates by default; recommend `dev-workflow/verify-code` for final checks.
- If a changed file maps to multiple tasks, keep all candidates and explain why one is most likely active.
- If evidence is ambiguous, keep the criterion open and explain the missing proof.
- If unrelated user changes are present, do not revert them and do not use them as evidence unless they map to task criteria.
- For frontend task progress, recommend browser automation after meaningful UI changes before completion.

## Examples

### Source Files Changed During T3

User says: "Check task progress"

Actions:
1. Read `git status --short` and see changes under `src/domain/preferences` and `src/domain/activities`.
2. Map those files to T3 because its `Where` field names those folders.
3. Compare T3 done criteria against domain model files and unit tests.
4. Suggest checking criteria for implemented defaults and transitions only if code and tests both support them.

Result: a progress brief that says which T3 boxes are safe to update and which still need tests or gate evidence.

### Frontend Files Changed During T7

User says: "What criteria did these UI changes satisfy?"

Actions:
1. Map changed `src/presentation/personalization` files to T7.
2. Check controls, accessible names, helper text, Zustand preference updates, polite live-region feedback, and component tests.
3. Mark browser verification as unknown if it has not run.

Result: a partial update recommendation with accessibility caveats and next verification steps.

## Troubleshooting

### No Changed Files

Report that there is no modified-file signal. If a task id was provided, evaluate that task against the current repository; otherwise ask for a task id or wait for source changes.

### Task Mapping Is Ambiguous

List candidate tasks with path and requirement evidence. Recommend the task with the strongest `Where` and `Requirement` match, but do not discard plausible candidates.

### Criterion Depends On A Gate

Mark it `unknown` until the relevant command from `.specs/codebase/TESTING.md` has run successfully. Suggest `verify-code` as the next workflow step.
