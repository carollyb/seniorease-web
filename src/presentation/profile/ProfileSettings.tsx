import { useEffect, useId, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

import type {
  ContrastLevel,
  FontScale,
  NavigationMode,
  SpacingLevel,
  UserPreferences,
} from '../../domain/preferences/Preference';
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore';
import { designTokens } from '../../theme/designTokens';
import { PrimaryButton } from '../shared/components/PrimaryButton';
import { StatusPill } from '../shared/components/StatusPill';

type ProfileSettingsMode = 'profile' | 'settings';

const { colors, components, rounded, spacing, typography } = designTokens;

const FONT_SCALE_LABELS: Record<FontScale, string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
  extraLarge: 'Muito grande',
};

const CONTRAST_LABELS: Record<ContrastLevel, string> = {
  standard: 'Padrão',
  high: 'Alto conforto',
  maximum: 'Alto',
};

const SPACING_LABELS: Record<SpacingLevel, string> = {
  comfortable: 'Confortável',
  wide: 'Amplo',
  extraWide: 'Extra amplo',
};

const NAVIGATION_LABELS: Record<NavigationMode, string> = {
  simplified: 'Simplificada',
  standard: 'Padrão',
};

const hiddenVisually: SxProps<Theme> = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  m: '-1px',
  overflow: 'hidden',
  p: 0,
  position: 'absolute',
  width: '1px',
};

function booleanPreferenceLabel(isActive: boolean) {
  return isActive ? 'Ativo' : 'Inativo';
}

interface PreferenceSummaryRowProps {
  label: string;
  value: string;
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
        component='dt'
        fontSize={18}
        fontWeight={500}
        lineHeight={1.4}
        sx={{ color: colors.ink, flex: { sm: '0 0 260px' } }}
      >
        {label}
      </Typography>
      <Box component='dd' sx={{ m: 0 }}>
        <StatusPill compact label={value} />
      </Box>
    </Box>
  );
}

interface PreferenceSummaryProps {
  preferences: UserPreferences;
}

function PreferenceSummary({ preferences }: PreferenceSummaryProps) {
  const summaryItems = [
    {
      label: 'Tamanho do texto',
      value: FONT_SCALE_LABELS[preferences.fontScale],
    },
    {
      label: 'Contraste',
      value: CONTRAST_LABELS[preferences.contrastLevel],
    },
    {
      label: 'Espaçamento',
      value: SPACING_LABELS[preferences.spacingLevel],
    },
    {
      label: 'Navegação',
      value: NAVIGATION_LABELS[preferences.navigationMode],
    },
    {
      label: 'Feedback reforçado',
      value: booleanPreferenceLabel(preferences.reinforcedFeedback),
    },
    {
      label: 'Confirmações extras',
      value: booleanPreferenceLabel(preferences.extraConfirmation),
    },
  ];

  return (
    <Box
      aria-labelledby='profile-preferences-title'
      component='section'
      data-node-id='703:225'
      sx={{
        bgcolor: colors.canvas,
        border: `1px solid ${colors.hairline}`,
        borderRadius: `${components.card.radius}px`,
        overflow: 'hidden',
        p: { xs: `${spacing.lg}px`, md: '28px' },
        width: '100%',
      }}
    >
      <Typography
        component='h2'
        id='profile-preferences-title'
        sx={hiddenVisually}
      >
        Resumo das preferências do perfil
      </Typography>
      <Box component='dl' sx={{ m: 0 }}>
        {summaryItems.map((item) => (
          <PreferenceSummaryRow
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </Box>
    </Box>
  );
}

interface SwitchSettingRowProps {
  checked: boolean;
  helperText: string;
  label: string;
  name: string;
  onChange(checked: boolean): void;
}

interface FigmaPillSwitchProps {
  checked: boolean;
  describedBy: string;
  name: string;
  onChange(checked: boolean): void;
}

function FigmaPillSwitch({
  checked,
  describedBy,
  name,
  onChange,
}: FigmaPillSwitchProps) {
  return (
    <Box
      component='span'
      data-size='64x36'
      data-state={checked ? 'on' : 'off'}
      data-testid={`figma-pill-switch-${name}`}
      sx={{
        display: 'inline-flex',
        flex: '0 0 64px',
        height: components.switch.height,
        position: 'relative',
        width: components.switch.width,
        '& input:focus-visible + span': {
          boxShadow: `0 0 0 6px ${colors.focusHalo}`,
          outline: `3px solid ${colors.focus}`,
          outlineOffset: 3,
        },
        '&:hover span': {
          boxShadow: `inset 0 0 0 2px ${colors.interactiveBorder}`,
        },
      }}
    >
      <Box
        aria-describedby={describedBy}
        checked={checked}
        component='input'
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.checked)}
        role='switch'
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
        type='checkbox'
      />
      <Box
        aria-hidden='true'
        component='span'
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
  );
}

function SwitchSettingRow({
  checked,
  helperText,
  label,
  name,
  onChange,
}: SwitchSettingRowProps) {
  const helperId = useId();

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
        component='label'
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
  );
}

