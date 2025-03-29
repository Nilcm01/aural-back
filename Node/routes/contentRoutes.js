const express = require('express');
const router = express.Router();

const { searchContent } = require('../controllers/contentController');

// Search content, from all types (does not search users)
router.get('/search-content', searchContent);

module.exports = router;