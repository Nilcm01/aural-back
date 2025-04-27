const Publications = require('../models/Publications');
const Users = require('../models/Users');


exports.allPublications = async (req, res) => {

    try {
        const publications = await Publications.find();
        res.json(publications);
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addPublication = async (req, res) => {
    try {
        const { userId, content } = req.body;
        if(!userId || !content){
            return res.status(400).json({ msg: 'Please provide all fields'});
        }

        const user = await Users.findOne({ userId }, "_id"); // Search by userId, return only _id

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist'});
        }

        Date.now = function(){
            return new Date().toISOString();
        }
        datetime = Date.now();
        const newPublication = new Publications({
            "userId":user,
            "content":content,
            "datetime":datetime
        });
        const publication = await newPublication.save();
        res.json(publication);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
}