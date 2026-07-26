import { render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import { createSeniorEaseTheme } from '../../../theme/createSeniorEaseTheme'
import { AppShell } from './AppShell'
import { EmptyState } from './EmptyState'
import { PrimaryButton } from './PrimaryButton'
import { StatusPill } from './StatusPill'

function renderWithTheme(children: React.ReactNode) {
  render(<ThemeProvider theme={createSeniorEaseTheme()}>{children}</ThemeProvider>)
}

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

describe('shared app shell components', () => {
  beforeEach(() => {
    setDesktopViewport(false)
  })

  it('renders landmarks, skip link, active navigation, and main content', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/atividades"
        navigationMode="standard"
        subtitle="Organize tarefas com passos claros."
        title="Atividades"
      >
        <p>Conteúdo principal das atividades.</p>
      </AppShell>,
    )

    expect(
      screen
        .getByRole('link', { name: 'Pular para o conteúdo' })
        .getAttribute('href'),
    ).toBe('#conteudo-principal')

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })
    expect(within(navigation).getByTestId('senior-ease-logo-mark')).not.toBeNull()
    expect(
      within(navigation)
        .getByRole('link', { name: 'Painel de preferências' })
        .getAttribute('href'),
    ).toBe('/painel')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Atividades' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Perfil' }).getAttribute('href'),
    ).toBe('/perfil')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Configurações' })
        .getAttribute('href'),
    ).toBe('/configuracoes')

    const main = screen.getByRole('main', { name: 'Atividades' })
    expect(within(main).getByText('Conteúdo principal das atividades.')).not.toBeNull()
  })

  it('keeps every route reachable in simplified navigation mode', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/painel"
        navigationMode="simplified"
        subtitle="Ajustes essenciais em primeiro lugar."
        title="Deixe o SeniorEase confortável para você"
      >
        <p>Preferências principais.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(navigation.getAttribute('data-navigation-mode')).toBe('simplified')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Painel de preferências' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Atividades' }),
    ).not.toBeNull()
    expect(within(navigation).getByRole('link', { name: 'Perfil' })).not.toBeNull()
    expect(
      within(navigation).getByRole('link', { name: 'Configurações' }),
    ).not.toBeNull()
    expect(
      within(navigation).getByText(
        'Passos claros. Preferências estáveis. Feedback gentil.',
      ),
    ).not.toBeNull()
  })

  it('keeps mobile routes keyboard reachable without a menu label', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/perfil"
        navigationMode="standard"
        subtitle="Confira os ajustes salvos."
        title="Resumo do perfil"
      >
        <p>Conteúdo do resumo do perfil.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(within(navigation).queryByText('Menu')).toBeNull()
    expect(
      within(navigation)
        .getByRole('link', { name: 'Perfil' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Configurações' }),
    ).not.toBeNull()
  })

  it('places contextual content immediately below navigation on mobile and tablet', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/painel"
        contextualContent={<div role="status">Preferências salvas</div>}
        title="Preferências"
      >
        <p>Controles de preferências.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })
    const status = screen.getByRole('status')

    expect(navigation.nextElementSibling).toBe(status)
    expect(screen.getByRole('main').contains(status)).toBe(false)
  })

  it('places contextual content immediately below the header on desktop', () => {
    setDesktopViewport(true)

    renderWithTheme(
      <AppShell
        activeRoute="/painel"
        contextualContent={<div role="status">Preferências salvas</div>}
        subtitle="Ajuste legibilidade, contraste e feedback."
        title="Preferências"
      >
        <p>Controles de preferências.</p>
      </AppShell>,
    )

    const header = screen.getByRole('heading', { name: 'Preferências' }).closest('header')
    const status = screen.getByRole('status')

    expect(header?.nextElementSibling).toBe(status)
    expect(screen.getByRole('main').contains(status)).toBe(false)
  })

  it('centralizes primary actions, status pills, and empty states', () => {
    renderWithTheme(
      <EmptyState
        action={<PrimaryButton>Nova atividade</PrimaryButton>}
        description="Comece com uma tarefa simples."
        title="Nenhuma atividade"
      />,
    )

    expect(screen.getByRole('heading', { name: 'Nenhuma atividade' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Nova atividade' })).not.toBeNull()
  })

  it('preserves native disabled semantics for shared button treatments', () => {
    renderWithTheme(
      <>
        <PrimaryButton tone="completion">Concluir atividade</PrimaryButton>
        <PrimaryButton disabled tone="secondary">
          Voltar
        </PrimaryButton>
      </>,
    )

    expect(
      screen.getByRole('button', { name: 'Concluir atividade' }),
    ).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Voltar' }).hasAttribute('disabled')).toBe(
      true,
    )
  })

  it('renders status text without relying on color alone', () => {
    renderWithTheme(<StatusPill compact label="Pendente" tone="warning" />)

    expect(screen.getByText('Pendente')).not.toBeNull()
  })
})
