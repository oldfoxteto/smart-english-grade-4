// Animation and Micro-interactions System
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fade,
  Slide,
  Grow,
  Zoom,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  keyframes,
  alpha,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  Speed,
  SlowMotionVideo,
  Animation,
  MotionPhotosOn,
  MotionPhotosAuto,
  MotionPhotosPaused,
  FlipCameraAndroid,
  RotateRight,
  RotateLeft,
  ExpandMore,
  ExpandLess,
  Add,
  Remove,
  OpenWith,
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  Success,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Visibility,
  VisibilityOff,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  BrightnessHigh,
  BrightnessLow,
  Contrast,
  AutoAwesome,
  AutoFixHigh,
  AutoFixOff,
  AutoAwesomeMosaic,
  AutoAwesomeMotion,
  AutoGraph,
  AutoMode,
  AutoStories,
  AutoDelete,
  AutoModeOff,
  AutoModeOn,
  AutoFixHigh as AutoFixHighIcon,
  AutoFixOff as AutoFixOffIcon,
} from '@mui/icons-material';

// Animation Presets
export const animationPresets = {
  // Entrance Animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
    transition: { duration: 0.3 },
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
    transition: { duration: 0.3 },
  },
  
  // Emphasis Animations
  bounce: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.6, times: [0, 0.5, 1] },
  },
  pulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity },
  },
  shake: {
    initial: { x: 0 },
    animate: { x: [0, -10, 10, -10, 10, 0] },
    transition: { duration: 0.6 },
  },
  wiggle: {
    initial: { rotate: 0 },
    animate: { rotate: [0, -3, 3, -3, 3, 0] },
    transition: { duration: 0.6 },
  },
  heartbeat: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1.5, repeat: Infinity },
  },
  
  // Exit Animations
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideOutUp: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: -20 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  slideOutDown: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: 20 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  slideOutLeft: {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: -20 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  slideOutRight: {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: 20 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.8 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  },
  rotateOut: {
    initial: { opacity: 1, rotate: 0 },
    animate: { opacity: 0, rotate: 180 },
    exit: { opacity: 0, rotate: 180 },
    transition: { duration: 0.3 },
  },
  flipOut: {
    initial: { opacity: 1, rotateY: 0 },
    animate: { opacity: 0, rotateY: 90 },
    exit: { opacity: 0, rotateY: 90 },
    transition: { duration: 0.3 },
  },
};

