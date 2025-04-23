const express = require('express');
const router = express.Router();

const {
  createPunctuation,
  getPunctuationsByEntity,
  deletePunctuation,
} = require('../controllers/punctuationsController');

// Route to create a new punctuation
router.post('/create-punctuation', createPunctuation);

// Route to get punctuations by entity
router.get('/punctuations-by-entity', getPunctuationsByEntity);

// Route to delete a punctuation
router.delete('/delete-punctuation', deletePunctuation);

module.exports = router;