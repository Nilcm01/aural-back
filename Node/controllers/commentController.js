const Comments = require('../models/Comment');
const Users = require('../models/Users');

// Create a new comment
exports.createComment = async (req, res) => {
  const { userId, entityType, content, contentId, parent } = req.body;

  if (!userId || !entityType || !content) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  try {
    const user = await Users.findOne({ userId }, "_id");
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newComment = new Comments({
      userId: user._id,
      entityType,
      content,
      contentId,
      parent,
    });

    const savedComment = await newComment.save();
    res.status(201).json({
      message: 'Comment created successfully',
      commentId: savedComment._id, // Retorna l'ObjectId del nou comentari
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    const { commentId } = req.body;
  
    if (!commentId) {
      return res.status(400).send('Bad Request: Missing required fields');
    }
  
    try {
      const deletedComment = await Comments.findOneAndDelete({
        _id: commentId,
      });
  
      if (!deletedComment) {
        return res.status(404).send('Comment not found');
      }
  
      res.status(200).send('Comment deleted successfully');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Get comments by entityType and contentId
exports.getCommentsByEntity = async (req, res) => {
    const { entityType, contentId } = req.query;
  
    if (!entityType || !contentId) {
      return res.status(400).send('Bad Request: Missing required fields');
    }
  
    try {
      const comments = await Comments.find({ entityType, contentId }).populate('parent');
  
      if (comments.length === 0) {
        return res.status(404).send('No comments found for the specified entity');
      }
  
      res.json(comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };