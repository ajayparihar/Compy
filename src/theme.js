import { createTheme } from '@mui/material'

const glassmorphismStyles = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}

const commonTheme = {
  shape: {
    borderRadius: 16,
  },
  spacing: 10,
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        '*::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '*::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.4)'
            : 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(10px)',
        },
        '*::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark'
            ? 'rgba(129, 140, 248, 0.3)'
            : 'rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: theme.palette.mode === 'dark'
              ? 'rgba(129, 140, 248, 0.5)'
              : 'rgba(99, 102, 241, 0.5)',
          },
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.mode === 'dark' 
            ? 'rgba(129, 140, 248, 0.3)'
            : 'rgba(99, 102, 241, 0.3)'} transparent`,
        },
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassmorphismStyles,
          padding: '24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...glassmorphismStyles,
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: theme => theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: theme => theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0d9488',
    },
    background: {
      default: '#f8fafc',
      paper: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
})

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8',
      light: '#a5b4fc',
      dark: '#6366f1',
    },
    secondary: {
      main: '#2dd4bf',
      light: '#5eead4',
      dark: '#14b8a6',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
})