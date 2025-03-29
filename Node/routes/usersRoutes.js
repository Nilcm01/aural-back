const express = require('express');
const router = express.Router();

const { users, loginUser, profileInfo, friends } = require('../controllers/usersController');

  // Get all users from the DB
  router.get('/users', users);

  // Add the user with userId from Spotify API to DB
  router.post('/login-user', loginUser);

  // Get all the information from a user to show at profile screen
  router.get('/profile-info', profileInfo);

  // Get all friend list and friend request list from a user
  router.get('/friends', friends);
  
module.exports = router;