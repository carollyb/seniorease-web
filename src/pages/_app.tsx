import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'

import { seniorEaseTheme } from '@/theme/seniorEaseTheme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={seniorEaseTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
