# SeniorEase Platform Specification

## Problem Statement

Older adults often face academic and professional digital tools with small text, dense navigation, unclear feedback, and unpredictable flows. SeniorEase will provide a Next.js 16 Pages Router web app where the experience can be personalized, activities can be organized in guided steps, and preferences remain stable across sessions.

## Goals

- [ ] Let users personalize readability, contrast, spacing, navigation complexity, feedback strength, and critical-action confirmations.
- [ ] Let users manage activities through a simple list, guided steps, clear reminders, positive completion feedback, and completed history.
- [ ] Persist user profile settings locally with Zustand `persist` and restore them on app load.
- [ ] Implement Clean Architecture with isolated domain, UI-independent use cases, repository interfaces, and infrastructure adapters.
- [ ] Use Material UI with a theme derived from `DESIGN.md` and adapted for older-adult accessibility.
- [ ] Implement the dashboard, activities, guided steps, profile, and settings screens from the supplied Figma frames as the visual source of truth.
- [ ] Validate accessibility through ARIA semantics, labels, focus behavior, keyboard navigation, and live-region feedback.
- [ ] Add CI workflow for Node.js 20+, install, lint, tests, and build.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Backend API and database | v1 validates product and architecture with local persistence. |
| Authentication | Not required to demonstrate personalization and activities. |
| Multi-device sync | Requires backend scope. |
| Calendar integrations | Useful later, but not needed for MVP. |
| AI recommendations | Would add complexity beyond core accessibility and organization goals. |

---

## Figma Layout References

The following Figma frames are the source of truth for page layout, spacing, colors, typography, component composition, and responsive behavior. Implementation must inspect the frames during execution and reconcile `DESIGN.md`/theme tokens before hardcoding any visual value.

