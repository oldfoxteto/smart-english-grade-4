// Responsive Design System with Advanced UI Components
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  SxProps,
  Breakpoint,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Responsive Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  xxl: 1920,
} as const;

// Responsive Hook
export const useResponsive = () => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const currentBreakpoint = React.useMemo(() => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return 'xxl';
  }, [isXs, isSm, isMd, isLg, isXl]);
  
  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    breakpoints,
  };
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  container?: boolean;
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; };
  sx?: SxProps;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  container = false,
  spacing = 2,
  sx,
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getSpacing = () => {
    if (typeof spacing === 'number') return spacing;
    
    if (isMobile && spacing.xs) return spacing.xs;
    if (isTablet && spacing.md) return spacing.md;
    return spacing.lg || spacing.sm || 2;
  };
  
  const gridProps = {
    container,
    spacing: getSpacing(),
    sx,
  };
  
  return <Grid {...gridProps}>{children}</Grid>;
};

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;
  disableGutters?: boolean;
  sx?: SxProps;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  const getMaxWidth = () => {
    if (isMobile && maxWidth === 'lg') return 'md';
    return maxWidth;
  };
  
  return (
    <Container
      maxWidth={getMaxWidth()}
      disableGutters={disableGutters}
      sx={sx}
    >
      {children}
    </Container>
  );
};

// Responsive Layout Component
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarWidth?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: SxProps;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  sidebarWidth = 280,
  header,
  footer,
  sx,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ...sx }}>
      {/* Header */}
      {header && (
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {header}
        </Box>
      )}
      
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {sidebar && (
          <Box
            component="aside"
            sx={{
              width: sidebarOpen ? sidebarWidth : 0,
              flexShrink: 0,
              transition: 'width 0.3s ease',
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -sidebarWidth }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -sidebarWidth }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {sidebar}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
      
      {/* Footer */}
      {footer && (
        <Box
          component="footer"
          sx={{
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            py: 2,
            px: { xs: 2, sm: 3 },
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};

// Responsive Navigation Component
interface ResponsiveNavigationProps {
  items: Array<{
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  sx?: SxProps;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  orientation = 'horizontal',
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return (
      <Box sx={{ ...sx }}>
        {/* Mobile Navigation */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: item.active ? 'primary.main' : 'transparent',
                color: item.active ? 'primary.contrastText' : 'text.primary',
                border: item.active ? 'none' : '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: item.active ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {item.icon}
              <Typography variant="body2">{item.label}</Typography>
            </motion.button>
          ))}
        </Box>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: 1,
        ...sx,
      }}
    >
      {items.map((item, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={item.onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: item.active ? 'primary.main' : 'transparent',
            color: item.active ? 'primary.contrastText' : 'text.primary',
            border: item.active ? 'none' : '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: item.active ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          {item.icon}
          <Typography variant="body2">{item.label}</Typography>
        </motion.button>
      ))}
    </Box>
  );
};

// Responsive Card Component
interface ResponsiveCardProps {
  children: React.ReactNode;
  elevation?: number;
  hover?: boolean;
  sx?: SxProps;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  elevation = 2,
  hover = true,
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: isMobile ? 1 : elevation,
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      {children}
    </motion.div>
  );
};

// Responsive Image Component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sx?: SxProps;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  objectFit = 'cover',
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        aspectRatio,
        ...sx,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
        }}
      />
    </Box>
  );
};

// Responsive Text Component
interface ResponsiveTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  component?: React.ElementType;
  align?: 'left' | 'center' | 'right' | 'justify';
  sx?: SxProps;
  children: React.ReactNode;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  variant = 'body1',
  component = 'p',
  align = 'left',
  sx,
  children,
}) => {
  const { isMobile } = useResponsive();
  
  const getFontSize = () => {
    if (isMobile) {
      const sizes: Record<string, string> = {
        h1: '2rem',
        h2: '1.75rem',
        h3: '1.5rem',
        h4: '1.25rem',
        h5: '1.125rem',
        h6: '1rem',
        body1: '1rem',
        body2: '0.875rem',
        caption: '0.75rem',
      };
      return sizes[variant] || '1rem';
    }
    return undefined;
  };
  
  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      sx={{
        fontSize: getFontSize(),
        lineHeight: isMobile ? 1.4 : 1.5,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

// Responsive Button Component
interface ResponsiveButtonProps {
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: SxProps;
  onClick?: () => void;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  sx,
  onClick,
}) => {
  const { isMobile } = useResponsive();
  
  const getButtonSize = () => {
    if (isMobile) {
      const sizes: Record<string, 'small' | 'medium' | 'large'> = {
        small: 'small',
        medium: 'medium',
        large: 'large',
      };
      return sizes[size] || 'medium';
    }
    return size;
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
        fontSize: { xs: '0.875rem', sm: '1rem' },
        fontWeight: 600,
        borderRadius: 2,
        border: variant === 'outlined' ? '2px solid' : 'none',
        borderColor: variant === 'outlined' ? 'primary.main' : 'transparent',
        bgcolor: variant === 'contained' ? 'primary.main' : 'transparent',
        color: variant === 'contained' ? 'primary.contrastText' : 'primary.main',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        '&:hover': {
          bgcolor: variant === 'contained' ? 'primary.dark' : 'primary.light',
          borderColor: variant === 'outlined' ? 'primary.dark' : 'transparent',
          color: variant === 'outlined' ? 'primary.dark' : 'primary.contrastText',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        ...sx,
      }}
    >
      {children}
    </motion.button>
  );
};

// Responsive Form Component
interface ResponsiveFormProps {
  children: React.ReactNode;
  spacing?: number;
  sx?: SxProps;
}

export const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  spacing = 2,
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? spacing * 0.75 : spacing,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Responsive Table Component
interface ResponsiveTableProps {
  children: React.ReactNode;
  sx?: SxProps;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  sx,
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <Box
      sx={{
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 8,
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'grey.100',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'grey.300',
          borderRadius: 4,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Responsive Grid Item Component
interface ResponsiveGridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  sx?: SxProps;
}

export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  sx,
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getGridProps = () => {
    const props: any = {};
    
    if (xs !== undefined) props.xs = xs;
    if (sm !== undefined) props.sm = sm;
    if (md !== undefined) props.md = md;
    if (lg !== undefined) props.lg = lg;
    if (xl !== undefined) props.xl = xl;
    
    // Adjust for mobile
    if (isMobile && !xs && sm) {
      props.xs = 12;
      props.sm = sm;
    }
    
    if (isTablet && !xs && !sm && md) {
      props.xs = 12;
      props.sm = 6;
      props.md = md;
    }
    
    return props;
  };
  
  return (
    <Grid item {...getGridProps()} sx={sx}>
      {children}
    </Grid>
  );
};

export default {
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveLayout,
  ResponsiveNavigation,
  ResponsiveCard,
  ResponsiveImage,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveForm,
  ResponsiveTable,
  ResponsiveGridItem,
  useResponsive,
  breakpoints,
};
