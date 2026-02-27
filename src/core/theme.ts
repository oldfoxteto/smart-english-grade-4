import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { arSA, enUS } from '@mui/material/locale';

// دالة لإنشاء theme داعم للعربية والإنجليزية
export function createAppTheme(language: 'ar' | 'en' = 'ar') {
  const localization = language === 'ar' ? arSA : enUS;
  const isRTL = language === 'ar';

  const baseTheme: ThemeOptions = {
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      primary: {
        main: '#0B4B88',
        light: '#2979C1',
        dark: '#063566',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF6B6B',
        light: '#FF9999',
        dark: '#CC4444',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#2E7D32',
      },
      warning: {
        main: '#FF9800',
        light: '#FFB74D',
        dark: '#E65100',
      },
      error: {
        main: '#F44336',
        light: '#EF5350',
        dark: '#C62828',
      },
      info: {
        main: '#29B6F6',
        light: '#73D8FF',
        dark: '#0288D1',
      },
      background: {
        default: '#F8FAFB',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1A202C',
        secondary: '#4A5568',
        disabled: '#A0AEC0',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      action: {
        active: '#0B4B88',
        hover: 'rgba(11, 75, 136, 0.08)',
        selected: 'rgba(11, 75, 136, 0.12)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
      },
    },
    typography: {
      fontFamily: isRTL 
        ? '"Cairo", "Tajawal", "Sakha", "Arial", sans-serif'
        : '"Nunito", "Roboto", "Arial", sans-serif',
      h1: {
        fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
        fontWeight: 800,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.2rem' },
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
        fontWeight: 700,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
        fontWeight: 700,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: { xs: '1.1rem', sm: '1.15rem', md: '1.2rem' },
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: { xs: '0.95rem', sm: '0.975rem', md: '1rem' },
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
        lineHeight: 1.7,
        letterSpacing: '0.3px',
      },
      body2: {
        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
        lineHeight: 1.6,
        letterSpacing: '0.2px',
      },
      button: {
        fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: '0.5px',
      },
      caption: {
        fontSize: '0.85rem',
        lineHeight: 1.5,
        letterSpacing: '0.3px',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
            padding: { xs: '8px 20px', sm: '10px 24px', md: '10px 28px' },
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #0B4B88 0%, #2979C1 100%)',
            color: '#FFFFFF',
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9999 100%)',
            color: '#FFFFFF',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(11, 75, 136, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(11, 75, 136, 0.2)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: '0 4px 12px rgba(11, 75, 136, 0.12)',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            backgroundColor: '#FF6B6B',
            color: '#FFFFFF',
          },
        },
      },
    },
  };

  return createTheme(baseTheme, localization);
}

const theme = createAppTheme('ar');
export default theme;
