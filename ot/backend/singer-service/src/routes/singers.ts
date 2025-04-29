import express from 'express';
import { createSinger, getAllSingers, getSingerById, updateSingerById, deleteSingerById } from "../models/Singer";
import { verifyToken } from "../middleware/auth";
import { Request, Response } from 'express';
import { logRequest } from "../utils/logger";

const router = express.Router();

// Add a new singer
router.post('/add', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        return;
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
    } catch (err: unknown){
        if (err instanceof Error) {
            logRequest(req, `Failed to add singer: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to add singer: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

// Get all singers
router.get('/all', async (req: Request, res: Response) => {
    try {
        const singers = await getAllSingers();
        logRequest(req, `Retrieved all singers successfully`);
        res.status(200).json(singers);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to retrieve singers: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to retrieve singers: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

// Get singer by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const singer = await getSingerById(req.params.id);
        logRequest(req, `Retrieved singer successfully: ${singer.stage_name} (ID: ${singer.id})`);
        res.status(200).json(singer);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to retrieve singer: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to retrieve singer: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

// Update singer by ID
router.put('/update/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        return;
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
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to update singer: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to update singer: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

// Delete singer by ID
router.delete('/delete/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        return;
    }

    try {
        const data = await deleteSingerById(req.params.id);
        logRequest(req, `${data.msg} (ID: ${req.params.id})`); // TODO: cambiar el deleteSingerByID, lo que devuelve
        res.status(200).json(data);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to delete singer: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to delete singer: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

export default router;