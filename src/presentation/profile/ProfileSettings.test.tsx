import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import SettingsPage from '../../pages/configuracoes'
import ProfilePage from '../../pages/perfil'
import { ProfileSettings } from './ProfileSettings'

function renderWithTheme(children: React.ReactNode) {
  return render(
    <ThemeProvider theme={createSeniorEaseTheme()}>{children}</ThemeProvider>,
  )
}

function renderProfileSettings(
  props: Partial<React.ComponentProps<typeof ProfileSettings>> = {},
) {
  renderWithTheme(<ProfileSettings mode="profile" {...props} />)
}

function setSavedPreferences(preferences: Partial<UserPreferences>) {
  usePreferenceStore.setState({
    preferences: {
      ...createDefaultPreferences(),
      ...preferences,
    },
    hasHydrated: true,
    persistenceWarning: null,
  })
}

describe('ProfileSettings', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setSavedPreferences({})
  })

  it('renders the Figma profile summary card with shared status pills', () => {
    setSavedPreferences({
      fontScale: 'extraLarge',
      contrastLevel: 'maximum',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      reinforcedFeedback: false,
      extraConfirmation: true,
    })

    renderProfileSettings()

    const summary = screen.getByRole('region', {
      name: 'Profile preferences summary',
    })

    expect(summary.getAttribute('data-node-id')).toBe('703:225')
    expect(screen.queryByRole('navigation', { name: 'SeniorEase' })).toBeNull()
    expect(within(summary).getByText('Font size')).not.toBeNull()
    expect(within(summary).getByText('Extra large')).not.toBeNull()
    expect(within(summary).getByText('Contrast')).not.toBeNull()
    expect(within(summary).getByText('Maximum')).not.toBeNull()
    expect(within(summary).getByText('Spacing')).not.toBeNull()
    expect(within(summary).getByText('Large spacing')).not.toBeNull()
    expect(within(summary).getByText('Navigation')).not.toBeNull()
    expect(within(summary).getByText('Standard')).not.toBeNull()
    expect(within(summary).getByText('Reinforced feedback')).not.toBeNull()
    expect(within(summary).getByText('Extra confirmations')).not.toBeNull()
    expect(within(summary).getByText('Off')).not.toBeNull()
    expect(within(summary).getByText('On')).not.toBeNull()
  })

  it('updates persisted settings through accessible Figma switches', () => {
    renderProfileSettings({ mode: 'settings' })

    const settings = screen.getByRole('region', {
      name: 'Reminder preferences',
    })

    expect(settings.getAttribute('data-node-id')).toBe('703:275')
    expect(
      within(settings).getByRole('switch', {
        name: 'Use plain-language reminders',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Show reminders on dashboard',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Ask before deleting activities',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Keep completed history visible',
      }),
    ).not.toBeNull()
    expect(
      screen
        .getByTestId('figma-pill-switch-remindersEnabled')
        .getAttribute('data-size'),
    ).toBe('64x36')
    expect(
      screen
        .getByTestId('figma-pill-switch-remindersEnabled')
        .getAttribute('data-state'),
    ).toBe('on')
    expect(
      within(settings).getByRole('button', { name: 'Save settings' }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('button', {
        name: 'Reset to comfortable defaults',
      }),
    ).not.toBeNull()

    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Use plain-language reminders',
      }),
    )
    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Ask before deleting activities',
      }),
    )

    expect(usePreferenceStore.getState().preferences).toMatchObject({
      remindersEnabled: false,
      extraConfirmation: false,
    })
    expect(
      screen
        .getByTestId('figma-pill-switch-remindersEnabled')
        .getAttribute('data-state'),
    ).toBe('off')

    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.textContent).toContain(
      'Setting saved: delete confirmation off.',
    )
  })

  it('restores saved reminder preferences from persisted storage', async () => {
    const savedPreferences = {
      ...createDefaultPreferences(),
      remindersEnabled: false,
      extraConfirmation: false,
    }

    window.localStorage.setItem(
      'seniorease-preferences:v1',
      JSON.stringify({
        state: { preferences: savedPreferences },
        version: 1,
      }),
    )

    await usePreferenceStore.persist.rehydrate()

    renderProfileSettings({ mode: 'settings' })

    const remindersSwitch = screen.getByRole('switch', {
      name: 'Use plain-language reminders',
    }) as HTMLInputElement
    const deleteConfirmationSwitch = screen.getByRole('switch', {
      name: 'Ask before deleting activities',
    }) as HTMLInputElement

    expect(remindersSwitch.checked).toBe(false)
    expect(deleteConfirmationSwitch.checked).toBe(false)
  })

  it('renders profile and settings pages with the shared shell and Figma headings', async () => {
    const profileRender = renderWithTheme(<ProfilePage />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Profile summary' }),
      ).not.toBeNull()
    })
    expect(
      screen.getByText(
        'Current persisted accessibility and preference state in readable language.',
      ),
    ).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)
    expect(
      within(screen.getByRole('navigation', { name: 'SeniorEase' }))
        .getByRole('link', { name: 'Profile' })
        .getAttribute('aria-current'),
    ).toBe('page')

    profileRender.unmount()
    renderWithTheme(<SettingsPage />)

    expect(screen.getByRole('heading', { name: 'Settings' })).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Confirm before deleting' }),
    ).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Save settings' }),
    ).not.toBeNull()
  })
})
