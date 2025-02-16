const express = require('express');
const Singer = require('../models/Singer');

const router = express.Router();

// TODO: Verify token

router.post('/add', async (req, res) => {
    const { name, description, age, image } = req.body;

    try {
        const existingSinger = await Singer.findOne({ name });
        if (existingSinger) {
            return res.status(400).json({ msg: 'The singer already exists' });
        }
        const newSinger = new Singer({ name, description, age, image });
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

// Get singer by name
// router.get('/get-by-name', async (req, res) => {
//     const { name } = req.body;

//     try {
//         const singer = await Singer.findOne(name);
//         if (!singer) {
//             return res.status(404).json({ msg: 'Singer not found' });
//         }
//         res.json(singer);
//     } catch (err) {
//         res.status(500).json({ msg: 'Error in the server' });
//     }
// });

// Get singer by ID
router.get('/:id', async (req, res) => {
    try {
        const singer = await Singer.findById(req.params.id);
        if (!singer) {
            return res.status(404).json({ msg: 'Singer not found' });
        }
        res.json(singer);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Update singer by ID
router.put('/update/:id', async (req, res) => {
    const { name, description, age, image } = req.body;

    try {
        const updatedSinger = await Singer.findByIdAndUpdate(
            req.params.id,
            { name, description, age, image },
            { new: true }
        );
        if (!updatedSinger) {
            return res.status(404).json({ msg: 'Singer not found' });
        }
        res.json({ msg: 'Singer updated successfully', singer: updatedSinger });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Delete singer by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedSinger = await Singer.findByIdAndDelete(req.params.id);
        if (!deletedSinger) {
            return res.status(404).json({ msg: 'Singer not found' });
        }
        res.json({ msg: 'Singer deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});


module.exports = router;
