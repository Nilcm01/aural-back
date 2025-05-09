const socketIO = require('socket.io');
const getChatMessages = require('./getChatMessages');
const sendChatMessage = require('./sendChatMessage');
const { joinRadio, leaveRadio, getLiveRadios, createRadio } = require('../controllers/radioController');
const Radio = require('../models/Radio');

function socketServerInit(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    //========== Chat Events ==========

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

    //========== Radio Events ==========

    socket.on('joinRadio', async (radioId, userId) => {
      try {
        const result = await joinRadio(radioId, userId);
        socket.join(radioId);
        console.log(`Socket ${socket.id} joined radio room ${radioId}`);
        
        const radio = await Radio.findById(radioId); // Get current state of the radio from db
        if (!radio) {
          return socket.emit('radioError', 'Radio not found.');
        }

        socket.emit('radioState', {
          currentSong: radio.currentSong,
          currentTime: radio.currentTime
        }); // Send the current state of the radio to the user who joined
        
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('leaveRadio', async (radioId, userId) => {
      try {
        const result = await leaveRadio(radioId, userId);
        socket.leave(radioId);
        console.log(`Socket ${socket.id} left radio room ${radioId}`);
        socket.emit('radioState', result.radio); // Send the current state of the radio to the user who left
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('getLiveRadios', async () => {
      try {
        const radios = await getLiveRadios();
        socket.emit('liveRadios', radios);
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('createRadio', async (data) => {
      try {
        const result = await createRadio(data);
        socket.emit('radioCreated', result.radio);
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    //========== Radio Playback Control ==========

    socket.on('radioPlay', async ({ radioId, userId }) => {
      try {
        const radio = await Radio.findById(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator.toString() !== userId) {
          return socket.emit('radioError', 'Permission denied to play radio.');
        }
    
        // Update only if it was paused
    
        io.to(radioId).emit('radioPlay', { radioId });
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('radioPause', async ({ radioId, userId }) => {
      try {
        const radio = await Radio.findById(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator.toString() !== userId) {
          return socket.emit('radioError', 'Permission denied to pause radio.');
        }

        io.to(radioId).emit('radioPause', { radioId });
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });
    // Change current song time (creator only)
    socket.on('radioSeek', async ({ radioId, userId, time }) => {
      try {
        const radio = await Radio.findById(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator.toString() !== userId) {
          return socket.emit('radioError', 'Permission denied to seek radio.');
        }
    
        radio.currentTime = time;
        await radio.save();
    
        io.to(radioId).emit('radioSeek', { radioId, time });
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('radioChangeSong', async ({ radioId, userId, song }) => {
      try {
        const radio = await Radio.findById(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator.toString() !== userId) {
          return socket.emit('radioError', 'Permission denied to change song.');
        }
    
        radio.currentSong = song;
        radio.currentTime = 0;
        await radio.save();
    
        io.to(radioId).emit('radioChangeSong', { radioId, song });
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });
    
    
    //========== Disconnect ==========
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { socketServerInit };