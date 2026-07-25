import type { FormEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { createDefaultPreferences } from '../../domain/preferences';
import { usePreferenceStore } from '../../stores/preferences';
import { useActivityOrganizer } from './useActivityOrganizer';

async function prepareActivity(
  result: { current: ReturnType<typeof useActivityOrganizer> },
) {
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  act(() => {
    result.current.setTitle('Enviar trabalho');
  });
  await act(async () => {
    await result.current.handleSubmitCreate({
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>);
  });
}

async function confirmActivity(
  result: { current: ReturnType<typeof useActivityOrganizer> },
) {
  await act(async () => {
    await result.current.handleConfirmCreationModal();
  });
}

describe('useActivityOrganizer feedback', () => {
  beforeEach(() => {
    window.localStorage.clear();
    usePreferenceStore.setState({
      preferences: createDefaultPreferences(),
      hasHydrated: true,
      persistenceWarning: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('owns the save feedback content and dismisses it after three seconds', async () => {
    const { result } = renderHook(() =>
      useActivityOrganizer({ mode: 'standard' }),
    );

    await prepareActivity(result);
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout');
    await confirmActivity(result);

    expect(result.current.isFeedbackVisible).toBe(true);
    expect(result.current.feedbackTitle).toBe('Tarefa salva com sucesso!');
    expect(result.current.feedbackSubtitle).toBe(
      'A tarefa “Enviar trabalho” foi adicionada à lista de hoje.',
    );

    const feedbackTimeoutCall = timeoutSpy.mock.calls.find(
      ([, delay]) => delay === 3_000,
    );
    const dismissFeedback = feedbackTimeoutCall?.[0];

    expect(feedbackTimeoutCall).toBeDefined();
    act(() => {
      if (typeof dismissFeedback === 'function') {
        dismissFeedback();
      }
    });
    expect(result.current.isFeedbackVisible).toBe(false);
  });

  it('does not schedule or expose save feedback when the preference is disabled', async () => {
    usePreferenceStore.setState((state) => ({
      preferences: {
        ...state.preferences,
        reinforcedFeedback: false,
      },
    }));
    const { result } = renderHook(() =>
      useActivityOrganizer({ mode: 'standard' }),
    );

    await prepareActivity(result);
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout');
    await confirmActivity(result);

    expect(result.current.isFeedbackVisible).toBe(false);
    expect(
      timeoutSpy.mock.calls.some(([, delay]) => delay === 3_000),
    ).toBe(false);
  });
});
