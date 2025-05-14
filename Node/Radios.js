// Save the current state of the radios without using a database
const radios = new Map(); // key: radioId, value: radioObject

module.exports = { radios };

/* 
    How to call web socket functions:
    
        -- Join a radio (radioId, userId):
        joinRadio("radio123", "user456");

        -- Leave a radio (radioId, userId):
        leaveRadio("radio123", "user456");

        -- Get all live radios:
        getLiveRadios();

        -- Create a new radio (name, creatorId, playlistId):
        createRadio("My Radio", "user456", "playlist789");

        -- Delete a radio (radioId, userId):
        deleteRadio("radio123", "user456");

        -- Update song (radioId, userId, songId):
        updateSong("radio123", "user456", "song789");

*/


/*
    How to listen to web socket events:

        -- Listen for radio joined event:
        socket.on('radioJoined', (data) => {
            console.log('Joined radio:', data);
                // Here you can update the UI with the data received
                // Example: Update the UI with the current song and time, and participants
            console.log('Current song:', data.currentSong);
            console.log('Current time:', data.currentTime);
            console.log('Participants:', data.participants);
        });

        -- Listen for song updated event:
        socket.on('songUpdated', (data) => {
            console.log('Song updated:', data);
                // Here you can update the UI with the data received
                // Example: Update the UI with the new song
            console.log('New song:', data.currentSong);
        });

        -- Listen for participant joined event:
        socket.on('radioParticipantJoined', (data) => {
            console.log('New participant joined:', data);
                // Here you can update the UI with the data received
                // Example: Add the new participant to the list
            console.log('User joined:', data.userId);
        });

        -- Listen for radio deleted event:
        socket.on('radioDeleted', (data) => {
            console.log('Radio deleted:', data);
                // Here you can update the UI with the data received
                // Example: Move the user to the home page
            alert('The radio has been deleted!');
        });

*/