import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Get place details by ID from Google Places API
router.get("/:id", async (req, res) => {
  const placeID = req.params.id;
  if (!placeID) return res.status(400).json({ error: "Missing place ID" });

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.VITE_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "displayName.text,types,formattedAddress,googleMapsUri,googleMapsLinks.reviewsUri,regularOpeningHours.weekdayDescriptions,internationalPhoneNumber,rating,userRatingCount,websiteUri,postalAddress.locality,postalAddress.administrativeArea,types",
        },
      }
    );

    if (!response.ok) throw new Error("Place detail fetch failed");

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Place route error:", err);
    res.status(500).json({ error: "Could not fetch place" });
  }
});

export default router;
