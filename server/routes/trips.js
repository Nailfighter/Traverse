import express from "express";
import jwt from "jsonwebtoken";

import { askGemini, generatePrompt } from "../helpers/gemini.js";
import { getPlaceID, getPlacePhoto } from "../helpers/googleMaps.js";
import {
  createTrip,
  createItinerary,
  getTripById,
  getTripsByUserId,
  getItineraryByTripId,
} from "../helpers/supabase.js";

const router = express.Router();

// Generate itinerary using Gemini AI
router.post("/generate", async (req, res) => {
  // Create trip in database
  const tripCreationResponse = await createTrip(req);
  if (tripCreationResponse.error) {
    return res.status(500).json({ error: tripCreationResponse.error });
  }

  // Extract trip details from request body
  const { destination, noOfDays, noOfTravelers, budget, notes } = req.body;
  const tripDetails = {
    destination,
    noOfDays,
    noOfTravelers,
    budget,
    notes,
  };

  // Generate itinerary prompt and ask Gemini AI
  const itineraryPrompt = generatePrompt(tripDetails);
  try {
    const response = await askGemini(itineraryPrompt);
    const cleaned = response.text.replace(/```(?:json)?/g, "").trim();
    const genneratedItinerary = JSON.parse(cleaned);
    await Promise.all(
      Object.keys(genneratedItinerary).map((day) =>
        Promise.all(
          genneratedItinerary[day].map(async (place) => {
            try {
              place.id = await getPlaceID(place.name);
              place.image = await getPlacePhoto(place.name);
            } catch (err) {
              console.warn(`Failed for ${place.name}: ${err.message}`);
              place.image = null;
            }
          })
        )
      )
    );

    // Create itinerary in database
    const itineraryCreationResponse = await createItinerary(
      tripCreationResponse.trip_id,
      genneratedItinerary
    );

    res.json(itineraryCreationResponse);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Itinerary generation failed", message: err.message });
  }
});

// Get all trips for a user
router.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.sub;

    const trips = await getTripsByUserId(user_id);
    if (trips.error) {
      return res.status(500).json({ error: trips.error });
    }

    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trip details by trip_id
router.get("/:trip_id", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tripId = req.params.trip_id;

    // Fetch trip details from the database using tripId
    const tripDetails = await getTripById(tripId);
    if (tripDetails.error) {
      return res.status(500).json({ error: tripDetails.error });
    }

    res.json(tripDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trip itinerary by trip_id
router.get("/:trip_id/itinerary", async (req, res) => {
  const tripId = req.params.trip_id;
  const dayResponse = await getItineraryByTripId(tripId);
  if (dayResponse.error) {
    return res.status(500).json({ error: dayResponse.error });
  }

  res.json(dayResponse);
});

export default router;
