import Button, { type ButtonProps } from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'

import { designTokens } from '../../../theme/designTokens'

export type PrimaryButtonTone = 'primary' | 'secondary' | 'completion'

export interface PrimaryButtonProps extends ButtonProps {
  tone?: PrimaryButtonTone
}

const baseSx: SxProps<Theme> = {
  borderRadius: `${designTokens.components.button.borderRadius}px`,
  px: `${designTokens.components.button.paddingX}px`,
  py: `${designTokens.components.button.paddingY}px`,
}

const toneSx: Record<PrimaryButtonTone, SxProps<Theme>> = {
  primary: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': {
      bgcolor: designTokens.colors.primaryHover,
    },
  },
  secondary: {
    bgcolor: 'background.paper',
    border: `1px solid ${designTokens.colors.hairlineStrong}`,
    boxShadow: 'none',
    color: 'text.primary',
    '&:hover': {
      bgcolor: designTokens.colors.secondaryHover,
      borderColor: designTokens.colors.hairlineStrong,
      boxShadow: 'none',
    },
  },
  completion: {
    bgcolor: 'warning.main',
    color: 'warning.contrastText',
    '&:hover': {
      bgcolor: designTokens.colors.completionHover,
    },
  },
}

function mergeSx(base: SxProps<Theme>[], sx?: SxProps<Theme>): SxProps<Theme> {
  return [
    ...base,
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ] as SxProps<Theme>
}

export function PrimaryButton({
  sx,
  tone = 'primary',
  variant = 'contained',
  ...props
}: PrimaryButtonProps) {
  const sxValue = mergeSx([baseSx, toneSx[tone]], sx)

  return <Button sx={sxValue} variant={variant} {...props} />
}
