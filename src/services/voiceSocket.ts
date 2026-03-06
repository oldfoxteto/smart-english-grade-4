// Lightweight wrapper to establish a Socket.IO connection for realtime voice.
// We keep it lazy-loaded to avoid adding bundle weight on non-voice pages.

import type { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../core/api';
import { getAccessToken } from '../core/auth';

let socketPromise: Promise<Socket> | null = null;

export function getVoiceSocket(): Promise<Socket> {
  if (!socketPromise) {
    socketPromise = import('socket.io-client').then(({ io }) => {
      const url = API_BASE_URL.replace('/api/v1', '');
      const socket = io(url, {
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        withCredentials: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 8,
        reconnectionDelay: 500,
        auth: {
          token: getAccessToken() || ''
        }
      });

      socket.on('connect_error', () => {
        socket.auth = { token: getAccessToken() || '' };
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socketPromise = null;
        }
      });

      return socket;
    });
  }
  return socketPromise;
}
