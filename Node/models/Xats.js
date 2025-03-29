const mongoose = require('mongoose');

const XatSchema = new mongoose.Schema({
    xatId: {
        type: Number,
        required: true,
    }, 
    messages: {
        type: Array,
        default: []
    },
    users: {
        type: Array,
        default: []
    },
    metadata: {
        type: Object,
        default: {}
    }
});

// The third parameter 'aural' specifies the exact collection name
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Xats', XatSchema, 'Xats');