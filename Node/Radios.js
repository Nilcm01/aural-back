// Save the current state of the radios without using a database
const radios = new Map(); // key: radioId, value: radioObject

module.exports = { radios };

/*
    How to call WebSocket functions:

    -- Create a new radio (name, creatorId, playlistId):
    socket.emit('createRadio', {
        name: 'My Radio',
        creatorId: 'user123',
        playlistId: 'playlist456'
    });

    -- Join a radio:
    socket.emit('joinRadio', {
        radioId: 'radio789',
        userId: 'user123'
    });

    -- Leave the current radio:
    socket.emit('leaveRadio');

    -- Delete the current radio (only the creator can do this):
    socket.emit('deleteRadio');

    -- Get all live radios:
    socket.emit('getLiveRadios');

    -- Send current song from the creator to a requester:
    socket.emit('sendCurrentTime', {
        requesterId: 'socketIdOfRequester',
        currentTime: 42 // in miliseconds (¿?)
    });

    -- Update song (only creator):
    socket.emit('updateSong', {
        songId: 'song789',
        currentStatus: 'playing' // or 'paused'
    });

    -- Update playback time (only creator):
    socket.emit('updateTime', {
        currentTime: 75 // in miliseconds (¿?)
    });

    -- Update playback status (only creator):
    socket.emit('updateStatus', {
        currentStatus: 'paused' // or 'playing'
    });
*/

/*
    How to listen to WebSocket events:

    -- When you successfully join a radio:
    socket.on('radioJoined', (data) => {
        console.log('Joined radio:', data.radioId);
        console.log('Participants:', data.participants);
    });

    -- When a new participant joins the radio:
    socket.on('radioParticipantJoined', (data) => {
        console.log('New participant joined:', data.userId);
    });

    -- When a participant leaves the radio:
    socket.on('radioParticipantLeft', (data) => {
        console.log('Participant left:', data.userId);
    });

    -- When the creator is asked to send the current time:
    socket.on('requestCurrentTime', (data) => {
        console.log('Someone requested sync:', data.requesterId);
        // Creator should then emit 'sendCurrentTime' in response
    });

    -- When an updated song is received:
    socket.on('receiveSongUpdates', (data) => {
        console.log('New song:', data.currentSong);
        console.log('Status:', data.currentStatus);
        console.log('Time:', data.currentTime);
    });

    -- When an updated time is received:
    socket.on('receiveUpdatedTime', (data) => {
        console.log('Synced time:', data.currentTime);
    });

    -- When an updated status is received:
    socket.on('receiveUpdatedStatus', (data) => {
        console.log('Playback status updated:', data.currentStatus);
    });

    -- When you receive the current song and time (after joining):
    socket.on('receivedCurrentStatus', (data) => {
        console.log('Current song:', data.currentSong);
        console.log('Current time:', data.currentTime);
        console.log('Status:', data.currentStatus);
    });

    -- When the radio is closed (creator disconnects or deletes):
    socket.on('radioClosed', (data) => {
        alert('Radio closed: ' + data.message);
        // You might want to redirect the user back to the homepage
    });

    -- When an error occurs:
    socket.on('radioError', (message) => {
        console.error('Radio error:', message);
    });

    -- When live radios are received:
    socket.on('liveRadios', (radiosArray) => {
        console.log('Available radios:', radiosArray);
    });
*/
