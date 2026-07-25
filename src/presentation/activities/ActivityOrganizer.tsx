import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { designTokens } from '../../theme/designTokens';
import {
  EmptyState,
  PrimaryButton,
  ReinforcedFeedback,
  StatusPill,
} from '../shared';
import {
  ActivityList,
  getActivityReminderLabel,
  getActivityStatusLabel,
  GuidedSteps,
} from './components';
import type {
  ActivityOrganizerProps,
  HistoryFilter,
} from './types';
import { useActivityOrganizer } from './useActivityOrganizer';
import { ConfirmationDialog } from './components/ConfirmationDialog';

export const activityOrganizerWidgetContract = {
  elementName: 'seniorease-activity-organizer',
  modeAttribute: 'data-mode',
  completeEventName: 'activity-complete',
  createEventName: 'activity-create',
} as const;

const { colors, components } = designTokens;

const HISTORY_FILTER_OPTIONS = [
  { label: 'Concluídas', value: 'completed' },
  { label: 'A Fazer', value: 'pending' },
] satisfies readonly { label: string; value: HistoryFilter }[];

interface HistoryFilterPillsProps {
  onChange(filter: HistoryFilter): void;
  value: HistoryFilter;
}

function HistoryFilterPills({
  onChange,
  value,
}: HistoryFilterPillsProps) {
  return (
    <Box
      aria-label='Filtrar histórico por status'
      role='group'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {HISTORY_FILTER_OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Button
            aria-pressed={isSelected}
            disableRipple
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              bgcolor: colors.surface,
              borderColor: colors.hairlineStrong,
              color: colors.ink,
              px: `${components.pill.paddingX}px`,
              py: `${components.pill.compactPaddingY}px`,
              '&:hover': {
                bgcolor: isSelected ? colors.bluePressed : colors.surfaceSoft,
                borderColor: colors.interactiveBorder,
              },
              '&[aria-pressed="true"]': {
                bgcolor: colors.brandBlue,
                borderColor: colors.brandBlue,
                color: colors.onPrimary,
              },
            }}
            type='button'
            variant='outlined'
          >
            {option.label}
          </Button>
        );
      })}
    </Box>
  );
}

export function ActivityOrganizer({
  mode = 'standard',
}: ActivityOrganizerProps) {
  const {
    activities,
    emptyHistoryMessage,
    handleHistoryFilterChange,
    historyActivities,
    historyFilter,
    historyListLabel,
    isSimplified,
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
    feedbackSubtitle,
    feedbackTitle,
    handleFeedbackMessageChange,
    handleConfirmCreationModal,
    handleCancelCreation,
    activityToCreate,
    modalType,
    handleConfirmCompletionModal,
    isLoading,
    isFeedbackVisible,
    errorMessage,
    selectActivity,
    handleCompleteActivity,
    handleCancelCompletion,
    activityToComplete,
  } = useActivityOrganizer({ mode });

  return (
    <>
      <ReinforcedFeedback
        reinforcedFeedback={isFeedbackVisible}
        subtitle={feedbackSubtitle}
        title={feedbackTitle}
      />
      <Box
        component='section'
        aria-labelledby='activity-organizer-title'
        data-mode={mode}
        sx={{ mt: isFeedbackVisible ? 3 : 0 }}
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
              onFeedbackMessageChange={handleFeedbackMessageChange}
            />
          ) : null}

          <Box
            component='section'
            aria-labelledby='completed-activities-title'
            sx={{
              display: 'grid',
              gap:
                historyActivities.length === 0 ? { xs: 1.5, sm: 2 } : 2,
              ...(historyActivities.length === 0
                ? {
                    bgcolor: colors.surfaceSoft,
                    border: '1px solid',
                    borderColor: colors.hairline,
                    borderRadius: `${components.card.radius}px`,
                    listStyle: 'none',
                    m: 0,
                    p: {
                      xs: `${designTokens.spacing.md}px`,
                      sm: `${components.card.padding}px`,
                    },
                  }
                : {}),
            }}
          >
            <Typography
              component='h3'
              id='completed-activities-title'
              variant='h5'
            >
              Histórico
            </Typography>
            {!isSimplified ? (
              <HistoryFilterPills
                onChange={handleHistoryFilterChange}
                value={historyFilter}
              />
            ) : null}
            {historyActivities.length > 0 ? (
              <Box
                aria-label={historyListLabel}
                component='ul'
                sx={{
                  display: 'grid',
                  gap: 1,
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                }}
              >
                {historyActivities.map((activity) => (
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
                        tone={
                          activity.status === 'pending'
                            ? 'warning'
                            : 'success'
                        }
                      />
                      <Typography color='text.secondary'>
                        {getActivityReminderLabel(activity)}
                      </Typography>
                      {activity.status === 'pending' &&
                      activity.steps.length > 0 ? (
                        <Box
                          aria-label={`Passos de ${activity.title}`}
                          component='ul'
                          sx={{
                            color: colors.slate,
                            display: 'grid',
                            gap: 0.5,
                            listStyleType: 'disc',
                            m: 0,
                            pl: 3,
                          }}
                        >
                          {activity.steps.map((step) => (
                            <Typography component='li' key={step.id}>
                              {step.label}
                            </Typography>
                          ))}
                        </Box>
                      ) : null}
                    </Stack>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color='text.secondary'>
                {emptyHistoryMessage}
              </Typography>
            )}
          </Box>
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
