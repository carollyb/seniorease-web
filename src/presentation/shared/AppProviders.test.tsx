import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { useTheme } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { mobileHighContrastTokens } from '../../theme/designTokens'
import { SeniorEaseAppProviders } from '../../pages/_app'
import { PersonalizationDashboard } from '../personalization/PersonalizationDashboard'

function ThemeProbe() {
  const theme = useTheme()

  return (
    <output
      aria-label="theme spacing"
      data-background={theme.palette.background.default}
      data-primary={theme.palette.primary.main}
      data-text={theme.palette.text.primary}
    >
      {theme.spacing(1)}
    </output>
  )
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
    act(() => {
      usePreferenceStore.setState(originalState, true)
    })
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

  it('applies the Alto theme immediately from the real preference control', async () => {
    setPreferences({ contrastLevel: 'standard' })

    render(
      <SeniorEaseAppProviders>
        <ThemeProbe />
        <PersonalizationDashboard />
      </SeniorEaseAppProviders>,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Alto' }))

    await waitFor(() => {
      const themeProbe = screen.getByLabelText('theme spacing')

      expect(themeProbe.getAttribute('data-background')).toBe(
        mobileHighContrastTokens.screenBackground,
      )
      expect(themeProbe.getAttribute('data-primary')).toBe(
        mobileHighContrastTokens.primaryButtonBackground,
      )
      expect(themeProbe.getAttribute('data-text')).toBe(
        mobileHighContrastTokens.textPrimary,
      )
    })
    expect(usePreferenceStore.getState().preferences.contrastLevel).toBe(
      'maximum',
    )
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
