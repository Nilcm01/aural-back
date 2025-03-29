const express = require('express');
const router = express.Router();

const { 
    xats, 
    xatsUsers, 
    xatsMessages, 
    xatsMetadata 
} = require('../controllers/xatsController');

// Get all xats from a user
router.get('/xats', xats);

// Get all users from a xat
router.get('/xats-users', xatsUsers);

// Get all messages from a xat
router.get('/xats-messages', xatsMessages);

// Get all metadata from a xat
router.get('/xats-metadata', xatsMetadata);

module.exports = router;