const Radio = require('../models/Radio');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new radio
exports.createRadio = async (req, res) => {
  const { name, creatorId } = req.body;

  if (!name || !creatorId) {
    return res.status(400).json({ message: 'Name and creatorId are required.' });
  }

  try {
    const newRadio = new Radio({
      name,
      creator: creatorId,
      participants: [{ userId: creatorId, admin: true }]
    });

    await newRadio.save();

    res.status(201).json({ message: 'Radio created successfully.', radioId: newRadio._id });
  } catch (error) {
    console.error('Error creating radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a radio (creator only)
exports.deleteRadio = async (req, res) => {
  const { radioId, userId } = req.body;

  if (!radioId || !userId) {
    return res.status(400).json({ message: 'radioId and userId are required.' });
  }

  try {
    const radio = await Radio.findById(radioId);

    if (!radio) {
      return res.status(404).json({ message: 'Radio not found.' });
    }

    if (radio.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only the creator can delete the radio.' });
    }

    await Radio.findByIdAndDelete(radioId);
    res.status(200).json({ message: 'Radio deleted successfully.' });
  } catch (error) {
    console.error('Error deleting radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Join a radio
exports.joinRadio = async (req, res) => {
  const { radioId, userId } = req.body;

  if (!radioId || !userId) {
    return res.status(400).json({ message: 'radioId and userId are required.' });
  }

  try {
    const radio = await Radio.findById(radioId);

    if (!radio) {
      return res.status(404).json({ message: 'Radio not found.' });
    }

    const alreadyJoined = radio.participants.some(p => p.userId.toString() === userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'User already joined the radio.' });
    }

    radio.participants.push({ userId, admin: false });
    await radio.save();

    res.status(200).json({ message: 'User joined the radio successfully.' });
  } catch (error) {
    console.error('Error joining radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Leave a radio
exports.leaveRadio = async (req, res) => {
  const { radioId, userId } = req.body;

  if (!radioId || !userId) {
    return res.status(400).json({ message: 'radioId and userId are required.' });
  }

  try {
    const radio = await Radio.findById(radioId);

    if (!radio) {
      return res.status(404).json({ message: 'Radio not found.' });
    }

    const originalCount = radio.participants.length;
    radio.participants = radio.participants.filter(p => p.userId.toString() !== userId);

    if (radio.participants.length === originalCount) {
      return res.status(400).json({ message: 'User is not a participant in this radio.' });
    }

    await radio.save();
    res.status(200).json({ message: 'User left the radio successfully.' });
  } catch (error) {
    console.error('Error leaving radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Show all live radios
exports.getLiveRadios = async (req, res) => {
  try {
    const radios = await Radio.find().select('-__v');
    res.status(200).json({ radios });
  } catch (error) {
    console.error('Error getting radios:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
