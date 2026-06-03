import { useEffect, useId, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type {
  ContrastLevel,
  FontScale,
  NavigationMode,
  SpacingLevel,
  UserPreferences,
} from '../../domain/preferences/Preference';
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore';
import { designTokens } from '../../theme/designTokens';

type ProfileSettingsMode = 'profile' | 'settings';

const { colors, rounded, spacing } = designTokens;

const FONT_SCALE_LABELS: Record<FontScale, string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
  extraLarge: 'Muito grande',
};

const CONTRAST_LABELS: Record<ContrastLevel, string> = {
  standard: 'Padrão',
  high: 'Alto conforto',
  maximum: 'Máximo',
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

const navItems = [
  { href: '/', label: 'Painel' },
  { href: '/atividades', label: 'Atividades' },
  { href: '/perfil', label: 'Perfil' },
  { href: '/configuracoes', label: 'Configurações' },
];

function booleanPreferenceLabel(isActive: boolean) {
  return isActive ? 'Ativo' : 'Inativo';
}

function LogoMark() {
  return (
    <Box
      aria-hidden='true'
      component='svg'
      data-testid='senior-ease-logo-mark'
      focusable='false'
      height='44'
      preserveAspectRatio='xMidYMid meet'
      sx={{
        display: 'block',
        flex: '0 0 44px',
        height: 44,
        minHeight: 44,
        minWidth: 44,
        width: 44,
      }}
      viewBox='0 0 160 160'
      width='44'
    >
      <rect fill={colors.brandYellow} height='160' rx='52' width='160' />
      <circle cx='72' cy='88' fill={colors.brandBlue} r='37' />
      <circle cx='124' cy='60' fill={colors.brandTeal} r='19' />
    </Box>
  );
}

function SideNavigation() {
  return (
    <Box
      aria-label='SeniorEase'
      component='nav'
      sx={{
        bgcolor: colors.primary,
        borderRadius: `${rounded.xxxl}px`,
        color: colors.onPrimary,
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing.xl}px`,
        minHeight: { md: 355 },
        px: `${spacing.lg}px`,
        py: `${spacing.xxxl - 12}px`,
        width: { xs: '100%', md: 248 },
      }}
    >
      <Stack alignItems='center' direction='row' minWidth={0} spacing={1.5}>
        <LogoMark />
        <Typography
          component='p'
          fontSize={22}
          fontWeight={600}
          sx={{ whiteSpace: 'nowrap' }}
        >
          SeniorEase
        </Typography>
      </Stack>

      <Stack
        component='ul'
        spacing='10px'
        sx={{ listStyle: 'none', m: 0, p: 0 }}
      >
        {navItems.map((item, index) => {
          const isHighlighted = index === 0;

          return (
            <Box component='li' key={item.href}>
              <Box
                component='a'
                href={item.href}
                sx={{
                  alignItems: 'center',
                  bgcolor: isHighlighted ? colors.yellowLight : colors.charcoal,
                  borderRadius: `${rounded.xl}px`,
                  color: isHighlighted ? colors.ink : colors.onPrimary,
                  display: 'inline-flex',
                  fontSize: 16,
                  fontWeight: isHighlighted ? 600 : 500,
                  gap: `${spacing.sm}px`,
                  justifyContent: 'center',
                  lineHeight: 1.4,
                  px: `${spacing.md}px`,
                  py: `${spacing.sm}px`,
                  textDecoration: 'none',
                }}
              >
                <Box
                  aria-hidden='true'
                  sx={{
                    bgcolor: isHighlighted ? colors.brandYellow : colors.muted,
                    borderRadius: `${rounded.full}px`,
                    height: 12,
                    width: 12,
                  }}
                />
                {item.label}
              </Box>
            </Box>
          );
        })}
      </Stack>

      <Box
        sx={{
          bgcolor: colors.charcoal,
          borderRadius: `${spacing.xl}px`,
          mt: 'auto',
          p: `${spacing.xl}px`,
          width: '100%',
        }}
      >
        <Typography fontSize={15} lineHeight={1.4}>
          Passos claros. Preferências estáveis. Feedback gentil.
        </Typography>
      </Box>
    </Box>
  );
}

interface PreferenceSummaryRowProps {
  label: string;
  value: string;
}

function PreferenceSummaryRow({ label, value }: PreferenceSummaryRowProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: { xs: 2, md: '56px' },
        minHeight: 64,
        py: `${spacing.sm}px`,
      }}
    >
      <Typography
        component='dt'
        fontSize={18}
        fontWeight={500}
        lineHeight={1.4}
        sx={{ color: colors.ink, flex: '0 0 260px' }}
      >
        {label}
      </Typography>
      <Box
        component='dd'
        sx={{
          bgcolor: colors.yellowLight,
          borderRadius: `${rounded.full}px`,
          color: colors.ink,
          m: 0,
          px: `${spacing.md}px`,
          py: '9px',
        }}
      >
        <Typography fontSize={14} fontWeight={500} lineHeight={1.4}>
          {value}
        </Typography>
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
      sx={{
        bgcolor: colors.canvas,
        border: 1,
        borderColor: colors.hairline,
        borderRadius: `${spacing.xl}px`,
        overflow: 'hidden',
        p: { xs: `${spacing.lg}px`, md: `${spacing.xxxl - 4}px` },
        width: '100%',
      }}
    >
      <Typography
        component='h2'
        id='profile-preferences-title'
        sx={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: 1,
          m: -1,
          overflow: 'hidden',
          p: 0,
          position: 'absolute',
          width: 1,
        }}
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
        height: 36,
        position: 'relative',
        width: 64,
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
          height: 36,
          position: 'relative',
          transition: 'background-color 120ms ease',
          width: 64,
          '&::after': {
            bgcolor: colors.canvas,
            borderRadius: `${rounded.full}px`,
            content: '""',
            height: 28,
            left: checked ? 32 : 4,
            position: 'absolute',
            top: 4,
            transition: 'left 120ms ease',
            width: 28,
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
        py: '14px',
      }}
    >
      <Typography
        component='label'
        fontSize={18}
        fontWeight={500}
        htmlFor={name}
        lineHeight={1.4}
        sx={{ color: colors.ink, maxWidth: 360 }}
      >
        {label}
      </Typography>
      <FigmaPillSwitch
        checked={checked}
        describedBy={helperId}
        name={name}
        onChange={onChange}
      />
      <Typography
        id={helperId}
        sx={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: 1,
          m: -1,
          overflow: 'hidden',
          p: 0,
          position: 'absolute',
          width: 1,
        }}
      >
        {helperText}
      </Typography>
    </Box>
  );
}

interface ReminderSettingsProps {
  preferences: UserPreferences;
  onSave(preferences: Partial<UserPreferences>, feedbackMessage: string): void;
  onReset(): void;
}

function ReminderSettings({
  preferences,
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
      sx={{
        bgcolor: colors.canvas,
        border: 1,
        borderColor: colors.hairline,
        borderRadius: `${spacing.xl}px`,
        overflow: 'hidden',
        p: `${spacing.xl}px`,
        width: '100%',
      }}
    >
      <Stack spacing={1}>
        <Typography
          component='h2'
          fontSize={24}
          fontWeight={600}
          id='reminder-settings-title'
          lineHeight={1.4}
          sx={{ color: colors.ink }}
        >
          Preferências de lembrete
        </Typography>

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
          helperText='Controla a visibilidade dos lembretes no painel.'
          label='Mostrar lembretes no painel'
          name='showDashboardReminders'
          onChange={setShowDashboardReminders}
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
          onChange={setKeepCompletedHistoryVisible}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            onClick={() => {
              onSave({}, 'Configurações salvas.');
            }}
            sx={{
              bgcolor: colors.primary,
              color: colors.onPrimary,
              '&:hover': { bgcolor: colors.charcoal },
            }}
            variant='contained'
          >
            Salvar configurações
          </Button>
          <Button
            onClick={onReset}
            sx={{
              borderColor: colors.hairlineStrong,
              color: colors.ink,
            }}
            variant='outlined'
          >
            Restaurar padrões confortáveis
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function CriticalActionConcept() {
  return (
    <Box
      aria-labelledby='critical-action-title'
      component='section'
      sx={{
        bgcolor: colors.brandRed,
        border: 1,
        borderColor: colors.hairline,
        borderRadius: `${spacing.xl}px`,
        color: colors.ink,
        overflow: 'hidden',
        p: `${spacing.xl}px`,
        width: '100%',
      }}
    >
      <Stack alignItems='flex-start' spacing={2}>
        <Typography
          component='h2'
          fontSize={24}
          fontWeight={600}
          id='critical-action-title'
          lineHeight={1.4}
        >
          Confirmar antes de excluir
        </Typography>
        <Typography fontSize={17} lineHeight={1.4}>
          Esta é uma ação crítica. O SeniorEase pergunta de forma clara antes
          de remover uma atividade.
        </Typography>
        <Button
          sx={{
            bgcolor: colors.primary,
            color: colors.onPrimary,
            '&:hover': { bgcolor: colors.charcoal },
          }}
          variant='contained'
        >
          Manter atividade
        </Button>
        <Button sx={{ color: colors.ink }} variant='text'>
          Excluir atividade
        </Button>
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
    const savedPreferences = resetPreferences();

    setFeedbackMessage('Configurações restauradas para os padrões confortáveis.');
    onPreferenceChange?.(savedPreferences);
  };

  return (
    <Box
      aria-labelledby='profile-settings-title'
      component='section'
      data-node-id={isSettingsMode ? '703:250' : '703:200'}
      sx={{
        bgcolor: colors.surface,
        border: 1,
        borderColor: colors.hairlineSoft,
        borderRadius: `${rounded.feature}px`,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '28px',
        p: `${spacing.xxxl - 8}px`,
        width: '100%',
      }}
    >
      <SideNavigation />

      <Stack
        component='main'
        spacing={3}
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          py: { xs: 0, md: `${spacing.sm}px` },
        }}
      >
        <Box>
          <Typography
            component='h1'
            fontSize={36}
            fontWeight={600}
            id='profile-settings-title'
            lineHeight={1.4}
            sx={{ color: colors.inkDeep }}
          >
            {isSettingsMode ? 'Configurações' : 'Resumo do perfil'}
          </Typography>
          <Typography
            fontSize={18}
            lineHeight={1.4}
            sx={{ color: colors.slate, mt: '10px' }}
          >
            {isSettingsMode
              ? 'Atualize lembretes e configurações salvas além do painel principal de personalização.'
              : 'Preferências de acessibilidade salvas apresentadas em linguagem clara.'}
          </Typography>
        </Box>

        {isSettingsMode ? (
          <>
            <ReminderSettings
              onReset={handleReset}
              onSave={savePreferences}
              preferences={preferences}
            />
            <CriticalActionConcept />
            <Typography
              aria-atomic='true'
              aria-live='polite'
              role='status'
              sx={{
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: 1,
                m: -1,
                overflow: 'hidden',
                p: 0,
                position: 'absolute',
                width: 1,
              }}
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
    </Box>
  );
}
