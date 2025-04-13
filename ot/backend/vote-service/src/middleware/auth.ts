import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({ msg: 'Access denied, no token provided' });
        return;
    }

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            res.status(400).json({ msg: "Invalid token format" });
            return;
        }

        let { data, error } = await supabase.auth.getUser(tokenParts[1]);

        if (error) {
            console.error("Supabase Auth Error:", error);
            res.status(401).json({ msg: "Invalid or expired token" });
            return;
        }

        if (!data?.user?.id) {
            res.status(401).json({ msg: "Access denied, no token provided" });
            return;
        }

        let user = await getUserByAuthId(data.user.id);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        req.body.user = user;
        next();

    } catch (err: any) {
        console.error("Token Verification Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const getUserByAuthId = async (authId: string) => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', authId)
            .single();
            
        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
}