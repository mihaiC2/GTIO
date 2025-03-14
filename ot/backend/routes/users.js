const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getAllUsers, deleteUser } = require('../models/Users');

const router = express.Router();

router.get('/all', verifyToken, async (req, res) => {
    if (!req.user.admin) 
        return res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    try {
        const { orderBy = 'created_at', order = 'asc', username } = req.query;
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
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

router.delete('/delete-account/:id', verifyToken, async (req, res) => {
    if (!req.user.admin) 
        return res.status(403).json({ msg: 'Access denied: Admin privileges required' });

    const { id } = req.params;
    try {
        await deleteUser(id);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

module.exports = router;