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
    feedbackMessage,
    setFeedbackMessage,
  } = useActivityOrganizer({
    activities,
    onCreateActivity,
    onSelectActivity,
    selectedActivityId,
  });

  return (
    <Box
      component='section'
      aria-labelledby='activity-organizer-title'
      data-mode={mode}
    >
      <Stack spacing={3}>
        <Box>
          <Typography component='h2' id='activity-organizer-title' variant='h4'>
            Organizador de atividades
          </Typography>
          <Typography color='text.secondary'>
            Crie, siga os passos e veja o historico concluido.
          </Typography>
        </Box>

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
            aria-label='Nova atividade'
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
                Nova atividade
              </Typography>
              <TextField
                error={Boolean(formError)}
                fullWidth
                helperText={
                  formError ?? 'Use um titulo direto e facil de reconhecer.'
                }
                label='Titulo da atividade'
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
              <TextField
                fullWidth
                helperText='Exemplo: hoje as 18h, amanha de manha.'
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
                  Salvar atividade
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
                Criar atividade
              </PrimaryButton>
            }
            description='Comece com uma atividade simples e um primeiro passo.'
            title='Nenhuma atividade por enquanto.'
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
                  Atividades ativas
                </Typography>
                {!isCreating ? (
                  <PrimaryButton
                    disabled={isLoading}
                    onClick={handleShowCreateForm}
                    tone='secondary'
                    type='button'
                  >
                    Criar atividade
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
          <Box component='section' aria-labelledby='completed-activities-title'>
            <Stack spacing={2}>
              <Typography
                component='h3'
                id='completed-activities-title'
                variant='h5'
              >
                Historico concluido
              </Typography>
              <Box
                component='ul'
                aria-label='Historico de atividades concluidas'
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
                      <Typography fontWeight={700}>{activity.title}</Typography>
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
        ) : null}

        <Box
          aria-atomic='true'
          aria-live='polite'
          role='status'
          sx={{
            bgcolor: colors.tealLight,
            border: '1px solid',
            borderColor: colors.hairline,
            borderRadius: `${components.card.radius}px`,
            color: colors.ink,
            minHeight: 56,
            p: {
              xs: `${designTokens.spacing.lg}px`,
              sm: `${components.card.padding}px`,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
            }}
          >
            {feedbackMessage}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
