// Enhanced Design System with Advanced UI/UX Features
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { alpha, adaptV4Theme } from '@mui/material/styles';

// Enhanced Color Palette
const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  secondary: {
    50: '#fce4ec',
    100: '#f8bbd9',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63',
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  info: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4',
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Arabic-specific colors
  arabic: {
    green: '#1a7f37', // Arabic green
    blue: '#0067b5',   // Arabic blue
    gold: '#d4af37',   // Arabic gold
    red: '#c8102e',    // Arabic red
    sand: '#d4a574',   // Desert sand
  }
};

// Typography System
const typography = {
  fontFamily: [
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans Arabic',
    'Tahoma',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
    '@media (min-width: 600px)': {
      fontSize: '3.5rem',
    },
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
    '@media (min-width: 600px)': {
      fontSize: '2.5rem',
    },
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.00714em',
    '@media (min-width: 600px)': {
      fontSize: '2rem',
    },
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.005em',
    '@media (min-width: 600px)': {
      fontSize: '1.75rem',
    },
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '-0.0025em',
    '@media (min-width: 600px)': {
      fontSize: '1.5rem',
    },
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0em',
    '@media (min-width: 600px)': {
      fontSize: '1.125rem',
    },
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
  },
  // Arabic-specific typography
  arabicH1: {
    fontFamily: 'Noto Sans Arabic, Arial, sans-serif',
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.4,
    '@media (min-width: 600px)': {
      fontSize: '3.5rem',
    },
  },
  arabicBody: {
    fontFamily: 'Noto Sans Arabic, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.8,
  },
};

// Spacing System
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// Shadows
const shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
];

// Transitions
const transitions = {
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  create: (props: {
    duration?: number;
    easing?: string;
    delay?: number;
  }) => {
    const { duration = 300, easing = 'easeInOut', delay = 0 } = props;
    return `${duration}ms ${easing} ${delay}ms`;
  },
};

// Breakpoints
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  xxl: 1920,
};

// Z-Index
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Animation Keyframes
const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideInUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  scaleIn: {
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
    '70%': { transform: 'translate3d(0, -15px, 0)' },
    '90%': { transform: 'translate3d(0, -4px, 0)' },
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-1000px 0' },
    '100%': { backgroundPosition: '1000px 0' },
  },
  rotate: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
};

// Enhanced Theme Options
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#fff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#fff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
      contrastText: '#fff',
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
      contrastText: '#fff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
      contrastText: '#fff',
    },
    info: {
      main: colors.info[500],
      light: colors.info[300],
      dark: colors.info[700],
      contrastText: '#fff',
    },
    grey: {
      50: colors.neutral[50],
      100: colors.neutral[100],
      200: colors.neutral[200],
      300: colors.neutral[300],
      400: colors.neutral[400],
      500: colors.neutral[500],
      600: colors.neutral[600],
      700: colors.neutral[700],
      800: colors.neutral[800],
      900: colors.neutral[900],
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    // Arabic-specific palette
    arabic: {
      green: colors.arabic.green,
      blue: colors.arabic.blue,
      gold: colors.arabic.gold,
      red: colors.arabic.red,
      sand: colors.arabic.sand,
    },
  },
  typography,
  spacing,
  shape: {
    borderRadius,
  },
  shadows,
  transitions: {
    easing: transitions.easing,
    duration: transitions.duration,
    create: transitions.create,
  },
  breakpoints,
  zIndex,
  keyframes,
  // Custom overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: borderRadius.md,
          padding: '12px 24px',
          fontWeight: 600,
          transition: transitions.create(['background-color', 'box-shadow', 'border-color'], {
            duration: transitions.duration.shorter,
          }),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows[4],
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: shadows[2],
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows[2],
          transition: transitions.create(['box-shadow', 'transform'], {
            duration: transitions.duration.standard,
          }),
          '&:hover': {
            boxShadow: shadows[8],
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
        },
        elevation1: {
          boxShadow: shadows[1],
        },
        elevation2: {
          boxShadow: shadows[2],
        },
        elevation3: {
          boxShadow: shadows[3],
        },
        elevation4: {
          boxShadow: shadows[4],
        },
        elevation5: {
          boxShadow: shadows[5],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            background: `linear-gradient(45deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            color: '#fff',
          },
          '&.MuiChip-colorSecondary': {
            background: `linear-gradient(45deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
            color: '#fff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[300],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
          boxShadow: shadows[4],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          minHeight: 64,
          '&.Mui-selected': {
            color: colors.primary[500],
            fontWeight: 700,
          },
        },
        indicator: {
          height: 4,
          borderRadius: '4px 4px 0 0',
          background: colors.primary[500],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows[24],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          '& .MuiAlert-message': {
            fontWeight: 500,
          },
        },
      },
    },
    MuiProgress: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
        },
        bar: {
          borderRadius: borderRadius.full,
        },
      },
    },
  },
};

// Create the theme
export const theme = createTheme(themeOptions);

// Dark theme
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'dark',
    ...themeOptions.palette,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

// RTL theme for Arabic
export const rtlTheme = createTheme({
  ...themeOptions,
  direction: 'rtl',
  typography: {
    ...themeOptions.typography,
    fontFamily: 'Noto Sans Arabic, Arial, sans-serif',
    h1: {
      ...themeOptions.typography.h1,
      fontFamily: 'Noto Sans Arabic, Arial, sans-serif',
    },
    body1: {
      ...themeOptions.typography.body1,
      fontFamily: 'Noto Sans Arabic, Arial, sans-serif',
    },
  },
});

// High contrast theme for accessibility
export const highContrastTheme = createTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    mode: 'light',
    contrastThreshold: 4.5,
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#cccccc',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
      disabled: '#666666',
    },
    divider: '#000000',
  },
  components: {
    ...themeOptions.components,
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid',
          '&:hover': {
            borderStyle: 'solid',
          },
        },
      },
    },
  },
});

export default theme;
