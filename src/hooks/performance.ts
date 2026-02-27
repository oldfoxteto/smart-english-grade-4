// Performance Optimization Utilities
import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

// Memoization Hook
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  _deps: React.DependencyList
): T {
  return callback;
}

// Debounce Hook
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Throttle Hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
}

// Intersection Observer Hook
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver>();
  
  const observe = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  }, []);
  
  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  }, []);
  
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      setEntries(entries);
    }, options);
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [options]);
  
  return { entries, observe, unobserve };
}

// Virtual Scrolling Hook
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    onScroll: (e: React.UIEvent) => setScrollTop(e.currentTarget.scrollTop)
  };
}

// Image Lazy Loading Hook
export function useLazyLoading(
  src: string,
  options: IntersectionObserverInit = {}
) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { entries, observe } = useIntersectionObserver(options);
  
  useEffect(() => {
    if (imgRef.current) {
      observe(imgRef.current);
    }
  }, [observe]);
  
  useEffect(() => {
    const entry = entries[0];
    if (entry?.isIntersecting && src) {
      setImageSrc(src);
      setLoading(false);
    }
  }, [entries, src]);
  
  return {
    ref: imgRef,
    src: imageSrc,
    loading,
    error
  };
}

// Performance Monitoring Hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  
  useEffect(() => {
    renderCount.current++;
    const startTime = performance.now();
    const renderTimesRef = renderTimes.current;
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimesRef.push(renderTime);
      
      // Keep only last 10 renders
      if (renderTimesRef.length > 10) {
        renderTimesRef.shift();
      }
      
      // Log performance warnings
      if (renderTime > 16) {
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
  
  const averageRenderTime = useMemo(() => {
    const times = renderTimes.current;
    return times.length > 0 
      ? times.reduce((a, b) => a + b, 0) / times.length 
      : 0;
  }, []);
  
  return {
    renderCount: renderCount.current,
    averageRenderTime,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0
  };
}

// Memory Usage Hook
export function useMemoryUsage() {
  const [memoryUsage, setMemoryUsage] = useState({
    used: 0,
    total: 0,
    percentage: 0
  });
  
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const percentage = (used / total) * 100;
        
        setMemoryUsage({ used, total, percentage });
      }
    };
    
    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return memoryUsage;
}

// Network Status Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('');
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, connectionType };
}

// Cache Management Hook
export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl: number = 300000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cached = cache.current.get(key);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < ttl) {
        setData(cached.data);
        setLoading(false);
        return;
      }
      
      const result = await fetcher();
      cache.current.set(key, { data: result, timestamp: now });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const invalidate = useCallback(() => {
    cache.current.delete(key);
    fetchData();
  }, [key, fetchData]);
  
  return { data, loading, error, refetch: fetchData, invalidate };
}

// Batch State Updates Hook
export function useBatchUpdates<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const batchUpdate = useCallback((updates: Partial<T>) => {
    Object.assign(pendingUpdates.current, updates);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 0);
  }, []);
  
  return [state, batchUpdate] as const;
}
