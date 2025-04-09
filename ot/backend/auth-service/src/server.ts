import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth';

app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

export {app, server};

