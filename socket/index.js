const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] User connected: ${socket.id}`);


    socket.on('join_chat', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket.io] User joined room: ${conversationId}`);
    });

    socket.on('send_message', (data) => {
      const { conversationId, senderId, text } = data;
      
  
      socket.to(conversationId).emit('receive_message', data);
    });


    socket.on('typing', ({ conversationId, senderId }) => {
      socket.to(conversationId).emit('display_typing', senderId);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.id}`);
    });
  });
};