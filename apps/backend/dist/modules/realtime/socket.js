import { Server } from 'socket.io';
let ioInstance = null;
export function initSocket(server) {
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
