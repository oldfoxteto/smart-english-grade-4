// Accessibility Components and Features
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  alpha,
  keyframes,
  css,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  VolumeUp,
  VolumeOff,
  ZoomIn,
  ZoomOut,
  FontSize,
  Contrast,
  LightMode,
  DarkMode,
  Refresh,
  Settings,
  KeyboardTab,
  TouchApp,
  Accessible,
  Accessibility,
  SettingsAccessibility,
  SettingsVoice,
  SettingsBrightnessHigh,
  SettingsBrightnessLow,
  SettingsAccessibilityNew,
} from '@mui/icons-material';

// Skip Link Component
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  sx?: any;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, sx }) => {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        position: 'absolute',
        top: -40,
        left: 0,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: 2,
        textDecoration: 'none',
        borderRadius: 1,
        fontWeight: 'bold',
        zIndex: 9999,
        '&:focus': {
          top: 16,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Focus Indicator Component
interface FocusIndicatorProps {
  children: React.ReactNode;
  sx?: any;
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ children, sx }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <Box
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      sx={{
        position: 'relative',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
          borderRadius: 1,
        },
        '&:focus-visible::after': {
          content: '""',
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 1,
          pointerEvents: 'none',
        },
        ...sx,
      }}
    >
      {children}
      {isFocused && (
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            pointerEvents: 'none',
            animation: 'pulse 2s infinite',
          }}
        />
      )}
    </Box>
  );
};

// Pulse animation
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

// ARIA Live Region
interface LiveRegionProps {
  politeness?: 'polite' | 'assertive' | 'off';
  children: React.ReactNode;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ politeness = 'polite', children }) => {
  const [announcement, setAnnouncement] = React.useState('');

  useEffect(() => {
    if (typeof children === 'string') {
      setAnnouncement(children);
      const timeout = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timeout);
    }
    setAnnouncement('');
    return undefined;
  }, [children]);
  
  return (
    <Box
      aria-live={politeness}
      aria-atomic="true"
      aria-label={announcement}
      sx={{
        position: 'absolute',
        left: -9999,
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {announcement}
    </Box>
  );
};

// Keyboard Navigation Component
interface KeyboardNavigationProps {
  children: React.ReactNode;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  sx?: any;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onNavigate,
  sx,
}) => {
  const theme = useTheme();
  const [showKeyboardHelp, setShowKeyboardHelp] = React.useState(false);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowUp':
            onNavigate?.('up');
            event.preventDefault();
            break;
          case 'ArrowDown':
            onNavigate?.('down');
            event.preventDefault();
            break;
          case 'ArrowLeft':
            onNavigate?.('left');
            event.preventDefault();
            break;
          case 'ArrowRight':
            onNavigate?.('right');
            event.preventDefault();
            break;
          case '?':
            setShowKeyboardHelp(!showKeyboardHelp);
            event.preventDefault();
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate, showKeyboardHelp]);
  
  return (
    <>
      {children}
      {showKeyboardHelp && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            zIndex: 9999,
            boxShadow: theme.shadows[24],
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            اختصارات لوحة المفاتيح
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + ↑</strong>: التنقل للأعلى
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + ↓</strong>: التنقل للأسفل
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + ←</strong>: التنقل لليسار
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + →</strong>: التنقل لليمين
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Alt + ?</strong>: إظهار/إخفاء المساعدة
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Tab</strong>: التنقل بين العناصر
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Enter</strong>: تنشيط العنصر النشط
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Space</strong>: تنشيط العنصر
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Esc</strong>: إغلاق الحوار
          </Typography>
          <Button
            onClick={() => setShowKeyboardHelp(false)}
            variant="contained"
            sx={{ mt: 2 }}
          >
            إغلاق
          </Button>
        </Box>
      )}
    </>
  );
};

// Screen Reader Only Component
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
};

// Visually Hidden Component
interface VisuallyHiddenProps {
  children: React.ReactNode;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
};

// High Contrast Mode Toggle
interface HighContrastToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  sx?: any;
}

