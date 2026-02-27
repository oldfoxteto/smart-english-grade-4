import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearTokens,
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  isAuthenticated,
  saveCurrentUser,
  saveTokens,
} from '../core/auth';

describe('auth storage', () => {
  beforeEach(() => {
    clearTokens();
  });

  it('persists access/refresh tokens and auth state', () => {
    saveTokens('access-token', 'refresh-token');

    expect(getAccessToken()).toBe('access-token');
    expect(getRefreshToken()).toBe('refresh-token');
    expect(isAuthenticated()).toBe(true);
  });

  it('persists and reads current user', () => {
    saveCurrentUser({
      id: 'user-1',
      email: 'user@example.com',
      displayName: 'User',
      roles: ['learner'],
    });

    expect(getCurrentUser()).toEqual({
      id: 'user-1',
      email: 'user@example.com',
      displayName: 'User',
      roles: ['learner'],
    });
  });
});
