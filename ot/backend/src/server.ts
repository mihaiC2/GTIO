import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// 🔹 Cargar variables de entorno
dotenv.config();

// 🔹 Crear la aplicación de Express
const app = express();

// 🔹 Configurar middlewares
app.use(cors()); // Permitir peticiones de otros dominios
app.use(express.json()); // Habilitar JSON en las peticiones

// 🔹 Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/miDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// 🔹 Ruta básica de prueba
app.get("/", (req, res) => {
  res.send("🔥 ¡Servidor funcionando con TypeScript!");
});

// 🔹 Importar y usar rutas (cuando las crees en `src/routes/`)
import authRoutes from "./routes/auth";
import voteRoutes from "./routes/votes";
import singerRoutes from "./routes/singers";

app.use("/api/auth", authRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/singers", singerRoutes);

// 🔹 Definir puerto y arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
