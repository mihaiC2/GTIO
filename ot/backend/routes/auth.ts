import express from "express";
import { createUser, authLogin, updateUserById, getUserByAuthId } from "../models/Auth";
import { verifyToken } from "../middleware/auth";
import { Request, Response } from 'express';

const router = express.Router();


// Register 
// curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\": \"test\", \"email\": \"test@gmail.com\", \"password\": \"test\"}"
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    try {
        // Insert user into Supabase
        let user_id = await createUser(email, password, { username });

        res.status(201).json({ msg: 'User registered successfully', user_id: user_id });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const data = await authLogin(email, password);
        res.status(200).json({ token: data.session.access_token, user: await getUserByAuthId(data.user.id) });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Get user
router.get('/user', verifyToken, async (req: Request, res: Response) => {
    try {
        res.status(200).json(req.body.user);
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Update user
router.put('/user', verifyToken, async (req: Request, res: Response) => {
    let { username, avatar_url } = req.body;
    try {
        await updateUserById(req.body.user.id, { username, avatar_url });
        res.status(200).json({ msg: 'User updated' });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

module.exports = router;