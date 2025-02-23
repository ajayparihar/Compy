import { createTheme } from '@mui/material'
import { themes } from './themes/themeConfig'
import { useTheme } from './hooks/useTheme'

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
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassmorphismStyles,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
}

export function getTheme(themeId = 'sunrise') {
  let themeConfig = null;
  
  // Find the theme configuration
  for (const [category, categoryThemes] of Object.entries(themes)) {
    if (themeId in categoryThemes) {
      themeConfig = categoryThemes[themeId];
      break;
    }
  }
  
  // Fallback to sunrise theme if the requested theme is not found
  if (!themeConfig) {
    themeConfig = themes.light.sunrise;
  }

  return createTheme({
    ...commonTheme,
    palette: themeConfig.palette,
  })
}

export const lightTheme = getTheme('sunrise')
export const darkTheme = getTheme('mysticForest')