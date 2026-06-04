import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import type { Activity } from '../../../domain/activities'
import { createSeniorEaseTheme } from '../../../theme/createSeniorEaseTheme'
import { ActivityList } from './ActivityList'

const activities: Activity[] = [
  {
    id: 'activity-1',
    title: 'Enviar trabalho',
    reminderText: 'Hoje as 18h',
    status: 'pending',
    steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
    createdAt: '2026-06-01T12:00:00.000Z',
  },
  {
    id: 'activity-2',
    title: 'Preparar reuniao',
    reminderText: 'Amanha de manha',
    status: 'inProgress',
    steps: [{ id: 'step-2', label: 'Separar anotacoes', completed: true }],
    createdAt: '2026-06-02T12:00:00.000Z',
  },
]

function renderList() {
  const onOpenActivity = jest.fn()

  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ActivityList
        activities={activities}
        isLoading={false}
        onOpenActivity={onOpenActivity}
        selectedActivityId="activity-2"
      />
    </ThemeProvider>,
  )

  return { onOpenActivity }
}

describe('ActivityList', () => {
  it('renders one list item per activity with status text', () => {
    renderList()

    const list = screen.getByRole('list', { name: 'Atividades ativas' })
    const items = within(list).getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(within(items[0]).getByText('Status: Pendente')).not.toBeNull()
    expect(within(items[1]).getByText('Status: Em andamento')).not.toBeNull()
  })

  it('opens an activity through an accessible card action', () => {
    const { onOpenActivity } = renderList()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir atividade Preparar reuniao',
      }),
    )

    expect(onOpenActivity).toHaveBeenCalledWith('activity-2')
  })
})
