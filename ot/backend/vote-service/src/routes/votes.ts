import express from "express";
import { verifyToken } from "../../../shared/middleware/auth";
import { createVote, getVoteByUser, getVotesBySinger, getVotesCountBySinger } from "../models/Vote";
import { Request, Response } from 'express';
import { getSingersByGalaId } from "../models/Singer";

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

// Obtener el número total de votos por cada cantante
router.get('/votes-by-gala/:galaId', async (req: Request, res: Response) => {
    const { galaId } = req.params;
    try {
        let singers = await getSingersByGalaId(galaId);
        let voteCountBySinger = await getVotesCountBySinger(singers, galaId);

        res.status(200).json(voteCountBySinger);
    } catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

router.get('/vote/:galaId', verifyToken, async (req: Request, res: Response) => {
    let authId = req.body.user.id;
    const { galaId } = req.params;
    try {
        let data = await getVoteByUser(authId, galaId);
        
        if (!data) {
            res.status(404).json({ msg: 'Vote not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (err: any) {
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;
