const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    // Token de prueba para el ornitorrinco---------------------
    if (token == 'Token ornitorrinco') {
        req.user = {userId: '67b1222cec8f8300d739b1fe'};
        return next();
    }
    // Token de prueba para el ornitorrinco ---------------------

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
