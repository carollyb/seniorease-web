# SeniorEase Agent Guide

Use this file as the first stop before changing this repo. Keep changes aligned with `.specs/`, especially `.specs/project/PROJECT.md` and `.specs/features/seniorease-platform/`.

## Project Snapshot

- Product: SeniorEase, a digital inclusion app for older adults managing academic and professional routines.
- Stack: Next.js 16 Pages Router, React, TypeScript, Material UI, Zustand, Node.js 20+.
- Architecture: Clean Architecture with isolated `domain`, UI-independent `application` use cases, `infrastructure` adapters, `stores`, `presentation`, `pages`, and `theme`.
- Accessibility is core product behavior: validate ARIA semantics, accessible names, labels, keyboard navigation, focus management, live regions, contrast, spacing, and reduced motion.
- `seniorease-web` is the primary Next.js zone. The Activity Organizer may become a future Next.js zone reached through Multi-Zone rewrites.

## Important Files

- `.specs/project/PROJECT.md`: project vision, scope, constraints, stack.
- `.specs/project/ROADMAP.md`: planned milestones.
- `.specs/features/seniorease-platform/spec.md`: requirements and traceability IDs.
- `.specs/features/seniorease-platform/design.md`: architecture, data models, ARIA premises, and Multi-Zone direction.
- `.specs/features/seniorease-platform/tasks.md`: implementation order and verification gates.
- `.specs/codebase/TESTING.md`: test matrix and expected commands.
- `DESIGN.md`: design tokens to translate into the MUI theme.
- `.github/skills/react-best-practices/`: required guidance for React/Next work.
- `.github/skills/coding-guidelines/`: required guidance for code changes.
- `.github/skills/tlc-spec-driven/`: required workflow for specs, tasks, execution, validation.

## Skill Routing

- Use `tlc-spec-driven` for spec changes, architecture planning, task breakdown, implementation from tasks, validation, and handoff.
- Use `react-best-practices` whenever writing, reviewing, or refactoring React/Next pages, components, hooks, data fetching, rendering, bundle size, or performance.
- Use `coding-guidelines` for every code modification, refactor, bug fix, or review.
- Use browser automation after meaningful frontend changes to verify the local UI, responsiveness, accessibility-critical flows, and nonblank rendering.

When React/Next code is involved, check the relevant rule files under `.github/skills/react-best-practices/rules/`; do not rely only on memory.

## Architectural Rules

- Keep `domain` pure: no React, Next.js, MUI, Zustand, browser APIs, or infrastructure imports.
- Keep `application` use cases UI-independent and dependent only on domain models and application ports.
- Put browser/storage details in `infrastructure` or Zustand store boundaries, never in domain.
- Use Zustand for client state. Accessibility preferences must use Zustand `persist`.
- Use Material UI for UI primitives and generate theme behavior from `DESIGN.md` tokens plus user preferences.
- Keep pages thin: compose presentation modules, providers, stores, and use cases.
- Activity business data may use local repository adapters for v1; design it so an API adapter can replace it later.
- Do not introduce Module Federation for the activity split. Use Next.js Multi-Zones: this app is the primary zone, and Activity Organizer is the candidate activity zone.
- For remote subsections embedded inside primary-zone pages, use Web Components loaded by script. Pass complex input through JavaScript properties, simple config through HTML attributes such as `data-mode="simplified"`, and output through `CustomEvent`.

## React and Next Rules

- Use Pages Router conventions, not App Router patterns.
- Use Next.js Multi-Zones for microfrontend routing decisions; avoid bundler-level module loading for this project.
- Use Web Components, not runtime React component imports, when a remote subsection must render inside a primary-zone page.
- Avoid barrel imports from large libraries; prefer direct imports or `optimizePackageImports`.
- Avoid async waterfalls: start independent work early and use `Promise.all` when safe.
- Keep derived state in render/selectors instead of effects.
- Subscribe to narrow Zustand selectors to avoid broad re-renders.
- Put interaction logic in event handlers instead of effects.
- Use `next/dynamic` for heavy, non-initial UI.
- Keep component props stable; hoist default arrays/objects and static JSX when useful.
- Prefer immutable array helpers such as `toSorted()` on Node 20+.

## Accessibility Rules

- Prefer native semantic HTML before adding ARIA.
- Every interactive control needs an accessible name.
- Inputs need programmatic labels and helper/error text linked when needed.
- Dialogs need role semantics, accessible title, focus trap, and focus return.
- Positive completion feedback should use polite live regions.
- Destructive/blocking errors may use assertive live regions sparingly.
- Guided steps must expose progress and completion in text/state, not color alone.
- All primary flows must work with keyboard only.

## Implementation Workflow

1. Read the relevant `.specs` files before coding.
2. Map work to requirement IDs from `spec.md` and tasks from `tasks.md`.
3. Make surgical changes only; do not refactor unrelated code.
4. Add or update tests in the same task that changes the layer.
5. Run the smallest useful gate first, then broader checks before finishing.
6. Update specs if implementation decisions intentionally diverge.

## Verification Gates

Use the commands defined in `.specs/codebase/TESTING.md`:

- Lint: `npm run lint`
- Unit/integration: `npm test -- --watchAll=false`
- E2E: `npm run test:e2e`
- Build: `npm run build`
- CI must use Node.js 20+ and run install, lint, tests, and build.

If a command cannot run because the project is not scaffolded yet, say that clearly and verify by inspecting the relevant files instead.
