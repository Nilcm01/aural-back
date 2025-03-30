const express = require('express');
const router = express.Router();

const { allPublications
    , addPublication
 } = require('../controllers/publicationsController');

// Return all publications
router.get('/publications', allPublications);

// Add a new publication
router.post('/addPublications', addPublication);

module.exports = router;