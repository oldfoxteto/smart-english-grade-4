// Lightweight wrapper to establish a Socket.IO connection for realtime voice.
// We keep it lazy-loaded to avoid adding bundle weight on non-voice pages.

import type { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../core/api';

let socketPromise: Promise<Socket> | null = null;
let socketInstance: Socket | null = null;

export function getVoiceSocketBaseUrl() {
  return API_BASE_URL.replace('/api/v1', '');
}

export function destroyVoiceSocket() {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }
  socketInstance = null;
  socketPromise = null;
}

export function getVoiceSocket(): Promise<Socket> {
  if (socketInstance) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return Promise.resolve(socketInstance);
  }

  if (!socketPromise) {
    socketPromise = import('socket.io-client').then(({ io }) => {
      const url = getVoiceSocketBaseUrl();
      const socket = io(url, {
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        withCredentials: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 8,
        reconnectionDelay: 500,
        auth: {}
      });
      socketInstance = socket;

      socket.on('connect_error', () => {
        socket.auth = {};
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socket.auth = {};
          socket.connect();
        }
      });

      return socket;
    });
  }
  return socketPromise.then((socket) => {
    socket.auth = {};
    return socket;
  });
}
