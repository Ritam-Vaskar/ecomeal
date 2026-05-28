import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from './auth';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
  socket = io(url, {
    transports: ['websocket'],
    auth: {
      token: getAccessToken(),
    },
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
