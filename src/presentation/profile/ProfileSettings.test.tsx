import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import ProfilePage from '../../pages/perfil'
import SettingsPage from '../../pages/configuracoes'
import { ProfileSettings } from './ProfileSettings'

function renderProfileSettings(
  props: Partial<React.ComponentProps<typeof ProfileSettings>> = {},
) {
  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ProfileSettings mode="profile" {...props} />
    </ThemeProvider>,
  )
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

  it('renders the profile summary frame with persisted preference rows in Portuguese', () => {
    setSavedPreferences({
      fontScale: 'extraLarge',
      contrastLevel: 'maximum',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      reinforcedFeedback: false,
      extraConfirmation: true,
    })

    renderProfileSettings()

    expect(
      screen.getByRole('heading', { name: 'Resumo do perfil' }),
    ).not.toBeNull()
    expect(
      screen.getByText(
        'Preferências de acessibilidade salvas apresentadas em linguagem clara.',
      ),
    ).not.toBeNull()
    expect(screen.getByRole('navigation', { name: 'SeniorEase' })).not.toBeNull()
    const logoMark = screen.getByTestId('senior-ease-logo-mark')

    expect(logoMark.getAttribute('viewBox')).toBe('0 0 160 160')
    expect(logoMark.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(screen.getByText('Tamanho do texto')).not.toBeNull()
    expect(screen.getByText('Muito grande')).not.toBeNull()
    expect(screen.getByText('Contraste')).not.toBeNull()
    expect(screen.getByText('Máximo')).not.toBeNull()
    expect(screen.getByText('Espaçamento')).not.toBeNull()
    expect(screen.getByText('Extra amplo')).not.toBeNull()
    expect(screen.getByText('Navegação')).not.toBeNull()
    expect(screen.getByText('Padrão')).not.toBeNull()
    expect(screen.getByText('Feedback reforçado')).not.toBeNull()
    expect(screen.getByText('Confirmações extras')).not.toBeNull()
    expect(screen.getByText('Inativo')).not.toBeNull()
    expect(screen.getByText('Ativo')).not.toBeNull()
  })

  it('updates persisted settings through accessible Portuguese switches', () => {
    renderProfileSettings({ mode: 'settings' })

    expect(
      screen.getByRole('heading', { name: 'Configurações' }),
    ).not.toBeNull()
    expect(
      screen.getByText(
        'Atualize lembretes e configurações salvas além do painel principal de personalização.',
      ),
    ).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Preferências de lembrete' }),
    ).not.toBeNull()
    expect(
      screen.getByRole('switch', {
        name: 'Usar lembretes em linguagem simples',
      }),
    ).not.toBeNull()
    expect(
      screen.getByRole('switch', {
        name: 'Mostrar lembretes no painel',
      }),
    ).not.toBeNull()
    expect(
      screen.getByRole('switch', {
        name: 'Perguntar antes de excluir atividades',
      }),
    ).not.toBeNull()
    expect(
      screen.getByRole('switch', {
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

  it('renders profile and settings pages with Portuguese presentation surfaces', async () => {
    render(
      <ThemeProvider theme={createSeniorEaseTheme()}>
        <>
          <ProfilePage />
          <SettingsPage />
        </>
      </ThemeProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Resumo do perfil' }),
      ).not.toBeNull()
    })
    expect(screen.getByRole('heading', { name: 'Configurações' })).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Salvar configurações' }),
    ).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Confirmar antes de excluir' }),
    ).not.toBeNull()
  })
})
