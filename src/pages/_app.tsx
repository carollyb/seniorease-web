import { useEffect, useMemo, type ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'

import { usePreferenceStore } from '@/stores/preferences/usePreferenceStore'
import { createSeniorEaseTheme } from '@/theme/createSeniorEaseTheme'

export interface SeniorEaseAppProvidersProps {
  children: ReactNode
}

export function SeniorEaseAppProviders({
  children,
}: SeniorEaseAppProvidersProps) {
  const preferences = usePreferenceStore((state) => state.preferences)
  const hasHydrated = usePreferenceStore((state) => state.hasHydrated)
  const hydratePreferences = usePreferenceStore(
    (state) => state.hydratePreferences,
  )
  const theme = useMemo(
    () => createSeniorEaseTheme(preferences),
    [preferences],
  )

  useEffect(() => {
    if (!hasHydrated) {
      void hydratePreferences()
    }
  }, [hasHydrated, hydratePreferences])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SeniorEaseAppProviders>
      <Component {...pageProps} />
    </SeniorEaseAppProviders>
  )
}
