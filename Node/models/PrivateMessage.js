const mongoose = require('mongoose');

const PrivateMessageSchema = new mongoose.Schema({
    participants: {
        type: Array,
        default: []
    },
    messages: {
        type: Array,
        default: []
    },
    name: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
});

// The third parameter 'PrivateMessage' specifies the exact collection name
// This connects to the 'PrivateMessage' collection in the 'Users' database
module.exports = mongoose.model('PrivateMessage', PrivateMessageSchema, 'PrivateMessage');