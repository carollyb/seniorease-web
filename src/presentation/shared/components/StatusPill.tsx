import Chip, { type ChipProps } from '@mui/material/Chip'
import type { SxProps, Theme } from '@mui/material/styles'

import { designTokens } from '../../../theme/designTokens'

export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'danger'

export interface StatusPillProps extends Omit<ChipProps, 'color' | 'label'> {
  label: string
  tone?: StatusPillTone
}

const toneStyles: Record<StatusPillTone, SxProps<Theme>> = {
  neutral: {
    bgcolor: designTokens.colors.yellowLight,
    color: designTokens.colors.ink,
  },
  success: {
    bgcolor: designTokens.colors.tealLight,
    color: designTokens.colors.mossDark,
  },
  warning: {
    bgcolor: designTokens.colors.yellowSoft,
    color: designTokens.colors.yellowDark,
  },
  danger: {
    bgcolor: designTokens.colors.brandRed,
    color: designTokens.colors.coralDark,
  },
}

export function StatusPill({
  label,
  sx,
  tone = 'neutral',
  ...props
}: StatusPillProps) {
  const sxValue = Array.isArray(sx)
    ? [toneStyles[tone], ...sx]
    : [toneStyles[tone], sx]

  return <Chip label={label} sx={sxValue} {...props} />
}
