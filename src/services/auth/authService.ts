import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/apiClient';
import databaseService from '../database/databaseService';

// Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  avatar?: string;
  profile: {
    bio?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
  };
  preferences: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    sound: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
  profile?: Partial<User['profile']>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// JWT Token Payload
export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expires at
  type: 'access' | 'refresh';
}

// Auth Service Class
class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'currentUser';
  private static readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  // Current user state
  private currentUser: User | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const token = this.getStoredToken();
      const user = this.getStoredUser();

      if (token && user) {
        // Check if token is valid
        if (this.isTokenValid(token)) {
          this.currentUser = user;
          this.startTokenRefreshTimer();
          console.log('✅ User authenticated from stored data');
        } else {
          // Token expired, try to refresh
          await this.refreshStoredToken();
        }
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      this.logout();
    }
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { user, token, refreshToken, expiresIn } = response.data;

      // Store auth data
      this.setAuthData(user, token, refreshToken, credentials.rememberMe);

      // Start token refresh timer
      this.startTokenRefreshTimer();

      // Cache user data
      await databaseService.createUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        settings: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      console.log('✅ User logged in successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { user, token, refreshToken, expiresIn } = response.data;

      // Store auth data
      this.setAuthData(user, token, refreshToken, true);

      // Start token refresh timer
      this.startTokenRefreshTimer();

      // Cache user data
      await databaseService.createUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        settings: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      console.log('✅ User registered successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      if (this.isAuthenticated()) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.error('❌ Logout API call failed:', error);
    } finally {
      // Clear local data regardless of API call success
      this.clearAuthData();
      this.stopTokenRefreshTimer();
      console.log('✅ User logged out');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      // Update stored tokens
      localStorage.setItem(AuthService.TOKEN_KEY, token);
      localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, newRefreshToken);

      // Update current user if needed
      if (this.currentUser) {
        const payload = jwtDecode<JWTPayload>(token);
        if (payload.sub !== this.currentUser.id) {
          // User changed, fetch new user data
          await this.fetchCurrentUser();
        }
      }

      console.log('✅ Token refreshed successfully');
      return token;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  async fetchCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      const user = response.data;

      this.currentUser = user;
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      // Update cached user data
      await databaseService.updateUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        settings: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      return user;
    } catch (error) {
      console.error('❌ Failed to fetch current user:', error);
      throw error;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', updates);
      const updatedUser = response.data;

      this.currentUser = updatedUser;
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(updatedUser));

      // Update cached user data
      await databaseService.updateUser({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        settings: updatedUser.preferences,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });

      console.log('✅ Profile updated successfully');
      return updatedUser;
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', data);
      console.log('✅ Password changed successfully');
    } catch (error) {
      console.error('❌ Password change failed:', error);
      throw error;
    }
  }

  async forgotPassword(data: PasswordResetData): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', data);
      console.log('✅ Password reset email sent');
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      throw error;
    }
  }

  async resetPassword(data: PasswordResetConfirmData): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', data);
      console.log('✅ Password reset successful');
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      throw error;
    }
  }

  // Token Management
  private setAuthData(user: User, token: string, refreshToken: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(AuthService.TOKEN_KEY, token);
    storage.setItem(AuthService.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

    this.currentUser = user;
  }

  private clearAuthData(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
    sessionStorage.removeItem(AuthService.TOKEN_KEY);
    sessionStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);

    this.currentUser = null;
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY) || sessionStorage.getItem(AuthService.TOKEN_KEY);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(AuthService.REFRESH_TOKEN_KEY) || sessionStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private async refreshStoredToken(): Promise<void> {
    try {
      await this.refreshToken();
      if (!this.currentUser) {
        await this.fetchCurrentUser();
      }
    } catch (error) {
      console.error('❌ Failed to refresh stored token:', error);
      this.logout();
    }
  }

  // Token Validation
  isTokenValid(token?: string): boolean {
    const tokenToCheck = token || this.getStoredToken();
    if (!tokenToCheck) return false;

    try {
      const payload = jwtDecode<JWTPayload>(tokenToCheck);
      const now = Date.now() / 1000; // Convert to seconds
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  isTokenExpiringSoon(): boolean {
    const token = this.getStoredToken();
    if (!token) return true;

    try {
      const payload = jwtDecode<JWTPayload>(token);
      const now = Date.now();
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      return (expiresAt - now) < AuthService.TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      return true;
    }
  }

  // Token Refresh Timer
  private startTokenRefreshTimer(): void {
    this.stopTokenRefreshTimer();

    const token = this.getStoredToken();
    if (!token) return;

    try {
      const payload = jwtDecode<JWTPayload>(token);
      const now = Date.now();
      const expiresAt = payload.exp * 1000;
      const refreshTime = expiresAt - AuthService.TOKEN_REFRESH_THRESHOLD - now;

      if (refreshTime > 0) {
        this.tokenRefreshTimer = setTimeout(() => {
          this.refreshStoredToken();
        }, refreshTime);
      }
    } catch (error) {
      console.error('❌ Failed to start token refresh timer:', error);
    }
  }

  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // Auth State Methods
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.isTokenValid();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: User['role'][]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  hasPermission(permission: string): boolean {
    // Implement permission logic based on user role
    if (!this.currentUser) return false;

    const permissions = {
      admin: ['*'], // All permissions
      teacher: ['manage_students', 'manage_lessons', 'view_analytics', 'manage_exercises'],
      student: ['view_lessons', 'complete_exercises', 'view_progress'],
    };

    const userPermissions = permissions[this.currentUser.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }

  // Utility Methods
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async validateSession(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) return false;

      // Check if token is still valid
      if (!this.isTokenValid()) {
        await this.refreshStoredToken();
      }

      // Verify with server
      await apiClient.get('/auth/validate');
      return true;
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      this.logout();
      return false;
    }
  }

  // Social Auth Methods (if needed)
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', { token });
      const { user, accessToken, refreshToken } = response.data;

      this.setAuthData(user, accessToken, refreshToken, true);
      this.startTokenRefreshTimer();

      return response.data;
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  }

  async loginWithFacebook(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/facebook', { token });
      const { user, accessToken, refreshToken } = response.data;

      this.setAuthData(user, accessToken, refreshToken, true);
      this.startTokenRefreshTimer();

      return response.data;
    } catch (error) {
      console.error('❌ Facebook login failed:', error);
      throw error;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopTokenRefreshTimer();
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
export type { User, LoginCredentials, RegisterData, AuthResponse, PasswordResetData, PasswordResetConfirmData, ChangePasswordData, JWTPayload };
