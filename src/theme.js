import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  },
}

const semanticTokens = {
  colors: {
    'chakra-body-bg': {
      _light: '#ffffff',
      _dark: '#212529',
    },
    'chakra-body-text': {
      _light: '#212529',
      _dark: '#f8f9fa',
    },
    'chakra-border-color': {
      _light: '#dee2e6',
      _dark: '#495057',
    },
    'hover-color': {
      _light: '#f8f9fa',
      _dark: '#343a40',
    },
    'modal-backdrop': {
      _light: 'rgba(0, 0, 0, 0.5)',
      _dark: 'rgba(0, 0, 0, 0.75)',
    },
  },
}

const components = {
  Button: {
    variants: {
      primary: {
        bg: 'brand.primary',
        color: 'white',
        _hover: {
          bg: '#0056b3',
          transform: 'scale(1.02)',
        },
      },
      secondary: {
        bg: 'brand.secondary',
        color: 'white',
        _hover: {
          bg: '#5a6268',
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        maxW: '600px',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'md',
        boxShadow: 'sm',
      },
    },
  },
}

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({
  colors,
  semanticTokens,
  components,
  config,
  styles: {
    global: {
      body: {
        fontFamily: "'Poppins', sans-serif",
      },
    },
  },
})

export default theme 