import Chip, { type ChipProps } from '@mui/material/Chip'
import type { SxProps, Theme } from '@mui/material/styles'

import { designTokens } from '../../../theme/designTokens'

export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'danger'

export interface StatusPillProps extends Omit<ChipProps, 'color' | 'label'> {
  compact?: boolean
  label: string
  tone?: StatusPillTone
}

function createBaseSx(compact: boolean): SxProps<Theme> {
  return {
    borderRadius: `${designTokens.components.pill.borderRadius}px`,
    minHeight: compact ? 32 : 36,
    '& .MuiChip-label': {
      px: compact
        ? `${designTokens.components.pill.compactPaddingX}px`
        : `${designTokens.components.pill.paddingX}px`,
      py: compact
        ? `${designTokens.components.pill.compactPaddingY}px`
        : `${designTokens.components.pill.paddingY}px`,
    },
  }
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

function mergeSx(base: SxProps<Theme>[], sx?: SxProps<Theme>): SxProps<Theme> {
  return [
    ...base,
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ] as SxProps<Theme>
}

export function StatusPill({
  compact = false,
  label,
  sx,
  tone = 'neutral',
  ...props
}: StatusPillProps) {
  const sxValue = mergeSx([createBaseSx(compact), toneStyles[tone]], sx)

  return <Chip label={label} sx={sxValue} {...props} />
}
