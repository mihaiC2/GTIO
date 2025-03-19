import express from "express";
import { createSinger, getAllSingers, getSingerById, updateSingerById, deleteSingerById } from "../models/Singer";
import { verifyToken } from "../../../shared/middleware/auth";
import { Request, Response } from 'express';
import { logRequest } from "../../../shared/utils/logger";

const router = express.Router();

// Add a new singer
router.post('/add', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }
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
        logRequest(req, `Singer added successfully: ${stage_name} (ID: ${data.id})`);
        res.status(201).json({ msg: 'Singer added successfully', singer: data });
    } catch (err: any) {
        logRequest(req, `Failed to add singer: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Get all singers
router.get('/all', async (req: Request, res: Response) => {
    try {
        const singers = await getAllSingers();
        logRequest(req, `Retrieved all singers successfully`);
        res.status(200).json(singers);
    } catch (err: any) {
        logRequest(req, `Failed to retrieve singers: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Get singer by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const singer = await getSingerById(req.params.id);
        logRequest(req, `Retrieved singer successfully: ${singer.stage_name} (ID: ${singer.id})`);
        res.status(200).json(singer);
    } catch (err: any) {
        logRequest(req, `Failed to retrieve singer: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Update singer by ID
router.put('/update/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }

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
        logRequest(req, `Singer updated successfully: ${updatedSinger.stage_name} (ID: ${updatedSinger.id})`);
        res.status(200).json({ msg: 'Singer updated successfully', singer: updatedSinger });
    } catch (err: any) {
        logRequest(req, `Failed to update singer: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Delete singer by ID
router.delete('/delete/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }

    try {
        const data = await deleteSingerById(req.params.id);
        logRequest(req, `${data.msg} (ID: ${req.params.id})`); // TODO: cambiar el deleteSingerByID, lo que devuelve
        res.status(200).json(data);
    } catch (err: any) {
        logRequest(req, `Failed to delete singer: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;