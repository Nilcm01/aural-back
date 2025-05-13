const socketIO = require('socket.io');
const getChatMessages = require('./getChatMessages');
const sendChatMessage = require('./sendChatMessage');
const { radios } = require('../Radios');

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
        const radio = radios.get(radioId);
        if (!radio) {
          return socket.emit('radioError', 'Radio not found.');
        }

        // Add the user to the radio
        radio.participants.push({ userId });
        socket.join(radioId);
        console.log(`Socket ${socket.id} joined radio room ${radioId}`);

        // Emit the current state of the radio to the user who joined
        socket.emit('radioJoined', {
          radioId,
          currentSong: radio.currentSong,
          currentTime: radio.currentTime,
          participants: radio.participants
        });

        // Emit to all other participants in the radio room
        socket.to(radioId).emit('radioParticipantJoined', {
          radioId,
          userId
        });

      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });


    socket.on('leaveRadio', async (radioId, userId) => {
      try {
        const radio = radios.get(radioId);
        if (!radio) {
          return socket.emit('radioError', 'Radio not found.');
        }

        // Remove the user from the participants list
        radio.participants = radio.participants.filter(p => p.userId !== userId);

        socket.leave(radioId);
        console.log(`Socket ${socket.id} left radio room ${radioId}`);

        // Emit the updated state to the user who left
        socket.emit('radioLeft', { radioId });

        // Emit to all other participants in the radio room
        socket.to(radioId).emit('radioParticipantLeft', {
          radioId,
          userId
        });
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });


    socket.on('getLiveRadios', () => {
      const liveRadios = Array.from(radios.values());
      socket.emit('liveRadios', liveRadios);
    });

    socket.on('createRadio', (data) => {
      const { name, creatorId, playlistId } = data;

      if (!name || !creatorId) {
        return socket.emit('radioError', 'Name and creatorId are required.');
      }

      try {
        const radioId = Math.random().toString(36).substring(2, 9);
        const newRadio = {
          radioId,
          name,
          creator: creatorId,
          playlistId,
          participants: [{ userId: creatorId }],
          currentSong: null,
          currentTime: 0
        };

        radios.set(radioId, newRadio);

        socket.join(radioId);
        socket.emit('radioCreated', newRadio);
        socket.to(radioId).emit('radioParticipantJoined', {
          radioId,
          userId: creatorId
        });
      } catch (error) {
        console.error('Error creating radio:', error);
        socket.emit('radioError', 'Internal server error.');
      }
    });

    socket.on('deleteRadio', (data) => {
      const { radioId, userId } = data;

      if (!radioId || !userId) {
        return socket.emit('radioError', 'radioId and userId are required.');
      }

      try {
        const radio = radios.get(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator !== userId) {
          return socket.emit('radioError', 'Only the creator can delete the radio.');
        }

        radios.delete(radioId);

        io.to(radioId).emit('radioDeleted', { radioId });
        io.socketsLeave(radioId); // remove all sockets from the room
      } catch (error) {
        console.error('Error deleting radio:', error);
        socket.emit('radioError', 'Internal server error.');
      }
    });

    socket.on('updateSong', (data) => {
      const { radioId, userId, songId } = data;

      if (!radioId || !userId || !songId) {
        return socket.emit('radioError', 'radioId, userId, and songId are required.');
      }

      try {
        const radio = radios.get(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator !== userId) {
          return socket.emit('radioError', 'Only the creator can change the song.');
        }

        radio.currentSong = songId;
        radio.currentTime = 0;

        io.to(radioId).emit('songUpdated', {
          radioId,
          currentSong: songId,
          currentTime: 0
        });
      } catch (error) {
        console.error('Error updating song:', error);
        socket.emit('radioError', 'Internal server error.');
      }
    });

    socket.on('getRadioById', (radioId) => {
      try {
        const radio = radios.get(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        socket.emit('radioData', radio);
      } catch (error) {
        socket.emit('radioError', 'Internal server error.');
      }
    });

    //========== Radio Playback Control ==========

    // This event is emitted by the creator to sync the time for all participants
    socket.on('syncTime', (data) => {
      const { radioId, userId, currentTime } = data;
      const radio = radios.get(radioId);

      if (!radio) return socket.emit('radioError', 'Radio not found.');
      if (radio.creator !== userId) {
        return socket.emit('radioError', 'Only the creator can sync time.');
      }

      radio.currentTime = currentTime;

      socket.to(radioId).emit('timeSynced', {
        radioId,
        currentTime
      });
    });

    // Pause song (creator only)
    socket.on('pauseSong', ({ radioId, userId }) => {
      const radio = radios.get(radioId);

      if (!radio) return socket.emit('radioError', 'Radio not found.');
      if (radio.creator !== userId) {
        return socket.emit('radioError', 'Only the creator can pause the song.');
      }

      io.to(radioId).emit('songPaused', { radioId });
    });

    // Resume song (creator only)
    socket.on('resumeSong', ({ radioId, userId }) => {
      const radio = radios.get(radioId);

      if (!radio) return socket.emit('radioError', 'Radio not found.');
      if (radio.creator !== userId) {
        return socket.emit('radioError', 'Only the creator can resume the song.');
      }

      io.to(radioId).emit('songResumed', { radioId });
    });
    
    //========== Disconnect ==========
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { socketServerInit };