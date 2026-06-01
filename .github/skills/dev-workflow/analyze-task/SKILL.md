---
name: analyze-task
description: Analyze a SeniorEase implementation task before coding. Use when the developer agent receives a task id such as T1, 001, or "next" and must load `.specs/features/seniorease-platform/tasks.md`, understand requirements, dependencies, context, architecture, tech stack, tests, and risks. Do NOT use for inline task briefs, code implementation, final completion updates, or post-change verification.
---

# Analyze Task

Analyze one SeniorEase task and produce an implementation-ready brief for the developer workflow. Stop before editing application code.

## Core Inputs

Read these files in this order, loading only the sections needed for the task:

1. `.specs/features/seniorease-platform/tasks.md` to resolve the task, dependency chain, requirement IDs, done criteria, tests, and gate.
2. `.specs/features/seniorease-platform/spec.md` to map requirement IDs to user stories, acceptance criteria, edge cases, and traceability.
3. `.specs/features/seniorease-platform/design.md` to capture architecture, data models, interfaces, accessibility premises, and Multi-Zone constraints.
4. `.specs/project/PROJECT.md`, `.specs/project/ROADMAP.md`, `.specs/codebase/TESTING.md`, and `DESIGN.md` when the task references project scope, milestone intent, test gates, or theme tokens.
5. `AGENTS.md`, `.agents/developer.md`, and local skill instructions only when workflow routing or repo-specific rules are unclear.

## Workflow

### Step 1: Resolve The Task

Accept task identifiers in forms such as `T7`, `7`, `007`, a task title fragment, or `next`.

- For an explicit id, find the matching `### Tn:` section in `.specs/features/seniorease-platform/tasks.md`.
- For `next`, choose the earliest task whose dependencies appear complete and whose done criteria are not already satisfied.
- If multiple tasks match a title fragment, list the candidates and ask the caller to choose.
- If no task matches, stop with a brief error and include the accepted identifier formats.

Expected result: a single task section with title, dependency list, requirement IDs, done criteria, tests, and gate.

### Step 2: Check Readiness

Inspect dependency tasks before recommending implementation.

- Prefer invoking `dev-workflow/check-task-progress` when available to assess dependency completion and current task progress.
- If that skill is unavailable, infer progress by comparing each dependency's done criteria against the repository files and package scripts.
- Do not mark a task ready only because it appears earlier in the file; verify evidence from files or checked criteria.
- If a dependency is incomplete, report the blocker and recommend working on the dependency first.

Expected result: `ready`, `blocked`, or `already-complete`, with evidence.

### Step 3: Gather Context

Map the task to implementation context without over-reading the repo.

- Use `rg --files` and targeted file reads to inspect paths named in the task's `Where` field and nearby tests.
- Identify existing conventions before proposing new folders, exports, naming, or test structure.
- Keep Clean Architecture boundaries explicit: domain stays pure, application stays UI-independent, infrastructure owns storage/adapters, stores own Zustand boundaries, presentation owns React and Material UI, and pages stay thin.
- For React or Next tasks, note which `react-best-practices` rules should be loaded during implementation.
- For accessibility-related tasks, extract required semantics, labels, focus behavior, keyboard support, live regions, contrast, spacing, and reduced-motion expectations.

Expected result: a concise context map of relevant files, missing files, and conventions to follow.

### Step 4: Identify Tech Stack And Constraints

State only stack details that affect the task:

- Next.js 16 Pages Router, React, TypeScript, Material UI, Zustand, Node.js 20+.
- Pages Router conventions, not App Router patterns.
- Zustand `persist` for accessibility preferences.
- Material UI theme behavior derived from `DESIGN.md` tokens and user preferences.
- Multi-Zones for future activity routing; Web Components for embedded remote subsections; no Module Federation.
- Local repository adapters for v1 activity business data unless a task explicitly introduces an API adapter.

Expected result: a task-specific constraint list the implementer can use without rereading all specs.

### Step 5: Produce The Analysis Brief

Return a handoff in this exact shape:

```markdown
**Task**
- ID:
- Title:
- Status:
- Readiness:

**Requirements**
- Requirement IDs:
- User story/acceptance criteria:
- Edge cases:

**Context**
- Relevant specs:
- Existing files:
- Files likely to create or modify:
- Architecture boundaries:

**Implementation Notes**
- Recommended sequence:
- Domain/application/store/presentation/page impacts:
- Accessibility obligations:
- React/Next rules to load:

**Verification**
- Tests to add or update:
- Smallest useful gate:
- Broader gate before completion:

**Risks And Questions**
- Blockers:
- Assumptions:
- Questions for user:
```

Use `Status: ready`, `blocked`, or `already-complete`. If blocked, keep implementation notes short and focus on the blocking dependency or missing information.

## Handoff Rules

- Do not edit code, task status, or specs during analysis unless the caller explicitly asks for spec repair.
- Do not run broad verification gates during analysis; save them for `dev-workflow/verify-code`.
- Mention `dev-workflow/complete-task` only as the final workflow step after implementation and verification pass.
- If the task requires frontend changes, tell the developer agent to use browser automation after meaningful UI changes.
- If the task intentionally diverges from specs, stop and ask whether to update the specs before coding.

## Examples

### Explicit Task

User says: "Analyze T7"

Actions:
1. Read the T7 section from `tasks.md`.
2. Map SE-01, SE-02, SE-03, SE-11, SE-14, and SE-15 to `spec.md`.
3. Read the personalization, preference, theme, and ARIA parts of `design.md`.
4. Inspect `src/presentation/personalization`, `src/stores/preferences`, and related tests if they exist.
5. Return the analysis brief with readiness, likely files, accessibility obligations, and the unit/integration gate.

### Next Task

User says: "Analyze next"

Actions:
1. Walk tasks in order from `tasks.md`.
2. Use `check-task-progress` or repository evidence to find the first task with complete dependencies and incomplete done criteria.
3. Return the brief for that task or report the first blocker.

## Troubleshooting

### Task Cannot Be Found

Report the identifier that failed, accepted formats, and the path searched.

### Dependency State Is Ambiguous

Report the uncertainty, cite the missing evidence, and recommend invoking `check-task-progress` or inspecting the dependency's done criteria before coding.

### Specs And Repo Disagree

Name the disagreement, identify the source files, and ask whether to update specs or adapt implementation. Do not silently choose a direction when the divergence affects requirements or architecture.
