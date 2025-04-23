const Punctuations = require('../models/Punctuations');
const Users = require('../models/Users');

// Create a new punctuation
exports.createPunctuation = async (req, res) => {
  const { userId, entityId, entityType, score } = req.body;

  if (!userId || !entityId || !entityType || !score) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  const user = await Users.findOne({ userId }, "_id");
  if (!user) {
    return res.status(400).send('User does not exist');
  }

  try {
    const updatedPunctuation = await Punctuations.findOneAndUpdate(
      { userId: user._id, entityId, entityType }, 
      { score },
      { new: true, upsert: true } 
    );
    res.status(200).json({
      message: updatedPunctuation.isNew ? 'Punctuation created successfully' : 'Punctuation updated successfully',
      punctuation: updatedPunctuation,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPunctuationsByEntity = async (req, res) => {
  const { entityId, entityType } = req.query;

  if (!entityId || !entityType) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  try {
    const punctuations = await Punctuations.find({ entityId, entityType });

    if (punctuations.length === 0) {
      return res.status(404).send('No punctuations found for the specified entity');
    }

    const totalScore = punctuations.reduce((sum, punctuation) => sum + punctuation.score, 0);
    const averageScore = totalScore / punctuations.length;

    res.json({
      averageScore,
      punctuations,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deletePunctuation = async (req, res) => {
  const { userId, entityId, entityType } = req.body;

  if (!userId || !entityId || !entityType) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  try {
    // Busca el usuario para obtener su `_id`
    const user = await Users.findOne({ userId }, "_id");
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Elimina la puntuación basada en `userId`, `entityId` y `entityType`
    const deletedPunctuation = await Punctuations.findOneAndDelete({
      userId: user._id,
      entityId,
      entityType,
    });

    if (!deletedPunctuation) {
      return res.status(404).send('Punctuation not found');
    }

    res.status(200).send('Punctuation deleted successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};