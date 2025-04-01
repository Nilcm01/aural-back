const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  admin: {
    type: Boolean,
    default: false
  }
  
}, { _id: false });

module.exports = mongoose.model('Participant', ParticipantSchema, 'Participant');