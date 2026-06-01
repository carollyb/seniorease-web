---
description: Start or continue SeniorEase development work for one task. Invoke with a task id such as `T7`, `7`, `007`, a title fragment, `next`, `all`, or an inline `TASK_BRIEF_INLINE` block. Delegates implementation to the `developer` agent, which must analyze, implement, verify, and complete the task through `dev-workflow`.
---

You are the `/dev` workflow orchestrator for this project.

**User Input:** $ARGUMENTS

## Goal

Complete exactly one development task per cycle by delegating to the `developer` agent through the Task Tool (`subagent_type: developer`). The developer agent is responsible for the full implementation lifecycle:

1. Analyze the task with `dev-workflow/analyze-task` for file-backed tasks.
2. Implement the required code, tests, docs, or config changes.
3. Verify the result with `dev-workflow/verify-code`.
4. Finalize with `dev-workflow/complete-task`.

Do not stop after analysis or verification when the next step is available. Continue until the task is completed, or until there is a real blocker that cannot be resolved without user input.

## Input Routing

Resolve `$ARGUMENTS` before invoking the developer agent:

- Empty input: treat as `next`.
- `next`: ask the developer agent to resolve the next ready incomplete task from `.specs/features/**/tasks.md`.
- Explicit task id or title fragment: pass it through exactly. Accepted examples include `T1`, `1`, `001`, `T7`, and `Personalization Dashboard`.
- `all`: run batch mode, but still process only one task at a time.
- Inline brief: if the input contains `TASK_BRIEF_INLINE`, pass the complete inline block to the developer agent and tell it to use inline-brief mode instead of `dev-workflow/analyze-task`.

If the input cannot be resolved locally, still invoke the developer agent with the original input and ask it to resolve using `dev-workflow/analyze-task`. Only ask the user to clarify when the developer reports multiple plausible matches or no usable task source.

## Batch Mode: `/dev all`

Before starting, show this warning:

> **Context Window Warning**
>
> You requested all tasks. This can exceed the context window and may lead to incomplete analysis or implementation.
>
> Best results usually come from one task per fresh session. I will still process tasks one at a time and stop after the first completed task or the first real blocker.

For `all`, delegate the first ready incomplete task to the developer agent. After that task is completed, report the completion and recommend invoking `/dev next` for the next cycle. Do not start another task in the same response unless the user explicitly asks to continue and there is enough context.

## Developer Agent Delegation

Invoke the `developer` agent once per task with a prompt that includes:

- The resolved input (`next`, task id, title fragment, or inline brief).
- The instruction to follow `.agents/developer.md`.
- The instruction to use `.github/skills/dev-workflow/analyze-task`, `.github/skills/dev-workflow/verify-code`, and `.github/skills/dev-workflow/complete-task` at the appropriate phases.
- The instruction to use `dev-workflow/check-task-progress` when dependencies, current progress, or criteria satisfaction are unclear.
- The instruction to read `AGENTS.md` and the relevant `.specs/` files before coding.
- The instruction to use `coding-guidelines` for code changes and `react-best-practices` rule files when React or Next code is touched.
- The instruction to use browser automation after meaningful frontend changes.
- The instruction to run the smallest useful gate first, then the task-required gate from `.specs/codebase/TESTING.md`.

Suggested Task Tool prompt:

```text
Use the developer agent workflow for SeniorEase.

Input: <RESOLVED_INPUT_OR_INLINE_BRIEF>

Follow `.agents/developer.md` and complete the full lifecycle for exactly one task:
1. Analyze:
   - For file-backed tasks, use `.github/skills/dev-workflow/analyze-task`.
   - For `TASK_BRIEF_INLINE`, parse the inline block and do not use analyze-task.
   - Use `dev-workflow/check-task-progress` if dependency readiness, current progress, or done criteria are unclear.
2. Implement:
   - Read `AGENTS.md` and the relevant `.specs/` files before coding.
   - Use `coding-guidelines` for code changes.
   - Use `react-best-practices` rule files for React/Next work.
   - Keep Clean Architecture boundaries intact.
   - Add or update tests with the implementation.
3. Verify:
   - Use `.github/skills/dev-workflow/verify-code`.
   - Run the smallest useful focused check first when available.
   - Run the required task gate from `.specs/codebase/TESTING.md`.
   - Use browser automation after meaningful frontend changes.
4. Complete:
   - Use `.github/skills/dev-workflow/complete-task`.
   - For file-backed tasks, update only the matching task section in `.specs/features/seniorease-platform/tasks.md`.
   - Emit the required `TASK_COMPLETION_EVENT`.

Do not stop at `ready for verification`; continue into verification.
Do not stop at `ready for complete-task`; continue into completion.
If verification fails because of implementation issues, fix the issues and verify again.
Ask the user only for true blockers: ambiguous requirements, missing credentials, required approval for external/destructive actions, unavailable dependencies that cannot be installed or bypassed, or conflicting task sources.

Return a concise final report with:
- Status: completed, blocked, or needs-user-input.
- Task id/title.
- Files changed.
- Verification commands and result.
- Completion event or blocker details.
```

## Handling Developer Results

Use the developer agent's terminal status to decide the outer response:

- `completed`: summarize the task, changed files, verification result, and include the `TASK_COMPLETION_EVENT`.
- `blocked` or `needs-user-input`: report the exact blocker, what was already tried, and the minimum user action needed. Do not claim completion.
- `partial`: re-invoke the developer agent once with its own findings and ask it to continue from the partial state unless it identified a true blocker.
- `verification failed`: re-invoke the developer agent once with the failing command and error summary, asking it to fix and re-run verification. If the second attempt fails, report the failure and the smallest actionable next step.

Do not leave the workflow parked at intermediate statuses such as `ready for verification`, `ready for completion after verification`, or `ready for complete-task`. Those are handoff signals inside the workflow, not final `/dev` results.

## Completion Rules

- One task per cycle.
- For file-backed tasks, completion requires `dev-workflow/complete-task` to update the task ledger or return a clear reason it cannot.
- Do not require a git commit unless the user explicitly requested commits or the active workflow provides a concrete commit step.
- Preserve unrelated user changes in the working tree.
- Do not modify unrelated tasks, specs, or formatting.

## Edge Cases

### No Tasks Exist

```text
No tasks found in `.specs/features/**/tasks.md`.

Create a task first with the spec-driven workflow, or invoke `/dev` with a `TASK_BRIEF_INLINE` block.
```

### Task Is Already Complete

Ask the developer agent to report the evidence and select the next task only when the original input was empty, `next`, or `all`. For an explicit task id, return that the requested task is already complete.

### Dependency Is Incomplete

Ask the developer agent to work on the blocking dependency first only when the input was empty, `next`, or `all`. For an explicit task id, report the dependency blocker and suggest the dependency task id.

### Inline Brief Completion

For `TASK_BRIEF_INLINE`, do not edit `.specs/features/**/tasks.md`. The developer agent should still verify the implementation and emit a completion event with `updatedFiles: []`.
