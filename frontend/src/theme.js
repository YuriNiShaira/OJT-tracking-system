import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    brand: {
      light: '#fefce8',  // Light yellow
      yellow: '#fde047',  // Brand yellow
      green: '#86efac',   // Light green
      teal: '#5eead4',    // Teal accent
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'brand.light',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'brand.yellow',
          color: 'gray.800',
          _hover: {
            bg: 'yellow.500',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          borderWidth: '1px',
          borderColor: 'gray.200',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
          },
        },
      },
    },
  },
})

export default theme