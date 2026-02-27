// MUI Theme Configuration
import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary[500],
      light: tokens.colors.primary[300],
      dark: tokens.colors.primary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.colors.secondary[500],
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary[700],
      contrastText: '#FFFFFF',
    },
    success: {
      main: tokens.colors.success[500],
      light: tokens.colors.success[300],
      dark: tokens.colors.success[700],
      contrastText: '#FFFFFF',
    },
    warning: {
      main: tokens.colors.warning[500],
      light: tokens.colors.warning[300],
      dark: tokens.colors.warning[700],
      contrastText: '#FFFFFF',
    },
    error: {
      main: tokens.colors.danger[500],
      light: tokens.colors.danger[300],
      dark: tokens.colors.danger[700],
      contrastText: '#FFFFFF',
    },
    info: {
      main: tokens.colors.primary[500],
      light: tokens.colors.primary[300],
      dark: tokens.colors.primary[700],
      contrastText: '#FFFFFF',
    },
    grey: {
      50: tokens.colors.neutral[50],
      100: tokens.colors.neutral[100],
      200: tokens.colors.neutral[200],
      300: tokens.colors.neutral[300],
      400: tokens.colors.neutral[400],
      500: tokens.colors.neutral[500],
      600: tokens.colors.neutral[600],
      700: tokens.colors.neutral[700],
      800: tokens.colors.neutral[800],
      900: tokens.colors.neutral[900],
    },
    background: {
      default: tokens.colors.background.default,
      paper: tokens.colors.background.paper,
    },
    text: {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary,
      disabled: tokens.colors.text.disabled,
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
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
      textTransform: 'none' as const,
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
      textTransform: 'uppercase' as const,
    },
  },

  shape: {
    borderRadius: {
      xs: tokens.borderRadius.sm,
      sm: tokens.borderRadius.md,
      md: tokens.borderRadius.lg,
      lg: tokens.borderRadius.xl,
      xl: tokens.borderRadius.full,
    },
  },

  spacing: 8, // Base spacing unit (8px)

  shadows: [
    'none',
    tokens.shadows.sm,
    tokens.shadows.md,
    tokens.shadows.lg,
    tokens.shadows.xl,
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],

  transitions: {
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
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: tokens.borderRadius.md,
          fontWeight: 500,
          padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`,
          minHeight: 40,
          transition: tokens.transitions.normal,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: tokens.shadows.md,
          },
        },
        contained: {
          boxShadow: tokens.shadows.sm,
          '&:hover': {
            boxShadow: tokens.shadows.md,
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          boxShadow: tokens.shadows.sm,
          transition: tokens.transitions.normal,
          '&:hover': {
            boxShadow: tokens.shadows.md,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: tokens.shadows.sm,
        },
        elevation2: {
          boxShadow: tokens.shadows.md,
        },
        elevation3: {
          boxShadow: tokens.shadows.lg,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          fontWeight: 500,
          height: 28,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.md,
          },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          height: 8,
        },
        bar: {
          borderRadius: tokens.borderRadius.sm,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          padding: tokens.spacing.sm,
          transition: tokens.transitions.normal,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
          marginBottom: tokens.spacing.xs,
          transition: tokens.transitions.normal,
          '&:hover': {
            backgroundColor: tokens.colors.neutral[50],
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: tokens.shadows.sm,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: tokens.shadows.lg,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.625rem',
          height: 16,
          minWidth: 16,
          padding: '0 4px',
        },
      },
    },
  },
});

// Custom theme extensions
export const extendedTheme = {
  ...theme,
  custom: {
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    typography: tokens.typography,
    colors: tokens.colors,
    icon: tokens.icon,
    shadows: tokens.shadows,
    transitions: tokens.transitions,
  },
};
