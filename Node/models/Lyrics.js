const mongoose = require('mongoose');

const LyricsSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true,
        unique: true
    },
    lyrics: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Lyrics', LyricsSchema, 'Lyrics');
