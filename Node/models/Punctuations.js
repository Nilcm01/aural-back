const mongoose = require('mongoose');

const PunctuationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: {},
  },
  entityType: {
    type: String,
    enum: ['song', 'album', 'artist'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  entityId: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// The third parameter 'Punctuations' specifies the exact collection name
module.exports = mongoose.model('Punctuation', PunctuationSchema, 'Punctuation');
