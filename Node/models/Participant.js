const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
  
}, { _id: false });

module.exports = mongoose.model('Participant', ParticipantSchema, 'Participant');