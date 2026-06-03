import { useEffect, useId, useState } from 'react'
import Box from '@mui/material/Box'
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
import { PrimaryButton } from '../shared/components/PrimaryButton'
import { StatusPill } from '../shared/components/StatusPill'

type ProfileSettingsMode = 'profile' | 'settings'

const { colors, components, rounded, spacing, typography } = designTokens

const FONT_SCALE_LABELS: Record<FontScale, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  extraLarge: 'Extra large',
}

const CONTRAST_LABELS: Record<ContrastLevel, string> = {
  standard: 'Standard',
  high: 'High comfort',
  maximum: 'Maximum',
}

const SPACING_LABELS: Record<SpacingLevel, string> = {
  comfortable: 'Comfortable',
  wide: 'Comfortable',
  extraWide: 'Large spacing',
}

const NAVIGATION_LABELS: Record<NavigationMode, string> = {
  simplified: 'Simplified',
  standard: 'Standard',
}

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

function booleanPreferenceLabel(isActive: boolean) {
  return isActive ? 'On' : 'Off'
}

interface PreferenceSummaryRowProps {
  label: string
  value: string
}

function PreferenceSummaryRow({ label, value }: PreferenceSummaryRowProps) {
  return (
    <Box
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 3, md: '56px' },
        minHeight: 64,
        py: `${spacing.sm}px`,
      }}
    >
      <Typography
        component="dt"
        fontSize={18}
        fontWeight={500}
        lineHeight={1.4}
        sx={{ color: colors.ink, flex: { sm: '0 0 260px' } }}
      >
        {label}
      </Typography>
      <Box component="dd" sx={{ m: 0 }}>
        <StatusPill compact label={value} />
      </Box>
    </Box>
  )
}

interface PreferenceSummaryProps {
  preferences: UserPreferences
}

