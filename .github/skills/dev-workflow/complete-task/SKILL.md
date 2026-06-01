---
name: complete-task
description: Mark a SeniorEase implementation task complete after verification. Use when the developer workflow has implemented a task, `verify-code` has passed or produced accepted evidence, and the agent must update `.specs/features/seniorease-platform/tasks.md`, record progress, and emit a completion signal for automation hooks. Do NOT use before verification, for partial progress suggestions, or to implement code.
---

# Complete Task

Finalize one SeniorEase task by applying evidence-backed task updates and emitting a stable completion signal. This is the workflow's write-back step, not an implementation or verification step.

## Preconditions

Continue only when all are true:

1. A single task is identified from `.specs/features/seniorease-platform/tasks.md`.
2. `dev-workflow/check-task-progress` or equivalent evidence shows all required `Done when` criteria are satisfied.
3. `dev-workflow/verify-code` has run the task's required gate, or the caller explicitly accepted why the gate could not run.
4. Dependencies listed in `Depends on` are complete or explicitly waived by the caller.

If any precondition is missing, stop and return the missing evidence instead of editing task files.

## Core Inputs

Read these sources as needed:

1. `.specs/features/seniorease-platform/tasks.md` for the task section, done criteria, dependencies, tests, and gate.
2. `.specs/codebase/TESTING.md` for gate command meanings.
3. The latest `check-task-progress` and `verify-code` outputs, if present in the conversation.
4. Targeted repository files only when final evidence needs confirmation.

## Workflow

### Step 1: Resolve Completion Target

Identify exactly one task.

- Accept task identifiers such as `T7`, `7`, a task title fragment, or the task from the current developer workflow.
- If multiple tasks match, stop and ask the caller to choose.
- If the prompt contains an inline task brief, do not edit `tasks.md`; emit the completion signal using the inline title and mark file updates as not applicable.

Expected result: one completion target with task id, title, gate, tests, dependencies, and requirement IDs.

### Step 2: Confirm Completion Evidence

Build a compact evidence ledger before editing.

- Confirm every `Done when` checkbox is satisfied by source, test, documentation, or command evidence.
- Confirm the gate command passed, or capture the caller-approved reason it could not run.
- Confirm no known blocker remains from `check-task-progress`, `verify-code`, browser checks, or accessibility checks.
- For frontend tasks, confirm browser automation ran after meaningful UI changes or record an explicit accepted exception.
- For documentation-only tasks, confirm the required document exists and the build gate has passed if the task requires it.

Expected result: `complete`, `blocked`, or `needs-verification`.

### Step 3: Update Task Progress

When evidence is complete, update only the matching task section in `.specs/features/seniorease-platform/tasks.md`.

- Change each satisfied `Done when` checkbox in that task from `- [ ]` to `- [x]`.
- If the task section has unchecked criteria that are not satisfied, do not mark the task complete.
- Add or update a task-local status line only when the file already uses task-local status lines or the caller asks for one. Prefer `**Status**: Completed`.
- Do not modify unrelated tasks, global project status, roadmap text, requirement traceability, or formatting outside the task section.
- Preserve the existing task title, requirement IDs, tests, and gate text unless the caller explicitly asks to repair specs.

Expected result: the task section reflects only evidence-backed completion.

### Step 4: Emit Completion Signal

Always include a completion event block in the final response. Use this exact label followed by valid compact JSON:

```text
TASK_COMPLETION_EVENT {"taskId":"Tn","title":"Task title","status":"completed","gate":"gate-name","gateCommand":"command or not-run-approved","completedAt":"YYYY-MM-DD","updatedFiles":["path"],"requirements":["SE-01"],"automationSignal":"task.completed"}
```

Rules for the event:

- Use the current local date for `completedAt`.
- Include `updatedFiles` with `.specs/features/seniorease-platform/tasks.md` when file-backed completion updated the task ledger.
- Use `status:"blocked"` or `status:"needs-verification"` only when no file update was applied.
- Keep JSON on one line so automation hooks can parse it.

### Step 5: Return The Completion Brief

Return results in this exact shape:

```markdown
**Completion**
- Task:
- Status:
- Updated:
- Verification:

**Evidence**
- Criteria completed:
- Gate:
- Dependencies:
- Notes:

**Automation**
TASK_COMPLETION_EVENT {...}
```

Keep the brief short. The completion event is the authoritative automation signal.

## Handoff Rules

- Do not complete a task with failing or missing required verification unless the caller explicitly accepts the risk.
- Do not run new broad gates inside this skill unless the caller asks; verification belongs to `dev-workflow/verify-code`.
- Do not edit source code during completion.
- Do not update requirement traceability statuses unless the caller specifically asks for requirement-level status management.
- If unrelated working tree changes exist, ignore them unless they are part of the completion evidence.
- If `tasks.md` format does not support a requested progress update, preserve the current format and report the limitation.

## Examples

### Verified File-Backed Task

User says: "Complete T3"

Actions:
1. Read T3 from `tasks.md`.
2. Confirm all T3 `Done when` criteria are satisfied and the unit gate passed.
3. Update only T3 checkboxes to `- [x]`.
4. Return the completion brief and `TASK_COMPLETION_EVENT`.

Result: T3 is marked complete in the task ledger and automation receives `automationSignal:"task.completed"`.

### Verification Missing

User says: "Complete T7"

Actions:
1. Check T7 evidence.
2. Notice component tests or browser accessibility checks have not run.
3. Do not edit `tasks.md`.
4. Return `Status: needs-verification` with the required next gate.

Result: no premature task completion.

## Troubleshooting

### Task Is Partially Complete

Do not mark the task complete. Return the unsatisfied criteria and recommend `check-task-progress` for partial update suggestions.

### Gate Failed

Do not mark the task complete. Return the failing command, summarize the failure, and hand back to implementation or `verify-code`.

### Inline Brief Has No Task Ledger Entry

Do not edit `tasks.md`. Emit a completion event using the inline title and `updatedFiles:[]`.
