const express = require('express');
const router = express.Router();

const { privateMessagesUser } = require('../controllers/privateMessageController');

// Get all private messages for a user
router.get('/privateMessages', privateMessagesUser);

module.exports = router;