| Page | Viewport | Figma Node | Route / Surface |
| --- | --- | --- | --- |
| Profile | Desktop | [703:200](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-200&t=O7eRkgm2PxxJEFSL-4) | `/perfil` |
| Settings | Desktop | [703:250](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-250&t=O7eRkgm2PxxJEFSL-4) | `/configuracoes` |
| Dashboard | Desktop | [703:5](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-5&t=O7eRkgm2PxxJEFSL-4) | `/` |
| Dashboard | Tablet | [703:305](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-305&t=O7eRkgm2PxxJEFSL-4) | `/` |
| Dashboard | Mobile | [703:407](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-407&t=O7eRkgm2PxxJEFSL-4) | `/` |
| Activities | Desktop | [703:78](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-78&t=O7eRkgm2PxxJEFSL-4) | `/atividades` |
| Activities | Tablet | [703:361](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-361&t=O7eRkgm2PxxJEFSL-4) | `/atividades` |
| Activities | Mobile | [703:463](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-463&t=O7eRkgm2PxxJEFSL-4) | `/atividades` |
| Guided steps | Desktop | [703:141](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-141&t=O7eRkgm2PxxJEFSL-4) | guided activity step view |
| Guided steps | Tablet | [703:509](https://www.figma.com/design/wm7yHBbvhkLHokzUXbuwa8/NATGEO?node-id=703-509&t=O7eRkgm2PxxJEFSL-4) | guided activity step view |

---

## User Stories

### P1: Implementar Layouts do Figma - MVP

**User Story**: As an older adult, I want the implemented screens to match the designed SeniorEase layouts so that the product feels predictable, readable, and consistent across devices.

**Why P1**: The Figma frames define the user-facing experience and must guide the remaining implementation work.

**Acceptance Criteria**:

1. WHEN a listed page is implemented THEN the system SHALL match the corresponding Figma frame for layout, spacing, colors, typography, visual hierarchy, and component placement.
2. WHEN the dashboard or activities page is viewed across desktop, tablet, and mobile THEN the system SHALL follow the matching Figma frame for that viewport.
3. WHEN the guided steps page is viewed on desktop or tablet THEN the system SHALL follow the matching Figma frame for that viewport.
4. WHEN profile and settings are implemented THEN the system SHALL follow the supplied desktop Figma frames and use responsive behavior consistent with the shared shell and dashboard/activity patterns.
5. WHEN reusable UI is needed THEN the system SHALL create and reuse `AppShell`, `SideNavigation`, `ActivityList`, `ActivityCard`, `StatusPill`, `PrimaryButton`, and `EmptyState`.
6. WHEN a visual value exists in theme tokens THEN the system SHALL use MUI `sx`/theme tokens instead of duplicated hardcoded values.
7. WHEN `DESIGN.md` tokens diverge from the Figma frames THEN the system SHALL update/reconcile the tokens or document the intentional exception before implementation.
8. WHEN Figma-aligned screens are implemented THEN the system SHALL preserve semantic HTML, labels, keyboard navigation, visible focus states, and polite ARIA live-region completion feedback.

**Independent Test**: Compare the local desktop, tablet, and mobile routes against the linked Figma frames and verify keyboard-only operation, labels, focus visibility, and completion feedback.

---

### P1: Personalizar Experiencia - MVP

**User Story**: As an older adult, I want to adjust the interface to my comfort level so that I can read, navigate, and act with confidence.

**Why P1**: Personalization is the central accessibility promise of SeniorEase.

**Acceptance Criteria**:

1. WHEN the user opens the personalization panel THEN the system SHALL show controls for font size, contrast, spacing, interface mode, reinforced visual feedback, and extra confirmation with accessible names and labels.
2. WHEN the user changes font size THEN the system SHALL apply the new scale to headings, body text, inputs, buttons, and task content.
3. WHEN the user changes contrast THEN the system SHALL update the Material UI palette to the selected accessible contrast level.
4. WHEN the user changes spacing THEN the system SHALL increase or reduce layout spacing and touch target comfort without breaking the layout.
5. WHEN the user selects simplified mode THEN the system SHALL reduce nonessential interface density and prioritize primary actions.
6. WHEN reinforced visual feedback is active THEN the system SHALL show clearer status feedback after save, completion, and destructive actions.
7. WHEN extra confirmation is active and a critical action is requested THEN the system SHALL ask for confirmation before executing the action.

**Independent Test**: Open the dashboard, change every preference, and verify the page updates immediately and remains usable.

---

### P1: Organizar Atividades - MVP

**User Story**: As an older adult, I want a clear activity organizer so that I can complete academic and professional tasks step by step.

**Why P1**: The organizer is the main productivity workflow.

**Acceptance Criteria**:

1. WHEN the user creates an activity THEN the system SHALL display it in a simple list with direct title, due/reminder text, status, and primary action using meaningful ARIA roles and accessible names.
2. WHEN the user opens an activity THEN the system SHALL show guided steps in a predictable order with keyboard-operable controls.
3. WHEN an activity has a reminder THEN the system SHALL present it in plain language without technical jargon.
4. WHEN the user completes an activity THEN the system SHALL show positive completion feedback and announce it through an appropriate live region.
5. WHEN an activity is completed THEN the system SHALL move it to a simple completed history.
6. WHEN there are no activities THEN the system SHALL show a clear empty state with one primary action.
7. WHEN the user deletes an activity THEN the system SHALL permanently remove it from persisted storage, the active list, and completed history, with an accessible destructive action and reinforced feedback when enabled.

**Independent Test**: Create activities, complete one, delete another, and confirm the deleted activity is absent from the screen, history, and persisted storage.

---

### P1: Persistir Perfil e Configuracoes - MVP

**User Story**: As an older adult, I want my preferences to remain saved so that I do not need to reconfigure the app every time.

**Why P1**: Stable preferences are essential for trust and autonomy.

**Acceptance Criteria**:

1. WHEN the user saves preferences THEN the system SHALL persist font size, contrast, navigation mode, extra confirmations, visual feedback, spacing, and reminder preferences through Zustand `persist`.
2. WHEN the user reloads the app THEN the system SHALL restore saved preferences before rendering the main experience.
3. WHEN no saved preferences exist THEN the system SHALL use accessible defaults.
4. WHEN Zustand persistence fails THEN the system SHALL keep the current session usable and show a clear nontechnical warning.

**Independent Test**: Save preferences, reload the browser, and verify the same preferences are applied.

---

### P1: Arquitetura Limpa e Testavel - MVP

**User Story**: As a developer, I want domain and use cases independent from UI so that SeniorEase can evolve safely and be tested without browser rendering.

**Why P1**: The project explicitly requires Clean Architecture and maintainability.

**Acceptance Criteria**:

1. WHEN domain models are created THEN they SHALL not import React, Next.js, Material UI, browser APIs, or infrastructure implementations.
2. WHEN use cases are created THEN they SHALL depend on repository interfaces or explicit application ports instead of storage APIs, Zustand stores, or UI components.
3. WHEN infrastructure adapters are created THEN they SHALL implement application repository interfaces.
4. WHEN presentation components invoke behavior THEN they SHALL call use cases through hooks/stores rather than embedding business rules.
5. WHEN tests are added THEN domain and use case tests SHALL run without rendering React components.

**Independent Test**: Run unit tests for domain and application layers without importing presentation modules.

---

### P1: CI/CD Basico - MVP

**User Story**: As a developer, I want automated validation on pushes and pull requests so that regressions are caught early.

**Why P1**: CI/CD is required by the project statement.

**Acceptance Criteria**:

1. WHEN code is pushed to `main` THEN GitHub Actions SHALL run the CI workflow.
2. WHEN a pull request targets `main` THEN GitHub Actions SHALL run the CI workflow.
3. WHEN CI starts THEN it SHALL checkout code, setup Node.js 20+, install dependencies, run lint, run tests, and build.
4. WHEN lint issues exist during the early project phase THEN CI MAY echo the lint issue instead of failing, matching the provided suggestion.
5. WHEN tests or build fail THEN CI SHALL fail.

**Independent Test**: Inspect `.github/workflows/ci.yml` and run equivalent local commands.

---

### P2: Preparar Microfrontend de Atividades

**User Story**: As a developer, I want `seniorease-web` to be ready to route to the activity organizer as a separate Next.js zone and embed activity subsections as remote Web Components so that the organizer can evolve independently later.

**Why P2**: The project will follow the Next.js microfrontend recommendation using Multi-Zones for full pages and Web Components for remote subsections inside primary-zone pages.

**Acceptance Criteria**:

1. WHEN modules are designed THEN the activity organizer SHALL have clear public contracts for page routes, container props, preference context, and use case providers.
2. WHEN Multi-Zones integration is introduced THEN `seniorease-web` SHALL act as the primary zone and route activity paths to the activity organizer zone.
3. WHEN zone boundaries are defined THEN the activity organizer zone SHALL own unique paths such as `/atividades` and use a zone-specific `assetPrefix` to avoid Next.js asset conflicts.
4. WHEN a primary-zone page needs a remote activity subsection THEN it SHALL embed a Web Component widget instead of importing runtime React components from the activity app.
5. WHEN the primary zone passes complex input data to the Web Component THEN it SHALL use JavaScript properties on the custom element.
6. WHEN the primary zone passes simple configuration to the Web Component THEN it SHALL use HTML attributes such as `data-mode="simplified"`.
7. WHEN the Web Component reports user actions or callback-like outcomes THEN it SHALL dispatch `CustomEvent` events with typed `detail` payloads.
8. WHEN the activity zone or remote widget is unavailable THEN `seniorease-web` SHALL provide a local fallback route, fallback subsection, or clear unavailable-state message.

**Independent Test**: Review module boundary documentation and verify activity organizer imports do not depend on unrelated modules.

---

## Edge Cases

- WHEN the user selects the largest font size on a small viewport THEN the system SHALL wrap content without overlap or clipped controls.
- WHEN high contrast is active THEN all interactive states SHALL remain distinguishable.
- WHEN simplified mode is active THEN advanced actions SHALL remain reachable from predictable secondary locations.
- WHEN the user tries to delete or clear an activity with extra confirmation active THEN the system SHALL require confirmation.
- WHEN persisted Zustand data contains invalid values THEN the system SHALL recover with defaults and avoid crashing.
- WHEN reduced motion is preferred THEN animations SHALL be disabled or shortened.
- WHEN dialogs, guided steps, or status feedback are shown THEN the system SHALL provide ARIA-compatible roles, names, focus management, and live-region announcements.
- WHEN a remote activity Web Component fails to load THEN the primary page SHALL show a clear fallback subsection that remains keyboard-accessible.
- WHEN a remote activity Web Component emits an event THEN the primary page SHALL handle it through `CustomEvent` listeners and avoid relying on direct React callback imports across applications.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| SE-01 | Personalizar Experiencia | Design | Pending |
| SE-02 | Personalizar Experiencia | Design | Pending |
| SE-03 | Personalizar Experiencia | Design | Pending |
| SE-04 | Organizar Atividades | Design | Pending |
| SE-05 | Organizar Atividades | Design | Pending |
| SE-06 | Persistir Perfil e Configuracoes | Design | Pending |
| SE-07 | Persistir Perfil e Configuracoes | Design | Pending |
| SE-08 | Arquitetura Limpa e Testavel | Design | Pending |
| SE-09 | Arquitetura Limpa e Testavel | Design | Pending |
| SE-10 | Material UI e DESIGN.md | Design | Pending |
| SE-11 | Acessibilidade para Idosos | Design | Pending |
| SE-12 | CI/CD Basico | Design | Pending |
| SE-13 | Microfrontend de Atividades via Multi-Zones | Design | Pending |
| SE-14 | Estado com Zustand | Design | Pending |
| SE-15 | Premissas ARIA | Design | Pending |
| SE-16 | Node.js 20+ | Design | Pending |
| SE-17 | Fidelidade visual aos layouts do Figma | Design | Pending |
| SE-18 | Componentes reutilizaveis MUI para layout SeniorEase | Design | Pending |

**Coverage:** 18 total, 18 mapped to design, 18 mapped to tasks.

---

## Success Criteria

- [ ] User can personalize the interface and observe immediate visual changes.
- [ ] User can create, follow, complete, and review an activity.
- [ ] Preferences survive browser reload.
- [ ] Preferences are persisted through Zustand `persist`.
- [ ] Implemented pages match the linked Figma frames across the provided desktop, tablet, and mobile variants.
- [ ] Shared UI uses the required reusable MUI components instead of one-off duplicated page markup.
- [ ] Domain and application tests run without UI dependencies.
- [ ] CI workflow validates lint, tests, and build.
- [ ] Main flows remain usable at large font size, high contrast, increased spacing, simplified mode, keyboard-only navigation, and ARIA validation.
