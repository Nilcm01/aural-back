const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Get all users from a chat
exports.chatUsers = async (req, res) => {
    try {
      const chatId = req.query.chatId;
      const User = require('../models/Users');
      
      if (!chatId) {
        return res.status(400).send('Chat ID is required');
      }
      
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        return res.status(404).send('Chat not found');
      }
      
      // Extract the participant userIds from the chat
      const participantIds = chat.participants.map(participant => participant.userId);
      
      // Find all users that match these IDs
      const users = await User.find({
        _id: { $in: participantIds }
      });
      
      // Create an enhanced participants array with user details
      const enhancedParticipants = chat.participants.map(participant => {
        const userDetails = users.find(user => 
          user._id.toString() === participant.userId.toString()
        );
        
        return {
            userId: participant.userId,
            admin: participant.admin,
            name: userDetails ? userDetails.name : null,
            username: userDetails ? userDetails.username : null,
            imageURL: userDetails ? userDetails.imageURL : null
        };
      });
      
      res.json(enhancedParticipants);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Get all messages from a chat
exports.chatMessages = async (req, res) => {
  try {
    const chatId = req.query.chatId;
    
    if (!chatId) {
      return res.status(400).send('Chat ID is required');
    }
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    
    // Extract the messages from the chat
    const messages = chat.messages;
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get metadata for a chat
exports.chatMetadata = async (req, res) => {
  try {
    const chatId = req.query.chatId;
    
    if (!chatId) {
      return res.status(400).send('Chat ID is required');
    }
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    
    // Return chat metadata (excluding messages for efficiency)
    const metadata = {
      _id: chat._id,
      name: chat.name,
      participantsCount: chat.participants.length,
      messagesCount: chat.messages.length,
      lastMessageTimestamp: chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1].timestamp 
        : null
    };
    
    res.json(metadata);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get list of chats of a user
exports.chatsFromUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).send('User ID is required');
    }
    
    // Find all chats where this user is a participant
    const chats = await Chat.find({
      'participants.userId': userId
    }).select('-messages'); // Exclude messages for better performance
    
    if (!chats || chats.length === 0) {
      return res.json([]);
    }
    
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};