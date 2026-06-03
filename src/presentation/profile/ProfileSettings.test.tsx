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
      name: 'Resumo das preferências do perfil',
    })

    expect(summary.getAttribute('data-node-id')).toBe('703:225')
    expect(screen.queryByRole('navigation', { name: 'SeniorEase' })).toBeNull()
    expect(within(summary).getByText('Tamanho do texto')).not.toBeNull()
    expect(within(summary).getByText('Muito grande')).not.toBeNull()
    expect(within(summary).getByText('Contraste')).not.toBeNull()
    expect(within(summary).getByText('Máximo')).not.toBeNull()
    expect(within(summary).getByText('Espaçamento')).not.toBeNull()
    expect(within(summary).getByText('Extra amplo')).not.toBeNull()
    expect(within(summary).getByText('Navegação')).not.toBeNull()
    expect(within(summary).getByText('Padrão')).not.toBeNull()
    expect(within(summary).getByText('Feedback reforçado')).not.toBeNull()
    expect(within(summary).getByText('Confirmações extras')).not.toBeNull()
    expect(within(summary).getByText('Inativo')).not.toBeNull()
    expect(within(summary).getByText('Ativo')).not.toBeNull()
  })

  it('updates persisted settings through accessible Figma switches', () => {
    renderProfileSettings({ mode: 'settings' })

    const settings = screen.getByRole('region', {
      name: 'Preferências de lembrete',
    })

    expect(settings.getAttribute('data-node-id')).toBe('703:275')
    expect(
      within(settings).getByRole('switch', {
        name: 'Usar lembretes em linguagem simples',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Mostrar lembretes no painel',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Perguntar antes de excluir atividades',
      }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('switch', {
        name: 'Manter histórico concluído visível',
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
      within(settings).getByRole('button', { name: 'Salvar configurações' }),
    ).not.toBeNull()
    expect(
      within(settings).getByRole('button', {
        name: 'Restaurar padrões confortáveis',
      }),
    ).not.toBeNull()

    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Usar lembretes em linguagem simples',
      }),
    )
    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Perguntar antes de excluir atividades',
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
      'Configuração salva: confirmação de exclusão desativada.',
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
      name: 'Usar lembretes em linguagem simples',
    }) as HTMLInputElement
    const deleteConfirmationSwitch = screen.getByRole('switch', {
      name: 'Perguntar antes de excluir atividades',
    }) as HTMLInputElement

    expect(remindersSwitch.checked).toBe(false)
    expect(deleteConfirmationSwitch.checked).toBe(false)
  })

  it('renders profile and settings pages with the shared shell and Figma headings', async () => {
    const profileRender = renderWithTheme(<ProfilePage />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Resumo do perfil' }),
      ).not.toBeNull()
    })
    expect(
      screen.getByText(
        'Estado atual das preferências de acessibilidade em linguagem clara.',
      ),
    ).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)
    expect(
      within(screen.getByRole('navigation', { name: 'SeniorEase' }))
        .getByRole('link', { name: 'Perfil' })
        .getAttribute('aria-current'),
    ).toBe('page')

    profileRender.unmount()
    renderWithTheme(<SettingsPage />)

    expect(screen.getByRole('heading', { name: 'Configurações' })).not.toBeNull()
    expect(screen.getAllByRole('navigation', { name: 'SeniorEase' })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Confirmar antes de excluir' }),
    ).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Salvar configurações' }),
    ).not.toBeNull()
  })
})
