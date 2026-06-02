import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { Activity, ActivityStatus } from '../../domain/activities';
import { GuidedSteps } from './components/GuidedSteps';
import type { ActivityOrganizerProps } from './types';
import { useActivityOrganizer } from './useActivityOrganizer';

export const activityOrganizerWidgetContract = {
  elementName: 'seniorease-activity-organizer',
  modeAttribute: 'data-mode',
  completeEventName: 'activity-complete',
  createEventName: 'activity-create',
} as const;

const STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: 'Pendente',
  inProgress: 'Em andamento',
  completed: 'Concluida',
};

function getStatusLabel(status: ActivityStatus): string {
  return STATUS_LABELS[status];
}

function getReminderLabel(activity: Activity): string {
  return activity.reminderText
    ? `Lembrete: ${activity.reminderText}`
    : 'Sem lembrete cadastrado';
}

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
              borderColor: 'warning.main',
              borderRadius: 1,
              p: 2,
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
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
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
                <Button disabled={isLoading} type='submit' variant='contained'>
                  Salvar atividade
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleCancelCreate}
                  type='button'
                  variant='outlined'
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : null}

        {activities.length === 0 && !isCreating ? (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack spacing={2}>
              <Typography component='h3' variant='h5'>
                Nenhuma atividade por enquanto.
              </Typography>
              <Typography color='text.secondary'>
                Comece com uma atividade simples e um primeiro passo.
              </Typography>
              <Button
                disabled={isLoading}
                onClick={handleShowCreateForm}
                type='button'
                variant='contained'
              >
                Criar atividade
              </Button>
            </Stack>
          </Box>
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
                  <Button
                    disabled={isLoading}
                    onClick={handleShowCreateForm}
                    type='button'
                    variant='outlined'
                  >
                    Criar atividade
                  </Button>
                ) : null}
              </Stack>

              <Box
                component='ul'
                aria-label='Atividades ativas'
                sx={{
                  display: 'grid',
                  gap: 2,
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                }}
              >
                {activities.map((activity) => (
                  <Box
                    component='li'
                    key={activity.id}
                    sx={{
                      border: 1,
                      borderColor:
                        activity.id === selectedActivityId
                          ? 'primary.main'
                          : 'divider',
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography component='h4' variant='h6'>
                          {activity.title}
                        </Typography>
                        <Typography color='text.secondary'>
                          {getReminderLabel(activity)}
                        </Typography>
                        <Typography>
                          Status: {getStatusLabel(activity.status)}
                        </Typography>
                      </Box>
                      <Button
                        aria-label={`Abrir atividade ${activity.title}`}
                        disabled={isLoading}
                        onClick={() => onSelectActivity(activity.id)}
                        type='button'
                        variant={
                          activity.id === selectedActivityId
                            ? 'contained'
                            : 'outlined'
                        }
                      >
                        Abrir atividade
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
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
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
                    <Typography fontWeight={700}>{activity.title}</Typography>
                    <Typography color='text.secondary'>
                      Status: {getStatusLabel(activity.status)}
                    </Typography>
                    <Typography color='text.secondary'>
                      {getReminderLabel(activity)}
                    </Typography>
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
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            minHeight: 56,
            p: 2,
          }}
        >
          <Typography>{feedbackMessage}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
