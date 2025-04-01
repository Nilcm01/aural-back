const express = require('express');
const router = express.Router();

const { chatUsers, chatMessages, chatMetadata, chatsFromUser, addUserToChat, removeUserFromChat, 
    createChat, deleteChat, changeChatName, chatSendMessage } = require('../controllers/chatController.js');

    // Get all users from a chat: chatId
    router.get('/chat-users', chatUsers);

    // Get all messages from a chat: chatId
    router.get('/chat-messages', chatMessages);

    // Get all messages from a chat: chatId
    router.get('/chat-metadata', chatMetadata);

    // Get list of chats of a user: userId
    router.get('/chats-from-user', chatsFromUser);



    // Add a user to a chat: chatId, userId
    router.post('/add-user-to-chat', addUserToChat);

    /*// Remove user from a chat: chatId, userId
    router.delete('/remove-user-from-chat', removeUserFromChat);

    // Create a new chat: group, [userId], name
    router.post('/create-chat', createChat);

    // Delete a chat: chatId
    router.delete('/delete-chat', deleteChat);

    // Modify chat name: chatId, newName
    router.put('/change-chat-name', changeChatName);

    // Send message: chatId, userId, text
    router.post('/chat-send-message', chatSendMessage)*/
module.exports = router;