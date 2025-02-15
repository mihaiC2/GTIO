const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// TODO: Verify token

// Change password
router.put('/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect old password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Change username
router.put('/change-username', async (req, res) => {
    try {
        const { email, newUsername } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.username = newUsername;
        await user.save();

        res.json({ msg: 'Username updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete account
router.delete('/delete-account', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOneAndDelete({ email });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get user by email
router.get('/user', async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// All users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Error in the server' });
    }
});

module.exports = router;