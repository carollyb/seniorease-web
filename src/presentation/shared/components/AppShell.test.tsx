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

describe('shared app shell components', () => {
  it('renders landmarks, skip link, active navigation, and main content', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/atividades"
        navigationMode="standard"
        subtitle="Organize tasks with clear steps."
        title="Activities"
      >
        <p>Main activities content.</p>
      </AppShell>,
    )

    expect(
      screen
        .getByRole('link', { name: 'Skip to content' })
        .getAttribute('href'),
    ).toBe('#conteudo-principal')

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })
    expect(within(navigation).getByTestId('senior-ease-logo-mark')).not.toBeNull()
    expect(
      within(navigation).getByRole('link', { name: 'Dashboard' }).getAttribute('href'),
    ).toBe('/')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Activities' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Profile' }).getAttribute('href'),
    ).toBe('/perfil')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Settings' })
        .getAttribute('href'),
    ).toBe('/configuracoes')

    const main = screen.getByRole('main', { name: 'Activities' })
    expect(within(main).getByText('Main activities content.')).not.toBeNull()
  })

  it('keeps every route reachable in simplified navigation mode', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/"
        navigationMode="simplified"
        subtitle="Essential settings first."
        title="Make SeniorEase comfortable for you"
      >
        <p>Main preferences.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(navigation.getAttribute('data-navigation-mode')).toBe('simplified')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Dashboard' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Activities' }),
    ).not.toBeNull()
    expect(within(navigation).getByRole('link', { name: 'Profile' })).not.toBeNull()
    expect(
      within(navigation).getByRole('link', { name: 'Settings' }),
    ).not.toBeNull()
    expect(
      within(navigation).getByText(
        'Clear steps. Stable preferences. Gentle feedback.',
      ),
    ).not.toBeNull()
  })

  it('renders the Figma mobile menu affordance while keeping routes keyboard reachable', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/perfil"
        navigationMode="standard"
        subtitle="Review saved settings."
        title="Profile summary"
      >
        <p>Profile summary content.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(within(navigation).getByText('Menu')).not.toBeNull()
    expect(
      within(navigation)
        .getByRole('link', { name: 'Profile' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Settings' }),
    ).not.toBeNull()
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
