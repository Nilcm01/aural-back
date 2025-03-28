const express = require('express');
const router = express.Router();

const Users = require('../models/Users');
const Xats = require('../models/Xats');
const Content = require('../models/Content');

    // Get all xats from a user
    router.get('/xats', async (req, res) => {
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

        const xats = (user.xats);

        res.json(xats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    });

    // Get all users from a xat
    router.get('/xats-users', async (req,res) => {
        const { xatId } = req.query;

        if (!xatId) {
            res.status(400).send("Bad request");
        }

        try {
            const xat = await Xats.findOne({xatId});
            const users = {userList: [xat.users]};

            if (!users) {
                return res.status(404).send('Users not found');
            }
            
            res.json(users);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // Get all messages from a xat
    router.get('/xats-messages', async (req,res) => {
        const { xatId } = req.query;

        if (!xatId) {
            res.status(400).send("Bad request");
        }

        try {
            const xat = await Xats.findOne({xatId});
            const messages = {messages: [xat.messages]};

            if (!messages) {
                return res.status(404).send('Messages not found');
            }
            
            res.json(messages);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // Get all metadata from a xat
    router.get('/xats-metadata', async (req,res) => {
        const { xatId } = req.query;

        if (!xatId) {
            res.status(400).send("Bad request");
        }

        try {
            const xat = await Xats.findOne({xatId});
            const metadata = {metadata: [xat.metadata]};

            if (!metadata) {
                return res.status(404).send('Messages not found');
            }
            
            res.json(metadata);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;