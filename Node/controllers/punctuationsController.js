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
    const user = await Users.findOne({ userId }, "_id");
    if (!user) {
      return res.status(404).send('User not found');
    }

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

exports.getTopRatedEntities = async (req, res) => {
  const { entityType } = req.query;

  if (!entityType) {
    return res.status(400).json({ message: 'Bad Request: Missing entityType parameter.' });
  }

  try {
    const topRatedEntities = await Punctuations.aggregate([
      { $match: { entityType } },
      {
        $group: {
          _id: '$entityId',
          averageScore: { $avg: '$score' },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          entityId: '$_id',
          averageScore: 1,
          totalRatings: 1,
        },
      },
      { $sort: { averageScore: -1 } }, 
    ]);

    if (topRatedEntities.length === 0) {
      return res.status(404).json({ message: `No ${entityType}s found with ratings.` });
    }

    res.status(200).json({
      message: `Top rated ${entityType}s retrieved successfully.`,
      entities: topRatedEntities,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTopWeightedEntities = async (req, res) => {
  const { entityType } = req.query;

  if (!entityType) {
    return res.status(400).json({ message: 'Bad Request: Missing entityType parameter.' });
  }

  try {
    const topWeightedEntities = await Punctuations.aggregate([
      { $match: { entityType } }, 
      {
        $group: {
          _id: '$entityId',
          averageScore: { $avg: '$score' },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          entityId: '$_id',
          averageScore: 1,
          totalRatings: 1,
          weightedScore: { $multiply: ['$averageScore', '$totalRatings'] }, 
        },
      },
      { $sort: { weightedScore: -1 } },
    ]);

    if (topWeightedEntities.length === 0) {
      return res.status(404).json({ message: `No ${entityType}s found with ratings.` });
    }

    res.status(200).json({
      message: `Top weighted ${entityType}s retrieved successfully.`,
      entities: topWeightedEntities,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMostRatedEntities = async (req, res) => {
  const { entityType } = req.query;

  if (!entityType) {
    return res.status(400).json({ message: 'Bad Request: Missing entityType parameter.' });
  }

  try {
    const mostRatedEntities = await Punctuations.aggregate([
      { $match: { entityType } }, 
      {
        $group: {
          _id: '$entityId',
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          entityId: '$_id',
          totalRatings: 1,
        },
      },
      { $sort: { totalRatings: -1 } },
    ]);

    if (mostRatedEntities.length === 0) {
      return res.status(404).json({ message: `No ${entityType}s found with ratings.` });
    }

    res.status(200).json({
      message: `Most rated ${entityType}s retrieved successfully.`,
      entities: mostRatedEntities,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
