import { useEffect, useRef, useState, type FormEvent } from 'react';

import {
  createActivity as createActivityBO,
  type Activity,
  type CreateActivityInput,
} from '../../domain/activities';

import {
  CompleteActivityUseCase,
  CreateActivityUseCase,
  ListActivitiesUseCase,
  ListCompletedActivitiesUseCase,
} from '../../application/activities';
import type { HistoryFilter, UseActivityOrganizerOptions } from './types';
import { LocalActivityRepository } from '../../infrastructure/repositories';
import { usePreferenceStore } from '@/stores/preferences/usePreferenceStore';
import { createActivityStore } from '@/stores/activities';
import { useTimedFeedback } from '../shared/hooks/useTimedFeedback';

interface PendingCompletion {
  activityId: string;
  resolve(completedActivity: Activity | void): void;
}

interface ActivityFeedback {
  subtitle: string;
  title: string;
}

const activityRepository = new LocalActivityRepository();

const useActivityStore = createActivityStore({
  completeActivity: new CompleteActivityUseCase(activityRepository),
  createActivity: new CreateActivityUseCase(activityRepository),
  listActivities: new ListActivitiesUseCase(activityRepository),
  listCompletedActivities: new ListCompletedActivitiesUseCase(
    activityRepository,
  ),
});

