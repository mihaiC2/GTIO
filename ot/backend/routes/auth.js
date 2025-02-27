const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/supabase');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();
        
        if (existingUser) return res.status(400).json({ msg: 'This user already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into Supabase
        const { error } = await supabase.auth.signUp({
            email,
            password: hashedPassword,
            options: {
                data: { username: username }
            }
        })
            
        if (error) throw error;

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error in the server' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (error || !user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error in the server' });
    }
});

module.exports = router;