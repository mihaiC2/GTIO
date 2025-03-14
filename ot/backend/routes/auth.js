const express = require('express');
const { createUser, authLogin, updateUserById } = require('../models/Auth');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Register 
// curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\": \"test\", \"email\": \"test@gmail.com\", \"password\": \"test\"}"
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Insert user into Supabase
        let user_id = await createUser(email, password, { username });

        res.status(201).json({ msg: 'User registered successfully', user_id: user_id });
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        data = await authLogin(email, password);
        res.status(200).json({ token: data.session.access_token});
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Get user
router.get('/user', verifyToken, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Update user
router.put('/user', verifyToken, async (req, res) => {
    let { username, avatar_url } = req.body;
    try {
        await updateUserById(req.user.id, { username, avatar_url });
        res.status(200).json({ msg: 'User updated' });
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

module.exports = router;