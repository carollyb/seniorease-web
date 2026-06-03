import { render, screen, waitFor } from '@testing-library/react'
import { useTheme } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { SeniorEaseAppProviders } from '../../pages/_app'

function ThemeProbe() {
  const theme = useTheme()

  return <output aria-label="theme spacing">{theme.spacing(1)}</output>
}

function setPreferences(preferences: Partial<UserPreferences>) {
  usePreferenceStore.setState({
    preferences: {
      ...createDefaultPreferences(),
      ...preferences,
    },
    hasHydrated: true,
    persistenceWarning: null,
  })
}

describe('SeniorEase app providers', () => {
  const originalState = usePreferenceStore.getState()

  afterEach(() => {
    usePreferenceStore.setState(originalState, true)
  })

  it('creates the MUI theme from current accessibility preferences', () => {
    setPreferences({ spacingLevel: 'extraWide' })

    render(
      <SeniorEaseAppProviders>
        <ThemeProbe />
      </SeniorEaseAppProviders>,
    )

    expect(screen.getByLabelText('theme spacing').textContent).toBe('12px')
  })

  it('starts Zustand preference hydration when the app has not hydrated yet', async () => {
    const hydratePreferences = jest.fn().mockResolvedValue(undefined)

    usePreferenceStore.setState({
      hasHydrated: false,
      hydratePreferences,
      persistenceWarning: null,
    })

    render(
      <SeniorEaseAppProviders>
        <ThemeProbe />
      </SeniorEaseAppProviders>,
    )

    await waitFor(() => {
      expect(hydratePreferences).toHaveBeenCalledTimes(1)
    })
  })
})
