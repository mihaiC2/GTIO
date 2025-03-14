import  express from "express";
import { verifyToken } from "../middleware/auth";
import { getAllUsers, deleteUser } from  "../models/Users";
import { Request, Response } from 'express';

const router = express.Router();

router.get('/all', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) 
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    try {
        const { orderBy = 'created_at', order = 'asc', username } = req.body.query;
        let users = await getAllUsers();

        // Filtrar por nombre si se especifica
        if (username) {
            users = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
        }
        // Ordenar resultados
        users.sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            } else {
                return a[orderBy] < b[orderBy] ? 1 : -1;
            }
        });

        res.status(200).json(users);
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

router.delete('/delete-account/:id', verifyToken, async (req: Request, res: Response) => {
    if (!req.body.user.admin) 
        res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    const { id } = req.params;
    try {
        await deleteUser(id);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;