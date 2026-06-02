import type { Activity, CreateActivityInput } from '../../domain/activities'

export type ActivityOrganizerMode = 'standard' | 'simplified'

export interface ActivityOrganizerCompleteEventDetail {
  activityId: string
  title: string
}

export interface ActivityOrganizerCreateEventDetail {
  activityId: string
  title: string
}

export interface ActivityOrganizerProps {
  activities: Activity[]
  completedActivities: Activity[]
  selectedActivityId: string | null
  isLoading?: boolean
  errorMessage?: string | null
  mode?: ActivityOrganizerMode
  onActivityComplete?(detail: ActivityOrganizerCompleteEventDetail): void
  onCompleteActivity(activityId: string): Promise<Activity | void>
  onCreateActivity(input: CreateActivityInput): Promise<Activity | void>
  onSelectActivity(activityId: string | null): void
}

export interface GuidedStepsProps {
  activity: Activity
  isLoading: boolean
  onActivityComplete?(detail: ActivityOrganizerCompleteEventDetail): void
  onCompleteActivity(activityId: string): Promise<Activity | void>
  onFeedbackMessageChange(message: string): void
}

export interface UseActivityOrganizerOptions {
  activities: Activity[]
  selectedActivityId: string | null
  onCreateActivity(input: CreateActivityInput): Promise<Activity | void>
  onSelectActivity(activityId: string | null): void
}
