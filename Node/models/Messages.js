const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
    messageId: {
        type: Number,
        required: true,
    }, 
    user: {
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
});

// The third parameter 'Messages' specifies the exact collection name
// This connects to the 'Messages' collection in the 'Messages' database
module.exports = mongoose.model('Messages', MessagesSchema, 'Messages');