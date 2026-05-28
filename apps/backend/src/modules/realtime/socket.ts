import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.emit('connected', { status: 'ok' });
  });

  return io;
}
