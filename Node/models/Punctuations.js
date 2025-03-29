const mongoose = require('mongoose');

const PunctuationSchema = new mongoose.Schema({
  userId: {
    type: Object,
    default: {}
  },
  entityType: {
    type: String,
    enum: ['list', 'music', 'artist'],
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  contentId: {
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
