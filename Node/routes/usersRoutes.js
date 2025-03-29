const express = require('express');
const router = express.Router();

const { 
  users, 
  loginUser, 
  profileInfo, 
  friends, 
  registerUser, 
  modifyProfile, 
  sendFriendRequest, 
  acceptFriendRequest, 
  removeFriend, 
  userDescription,
  userAge,
  rejectFriendRequest,
  searchUser
} = require('../controllers/usersController');

// Get all users from the DB
router.get('/users', users);

// Add the user with userId from Spotify API to DB
router.post('/login-user', loginUser);

// Get all the information from a user to show at profile screen
router.get('/profile-info', profileInfo);

// Get all friend list and friend request list from a user
router.get('/friends', friends);

// Register a new user
router.post('/register', registerUser); // const { userId, name, username, password, age, imageURL } = req.body;

// Modify user profile
router.put('/modify-profile', modifyProfile);

// Send a friend request
router.post('/send-friend-request', sendFriendRequest);

// Accept a friend request
router.post('/accept-friend-request', acceptFriendRequest);

// Remove a friend
router.delete('/remove-friend', removeFriend);

// Reject a friend request
router.delete('/reject-friend-request', rejectFriendRequest);

// Get user description
router.put('/user-description', userDescription);

// Get user age
router.put('/user-age', userAge);

// Returns the top three matching usernames for the provided one
router.get('/search-user', searchUser);

module.exports = router;