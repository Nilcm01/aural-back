const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Participant', ParticipantSchema, 'Participant');