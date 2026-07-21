import { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Activity } from '../../../domain/activities';
import { designTokens } from '../../../theme/designTokens';
import { PrimaryButton } from '../../shared/components/PrimaryButton';

export interface CompletionConfirmationDialogProps {
  activity: Activity | null;
  isLoading: boolean;
  onCancel(): void;
  onConfirm(): void;
}

const { colors, components, rounded, spacing, typography } = designTokens;

export function CompletionConfirmationDialog({
  activity,
  isLoading,
  onCancel,
  onConfirm,
}: CompletionConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  return (
    <Dialog
      aria-describedby='completion-confirmation-description'
      aria-labelledby='completion-confirmation-title'
      fullWidth
      maxWidth='xs'
      onClose={handleClose}
      open={activity !== null}
      slotProps={{
        paper: {
          sx: {
            bgcolor: colors.canvas,
            border: '1px solid',
            borderColor: colors.hairline,
            borderRadius: `${rounded.xl}px`,
            boxShadow: '0 20px 60px rgba(5, 0, 56, 0.2)',
            m: `${spacing.mobilePage}px`,
          },
        },
        transition: {
          onEntered: () => cancelButtonRef.current?.focus(),
        },
      }}
    >
      <DialogTitle
        component='h2'
        id='completion-confirmation-title'
        sx={{
          color: colors.ink,
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          lineHeight: typography.h3.lineHeight,
          px: {
            xs: `${spacing.lg}px`,
            sm: `${components.card.padding}px`,
          },
          pb: `${spacing.xs}px`,
          pt: {
            xs: `${spacing.lg}px`,
            sm: `${components.card.padding}px`,
          },
        }}
      >
        Confirmar conclusão
      </DialogTitle>

      <DialogContent
        sx={{
          px: {
            xs: `${spacing.lg}px`,
            sm: `${components.card.padding}px`,
          },
          pb: `${spacing.md}px`,
        }}
      >
        <DialogContentText
          id='completion-confirmation-description'
          sx={{
            color: colors.slate,
            fontSize: typography.body.fontSize,
            lineHeight: typography.body.lineHeight,
            mb: `${spacing.lg}px`,
          }}
        >
          Deseja concluir esta atividade e movê-la para o histórico?
        </DialogContentText>

        {activity ? (
          <Stack
            spacing={1}
            sx={{
              bgcolor: colors.surfaceSoft,
              border: '1px solid',
              borderColor: colors.hairline,
              borderRadius: `${rounded.md}px`,
              p: `${spacing.md}px`,
            }}
          >
            <Typography sx={{ overflowWrap: 'anywhere' }}>
              <Typography component='span' fontWeight={600}>
                Título:
              </Typography>{' '}
              {activity.title}
            </Typography>
            <Typography sx={{ overflowWrap: 'anywhere' }}>
              <Typography component='span' fontWeight={600}>
                Lembrete:
              </Typography>{' '}
              {activity.reminderText ?? 'Sem lembrete definido'}
            </Typography>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions
        sx={{
          alignItems: 'stretch',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: `${spacing.xs}px`,
          justifyContent: 'flex-end',
          px: {
            xs: `${spacing.lg}px`,
            sm: `${components.card.padding}px`,
          },
          pb: {
            xs: `${spacing.lg}px`,
            sm: `${components.card.padding}px`,
          },
          pt: 0,
          '& > :not(style) ~ :not(style)': { ml: 0 },
        }}
      >
        <PrimaryButton
          disabled={isLoading}
          onClick={onCancel}
          ref={cancelButtonRef}
          tone='secondary'
          type='button'
        >
          Cancelar
        </PrimaryButton>
        <PrimaryButton
          disabled={isLoading}
          onClick={onConfirm}
          tone='completion'
          type='button'
        >
          Concluir
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
