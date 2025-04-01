const mongoose = require('mongoose');
const MessageSchema = require('./Message').schema;
const ParticipantSchema = require('./Participant').schema;

const ChatSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true
    },
    name: {
      type: String,
      required: true
    },
    participants: {
      type: [ParticipantSchema],
      default: []
    },
    messages: {
      type: [MessageSchema],
      default: []
    }
  });

// The third parameter 'aural' specifies the exact collection name
// This connects to the 'aural' collection in the 'Users' database
module.exports = mongoose.model('Chat', ChatSchema, 'Chat');