import Button, { type ButtonProps } from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'

import { designTokens } from '../../../theme/designTokens'

const baseSx: SxProps<Theme> = {
  borderRadius: `${designTokens.components.button.borderRadius}px`,
  minHeight: designTokens.components.button.minHeight,
  px: `${designTokens.components.button.paddingX}px`,
  py: `${designTokens.components.button.paddingY}px`,
}

export function PrimaryButton({
  sx,
  variant = 'contained',
  ...props
}: ButtonProps) {
  const sxValue = Array.isArray(sx) ? [baseSx, ...sx] : [baseSx, sx]

  return <Button sx={sxValue} variant={variant} {...props} />
}
