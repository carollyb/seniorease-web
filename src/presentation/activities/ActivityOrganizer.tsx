import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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

const { colors, components } = designTokens;

export function ActivityOrganizer({
  mode = 'standard',
}: ActivityOrganizerProps) {
  const {
    activities,
    completedActivities,
    selectedActivityId,
    isCreating,
    handleSubmitCreate,
    formError,
    setTitle,
    title,
    reminderText,
    setReminderText,
    stepLabels,
    handleAddStep,
    handleStepLabelChange,
    handleShowCreateForm,
    handleCancelCreate,
    selectedActivity,
    setFeedbackMessage,
    handleConfirmCreationModal,
    handleCancelCreation,
    activityToCreate,
    modalType,
    handleConfirmCompletionModal,
    isLoading,
    errorMessage,
    selectActivity,
    handleCompleteActivity,
    handleCancelCompletion,
    activityToComplete,
  } = useActivityOrganizer({});

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
                {stepLabels.map((stepLabel, index) => {
                  const isLastStep = index === stepLabels.length - 1;
                  const canAddStep = isLastStep && Boolean(stepLabel.trim());
                  const fieldLabel =
                    index === 0 ? 'Primeiro passo' : `Passo ${index + 1}`;

                  return (
                    <TextField
                      autoFocus={index > 0 && isLastStep}
                      fullWidth
                      helperText={
                        index === 0
                          ? 'Comece com um passo pequeno e concreto. Use + para adicionar outro.'
                          : 'Descreva o próximo passo. Use + para adicionar outro.'
                      }
                      key={index}
                      label={fieldLabel}
                      onChange={(event) =>
                        handleStepLabelChange(index, event.target.value)
                      }
                      slotProps={{
                        input: {
                          endAdornment: canAddStep ? (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label={`Adicionar passo ${index + 2}`}
                                onClick={() => handleAddStep(index)}
                                sx={{
                                  bgcolor: colors.brandBlue,
                                  color: colors.onPrimary,
                                  height:
                                    components.activityRow.addStepButtonSize,
                                  width:
                                    components.activityRow.addStepButtonSize,
                                  flexShrink: 0,
                                  '&:hover': {
                                    bgcolor: colors.bluePressed,
                                  },
                                }}
                                type='button'
                              >
                                <Typography
                                  aria-hidden='true'
                                  component='span'
                                  lineHeight={1}
                                  variant='h5'
                                >
                                  +
                                </Typography>
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                        },
                      }}
                      value={stepLabel}
                    />
                  );
                })}
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
              description='Clique em Nova tarefa para começar.'
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
                  onOpenActivity={selectActivity}
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
              onActivityComplete={handleConfirmCompletionModal}
              onCompleteActivity={handleCompleteActivity}
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
        activity={
          modalType === 'create' ? activityToCreate : activityToComplete
        }
        isLoading={isLoading}
        onCancel={
          modalType === 'create' ? handleCancelCreation : handleCancelCompletion
        }
        onConfirm={
          modalType === 'create'
            ? handleConfirmCreationModal
            : handleConfirmCompletionModal
        }
      />
    </>
  );
}
