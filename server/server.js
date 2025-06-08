import express from "express";
import dotenv from "dotenv";
dotenv.config();

import itineraryRoutes from "./routes/itinerary.js";
import placeRoutes from "./routes/place.js";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

const app = express();
const PORT = process.env.SERVER_PORT || 3002;

app.use("/api/itinerary", itineraryRoutes);
app.use("/api/place", placeRoutes);

// Test route in index
app.get("/api/test", async (req, res) => {
  const { error } = await supabase.from("users").insert({
    email: "nailfdwwdwdawdwdwdwd00@gmail.com",
    pass_hash: "password123",
    name: "Test User",
  });

  const { data, error: fetchError } = await supabase.from("users").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
