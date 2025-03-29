const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    punctuations: {
        type: Array,
        default: []
    },
    username: {
        type: String,
        default: ""
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
        type: Object,
        default: {}
    },
    xats: {
        type: Object,
        default: {}
    },
    publications: {
        type: Array,
        default: []
    },
    friend_requests: {
        type: Array,
        default: []
    }
});

// The third parameter 'aural' specifies the exact collection nameusername
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Aural', UserSchema, 'Aural');