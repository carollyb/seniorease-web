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

export interface ConfirmationDialogProps {
  type: 'create' | 'complete' | 'delete' | null;
  activity: Activity | null;
  isLoading: boolean;
  onCancel(): void;
  onConfirm(): void;
}

const { colors, components, rounded, spacing, typography } = designTokens;

export function ConfirmationDialog({
  type,
  activity,
  isLoading,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const isCreation = type === 'create';
  const isDeletion = type === 'delete';

  const handleClose = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  return (
    <Dialog
      aria-describedby='confirmation-description'
      aria-labelledby='confirmation-title'
      closeAfterTransition={false}
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
        id='confirmation-title'
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
        {isCreation
          ? 'Confirmar Criação'
          : isDeletion
            ? 'Confirmar Exclusão'
            : 'Confirmar Conclusão'}
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
          id='confirmation-description'
          sx={{
            color: colors.slate,
            fontSize: typography.body.fontSize,
            lineHeight: typography.body.lineHeight,
            mb: `${spacing.lg}px`,
          }}
        >
          {isCreation
            ? 'Deseja criar esta tarefa?'
            : isDeletion
              ? 'Deseja excluir esta tarefa permanentemente? Ela não aparecerá mais na tela nem no histórico.'
              : 'Deseja concluir esta tarefa e movê-la para o histórico?'}
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
          sx={
            isDeletion
              ? {
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }
              : undefined
          }
          tone={isDeletion ? 'primary' : 'completion'}
          type='button'
        >
          {isCreation ? 'Criar' : isDeletion ? 'Excluir' : 'Concluir'}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
