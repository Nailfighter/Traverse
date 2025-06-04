import express from "express";
import { askGemini } from "../helpers/gemini.js";
import { getPlaceID, getPlacePhoto } from "../helpers/googleMaps.js";

const router = express.Router();

const itineraryPrompt = `
Give me a 3-day full day Itinerary of State College, PA. It should not be everyday places and rather exciting placing for traveler. It should be in "$" budget and it is for solo traveler.
The final output needs to be a json file this format: 
{
  1: [{ id, name, description, start, end, image }],
  2: [...],
  ...
}
The name is name of place or point of interest. 
The description should be like: "Cozy bookstore and cafe with local vibes and used books."
Time should be 12-hour format.
The image can be null.
`;

// Generate itinerary using Gemini AI
router.get("/generate", async (req, res) => {
  try {
    const response = await askGemini(itineraryPrompt);
    const cleaned = response.text.replace(/```(?:json)?/g, "").trim();
    const json = JSON.parse(cleaned);

    await Promise.all(
      Object.keys(json).map((day) =>
        Promise.all(
          json[day].map(async (place) => {
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

    res.json(json);
  } catch (err) {
    console.error("Gemini error:", err);
    res
      .status(500)
      .json({ error: "Itinerary generation failed", message: err.message });
  }
});

// Fetch banner image for a place from Google Maps API
router.get("/banner", async (req, res) => {
  const place = req.query.place;
  if (!place) return res.status(400).json({ error: "Missing place name" });

  try {
    const img = await getPlacePhoto(place, 800, 400);
    res.json({ image: img });
  } catch (err) {
    console.error("Banner fetch error:", err);
    res.status(500).json({ error: `Could not fetch banner for "${place}"` });
  }
});

export default router;
