import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { designTokens } from '../../../theme/designTokens';
import { PrimaryButton, StatusPill } from '../../shared';
import type { GuidedStepsProps } from '../types';

const { colors, components, typography } = designTokens;

export function GuidedSteps({
  activity,
  isLoading,
  onActivityComplete,
  onCompleteActivity,
  onFeedbackMessageChange,
}: GuidedStepsProps) {
  const [checkedStepIds, setCheckedStepIds] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        activity.steps
          .filter((step) => step.completed)
          .map((step) => [step.id, true]),
      ),
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const completedStepCount = activity.steps.filter(
    (step) => step.completed || checkedStepIds[step.id],
  ).length;
  const stepCount = activity.steps.length;
  const currentStepNumber =
    stepCount > 0 ? Math.min(currentStepIndex + 1, stepCount) : 0;

  const handleStepChange = (stepId: string, checked: boolean) => {
    setCheckedStepIds((currentStepIds) => ({
      ...currentStepIds,
      [stepId]: checked,
    }));
  };

  const handlePreviousStep = () => {
    setCurrentStepIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const handleNextStep = () => {
    setCurrentStepIndex((currentIndex) =>
      Math.min(stepCount - 1, currentIndex + 1),
    );
  };

  const handleCompleteActivity = async () => {
    const completedActivity = await onCompleteActivity(activity.id);

    if (!completedActivity) {
      return;
    }

    const title = completedActivity?.title ?? activity.title;
    const detail = {
      activityId: activity.id,
      title,
    };

    onFeedbackMessageChange(
      `Atividade concluida: ${title}. Ela foi movida para o histórico.`,
    );
    onActivityComplete?.(detail);
  };

  return (
    <Box
      component='section'
      aria-labelledby='activity-guided-steps-title'
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
        <Stack alignItems='flex-start' spacing={1.5}>
          <Typography
            component='h3'
            id='activity-guided-steps-title'
            sx={{
              color: colors.ink,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              lineHeight: typography.h2.lineHeight,
              overflowWrap: 'anywhere',
            }}
          >
            Passos de {activity.title}
          </Typography>
          {stepCount > 0 ? (
            <StatusPill label={`Passo ${currentStepNumber} de ${stepCount}`} />
          ) : null}
          <Typography color='text.secondary'>
            {completedStepCount} de {stepCount} passos revisados.
          </Typography>
        </Stack>

        {activity.steps.length > 0 ? (
          <Box
            component='ol'
            aria-label={`Passos de ${activity.title}`}
            sx={{
              display: 'grid',
              gap: 1.5,
              listStyle: 'none',
              m: 0,
              p: 0,
            }}
          >
            {activity.steps.map((step, index) => {
              const label = `Passo ${index + 1} de ${
                activity.steps.length
              }: ${step.label}`;
              const isChecked =
                step.completed || Boolean(checkedStepIds[step.id]);
              const isCurrent = index === currentStepIndex;

              return (
                <Box
                  component='li'
                  key={step.id}
                  sx={{
                    bgcolor: isCurrent
                      ? components.guidedStep.currentBackgroundColor
                      : components.guidedStep.backgroundColor,
                    border: '1px solid',
                    borderColor: isCurrent
                      ? components.guidedStep.currentBorderColor
                      : colors.hairline,
                    borderRadius: `${components.guidedStep.radius}px`,
                    p: `${components.guidedStep.padding}px`,
                  }}
                >
                  <Box
                    component='label'
                    sx={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: `${components.guidedStep.gap}px`,
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        bgcolor: isChecked
                          ? colors.successAccent
                          : isCurrent
                            ? colors.brandYellow
                            : colors.hairlineSoft,
                        borderRadius: `${designTokens.rounded.full}px`,
                        display: 'flex',
                        flex: '0 0 auto',
                        height: components.guidedStep.iconSize,
                        justifyContent: 'center',
                        width: components.guidedStep.iconSize,
                      }}
                    >
                      <Box
                        aria-label={label}
                        checked={isChecked}
                        component='input'
                        disabled={step.completed}
                        onChange={(event) =>
                          handleStepChange(step.id, event.target.checked)
                        }
                        sx={{
                          accentColor: colors.primary,
                          height: 22,
                          m: 0,
                          width: 22,
                        }}
                        type='checkbox'
                      />
                    </Box>
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                      <Typography
                        component='span'
                        sx={{
                          color: colors.ink,
                          fontSize: 20,
                          fontWeight: 600,
                          lineHeight: 1.4,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        color='text.secondary'
                        component='span'
                        sx={{
                          fontSize: typography.body.fontSize,
                          lineHeight: typography.body.lineHeight,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        Marque este passo quando terminar.
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography>
            Esta atividade ainda nao tem passos detalhados.
          </Typography>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <PrimaryButton
            disabled={isLoading || currentStepIndex === 0}
            onClick={handlePreviousStep}
            tone='secondary'
            type='button'
          >
            Voltar
          </PrimaryButton>
          <PrimaryButton
            disabled={isLoading || currentStepIndex >= stepCount - 1}
            onClick={handleNextStep}
            type='button'
          >
            Próximo passo
          </PrimaryButton>
          <PrimaryButton
            aria-label={`Concluir atividade ${activity.title}`}
            disabled={isLoading}
            onClick={handleCompleteActivity}
            tone='completion'
            type='button'
          >
            Concluir atividade
          </PrimaryButton>
        </Stack>
      </Stack>
    </Box>
  );
}