export const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  checked,
  onChange,
  sx,
}) => {
  return (
    <Tooltip title="تبديل الوضع عالي التباين">
      <IconButton
        onClick={() => onChange(!checked)}
        color={checked ? 'primary' : 'default'}
        sx={{
          ...sx,
          '&.MuiIconButton-root': {
            backgroundColor: checked ? 'primary.main' : 'transparent',
            color: checked ? 'primary.contrastText' : 'text.primary',
          },
        }}
      >
        {checked ? <Contrast /> : <ContrastOutlined />}
      </IconButton>
    </Tooltip>
  );
};

// Font Size Adjuster
interface FontSizeAdjusterProps {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  onChange: (size: string) => void;
  sx?: any;
}

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  fontSize,
  onChange,
  sx,
}) => {
  const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
  const currentIndex = sizes.indexOf(fontSize);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Tooltip title="تصغير حجم الخط">
        <IconButton
          onClick={() => {
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : sizes.length - 1;
            onChange(sizes[nextIndex]);
          }}
          disabled={currentIndex === 0}
          size="small"
        >
          <ZoomOut />
        </IconButton>
      </Tooltip>
      
      <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
        {fontSize === 'small' ? 'صغير' : fontSize === 'medium' ? 'متوسط' : fontSize === 'large' ? 'كبير' : 'كبير جدا'}
      </Typography>
      
      <Tooltip title="تصغير حجم الخط">
        <IconButton
          onClick={() => {
            const nextIndex = currentIndex < sizes.length - 1 ? currentIndex + 1 : 0;
            onChange(sizes[nextIndex]);
          }}
          disabled={currentIndex === sizes.length - 1}
          size="small"
        >
          <ZoomIn />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Volume Control Component
interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  muted: boolean;
  onMuteToggle: () => void;
  sx?: any;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onChange,
  muted,
  onMuteToggle,
  sx,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Tooltip title={muted ? 'تشغيل الصوت' : 'كتمك الصوت'}>
        <IconButton
          onClick={onMuteToggle}
          color={muted ? 'default' : 'primary'}
          size="small"
        >
          {muted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Tooltip>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ minWidth: 30 }}>
          {muted ? 'مكتوم' : `${Math.round(volume * 100)}%`}
        </Typography>
      </Box>
      
      <Tooltip title="تقليل الصوت">
        <IconButton
          onClick={() => onChange(Math.max(0, volume - 10))}
          disabled={volume === 0}
          size="small"
        >
          <VolumeDown />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="زيادة الصوت">
        <IconButton
          onClick={() => onChange(Math.min(100, volume + 10))}
          disabled={volume === 100}
          size="small"
        >
          <VolumeUp />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Color Blindness Simulator
interface ColorBlindnessSimulatorProps {
  type: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  onChange: (type: string) => void;
  sx?: any;
}

export const ColorBlindnessSimulator: React.FC<ColorBlindnessSimulatorProps> = ({
  type,
  onChange,
  sx,
}) => {
  const filters = {
    normal: 'none',
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
  };
  
  return (
    <Tooltip title="محاكاة عمى الألوان">
      <IconButton
        onClick={() => onChange(type)}
        color="primary"
        size="small"
        sx={{
          ...sx,
          filter: filters[type as keyof typeof filters],
        }}
      >
        <Accessibility />
      </IconButton>
    </Tooltip>
  );
};

// Reading Mode Toggle
interface ReadingModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  sx?: any;
}

export const ReadingModeToggle: React.FC<ReadingModeToggleProps> = ({
  enabled,
  onChange,
  sx,
}) => {
  return (
    <Tooltip title={enabled ? 'إيقاف وضع القراءة' : 'تفعيل وضع القراءة'}>
      <IconButton
        onClick={() => onChange(!enabled)}
        color={enabled ? 'primary' : 'default'}
        sx={{
          ...sx,
          '&.MuiIconButton-root': {
            backgroundColor: enabled ? 'primary.main' : 'transparent',
            color: enabled ? 'primary.contrastText' : 'text.primary',
          },
        }}
      >
        <MenuBook />
      </IconButton>
    </Tooltip>
  );
};

// Animation Control Toggle
interface AnimationControlProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  sx?: any;
}

