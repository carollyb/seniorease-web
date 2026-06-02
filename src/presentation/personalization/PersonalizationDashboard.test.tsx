import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import { createDefaultPreferences } from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import { PersonalizationDashboard } from './PersonalizationDashboard'

function renderDashboard(onPreferenceChange = jest.fn()) {
  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <PersonalizationDashboard onPreferenceChange={onPreferenceChange} />
    </ThemeProvider>,
  )

  return { onPreferenceChange }
}

describe('PersonalizationDashboard', () => {
  beforeEach(() => {
    window.localStorage.clear()
    usePreferenceStore.setState({
      preferences: createDefaultPreferences(),
      hasHydrated: true,
      persistenceWarning: null,
    })
  })

  it('renders accessible controls with helper descriptions for every preference', () => {
    renderDashboard()

    expect(
      screen.getByRole('radiogroup', { name: 'Tamanho do texto' }),
    ).not.toBeNull()
    expect(screen.getByText('Ajusta a leitura em titulos, botoes e textos.')).not.toBeNull()
    expect(
      screen.getByRole('radiogroup', { name: 'Nivel de contraste' }),
    ).not.toBeNull()
    expect(screen.getByText('Aumenta a diferenca entre texto, fundo e estados.')).not.toBeNull()
    expect(
      screen.getByRole('radiogroup', { name: 'Espacamento' }),
    ).not.toBeNull()
    expect(screen.getByText('Define o conforto entre blocos e controles de toque.')).not.toBeNull()
    expect(
      screen.getByRole('radiogroup', { name: 'Modo de navegacao' }),
    ).not.toBeNull()
    expect(screen.getByText('Organiza a interface com mais ou menos detalhes.')).not.toBeNull()
    expect(
      screen.getByRole('checkbox', {
        name: 'Feedback visual reforcado',
      }),
    ).not.toBeNull()
    expect(
      screen.getByText('Mostra mensagens de confirmacao mais evidentes.'),
    ).not.toBeNull()
    expect(
      screen.getByRole('checkbox', {
        name: 'Confirmacao extra para acoes criticas',
      }),
    ).not.toBeNull()
    expect(
      screen.getByText('Pede revisao antes de apagar ou concluir algo importante.'),
    ).not.toBeNull()
  })

  it('updates the validated preference store when controls change', () => {
    const { onPreferenceChange } = renderDashboard()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Maximo' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Padrao' }))
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Confirmacao extra para acoes criticas',
      }),
    )

    expect(usePreferenceStore.getState().preferences).toMatchObject({
      fontScale: 'extraLarge',
      contrastLevel: 'maximum',
      navigationMode: 'standard',
      extraConfirmation: false,
    })
    expect(onPreferenceChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        extraConfirmation: false,
      }),
    )
  })

  it('shows visible polite feedback after preference changes', () => {
    renderDashboard()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))

    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.textContent).toContain(
      'Preferencia salva: tamanho do texto Muito grande.',
    )
  })
})
