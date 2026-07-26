import {
  FontScale,
  ContrastLevel,
  NavigationMode,
  SpacingLevel,
  ReminderTone,
} from '@/domain/preferences/Preference';

const preferenceToDisplayText: {
  [key in
    | FontScale
    | ContrastLevel
    | SpacingLevel
    | NavigationMode
    | ReminderTone]: string;
} = {
  small: 'Pequena',
  medium: 'Média',
  large: 'Grande',
  extraLarge: 'Extra Grande',
  standard: 'Padrão',
  maximum: 'Alto',
  high: 'Conforto',
  comfortable: 'Confortável',
  wide: 'Amplo',
  extraWide: 'Extra Amplo',
  simplified: 'Simplificada',
  direct: 'Direto',
  gentle: 'Gentil',
};

export default function mapPreferences(
  preference:
    | FontScale
    | ContrastLevel
    | SpacingLevel
    | NavigationMode
    | ReminderTone,
) {
  return preferenceToDisplayText[preference] ?? String(preference);
}
