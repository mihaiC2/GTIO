const express = require('express');
const { createSinger, getAllSingers, getSingerById, updateSingerById, deleteSingerById } = require('../models/Singer');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Add a new singer
router.post('/add', verifyToken, async (req, res) => {
    if (!req.user.admin) 
        return res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    const { first_name, last_name, stage_name, photo_url, bio, birth_date, active } = req.body;

    try {
        // Insert new singer
        const data = await createSinger({ 
            first_name, 
            last_name, 
            stage_name, 
            photo_url, 
            bio, 
            birth_date, 
            active 
        });

        res.status(201).json({ msg: 'Singer added successfully', singer: data });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server', error: err.message });
    }
});

// Get all singers
router.get('/all', async (req, res) => {
    try {
        const singers = await getAllSingers();

        res.status(200).json(singers);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server', error: err.message });
    }
});

// Get singer by ID
router.get('/:id', async (req, res) => {
    try {
        const singer = await getSingerById(req.params.id);

        res.status(200).json(singer);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server', error: err.message });
    }
});

// Update singer by ID
router.put('/update/:id', verifyToken, async (req, res) => {
    if (!req.user.admin) 
        return res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    const { first_name, last_name, stage_name, photo_url, bio, birth_date, active } = req.body;

    try {
        const updatedSinger = await updateSingerById(req.params.id, {
            first_name, 
            last_name, 
            stage_name, 
            photo_url, 
            bio, 
            birth_date, 
            active 
        });

        res.status(200).json({ msg: 'Singer updated successfully', singer: updatedSinger });
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server', error: err.message });
    }
});

// Delete singer by ID
router.delete('/delete/:id', verifyToken, async (req, res) => {
    if (!req.user.admin) 
        return res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    try {
        const data = await deleteSingerById(req.params.id);

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server', error: err.message });
    }
});

module.exports = router;
