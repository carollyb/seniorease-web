import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import type { Activity } from '../../../domain/activities'
import { createSeniorEaseTheme } from '../../../theme/createSeniorEaseTheme'
import { ActivityCard } from './ActivityCard'

const pendingActivity: Activity = {
  id: 'activity-1',
  title: 'Enviar trabalho',
  reminderText: 'Hoje as 18h',
  status: 'pending',
  steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
  createdAt: '2026-06-01T12:00:00.000Z',
}

function renderCard(activity: Activity = pendingActivity) {
  const onOpen = jest.fn()

  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ActivityCard
        activity={activity}
        isLoading={false}
        isSelected={false}
        onOpen={onOpen}
      />
    </ThemeProvider>,
  )

  return { onOpen }
}

describe('ActivityCard', () => {
  it('shows the title, reminder, status text, and accessible open action', () => {
    renderCard()

    expect(
      screen.getByRole('article', { name: 'Enviar trabalho' }),
    ).not.toBeNull()
    expect(screen.getByText('Lembrete: Hoje as 18h')).not.toBeNull()
    expect(screen.getByText('Status: Pendente')).not.toBeNull()
    expect(
      screen.getByRole('button', {
        name: 'Abrir atividade Enviar trabalho',
      }),
    ).not.toBeNull()
  })

  it('uses plain language when no reminder is saved', () => {
    renderCard({ ...pendingActivity, reminderText: undefined })

    expect(screen.getByText('Sem lembrete cadastrado')).not.toBeNull()
  })
})
