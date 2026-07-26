import Box from '@mui/material/Box'

import type { Activity } from '../../../domain/activities'
import { designTokens } from '../../../theme/designTokens'
import { ActivityCard } from './ActivityCard'

export interface ActivityListProps {
  activities: Activity[]
  isLoading: boolean
  onOpenActivity(activityId: string): void
  selectedActivityId: string | null
}

const { colors, components } = designTokens

export function ActivityList({
  activities,
  isLoading,
  onOpenActivity,
  selectedActivityId,
}: ActivityListProps) {
  return (
    <Box
      aria-label="Atividades ativas"
      component="ul"
      sx={{
        bgcolor: colors.surfaceSoft,
        border: '1px solid',
        borderColor: colors.hairline,
        borderRadius: `${components.card.radius}px`,
        display: 'grid',
        gap: { xs: 1.5, sm: 2 },
        listStyle: 'none',
        m: 0,
        p: {
          xs: `${designTokens.spacing.md}px`,
          sm: `${components.card.padding}px`,
        },
      }}
    >
      {activities.map((activity) => (
        <Box component="li" key={activity.id}>
          <ActivityCard
            activity={activity}
            isLoading={isLoading}
            isSelected={activity.id === selectedActivityId}
            onOpen={onOpenActivity}
          />
        </Box>
      ))}
    </Box>
  )
}
