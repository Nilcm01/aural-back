const mongoose = require('mongoose');

const ListenerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
});

module.exports = mongoose.model('Listener', ListenerSchema, 'Listener');
