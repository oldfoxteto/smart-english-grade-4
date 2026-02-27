import React from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens } from '../../design-system/tokens';

type AppColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type AppColorWithDefault = AppColor | 'default';
type GridColumns = number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

export interface AppIconProps {
  icon: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  backgroundColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  icon,
  size = 'md',
  color = 'inherit',
  backgroundColor = 'transparent',
  onClick,
  disabled = false,
  ariaLabel,
}) => (
  <IconButton
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    sx={{
      width: tokens.icon.size[size],
      height: tokens.icon.size[size],
      color,
      backgroundColor,
      borderRadius: tokens.borderRadius.sm,
      transition: tokens.transitions.normal,
      '&:hover': {
        backgroundColor: backgroundColor === 'transparent' ? 'rgba(0, 0, 0, 0.04)' : backgroundColor,
      },
      '&:disabled': {
        opacity: 0.5,
      },
    }}
  >
    {icon}
  </IconButton>
);

export interface AppButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: AppColor;
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  ariaLabel,
  sx,
}) => (
  <Button
    variant={variant}
    color={color}
    size={size}
    startIcon={startIcon}
    endIcon={endIcon}
    onClick={onClick}
    disabled={disabled || loading}
    fullWidth={fullWidth}
    aria-label={ariaLabel}
    sx={{
      borderRadius: tokens.borderRadius.md,
      textTransform: 'none',
      fontWeight: 500,
      transition: tokens.transitions.normal,
      '&:hover': {
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      ...sx,
    }}
  >
    {children}
  </Button>
);

export interface AppCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  elevation?: number;
  padding?: number;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
  sx?: SxProps<Theme>;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  title,
  subtitle,
  actions,
  elevation = 1,
  padding = tokens.spacing.lg,
  onClick,
  hoverable = true,
  selected = false,
  sx,
}) => (
  <Card
    elevation={elevation}
    onClick={onClick}
    sx={{
      borderRadius: tokens.borderRadius.lg,
      cursor: onClick ? 'pointer' : 'default',
      transition: tokens.transitions.normal,
      border: selected ? `2px solid ${tokens.colors.primary[500]}` : 'none',
      '&:hover': hoverable
        ? {
            transform: 'translateY(-2px)',
            boxShadow: tokens.shadows.md,
          }
        : {},
      ...sx,
    }}
  >
    {(title || subtitle || actions) && (
      <Box sx={{ p: padding, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: tokens.spacing.md }}>
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600, mb: tokens.spacing.xs }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ ml: tokens.spacing.md }}>{actions}</Box>}
        </Box>
      </Box>
    )}
    <CardContent sx={{ p: padding, pt: title || subtitle || actions ? 0 : padding }}>{children}</CardContent>
  </Card>
);

export interface AppProgressProps {
  value: number;
  max?: number;
  color?: AppColor;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  sx?: SxProps<Theme>;
}

export const AppProgress: React.FC<AppProgressProps> = ({
  value,
  color = 'primary',
  size = 'medium',
  showLabel = false,
  label,
  variant = 'determinate',
  sx,
}) => {
  const getSizeHeight = () => {
    switch (size) {
      case 'small':
        return 4;
      case 'large':
        return 12;
      default:
        return 8;
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: tokens.spacing.xs }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {label || 'Progress'}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {Math.round(value)}%
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant={variant}
        value={value}
        color={color}
        sx={{
          height: getSizeHeight(),
          borderRadius: tokens.borderRadius.sm,
          '& .MuiLinearProgress-bar': {
            borderRadius: tokens.borderRadius.sm,
          },
        }}
      />
    </Box>
  );
};

export interface AppBadgeProps {
  children: React.ReactNode;
  badgeContent?: React.ReactNode;
  color?: AppColorWithDefault;
  overlap?: 'rectangular' | 'circular';
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  showZero?: boolean;
  max?: number;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  badgeContent,
  color = 'primary',
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  showZero = false,
  max = 99,
}) => (
  <Badge
    badgeContent={badgeContent}
    color={color}
    overlap={overlap}
    anchorOrigin={anchorOrigin}
    showZero={showZero}
    max={max}
  >
    {children}
  </Badge>
);

export interface AppAvatarProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: AppColorWithDefault;
  onClick?: () => void;
  ariaLabel?: string;
}

const avatarColorMap: Record<AppColor, string> = {
  primary: tokens.colors.primary[500],
  secondary: tokens.colors.secondary[500],
  success: tokens.colors.success[500],
  warning: tokens.colors.warning[500],
  error: tokens.colors.danger[500],
  info: tokens.colors.primary[400],
};

export const AppAvatar: React.FC<AppAvatarProps> = ({
  src,
  alt,
  children,
  size = 'md',
  color = 'default',
  onClick,
  ariaLabel,
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      default:
        return 40;
    }
  };

  return (
    <Avatar
      src={src}
      alt={alt}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        width: getSizeValue(),
        height: getSizeValue(),
        cursor: onClick ? 'pointer' : 'default',
        bgcolor: color === 'default' ? undefined : avatarColorMap[color],
      }}
    >
      {children}
    </Avatar>
  );
};

