// Performance Optimization with Code Splitting and Lazy Loading
import React, { Suspense, lazy, ComponentType, ReactNode, useMemo, useCallback } from 'react';
import { Box, CircularProgress, Typography, Paper, LinearProgress } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy loaded components with code splitting
const LessonsPage = lazy(() => import('../pages/LessonsPage').then(module => ({
  default: module.default
})));
const PracticePage = lazy(() => import('../pages/PracticePage').then(module => ({
  default: module.PracticePage
})));
const TestingPage = lazy(() => import('../pages/ProfessionalTestingPage').then(module => ({
  default: module.default
})));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(module => ({
  default: module.SettingsPage
})));
const AdvancedLearningHub = lazy(() => import('../pages/AdvancedLearningHub').then(module => ({
  default: module.default
})));
const EnhancedUIShowcase = lazy(() => import('../pages/EnhancedUIShowcase').then(module => ({
  default: module.default
})));

// Lazy loaded learning components
const AIReadingModule = lazy(() => import('../components/learning/AIReadingModule').then(module => ({
  default: module.default
})));
const AIConversationModule = lazy(() => import('../components/learning/AIConversationModule').then(module => ({
  default: module.default
})));
const InteractiveExerciseGenerator = lazy(() => import('../components/learning/InteractiveExerciseGenerator').then(module => ({
  default: module.default
})));
const GamificationSystem = lazy(() => import('../components/gamification/GamificationSystem').then(module => ({
  default: module.default
})));

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 2
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Skeleton loading component
const SkeletonLoader: React.FC<{ type?: 'page' | 'card' | 'list' }> = ({ type = 'page' }) => {
  if (type === 'page') {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: '60%' }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  
  if (type === 'card') {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ height: 200, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
        <Box sx={{ height: 24, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
        <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: '80%' }} />
      </Paper>
    );
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ height: 60, bgcolor: 'grey.200', borderRadius: 1 }} />
      ))}
    </Box>
  );
};

// Error boundary for lazy loaded components
const LazyErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load component
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please refresh the page and try again
        </Typography>
      </Box>
    }
  >
    {children}
  </ErrorBoundary>
);

// Higher-order component for lazy loading with error handling
const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode,
  errorFallback?: ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <LazyErrorBoundary>
      <Suspense fallback={fallback || <LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Preload components for better performance
const preloadComponent = (importFunc: () => Promise<{ default: ComponentType<any> }>) => {
  importFunc();
};

// Optimized router with lazy loading
export const OptimizedRouter: React.FC = () => {
  // Preload critical components
  React.useEffect(() => {
    // Preload frequently accessed components
    const timer = setTimeout(() => {
      preloadComponent(() => import('../pages/LessonsPage'));
      preloadComponent(() => import('../pages/PracticePage').then(module => ({
        default: module.PracticePage
      })));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Routes>
      <Route path="/lessons" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading lessons..." />}>
            <LessonsPage />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/practice" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading practice..." />}>
            <PracticePage />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/testing" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading tests..." />}>
            <TestingPage />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/settings" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
            <SettingsPage />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/advanced-learning" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading advanced learning..." />}>
            <AdvancedLearningHub />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/ui-showcase" element={
        <LazyErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading UI showcase..." />}>
            <EnhancedUIShowcase />
          </Suspense>
        </LazyErrorBoundary>
      } />
      
      <Route path="/" element={<Navigate to="/lessons" replace />} />
    </Routes>
  );
};

