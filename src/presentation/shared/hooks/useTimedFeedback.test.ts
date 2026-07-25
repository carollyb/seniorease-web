import { act, renderHook } from '@testing-library/react'

import { useTimedFeedback } from './useTimedFeedback'

describe('useTimedFeedback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('hides feedback after three seconds', () => {
    const { result } = renderHook(() => useTimedFeedback<string>())

    act(() => {
      result.current.showFeedback('Preferências salvas')
    })

    expect(result.current.feedback).toBe('Preferências salvas')
    expect(result.current.isFeedbackVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2_999)
    })
    expect(result.current.isFeedbackVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current.feedback).toBeNull()
    expect(result.current.isFeedbackVisible).toBe(false)
  })

  it('restarts the duration when new feedback is shown', () => {
    const { result } = renderHook(() => useTimedFeedback<string>())

    act(() => {
      result.current.showFeedback('Primeiro feedback')
      jest.advanceTimersByTime(2_000)
      result.current.showFeedback('Segundo feedback')
      jest.advanceTimersByTime(1_000)
    })

    expect(result.current.feedback).toBe('Segundo feedback')
    expect(result.current.isFeedbackVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2_000)
    })
    expect(result.current.isFeedbackVisible).toBe(false)
  })

  it('applies the same duration to initial feedback', () => {
    const { result } = renderHook(() =>
      useTimedFeedback({ initialFeedback: 'Layout preservado' }),
    )

    expect(result.current.feedback).toBe('Layout preservado')
    expect(result.current.isFeedbackVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(3_000)
    })
    expect(result.current.isFeedbackVisible).toBe(false)
  })

  it('clears the pending timer when its consumer unmounts', () => {
    const { result, unmount } = renderHook(() => useTimedFeedback<string>())

    act(() => {
      result.current.showFeedback('Feedback temporário')
    })
    expect(jest.getTimerCount()).toBe(1)

    unmount()

    expect(jest.getTimerCount()).toBe(0)
  })
})
