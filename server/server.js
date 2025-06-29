import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import tripsRoutes from "./routes/trips.js";
import mapsRoutes from "./routes/maps.js";

const app = express();
const PORT = process.env.SERVER_PORT ;

app.use(cors());
app.use(express.json());

app.use("/api/trips", tripsRoutes);
app.use("/api/maps", mapsRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from the backend!",
    serverTime: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
