const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    txt: {
        type: String,
        required: true,
    },
    dt: {
        type: Date,
        default: Date.now,
    }
}, { _id: false });

// The third parameter 'Messages' specifies the exact collection name
// This connects to the 'Messages' collection in the 'Messages' database
module.exports = mongoose.model('Message', MessageSchema, 'Message');