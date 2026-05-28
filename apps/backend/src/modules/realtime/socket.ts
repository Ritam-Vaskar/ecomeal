import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let ioInstance: Server | null = null;

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    socket.emit('connected', { status: 'ok' });
  });

  return io;
}

export function getIo() {
  return ioInstance;
}
