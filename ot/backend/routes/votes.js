const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Vote = require('../models/Vote');
// const Singer = require('../models/Singer');

const router = express.Router();

router.post('/vote', verifyToken, async (req, res) => {
    const { singerId} = req.body;
    const userId = req.user.userId;
    try {
        // const existingVote = await Vote.findOne({ user: userId, singer: singerId });
        // if (existingVote) {
        //     return res.status(400).json({ msg: 'You have already voted for this singer' });
        // }

        const existingVote = await Vote.findOne({ user: userId });
        if (existingVote) {
            return res.status(400).json({ msg: 'You have already voted' });
        }
        
        const vote = new Vote({ user: userId, singer: singerId });
        await vote.save();

        // await Singer.findByIdAndUpdate(singerId, { $inc: { votes: 1 } });

        res.status(201).json({ msg: 'Voted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Obtener el número de votos por cantante
router.get('/votes/:singerId', async (req, res) => {
    const { singerId } = req.params;

    try {
        const voteCount = await Vote.countDocuments({ singer: singerId });
        res.status(200).json({ singerId, votes: voteCount });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Obtener todos los votos de un usuario
router.get('/user-votes', verifyToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const userVotes = await Vote.find({ user: userId }).populate('singer');
        res.status(200).json(userVotes);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Obtener el número total de votos por cada cantante
router.get('/votes-by-singer', async (req, res) => {
    try {
        const voteCountBySinger = await Vote.aggregate([
            { $group: { _id: "$singer", totalVotes: { $sum: 1 } } }, // Agrupar por cantante y contar los votos
            { $lookup: {
                from: 'singers',
                localField: '_id',
                foreignField: '_id',
                as: 'singerDetails'
            }},
            { $unwind: "$singerDetails" },
            { $project: {
                _id: 0,
                singerName: "$singerDetails.name", 
                singerId: "$singerDetails._id",
                totalVotes: 1
            }}
        ]);

        res.status(200).json(voteCountBySinger);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});



module.exports = router;
