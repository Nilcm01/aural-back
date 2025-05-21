const socketIO = require('socket.io');
const getChatMessages = require('./getChatMessages');
const sendChatMessage = require('./sendChatMessage');
const { radios } = require('../Radios');
const { jams } = require('../Jams');


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
          creator: socket.id,
          playlistId,
          participants: [{ userId: socket.id }],
          currentSong: null,
          currentStatus: 'paused', // paused/playing
          currentTime: 0
        };

        radios.set(radioId, newRadio);
        socket.join(radioId);
        socket.radioId = radioId; // store the radioId in the socket object

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

    // Get all current live radios
    socket.on('getLiveRadios', () => {
      const liveRadios = Array.from(radios.values());
      socket.emit('liveRadios', liveRadios);
    });

    socket.on('joinRadio', (data) => {
      const { radioId, userId } = data;
      const radio = radios.get(radioId);
      if (!radio)
        return socket.emit('radioError', 'Radio not found.');

      try {
        // Add the user to the radio
        const exists = radio.participants.find(p => p.socketId === socket.id);
        if (!exists) {
          radio.participants.push({ userId, socketId: socket.id });
        }

        socket.join(radioId);
        socket.radioId = radioId;

        io.to(radio.creator).emit('requestCurrentTime', { requesterId: socket.id });
        console.log(`Socket ${socket.id} joined radio room ${radioId}`);

        // Emit the current state of the radio to the user who joined
        socket.emit('radioJoined', {
          radioId,
          participants: radio.participants
        });

        // Emit to all other participants in the radio room
        socket.to(radioId).emit('radioParticipantJoined', {
          radioId,
          userId: socket.id
        });

      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('sendCurrentTime', ({ requesterId, currentTime }) => {
      const radio = radios.get(socket.radioId);
      if (!radio)
        return socket.emit('radioError', 'Radio not found.');


      io.to(requesterId).emit('receivedCurrentStatus', {
        currentTime,
        currentSong: radio.currentSong,
        currentStatus: radio.currentStatus
      });
    });

    socket.on('leaveRadio', () => {
      const radioId = socket.radioId;
      const radio = radios.get(radioId);
      if (!radio)
        return socket.emit('radioError', 'Radio not found.');

      try {
        // Remove the user from the participants list
        radio.participants = radio.participants.filter(p => p.socketId !== socket.id);

        socket.to(radioId).emit('radioParticipantLeft', {
          radioId,
          userId: socket.id
        });
        // If creator leaves, delete the radio
        if (radio.creator === socket.id) {
          io.to(radioId).emit('radioClosed', { radioId, message: 'Radio has been deleted by creator.' });
          for (const participant of radio.participants) {
            const participantSocket = io.sockets.sockets.get(participant.socketId);
            if (participantSocket) {
              participantSocket.leave(radioId);
              delete participantSocket.radioId;
            }
          }
          radios.delete(radioId);
          return;
        }
        // Emit the updated state to the user who left
        socket.emit('radioLeft', { radioId });

        // Leave the room and delete the radioId from the socket object
        socket.leave(radioId);
        delete socket.radioId;
      } catch (error) {
        socket.emit('radioError', error.message);
      }
    });

    socket.on('deleteRadio', () => {
      const radioId = socket.radioId;
      const radio = radios.get(radioId)
      if (!radio)
        return socket.emit('radioError', 'Radio not found.');

      if (radio.creator !== socket.id) {
        return socket.emit('radioError', 'Only the creator can delete the radio.');
      }

      try {
        io.to(radioId).emit('radioClosed', {
          radioId,
          message: 'Radio has been deleted by creator.'
        });

        // Remove all participants from the radio
        for (const participant of radio.participants) {
          const participantSocket = io.sockets.sockets.get(participant.socketId);
          if (participantSocket) {
            participantSocket.leave(radioId);
            delete participantSocket.radioId;
          }
        }

        // Delete the radio from the map
        radios.delete(radioId);
        console.log(`Radio ${radioId} deleted by creator.`);
      } catch (error) {
        console.error('Error deleting radio:', error);
        socket.emit('radioError', 'Internal server error.');
      }
    });

    // Change the song (creator only)
    socket.on('updateSong', (data) => {
      const { songId, currentStatus } = data;
      const radioId = socket.radioId;

      if (!radioId || !songId || !currentStatus) {
        return socket.emit('radioError', 'radioId, songId and currentStatus are required.');
      }

      try {
        const radio = radios.get(radioId);
        if (!radio) return socket.emit('radioError', 'Radio not found.');
        if (radio.creator !== socket.id) {
          return socket.emit('radioError', 'Only the creator can change the song.');
        }

        radio.currentSong = songId;
        radio.currentTime = 0;
        radio.currentStatus = currentStatus;

        io.to(radioId).emit('receiveSongUpdates', {
          currentSong: songId,
          currentTime: 0,
          currentStatus,
        });

      } catch (error) {
        console.error('Error updating song:', error);
        socket.emit('radioError', 'Internal server error.');
      }
    });

    //========== Radio Playback Control ==========

    // This event is emitted by the creator to sync the time for all participants
    socket.on('updateTime', (data) => {
      const { currentTime } = data;
      const radioId = socket.radioId;
      const radio = radios.get(radioId);

      if (!radio) return socket.emit('radioError', 'Radio not found.');
      if (radio.creator !== socket.id) {
        return socket.emit('radioError', 'Only the creator can sync time.');
      }

      radio.currentTime = currentTime;

      socket.to(radioId).emit('receiveUpdatedTime', { currentTime });
    });

    // This event is emitted by the creator to change the current status
    socket.on('updateStatus', (data) => {
      const { currentStatus } = data;
      const radioId = socket.radioId;
      const radio = radios.get(radioId);

      if (!radio) return socket.emit('radioError', 'Radio not found.');
      if (radio.creator !== socket.id) {
        return socket.emit('radioError', 'Only the creator can change status.');
      }

      radio.currentStatus = currentStatus;

      socket.to(radioId).emit('receiveUpdatedStatus', { currentStatus });
    });

    //========== JAM Events ==========

    socket.on('createJam', (data) => {
      const { name, creatorId, songIds } = data;

      if (!name || !creatorId || !Array.isArray(songIds)) {
        return socket.emit('jamError', 'Name, creatorId, and songIds are required.');
      }

      try {
        const jamId = Math.random().toString(36).substring(2, 9);
        const newJam = {
          jamId,
          name,
          host: socket.id,
          songIds: [...songIds], // Copy the songIds array
          participants: [{ userId: socket.id }],
          currentSong: songIds[0] || null,
          currentStatus: 'paused',
          currentTime: 0
        };

        jams.set(jamId, newJam);
        socket.join(jamId);
        socket.jamId = jamId;

        socket.emit('jamCreated', newJam);
        socket.to(jamId).emit('jamParticipantJoined', {
          jamId,
          userId: creatorId
        });
      } catch (error) {
        console.error('Error creating jam:', error);
        socket.emit('jamError', 'Internal server error.');
      }
    });

    socket.on('getLiveJams', () => {
      const liveJams = Array.from(jams.values());
      socket.emit('liveJams', liveJams);
    });

    socket.on('joinJam', (data) => {
      const { jamId, userId } = data;
      const jam = jams.get(jamId);
      if (!jam)
        return socket.emit('jamError', 'Jam not found.');

      try {
        // add the user to the jam
        const exists = jam.participants.find(p => p.socketId === socket.id);
        if (!exists) {
          jam.participants.push({ userId, socketId: socket.id });
        }

        socket.join(jamId);
        socket.jamId = jamId;

        // Ask the host to send the current time
        io.to(jam.host).emit('requestJamCurrentTime', {
          requesterId: socket.id
        });

        console.log(`Socket ${socket.id} joined jam room ${jamId}`);

        // Emit the current state of the jam to the user who joined
        socket.emit('jamJoined', {
          jamId,
          participants: jam.participants,
          songIds: jam.songIds
        });

        // Notify the rest
        socket.to(jamId).emit('jamParticipantJoined', {
          jamId,
          userId: socket.id
        });

      } catch (error) {
        socket.emit('jamError', error.message);
      }
    });

    socket.on('sendCurrentTimeJam', ({ requesterId, currentTime }) => {
      const jam = jams.get(socket.jamId);
      if (!jam) return socket.emit('jamError', 'Jam not found.');

      io.to(requesterId).emit('receivedJamCurrentStatus', {
        currentTime,
        currentSong: jam.currentSong,
        currentStatus: jam.currentStatus
      });
    });

    socket.on('leaveJam', () => {
      const jamId = socket.jamId;
      const jam = jams.get(jamId);
      if (!jam)
        return socket.emit('jamError', 'Jam not found.');

      try {
        // Remove participant
        jam.participants = jam.participants.filter(p => p.socketId !== socket.id);

        socket.to(jamId).emit('jamParticipantLeft', {
          jamId,
          userId: socket.id
        });

        // If host leaves, find a new host
        if (jam.host === socket.id) {
          if (jam.participants.length > 0) {
            const newHost = jam.participants[0];
            jam.host = newHost.socketId;

            io.to(jamId).emit('jamHostUpdated', {
              jamId,
              newHostId: newHost.socketId
            });

            console.log(`Nuevo host en JAM ${jamId}: ${newHost.socketId}`);
          } else {
            // No participants left, delete the jam
            jams.delete(jamId);
            console.log(`JAM ${jamId} deleted (no participants).`);
            return;
          }
        }

        // Limpiar socket
        socket.leave(jamId);
        delete socket.jamId;

        socket.emit('jamLeft', { jamId });

      } catch (error) {
        socket.emit('jamError', error.message);
      }
    });

    socket.on('deleteJam', () => {
      const jamId = socket.jamId;
      const jam = jams.get(jamId);
      if (!jam)
        return socket.emit('jamError', 'Jam not found.');

      if (jam.host !== socket.id) {
        return socket.emit('jamError', 'Only the host can delete the JAM.');
      }

      try {
        io.to(jamId).emit('jamClosed', {
          jamId,
          message: 'ElJAM has been deleted by host.'
        });

        for (const participant of jam.participants) {
          const participantSocket = io.sockets.sockets.get(participant.socketId);
          if (participantSocket) {
            participantSocket.leave(jamId);
            delete participantSocket.jamId;
          }
        }

        jams.delete(jamId);
        console.log(`JAM ${jamId} deleted by host.`);
      } catch (error) {
        socket.emit('jamError', 'Internal server error.');
      }
    });

    socket.on('updateJam', (data) => {
      const { songId, currentStatus } = data;
      const jamId = socket.jamId;

      if (!jamId || !songId || !currentStatus) {
        return socket.emit('jamError', 'jamId, songId and currentStatus are required.');
      }

      try {
        const jam = jams.get(jamId);
        if (!jam) return socket.emit('jamError', 'Jam not found.');

        jam.currentSong = songId;
        jam.currentTime = 0;
        jam.currentStatus = currentStatus;

        io.to(jamId).emit('receiveJamSongUpdate', {
          currentSong: songId,
          currentTime: 0,
          currentStatus
        });

      } catch (error) {
        socket.emit('jamError', 'Internal server error.');
      }
    });

    socket.on('addSongToJam', ({ songId }) => {
      const jamId = socket.jamId;
      const jam = jams.get(jamId);

      if (!jam) return socket.emit('jamError', 'Jam not found.');
      if (!songId) return socket.emit('jamError', 'No songId provided.');

      try {
        jam.songIds.push(songId);

        io.to(jamId).emit('jamPlaylistUpdated', {
          songIds: jam.songIds
        });
      } catch (error) {
        socket.emit('jamError', 'Internal server error.');
      }
    });

    //========== JAM Playback Control ==========
    
    socket.on('updateJamTime', ({ currentTime }) => {
      const jamId = socket.jamId;
      const jam = jams.get(jamId);

      if (!jam) return socket.emit('jamError', 'Jam not found.');

      jam.currentTime = currentTime;

      socket.to(jamId).emit('receiveJamTimeUpdate', {
        currentTime
      });
    });

    socket.on('updateJamStatus', ({ currentStatus }) => {
      const jamId = socket.jamId;
      const jam = jams.get(jamId);

      if (!jam) return socket.emit('jamError', 'Jam not found.');

      jam.currentStatus = currentStatus;

      socket.to(jamId).emit('receiveJamStatusUpdate', {
        currentStatus
      });
    });



    //========== Disconnect ==========
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      const radioId = socket.radioId;
      if (!radioId) return;

      const radio = radios.get(radioId);
      if (!radio) return;

      if (radio.creator === socket.id) {
        // Si se desconecta el creador, eliminar la radio
        io.to(radioId).emit('radioClosed', {
          radioId,
          message: 'La radio ha sido eliminada porque el creador se ha desconectado.'
        });

        for (const participant of radio.participants) {
          const s = io.sockets.sockets.get(participant.socketId);
          if (s) {
            s.leave(radioId);
            delete s.radioId;
          }
        }

        radios.delete(radioId);
      } else {
        // Si se desconecta un oyente, eliminarlo de la lista
        radio.participants = radio.participants.filter(p => p.socketId !== socket.id);

        socket.to(radioId).emit('radioParticipantLeft', {
          radioId,
          userId: socket.id
        });
      }
    });

  });
}

module.exports = { socketServerInit };