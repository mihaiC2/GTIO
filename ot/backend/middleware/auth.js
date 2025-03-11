const { getUserByAuthId } = require('../models/User');
const { supabase } = require('../utils/supabase');

exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');

    // Token de prueba para el ornitorrinco--------------------- ESTO DE MOMENTO NO FUNCIONA
    // if (token == 'Token ornitorrinco') {
    //     req.user = {userId: '67b1222cec8f8300d739b1fe'};
    //     return next();
    // }
    // Token de prueba para el ornitorrinco ---------------------

    if (!token) return res.status(401).json({ msg: 'Access denied, no token provided' });

    try {
        const tokenParts = token.split(" ");

        let { data, error } = await supabase.auth.getUser(tokenParts[1]);

        if (error) {
            console.log(error)
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        let authId = data.user.id;
        let user = await getUserByAuthId(authId);
        req.user = user;
        return next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
