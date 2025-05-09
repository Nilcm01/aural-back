const express = require('express');
const router = express.Router();

const { 
  createRadio,
  getLiveRadios,
  joinRadio,
  leaveRadio,
  deleteRadio
} = require('../controllers/radioController');

/*
use JSON to send the data in the body
{
    "name": "RadioName",
    "creatorId": "creatorUserId"
} */
// Create a new radio: name, creatorId
router.post('/create-radio', createRadio);

// Get all live radios: No parameters needed
router.get('/live-radios', getLiveRadios);

/*
use JSON to send the data in the body
{
    "radioId": "radioId",
    "userId": "userId"
} */
// Join a radio: radioId, userId
router.post('/join-radio', joinRadio);

/*
use JSON to send the data in the body
{
    "radioId": "radioId",
    "userId": "userId"
} */
// Leave a radio: radioId, userId
router.post('/leave-radio', leaveRadio);

/*
use JSON to send the data in the body
{
    "radioId": "radioId",
    "userId": "creatorUserId"
} */
// Delete a radio: radioId, userId (creator only)
router.delete('/delete-radio', deleteRadio);

module.exports = router;
