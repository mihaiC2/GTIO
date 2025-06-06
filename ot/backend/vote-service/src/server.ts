import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import voteRoutes from "./routes/votes";

app.use("/votes/", voteRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () =>
  console.log(`🔥 Server running on port ${PORT}`)
);

export { app, server };
