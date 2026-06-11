const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000", // Update with your Next.js frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] User connected: ${socket.id}`);

    // User joins a specific conversation room
    socket.on('join_chat', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket.io] User joined room: ${conversationId}`);
    });

    // Handle real-time messaging
    socket.on('send_message', (data) => {
      const { conversationId, senderId, text } = data;
      
      // Emit the message to everyone in the room EXCEPT the sender
      socket.to(conversationId).emit('receive_message', data);
    });

    // Handle typing indicators (optional but recommended for UX)
    socket.on('typing', ({ conversationId, senderId }) => {
      socket.to(conversationId).emit('display_typing', senderId);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.id}`);
    });
  });
};