// Custom Keyframes
export const customKeyframes = {
  shimmer: keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  `,
  gradientShift: keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `,
  float: keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  `,
  swing: keyframes`
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(15deg); }
    40% { transform: rotate(-10deg); }
    60% { transform: rotate(5deg); }
    80% { transform: rotate(-5deg); }
  `,
  tada: keyframes`
    0% { transform: scale(1); }
    10%, 20% { transform: scale(0.9) rotate(-3deg); }
    30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
    40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
    100% { transform: scale(1) rotate(0deg); }
  `,
  wobble: keyframes`
    0% { transform: translateX(0%); }
    15% { transform: translateX(-25%) rotate(-5deg); }
    30% { transform: translateX(20%) rotate(3deg); }
    45% { transform: translateX(-15%) rotate(-3deg); }
    60% { transform: translateX(10%) rotate(2deg); }
    75% { transform: translateX(-5%) rotate(-1deg); }
    100% { transform: translateX(0%); }
  `,
  jelly: keyframes`
    0%, 100% { transform: scale(1, 1); }
    25% { transform: scale(0.9, 1.1); }
    50% { transform: scale(1.1, 0.9); }
    75% { transform: scale(0.95, 1.05); }
  `,
  rubberBand: keyframes`
    0% { transform: scale(1); }
    30% { transform: scale(1.25, 0.75); }
    40% { transform: scale(0.75, 1.25); }
    50% { transform: scale(1.15, 0.85); }
    65% { transform: scale(0.95, 1.05); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1); }
  `,
};

// Animated Component Wrapper
interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation: keyof typeof animationPresets;
  duration?: number;
  delay?: number;
  repeat?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  sx?: any;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation,
  duration = 0.3,
  delay = 0,
  repeat = false,
  direction = 'normal',
  sx,
}) => {
  const preset = animationPresets[animation];
  
  return (
    <Box
      sx={{
        ...sx,
        animation: `${animation} ${duration}s ${delay}s ${direction} ${repeat ? 'infinite' : ''}`,
        ...preset.animate,
      }}
    >
      {children}
    </Box>
  );
};

// Hover Animation Component
interface HoverAnimationProps {
  children: React.ReactNode;
  animation: 'scale' | 'lift' | 'glow' | 'rotate' | 'slide' | 'fade';
  intensity?: 'light' | 'medium' | 'strong';
  sx?: any;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  animation,
  intensity = 'medium',
  sx,
}) => {
  const getAnimationStyles = () => {
    const intensityMap = {
      light: { scale: 1.02, y: -2, glow: 4 },
      medium: { scale: 1.05, y: -4, glow: 8 },
      strong: { scale: 1.1, y: -8, glow: 16 },
    };
    
    const values = intensityMap[intensity];
    
    switch (animation) {
      case 'scale':
        return {
          '&:hover': {
            transform: `scale(${values.scale})`,
            transition: 'transform 0.3s ease',
          },
        };
      case 'lift':
        return {
          '&:hover': {
            transform: `translateY(${values.y}px)`,
            boxShadow: `0 ${values.glow}px ${values.glow * 2}px rgba(0,0,0,0.2)`,
            transition: 'all 0.3s ease',
          },
        };
      case 'glow':
        return {
          '&:hover': {
            boxShadow: `0 0 ${values.glow}px ${alpha('#1976d2', 0.5)}`,
            transition: 'box-shadow 0.3s ease',
          },
        };
      case 'rotate':
        return {
          '&:hover': {
            transform: 'rotate(5deg)',
            transition: 'transform 0.3s ease',
          },
        };
      case 'slide':
        return {
          '&:hover': {
            transform: 'translateX(8px)',
            transition: 'transform 0.3s ease',
          },
        };
      case 'fade':
        return {
          '&:hover': {
            opacity: 0.8,
            transition: 'opacity 0.3s ease',
          },
        };
      default:
        return {};
    }
  };
  
  return (
    <Box sx={getAnimationStyles()}>
      {children}
    </Box>
  );
};

// Loading Animation Component
interface LoadingAnimationProps {
  type: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bounce' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  sx?: any;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type,
  size = 'medium',
  color = 'primary.main',
  sx,
}) => {
  const getSize = () => {
    const sizes = {
      small: 24,
      medium: 32,
      large: 48,
    };
    return sizes[size];
  };
  
  const getAnimation = () => {
    switch (type) {
      case 'spinner':
        return (
          <Box
            sx={{
              width: getSize(),
              height: getSize(),
              border: `3px solid ${alpha(color, 0.3)}`,
              borderTop: `3px solid ${color}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              ...sx,
            }}
          />
        );
      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 1, ...sx }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: getSize() / 3,
                  height: getSize() / 3,
                  bgcolor: color,
                  borderRadius: '50%',
                  animation: `bounce 1.4s infinite ease-in-out both`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </Box>
        );
      case 'pulse':
        return (
          <Box
            sx={{
              width: getSize(),
              height: getSize(),
              bgcolor: color,
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
              ...sx,
            }}
          />
        );
      case 'wave':
        return (
          <Box sx={{ display: 'flex', gap: 1, ...sx }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  width: getSize() / 4,
                  height: getSize(),
                  bgcolor: color,
                  borderRadius: 2,
                  animation: 'wave 1.2s infinite ease-in-out',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </Box>
        );
      case 'bounce':
        return (
          <Box
            sx={{
              width: getSize(),
              height: getSize(),
              bgcolor: color,
              borderRadius: '50%',
              animation: 'bounce 1s infinite',
              ...sx,
            }}
          />
        );
      case 'skeleton':
        return (
          <Box
            sx={{
              width: '100%',
              height: getSize(),
              bgcolor: alpha(color, 0.1),
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${alpha(color, 0.3)}, transparent)`,
                animation: 'shimmer 2s infinite',
              },
              ...sx,
            }}
          />
        );
      default:
        return null;
    }
  };
  
  return getAnimation();
};

// Progress Animation Component
interface ProgressAnimationProps {
  value: number;
  max: number;
  type: 'linear' | 'circular' | 'wave';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  sx?: any;
}

export const ProgressAnimation: React.FC<ProgressAnimationProps> = ({
  value,
  max,
  type,
  color = 'primary.main',
  size = 'medium',
  animated = true,
  sx,
}) => {
  const percentage = (value / max) * 100;
  
  if (type === 'linear') {
    return (
      <Box
        sx={{
          width: '100%',
          height: size === 'small' ? 4 : size === 'medium' ? 8 : 12,
          bgcolor: alpha(color, 0.2),
          borderRadius: 2,
          overflow: 'hidden',
          ...sx,
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: '100%',
            bgcolor: color,
            borderRadius: 2,
            transition: animated ? 'width 0.3s ease' : 'none',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.3)}, transparent)`,
              animation: animated ? 'shimmer 2s infinite' : 'none',
            },
          }}
        />
      </Box>
    );
  }
  
  if (type === 'circular') {
    const getSize = () => {
      const sizes = {
        small: 40,
        medium: 60,
        large: 80,
      };
      return sizes[size];
    };
    
    const circumference = 2 * Math.PI * (getSize() / 2 - 4);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <Box
        sx={{
          position: 'relative',
          width: getSize(),
          height: getSize(),
          ...sx,
        }}
      >
        <svg
          width={getSize()}
          height={getSize()}
          sx={{
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx={getSize() / 2}
            cy={getSize() / 2}
            r={getSize() / 2 - 4}
            fill="none"
            stroke={alpha(color, 0.2)}
            strokeWidth={4}
          />
          <circle
            cx={getSize() / 2}
            cy={getSize() / 2}
            r={getSize() / 2 - 4}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: animated ? 'stroke-dashoffset 0.3s ease' : 'none',
            }}
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: size === 'small' ? 12 : size === 'medium' ? 16 : 20,
            fontWeight: 'bold',
            color: color,
          }}
        >
          {Math.round(percentage)}%
        </Box>
      </Box>
    );
  }
  
  if (type === 'wave') {
    return (
      <Box
        sx={{
          width: '100%',
          height: size === 'small' ? 40 : size === 'medium' ? 60 : 80,
          bgcolor: alpha(color, 0.1),
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          ...sx,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${percentage}%`,
            bgcolor: color,
            transition: animated ? 'height 0.3s ease' : 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -10,
              left: -50%',
              width: '200%',
              height: 20,
              background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.3)}, transparent)`,
              animation: animated ? 'wave 2s infinite' : 'none',
            },
          }}
        />
      </Box>
    );
  }
  
  return null;
};

