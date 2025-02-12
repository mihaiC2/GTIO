require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en la conexión a MongoDB:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en el puerto ${PORT}`));
