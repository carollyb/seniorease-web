import { useId, useState, type ChangeEvent } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

import type {
  ContrastLevel,
  FontScale,
  NavigationMode,
  SpacingLevel,
  UserPreferences,
} from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'
import { designTokens } from '../../theme/designTokens'

interface PreferenceOption<TValue extends string> {
  value: TValue
  label: string
  accessibleLabel?: string
  compact?: boolean
  emphasized?: boolean
}

const FONT_SCALE_OPTIONS = [
  { value: 'small', label: 'Pequeno', compact: true },
  { value: 'medium', label: 'Médio' },
  { value: 'large', label: 'Grande', emphasized: true },
  { value: 'extraLarge', label: 'Muito grande' },
] satisfies readonly PreferenceOption<FontScale>[]

const CONTRAST_OPTIONS = [
  { value: 'standard', label: 'Padrão' },
  { value: 'high', label: 'Conforto' },
  { value: 'maximum', label: 'Máximo', accessibleLabel: 'Máximo' },
] satisfies readonly PreferenceOption<ContrastLevel>[]

const SPACING_OPTIONS = [
  { value: 'comfortable', label: 'Confortável' },
  { value: 'wide', label: 'Amplo' },
  {
    value: 'extraWide',
    label: 'Extra amplo',
    accessibleLabel: 'Extra amplo',
  },
] satisfies readonly PreferenceOption<SpacingLevel>[]

const { colors, components, rounded, spacing, typography } = designTokens

const hiddenVisually: SxProps<Theme> = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  m: '-1px',
  overflow: 'hidden',
  p: 0,
  position: 'absolute',
  width: '1px',
}

function getOptionLabel<TValue extends string>(
  options: readonly PreferenceOption<TValue>[],
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value
}

interface PreferencePillGroupProps<TValue extends string> {
  helperText: string
  legend: string
  name: string
  onChange(value: TValue): void
  options: readonly PreferenceOption<TValue>[]
  value: TValue
}

function PreferencePillGroup<TValue extends string>({
  helperText,
  legend,
  name,
  onChange,
  options,
  value,
}: PreferencePillGroupProps<TValue>) {
  const labelId = useId()
  const helperId = useId()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as TValue)
  }

  return (
    <FormControl
      aria-labelledby={labelId}
      component="fieldset"
      sx={{
        bgcolor: colors.canvas,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        gap: `${components.card.gap}px`,
        m: 0,
        minWidth: 0,
        overflow: 'hidden',
        p: `${components.card.padding}px`,
        width: '100%',
      }}
    >
      <FormLabel
        component="legend"
        id={labelId}
        sx={{
          color: colors.ink,
          fontSize: typography.h5.fontSize,
          fontWeight: typography.h5.fontWeight,
          lineHeight: typography.h5.lineHeight,
          '&.Mui-focused': {
            color: colors.ink,
          },
        }}
      >
        {legend}
      </FormLabel>
      <RadioGroup
        aria-describedby={helperId}
        aria-labelledby={labelId}
        name={name}
        onChange={handleChange}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: `${spacing.sm}px`,
        }}
        value={value}
      >
        {options.map((option) => {
          const isSelected = option.value === value
          const accessibleLabel = option.accessibleLabel ?? option.label

          return (
            <FormControlLabel
              data-state={isSelected ? 'selected' : 'available'}
              data-testid={`preference-pill-${name}-${option.value}`}
              key={option.value}
              label={option.label}
              sx={{
                m: 0,
                position: 'relative',
                '& .MuiRadio-root': {
                  borderRadius: `${rounded.full}px`,
                  height: '100%',
                  inset: 0,
                  opacity: 0,
                  p: 0,
                  position: 'absolute',
                  width: '100%',
                  zIndex: 1,
                },
                '& .MuiFormControlLabel-label': {
                  bgcolor: isSelected ? colors.brandBlue : colors.surface,
                  borderRadius: `${rounded.full}px`,
                  color: isSelected ? colors.onPrimary : colors.ink,
                  display: 'inline-flex',
                  fontSize: option.emphasized ? 20 : option.compact ? 13 : 14,
                  fontWeight: 500,
                  lineHeight: option.emphasized ? 1.3 : 1.4,
                  px: `${option.emphasized ? 18 : option.compact ? 14 : 16}px`,
                  py: `${option.emphasized ? 12 : option.compact ? 8 : 10}px`,
                  transition: 'background-color 120ms ease, color 120ms ease',
                  whiteSpace: 'nowrap',
                },
                '& .MuiRadio-root.Mui-focusVisible + .MuiFormControlLabel-label':
                  {
                    outline: `3px solid ${colors.brandBlue}`,
                    outlineOffset: 3,
                  },
              }}
              value={option.value}
              control={
                <Radio
                  slotProps={{
                    input: {
                      'aria-label': accessibleLabel,
                    },
                  }}
                />
              }
            />
          )
        })}
      </RadioGroup>
      <Typography id={helperId} sx={hiddenVisually}>
        {helperText}
      </Typography>
    </FormControl>
  )
}

