import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import type { Activity } from '../../domain/activities'
import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import ActivitiesPage from '../../pages/atividades'
import SettingsPage from '../../pages/configuracoes'
import HomePage from '../../pages'
import ProfilePage from '../../pages/perfil'

const pendingActivity: Activity = {
  id: 'activity-1',
  title: 'Enviar trabalho',
  reminderText: 'Hoje as 18h',
  status: 'pending',
  steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
  createdAt: '2026-06-01T12:00:00.000Z',
}

function renderPage(children: React.ReactNode) {
  render(<ThemeProvider theme={createSeniorEaseTheme()}>{children}</ThemeProvider>)
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

describe('SeniorEase route integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setPreferences({})
  })

  it('renders the dashboard in the shared shell with predictable page links', () => {
    renderPage(<HomePage />)

    expect(
      screen.getByRole('heading', {
        name: 'Make SeniorEase comfortable for you',
      }),
    ).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Interface mode' }),
    ).not.toBeNull()

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(
      within(navigation)
        .getByRole('link', { name: 'Dashboard' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Activities' })
        .getAttribute('href'),
    ).toBe('/atividades')
    expect(
      within(navigation).getByRole('link', { name: 'Profile' }).getAttribute('href'),
    ).toBe('/perfil')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Settings' })
        .getAttribute('href'),
    ).toBe('/configuracoes')
  })

  it('wraps profile and settings pages in one shared navigation landmark', () => {
    renderPage(<ProfilePage />)

    expect(
      screen.getByRole('heading', { name: 'Profile summary' }),
    ).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)

    renderPage(<SettingsPage />)

    expect(screen.getByRole('heading', { name: 'Settings' })).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(2)
  })

  it('asks before completing an activity when extra confirmation is enabled', async () => {
    setPreferences({ extraConfirmation: true })
    window.localStorage.setItem(
      'seniorease-activities:v1',
      JSON.stringify({ activities: [pendingActivity] }),
    )
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

    renderPage(<ActivitiesPage />)

    await waitFor(() => {
      expect(screen.getByText('Enviar trabalho')).not.toBeNull()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir atividade Enviar trabalho',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Concluir atividade Enviar trabalho',
      }),
    )

    expect(confirmSpy).toHaveBeenCalledWith(
      'Concluir esta atividade e mover para o historico?',
    )
    expect(screen.getByRole('status').textContent).not.toContain(
      'Atividade concluida',
    )
    expect(
      screen.queryByRole('list', {
        name: 'Historico de atividades concluidas',
      }),
    ).toBeNull()
  })
})
