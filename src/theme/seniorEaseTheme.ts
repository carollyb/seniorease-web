import { createTheme } from '@mui/material/styles'

export const seniorEaseTheme = createTheme({
  typography: {
    fontFamily: '"Roobert PRO", "Noto Sans", system-ui, sans-serif',
  },
  palette: {
    primary: {
      main: '#1c1c1e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4262ff',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f7f8fa',
    },
    text: {
      primary: '#1c1c1e',
      secondary: '#555a6a',
    },
    success: {
      main: '#00b473',
    },
  },
  shape: {
    borderRadius: 8,
  },
})
