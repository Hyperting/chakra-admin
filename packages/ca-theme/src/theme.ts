import { extendTheme } from '@chakra-ui/react'
import { CalendarDefaultTheme } from '@uselessdev/datepicker'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict<T = any> = {
  [x: string]: T
}

export const theme: Dict = extendTheme({
  components: {
    ...CalendarDefaultTheme.components,
    Switch: {
      defaultProps: {
        colorScheme: 'red',
        size: 'md',
      },
    },
  },
  textStyles: {
    h1: {
      fontSize: {
        base: '28px',
        md: '28px',
      },
      fontWeight: '700',
      lineHeight: '35.28px',
      letterSpacing: '0.4px',
      color: 'gray.900',
    },
    subtitle: {
      fontSize: {
        base: '19px',
        md: '19px',
      },
      fontWeight: '400',
      lineHeight: '23.94px',
      letterSpacing: '0.4px',
      color: 'gray.500',
    },
    description: {
      fontSize: {
        base: '14px',
        md: '14px',
      },
      fontWeight: '400',
      lineHeight: '20px',
      letterSpacing: '0.3px',
      color: 'gray.500',
    },
    inputDesc: {
      fontSize: {
        base: '12px',
        md: '12px',
      },
      fontWeight: '700',
      lineHeight: '15.12px',
      letterSpacing: '0.3px',
      color: 'gray.500',
      textTransform: 'uppercase',
    },
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '0.9375rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  fonts: {
    body: 'Sora',
    heading: 'Sora',
  },
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.50',
      },
      '.chakra-portal-zIndex': {
        zIndex: '100 !important',
      },
    },
  },
  colors: {
    blackAlpha: {
      100: 'rgba(0, 0, 0, 0.36)',
      900: 'rgba(0, 0, 0, 0.8)',
    },
    gray: {
      50: '#FBFBFB',
      100: '#EEEEEE',
      300: '#A6B0B9',
      400: '#1A2240',
      500: '#A1A1A1',
      600: '#5e5555',
      800: '#333333',
      900: '#251F1E',
    },
    red: {
      50: '#ffffff',
      100: '#fee7e7',
      200: '#fdcecf',
      300: '#fbb6b8',
      400: '#fa9ea0',
      500: '#F86D70',
      600: '#f63c40',
      700: '#F12B2C',
      800: '#f30c11',
      900: '#c3090d',
    },
    orange: {
      50: '#fbe8d3',
      100: '#f6d1a4',
      200: '#f4c58d',
      300: '#f2b976',
      400: '#efad5f',
      500: '#EB9530',
      600: '#d47c14',
      700: '#bc6e12',
      800: '#a56010',
      900: '#77450b',
    },
  },
  shadows: {
    outline: 'none',
    main: '0px 3px 12px 1px rgba(37, 31, 30, 0.05)',
  },
})