function PreferenceSummary({ preferences }: PreferenceSummaryProps) {
  const summaryItems = [
    {
      label: 'Font size',
      value: FONT_SCALE_LABELS[preferences.fontScale],
    },
    {
      label: 'Contrast',
      value: CONTRAST_LABELS[preferences.contrastLevel],
    },
    {
      label: 'Spacing',
      value: SPACING_LABELS[preferences.spacingLevel],
    },
    {
      label: 'Navigation',
      value: NAVIGATION_LABELS[preferences.navigationMode],
    },
    {
      label: 'Reinforced feedback',
      value: booleanPreferenceLabel(preferences.reinforcedFeedback),
    },
    {
      label: 'Extra confirmations',
      value: booleanPreferenceLabel(preferences.extraConfirmation),
    },
  ]

  return (
    <Box
      aria-labelledby="profile-preferences-title"
      component="section"
      data-node-id="703:225"
      sx={{
        bgcolor: colors.canvas,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        overflow: 'hidden',
        p: { xs: `${spacing.lg}px`, md: '28px' },
        width: '100%',
      }}
    >
      <Typography component="h2" id="profile-preferences-title" sx={hiddenVisually}>
        Profile preferences summary
      </Typography>
      <Box component="dl" sx={{ m: 0 }}>
        {summaryItems.map((item) => (
          <PreferenceSummaryRow
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </Box>
    </Box>
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
  name: string
  onChange(checked: boolean): void
}

function FigmaPillSwitch({
  checked,
  describedBy,
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
      }}
    >
      <Box
        aria-describedby={describedBy}
        checked={checked}
        component="input"
        id={name}
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

  return (
    <Box
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
        display: 'flex',
        gap: 2,
        justifyContent: 'space-between',
        py: `${spacing.controlY}px`,
      }}
    >
      <Typography
        component="label"
        fontSize={18}
        fontWeight={500}
        htmlFor={name}
        lineHeight={1.4}
        sx={{ color: colors.ink, maxWidth: 280 }}
      >
        {label}
      </Typography>
      <FigmaPillSwitch
        checked={checked}
        describedBy={helperId}
        name={name}
        onChange={onChange}
      />
      <Typography id={helperId} sx={hiddenVisually}>
        {helperText}
      </Typography>
    </Box>
  )
}

interface ReminderSettingsProps {
  preferences: UserPreferences
  onLocalFeedback(feedbackMessage: string): void
  onReset(): void
  onSave(preferences: Partial<UserPreferences>, feedbackMessage: string): void
}

function ReminderSettings({
  preferences,
  onLocalFeedback,
  onReset,
  onSave,
}: ReminderSettingsProps) {
  const [showDashboardReminders, setShowDashboardReminders] = useState(true)
  const [keepCompletedHistoryVisible, setKeepCompletedHistoryVisible] =
    useState(true)

  return (
    <Box
      aria-labelledby="reminder-settings-title"
      component="section"
      data-node-id="703:275"
      sx={{
        bgcolor: colors.canvas,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        overflow: 'hidden',
        p: `${components.card.padding}px`,
        width: '100%',
      }}
    >
      <Stack spacing={2}>
        <Typography
          component="h2"
          fontSize={typography.h3.fontSize}
          fontWeight={typography.h3.fontWeight}
          id="reminder-settings-title"
          lineHeight={typography.h3.lineHeight}
          sx={{ color: colors.ink }}
        >
          Reminder preferences
        </Typography>

        <Box>
          <SwitchSettingRow
            checked={preferences.remindersEnabled}
            helperText="Activities show reminders in simple language."
            label="Use plain-language reminders"
            name="remindersEnabled"
            onChange={(enabled) =>
              onSave(
                { remindersEnabled: enabled },
                `Setting saved: plain-language reminders ${
                  enabled ? 'on' : 'off'
                }.`,
              )
            }
          />
          <SwitchSettingRow
            checked={showDashboardReminders}
            helperText="Controls whether reminders appear on the dashboard."
            label="Show reminders on dashboard"
            name="showDashboardReminders"
            onChange={(enabled) => {
              setShowDashboardReminders(enabled)
              onLocalFeedback(
                `Setting saved: dashboard reminders ${enabled ? 'on' : 'off'}.`,
              )
            }}
          />
          <SwitchSettingRow
            checked={preferences.extraConfirmation}
            helperText="SeniorEase asks before deleting activities."
            label="Ask before deleting activities"
            name="extraConfirmation"
            onChange={(enabled) =>
              onSave(
                { extraConfirmation: enabled },
                `Setting saved: delete confirmation ${enabled ? 'on' : 'off'}.`,
              )
            }
          />
          <SwitchSettingRow
            checked={keepCompletedHistoryVisible}
            helperText="Keeps completed activity history visible."
            label="Keep completed history visible"
            name="keepCompletedHistoryVisible"
            onChange={(enabled) => {
              setKeepCompletedHistoryVisible(enabled)
              onLocalFeedback(
                `Setting saved: completed history ${enabled ? 'visible' : 'hidden'}.`,
              )
            }}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <PrimaryButton
            onClick={() => {
              onSave({}, 'Settings saved.')
            }}
          >
            Save settings
          </PrimaryButton>
          <PrimaryButton onClick={onReset} tone="secondary">
            Reset to comfortable defaults
          </PrimaryButton>
        </Stack>
      </Stack>
    </Box>
  )
}

function CriticalActionConcept() {
  return (
    <Box
      aria-labelledby="critical-action-title"
      component="section"
      data-node-id="703:298"
      sx={{
        bgcolor: colors.brandRed,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        color: colors.ink,
        overflow: 'hidden',
        p: `${components.card.padding}px`,
        width: '100%',
      }}
    >
      <Stack alignItems="flex-start" spacing={2}>
        <Typography
          component="h2"
          fontSize={typography.h3.fontSize}
          fontWeight={typography.h3.fontWeight}
          id="critical-action-title"
          lineHeight={typography.h3.lineHeight}
        >
          Confirm before deleting
        </Typography>
        <Typography fontSize={17} lineHeight={1.4}>
          This is a critical action. SeniorEase asks clearly before it removes
          an activity.
        </Typography>
        <PrimaryButton>Keep activity</PrimaryButton>
        <PrimaryButton
          sx={{
            bgcolor: colors.brandRed,
            borderColor: 'transparent',
            color: colors.ink,
            '&:hover': {
              bgcolor: colors.brandRedDark,
              borderColor: 'transparent',
            },
          }}
          tone="secondary"
          variant="text"
        >
          Delete activity
        </PrimaryButton>
      </Stack>
    </Box>
  )
}

export interface ProfileSettingsProps {
  mode: ProfileSettingsMode
  onPreferenceChange?(preferences: UserPreferences): void
}

export function ProfileSettings({
  mode,
  onPreferenceChange,
}: ProfileSettingsProps) {
  const preferences = usePreferenceStore((state) => state.preferences)
  const hasHydrated = usePreferenceStore((state) => state.hasHydrated)
  const persistenceWarning = usePreferenceStore(
    (state) => state.persistenceWarning,
  )
  const hydratePreferences = usePreferenceStore(
    (state) => state.hydratePreferences,
  )
  const resetPreferences = usePreferenceStore(
    (state) => state.resetPreferences,
  )
  const setPreferences = usePreferenceStore((state) => state.setPreferences)
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Settings ready for adjustment.',
  )
  const isSettingsMode = mode === 'settings'

  useEffect(() => {
    if (!hasHydrated) {
      void hydratePreferences()
    }
  }, [hasHydrated, hydratePreferences])

  const savePreferences = (
    partialPreferences: Partial<UserPreferences>,
    nextFeedbackMessage: string,
  ) => {
    const savedPreferences = setPreferences({
      ...usePreferenceStore.getState().preferences,
      ...partialPreferences,
    })

    setFeedbackMessage(nextFeedbackMessage)
    onPreferenceChange?.(savedPreferences)
  }

  const handleReset = () => {
    if (
      preferences.extraConfirmation &&
      typeof window !== 'undefined' &&
      !window.confirm('Reset preferences to comfortable defaults?')
    ) {
      return
    }

    const savedPreferences = resetPreferences()

    setFeedbackMessage('Settings restored to comfortable defaults.')
    onPreferenceChange?.(savedPreferences)
  }

  return (
    <Stack spacing={3}>
      {isSettingsMode ? (
        <>
          <ReminderSettings
            onLocalFeedback={setFeedbackMessage}
            onReset={handleReset}
            onSave={savePreferences}
            preferences={preferences}
          />
          <CriticalActionConcept />
          <Typography
            aria-atomic="true"
            aria-live="polite"
            role="status"
            sx={hiddenVisually}
          >
            {feedbackMessage}
          </Typography>
        </>
      ) : (
        <PreferenceSummary preferences={preferences} />
      )}

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
    </Stack>
  )
}
