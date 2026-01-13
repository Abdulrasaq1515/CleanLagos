const socketIO = require('socket.io');

let io;

const initializeWebSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join room for specific user role/ID
    socket.on('join_room', ({ userId, role }) => {
      if (role === 'psp') {
        socket.join(`worker_${userId}`);
        console.log(`PSP worker ${userId} joined room`);
      } else if (role === 'lawma_admin') {
        socket.join('admin_room');
        console.log('Admin joined room');
      }
    });

    // Handle PSP location updates
    socket.on('psp_location_update', (data) => {
      const { workerId, location } = data;
      
      // Broadcast to admin room
      io.to('admin_room').emit('psp_location_updated', {
        workerId,
        location,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeWebSocket, getIO };