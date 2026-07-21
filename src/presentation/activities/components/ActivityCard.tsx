import { useId } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Activity, ActivityStatus } from '../../../domain/activities';
import { designTokens } from '../../../theme/designTokens';
import { PrimaryButton, StatusPill } from '../../shared';

export interface ActivityCardProps {
  activity: Activity;
  isLoading: boolean;
  isSelected: boolean;
  onOpen(activityId: string): void;
}

const STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: 'Pendente',
  inProgress: 'Em andamento',
  completed: 'Concluída',
};

const { colors, components, typography } = designTokens;

export function getActivityStatusLabel(status: ActivityStatus): string {
  return STATUS_LABELS[status];
}

export function getActivityReminderLabel(activity: Activity): string {
  return activity.reminderText
    ? `Lembrete: ${activity.reminderText}`
    : 'Sem lembrete cadastrado';
}

export function ActivityCard({
  activity,
  isLoading,
  isSelected,
  onOpen,
}: ActivityCardProps) {
  const titleId = useId();
  const statusLabel = getActivityStatusLabel(activity.status);

  return (
    <Box
      aria-labelledby={titleId}
      component='article'
      sx={{
        bgcolor: colors.canvas,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : colors.hairline,
        borderRadius: `${components.activityRow.radius}px`,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: {
          xs: `${components.activityRow.gapMobile}px`,
          sm: `${designTokens.spacing.sm}px`,
        },
        justifyContent: 'space-between',
        minHeight: { xs: 131, sm: components.activityRow.heightDesktop },
        p: {
          xs: `${components.activityRow.paddingMobile}px`,
          sm: `${components.activityRow.paddingDesktop}px`,
        },
        width: '100%',
      }}
    >
      <Stack
        spacing={{ xs: 0.5, sm: 0.75 }}
        sx={{
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        <Typography
          component='h4'
          id={titleId}
          sx={{
            color: colors.ink,
            fontSize: {
              xs: typography.mobileActivityTitle.fontSize,
              sm: typography.h5.fontSize,
            },
            fontWeight: typography.h5.fontWeight,
            lineHeight: typography.h5.lineHeight,
            overflowWrap: 'anywhere',
          }}
        >
          {activity.title}
        </Typography>
        <Typography
          sx={{
            color: colors.slate,
            fontSize: {
              xs: typography.mobileActivityMeta.fontSize,
              sm: typography.bodySmall.fontSize,
            },
            lineHeight: typography.bodySmall.lineHeight,
            overflowWrap: 'anywhere',
          }}
        >
          {getActivityReminderLabel(activity)}
        </Typography>
      </Stack>

      <Stack
        alignItems='center'
        direction='row'
        spacing={{ xs: 1, sm: 1.5 }}
        sx={{
          flexShrink: 0,
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <StatusPill
          compact
          label={`Status: ${statusLabel}`}
          sx={{
            minHeight: { xs: 31, sm: 38 },
            '& .MuiChip-label': {
              fontSize: {
                xs: typography.mobileActivityMeta.fontSize,
                sm: typography.caption.fontSize,
              },
              px: {
                xs: `${components.pill.compactPaddingX}px`,
                sm: `${components.pill.paddingX}px`,
              },
              py: {
                xs: `${components.pill.compactPaddingY}px`,
                sm: `${components.pill.paddingY}px`,
              },
            },
          }}
        />
        <PrimaryButton
          aria-label={`Abrir atividade ${activity.title}`}
          disabled={isLoading}
          onClick={() => onOpen(activity.id)}
          sx={{
            minWidth: { xs: 61, sm: 'auto' },
            px: { xs: 2, sm: `${components.button.paddingX}px` },
          }}
          type='button'
        >
          Abrir
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
