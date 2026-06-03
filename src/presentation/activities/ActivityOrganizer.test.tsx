import { useState } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import type { Activity } from '../../domain/activities'
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme'
import {
  ActivityOrganizer,
  activityOrganizerWidgetContract,
} from './ActivityOrganizer'

const pendingActivity: Activity = {
  id: 'activity-1',
  title: 'Enviar trabalho',
  reminderText: 'Hoje as 18h',
  status: 'pending',
  steps: [
    { id: 'step-1', label: 'Abrir a plataforma', completed: false },
    { id: 'step-2', label: 'Enviar o arquivo', completed: false },
  ],
  createdAt: '2026-06-01T12:00:00.000Z',
}

const completedActivity: Activity = {
  ...pendingActivity,
  status: 'completed',
  steps: pendingActivity.steps.map((step) => ({ ...step, completed: true })),
  completedAt: '2026-06-01T13:30:00.000Z',
}

function renderOrganizer(
  props: Partial<React.ComponentProps<typeof ActivityOrganizer>> = {},
) {
  const onCreateActivity = jest.fn().mockResolvedValue(pendingActivity)
  const onCompleteActivity = jest.fn().mockResolvedValue(completedActivity)
  const onSelectActivity = jest.fn()
  const onActivityComplete = jest.fn()

  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ActivityOrganizer
        activities={[pendingActivity]}
        completedActivities={[]}
        onActivityComplete={onActivityComplete}
        onCompleteActivity={onCompleteActivity}
        onCreateActivity={onCreateActivity}
        onSelectActivity={onSelectActivity}
        selectedActivityId={null}
        {...props}
      />
    </ThemeProvider>,
  )

  return {
    onActivityComplete,
    onCompleteActivity,
    onCreateActivity,
    onSelectActivity,
  }
}

describe('ActivityOrganizer', () => {
  it('renders an empty state with one clear primary action', () => {
    renderOrganizer({ activities: [], completedActivities: [] })

    expect(screen.getByText('Nenhuma atividade por enquanto.')).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Criar atividade' }),
    ).not.toBeNull()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('creates an activity with title, reminder, and first guided step', async () => {
    const { onCreateActivity } = renderOrganizer({
      activities: [],
      completedActivities: [],
    })

    fireEvent.click(screen.getByRole('button', { name: 'Criar atividade' }))
    fireEvent.change(screen.getByLabelText('Titulo da atividade'), {
      target: { value: ' Enviar trabalho ' },
    })
    fireEvent.change(screen.getByLabelText('Lembrete em linguagem simples'), {
      target: { value: ' Hoje as 18h ' },
    })
    fireEvent.change(screen.getByLabelText('Primeiro passo'), {
      target: { value: ' Abrir a plataforma ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar atividade' }))

    await waitFor(() => {
      expect(onCreateActivity).toHaveBeenCalledWith({
        title: 'Enviar trabalho',
        reminderText: 'Hoje as 18h',
        steps: [{ label: 'Abrir a plataforma' }],
      })
    })
    expect(screen.getByRole('status').textContent).toContain(
      'Atividade criada: Enviar trabalho.',
    )
  })

  it('shows active activities with reminder, status, and accessible primary action', () => {
    const { onSelectActivity } = renderOrganizer()

    const activityList = screen.getByRole('list', {
      name: 'Atividades ativas',
    })

    expect(within(activityList).getByText('Enviar trabalho')).not.toBeNull()
    expect(within(activityList).getByText('Lembrete: Hoje as 18h')).not.toBeNull()
    expect(within(activityList).getByText('Status: Pendente')).not.toBeNull()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir atividade Enviar trabalho',
      }),
    )

    expect(onSelectActivity).toHaveBeenCalledWith('activity-1')
  })

  it('renders guided steps in order with keyboard-operable controls', () => {
    renderOrganizer({ selectedActivityId: 'activity-1' })

    const stepList = screen.getByRole('list', {
      name: 'Passos de Enviar trabalho',
    })
    const steps = within(stepList).getAllByRole('listitem')

    expect(steps[0].textContent).toContain('Passo 1 de 2')
    expect(steps[0].textContent).toContain('Abrir a plataforma')
    expect(steps[1].textContent).toContain('Passo 2 de 2')
    expect(steps[1].textContent).toContain('Enviar o arquivo')

    const firstStep = screen.getByRole('checkbox', {
      name: 'Passo 1 de 2: Abrir a plataforma',
    }) as HTMLInputElement

    firstStep.focus()
    expect(document.activeElement).toBe(firstStep)
    fireEvent.click(firstStep)
    expect(firstStep.checked).toBe(true)
  })

  it('announces completion and moves the activity to history', async () => {
    const onCompleteActivity = jest.fn().mockResolvedValue(completedActivity)
    const onActivityComplete = jest.fn()

    function ControlledOrganizer() {
      const [activities, setActivities] = useState<Activity[]>([
        pendingActivity,
      ])
      const [completedActivities, setCompletedActivities] = useState<
        Activity[]
      >([])
      const [selectedActivityId, setSelectedActivityId] = useState<
        string | null
      >('activity-1')

      const handleCompleteActivity = async (activityId: string) => {
        const activity = await onCompleteActivity(activityId)

        setActivities([])
        setCompletedActivities([activity])
        setSelectedActivityId(null)

        return activity
      }

      return (
        <ThemeProvider theme={createSeniorEaseTheme()}>
          <ActivityOrganizer
            activities={activities}
            completedActivities={completedActivities}
            onActivityComplete={onActivityComplete}
            onCompleteActivity={handleCompleteActivity}
            onCreateActivity={jest.fn()}
            onSelectActivity={setSelectedActivityId}
            selectedActivityId={selectedActivityId}
          />
        </ThemeProvider>
      )
    }

    render(<ControlledOrganizer />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Concluir atividade Enviar trabalho',
      }),
    )

    await waitFor(() => {
      expect(onCompleteActivity).toHaveBeenCalledWith('activity-1')
    })
    expect(screen.getByRole('status').textContent).toContain(
      'Atividade concluida: Enviar trabalho. Ela foi movida para o historico.',
    )
    expect(onActivityComplete).toHaveBeenCalledWith({
      activityId: 'activity-1',
      title: 'Enviar trabalho',
    })
    expect(
      within(
        screen.getByRole('list', {
          name: 'Historico de atividades concluidas',
        }),
      ).getByText('Enviar trabalho'),
    ).not.toBeNull()
  })

  it('does not announce completion when the completion action is cancelled', async () => {
    const onCompleteActivity = jest.fn().mockResolvedValue(undefined)
    const onActivityComplete = jest.fn()

    renderOrganizer({
      onActivityComplete,
      onCompleteActivity,
      selectedActivityId: 'activity-1',
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Concluir atividade Enviar trabalho',
      }),
    )

    await waitFor(() => {
      expect(onCompleteActivity).toHaveBeenCalledWith('activity-1')
    })
    expect(screen.getByRole('status').textContent).not.toContain(
      'Atividade concluida',
    )
    expect(onActivityComplete).not.toHaveBeenCalled()
  })

  it('exports future widget contract names for Multi-Zone extraction', () => {
    expect(activityOrganizerWidgetContract).toEqual({
      elementName: 'seniorease-activity-organizer',
      modeAttribute: 'data-mode',
      completeEventName: 'activity-complete',
      createEventName: 'activity-create',
    })
  })
})
