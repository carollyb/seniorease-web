import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { designTokens } from '../../theme/designTokens';
import { EmptyState, PrimaryButton, StatusPill } from '../shared';
import {
  ActivityList,
  getActivityReminderLabel,
  getActivityStatusLabel,
  GuidedSteps,
} from './components';
import type { ActivityOrganizerProps } from './types';
import { useActivityOrganizer } from './useActivityOrganizer';
import { ConfirmationDialog } from './components/ConfirmationDialog';

export const activityOrganizerWidgetContract = {
  elementName: 'seniorease-activity-organizer',
  modeAttribute: 'data-mode',
  completeEventName: 'activity-complete',
  createEventName: 'activity-create',
} as const;

const { colors, components, typography } = designTokens;

export function ActivityOrganizer({
  activities,
  completedActivities,
  selectedActivityId,
  errorMessage = null,
  isLoading = false,
  mode = 'standard',
  onActivityComplete,
  onCompleteActivity,
  onCreateActivity,
  onSelectActivity,
}: ActivityOrganizerProps) {
  const {
    isCreating,
    handleSubmitCreate,
    formError,
    setTitle,
    title,
    reminderText,
    setReminderText,
    firstStepLabel,
    setFirstStepLabel,
    handleShowCreateForm,
    handleCancelCreate,
    selectedActivity,
    setFeedbackMessage,
    handleConfirmCreationModal,
    handleCancelCreation,
    activityToCreate,
    modalType,
  } = useActivityOrganizer({
    activities,
    onCreateActivity,
    onSelectActivity,
    selectedActivityId,
  });

  return (
    <>
      <Box
        component='section'
        aria-labelledby='activity-organizer-title'
        data-mode={mode}
      >
        <Stack spacing={3}>
          {errorMessage ? (
            <Box
              role='alert'
              sx={{
                border: 1,
                borderColor: colors.yellowBorder,
                borderRadius: `${components.card.radius}px`,
                bgcolor: colors.yellowSoft,
                p: {
                  xs: `${designTokens.spacing.lg}px`,
                  sm: `${components.card.padding}px`,
                },
              }}
            >
              <Typography>{errorMessage}</Typography>
            </Box>
          ) : null}

          {isCreating ? (
            <Box
              component='form'
              aria-label='Nova tarefa'
              onSubmit={handleSubmitCreate}
              sx={{
                bgcolor: colors.canvas,
                border: '1px solid',
                borderColor: colors.hairline,
                borderRadius: `${components.card.radius}px`,
                p: {
                  xs: `${designTokens.spacing.lg}px`,
                  sm: `${components.card.padding}px`,
                },
              }}
            >
              <Stack spacing={2}>
                <Typography component='h3' variant='h5'>
                  O que você precisa fazer?
                </Typography>
                <TextField
                  error={Boolean(formError)}
                  fullWidth
                  helperText={
                    formError ?? 'Use um título direto e fácil de reconhecer.'
                  }
                  label='Título da tarefa'
                  onChange={(event) => setTitle(event.target.value)}
                  value={title}
                />
                <TextField
                  fullWidth
                  helperText='Exemplo: hoje às 18h, amanhã de manhã.'
                  label='Lembrete em linguagem simples'
                  onChange={(event) => setReminderText(event.target.value)}
                  value={reminderText}
                />
                <TextField
                  fullWidth
                  helperText='Comece com um passo pequeno e concreto.'
                  label='Primeiro passo'
                  onChange={(event) => setFirstStepLabel(event.target.value)}
                  value={firstStepLabel}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <PrimaryButton disabled={isLoading} type='submit'>
                    Salvar tarefa
                  </PrimaryButton>
                  <PrimaryButton
                    disabled={isLoading}
                    onClick={handleCancelCreate}
                    tone='secondary'
                    type='button'
                  >
                    Cancelar
                  </PrimaryButton>
                </Stack>
              </Stack>
            </Box>
          ) : null}

          {activities.length === 0 && !isCreating ? (
            <EmptyState
              action={
                <PrimaryButton
                  disabled={isLoading}
                  onClick={handleShowCreateForm}
                  type='button'
                >
                  Nova tarefa
                </PrimaryButton>
              }
              description='Toque em Nova tarefa para começar.'
              title='Sem tarefas para hoje'
            />
          ) : null}

          {activities.length > 0 ? (
            <Box component='section' aria-labelledby='active-activities-title'>
              <Stack spacing={2}>
                <Stack
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent='space-between'
                  spacing={1}
                >
                  <Typography
                    component='h3'
                    id='active-activities-title'
                    variant='h5'
                  >
                    Tarefas ativas
                  </Typography>
                  {!isCreating ? (
                    <PrimaryButton
                      disabled={isLoading}
                      onClick={handleShowCreateForm}
                      tone='secondary'
                      type='button'
                    >
                      Nova tarefa
                    </PrimaryButton>
                  ) : null}
                </Stack>

                <ActivityList
                  activities={activities}
                  isLoading={isLoading}
                  onOpenActivity={onSelectActivity}
                  selectedActivityId={selectedActivityId}
                />
              </Stack>
            </Box>
          ) : null}

          {selectedActivity ? (
            <GuidedSteps
              activity={selectedActivity}
              isLoading={isLoading}
              key={selectedActivity.id}
              onActivityComplete={onActivityComplete}
              onCompleteActivity={onCompleteActivity}
              onFeedbackMessageChange={setFeedbackMessage}
            />
          ) : null}

          {completedActivities.length > 0 ? (
            <Box
              component='section'
              aria-labelledby='completed-activities-title'
            >
              <Stack spacing={2}>
                <Typography
                  component='h3'
                  id='completed-activities-title'
                  variant='h5'
                >
                  Histórico
                </Typography>
                <Box
                  component='ul'
                  aria-label='Histórico de atividades concluidas'
                  sx={{
                    display: 'grid',
                    gap: 1,
                    listStyle: 'none',
                    m: 0,
                    p: 0,
                  }}
                >
                  {completedActivities.map((activity) => (
                    <Box
                      component='li'
                      key={activity.id}
                      sx={{
                        bgcolor: colors.canvas,
                        border: '1px solid',
                        borderColor: colors.hairline,
                        borderRadius: `${components.activityRow.radius}px`,
                        p: 2,
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography fontWeight={700}>
                          {activity.title}
                        </Typography>
                        <StatusPill
                          compact
                          label={`Status: ${getActivityStatusLabel(
                            activity.status,
                          )}`}
                          tone='success'
                        />
                        <Typography color='text.secondary'>
                          {getActivityReminderLabel(activity)}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box
              component='section'
              aria-labelledby='completed-activities-title'
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
              <Typography
                component='h3'
                id='completed-activities-title'
                variant='h5'
              >
                Histórico
              </Typography>
              <Typography color='text.secondary'>
                Sem itens no histórico.
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
      <ConfirmationDialog
        type={modalType}
        activity={activityToCreate}
        isLoading={isLoading}
        onCancel={handleCancelCreation}
        onConfirm={handleConfirmCreationModal}
      />
    </>
  );
}