// Optimized learning hub with lazy loaded modules
export const OptimizedLearningHub: React.FC = () => {
  const [activeModule, setActiveModule] = React.useState<string>('reading');
  
  const modules = useMemo(() => ({
    reading: {
      component: withLazyLoading(
        () => import('../components/learning/AIReadingModule'),
        <SkeletonLoader type="card" />
      ),
      title: 'القراءة الذكية',
      icon: '📚'
    },
    conversation: {
      component: withLazyLoading(
        () => import('../components/learning/AIConversationModule'),
        <SkeletonLoader type="card" />
      ),
      title: 'المحادثة الذكية',
      icon: '🤖'
    },
    exercises: {
      component: withLazyLoading(
        () => import('../components/learning/InteractiveExerciseGenerator'),
        <SkeletonLoader type="card" />
      ),
      title: 'تمارين تفاعلية',
      icon: '🎯'
    },
    gamification: {
      component: withLazyLoading(
        () => import('../components/gamification/GamificationSystem'),
        <SkeletonLoader type="card" />
      ),
      title: 'التحفيز والإنجازات',
      icon: '🏆'
    }
  }), []);

  const handleModuleChange = useCallback((module: string) => {
    setActiveModule(module);
  }, []);

  const ActiveModuleComponent = modules[activeModule as keyof typeof modules]?.component;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        مركز التعلم المتقدم
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {Object.entries(modules).map(([key, module]) => (
          <button
            key={key}
            onClick={() => handleModuleChange(key)}
            style={{
              padding: '8px 16px',
              border: activeModule === key ? '2px solid #1976d2' : '1px solid #ccc',
              borderRadius: '8px',
              background: activeModule === key ? '#f5f5f5' : 'white',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: '8px' }}>{module.icon}</span>
            {module.title}
          </button>
        ))}
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <ActiveModuleComponent />
      </Box>
    </Box>
  );
};

// Performance monitoring hook
export const usePerformanceMonitoring = (componentName: string) => {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    loadTime: 0,
    memoryUsage: 0,
    errorCount: 0
  });

  React.useEffect(() => {
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        loadTime: renderTime,
        memoryUsage
      }));
      
      // Log performance warnings
      if (renderTime > 100) {
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
      
      if (memoryUsage > 50 * 1024 * 1024) { // 50MB
        console.warn(`${componentName} is using ${(memoryUsage / 1024 / 1024).toFixed(2)}MB memory`);
      }
    };
    
    // Measure after component mounts
    const timer = setTimeout(measurePerformance, 0);
    
    return () => clearTimeout(timer);
  }, [componentName]);

  const recordError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }));
  }, []);

  return { ...metrics, recordError };
};

// Optimized image component with lazy loading
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, width, height, className, style }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      ref={imgRef}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...style
      }}
      className={className}
    >
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100'
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
};

// Optimized list component with virtualization
export const OptimizedList: React.FC<{
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}> = ({ items, renderItem, itemHeight, containerHeight, overscan = 5 }) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <Box sx={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, top }) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Memoized components for performance
export const MemoizedCard = React.memo<{
  children: ReactNode;
  title?: string;
  onClick?: () => void;
}>(({ children, title, onClick }) => (
  <Paper
    sx={{ p: 2, cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    {title && <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>}
    {children}
  </Paper>
));

export const MemoizedButton = React.memo<{
  children: ReactNode;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}>(({ children, onClick, variant = 'contained', color = 'primary' }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: variant === 'outlined' ? '1px solid' : 'none',
      borderRadius: '4px',
      backgroundColor: variant === 'contained' ? '#1976d2' : 'transparent',
      color: variant === 'contained' ? 'white' : '#1976d2',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
));

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastExecuted = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// Bundle analyzer utilities
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('bundle') || entry.name.includes('chunk')) {
          console.log(`Bundle: ${entry.name}, Size: ${entry.transferSize} bytes`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  }
  
  return () => {};
};

// Memory leak prevention utilities
export const useCleanup = (cleanup: () => void) => {
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default {
  OptimizedRouter,
  OptimizedLearningHub,
  OptimizedImage,
  OptimizedList,
  MemoizedCard,
  MemoizedButton,
  usePerformanceMonitoring,
  debounce,
  throttle,
  useDebounce,
  useThrottle,
  analyzeBundleSize,
  useCleanup,
  useInterval
};
