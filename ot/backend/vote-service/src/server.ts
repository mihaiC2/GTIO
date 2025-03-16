import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import voteRoutes from './routes/votes';

app.use('/api/votes', voteRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
