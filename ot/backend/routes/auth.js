const express = require('express');
const { createUser, authLogin, updateUserById } = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Register 
// curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\": \"test\", \"email\": \"test@gmail.com\", \"password\": \"test\"}"
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Insert user into Supabase
        let authId = await createUser(email, password, { username });
        console.log(authId);

        res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: `Failed to sign up: ${err.message}` });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        data = await authLogin(email, password);
        res.status(200).json({ token: data.session.access_token});
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: `Failed to sign up: ${err.message}` });
    }
});

// Get user
router.get('/user', verifyToken, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update user
router.put('/user', verifyToken, async (req, res) => {
    let { username } = req.body;
    try {
        let authId = req.user.id;
        await updateUserById(authId, { username });
        res.status(200).json({ msg: 'User updated' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;