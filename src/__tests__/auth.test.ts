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

  it('persists tokens for bearer-auth API requests', () => {
    saveTokens('access-token');

    expect(getAccessToken()).toBe('access-token');
    expect(getRefreshToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
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
    expect(isAuthenticated()).toBe(true);
  });
});
