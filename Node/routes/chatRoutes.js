const express = require('express');
const router = express.Router();

const { chatUsers, chatMessages, chatMetadata, chatsFromUser } = require('../controllers/chatController.js');

    // Get all users from a chat: chatId
    router.get('/chat-users', chatUsers);

    // Get all messages from a chat: chatId
    router.get('/chat-messages', chatMessages);

    // Get all messages from a chat: chatId
    router.get('/chat-metadata', chatMetadata);

    // Get list of chats of a user: userId
    router.get('/chats-from-user', chatsFromUser);

module.exports = router;