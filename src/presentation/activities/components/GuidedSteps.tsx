import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { GuidedStepsProps } from '../types';

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

  const completedStepCount = activity.steps.filter(
    (step) => step.completed || checkedStepIds[step.id],
  ).length;

  const handleStepChange = (stepId: string, checked: boolean) => {
    setCheckedStepIds((currentStepIds) => ({
      ...currentStepIds,
      [stepId]: checked,
    }));
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
      `Atividade concluida: ${title}. Ela foi movida para o historico.`,
    );
    onActivityComplete?.(detail);
  };

  return (
    <Box
      component='section'
      aria-labelledby='activity-guided-steps-title'
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography
            component='h3'
            id='activity-guided-steps-title'
            variant='h5'
          >
            Passos de {activity.title}
          </Typography>
          <Typography color='text.secondary'>
            {completedStepCount} de {activity.steps.length} passos revisados.
          </Typography>
        </Box>

        {activity.steps.length > 0 ? (
          <Box
            component='ol'
            aria-label={`Passos de ${activity.title}`}
            sx={{
              display: 'grid',
              gap: 1,
              listStylePosition: 'inside',
              m: 0,
              p: 0,
            }}
          >
            {activity.steps.map((step, index) => {
              const label = `Passo ${index + 1} de ${
                activity.steps.length
              }: ${step.label}`;

              return (
                <Box
                  component='li'
                  key={step.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    listStylePosition: 'inside',
                    p: 1.5,
                  }}
                >
                  <Box
                    component='label'
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      checked={
                        step.completed || Boolean(checkedStepIds[step.id])
                      }
                      component='input'
                      disabled={step.completed}
                      onChange={(event) =>
                        handleStepChange(step.id, event.target.checked)
                      }
                      sx={{
                        flex: '0 0 auto',
                        height: 24,
                        width: 24,
                      }}
                      type='checkbox'
                    />
                    <Typography component='span'>{label}</Typography>
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

        <Button
          aria-label={`Concluir atividade ${activity.title}`}
          disabled={isLoading}
          onClick={handleCompleteActivity}
          type='button'
          variant='contained'
        >
          Concluir atividade
        </Button>
      </Stack>
    </Box>
  );
}
