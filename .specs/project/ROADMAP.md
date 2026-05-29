# Roadmap

**Current Milestone:** M1 - Accessible MVP
**Status:** Planning

---

## M1 - Accessible MVP

**Goal:** Ship a working local-first SeniorEase app where an older adult can personalize the interface, organize activities, and keep preferences across sessions.
**Target:** Complete when core flows pass unit, integration, accessibility, and build checks.

### Features

**Experience Personalization Dashboard** - PLANNED

- Adjust font size, contrast, and spacing.
- Toggle simplified or advanced navigation mode.
- Toggle reinforced visual feedback and additional confirmation for critical actions.
- Apply changes globally through a Material UI theme layer.

**Simplified Activity Organizer** - PLANNED

- Create and view tasks in a clear list.
- Follow guided steps for activity execution.
- Show reminders in plain language.
- Provide positive completion feedback.
- Keep a simple history of completed activities.

**User Profile and Persistent Settings** - PLANNED

- Store chosen font size, contrast level, navigation mode, extra confirmations, and reminder preferences.
- Restore preferences on app load.
- Provide a profile view that summarizes selected options.

**Clean Architecture Foundation** - PLANNED

- Separate `domain`, `application`, `infrastructure`, and `presentation`.
- Keep use cases independent from React and Material UI.
- Define repository interfaces for business data and Zustand stores for client state.

**CI/CD Foundation** - PLANNED

- Add `.github/workflows/ci.yml`.
- Use Node.js 20 or newer in CI.
- Run dependency installation, linting, tests, and production build.

---

## M2 - Integration and Remote Module Readiness

**Goal:** Prepare `seniorease-web` to act as a host that can consume a future activity organizer remote.

### Features

**Activity Organizer Microfrontend Remote** - PLANNED

- Extract activity organizer boundaries into a separate remote module that can be consumed by this host.
- Define host remote mapping, remote entry, fallback strategy, and shared dependency strategy.
- Keep domain and use cases portable.

**Accessibility Hardening** - PLANNED

- Add Playwright coverage for keyboard navigation and critical flows.
- Add automated accessibility checks for ARIA names, roles, labels, live regions, focus order, and keyboard operation.
- Add reduced-motion handling across guided flows.

---

## Future Considerations

- Backend synchronization for preferences and activities.
- Authentication for multi-device continuity.
- Calendar integration.
- Voice guidance or text-to-speech support.
- Caregiver or mentor shared visibility with explicit consent.
