import  express from "express";
import { verifyToken } from "../middleware/auth";
import { getAllUsers, deleteUser } from  "../models/Users";
import { Request, Response } from 'express';
import { logRequest } from "../utils/logger";

const router = express.Router();

router.get('/all', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) {
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        return;
    }

    try {
        const orderBy = req.query.orderBy || 'created_at';
        const order = req.query.order || 'asc';
        const username = req.query.username as string;

        let users = await getAllUsers();

        // Filtrar por nombre si se especifica
        if (username) {
            users = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
        }
        // Ordenar resultados
        users.sort((a, b) => {
            if (order.toString() === 'asc') {
                return a[orderBy as string] > b[orderBy as string] ? 1 : -1;
            } else {
                return a[orderBy as string] < b[orderBy as string] ? 1 : -1;
            }
        });
        logRequest(req, `Retrieved all users successfully`);
        res.status(200).json(users);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to retrieve users: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        } else {
            logRequest(req, `Failed to retrieve users: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

router.delete('/delete-account/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin){
        logRequest(req, `Access denied: Admin privileges required`, 'error');
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });
        return;
    }

    const { id } = req.params;
    try {
        await deleteUser(id);
        logRequest(req, `User deleted successfully: ${id}`);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            logRequest(req, `Failed to delete user: ${err.message}`, 'error');
            res.status((err as any).status || 500).json({ msg: err.message });
        }
        else {
            logRequest(req, `Failed to delete user: ${err}`, 'error');
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

export default router;