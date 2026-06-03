import { useId, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { designTokens } from '../../../theme/designTokens'

export interface EmptyStateProps {
  action?: ReactNode
  description?: string
  title: string
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  const titleId = useId()

  return (
    <Box
      aria-labelledby={titleId}
      component="section"
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: `${designTokens.components.card.radius}px`,
        p: {
          xs: `${designTokens.spacing.lg}px`,
          sm: `${designTokens.components.card.padding}px`,
        },
      }}
    >
      <Stack alignItems="flex-start" spacing={2}>
        <Typography component="h2" id={titleId} variant="h4">
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary">{description}</Typography>
        ) : null}
        {action}
      </Stack>
    </Box>
  )
}
