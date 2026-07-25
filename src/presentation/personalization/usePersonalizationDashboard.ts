import type {
  ContrastLevel,
  FontScale,
  SpacingLevel,
  UserPreferences,
} from '../../domain/preferences/Preference';
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore';
import { designTokens } from '../../theme/designTokens';

export interface PreferenceOption<TValue extends string> {
  value: TValue;
  label: string;
  accessibleLabel?: string;
  compact?: boolean;
  emphasized?: boolean;
  previewFontSize?: number;
}

const FONT_SCALE_OPTIONS = [
  { value: 'small', label: 'Pequeno', compact: true },
  { value: 'medium', label: 'Médio' },
  { value: 'large', label: 'Grande', emphasized: true },
  {
    value: 'extraLarge',
    label: 'Muito grande',
    emphasized: true,
    previewFontSize: designTokens.typography.h4.fontSize,
  },
] satisfies readonly PreferenceOption<FontScale>[];

const CONTRAST_OPTIONS = [
  { value: 'standard', label: 'Padrão' },
  { value: 'high', label: 'Conforto' },
  { value: 'maximum', label: 'Alto', accessibleLabel: 'Alto' },
] satisfies readonly PreferenceOption<ContrastLevel>[];

const SPACING_OPTIONS = [
  { value: 'comfortable', label: 'Confortável' },
  { value: 'wide', label: 'Amplo' },
  {
    value: 'extraWide',
    label: 'Extra amplo',
    accessibleLabel: 'Extra amplo',
  },
] satisfies readonly PreferenceOption<SpacingLevel>[];

function getOptionLabel<TValue extends string>(
  options: readonly PreferenceOption<TValue>[],
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export interface UsePersonalizationDashboardOptions {
  onFeedbackMessageChange?(message: string): void;
  onPreferenceChange?(preferences: UserPreferences): void;
}

export function usePersonalizationDashboard({
  onFeedbackMessageChange,
  onPreferenceChange,
}: UsePersonalizationDashboardOptions) {
  const preferences = usePreferenceStore((state) => state.preferences);
  const persistenceWarning = usePreferenceStore(
    (state) => state.persistenceWarning,
  );
  const setPreferences = usePreferenceStore((state) => state.setPreferences);

  const savePreferences = (
    nextPreferences: UserPreferences,
    nextFeedbackMessage: string,
  ) => {
    const savedPreferences = setPreferences(nextPreferences);

    onFeedbackMessageChange?.(nextFeedbackMessage);
    onPreferenceChange?.(savedPreferences);
  };

  const handleFontScaleChange = (fontScale: FontScale) => {
    savePreferences(
      { ...preferences, fontScale },
      `Preferência salva: tamanho do texto ${getOptionLabel(
        FONT_SCALE_OPTIONS,
        fontScale,
      )}.`,
    );
  };

  const handleContrastChange = (contrastLevel: ContrastLevel) => {
    savePreferences(
      { ...preferences, contrastLevel },
      `Preferência salva: contraste ${getOptionLabel(
        CONTRAST_OPTIONS,
        contrastLevel,
      )}.`,
    );
  };

  const handleSpacingChange = (spacingLevel: SpacingLevel) => {
    savePreferences(
      { ...preferences, spacingLevel },
      `Preferência salva: espaçamento ${getOptionLabel(
        SPACING_OPTIONS,
        spacingLevel,
      )}.`,
    );
  };

  const handleNavigationChange = (checked: boolean) => {
    const navigationMode = checked ? 'simplified' : 'standard';

    savePreferences(
      { ...preferences, navigationMode },
      `Preferência salva: navegação simplificada ${
        checked ? 'ativada' : 'desativada'
      }.`,
    );
  };

  const handleReinforcedFeedbackChange = (reinforcedFeedback: boolean) => {
    savePreferences(
      { ...preferences, reinforcedFeedback },
      `Preferência salva: feedback reforçado ${
        reinforcedFeedback ? 'ativado' : 'desativado'
      }.`,
    );
  };

  const handleExtraConfirmationChange = (extraConfirmation: boolean) => {
    savePreferences(
      { ...preferences, extraConfirmation },
      `Preferência salva: confirmação extra ${
        extraConfirmation ? 'ativada' : 'desativada'
      }.`,
    );
  };

  return {
    contrastOptions: CONTRAST_OPTIONS,
    fontScaleOptions: FONT_SCALE_OPTIONS,
    handleContrastChange,
    handleExtraConfirmationChange,
    handleFontScaleChange,
    handleNavigationChange,
    handleReinforcedFeedbackChange,
    handleSpacingChange,
    isSimplifiedNavigation: preferences.navigationMode === 'simplified',
    persistenceWarning,
    preferences,
    spacingOptions: SPACING_OPTIONS,
  };
}
