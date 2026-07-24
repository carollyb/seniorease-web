import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import type { Activity } from '../../domain/activities';
import { createDefaultPreferences } from '../../domain/preferences';
import { ACTIVITY_STORAGE_NAME } from '../../infrastructure/repositories/LocalActivityRepository';
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore';
import { createSeniorEaseTheme } from '../../theme/createSeniorEaseTheme';
import {
  ActivityOrganizer,
  activityOrganizerWidgetContract,
} from './ActivityOrganizer';

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
};

const completedActivity: Activity = {
  id: 'activity-2',
  title: 'Revisar orçamento',
  reminderText: 'Ontem às 15h',
  status: 'completed',
  steps: [
    { id: 'step-3', label: 'Conferir valores', completed: true },
    { id: 'step-4', label: 'Enviar aprovação', completed: true },
  ],
  createdAt: '2026-05-31T12:00:00.000Z',
  completedAt: '2026-06-01T15:00:00.000Z',
};

const inProgressActivity: Activity = {
  ...pendingActivity,
  id: 'activity-3',
  title: 'Preparar apresentação',
  status: 'inProgress',
};

function renderOrganizer(
  props: Partial<React.ComponentProps<typeof ActivityOrganizer>> = {},
) {
  render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ActivityOrganizer {...props} />
    </ThemeProvider>,
  );
}

function storeActivities(activities: Activity[]) {
  window.localStorage.setItem(
    ACTIVITY_STORAGE_NAME,
    JSON.stringify({ activities }),
  );
}

async function waitForOrganizerToLoad() {
  await waitFor(() => {
    expect(
      screen
        .getByRole('button', { name: 'Nova tarefa' })
        .hasAttribute('disabled'),
    ).toBe(false);
  });
}

async function openPendingActivity() {
  const openButton = await screen.findByRole('button', {
    name: 'Abrir atividade Enviar trabalho',
  });

  await waitFor(() => {
    expect(openButton.hasAttribute('disabled')).toBe(false);
  });
  fireEvent.click(openButton);

  return screen.findByRole('button', {
    name: 'Concluir atividade Enviar trabalho',
  });
}

