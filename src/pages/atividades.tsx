import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';

import {
  CompleteActivityUseCase,
  CreateActivityUseCase,
  ListActivitiesUseCase,
  ListCompletedActivitiesUseCase,
} from '../application/activities';
import type { Activity } from '../domain/activities';
import { LocalActivityRepository } from '../infrastructure/repositories';
import { ActivityOrganizer } from '../presentation/activities';
import { CompletionConfirmationDialog } from '../presentation/activities/components/CompletionConfirmationDialog';
import { AppShell } from '../presentation/shared';
import { createActivityStore } from '../stores/activities';
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore';

const activityRepository = new LocalActivityRepository();

const useActivityStore = createActivityStore({
  completeActivity: new CompleteActivityUseCase(activityRepository),
  createActivity: new CreateActivityUseCase(activityRepository),
  listActivities: new ListActivitiesUseCase(activityRepository),
  listCompletedActivities: new ListCompletedActivitiesUseCase(
    activityRepository,
  ),
});

interface PendingCompletion {
  activityId: string;
  resolve(completedActivity: Activity | void): void;
}

const ActivitiesPage: NextPage = () => {
  const pendingCompletionRef = useRef<PendingCompletion | null>(null);
  const [activityToComplete, setActivityToComplete] = useState<Activity | null>(
    null,
  );
  const preferences = usePreferenceStore((state) => state.preferences);
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
  const completeActivity = useActivityStore((state) => state.completeActivity);
  const selectActivity = useActivityStore((state) => state.selectActivity);

  useEffect(() => {
    void loadActivities();

    return () => {
      pendingCompletionRef.current?.resolve(undefined);
      pendingCompletionRef.current = null;
    };
  }, [loadActivities]);

  const handleCompleteActivity = (activityId: string) => {
    if (!preferences.extraConfirmation) {
      return completeActivity(activityId);
    }

    const activity = activities.find(({ id }) => id === activityId);

    if (!activity) {
      return Promise.resolve(undefined);
    }

    return new Promise<Activity | void>((resolve) => {
      pendingCompletionRef.current = { activityId, resolve };
      setActivityToComplete(activity);
    });
  };

  const handleCancelCompletion = () => {
    const pendingCompletion = pendingCompletionRef.current;

    pendingCompletionRef.current = null;
    setActivityToComplete(null);
    pendingCompletion?.resolve(undefined);
  };

  const handleConfirmCompletion = async () => {
    const pendingCompletion = pendingCompletionRef.current;

    if (!pendingCompletion) {
      return;
    }

    const completedActivity = await completeActivity(
      pendingCompletion.activityId,
    );

    pendingCompletionRef.current = null;
    setActivityToComplete(null);
    pendingCompletion.resolve(completedActivity);
  };

  return (
    <AppShell
      activeRoute='/atividades'
      navigationMode={preferences.navigationMode}
      title='Hoje'
    >
      <ActivityOrganizer
        activities={activities}
        completedActivities={completedActivities}
        errorMessage={errorMessage}
        isLoading={isLoading}
        mode={preferences.navigationMode}
        onCompleteActivity={handleCompleteActivity}
        onCreateActivity={createActivity}
        onSelectActivity={selectActivity}
        selectedActivityId={selectedActivityId}
      />
      <CompletionConfirmationDialog
        activity={activityToComplete}
        isLoading={isLoading}
        onCancel={handleCancelCompletion}
        onConfirm={handleConfirmCompletion}
      />
    </AppShell>
  );
};

export default ActivitiesPage;
