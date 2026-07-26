import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { designTokens } from '../../../theme/designTokens';

export interface ReinforcedFeedbackProps {
  reinforcedFeedback: boolean;
  subtitle: string;
  title: string;
}

const { colors, components } = designTokens;

export function ReinforcedFeedback({
  reinforcedFeedback,
  subtitle,
  title,
}: ReinforcedFeedbackProps) {
  if (!reinforcedFeedback) {
    return null;
  }

  return (
    <Box
      aria-atomic='true'
      aria-live='polite'
      role='status'
      sx={{
        bgcolor: colors.tealLight,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        color: colors.ink,
        minHeight: 88,
        p: `${components.card.padding}px`,
      }}
    >
      <Stack spacing={2}>
        <Typography component='h2' fontSize={24} fontWeight={600}>
          {title}
        </Typography>
        <Typography fontSize={18} lineHeight={1.4}>
          {subtitle}
        </Typography>
      </Stack>
    </Box>
  );
}
