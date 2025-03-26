const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    punctuations: {
        type: Array,
        default: []
    },
    username: {
        type: String,
        default: ""
    },
    password: {
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
        type: Array,
        default: []
    },
    xats: {
        type: Array,
        default: []
    },
    Publications: {
        type: Array,
        default: []
    },
    Friend_requests: {
        type: Array,
        default: []
    }
});

// The third parameter 'aural' specifies the exact collection name
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Aural', UserSchema, 'Aural');