export const AnimationControl: React.FC<AnimationControlProps> = ({
  enabled,
  onChange,
  sx,
}) => {
  return (
    <Tooltip title={enabled ? 'إيقاف الحركات' : 'تفعيل الحركات'}>
      <IconButton
        onClick={() => onChange(!enabled)}
        color={enabled ? 'primary' : 'default'}
        sx={{
          ...sx,
          '&.MuiIconButton-root': {
            backgroundColor: enabled ? 'primary.main' : 'transparent',
            color: enabled ? 'primary.contrastText' : 'text.primary',
          },
        }}
      >
        {enabled ? <Refresh /> : <Refresh />}
      </IconButton>
    </Tooltip>
  );
};

// Accessibility Toolbar
interface AccessibilityToolbarProps {
  highContrast: boolean;
  fontSize: string;
  volume: number;
  muted: boolean;
  readingMode: boolean;
  animationsEnabled: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  onFontSizeChange: (size: string) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onReadingModeToggle: (enabled: boolean) => void;
  onAnimationToggle: (enabled: boolean) => void;
  sx?: any;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  highContrast,
  fontSize,
  volume,
  muted,
  readingMode,
  animationsEnabled,
  onHighContrastChange,
  onFontSizeChange,
  onVolumeChange,
  onMuteToggle,
  onReadingModeToggle,
  onAnimationToggle,
  sx,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 8,
        zIndex: 1000,
        ...sx,
      }}
    >
      <Typography variant="caption" sx={{ textAlign: 'center', mb: 1 }}>
        تسهيل الوصول
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <HighContrastToggle
          checked={highContrast}
          onChange={onHighContrastChange}
        />
        <FontSizeAdjuster
          fontSize={fontSize}
          onChange={onFontSizeChange}
        />
        <VolumeControl
          volume={volume}
          onChange={onVolumeChange}
          muted={muted}
          onMuteToggle={onMuteToggle}
        />
        <ReadingModeToggle
          enabled={readingMode}
          onChange={onReadingModeToggle}
        />
        <AnimationControl
          enabled={animationsEnabled}
          onChange={onAnimationToggle}
        />
      </Box>
    </Box>
  );
};

// Accessibility Checker Component
interface AccessibilityCheckerProps {
  children: React.ReactNode;
  onIssuesFound?: (issues: string[]) => void;
  sx?: any;
}

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  children,
  onIssuesFound,
  sx,
}) => {
  const [issues, setIssues] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const checkAccessibility = () => {
      const foundIssues: string[] = [];
      
      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        foundIssues.push(`${images.length} صور بدون نص بديل`);
      }
      
      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]), textarea:not([aria-label]), select:not([aria-label])');
      const unlabeledInputs = Array.from(inputs).filter(input => !input.labels || input.labels.length === 0);
      if (unlabeledInputs.length > 0) {
        foundIssues.push(`${unlabeledInputs.length} حقول إدخال بدون تصنيف`);
      }
      
      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      let headingIssues = 0;
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > lastLevel + 1) {
          headingIssues++;
        }
        lastLevel = level;
      });
      
      if (headingIssues > 0) {
        foundIssues.push(`${headingIssues} مشكلة في هيكل العناوين`);
      }
      
      setIssues(foundIssues);
      onIssuesFound?.(foundIssues);
    };
    
    // Check accessibility on mount and when dependencies change
    checkAccessibility();
    
    // Set up a mutation observer to check for dynamic changes
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    
    return () => {
      observer.disconnect();
    };
  }, [children, onIssuesFound]);
  
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {children}
      {issues.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            p: 2,
            borderRadius: 2,
            boxShadow: 8,
            zIndex: 9999,
            maxWidth: 300,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            ⚠️ مشاكل في إمكانية الوصول
          </Typography>
          <Typography variant="body2">
            تم العثور على {issues.length} مشكلة:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {issues.map((issue, index) => (
              <Typography key={index} component="li" variant="body2">
                {issue}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default {
  SkipLink,
  FocusIndicator,
  LiveRegion,
  KeyboardNavigation,
  ScreenReaderOnly,
  VisuallyHidden,
  HighContrastToggle,
  FontSizeAdjuster,
  VolumeControl,
  ColorBlindnessSimulator,
  ReadingModeToggle,
  AnimationControl,
  AccessibilityToolbar,
  AccessibilityChecker,
};
