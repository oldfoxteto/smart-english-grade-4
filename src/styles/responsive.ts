// Mobile-First Responsive Design System
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { useState, useEffect } from 'react';

// Breakpoints for mobile-first design
export const breakpoints = {
  xs: 0,      // 0px and up - Small phones
  sm: 600,    // 600px and up - Large phones, small tablets
  md: 900,    // 900px and up - Tablets
  lg: 1200,   // 1200px and up - Small desktops
  xl: 1536,   // 1536px and up - Large desktops
};

// Mobile-first spacing system
export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
};

// Responsive typography scale
export const typography = {
  fontFamily: [
    'Cairo', // Arabic font
    'Roboto', // English font
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: {
      xs: '2rem',      // 32px
      sm: '2.5rem',    // 40px
      md: '3rem',      // 48px
      lg: '3.5rem',    // 56px
      xl: '4rem',      // 64px
    },
    fontWeight: 900,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: {
      xs: '1.5rem',    // 24px
      sm: '1.75rem',   // 28px
      md: '2rem',      // 32px
      lg: '2.25rem',   // 36px
      xl: '2.5rem',    // 40px
    },
    fontWeight: 800,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: {
      xs: '1.25rem',   // 20px
      sm: '1.4rem',    // 22.4px
      md: '1.5rem',    // 24px
      lg: '1.6rem',    // 25.6px
      xl: '1.75rem',   // 28px
    },
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: {
      xs: '1.1rem',    // 17.6px
      sm: '1.2rem',    // 19.2px
      md: '1.25rem',   // 20px
      lg: '1.3rem',    // 20.8px
      xl: '1.4rem',    // 22.4px
    },
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: {
      xs: '1rem',      // 16px
      sm: '1.1rem',    // 17.6px
      md: '1.15rem',   // 18.4px
      lg: '1.2rem',    // 19.2px
      xl: '1.25rem',   // 20px
    },
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: {
      xs: '0.9rem',    // 14.4px
      sm: '0.95rem',   // 15.2px
      md: '1rem',      // 16px
      lg: '1.05rem',   // 16.8px
      xl: '1.1rem',    // 17.6px
    },
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: {
      xs: '0.875rem',  // 14px
      sm: '0.9rem',    // 14.4px
      md: '0.95rem',   // 15.2px
      lg: '1rem',      // 16px
      xl: '1.05rem',   // 16.8px
    },
    lineHeight: 1.6,
  },
  body2: {
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.8rem',    // 12.8px
      md: '0.85rem',   // 13.6px
      lg: '0.9rem',    // 14.4px
      xl: '0.95rem',   // 15.2px
    },
    lineHeight: 1.6,
  },
  caption: {
    fontSize: {
      xs: '0.7rem',    // 11.2px
      sm: '0.75rem',   // 12px
      md: '0.8rem',    // 12.8px
      lg: '0.85rem',   // 13.6px
      xl: '0.9rem',    // 14.4px
    },
    lineHeight: 1.4,
  },
};

// Responsive component styles
export const componentStyles = {
  // Container styles
  container: {
    maxWidth: {
      xs: '100%',
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
    },
    mx: 'auto',
    px: {
      xs: spacing.sm,
      sm: spacing.md,
      md: spacing.lg,
      lg: spacing.xl,
    },
  },

  // Card styles
  card: {
    borderRadius: {
      xs: 1,
      sm: 2,
      md: 3,
    },
    boxShadow: {
      xs: '0 2px 8px rgba(0,0,0,0.1)',
      sm: '0 4px 16px rgba(0,0,0,0.12)',
      md: '0 8px 24px rgba(0,0,0,0.15)',
    },
    p: {
      xs: spacing.sm,
      sm: spacing.md,
      md: spacing.lg,
    },
  },

  // Button styles
  button: {
    borderRadius: {
      xs: 1,
      sm: 2,
      md: 2,
    },
    padding: {
      xs: `${spacing.sm}px ${spacing.md}px`,
      sm: `${spacing.md}px ${spacing.lg}px`,
      md: `${spacing.md}px ${spacing.xl}px`,
    },
    fontSize: {
      xs: '0.875rem',
      sm: '0.9rem',
      md: '1rem',
    },
    minHeight: {
      xs: 36,
      sm: 40,
      md: 44,
    },
  },

  // Input styles
  input: {
    borderRadius: {
      xs: 1,
      sm: 2,
      md: 2,
    },
    padding: {
      xs: `${spacing.sm}px ${spacing.md}px`,
      sm: `${spacing.md}px ${spacing.lg}px`,
      md: `${spacing.md}px ${spacing.xl}px`,
    },
    fontSize: {
      xs: '0.875rem',
      sm: '0.9rem',
      md: '1rem',
    },
  },

  // Grid styles
  grid: {
    spacing: {
      xs: 1,
      sm: 2,
      md: 3,
    },
  },

  // Navigation styles
  navigation: {
    height: {
      xs: 56,
      sm: 64,
      md: 72,
    },
    padding: {
      xs: `${spacing.sm}px ${spacing.md}px`,
      sm: `${spacing.md}px ${spacing.lg}px`,
      md: `${spacing.lg}px ${spacing.xl}px`,
    },
  },

  // Dialog styles
  dialog: {
    borderRadius: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    maxWidth: {
      xs: '95vw',
      sm: '90vw',
      md: '80vw',
      lg: '70vw',
      xl: '60vw',
    },
    margin: {
      xs: `${spacing.xl}px`,
      sm: `${spacing.xxl}px`,
    },
  },
};

