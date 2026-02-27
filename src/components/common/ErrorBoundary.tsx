// Error Boundary Component with Comprehensive Error Handling
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  ExpandMore,
  ExpandLess,
  BugReport,
  ReportProblem,
  Info,
} from '@mui/icons-material';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  logLevel?: 'error' | 'warning' | 'info';
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console
    this.logError(error, errorInfo);

    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }

    // Send error to monitoring service
    this.sendErrorToMonitoring(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const logLevel = this.props.logLevel || 'error';
    const logMessage = `[${logLevel.toUpperCase()}] ${this.state.errorId}: ${error.message}`;
    
    switch (logLevel) {
      case 'error':
        console.error(logMessage, error, errorInfo);
        break;
      case 'warning':
        console.warn(logMessage, error, errorInfo);
        break;
      case 'info':
        console.info(logMessage, error, errorInfo);
        break;
    }

    // Log additional context
    console.group(`Error Context - ${this.state.errorId}`);
    console.log('Component Stack:', errorInfo.componentStack);
    console.log('Error Stack:', error.stack);
    console.log('User Agent:', navigator.userAgent);
    console.log('URL:', window.location.href);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  };

  private sendErrorToMonitoring = (error: Error, errorInfo: ErrorInfo) => {
    // Send to monitoring service (e.g., Sentry, LogRocket, etc.)
    try {
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount,
      };

      // Example: Send to monitoring service
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          extra: errorData,
          tags: {
            errorBoundary: 'true',
            errorId: this.state.errorId,
          },
        });
      }

      // Send to custom monitoring endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail if monitoring endpoint is not available
        console.warn('Failed to send error to monitoring service');
      });
    } catch (monitoringError) {
      console.warn('Failed to send error to monitoring service:', monitoringError);
    }
  };

  private handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        showDetails: false,
      }));

      // Clear any existing retry timeout
      if (this.retryTimeoutId) {
        clearTimeout(this.retryTimeoutId);
      }

      // Set a timeout to handle retry failures
      this.retryTimeoutId = setTimeout(() => {
        console.warn(`Retry ${this.state.retryCount + 1} failed for error ${this.state.errorId}`);
      }, 5000);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private getErrorSeverity = (error: Error): 'error' | 'warning' | 'info' => {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'warning';
    }
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'warning';
    }
    return 'error';
  };

  private getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <ReportProblem color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <ErrorOutline color="error" />;
    }
  };

  private getErrorTitle = (error: Error): string => {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'فشل تحميل المكون';
    }
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'مشكلة في الاتصال';
    }
    return 'حدث خطأ غير متوقع';
  };

  private getErrorMessage = (error: Error): string => {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'فشل تحميل بعض أجزاء التطبيق. يرجى تحديث الصفحة والمحاولة مرة أخرى.';
    }
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
    }
    return 'حدث خطأ أثناء تشغيل التطبيق. فريق العمل يعمل على حل المشكلة.';
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const severity = this.getErrorSeverity(this.state.error);
      const icon = this.getErrorIcon(severity);
      const title = this.getErrorTitle(this.state.error);
      const message = this.getErrorMessage(this.state.error);

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 3 }}>
              {icon}
            </Box>

            <Alert severity={severity} sx={{ mb: 3 }}>
              <AlertTitle>{title}</AlertTitle>
              {message}
            </Alert>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                معرف الخطأ: {this.state.errorId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                عدد المحاولات: {this.state.retryCount}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= (this.props.maxRetries || 3)}
              >
                إعادة المحاولة
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={this.handleReload}
              >
                تحديث الصفحة
              </Button>
            </Stack>

            {this.props.showErrorDetails !== false && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                  onClick={this.toggleDetails}
                >
                  {this.state.showDetails ? 'إخفاء' : 'إظهار'} التفاصيل
                </Button>

                <Collapse in={this.state.showDetails}>
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        تفاصيل الخطأ:
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ 
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: 200,
                        bgcolor: 'grey.200',
                        p: 1,
                        borderRadius: 1,
                      }}>
                        {this.state.error.stack}
                      </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: 'grey.100', mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        معلومات المكون:
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ 
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: 200,
                        bgcolor: 'grey.200',
                        p: 1,
                        borderRadius: 1,
                      }}>
                        {this.state.errorInfo?.componentStack}
                      </Typography>
                    </Paper>
                  </Box>
                </Collapse>
              </Box>
            )}

            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم
              </Typography>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Functional Error Boundary Hook
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = React.useState<ErrorInfo | null>(null);

  const handleError = React.useCallback((error: Error, errorInfo: ErrorInfo) => {
    setError(error);
    setErrorInfo(errorInfo);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  return {
    error,
    errorInfo,
    handleError,
    resetError,
  };
};

// Error Boundary Provider
interface ErrorBoundaryProviderProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  onError,
}) => {
  return (
    <ErrorBoundary onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

// Async Error Boundary Hook
export const useAsyncError = () => {
  const [state, setState] = React.useState({
    error: null as Error | null,
    isLoading: false,
  });

  const execute = React.useCallback(async <T,>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    setState({ error: null, isLoading: true });
    
    try {
      const result = await asyncFunction();
      setState({ error: null, isLoading: false });
      return result;
    } catch (error) {
      setState({ error: error as Error, isLoading: false });
      return null;
    }
  }, []);

  const reset = React.useCallback(() => {
    setState({ error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

// Error Boundary with Retry Logic
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