// Interactive Animation Component
interface InteractiveAnimationProps {
  children: React.ReactNode;
  trigger: 'click' | 'hover' | 'focus' | 'visible';
  animation: keyof typeof animationPresets;
  resetOnExit?: boolean;
  sx?: any;
}

export const InteractiveAnimation: React.FC<InteractiveAnimationProps> = ({
  children,
  trigger,
  animation,
  resetOnExit = true,
  sx,
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  
  const handleTrigger = () => {
    if (!hasAnimated || !resetOnExit) {
      setIsAnimating(true);
      setHasAnimated(true);
      
      if (resetOnExit) {
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    }
  };
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let observer: IntersectionObserver;
    
    if (trigger === 'visible') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleTrigger();
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(element);
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [trigger]);
  
  const getEventHandlers = () => {
    switch (trigger) {
      case 'click':
        return {
          onClick: handleTrigger,
        };
      case 'hover':
        return {
          onMouseEnter: handleTrigger,
          onMouseLeave: () => setIsAnimating(false),
        };
      case 'focus':
        return {
          onFocus: handleTrigger,
          onBlur: () => setIsAnimating(false),
        };
      default:
        return {};
    }
  };
  
  const preset = animationPresets[animation];
  
  return (
    <Box
      ref={elementRef}
      sx={{
        ...sx,
        ...(isAnimating ? preset.animate : {}),
        transition: 'all 0.3s ease',
      }}
      {...getEventHandlers()}
    >
      {children}
    </Box>
  );
};

// Animation Control Panel
interface AnimationControlPanelProps {
  animationsEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  onAnimationsToggle: (enabled: boolean) => void;
  onAnimationSpeedChange: (speed: string) => void;
  sx?: any;
}

export const AnimationControlPanel: React.FC<AnimationControlPanelProps> = ({
  animationsEnabled,
  animationSpeed,
  onAnimationsToggle,
  onAnimationSpeedChange,
  sx,
}) => {
  const getSpeedMultiplier = () => {
    switch (animationSpeed) {
      case 'slow': return 2;
      case 'normal': return 1;
      case 'fast': return 0.5;
      default: return 1;
    }
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
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
        التحكم في الحركات
      </Typography>
      
      <Tooltip title={animationsEnabled ? 'إيقاف الحركات' : 'تفعيل الحركات'}>
        <IconButton
          onClick={() => onAnimationsToggle(!animationsEnabled)}
          color={animationsEnabled ? 'primary' : 'default'}
          size="small"
        >
          {animationsEnabled ? <MotionPhotosOn /> : <MotionPhotosOff />}
        </IconButton>
      </Tooltip>
      
      <Tooltip title={`سرعة الحركة: ${animationSpeed === 'slow' ? 'بطيئة' : animationSpeed === 'normal' ? 'عادية' : 'سريعة'}`}>
        <IconButton
          onClick={() => {
            const speeds = ['slow', 'normal', 'fast'];
            const currentIndex = speeds.indexOf(animationSpeed);
            const nextIndex = (currentIndex + 1) % speeds.length;
            onAnimationSpeedChange(speeds[nextIndex]);
          }}
          color="primary"
          size="small"
        >
          {animationSpeed === 'slow' ? <SlowMotionVideo /> : animationSpeed === 'fast' ? <Speed /> : <PlayArrow />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default {
  animationPresets,
  customKeyframes,
  AnimatedWrapper,
  HoverAnimation,
  LoadingAnimation,
  ProgressAnimation,
  InteractiveAnimation,
  AnimationControlPanel,
};
