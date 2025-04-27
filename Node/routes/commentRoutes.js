const express = require('express');
const router = express.Router();

const {
  createComment,
  deleteComment,
  getCommentsByEntity,
} = require('../controllers/commentController');

// Route to create a new comment
router.post('/create-comment', createComment);

// Route to delete a comment
router.delete('/delete-comment', deleteComment);

// Route to get comments by entityType and contentId
router.get('/comments-by-entity', getCommentsByEntity);

module.exports = router;