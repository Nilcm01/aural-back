const mongoose = require('mongoose');
const Chat = require('../models/Chat'); // Adjust path if needed

const sendChatMessage = async ({ chatId, userId, txt }) => {
  if (!chatId || !userId || !txt) {
    throw new Error('chatId, userId, and txt are required.');
  }

  if (!mongoose.isValidObjectId(chatId)) {
    throw new Error('Invalid chatId format.');
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error('Chat not found.');
  }

  const isParticipant = chat.participants.some(p => p.userId === userId);
  if (!isParticipant) {
    throw new Error('User is not a participant of this chat.');
  }

  const message = {
    userId,
    txt,
    dt: new Date().toISOString().split('.')[0] + 'Z'
  };

  chat.messages.push(message);
  await chat.save();

  return { success: true, message: 'Message sent successfully.', newMessage: message };
};

module.exports = sendChatMessage;