describe('ActivityOrganizer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    usePreferenceStore.setState({
      preferences: createDefaultPreferences(),
      hasHydrated: true,
      persistenceWarning: null,
    });
  });

  it('renders an empty state with one clear primary action', async () => {
    renderOrganizer({ mode: 'simplified' });
    await waitForOrganizerToLoad();

    expect(screen.getByText('Sem tarefas para hoje')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Nova tarefa' })).not.toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('creates an activity with title, reminder, and first guided step', async () => {
    renderOrganizer();
    await waitForOrganizerToLoad();

    fireEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }));
    fireEvent.change(screen.getByLabelText('Título da tarefa'), {
      target: { value: ' Enviar trabalho ' },
    });
    fireEvent.change(screen.getByLabelText('Lembrete em linguagem simples'), {
      target: { value: ' Hoje as 18h ' },
    });
    fireEvent.change(screen.getByLabelText('Primeiro passo'), {
      target: { value: ' Abrir a plataforma ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar tarefa' }));

    const modal = await screen.findByRole('dialog', {
      name: 'Confirmar Criação',
    });
    expect(within(modal).getByText('Enviar trabalho')).not.toBeNull();
    expect(within(modal).getByText('Hoje as 18h')).not.toBeNull();
    fireEvent.click(
      within(modal).getByRole('button', {
        name: 'Criar',
      }),
    );

    const activityList = await screen.findByRole('list', {
      name: 'Atividades ativas',
    });
    expect(within(activityList).getByText('Enviar trabalho')).not.toBeNull();
    expect(
      within(activityList).getByText('Lembrete: Hoje as 18h'),
    ).not.toBeNull();
    expect(
      await screen.findByRole('list', {
        name: 'Passos de Enviar trabalho',
      }),
    ).not.toBeNull();

    const storedSnapshot = JSON.parse(
      window.localStorage.getItem(ACTIVITY_STORAGE_NAME) ?? '{}',
    );

    expect(storedSnapshot).toMatchObject({
      activities: [
        {
          title: 'Enviar trabalho',
          reminderText: 'Hoje as 18h',
          steps: [{ label: 'Abrir a plataforma' }],
        },
      ],
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    expect(screen.queryByRole('form', { name: 'Nova tarefa' })).toBeNull();
  });

  it('adds consecutive step fields and saves every filled step in order', async () => {
    renderOrganizer();
    await waitForOrganizerToLoad();

    fireEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }));

    const firstStepInput = screen.getByLabelText('Primeiro passo');
    expect(
      screen.queryByRole('button', { name: 'Adicionar passo 2' }),
    ).toBeNull();

    fireEvent.change(firstStepInput, {
      target: { value: ' Abrir a plataforma ' },
    });

    const addSecondStepButton = screen.getByRole('button', {
      name: 'Adicionar passo 2',
    });
    act(() => addSecondStepButton.focus());
    expect(document.activeElement).toBe(addSecondStepButton);
    fireEvent.click(addSecondStepButton);

    const secondStepInput = screen.getByLabelText('Passo 2');
    expect(document.activeElement).toBe(secondStepInput);
    expect(
      screen.queryByRole('button', { name: 'Adicionar passo 3' }),
    ).toBeNull();

    fireEvent.change(secondStepInput, {
      target: { value: ' Revisar os dados ' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar passo 3' }),
    );
    fireEvent.change(screen.getByLabelText('Passo 3'), {
      target: { value: ' Enviar o arquivo ' },
    });

    fireEvent.change(screen.getByLabelText('Título da tarefa'), {
      target: { value: ' Enviar trabalho ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar tarefa' }));

    const modal = await screen.findByRole('dialog', {
      name: 'Confirmar Criação',
    });
    fireEvent.click(within(modal).getByRole('button', { name: 'Criar' }));

    await screen.findByRole('list', { name: 'Passos de Enviar trabalho' });

    const storedSnapshot = JSON.parse(
      window.localStorage.getItem(ACTIVITY_STORAGE_NAME) ?? '{}',
    );

    expect(storedSnapshot.activities[0].steps).toMatchObject([
      { label: 'Abrir a plataforma' },
      { label: 'Revisar os dados' },
      { label: 'Enviar o arquivo' },
    ]);
  });

  it('shows active activities with reminder, status, and accessible primary action', async () => {
    storeActivities([pendingActivity]);
    renderOrganizer();

    const activityList = await screen.findByRole('list', {
      name: 'Atividades ativas',
    });

    expect(within(activityList).getByText('Enviar trabalho')).not.toBeNull();
    expect(
      within(activityList).getByText('Lembrete: Hoje as 18h'),
    ).not.toBeNull();
    expect(within(activityList).getByText('Status: Pendente')).not.toBeNull();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir atividade Enviar trabalho',
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Passos de Enviar trabalho',
      }),
    ).not.toBeNull();
  });

  it('defaults the standard history filter to completed activities', async () => {
    storeActivities([pendingActivity, completedActivity]);
    renderOrganizer({ mode: 'standard' });

    const filterGroup = await screen.findByRole('group', {
      name: 'Filtrar histórico por status',
    });
    const completedFilter = within(filterGroup).getByRole('button', {
      name: 'Concluídas',
    });
    const pendingFilter = within(filterGroup).getByRole('button', {
      name: 'A Fazer',
    });

    expect(completedFilter.getAttribute('aria-pressed')).toBe('true');
    expect(pendingFilter.getAttribute('aria-pressed')).toBe('false');

    const history = screen.getByRole('list', {
      name: 'Histórico de atividades concluidas',
    });

    expect(within(history).getByText('Revisar orçamento')).not.toBeNull();
    expect(within(history).queryByText('Enviar trabalho')).toBeNull();
  });

  it('lists only pending activities with a warning status and bullet steps', async () => {
    storeActivities([pendingActivity, inProgressActivity]);
    renderOrganizer({ mode: 'standard' });

    const pendingFilter = await screen.findByRole('button', {
      name: 'A Fazer',
    });
    act(() => pendingFilter.focus());
    fireEvent.click(pendingFilter);

    expect(document.activeElement).toBe(pendingFilter);
    expect(pendingFilter.getAttribute('aria-pressed')).toBe('true');
    expect(
      screen
        .getByRole('button', { name: 'Concluídas' })
        .getAttribute('aria-pressed'),
    ).toBe('false');

    const history = screen.getByRole('list', {
      name: 'Histórico de atividades a fazer',
    });
    expect(within(history).getByText('Enviar trabalho')).not.toBeNull();
    expect(within(history).queryByText('Preparar apresentação')).toBeNull();
    expect(within(history).getByText('Status: Pendente')).not.toBeNull();

    const steps = within(history).getByRole('list', {
      name: 'Passos de Enviar trabalho',
    });
    expect(within(steps).getAllByRole('listitem')).toHaveLength(2);
    expect(within(steps).getByText('Abrir a plataforma')).not.toBeNull();
    expect(within(steps).getByText('Enviar o arquivo')).not.toBeNull();
  });

  it('keeps simplified navigation unchanged without history filters', async () => {
    storeActivities([pendingActivity, completedActivity]);
    renderOrganizer({ mode: 'simplified' });

    const history = await screen.findByRole('list', {
      name: 'Histórico de atividades concluidas',
    });

    expect(
      screen.queryByRole('group', {
        name: 'Filtrar histórico por status',
      }),
    ).toBeNull();
    expect(within(history).getByText('Revisar orçamento')).not.toBeNull();
    expect(within(history).queryByText('Enviar trabalho')).toBeNull();
  });

  it('renders guided steps in order with keyboard-operable controls', async () => {
    storeActivities([pendingActivity]);
    renderOrganizer();
    await openPendingActivity();

    const stepList = screen.getByRole('list', {
      name: 'Passos de Enviar trabalho',
    });
    const steps = within(stepList).getAllByRole('listitem');

    expect(steps[0].textContent).toContain('Passo 1 de 2');
    expect(steps[0].textContent).toContain('Abrir a plataforma');
    expect(steps[1].textContent).toContain('Passo 2 de 2');
    expect(steps[1].textContent).toContain('Enviar o arquivo');

    const firstStep = screen.getByRole('checkbox', {
      name: 'Passo 1 de 2: Abrir a plataforma',
    }) as HTMLInputElement;

    firstStep.focus();
    expect(document.activeElement).toBe(firstStep);
    fireEvent.click(firstStep);
    expect(firstStep.checked).toBe(true);
  });

  it('moves the activity to history after modal confirmation', async () => {
    storeActivities([pendingActivity]);
    renderOrganizer();
    const completeButton = await openPendingActivity();
    fireEvent.click(completeButton);

    const modal = await screen.findByRole('dialog', {
      name: 'Confirmar Conclusão',
    });
    fireEvent.click(
      within(modal).getByRole('button', {
        name: 'Concluir',
      }),
    );

    expect(
      within(
        await screen.findByRole('list', {
          name: 'Histórico de atividades concluidas',
        }),
      ).getByText('Enviar trabalho'),
    ).not.toBeNull();

    const storedSnapshot = JSON.parse(
      window.localStorage.getItem(ACTIVITY_STORAGE_NAME) ?? '{}',
    );
    expect(storedSnapshot).toMatchObject({
      activities: [
        {
          id: 'activity-1',
          status: 'completed',
        },
      ],
    });
  });

  it('keeps the activity pending when modal completion is cancelled', async () => {
    storeActivities([pendingActivity]);
    renderOrganizer();
    const completeButton = await openPendingActivity();
    fireEvent.click(completeButton);

    const modal = await screen.findByRole('dialog', {
      name: 'Confirmar Conclusão',
    });
    fireEvent.click(
      within(modal).getByRole('button', {
        name: 'Cancelar',
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    expect(screen.getByText('Enviar trabalho')).not.toBeNull();
    expect(
      screen.queryByRole('list', {
        name: 'Histórico de atividades concluidas',
      }),
    ).toBeNull();

    const storedSnapshot = JSON.parse(
      window.localStorage.getItem(ACTIVITY_STORAGE_NAME) ?? '{}',
    );
    expect(storedSnapshot).toMatchObject({
      activities: [
        {
          id: 'activity-1',
          status: 'pending',
        },
      ],
    });
  });

  it('exports future widget contract names for Multi-Zone extraction', () => {
    expect(activityOrganizerWidgetContract).toEqual({
      elementName: 'seniorease-activity-organizer',
      modeAttribute: 'data-mode',
      completeEventName: 'activity-complete',
      createEventName: 'activity-create',
    });
  });
});
