const express = require('express');
const router = express.Router();
const lyricsController = require('../controllers/lyricsController');

// Endpoint to get lyrics by song ID
router.get('/get-lyrics/:songId', lyricsController.getLyricsBySongId);

// Endpoint to save new lyrics
router.post('/save-lyrics', lyricsController.saveLyrics);

module.exports = router;