interface SwitchSettingRowProps {
  checked: boolean
  helperText: string
  label: string
  name: string
  onChange(checked: boolean): void
}

interface FigmaPillSwitchProps {
  checked: boolean
  describedBy: string
  id: string
  name: string
  onChange(checked: boolean): void
}

function FigmaPillSwitch({
  checked,
  describedBy,
  id,
  name,
  onChange,
}: FigmaPillSwitchProps) {
  return (
    <Box
      component="span"
      data-size="64x36"
      data-state={checked ? 'on' : 'off'}
      data-testid={`figma-pill-switch-${name}`}
      sx={{
        display: 'inline-flex',
        flex: '0 0 64px',
        height: components.switch.height,
        position: 'relative',
        width: components.switch.width,
        '& input:focus-visible + span': {
          outline: `3px solid ${colors.brandBlue}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        aria-describedby={describedBy}
        checked={checked}
        component="input"
        id={id}
        name={name}
        onChange={(event) => onChange(event.target.checked)}
        role="switch"
        sx={{
          cursor: 'pointer',
          height: '100%',
          inset: 0,
          m: 0,
          opacity: 0,
          position: 'absolute',
          width: '100%',
          zIndex: 1,
        }}
        type="checkbox"
      />
      <Box
        aria-hidden="true"
        component="span"
        sx={{
          bgcolor: checked ? colors.successAccent : colors.hairlineStrong,
          borderRadius: `${rounded.full}px`,
          display: 'block',
          height: components.switch.height,
          position: 'relative',
          transition: 'background-color 120ms ease',
          width: components.switch.width,
          '&::after': {
            bgcolor: colors.canvas,
            borderRadius: `${rounded.full}px`,
            content: '""',
            height: components.switch.thumbSize,
            left: checked
              ? components.switch.width -
                components.switch.thumbSize -
                components.switch.thumbInset
              : components.switch.thumbInset,
            position: 'absolute',
            top: components.switch.thumbInset,
            transition: 'left 120ms ease',
            width: components.switch.thumbSize,
          },
        }}
      />
    </Box>
  )
}

function SwitchSettingRow({
  checked,
  helperText,
  label,
  name,
  onChange,
}: SwitchSettingRowProps) {
  const helperId = useId()
  const switchId = useId()

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 2,
        justifyContent: 'space-between',
        minWidth: 0,
        py: `${spacing.controlY}px`,
      }}
    >
      <Typography
        component="label"
        fontSize={18}
        fontWeight={500}
        htmlFor={switchId}
        lineHeight={1.4}
        sx={{ color: colors.ink, maxWidth: 280 }}
      >
        {label}
      </Typography>
      <FigmaPillSwitch
        checked={checked}
        describedBy={helperId}
        id={switchId}
        name={name}
        onChange={onChange}
      />
      <Typography id={helperId} sx={hiddenVisually}>
        {helperText}
      </Typography>
    </Box>
  )
}

export interface PersonalizationDashboardProps {
  onPreferenceChange?(preferences: UserPreferences): void
}

export function PersonalizationDashboard({
  onPreferenceChange,
}: PersonalizationDashboardProps) {
  const preferences = usePreferenceStore((state) => state.preferences)
  const persistenceWarning = usePreferenceStore(
    (state) => state.persistenceWarning,
  )
  const setPreferences = usePreferenceStore((state) => state.setPreferences)
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Seu layout do SeniorEase continuará assim na próxima vez que você voltar.',
  )

  const savePreferences = (
    nextPreferences: UserPreferences,
    nextFeedbackMessage: string,
  ) => {
    const savedPreferences = setPreferences(nextPreferences)

    setFeedbackMessage(nextFeedbackMessage)
    onPreferenceChange?.(savedPreferences)
  }

  const handleFontScaleChange = (fontScale: FontScale) => {
    savePreferences(
      { ...preferences, fontScale },
      `Preferência salva: tamanho do texto ${getOptionLabel(
        FONT_SCALE_OPTIONS,
        fontScale,
      )}.`,
    )
  }

  const handleContrastChange = (contrastLevel: ContrastLevel) => {
    savePreferences(
      { ...preferences, contrastLevel },
      `Preferência salva: contraste ${getOptionLabel(
        CONTRAST_OPTIONS,
        contrastLevel,
      )}.`,
    )
  }

  const handleSpacingChange = (spacingLevel: SpacingLevel) => {
    savePreferences(
      { ...preferences, spacingLevel },
      `Preferência salva: espaçamento ${getOptionLabel(
        SPACING_OPTIONS,
        spacingLevel,
      )}.`,
    )
  }

  const handleNavigationChange = (navigationMode: NavigationMode) => {
    savePreferences(
      { ...preferences, navigationMode },
      `Preferência salva: navegação simplificada ${
        navigationMode === 'simplified' ? 'ativada' : 'desativada'
      }.`,
    )
  }

  const handleReinforcedFeedbackChange = (reinforcedFeedback: boolean) => {
    savePreferences(
      { ...preferences, reinforcedFeedback },
      `Preferência salva: feedback reforçado ${
        reinforcedFeedback ? 'ativado' : 'desativado'
      }.`,
    )
  }

  const handleExtraConfirmationChange = (extraConfirmation: boolean) => {
    savePreferences(
      { ...preferences, extraConfirmation },
      `Preferência salva: confirmação extra ${
        extraConfirmation ? 'ativada' : 'desativada'
      }.`,
    )
  }

  return (
    <Box
      aria-label="Personalization controls"
      component="section"
      data-figma-node-desktop="703:5"
      data-figma-node-mobile="703:407"
      data-figma-node-tablet="703:305"
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gap: {
              xs: `${spacing.mobilePage}px`,
              md: '18px',
            },
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <PreferencePillGroup
              helperText="Ajusta o tamanho do texto em títulos, botões e conteúdo."
              legend="Tamanho do texto"
              name="fontScale"
              onChange={handleFontScaleChange}
              options={FONT_SCALE_OPTIONS}
              value={preferences.fontScale}
            />
            <PreferencePillGroup
              helperText="Altera o conforto entre blocos da página e controles de toque."
              legend="Conforto do espaçamento"
              name="spacingLevel"
              onChange={handleSpacingChange}
              options={SPACING_OPTIONS}
              value={preferences.spacingLevel}
            />
          </Stack>

          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <PreferencePillGroup
              helperText="Ajusta o contraste entre texto, superfícies e estados da interface."
              legend="Nível de contraste"
              name="contrastLevel"
              onChange={handleContrastChange}
              options={CONTRAST_OPTIONS}
              value={preferences.contrastLevel}
            />

            <Box
              aria-labelledby="interface-mode-title"
              component="section"
              sx={{
                bgcolor: colors.canvas,
                border: `1px solid ${colors.hairline}`,
                borderRadius: `${components.card.radius}px`,
                minWidth: 0,
                overflow: 'hidden',
                p: `${components.card.padding}px`,
                width: '100%',
              }}
            >
              <Stack spacing={2}>
                <Typography
                  component="h2"
                  fontSize={22}
                  fontWeight={600}
                  id="interface-mode-title"
                  lineHeight={1.4}
                  sx={{ color: colors.ink }}
                >
                  Modo da interface
                </Typography>
                <Typography color="text.secondary" variant="body1">
                  O modo simplificado mantém apenas as escolhas essenciais
                  visíveis e facilita encontrar as ações principais.
                </Typography>

                <Box>
                  <SwitchSettingRow
                    checked={preferences.navigationMode === 'simplified'}
                    helperText="Mantém a interface focada nas escolhas essenciais."
                    label="Navegação simplificada"
                    name="navigationMode"
                    onChange={(checked) =>
                      handleNavigationChange(checked ? 'simplified' : 'standard')
                    }
                  />
                  <SwitchSettingRow
                    checked={preferences.reinforcedFeedback}
                    helperText="Mostra confirmações mais claras após salvamentos e conclusões."
                    label="Feedback reforçado"
                    name="reinforcedFeedback"
                    onChange={handleReinforcedFeedbackChange}
                  />
                  <SwitchSettingRow
                    checked={preferences.extraConfirmation}
                    helperText="Pergunta antes de concluir ações importantes."
                    label="Confirmação extra para ações críticas"
                    name="extraConfirmation"
                    onChange={handleExtraConfirmationChange}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {persistenceWarning ? (
          <Box
            role="alert"
            sx={{
              border: 1,
              borderColor: 'warning.main',
              borderRadius: `${rounded.md}px`,
              color: 'text.primary',
              p: 2,
            }}
          >
            <Typography>{persistenceWarning}</Typography>
          </Box>
        ) : null}

        <Box
          aria-atomic="true"
          aria-live="polite"
          role="status"
          sx={{
            bgcolor: preferences.reinforcedFeedback
              ? colors.tealLight
              : 'background.paper',
            border: `1px solid ${colors.hairline}`,
            borderRadius: `${components.card.radius}px`,
            color: colors.ink,
            minHeight: 88,
            p: `${components.card.padding}px`,
          }}
        >
          <Stack spacing={2}>
            <Typography component="h2" fontSize={24} fontWeight={600}>
              Preferências salvas
            </Typography>
            <Typography fontSize={18} lineHeight={1.4}>
              {feedbackMessage}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
