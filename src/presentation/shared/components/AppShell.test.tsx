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
        subtitle="Organize tarefas com passos claros."
        title="Atividades"
      >
        <p>Conteudo principal das atividades.</p>
      </AppShell>,
    )

    expect(
      screen
        .getByRole('link', { name: 'Pular para o conteudo' })
        .getAttribute('href'),
    ).toBe('#conteudo-principal')

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })
    expect(
      within(navigation).getByRole('link', { name: 'Painel' }).getAttribute('href'),
    ).toBe('/')
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
        .getByRole('link', { name: 'Configuracoes' })
        .getAttribute('href'),
    ).toBe('/configuracoes')

    const main = screen.getByRole('main', { name: 'Atividades' })
    expect(within(main).getByText('Conteudo principal das atividades.')).not.toBeNull()
  })

  it('keeps every route reachable in simplified navigation mode', () => {
    renderWithTheme(
      <AppShell
        activeRoute="/"
        navigationMode="simplified"
        subtitle="Ajustes essenciais em primeiro lugar."
        title="Painel SeniorEase"
      >
        <p>Preferencias principais.</p>
      </AppShell>,
    )

    const navigation = screen.getByRole('navigation', { name: 'SeniorEase' })

    expect(navigation.getAttribute('data-navigation-mode')).toBe('simplified')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Painel' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      within(navigation).getByRole('link', { name: 'Atividades' }),
    ).not.toBeNull()
    expect(within(navigation).getByRole('link', { name: 'Perfil' })).not.toBeNull()
    expect(
      within(navigation).getByRole('link', { name: 'Configuracoes' }),
    ).not.toBeNull()
    expect(within(navigation).getByText('Outras areas')).not.toBeNull()
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

  it('renders status text without relying on color alone', () => {
    renderWithTheme(<StatusPill label="Pendente" tone="warning" />)

    expect(screen.getByText('Pendente')).not.toBeNull()
  })
})