export function useActivityOrganizer({ mode }: UseActivityOrganizerOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [reminderText, setReminderText] = useState('');
  const [stepLabels, setStepLabels] = useState<string[]>(() => ['']);
  const [formError, setFormError] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] =
    useState<HistoryFilter>('completed');
  const {
    feedback,
    isFeedbackVisible: isTimedFeedbackVisible,
    showFeedback: showTimedFeedback,
  } = useTimedFeedback<ActivityFeedback>();
  const [activityToCreate, setActivityToCreate] = useState<Activity | null>(
    null,
  );
  const [modalType, setModalType] = useState<'create' | 'complete' | null>(
    null,
  );
  const [activityToComplete, setActivityToComplete] = useState<Activity | null>(
    null,
  );
  const extraConfirmation = usePreferenceStore(
    (state) => state.preferences.extraConfirmation,
  );
  const reinforcedFeedback = usePreferenceStore(
    (state) => state.preferences.reinforcedFeedback,
  );
  const completeActivity = useActivityStore((state) => state.completeActivity);

  const activities = useActivityStore((state) => state.activities);
  const completedActivities = useActivityStore(
    (state) => state.completedActivities,
  );
  const selectedActivityId = useActivityStore(
    (state) => state.selectedActivityId,
  );
  const isLoading = useActivityStore((state) => state.isLoading);
  const errorMessage = useActivityStore((state) => state.errorMessage);
  const loadActivities = useActivityStore((state) => state.loadActivities);
  const createActivity = useActivityStore((state) => state.createActivity);
  const selectActivity = useActivityStore((state) => state.selectActivity);

  const selectedActivity = selectedActivityId
    ? (activities.find((activity) => activity.id === selectedActivityId) ??
      null)
    : null;
  const isSimplified = mode === 'simplified';
  const historyActivities =
    isSimplified || historyFilter === 'completed'
      ? completedActivities
      : activities.filter((activity) => activity.status === 'pending');
  const historyListLabel =
    !isSimplified && historyFilter === 'pending'
      ? 'Histórico de atividades a fazer'
      : 'Histórico de atividades concluidas';
  const emptyHistoryMessage =
    !isSimplified && historyFilter === 'pending'
      ? 'Sem tarefas a fazer.'
      : 'Sem itens no histórico.';

  const handleShowCreateForm = () => {
    setIsCreating(true);
    setFormError(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setFormError(null);
    setTitle('');
    setReminderText('');
    setStepLabels(['']);
  };

  const handleStepLabelChange = (index: number, label: string) => {
    setStepLabels((currentLabels) =>
      currentLabels.map((currentLabel, currentIndex) =>
        currentIndex === index ? label : currentLabel,
      ),
    );
  };

  const handleAddStep = (index: number) => {
    setStepLabels((currentLabels) => {
      const isLastStep = index === currentLabels.length - 1;
      const isFilled = Boolean(currentLabels[index]?.trim());

      return isLastStep && isFilled ? [...currentLabels, ''] : currentLabels;
    });
  };

  const handleHistoryFilterChange = (filter: HistoryFilter) => {
    setHistoryFilter(filter);
  };

  const pendingCompletionRef = useRef<PendingCompletion | null>(null);

  const showFeedback = (title: string, subtitle: string) => {
    if (!reinforcedFeedback) {
      return;
    }

    showTimedFeedback({ subtitle, title });
  };

  const handleFeedbackMessageChange = (message: string) => {
    showFeedback('Muito bem!', message);
  };

  const handleCancelCreation = () => {
    const pendingCompletion = pendingCompletionRef.current;

    pendingCompletionRef.current = null;
    setActivityToCreate(null);
    setModalType(null);

    pendingCompletion?.resolve(undefined);
  };

  const handleConfirmCreationModal = async () => {
    try {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setFormError('Informe um título claro para a tarefa.');
        return;
      }

      if (!activityToCreate) {
        return;
      }

      const input: CreateActivityInput = {
        title: activityToCreate.title,
      };

      if (activityToCreate.reminderText) {
        input.reminderText = activityToCreate.reminderText;
      }

      if (activityToCreate.steps.length > 0) {
        input.steps = activityToCreate.steps.map((step) => ({
          label: step.label,
        }));
      }

      const createdActivity = await createActivity(input);
      const createdTitle = createdActivity.title;

      setTitle('');
      setReminderText('');
      setStepLabels(['']);
      setFormError(null);
      setIsCreating(false);
      showFeedback(
        'Tarefa salva com sucesso!',
        `A tarefa “${createdTitle}” foi adicionada à lista de hoje.`,
      );

      selectActivity(createdActivity.id);
      setActivityToCreate(null);
      setModalType(null);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a atividade.',
      );
    }
  };

  const handleSubmitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedReminderText = reminderText.trim();
    const steps = stepLabels
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({ label }));

    if (!trimmedTitle) {
      setFormError('Informe um título claro para a tarefa.');
      return;
    }

    const input: CreateActivityInput = {
      title: trimmedTitle,
    };

    if (trimmedReminderText) {
      input.reminderText = trimmedReminderText;
    }

    if (steps.length > 0) {
      input.steps = steps;
    }
    const createActivityResult = createActivityBO(input);

    setModalType('create');
    setActivityToCreate(createActivityResult || null);
  };

  const handleCompleteActivity = (activityId: string) => {
    if (!extraConfirmation) {
      return completeActivity(activityId);
    }

    const activity = activities.find(({ id }) => id === activityId);

    if (!activity) {
      return Promise.resolve(undefined);
    }

    return new Promise<Activity | void>((resolve) => {
      pendingCompletionRef.current = { activityId, resolve };
      setActivityToComplete(activity);
      setModalType('complete');
    });
  };

  const handleCancelCompletion = () => {
    const pendingCompletion = pendingCompletionRef.current;

    pendingCompletionRef.current = null;
    setActivityToComplete(null);
    setModalType(null);
    pendingCompletion?.resolve(undefined);
  };

  const handleConfirmCompletionModal = async () => {
    const pendingCompletion = pendingCompletionRef.current;

    if (!pendingCompletion) {
      return;
    }

    const completedActivity = await completeActivity(
      pendingCompletion.activityId,
    );

    pendingCompletionRef.current = null;
    setActivityToComplete(null);
    setModalType(null);
    pendingCompletion.resolve(completedActivity);
  };

  useEffect(() => {
    void loadActivities();

    return () => {
      pendingCompletionRef.current?.resolve(undefined);
      pendingCompletionRef.current = null;
    };
  }, [loadActivities]);

  const feedbackSubtitle = feedback?.subtitle ?? '';
  const feedbackTitle = feedback?.title ?? '';
  const isFeedbackVisible = isTimedFeedbackVisible && reinforcedFeedback;

  return {
    feedbackSubtitle,
    feedbackTitle,
    formError,
    handleAddStep,
    handleCancelCreate,
    handleShowCreateForm,
    handleStepLabelChange,
    handleSubmitCreate,
    handleConfirmCreationModal,
    handleCancelCreation,
    handleFeedbackMessageChange,
    handleHistoryFilterChange,
    isCreating,
    isSimplified,
    reminderText,
    selectedActivity,
    setReminderText,
    setTitle,
    stepLabels,
    title,
    activityToCreate,
    modalType,
    handleConfirmCompletionModal,
    activities,
    emptyHistoryMessage,
    historyActivities,
    historyFilter,
    historyListLabel,
    isFeedbackVisible,
    isLoading,
    errorMessage,
    selectedActivityId,
    selectActivity,
    handleCompleteActivity,
    handleCancelCompletion,
    activityToComplete,
  };
}
