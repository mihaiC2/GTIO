import express from "express";
import { createUser, authLogin, updateUserById, getUserByAuthId } from "../models/Auth";
import { verifyToken } from "../middleware/auth";
import { logRequest } from "../utils/logger";
import { Request, Response } from 'express';

const router = express.Router();


// Register 
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    try {
        // Insert user into Supabase
        let user_id = await createUser(email, password, { username });
        const consumerRes = await fetch('http://kong:8001/consumers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email })
        });
        if (!consumerRes.ok && consumerRes.status !== 409) {
            throw new Error(`Error al crear el consumer en Kong: ${consumerRes.statusText}`);
        }

        const keyRes = await fetch(`http://kong:8001/consumers/${email}/key-auth`, {
            method: 'POST'
        });
        if (!keyRes.ok) {
            throw new Error(`Error al generar la API key: ${keyRes.statusText}`);
        }

        const keyData = await keyRes.json();
        const apiKey = keyData.key;

        logRequest(req, `User registered successfully: ${username} (ID: ${user_id})`);

        res.status(201).json({ msg: 'User registered successfully', user_id: user_id, apiKey });
    } catch (err: any) {
        logRequest(req, `Failed to register user: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const data = await authLogin(email, password);
        const user = await getUserByAuthId(data.user.id);

        const keyRes = await fetch(`http://kong:8001/consumers/${user.email}/key-auth`);
        if (!keyRes.ok) {
            throw new Error(`Error al obtener la API key: ${keyRes.statusText}`);
        }
        const keyData = await keyRes.json();
        const apiKey = keyData.data?.[0]?.key;

        logRequest(req, `User logged in successfully: ${user.username} (ID: ${user.id})`);
        
        res.status(200).json({ token: data.session.access_token, user: user, apiKey });
    } catch (err: any) {
        logRequest(req, `Failed to login: ${err.message}`, 'error');

        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Get user
router.get('/user', verifyToken, async (req: Request, res: Response) => {
    try {
        logRequest(req, `User retrieved successfully: ${req.body.user.username} (ID: ${req.body.user.id})`);
        res.status(200).json(req.body.user);
    } catch (err: any) {
        logRequest(req, `Failed to retrieve user: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Update user
router.put('/user', verifyToken, async (req: Request, res: Response) => {
    let { username, avatar_url } = req.body;
    try {
        await updateUserById(req.body.user.id, { username, avatar_url });
        logRequest(req, `User updated successfully: ${req.body.user.username} (ID: ${req.body.user.id})`);
        res.status(200).json({ msg: 'User updated' });
    } catch (err: any) {
        logRequest(req, `Failed to update user: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;