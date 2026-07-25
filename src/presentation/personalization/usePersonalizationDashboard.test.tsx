import { act, renderHook } from '@testing-library/react';

import { createDefaultPreferences } from '../../domain/preferences/Preference';
import { usePreferenceStore } from '../../stores/preferences/usePreferenceStore';
import { usePersonalizationDashboard } from './usePersonalizationDashboard';

describe('usePersonalizationDashboard', () => {
  beforeEach(() => {
    window.localStorage.clear();
    usePreferenceStore.setState({
      preferences: createDefaultPreferences(),
      hasHydrated: true,
      persistenceWarning: 'As preferências serão mantidas apenas nesta sessão.',
    });
  });

  it('owns the preference state, handlers, feedback, and persistence warning', () => {
    const onFeedbackMessageChange = jest.fn();
    const onPreferenceChange = jest.fn();
    const { result } = renderHook(() =>
      usePersonalizationDashboard({
        onFeedbackMessageChange,
        onPreferenceChange,
      }),
    );

    expect(result.current.persistenceWarning).toBe(
      'As preferências serão mantidas apenas nesta sessão.',
    );

    act(() => {
      result.current.handleFontScaleChange('extraLarge');
    });
    expect(onFeedbackMessageChange).toHaveBeenLastCalledWith(
      'Preferência salva: tamanho do texto Muito grande.',
    );

    act(() => {
      result.current.handleContrastChange('maximum');
    });
    act(() => {
      result.current.handleSpacingChange('extraWide');
    });
    act(() => {
      result.current.handleNavigationChange(false);
    });
    act(() => {
      result.current.handleReinforcedFeedbackChange(false);
    });
    act(() => {
      result.current.handleExtraConfirmationChange(false);
    });

    expect(result.current.preferences).toMatchObject({
      fontScale: 'extraLarge',
      contrastLevel: 'maximum',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      reinforcedFeedback: false,
      extraConfirmation: false,
    });
    expect(onPreferenceChange).toHaveBeenCalledTimes(6);
    expect(onPreferenceChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        extraConfirmation: false,
      }),
    );
  });
});
