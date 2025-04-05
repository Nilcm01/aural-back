const Chat = require('../models/Chat');
const User = require('../models/Users');
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
        userId: { $in: participantIds }
      });
      
      // Create an enhanced participants array with user details
      const enhancedParticipants = chat.participants.map(participant => {
        const userDetails = users.find(user => 
          user.userId === participant.userId
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
      private: chat.private,
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

    const chats = await Chat.find({
      'participants.userId': userId
    }).select('-messages'); // Exclude messages for better performance
    
    if (!chats || chats.length === 0) {
      return res.status(400).json({ return: 0, message: 'User does not have chats' });
    }
    
    res.status(200).json({ return: chats, message: 'User chats' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUserToChat = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: 'chatId and userId are required.' });
  }

  try {

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ return: 0, message: 'Invalid chatId format.' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ return: 0, message: 'Chat not found.' });
    } else if (chat.private) {
      return res.status(404).json({ return: 0, message: "Chat is private, can't add users!." });
    }


    const isParticipant = chat.participants.some(participant =>
      participant.userId.toString() === userId
    );

    if (isParticipant) {
      return res.status(400).json({ return: 0, message: 'User is already a participant in this chat.' });
    }

    chat.participants.push({ userId, admin: false});
    await chat.save();

    res.status(200).json({ return: 1, message: 'User added to chat successfully.'});
  } catch (error) {
    console.error('Error adding user to chat:', error);
    res.status(500).json({ return: 0,  message: 'Internal server error.' });
  }
};

exports.removeUserFromChat = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: 'chatId and userId are required.' });
  }

  try {
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ return: 0, message: 'Invalid chatId format.' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ return: 0, message: 'Chat not found.' });
    }  else if (chat.private) {
      return res.status(404).json({ return: 0, message: "Chat is private, can't remove users!." });
    }

    const initialCount = chat.participants.length;

    // Remove user from participants array
    chat.participants = chat.participants.filter(participant =>
      participant.userId.toString() !== userId
    );

    if (chat.participants.length === initialCount) {
      return res.status(400).json({ return: 0, message: 'User is not a participant in this chat.' });
    }

    await chat.save();

    res.status(200).json({ return: 1, message: 'User removed from chat successfully.' });
  } catch (error) {
    console.error('Error removing user from chat:', error);
    res.status(500).json({ return: 0, message: 'Internal server error.' });
  }
};

exports.createChat = async (req, res) => {
  const { group, users, name } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ return: 0, message: 'users array is required and must contain at least one user.' });
  }

  if (group && !name) {
    return res.status(400).json({ return: 0, message: 'Group chat must have a name.' });
  }

  try {
    const participants = users.map((userId, index) => ({
      userId,
      admin: index === 0 // First user is admin
    }));

    const newChat = new Chat({
      private: !group,
      name: name,
      participants,
      messages: []
    });

    await newChat.save();

    res.status(201).json({ return: 1, message: 'Chat created successfully.', chatId: newChat._id });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ return: 0, message: 'Internal server error.' });
  }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ return: 0, message: 'chatId is required.' });
  }

  try {
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ return: 0, message: 'Invalid chatId format.' });
    }

    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ return: 0, message: 'Chat not found.' });
    }

    res.status(200).json({ return: 1, message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ return: 0, message: 'Internal server error.' });
  }
};

exports.changeChatName = async (req, res) => {
  const { chatId, newName } = req.body;

  if (!chatId || !newName) {
    return res.status(400).json({ message: 'chatId and newName are required.' });
  }

  try {
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ return: 0, message: 'Invalid chatId format.' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ return: 0, message: 'Chat not found.' });
    }

    chat.name = newName;
    await chat.save();

    res.status(200).json({ return: 1, message: 'Chat name updated successfully.' });
  } catch (error) {
    console.error('Error changing chat name:', error);
    res.status(500).json({ return: 0, message: 'Internal server error.' });
  }
};

exports.chatSendMessage = async (req, res) => {
  const { chatId, userId, txt } = req.body;

  if (!chatId || !userId || !txt) {
    return res.status(400).json({ message: 'chatId, userId, and txt are required.' });
  }

  try {
    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ return: 0, message: 'Invalid chatId format.' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ return: 0, message: 'Chat not found.' });
    }

    const isParticipant = chat.participants.some(p => p.userId === userId);

    if (!isParticipant) {
      return res.status(403).json({ return: 0, message: 'User is not a participant of this chat.' });
    }

    const message = {
      userId,
      txt,
      dt: new Date().toISOString().split('.')[0] + 'Z'
    };

    chat.messages.push(message);
    await chat.save();

    res.status(200).json({ return: 1, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ return: 0, message: 'Internal server error.' });
  }
};