interface ReminderSettingsProps {
  preferences: UserPreferences;
  onLocalFeedback(feedbackMessage: string): void;
  onReset(): void;
  onSave(preferences: Partial<UserPreferences>, feedbackMessage: string): void;
}

function ReminderSettings({
  preferences,
  onLocalFeedback,
  onReset,
  onSave,
}: ReminderSettingsProps) {
  const [showDashboardReminders, setShowDashboardReminders] = useState(true);
  const [keepCompletedHistoryVisible, setKeepCompletedHistoryVisible] =
    useState(true);

  return (
    <Box
      aria-labelledby='reminder-settings-title'
      component='section'
      data-node-id='703:275'
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
          component='h2'
          fontSize={typography.h3.fontSize}
          fontWeight={typography.h3.fontWeight}
          id='reminder-settings-title'
          lineHeight={typography.h3.lineHeight}
          sx={{ color: colors.ink }}
        >
          Preferências de lembrete
        </Typography>

        <Box>
          <SwitchSettingRow
            checked={preferences.remindersEnabled}
            helperText='As atividades mostram lembretes em linguagem simples.'
            label='Usar lembretes em linguagem simples'
            name='remindersEnabled'
            onChange={(enabled) =>
              onSave(
                { remindersEnabled: enabled },
                `Configuração salva: lembretes em linguagem simples ${
                  enabled ? 'ativados' : 'desativados'
                }.`,
              )
            }
          />
          <SwitchSettingRow
            checked={showDashboardReminders}
            helperText='Controla se os lembretes aparecem no painel.'
            label='Mostrar lembretes no painel'
            name='showDashboardReminders'
            onChange={(enabled) => {
              setShowDashboardReminders(enabled);
              onLocalFeedback(
                `Configuração salva: lembretes no painel ${
                  enabled ? 'ativados' : 'desativados'
                }.`,
              );
            }}
          />
          <SwitchSettingRow
            checked={preferences.extraConfirmation}
            helperText='O SeniorEase pergunta antes de excluir atividades.'
            label='Perguntar antes de excluir atividades'
            name='extraConfirmation'
            onChange={(enabled) =>
              onSave(
                { extraConfirmation: enabled },
                `Configuração salva: confirmação de exclusão ${
                  enabled ? 'ativada' : 'desativada'
                }.`,
              )
            }
          />
          <SwitchSettingRow
            checked={keepCompletedHistoryVisible}
            helperText='Mantém o histórico de atividades concluídas visível.'
            label='Manter histórico concluído visível'
            name='keepCompletedHistoryVisible'
            onChange={(enabled) => {
              setKeepCompletedHistoryVisible(enabled);
              onLocalFeedback(
                `Configuração salva: histórico concluído ${
                  enabled ? 'visível' : 'oculto'
                }.`,
              );
            }}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <PrimaryButton
            onClick={() => {
              onSave({}, 'Configurações salvas.');
            }}
          >
            Salvar configurações
          </PrimaryButton>
          <PrimaryButton onClick={onReset} tone='secondary'>
            Restaurar padrões confortáveis
          </PrimaryButton>
        </Stack>
      </Stack>
    </Box>
  );
}

export interface ProfileSettingsProps {
  mode: ProfileSettingsMode;
  onPreferenceChange?(preferences: UserPreferences): void;
}

export function ProfileSettings({
  mode,
  onPreferenceChange,
}: ProfileSettingsProps) {
  const preferences = usePreferenceStore((state) => state.preferences);
  const hasHydrated = usePreferenceStore((state) => state.hasHydrated);
  const persistenceWarning = usePreferenceStore(
    (state) => state.persistenceWarning,
  );
  const hydratePreferences = usePreferenceStore(
    (state) => state.hydratePreferences,
  );
  const resetPreferences = usePreferenceStore(
    (state) => state.resetPreferences,
  );
  const setPreferences = usePreferenceStore((state) => state.setPreferences);
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Configurações prontas para ajuste.',
  );
  const isSettingsMode = mode === 'settings';

  useEffect(() => {
    if (!hasHydrated) {
      void hydratePreferences();
    }
  }, [hasHydrated, hydratePreferences]);

  const savePreferences = (
    partialPreferences: Partial<UserPreferences>,
    nextFeedbackMessage: string,
  ) => {
    const savedPreferences = setPreferences({
      ...usePreferenceStore.getState().preferences,
      ...partialPreferences,
    });

    setFeedbackMessage(nextFeedbackMessage);
    onPreferenceChange?.(savedPreferences);
  };

  const handleReset = () => {
    if (
      preferences.extraConfirmation &&
      typeof window !== 'undefined' &&
      !window.confirm('Restaurar preferências para os padrões confortáveis?')
    ) {
      return;
    }

    const savedPreferences = resetPreferences();

    setFeedbackMessage(
      'Configurações restauradas para os padrões confortáveis.',
    );
    onPreferenceChange?.(savedPreferences);
  };

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
          <Typography
            aria-atomic='true'
            aria-live='polite'
            role='status'
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
          role='alert'
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
  );
}
