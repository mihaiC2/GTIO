import express from "express";
import { verifyToken } from "../middleware/auth";
import { createVote, getVoteByUser, getVotesBySinger, getVotesCountBySinger, getSingersByGalaId } from "../models/Vote";
import { Request, Response } from 'express';
// import { getSingersByGalaId } from "../../../singer-service/src/models/Singer";
import { logRequest } from "../utils/logger";

const router = express.Router();

router.post('/vote', verifyToken, async (req: Request, res: Response) => {
    const { singerId, galaId } = req.body;
    let authId = req.body.user.id;
    try {

        let data = await createVote({ singer_id: singerId, user_id: authId, gala_id: galaId });
        logRequest(req, `Voted successfully: ${data.id}`);
        res.status(201).json({ msg: 'Voted successfully', vote: data });
    } catch (err: any) {
        logRequest(req, `Failed to vote: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Obtener el número de votos por cantante
router.get('/votes/:singerId', async (req: Request, res: Response) => {
    const { singerId } = req.params;

    try {
        let data = await getVotesBySinger(singerId);
        logRequest(req, `Retrieved votes successfully for singer: ${singerId}`);
        res.status(200).json({ singerId, votes: data });
    } catch (err: any) {
        logRequest(req, `Failed to retrieve votes for singer: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

// Obtener el número total de votos por cada cantante
router.get('/votes-by-gala/:galaId', async (req: Request, res: Response) => {
    const { galaId } = req.params;
    try {
        let singers = await getSingersByGalaId(galaId);
        let voteCountBySinger = await getVotesCountBySinger(singers, galaId);
        logRequest(req, `Retrieved votes by gala successfully: ${galaId}`);
        res.status(200).json(voteCountBySinger);
    } catch (err: any) {
        logRequest(req, `Failed to retrieve votes by gala: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

router.get('/vote/:galaId', verifyToken, async (req: Request, res: Response) => {
    let authId = req.body.user.id;
    const { galaId } = req.params;
    try {
        let data = await getVoteByUser(authId, galaId);
        
        if (!data) {
            logRequest(req, `Vote not found`, 'error');
            res.status(404).json({ msg: 'Vote not found' });
            return;
        }
        logRequest(req, `Retrieved vote successfully: ${data.id}`);
        res.status(200).json(data);
    }
    catch (err: any) {
        logRequest(req, `Failed to retrieve vote: ${err.message}`, 'error');
        res.status(err.status || 500).json({ msg: err.message });
    }
});

export default router;
