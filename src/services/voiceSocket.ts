// Lightweight wrapper to establish a Socket.IO connection for realtime voice.
// We keep it lazy-loaded to avoid adding bundle weight on non-voice pages.

import type { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../core/api';
import { getAccessToken } from '../core/auth';

let socketPromise: Promise<Socket> | null = null;
let socketInstance: Socket | null = null;

export function getVoiceSocket(): Promise<Socket> {
  const token = getAccessToken() || '';

  if (socketInstance) {
    socketInstance.auth = { token };
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return Promise.resolve(socketInstance);
  }

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
          token
        }
      });
      socketInstance = socket;

      socket.on('connect_error', () => {
        socket.auth = { token: getAccessToken() || '' };
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socketInstance = null;
          socketPromise = null;
        }
      });

      return socket;
    });
  }
  return socketPromise.then((socket) => {
    socket.auth = { token: getAccessToken() || '' };
    return socket;
  });
}
