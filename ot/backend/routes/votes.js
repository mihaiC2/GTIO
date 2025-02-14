const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Singer = require('../models/Singer');

const router = express.Router();

router.post('/vote', async (req, res) => {
    const { singerId, userId } = req.body;

    try {
        const existingVote = await Vote.findOne({ user: userId, singer: singerId });
        if (existingVote) {
            return res.status(400).json({ msg: 'You have already voted for this singer' });
        }
        /*
        const existingVote = await Vote.findOne({ user: userId });
        if (existingVote) {
            return res.status(400).json({ msg: 'You have already voted' });
        }
        */
        const vote = new Vote({ user: userId, singer: singerId });
        await vote.save();

        await Singer.findByIdAndUpdate(singerId, { $inc: { votes: 1 } });

        res.status(201).json({ msg: 'Voted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

module.exports = router;
