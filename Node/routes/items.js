const express = require('express');
const router = express.Router();

const Item = require('../models/Item');
const Xats = require('../models/Xats');

router.get('/xats', async (req, res) => {
    try {
      const items = await Xats.find();
      res.json(items);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/users', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;