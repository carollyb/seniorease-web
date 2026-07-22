import { useRef, useState, type FormEvent } from 'react';

import {
  createActivity,
  type Activity,
  type CreateActivityInput,
} from '../../domain/activities';
import type { UseActivityOrganizerOptions } from './types';

interface PendingCompletion {
  activityId: string;
  resolve(completedActivity: Activity | void): void;
}

export function useActivityOrganizer({
  activities,
  selectedActivityId,
  onCreateActivity,
  onSelectActivity,
}: UseActivityOrganizerOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [reminderText, setReminderText] = useState('');
  const [firstStepLabel, setFirstStepLabel] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Organizador pronto para novas atividades.',
  );
  const [activityToCreate, setActivityToCreate] = useState<Activity | null>(
    null,
  );
  const [modalType, setModalType] = useState<'create' | 'complete' | null>(
    null,
  );

  const selectedActivity = selectedActivityId
    ? (activities.find((activity) => activity.id === selectedActivityId) ??
      null)
    : null;

  const handleShowCreateForm = () => {
    setIsCreating(true);
    setFormError(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setFormError(null);
    setTitle('');
    setReminderText('');
    setFirstStepLabel('');
  };
  const pendingCompletionRef = useRef<PendingCompletion | null>(null);

  const handleCancelCreation = () => {
    const pendingCompletion = pendingCompletionRef.current;

    pendingCompletionRef.current = null;
    setActivityToCreate(null);

    pendingCompletion?.resolve(undefined);
  };

  const handleConfirmCreationModal = async () => {
    try {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setFormError('Informe um título claro para a tarefa.');
        return;
      }
      const input: CreateActivityInput = {
        title: trimmedTitle,
      };
      const createActivityResult = onCreateActivity(input);

      setFeedbackMessage(`Tarefa criada: ${trimmedTitle}.`);

      const createdActivity = await createActivityResult;
      const createdTitle = createdActivity?.title ?? trimmedTitle;

      setTitle('');
      setReminderText('');
      setFirstStepLabel('');
      setFormError(null);
      setIsCreating(false);
      setFeedbackMessage(`Tarefa criada: ${createdTitle}.`);

      if (createdActivity) {
        onSelectActivity(createdActivity.id);
      }
      setActivityToCreate(null);
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
    const trimmedFirstStepLabel = firstStepLabel.trim();

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

    if (trimmedFirstStepLabel) {
      input.steps = [{ label: trimmedFirstStepLabel }];
    }
    const createActivityResult = createActivity(input);

    setModalType('create');
    setActivityToCreate(createActivityResult || null);
  };

  return {
    feedbackMessage,
    firstStepLabel,
    formError,
    handleCancelCreate,
    handleShowCreateForm,
    handleSubmitCreate,
    handleConfirmCreationModal,
    handleCancelCreation,
    isCreating,
    reminderText,
    selectedActivity,
    setFeedbackMessage,
    setFirstStepLabel,
    setReminderText,
    setTitle,
    title,
    activityToCreate,
    modalType,
  };
}
