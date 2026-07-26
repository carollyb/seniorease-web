import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import DashboardPage from '../../pages/painel'
import { createDefaultPreferences } from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'

function setDesktopViewport(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  })
}

function renderPage() {
  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <DashboardPage />
    </ThemeProvider>,
  )
}

describe('Personalization page feedback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.localStorage.clear()
    setDesktopViewport(false)
    usePreferenceStore.setState({
      preferences: createDefaultPreferences(),
      hasHydrated: true,
      persistenceWarning: null,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('starts in a neutral state without showing or scheduling feedback', () => {
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout')

    renderPage()

    expect(screen.queryByRole('status')).toBeNull()
    expect(
      timeoutSpy.mock.calls.some(([, delay]) => delay === 3_000),
    ).toBe(false)
  })

  it('shows the latest feedback below navigation on mobile and tablet', () => {
    renderPage()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })
    const status = screen.getByRole('status')

    expect(navigation.nextElementSibling).toBe(status)
    expect(
      within(status).getByRole('heading', { name: 'Preferências salvas' }),
    ).not.toBeNull()
    expect(status.textContent).toContain(
      'Preferência salva: tamanho do texto Muito grande.',
    )

    act(() => {
      jest.advanceTimersByTime(3_000)
    })
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('shows feedback below the page subtitle on desktop', () => {
    setDesktopViewport(true)
    renderPage()

    fireEvent.click(screen.getByRole('radio', { name: 'Muito grande' }))

    const subtitle = screen.getByText(
      'Ajuste legibilidade, contraste, espaçamento, complexidade da navegação, feedback e confirmações.',
    )
    const header = subtitle.closest('header')
    const status = screen.getByRole('status')

    expect(header?.nextElementSibling).toBe(status)
  })

  it('does not show feedback when reinforced feedback is disabled', () => {
    usePreferenceStore.setState({
      preferences: {
        ...createDefaultPreferences(),
        reinforcedFeedback: false,
      },
    })

    renderPage()

    expect(screen.queryByRole('status')).toBeNull()
  })
})
