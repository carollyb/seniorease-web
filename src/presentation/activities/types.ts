import type { Activity, CreateActivityInput } from '../../domain/activities';

export type ActivityOrganizerMode = 'standard' | 'simplified';

export interface ActivityOrganizerCompleteEventDetail {
  activityId: string;
  title: string;
}

export interface ActivityOrganizerCreateEventDetail {
  activityId: string;
  title: string;
}

export interface ActivityOrganizerProps {
  mode?: ActivityOrganizerMode;
}

export interface GuidedStepsProps {
  activity: Activity;
  isLoading: boolean;
  onActivityComplete?(detail: ActivityOrganizerCompleteEventDetail): void;
  onCompleteActivity(activityId: string): Promise<Activity | void>;
  onFeedbackMessageChange(message: string): void;
}

export interface UseActivityOrganizerOptions {}
