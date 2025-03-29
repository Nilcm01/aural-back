const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
    metadataId: {
        type: Number,
        required: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    private: {
        type: Boolean,
        default: false,
    },
    users: {
        type: Array,
        default: [],
    },
});

// The third parameter 'Metadata' specifies the exact collection name
// This connects to the 'Metadata' collection in the 'Metadata' database
module.exports = mongoose.model('Metadata', MetadataSchema, 'Metadata');