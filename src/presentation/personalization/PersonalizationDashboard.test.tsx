import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('renders the Figma dashboard control groups with responsive node metadata', () => {
    renderDashboard()

    const dashboard = screen.getByRole('region', {
      name: 'Personalization controls',
    })

    expect(dashboard.getAttribute('data-figma-node-desktop')).toBe('703:5')
    expect(dashboard.getAttribute('data-figma-node-tablet')).toBe('703:305')
    expect(dashboard.getAttribute('data-figma-node-mobile')).toBe('703:407')
    expect(
      within(dashboard).getByRole('radiogroup', { name: 'Tamanho do texto' }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('radiogroup', {
        name: 'Conforto do espaçamento',
      }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('radiogroup', { name: 'Nível de contraste' }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('heading', { name: 'Modo da interface' }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('switch', { name: 'Navegação simplificada' }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('switch', { name: 'Feedback reforçado' }),
    ).not.toBeNull()
    expect(
      within(dashboard).getByRole('switch', {
        name: 'Confirmação extra para ações críticas',
      }),
    ).not.toBeNull()
  })

  it('updates the validated preference store from pill and switch controls', () => {
    const { onPreferenceChange } = renderDashboard()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Máximo' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Extra amplo' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Navegação simplificada' }))
    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Confirmação extra para ações críticas',
      }),
    )

    expect(usePreferenceStore.getState().preferences).toMatchObject({
      fontScale: 'extraLarge',
      contrastLevel: 'maximum',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      extraConfirmation: false,
    })
    expect(onPreferenceChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        extraConfirmation: false,
      }),
    )
  })

  it('shows a Figma positive feedback panel through a polite live region', () => {
    renderDashboard()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))

    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(
      within(status).getByRole('heading', { name: 'Preferências salvas' }),
    ).not.toBeNull()
    expect(status.textContent).toContain(
      'Preferência salva: tamanho do texto Muito grande.',
    )
  })
})
