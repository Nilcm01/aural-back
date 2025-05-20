// Save the current state of the jams without using a database
const jams = new Map(); // key: jamId, value: jamObject

module.exports = { jams };

/*
    How to call WebSocket functions:

    -- Create a new JAM (name, creatorId, songIds):
    socket.emit('createJam', {
        name: 'My JAM',
        creatorId: 'user123',
        songIds: ['song001', 'song002', 'song003']
    });

    -- Join a JAM:
    socket.emit('joinJam', {
        jamId: 'jam789',
        userId: 'user123'
    });

    -- Leave the current JAM:
    socket.emit('leaveJam');

    -- Delete the current JAM (only the host can do this):
    socket.emit('deleteJam');

    -- Get all live JAMs:
    socket.emit('getLiveJams');

    -- Send current song/time/status from the host to a requester:
    socket.emit('sendCurrentTimeJam', {
        requesterId: 'socketIdOfRequester',
        currentTime: 42 // in seconds
    });

    -- Update the current song (any participant can do this):
    socket.emit('updateJam', {
        songId: 'song456',
        currentStatus: 'playing' // or 'paused'
    });

    -- Add a song to the playlist (any participant can do this):
    socket.emit('addSongToJam', {
        songId: 'song999'
    });

    -- Update playback time (any participant can do this):
    socket.emit('updateJamTime', {
        currentTime: 90 // in seconds
    });

    -- Update playback status (any participant can do this):
    socket.emit('updateJamStatus', {
        currentStatus: 'paused' // or 'playing'
    });
*/

/*
    How to listen to WebSocket events:

    -- When you successfully join a JAM:
    socket.on('jamJoined', (data) => {
        console.log('Joined JAM:', data.jamId);
        console.log('Participants:', data.participants);
        console.log('Playlist:', data.songIds);
    });

    -- When a new participant joins the JAM:
    socket.on('jamParticipantJoined', (data) => {
        console.log('New participant joined:', data.userId);
    });

    -- When a participant leaves the JAM:
    socket.on('jamParticipantLeft', (data) => {
        console.log('Participant left:', data.userId);
    });

    -- When the host is asked to send the current state:
    socket.on('requestJamCurrentTime', (data) => {
        console.log('Someone requested sync:', data.requesterId);
        // Host should then emit 'sendCurrentTimeJam' in response
    });

    -- When the host sends the current song, time, and status:
    socket.on('receivedJamCurrentStatus', (data) => {
        console.log('Current song:', data.currentSong);
        console.log('Current time:', data.currentTime);
        console.log('Status:', data.currentStatus);
    });

    -- When a song update is received:
    socket.on('receiveJamSongUpdate', (data) => {
        console.log('Song updated:', data.currentSong);
        console.log('Time reset to:', data.currentTime);
        console.log('Status:', data.currentStatus);
    });

    -- When the playlist is updated:
    socket.on('jamPlaylistUpdated', (data) => {
        console.log('Updated playlist:', data.songIds);
    });

    -- When a time update is received:
    socket.on('receiveJamTimeUpdate', (data) => {
        console.log('New time received:', data.currentTime);
    });

    -- When a status update is received:
    socket.on('receiveJamStatusUpdate', (data) => {
        console.log('Playback status updated:', data.currentStatus);
    });

    -- When the host changes (because previous one left):
    socket.on('jamHostUpdated', (data) => {
        console.log('New host assigned:', data.newHostId);
    });

    -- When the JAM is closed (host deletes it or no participants remain):
    socket.on('jamClosed', (data) => {
        alert('JAM closed: ' + data.message);
        // You might want to redirect the user back to the homepage
    });

    -- When an error occurs:
    socket.on('jamError', (message) => {
        console.error('JAM error:', message);
    });

    -- When live JAMs are received:
    socket.on('liveJams', (jamsArray) => {
        console.log('Available JAMs:', jamsArray);
    });
*/
