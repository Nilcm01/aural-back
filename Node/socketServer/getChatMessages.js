const Chat = require('../models/Chat'); // adjust path as needed

const getChatMessages = async (chatId) => {
  if (!chatId) {
    throw new Error('Chat ID is required');
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }

  return chat.messages;
};

module.exports = getChatMessages;
