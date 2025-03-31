const mongoose = require('mongoose');
const Users = require('../models/Users');
const PrivateMessage = require('../models/PrivateMessage');

// Get all private messages for a user

// Get all chats for a user by username
exports.privateMessagesUser = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required!" });
  }

  try {
    const user = await Users.findOne({ username }, "_id");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    console.log("User ID:", user._id, "Type:", typeof user._id);
    const chats = await PrivateMessage.find({
      participants: { $in: [user._id] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
