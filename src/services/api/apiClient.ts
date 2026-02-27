import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import EncodingFix from '../../utils/encodingFix';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 30000; // 30 seconds

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Request interceptor types
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  retryCount?: number;
}

// API Client Class
class ApiClient {
  private instance: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = this.getAuthToken();
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp
        config.headers['X-Request-Time'] = Date.now().toString();

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Calculate response time
        const requestTime = response.config.headers['X-Request-Time'];
        const responseTime = Date.now();
        const duration = responseTime - parseInt(requestTime);
        
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        
        // Fix Arabic text encoding in response
        const fixedResponse = EncodingFix.fixAPIResponse(response.data);
        response.data = fixedResponse;
        
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (!originalRequest.skipErrorHandler) {
          this.handleError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshTokenPromise;
      this.refreshTokenPromise = null;
      return token;
    } catch (error) {
      this.refreshTokenPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return token;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  private handleAuthError() {
    // Clear tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login
    window.location.href = '/login';
    
    // Show error message
    toast.error('جلسة منتهية. يرجى تسجيل الدخول مرة أخرى.');
  }

  private handleError(error: any) {
    let message = 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
    
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      // Fix Arabic text in error message
      const errorMessage = data?.message || '';
      const fixedMessage = EncodingFix.fixAll(errorMessage);
      
      switch (status) {
        case 400:
          message = fixedMessage || 'طلب غير صالح';
          break;
        case 401:
          message = 'غير مصرح لك بالوصول';
          break;
        case 403:
          message = 'ممنوع الوصول';
          break;
        case 404:
          message = 'المورد غير موجود';
          break;
        case 422:
          message = fixedMessage || 'بيانات غير صالحة';
          break;
        case 429:
          message = 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً';
          break;
        case 500:
          message = 'خطأ في الخادم';
          break;
        case 503:
          message = 'الخدمة غير متاحة';
          break;
        default:
          message = fixedMessage || message;
      }
    } else if (error.request) {
      // Network error
      message = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت';
    }

    toast.error(message);
    console.error('API Error:', error);
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // File upload
  async upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    const response = await this.instance.post<ApiResponse<T>>(url, formData, uploadConfig);
    return response.data;
  }

  // Multiple file upload
  async uploadMultiple<T = any>(url: string, files: File[], config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    const response = await this.instance.post<ApiResponse<T>>(url, formData, uploadConfig);
    return response.data;
  }

  // Download file
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    const downloadConfig = {
      ...config,
      responseType: 'blob',
    };

    const response = await this.instance.get(url, downloadConfig);
    
    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Cancel request
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Check if request was cancelled
  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get API version
  async getVersion(): Promise<string> {
    try {
      const response = await this.get('/version');
      return response.data.version;
    } catch (error) {
      return 'unknown';
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export types and instance
export { ApiClient };
export default apiClient;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    GET: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
  
  // Students
  STUDENTS: {
    LIST: '/students',
    GET: '/students/:id',
    CREATE: '/students',
    UPDATE: '/students/:id',
    DELETE: '/students/:id',
    PROGRESS: '/students/:id/progress',
    ACHIEVEMENTS: '/students/:id/achievements',
    ACTIVITY: '/students/:id/activity',
  },
  
  // Lessons
  LESSONS: {
    LIST: '/lessons',
    GET: '/lessons/:id',
    CREATE: '/lessons',
    UPDATE: '/lessons/:id',
    DELETE: '/lessons/:id',
    PUBLISH: '/lessons/:id/publish',
    UNPUBLISH: '/lessons/:id/unpublish',
  },
  
  // Exercises
  EXERCISES: {
    LIST: '/exercises',
    GET: '/exercises/:id',
    CREATE: '/exercises',
    UPDATE: '/exercises/:id',
    DELETE: '/exercises/:id',
    SUBMIT: '/exercises/:id/submit',
    RESULTS: '/exercises/:id/results',
  },
  
  // Progress
  PROGRESS: {
    OVERVIEW: '/progress/overview',
    STUDENT: '/progress/student/:id',
    CLASS: '/progress/class/:id',
    SKILL: '/progress/skill/:skill',
    TIMEFRAME: '/progress/timeframe',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    ENGAGEMENT: '/analytics/engagement',
    PERFORMANCE: '/analytics/performance',
    USAGE: '/analytics/usage',
    REPORTS: '/analytics/reports',
  },
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    VOICE_RECOGNITION: '/ai/voice/recognition',
    TEXT_TO_SPEECH: '/ai/voice/synthesis',
    TRANSLATION: '/ai/translation',
    SUGGESTIONS: '/ai/suggestions',
    FEEDBACK: '/ai/feedback',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },
  
  // Files
  FILES: {
    UPLOAD: '/files/upload',
    UPLOAD_MULTIPLE: '/files/upload-multiple',
    DOWNLOAD: '/files/:id/download',
    DELETE: '/files/:id/delete',
  },
  
  // System
  SYSTEM: {
    HEALTH: '/health',
    VERSION: '/version',
    CONFIG: '/config',
    MAINTENANCE: '/maintenance',
  },
};
