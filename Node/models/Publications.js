const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: {},
    },
    content: {
        type: String,
        default: ""
    },
    datetime: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Publications', UserSchema, 'Publications');