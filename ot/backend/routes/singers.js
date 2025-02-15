const express = require('express');
const Singer = require('../models/Singer');

const router = express.Router();

router.post('/add', async (req, res) => {
    const { name, image } = req.body;

    try {
        const existingSinger = await Singer.findOne({ name });
        if (existingSinger) {
            return res.status(400).json({ msg: 'The singer already exists' });
        }
        const newSinger = new Singer({ name, image });
        await newSinger.save();

        res.status(201).json({ msg: 'Singer added successfully', singer: newSinger });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const singers = await Singer.find();
        res.json(singers);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

module.exports = router;
