const express = require('express');
const router = express.Router();

const Users = require('../models/Users');
const Xats = require('../models/Xats');
const Content = require('../models/Content');

  // Get all users from the DB
  router.get('/users', async (req, res) => {
    try {
      const users = await Users.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // Add the user with userId from Spotify API to DB
  router.post('/login-user', async (req, res) => {
    const { userId, name} = req.query

    if(!userId || !name) {
      res.status(404).send("Bad values");
    }

    try {
    const userExists = await Users.findOne({userId});
    if (userExists) {
      res.status(200).send("User already in BD!");
      return;
    }
      
    const newUser = new Users ({
      userId,
      name,
    });

    await newUser.save();

    res.status(200).send("User added to DB!");

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // Get all the information from a user to show at profile screen
  router.get('/profile-info', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).message("Bad request");
    }

    try {
      const user = await Users.findOne({ userId });

      if (!user) {
        return res.status(404).send('User not found');
      }

      const userData = { name: user.name, username: user.username, age: user.age, imageURL: user.imageURL};

      res.json(userData);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

  // Get all friend list and friend request list from a user
  router.get('/friends', async(req, res) => {
    const { userId } = req.query;

    // Verify if the userId is present
    if (!userId) {
      return res.status(400).send('Bad Request: userId is required');
    }

    try {
      // Filter result by userId
      const user = await Users.findOne({ userId });  

      if (!user) {
        return res.status(404).send('User not found');
      }

      //  List of friends & friend_requests from user with userId 
      const userData = { friends: user.friends, friend_requests: user.friend_requests };
      res.json(userData);
    
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;