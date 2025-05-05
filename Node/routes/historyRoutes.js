const express = require('express');
const router = express.Router();
const { addToHistory, getHistory, getStats } = require('../controllers/historyController');

router.post('/add-history', addToHistory);
router.get('/get-history/:userId', getHistory);
router.get('/get-stats/:userId', getStats);

module.exports = router;