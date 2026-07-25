import { useCallback, useEffect, useRef, useState } from 'react';

const FEEDBACK_DURATION_MS = 3_000;

export interface UseTimedFeedbackOptions<TFeedback> {
  initialFeedback?: TFeedback | null;
}

export function useTimedFeedback<TFeedback>({
  initialFeedback = null,
}: UseTimedFeedbackOptions<TFeedback> = {}) {
  const [feedback, setFeedback] = useState<TFeedback | null>(initialFeedback);
  const initialFeedbackRef = useRef(initialFeedback);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const scheduleFeedbackDismissal = useCallback(() => {
    clearFeedbackTimer();
    feedbackTimerRef.current = setTimeout(() => {
      feedbackTimerRef.current = null;
      setFeedback(null);
    }, FEEDBACK_DURATION_MS);
  }, [clearFeedbackTimer]);

  const showFeedback = useCallback(
    (nextFeedback: TFeedback) => {
      setFeedback(nextFeedback);
      scheduleFeedbackDismissal();
    },
    [scheduleFeedbackDismissal],
  );

  useEffect(() => {
    if (initialFeedbackRef.current !== null) {
      scheduleFeedbackDismissal();
    }

    return clearFeedbackTimer;
  }, [clearFeedbackTimer, scheduleFeedbackDismissal]);

  return {
    feedback,
    isFeedbackVisible: feedback !== null,
    showFeedback,
  };
}
