import express from "express";
import jwt from "jsonwebtoken";

import {
  askGemini,
  generateItineraryPrompt,
  generatePlacePrompt,
} from "../helpers/gemini.js";
import {
  getPlaceID,
  getPlacePhoto,
  getPlaceDetails,
  getPlaceGeoLocation,
} from "../helpers/googleMaps.js";
import {
  createTrip,
  createItinerary,
  renameTrip,
  deleteTrip,
  getTripsByUserId,
  getItineraryByTripId,
  updatePlaceInItinerary,
  addPlaceToItinerary,
  getPlaceExtraDetails,
  getGooglePlaceID,
  getImageByPlaceId,
  deletePlaceFromItinerary,
} from "../helpers/supabase.js";

const router = express.Router();

// Helper function to verify JWT token
async function verifyToken(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
    return null;
  }
}

// Generate itinerary using Gemini AI (no auth check here, add if needed)
router.post("/generate", async (req, res) => {
  const tripCreationResponse = await createTrip(req);
  if (tripCreationResponse.error) {
    return res.status(500).json({ error: tripCreationResponse.error });
  }

  const { destination, noOfDays, noOfTravelers, budget, notes } = req.body;
  const tripDetails = { destination, noOfDays, noOfTravelers, budget, notes };

  const itineraryPrompt = generateItineraryPrompt(tripDetails);
  try {
    const response = await askGemini(itineraryPrompt);
    const cleaned = response.text.replace(/```(?:json)?/g, "").trim();
    const generatedItinerary = JSON.parse(cleaned);

    await Promise.all(
      Object.keys(generatedItinerary).map((day) =>
        Promise.all(
          generatedItinerary[day].map(async (place) => {
            if (!place.name) {
              console.warn(`Skipping place with no name in day ${day}`);
              return;
            }
            try {
              place.id = await getPlaceID(place.name, destination);
              place.image = await getPlacePhoto(place.name);
              place.location = await getPlaceGeoLocation(place.id);
            } catch (err) {
              console.warn(`Failed for ${place.name}: ${err.message}`);
            }
          })
        )
      )
    );

    const itineraryCreationResponse = await createItinerary(
      tripCreationResponse.trip_id,
      generatedItinerary
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
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const user_id = decoded.sub;
  const trips = await getTripsByUserId(user_id);
  if (trips.error) {
    return res.status(500).json({ error: trips.error });
  }
  res.json(trips);
});

// Rename trip title by trip_id
router.patch("/:trip_id", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const trip_id = req.params.trip_id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const renameResponse = await renameTrip(trip_id, title);
  if (renameResponse.error) {
    return res.status(500).json({ error: renameResponse.error });
  }
  res.json(renameResponse);
});

// Delete trip by trip_id
router.delete("/:trip_id", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const tripId = req.params.trip_id;
  const deleteResponse = await deleteTrip(tripId);
  if (deleteResponse.error) {
    return res.status(500).json({ error: deleteResponse.error });
  }
  res.json(deleteResponse);
});

// Get trip itinerary by trip_id
router.get("/:trip_id/itinerary", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const tripId = req.params.trip_id;
  const dayResponse = await getItineraryByTripId(tripId);
  if (dayResponse.error) {
    return res.status(500).json({ error: dayResponse.error });
  }
  res.json(dayResponse);
});

// Add a place to the itinerary
router.post("/:trip_id/itinerary", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const { trip_id } = req.params;
  const { day_number, place_name, destination } = req.body;

  const placePromt = generatePlacePrompt(place_name, destination);
  try {
    const responseGeneratedPlace = await askGemini(placePromt);
    const cleaned = responseGeneratedPlace.text
      .replace(/```(?:json)?/g, "")
      .trim();
    const generatedPlace = JSON.parse(cleaned);

    generatedPlace[0].id = await getPlaceID(place_name, destination);
    generatedPlace[0].image = await getPlacePhoto(place_name);
    generatedPlace[0].location = await getPlaceGeoLocation(
      generatedPlace[0].id
    );

    const responseAddPlace = await addPlaceToItinerary(
      trip_id,
      day_number,
      generatedPlace[0]
    );
    if (responseAddPlace.error) {
      return res.status(500).json({ error: responseAddPlace.error });
    }

    res.json(responseAddPlace);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Place generation failed", message: err.message });
  }
});

// Update the order of places in the itinerary
router.patch("/places/order", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const { places } = req.body;
  if (!places || !Array.isArray(places) || places.length === 0) {
    return res.status(400).json({ error: "Invalid places data" });
  }

  try {
    const updatedPlaces = await Promise.all(
      places.map((place) => {
        if (
          !place.place_id ||
          place.order_index === undefined ||
          place.order_index === null
        ) {
          throw new Error("Each place must have place_id and order_index");
        }
        return updatePlaceInItinerary(place.place_id, {
          order_index: place.order_index,
          start_time: place.start_time,
          end_time: place.end_time,
        });
      })
    );

    if (updatedPlaces.some((p) => p.error)) {
      return res.status(500).json({
        error: updatedPlaces.find((p) => p.error).error,
      });
    }

    res.json({ message: "Places order updated successfully" });
  } catch (err) {
    console.error("Error updating places order:", err);
    res
      .status(500)
      .json({ error: "Failed to update places order", message: err.message });
  }
});

// Update a place in the itinerary
router.patch("/places/:place_id", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const { place_id } = req.params;
  try {
    const updatedPlace = await updatePlaceInItinerary(place_id, req.body);
    if (updatedPlace.error) {
      return res.status(500).json({ error: updatedPlace.error });
    }
    res.json(updatedPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detete a place from the itinerary
router.delete("/places/:place_id", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const { place_id } = req.params;
  try {
    const deleteResponse = await deletePlaceFromItinerary(place_id);
    if (deleteResponse.error) {
      return res.status(500).json({ error: deleteResponse.error });
    }
    res.json({ message: "Place deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get details of a specific place in the itinerary
router.get("/places/:place_id/details", async (req, res) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const { place_id } = req.params;
  try {
    // Check if extra details already exist in DB
    const cachedDetails = await getPlaceExtraDetails(place_id);
    if (
      cachedDetails &&
      !cachedDetails.error &&
      cachedDetails.extra_details &&
      Object.keys(cachedDetails.extra_details).length > 0
    ) {
      // Add image from your DB
      const image = await getImageByPlaceId(place_id);
      if (image.error) {
        return res.status(500).json({ error: image.error });
      }
      cachedDetails.image = image;
      console.log("Returning cached place details");
      return res.json(cachedDetails.extra_details);
    }

    // Not in DB → fetch from Google API
    const googlePlaceID = await getGooglePlaceID(place_id);
    if (googlePlaceID.error) {
      return res.status(500).json({ error: googlePlaceID.error });
    }

    const placeDetails = await getPlaceDetails(googlePlaceID);
    if (placeDetails.error) {
      return res.status(500).json({ error: placeDetails.error });
    }

    // Add image to placeDetails
    const image = await getImageByPlaceId(place_id);
    if (image.error) {
      return res.status(500).json({ error: image.error });
    }
    placeDetails.image = image;

    // Save new placeDetails to your DB for future use
    const placeDetailsToSave = {
      extra_details: placeDetails,
    };
    const saveResult = await updatePlaceInItinerary(
      place_id,
      placeDetailsToSave
    );
    if (saveResult.error) {
      return res.status(500).json({ error: saveResult.error });
    }

    console.log("Returning new place details");
    res.json(placeDetails);
  } catch (error) {
    console.error("Error in /places/:place_id/details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
