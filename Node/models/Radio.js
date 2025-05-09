const mongoose = require('mongoose');
const ListenerSchema = require('./Listener').schema;

const RadioSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  participants: {
    type: [ListenerSchema],
    default: []
  },
  currentSong: {
    type: Object,
    default: null
  },
  currentTime: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Radio', RadioSchema, 'Radio');
