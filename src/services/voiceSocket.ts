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
        transports: ['websocket'],
        path: '/socket.io',
        auth: {
          token: getAccessToken() || ''
        }
      });
      return socket;
    });
  }
  return socketPromise;
}
