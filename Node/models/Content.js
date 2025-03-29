const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    artist: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    year: {
        type: Number,
    },
    description: {
        type: String,
    },
    Comments:{
        type: Array,
        default: []
    }
});

// The third parameter 'Content' specifies the exact collection name
// This connects to the 'Content' collection in the 'Users' database
module.exports = mongoose.model('Content', ContentSchema, 'Content');