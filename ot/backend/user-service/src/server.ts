import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import userRoutes from './routes/users';

app.use('/', userRoutes);

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

export {app, server};
