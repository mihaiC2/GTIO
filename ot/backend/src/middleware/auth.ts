/*
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: 'Access denied, no token provided' });

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Token") {
            return res.status(401).json({ msg: 'Token format is invalid' });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        req.user = decoded; // Almacena userId en req.user
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

*/
import jwt from 'jsonwebtoken';


export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({ msg: 'Access denied, no token provided' });
        return;
    }

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Token") {
            res.status(401).json({ msg: 'Token format is invalid' });
            return;
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET as string);
        req.user = decoded; // Almacena userId en req.user
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
