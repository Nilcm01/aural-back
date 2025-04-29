const socketIO = require('socket.io');
const getChatMessages = require('./getChatMessages');
const sendChatMessage = require('./sendChatMessage');

function socketServerInit(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinChat', async (chatId) => {
        socket.join(chatId); // Join the room named after the chatId
        console.log(`Socket ${socket.id} joined room ${chatId}`);

        try {
          const messages = await getChatMessages(chatId);
          socket.emit('chatMessages', messages); // Send chat history to the newly joined socket
        } catch (error) {
          socket.emit('chatError', error.message);
        }
      });

    socket.on('getMessages', async (chatId) => {
        try {
          const messages = await getChatMessages(chatId);
          socket.emit('chatMessages', messages);
        } catch (err) {
          socket.emit('chatError', err.message);
        }
    });

    socket.on('sendMessage', async (data) => {
        try {
          const result = await sendChatMessage(data);
          io.to(data.chatId).emit('newMessage', result.newMessage);
        } catch (error) {
          socket.emit('chatError', error.message);
        }
      });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { socketServerInit };