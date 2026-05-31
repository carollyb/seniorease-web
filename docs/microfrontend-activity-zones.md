# Activity Microfrontend Integration

SeniorEase uses two complementary microfrontend strategies:

- Full pages and route groups use Next.js Multi-Zones.
- Remote subsections inside a primary-zone page use Web Components loaded by script.

## Multi-Zone Routes

`seniorease-web` remains the primary Next.js 16 Pages Router zone. A future `seniorease-activities` app can own activity paths:

- `/atividades`
- `/atividades/:path*`

The primary zone will route those paths with `rewrites()`. The activity zone must use a zone-specific `assetPrefix`, such as `/atividades-static`, so Next.js assets do not conflict with the primary zone.

## Remote Subsection Widgets

When a page owned by `seniorease-web` needs to show a remote activity subsection inside the primary layout, the remote app must expose a Web Component widget instead of a runtime React component.

Contract:

- Props and complex input data use JavaScript properties.
- Simple configuration uses HTML attributes, such as `data-mode="simplified"`.
- Callback-like output uses `CustomEvent`.
- The primary page owns the layout, heading structure, fallback UI, and event listeners.
- The remote widget owns the embedded activity subsection.

## Primary-Zone Example

```tsx
import Script from 'next/script'
import { useEffect, useRef } from 'react'

type ActivityWidgetElement = HTMLElement & {
  preferences?: UserPreferences
}

export function DashboardActivitySection({
  onActivityComplete,
  preferences,
}: DashboardActivitySectionProps) {
  const widgetRef = useRef<ActivityWidgetElement>(null)

  useEffect(() => {
    const element = widgetRef.current
    if (!element) return

    element.preferences = preferences

    const handleComplete = (event: Event) => {
      const { activityId } = (event as CustomEvent<{ activityId: string }>).detail
      onActivityComplete(activityId)
    }

    element.addEventListener('activity-complete', handleComplete)

    return () => {
      element.removeEventListener('activity-complete', handleComplete)
    }
  }, [onActivityComplete, preferences])

  return (
    <section aria-labelledby="activities-title">
      <h2 id="activities-title">Atividades</h2>

      <Script
        src="https://activities.seniorease.app/widgets/activity-organizer.js"
        strategy="afterInteractive"
      />

      <seniorease-activity-organizer
        ref={widgetRef}
        data-mode="simplified"
      />
    </section>
  )
}
```

## Remote Widget Example

```typescript
class SeniorEaseActivityOrganizer extends HTMLElement {
  preferences?: UserPreferences

  completeActivity(activityId: string) {
    this.dispatchEvent(
      new CustomEvent('activity-complete', {
        detail: { activityId },
        bubbles: true,
        composed: true,
      }),
    )
  }
}

customElements.define('seniorease-activity-organizer', SeniorEaseActivityOrganizer)
```

## Accessibility Requirements

- The primary page must provide a semantic section and visible heading for the embedded widget.
- The widget must expose accessible names for every interactive control.
- Keyboard navigation must enter, operate, and leave the widget predictably.
- Widget dialogs must trap focus only while open and return focus when closed.
- Completion feedback should use polite live regions inside the widget or be surfaced through a `CustomEvent` handled by the primary page.
- If the script fails to load, the primary page must show a clear fallback subsection that remains keyboard-accessible.
