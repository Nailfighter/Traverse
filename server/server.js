import express from "express";
import dotenv from "dotenv";
dotenv.config();

import tripsRoutes from "./routes/trips.js";
import mapsRoutes from "./routes/maps.js";

import { getPlaceGeoLocation } from "./helpers/googleMaps.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3002;

app.use(express.json());
app.use("/api/trips", tripsRoutes);
app.use("/api/maps", mapsRoutes);

// Test route in index
app.get("/api/test", async (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
