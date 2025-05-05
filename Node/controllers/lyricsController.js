const Lyrics = require('../models/Lyrics');

exports.getLyricsBySongId = async (req, res) => {
    const { songId } = req.params;

    try {
        const lyrics = await Lyrics.findOne({ songId });
        if (lyrics) {
            return res.status(200).json({ lyrics: lyrics.lyrics });
        } else {
            return res.status(404).json({ message: 'Lyrics not found for the given song ID.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving lyrics.', error });
    }
};

exports.saveLyrics = async (req, res) => {
    const { songId, lyrics } = req.body;

    try {
        const existingLyrics = await Lyrics.findOne({ songId });
        if (existingLyrics) {
            return res.status(400).json({ message: 'Lyrics for this song ID already exist.' });
        }

        const newLyrics = new Lyrics({ songId, lyrics });
        await newLyrics.save();

        return res.status(201).json({ message: 'Lyrics saved successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error saving lyrics.', error });
    }
};