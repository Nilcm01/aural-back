const express = require('express');
const router = express.Router();

const Item = require('../models/Item');
const Xats = require('../models/Xats');

  router.get('/users', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.post('/login-user', async (req, res) => {
    const { userId, name} = req.query

    if(!userId || !name) {
      res.status(404).send("Bad values");
    }

    try {
    const newUser = new Item ({
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

  // Get all friend list and friend request list from a user
  router.get('/friend-requests', async(req, res) => {
    const { userId } = req.query;

    // Verify if the userId is present
    if (!userId) {
      return res.status(400).send('Bad Request: userId is required');
    }

    try {
      // Filter result by userId
      const user = await Item.findOne({ userId });  

      if (!user) {
        return res.status(404).send('User not found');
      }

      //  List of friends & friend_requests from user with userId 
      const userData = { friends: user.friends, friend_requests: user.Friend_requests };
      res.json(userData);
    
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

  // Get all xats from a user
  router.get('/xats', async (req, res) => {
    const { userId } = req.query;

    // Verify if the userId is present
    if (!userId) {
      return res.status(400).send('Bad Request: userId is required');
    }

    try {
      // Filter result by userId
      const user = await Item.findOne({ userId });  

      if (!user) {
        return res.status(404).send('User not found');
      }

      const xats = (user.xats);

      res.json(xats);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;