// Mobile-first theme
export const mobileFirstTheme = createTheme({
  direction: 'rtl',
  breakpoints: {
    values: breakpoints,
  },
  typography,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: componentStyles.container,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: componentStyles.card,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: componentStyles.button,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: componentStyles.input,
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: componentStyles.grid,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: componentStyles.dialog,
      },
    },
  },
} as unknown as ThemeOptions);

// Responsive utilities
export const responsive = {
  // Hide/show based on breakpoint
  hidden: {
    xsDown: { display: { xs: 'none', sm: 'block', md: 'block', lg: 'block', xl: 'block' } },
    smDown: { display: { xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' } },
    mdDown: { display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block' } },
    lgDown: { display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } },
    xlDown: { display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none' } },
    
    xsUp: { display: { xs: 'block', sm: 'none', md: 'none', lg: 'none', xl: 'none' } },
    smUp: { display: { xs: 'none', sm: 'block', md: 'none', lg: 'none', xl: 'none' } },
    mdUp: { display: { xs: 'none', sm: 'none', md: 'block', lg: 'none', xl: 'none' } },
    lgUp: { display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'none' } },
    xlUp: { display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } },
  },

  // Text alignment based on screen size
  textAlign: {
    xsCenter: { textAlign: { xs: 'center', sm: 'left', md: 'left', lg: 'left', xl: 'left' } },
    smCenter: { textAlign: { xs: 'left', sm: 'center', md: 'left', lg: 'left', xl: 'left' } },
    mdCenter: { textAlign: { xs: 'left', sm: 'left', md: 'center', lg: 'left', xl: 'left' } },
    lgCenter: { textAlign: { xs: 'left', sm: 'left', md: 'left', lg: 'center', xl: 'left' } },
    xlCenter: { textAlign: { xs: 'left', sm: 'left', md: 'left', lg: 'left', xl: 'center' } },
  },

  // Flex direction based on screen size
  flexDirection: {
    xsColumn: { flexDirection: { xs: 'column', sm: 'row', md: 'row', lg: 'row', xl: 'row' } },
    smColumn: { flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' } },
    mdColumn: { flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' } },
    lgColumn: { flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'column', xl: 'row' } },
    xlColumn: { flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'column', xl: 'column' } },
  },

  // Grid layouts
  grid: {
    xs1: { xs: 12 },
    xs2: { xs: 6, sm: 12 },
    xs3: { xs: 4, sm: 6, md: 12 },
    xs4: { xs: 3, sm: 6, md: 4, lg: 12 },
    xs6: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 },
    xs12: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
  },
};

// Mobile detection utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.sm;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.md;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md;
};

export const isLargeDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

// Touch detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Orientation detection
export const isPortrait = () => {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
};

export const isLandscape = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

// Responsive hooks
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    isXs: screenSize.width < breakpoints.sm,
    isSm: screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md,
    isMd: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
    isLg: screenSize.width >= breakpoints.lg && screenSize.width < breakpoints.xl,
    isXl: screenSize.width >= breakpoints.xl,
    isMobile: screenSize.width < breakpoints.sm,
    isTablet: screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md,
    isDesktop: screenSize.width >= breakpoints.md,
    isPortrait: screenSize.height > screenSize.width,
    isLandscape: screenSize.width > screenSize.height,
    isTouch: isTouchDevice(),
    ...screenSize,
  };
};

// CSS-in-JS utilities
export const css = {
  // Mobile-first container
  mobileContainer: {
    width: '100%',
    maxWidth: '100vw',
    px: spacing.sm,
    '@media (min-width: 600px)': {
      maxWidth: '540px',
      px: spacing.md,
    },
    '@media (min-width: 900px)': {
      maxWidth: '720px',
      px: spacing.lg,
    },
    '@media (min-width: 1200px)': {
      maxWidth: '960px',
      px: spacing.xl,
    },
  },

  // Responsive text
  responsiveText: {
    fontSize: {
      xs: '0.875rem',
      sm: '0.9rem',
      md: '1rem',
      lg: '1.1rem',
      xl: '1.2rem',
    },
    lineHeight: 1.6,
  },

  // Touch-friendly buttons
  touchButton: {
    minHeight: 44, // iOS recommended minimum touch target
    minWidth: 44,
    px: spacing.md,
    py: spacing.sm,
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },

  // Safe area for mobile devices
  safeArea: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },

  // Responsive grid
  responsiveGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
      xl: 'repeat(6, 1fr)',
    },
    gap: spacing.md,
  },

  // Mobile navigation
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: 'background.paper',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    '@media (min-width: 900px)': {
      position: 'static',
      flexDirection: 'row',
      boxShadow: 'none',
    },
  },
};
