import { useEffect } from 'react'
import type { NextPage } from 'next'

import {
  CompleteActivityUseCase,
  CreateActivityUseCase,
  ListActivitiesUseCase,
  ListCompletedActivitiesUseCase,
} from '../application/activities'
import { LocalActivityRepository } from '../infrastructure/repositories'
import { ActivityOrganizer } from '../presentation/activities'
import { AppShell } from '../presentation/shared'
import { createActivityStore } from '../stores/activities'
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore'

const activityRepository = new LocalActivityRepository()

const useActivityStore = createActivityStore({
  completeActivity: new CompleteActivityUseCase(activityRepository),
  createActivity: new CreateActivityUseCase(activityRepository),
  listActivities: new ListActivitiesUseCase(activityRepository),
  listCompletedActivities: new ListCompletedActivitiesUseCase(
    activityRepository,
  ),
})

const completionConfirmationMessage =
  'Concluir esta atividade e mover para o historico?'

const ActivitiesPage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences)
  const activities = useActivityStore((state) => state.activities)
  const completedActivities = useActivityStore(
    (state) => state.completedActivities,
  )
  const selectedActivityId = useActivityStore((state) => state.selectedActivityId)
  const isLoading = useActivityStore((state) => state.isLoading)
  const errorMessage = useActivityStore((state) => state.errorMessage)
  const loadActivities = useActivityStore((state) => state.loadActivities)
  const createActivity = useActivityStore((state) => state.createActivity)
  const completeActivity = useActivityStore((state) => state.completeActivity)
  const selectActivity = useActivityStore((state) => state.selectActivity)

  useEffect(() => {
    void loadActivities()
  }, [loadActivities])

  const handleCompleteActivity = async (activityId: string) => {
    if (
      preferences.extraConfirmation &&
      typeof window !== 'undefined' &&
      !window.confirm(completionConfirmationMessage)
    ) {
      return undefined
    }

    return completeActivity(activityId)
  }

  return (
    <AppShell
      activeRoute="/atividades"
      navigationMode={preferences.navigationMode}
      subtitle="Crie uma atividade, siga os passos e acompanhe o historico."
      title="Atividades"
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
    </AppShell>
  )
}

export default ActivitiesPage
