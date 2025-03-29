const Punctuations = require('../models/Punctuations');

// Create a new punctuation
exports.createPunctuation = async (req, res) => {
  const { userId, entityId, entityType, score, description } = req.body;

  if (!userId || !entityId || !entityType || !score) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  try {
    const newPunctuation = new Punctuations({
      userId,
      entityId,
      entityType,
      score,
      description,
    });

    await newPunctuation.save();
    res.status(201).send('Punctuation created successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Modify an existing punctuation
exports.modifyPunctuation = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPunctuation = await Punctuations.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedPunctuation) {
      return res.status(404).send('Punctuation not found');
    }

    res.json(updatedPunctuation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a punctuation
exports.deletePunctuation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPunctuation = await Punctuations.findByIdAndDelete(id);

    if (!deletedPunctuation) {
      return res.status(404).send('Punctuation not found');
    }

    res.status(200).send('Punctuation deleted successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
