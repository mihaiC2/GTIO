require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const database = require('./utils/supabase');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ Conected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const voteRoutes = require('./routes/votes');
app.use('/api/votes', voteRoutes);
const singersRoutes = require('./routes/singers');
app.use('/api/singers', singersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