export interface AppChipProps {
  label: string;
  color?: AppColorWithDefault;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
  onDelete?: () => void;
  icon?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export const AppChip: React.FC<AppChipProps> = ({
  label,
  color = 'default',
  size = 'medium',
  variant = 'filled',
  onDelete,
  icon,
  clickable = false,
  onClick,
  sx,
}) => (
  <Chip
    label={label}
    color={color}
    size={size}
    variant={variant}
    onDelete={onDelete}
    icon={React.isValidElement(icon) ? icon : undefined}
    clickable={clickable}
    onClick={onClick}
    sx={{
      borderRadius: tokens.borderRadius.sm,
      fontWeight: 500,
      ...sx,
    }}
  />
);

export interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  header,
  sidebar,
  footer,
  maxWidth = 'lg',
  disableGutters = false,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {header && <Box component="header">{header}</Box>}

    <Box sx={{ display: 'flex', flex: 1 }}>
      {sidebar && (
        <Box component="aside" sx={{ width: 280, flexShrink: 0 }}>
          {sidebar}
        </Box>
      )}

      <Box component="main" sx={{ flex: 1, p: tokens.spacing.lg }}>
        <Container maxWidth={maxWidth} disableGutters={disableGutters}>
          {children}
        </Container>
      </Box>
    </Box>

    {footer && <Box component="footer">{footer}</Box>}
  </Box>
);

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  elevation?: number;
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?: 'inherit' | 'primary' | 'secondary' | 'transparent';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftActions,
  rightActions,
  elevation = 1,
  position = 'sticky',
  color = 'transparent',
}) => (
  <AppBar
    position={position}
    elevation={elevation}
    color={color}
    sx={
      color === 'transparent'
        ? {
            backgroundColor: tokens.colors.background.paper,
            color: tokens.colors.text.primary,
          }
        : undefined
    }
  >
    <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {leftActions && <Box sx={{ mr: tokens.spacing.md }}>{leftActions}</Box>}

        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {rightActions && <Box sx={{ ml: tokens.spacing.md }}>{rightActions}</Box>}
      </Box>
    </Toolbar>
  </AppBar>
);

export interface AppGridProps {
  children: React.ReactNode;
  spacing?: number;
  columns?: GridColumns;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  sx?: SxProps<Theme>;
}

const toGridTemplate = (cols?: GridColumns) => {
  if (typeof cols === 'number') {
    return `repeat(${cols}, minmax(0, 1fr))`;
  }

  return {
    xs: `repeat(${cols?.xs ?? 12}, minmax(0, 1fr))`,
    sm: `repeat(${cols?.sm ?? cols?.xs ?? 12}, minmax(0, 1fr))`,
    md: `repeat(${cols?.md ?? cols?.sm ?? cols?.xs ?? 12}, minmax(0, 1fr))`,
    lg: `repeat(${cols?.lg ?? cols?.md ?? cols?.sm ?? cols?.xs ?? 12}, minmax(0, 1fr))`,
    xl: `repeat(${cols?.xl ?? cols?.lg ?? cols?.md ?? cols?.sm ?? cols?.xs ?? 12}, minmax(0, 1fr))`,
  };
};

const toGridSpan = (xs?: number, sm?: number, md?: number, lg?: number, xl?: number) => ({
  xs: `span ${xs ?? 12}`,
  sm: `span ${sm ?? xs ?? 12}`,
  md: `span ${md ?? sm ?? xs ?? 12}`,
  lg: `span ${lg ?? md ?? sm ?? xs ?? 12}`,
  xl: `span ${xl ?? lg ?? md ?? sm ?? xs ?? 12}`,
});

export const AppGrid: React.FC<AppGridProps> = ({
  children,
  spacing = tokens.spacing.lg,
  columns,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  sx,
}) => {
  const isItem = item || xs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined;

  if (isItem) {
    return (
      <Box
        sx={{
          minWidth: 0,
          gridColumn: toGridSpan(xs, sm, md, lg, xl),
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: toGridTemplate(columns),
        gap: `${spacing}px`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export interface AppPaperProps {
  children: React.ReactNode;
  elevation?: number;
  square?: boolean;
  variant?: 'elevation' | 'outlined';
  padding?: number;
  onClick?: () => void;
  hoverable?: boolean;
  sx?: SxProps<Theme>;
}

export const AppPaper: React.FC<AppPaperProps> = ({
  children,
  elevation = 1,
  square = false,
  variant = 'elevation',
  padding = tokens.spacing.lg,
  onClick,
  hoverable = true,
  sx,
}) => (
  <Paper
    elevation={elevation}
    square={square}
    variant={variant}
    onClick={onClick}
    sx={{
      p: padding,
      borderRadius: tokens.borderRadius.lg,
      cursor: onClick ? 'pointer' : 'default',
      transition: tokens.transitions.normal,
      '&:hover': onClick && hoverable
        ? {
            transform: 'translateY(-1px)',
            boxShadow: tokens.shadows.md,
          }
        : {},
      ...sx,
    }}
  >
    {children}
  </Paper>
);
