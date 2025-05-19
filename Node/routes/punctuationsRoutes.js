const express = require('express');
const router = express.Router();

const {
  createPunctuation,
  getPunctuationsByEntity,
  deletePunctuation,
  getTopRatedEntities,
  getTopWeightedEntities,
  getMostRatedEntities,
} = require('../controllers/punctuationsController');

// Route to create a new punctuation
router.post('/create-punctuation', createPunctuation);

// Route to get punctuations by entity
router.get('/punctuations-by-entity', getPunctuationsByEntity);

// Route to delete a punctuation
router.delete('/delete-punctuation', deletePunctuation);

// Route to get top-rated entities
router.get('/top-rated-entities', getTopRatedEntities);

// Route to get top entities by weighted score
router.get('/top-weighted-entities', getTopWeightedEntities);

// Route to get most rated entities
router.get('/most-rated-entities', getMostRatedEntities);

module.exports = router;