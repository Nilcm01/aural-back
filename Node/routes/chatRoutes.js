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


    /*
    use JSON to send the data in the body
    {   
        "chatId": "67eeac951b3f2de5ea99ce30",
        "userId": "nilcm01"
    } */
    // Add a user to a chat: chatId, userId
    router.post('/add-user-to-chat', addUserToChat);
    

    // Remove user from a chat: chatId, userId
    router.delete('/remove-user-from-chat', removeUserFromChat);

    /*
    use JSON to send the data in the body
    {
        "private": true, -> true: DM // false: group
        "users": [
          "nilcm01",
          "tonijoanllompartaz"
        ],
        "name": "group name"
      } */
    // Create a new chat: private, users, name
    router.post('/create-chat', createChat);

    /*
    use JSON to send the data in the body
    {
        "chatId":"67eec8a8c59b76dc1f263722"
    } */
    // Delete a chat: chatId
    router.delete('/delete-chat', deleteChat);

    /*
    use JSON to send the data in the body
    {
        "chatId":"67eec9a707148b55ab44773c",
        "newName": "testchangename"
      }
    */
    // Modify chat name: chatId, newName
    router.put('/change-chat-name', changeChatName);

    /*
    {
        "chatId":"67eec9a707148b55ab44773c",
        "userId":"nilcm01",
        "txt": "Hola! Testing de api!"
      }
        */
    // Send message: chatId, userId, text
    router.post('/chat-send-message', chatSendMessage)
module.exports = router;