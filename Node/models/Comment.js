const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: {},
  },
  entityType: {
    type: String,
    enum: ['song', 'album', 'artist'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentId: {
    type: String,
    default: '',
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// The third parameter 'Comment' specifies the exact collection name
module.exports = mongoose.model('Comment', CommentSchema, 'Comment');
