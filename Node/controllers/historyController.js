const History = require('../models/History');

exports.addToHistory = async (req, res) => {
    const { userId, songId, songName, artistId, artistName, artistImageUrl, albumName, albumImageUrl, length, timestamp } = req.body;

    try {
        const newHistoryEntry = new History({
            userId,
            songId,
            songName,
            artistId,
            artistName,
            artistImageUrl,
            albumName,
            albumImageUrl,
            length
        });

        await newHistoryEntry.save();
        return res.status(201).json({ status: 'success', message: 'History entry added successfully.' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error adding history entry.', error });
    }
};

exports.getHistory = async (req, res) => {
    const { userId } = req.params;
    const { limit } = req.query;

    try {
        const query = History.find({ userId }).sort({ timestamp: -1 });
        if (limit && parseInt(limit) > 0) {
            query.limit(parseInt(limit));
        }

        const history = await query.exec();
        return res.status(200).json({ status: 'success', message: 'History retrieved successfully.', history });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error retrieving history.', error });
    }
};

exports.getStats = async (req, res) => {
    const { userId } = req.params;

    try {
        const history = await History.find({ userId });

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const totalPlaytime = history.reduce((sum, entry) => sum + entry.length, 0);
        const playtimeToday = history.filter(entry => entry.timestamp > oneDayAgo).reduce((sum, entry) => sum + entry.length, 0);
        const playtimeLast7Days = history.filter(entry => entry.timestamp > sevenDaysAgo).reduce((sum, entry) => sum + entry.length, 0);
        const playtimeLast30Days = history.filter(entry => entry.timestamp > thirtyDaysAgo).reduce((sum, entry) => sum + entry.length, 0);

        const calculateTop = (entries, key) => {
            const grouped = entries.reduce((acc, entry) => {
                const id = entry[key + 'Id'];
                if (!acc[id]) {
                    acc[id] = {
                        id,
                        name: entry[key + 'Name'],
                        imageUrl: key === 'artist' ? entry.artistImageUrl : entry.albumImageUrl,
                        playtime: 0,
                        ...(key === 'song' && {
                            songId: entry.songId,
                            albumName: entry.albumName,
                            albumImageUrl: entry.albumImageUrl,
                            length: entry.length
                        })
                    };
                }
                acc[id].playtime += entry.length;
                return acc;
            }, {});

            return Object.values(grouped)
                .sort((a, b) => b.playtime - a.playtime)
                .slice(0, 10);
        };

        const topSongsToday = calculateTop(history.filter(entry => entry.timestamp > oneDayAgo), 'song');
        const topSongsLast7Days = calculateTop(history.filter(entry => entry.timestamp > sevenDaysAgo), 'song');
        const topSongsLast30Days = calculateTop(history.filter(entry => entry.timestamp > thirtyDaysAgo), 'song');
        const topSongsAllTime = calculateTop(history, 'song');

        const topArtistsToday = calculateTop(history.filter(entry => entry.timestamp > oneDayAgo), 'artist');
        const topArtistsLast7Days = calculateTop(history.filter(entry => entry.timestamp > sevenDaysAgo), 'artist');
        const topArtistsLast30Days = calculateTop(history.filter(entry => entry.timestamp > thirtyDaysAgo), 'artist');
        const topArtistsAllTime = calculateTop(history, 'artist');

        return res.status(200).json({
            status: 'success',
            message: 'Stats retrieved successfully.',
            stats: {
                totalPlaytime,
                playtimeToday,
                playtimeLast7Days,
                playtimeLast30Days,
                topSongs: {
                    today: topSongsToday,
                    last7Days: topSongsLast7Days,
                    last30Days: topSongsLast30Days,
                    allTime: topSongsAllTime
                },
                topArtists: {
                    today: topArtistsToday,
                    last7Days: topArtistsLast7Days,
                    last30Days: topArtistsLast30Days,
                    allTime: topArtistsAllTime
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error retrieving stats.', error });
    }
};