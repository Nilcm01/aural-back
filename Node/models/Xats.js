const mongoose = require('mongoose');

const XatSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    }, 
    messages: {
        type: Array
    }
});

// The third parameter 'aural' specifies the exact collection name
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Xats', XatSchema, 'Xats');