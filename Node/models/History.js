const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    songId: { type: String, required: true },
    songName: { type: String, required: true },
    artistId: { type: String, required: true },
    artistName: { type: String, required: true },
    artistImageUrl: { type: String, required: true },
    albumName: { type: String, required: true },
    albumImageUrl: { type: String, required: true },
    length: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('History', historySchema, 'History');