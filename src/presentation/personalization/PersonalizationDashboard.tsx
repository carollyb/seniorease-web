import { useId, useState, type ChangeEvent } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import type {
  ContrastLevel,
  FontScale,
  NavigationMode,
  SpacingLevel,
  UserPreferences,
} from '../../domain/preferences/Preference'
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore'

interface PreferenceOption<TValue extends string> {
  value: TValue
  label: string
}

const FONT_SCALE_OPTIONS = [
  { value: 'small', label: 'Pequeno' },
  { value: 'medium', label: 'Medio' },
  { value: 'large', label: 'Grande' },
  { value: 'extraLarge', label: 'Muito grande' },
] satisfies readonly PreferenceOption<FontScale>[]

const CONTRAST_OPTIONS = [
  { value: 'standard', label: 'Contraste padrao' },
  { value: 'high', label: 'Alto' },
  { value: 'maximum', label: 'Maximo' },
] satisfies readonly PreferenceOption<ContrastLevel>[]

const SPACING_OPTIONS = [
  { value: 'comfortable', label: 'Confortavel' },
  { value: 'wide', label: 'Amplo' },
  { value: 'extraWide', label: 'Extra amplo' },
] satisfies readonly PreferenceOption<SpacingLevel>[]

const NAVIGATION_OPTIONS = [
  { value: 'simplified', label: 'Simplificado' },
  { value: 'standard', label: 'Padrao' },
] satisfies readonly PreferenceOption<NavigationMode>[]

function getOptionLabel<TValue extends string>(
  options: readonly PreferenceOption<TValue>[],
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value
}

interface PreferenceRadioGroupProps<TValue extends string> {
  helperText: string
  legend: string
  name: string
  onChange(value: TValue): void
  options: readonly PreferenceOption<TValue>[]
  value: TValue
}

function PreferenceRadioGroup<TValue extends string>({
  helperText,
  legend,
  name,
  onChange,
  options,
  value,
}: PreferenceRadioGroupProps<TValue>) {
  const labelId = useId()
  const helperId = useId()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as TValue)
  }

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" id={labelId}>
        {legend}
      </FormLabel>
      <RadioGroup
        aria-describedby={helperId}
        aria-labelledby={labelId}
        name={name}
        onChange={handleChange}
        value={value}
      >
        {options.map((option) => (
          <FormControlLabel
            control={<Radio />}
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </RadioGroup>
      <FormHelperText id={helperId}>{helperText}</FormHelperText>
    </FormControl>
  )
}

interface PreferenceCheckboxProps {
  checked: boolean
  helperText: string
  label: string
  name: string
  onChange(checked: boolean): void
}

function PreferenceCheckbox({
  checked,
  helperText,
  label,
  name,
  onChange,
}: PreferenceCheckboxProps) {
  const helperId = useId()

  return (
    <FormControl component="fieldset" fullWidth>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              name={name}
              onChange={(event) => onChange(event.target.checked)}
              slotProps={{
                input: {
                  'aria-describedby': helperId,
                },
              }}
            />
          }
          label={label}
        />
      </FormGroup>
      <FormHelperText id={helperId}>{helperText}</FormHelperText>
    </FormControl>
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
    'Preferencias prontas para ajustar.',
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
      `Preferencia salva: tamanho do texto ${getOptionLabel(
        FONT_SCALE_OPTIONS,
        fontScale,
      )}.`,
    )
  }

  const handleContrastChange = (contrastLevel: ContrastLevel) => {
    savePreferences(
      { ...preferences, contrastLevel },
      `Preferencia salva: contraste ${getOptionLabel(
        CONTRAST_OPTIONS,
        contrastLevel,
      )}.`,
    )
  }

  const handleSpacingChange = (spacingLevel: SpacingLevel) => {
    savePreferences(
      { ...preferences, spacingLevel },
      `Preferencia salva: espacamento ${getOptionLabel(
        SPACING_OPTIONS,
        spacingLevel,
      )}.`,
    )
  }

  const handleNavigationChange = (navigationMode: NavigationMode) => {
    savePreferences(
      { ...preferences, navigationMode },
      `Preferencia salva: modo de navegacao ${getOptionLabel(
        NAVIGATION_OPTIONS,
        navigationMode,
      )}.`,
    )
  }

  const handleReinforcedFeedbackChange = (reinforcedFeedback: boolean) => {
    savePreferences(
      { ...preferences, reinforcedFeedback },
      `Preferencia salva: feedback visual reforcado ${
        reinforcedFeedback ? 'ativado' : 'desativado'
      }.`,
    )
  }

  const handleExtraConfirmationChange = (extraConfirmation: boolean) => {
    savePreferences(
      { ...preferences, extraConfirmation },
      `Preferencia salva: confirmacao extra ${
        extraConfirmation ? 'ativada' : 'desativada'
      }.`,
    )
  }

  return (
    <Box component="section" aria-labelledby="personalization-title">
      <Stack spacing={3}>
        <Box>
          <Typography component="h2" id="personalization-title" variant="h4">
            Personalizacao da experiencia
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Ajustes de leitura, contraste, espaco e seguranca.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceRadioGroup
              helperText="Ajusta a leitura em titulos, botoes e textos."
              legend="Tamanho do texto"
              name="fontScale"
              onChange={handleFontScaleChange}
              options={FONT_SCALE_OPTIONS}
              value={preferences.fontScale}
            />
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceRadioGroup
              helperText="Aumenta a diferenca entre texto, fundo e estados."
              legend="Nivel de contraste"
              name="contrastLevel"
              onChange={handleContrastChange}
              options={CONTRAST_OPTIONS}
              value={preferences.contrastLevel}
            />
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceRadioGroup
              helperText="Define o conforto entre blocos e controles de toque."
              legend="Espacamento"
              name="spacingLevel"
              onChange={handleSpacingChange}
              options={SPACING_OPTIONS}
              value={preferences.spacingLevel}
            />
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceRadioGroup
              helperText="Organiza a interface com mais ou menos detalhes."
              legend="Modo de navegacao"
              name="navigationMode"
              onChange={handleNavigationChange}
              options={NAVIGATION_OPTIONS}
              value={preferences.navigationMode}
            />
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceCheckbox
              checked={preferences.reinforcedFeedback}
              helperText="Mostra mensagens de confirmacao mais evidentes."
              label="Feedback visual reforcado"
              name="reinforcedFeedback"
              onChange={handleReinforcedFeedbackChange}
            />
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <PreferenceCheckbox
              checked={preferences.extraConfirmation}
              helperText="Pede revisao antes de apagar ou concluir algo importante."
              label="Confirmacao extra para acoes criticas"
              name="extraConfirmation"
              onChange={handleExtraConfirmationChange}
            />
          </Box>
        </Box>

        {persistenceWarning ? (
          <Box
            role="alert"
            sx={{
              border: 1,
              borderColor: 'warning.main',
              borderRadius: 1,
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
              ? 'success.main'
              : 'background.paper',
            border: preferences.reinforcedFeedback ? 0 : 1,
            borderColor: 'divider',
            borderRadius: 1,
            color: preferences.reinforcedFeedback
              ? 'success.contrastText'
              : 'text.primary',
            minHeight: 56,
            p: 2,
          }}
        >
          <Typography fontWeight={preferences.reinforcedFeedback ? 700 : 400}>
            {feedbackMessage}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}
