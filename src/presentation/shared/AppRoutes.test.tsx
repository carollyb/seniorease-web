import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import type { GetServerSidePropsContext } from 'next'

import type { Activity } from '../../domain/activities'
import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import ActivitiesPage from '../../pages/atividades'
import SettingsPage from '../../pages/configuracoes'
import { getServerSideProps } from '../../pages'
import DashboardPage from '../../pages/painel'
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

  it('redirects the root route to activities', async () => {
    await expect(
      getServerSideProps({} as GetServerSidePropsContext),
    ).resolves.toEqual({
      redirect: {
        destination: '/atividades',
        permanent: false,
      },
    })
  })

  it('renders the dashboard in the shared shell with predictable page links', () => {
    renderPage(<DashboardPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Deixe o SeniorEase confortável para você',
      }),
    ).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Modo da interface' }),
    ).not.toBeNull()

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(
      within(navigation)
        .getByRole('link', { name: 'Painel' })
        .getAttribute('href'),
    ).toBe('/painel')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Painel' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Atividades' })
        .getAttribute('href'),
    ).toBe('/atividades')
    expect(
      within(navigation).getByRole('link', { name: 'Perfil' }).getAttribute('href'),
    ).toBe('/perfil')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Configurações' })
        .getAttribute('href'),
    ).toBe('/configuracoes')
  })

  it('wraps profile and settings pages in one shared navigation landmark', () => {
    renderPage(<ProfilePage />)

    expect(
      screen.getByRole('heading', { name: 'Resumo do perfil' }),
    ).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)

    renderPage(<SettingsPage />)

    expect(screen.getByRole('heading', { name: 'Configurações' })).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(2)
  })

  it('uses an accessible dialog before completing an activity', async () => {
    setPreferences({ extraConfirmation: true })
    window.localStorage.setItem(
      'seniorease-activities:v1',
      JSON.stringify({ activities: [pendingActivity] }),
    )
    const confirmSpy = jest.spyOn(window, 'confirm')

    renderPage(<ActivitiesPage />)

    await waitFor(() => {
      expect(screen.getByText('Enviar trabalho')).not.toBeNull()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir atividade Enviar trabalho',
      }),
    )
    const completeButton = screen.getByRole('button', {
      name: 'Concluir atividade Enviar trabalho',
    })

    act(() => completeButton.focus())
    fireEvent.click(completeButton)

    const dialog = screen.getByRole('dialog', {
      name: 'Confirmar conclusão',
    })

    expect(within(dialog).getByText('Título:')).not.toBeNull()
    expect(within(dialog).getByText('Enviar trabalho')).not.toBeNull()
    expect(within(dialog).getByText('Lembrete:')).not.toBeNull()
    expect(within(dialog).getByText('Hoje as 18h')).not.toBeNull()
    expect(confirmSpy).not.toHaveBeenCalled()

    const cancelButton = within(dialog).getByRole('button', {
      name: 'Cancelar',
    })

    await waitFor(() => expect(document.activeElement).toBe(cancelButton))
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(document.activeElement).toBe(completeButton)
    })
    expect(
      screen.queryByRole('list', {
        name: 'Histórico de atividades concluidas',
      }),
    ).toBeNull()

    fireEvent.click(completeButton)
    fireEvent.click(
      within(
        screen.getByRole('dialog', { name: 'Confirmar conclusão' }),
      ).getByRole('button', { name: 'Concluir' }),
    )

    await waitFor(() => {
      expect(
        within(
          screen.getByRole('list', {
            name: 'Histórico de atividades concluidas',
          }),
        ).getByText('Enviar trabalho'),
      ).not.toBeNull()
    })
  })
})
