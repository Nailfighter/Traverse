import express from "express";
import dotenv from "dotenv";
dotenv.config();

import tripsRoutes from "./routes/trips.js";
import mapsRoutes from "./routes/maps.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3002;

app.use(express.json());
app.use("/api/trips", tripsRoutes);
app.use("/api/maps", mapsRoutes);

// Test route in index
app.post("/api/test", async (req, res) => {
  res.status(200).json({
    message: "Yes, the server is running!",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
