const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        default: ""
    },
    age: {
        type: Number,
        default: null
    },
    imageURL: {
        type: String,
        default: ""
    },
    friends: {
        type: [String],
        default: []
    },
    friend_requests: {
        type: [String],
        default: []
    }
});

// The third parameter 'aural' specifies the exact collection nameusername
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Users', UserSchema, 'User');