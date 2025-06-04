import express from "express";
import dotenv from "dotenv";
import { getPlacePhoto } from "./helpers/googleMaps.js";
import itineraryRoutes from "./routes/itinerary.js";
import placeRoutes from "./routes/place.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3002;

app.use("/api/itinerary", itineraryRoutes);
app.use("/api/place", placeRoutes);

// Test route in index
app.get("/api/test", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
