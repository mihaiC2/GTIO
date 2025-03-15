import express from "express";
import { verifyToken } from "../../../shared/middleware/auth";
import { createVote, getVotesBySinger, getSingerVoteStatsForGala } from "../models/Vote";
import { Request, Response } from 'express';

const router = express.Router();

router.post('/vote', verifyToken, async (req: Request, res: Response) => {
    const { singerId, galaId } = req.body;
    let authId = req.body.user.id;
    try {

        let data = await createVote({ singer_id: singerId, user_id: authId, gala_id: galaId });

        res.status(201).json({ msg: 'Voted successfully', vote: data });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Obtener el número de votos por cantante
router.get('/votes/:singerId', async (req: Request, res: Response) => {
    const { singerId } = req.params;

    try {
        let data = await getVotesBySinger(singerId);

        res.status(200).json({ singerId, votes: data });
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// // Obtener todos los votos de un usuario
// router.get('/user-votes', verifyToken, async (req, res) => {
//     const userId = req.user.userId;

//     try {
//         const { data: userVotes, error } = await supabase
//             .from('votes')
//             .select('singer_id, singers(name)')
//             .eq('user_id', userId);

//         if (error) throw error;

//         res.status(200).json(userVotes);
//     } catch (err) {
//         res.status(500).json({ msg: 'Error in the server', error: err.message });
//     }
// });

// Obtener el número total de votos por cada cantante
router.get('/votes-by-gala/:galaId', async (req: Request, res: Response) => {
    const { galaId } = req.params;
    try {

        let voteCountBySinger = await getSingerVoteStatsForGala(galaId);

        res.status(200).json(voteCountBySinger);
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;
