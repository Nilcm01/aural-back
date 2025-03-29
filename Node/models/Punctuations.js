const mongoose = require('mongoose');

const PunctuationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  punctuationId: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    enum: ['list', 'music', 'artist'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// The third parameter 'Punctuations' specifies the exact collection name
module.exports = mongoose.model('Punctuations', PunctuationSchema, 'Punctuations');
