const Radio = require('../models/Radio');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Auxiliary functions:
async function deleteRadioById({ radioId, userId }) {
  if (!radioId || !userId) {
    throw new Error('radioId and userId are required.');
  }

  const radio = await Radio.findById(radioId);

  if (!radio) {
    throw new Error('Radio not found.');
  }

  if (radio.creator.toString() !== userId) {
    throw new Error('Only the creator can delete the radio.');
  }

  await Radio.findByIdAndDelete(radioId);
  return radio; // Return the deleted radio object
}
// This function is used to delete a radio by its ID and the user ID of the creator.
exports.deleteRadioById = deleteRadioById;

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
    // Emit the new radio creation event to all connected clients
    res.status(201).json(newRadio);
  } catch (error) {
    console.error('Error creating radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a radio (HTTP route, creator only)
exports.deleteRadio = async (req, res) => {
  const { radioId, userId } = req.body;

  try {
    const radio = await deleteRadioById({ radioId, userId });
    res.status(200).json(radio);
  } catch (error) {
    console.error('Error deleting radio:', error);
    res.status(400).json({ message: error.message });
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

    res.status(200).json(radio); // Return the updated radio object
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
    res.status(200).json(radio); // Return the updated radio object
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

// Get a radio by itsID
exports.getRadioById = async (req, res) => {
  const { radioId } = req.params; // Get radio ID from the request parameters

  try {
    const radio = await Radio.findById(radioId); // Find the radio by ID

    if (!radio) {
      return res.status(404).json({ message: 'Radio not found.' });
    }

    res.status(200).json(radio); // Return the radio object
  } catch (error) {
    console.error('Error fetching radio:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};