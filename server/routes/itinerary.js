import express from "express";
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const router = express.Router();

//#region Helpers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

async function askGemini(prompt) {
  return ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });
}

async function getPlaceID(placeName) {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.VITE_GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({ textQuery: placeName }),
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch place ID`);
  const data = await response.json();
  return data.places?.[0]?.id;
}

async function getPlacePhotoAdr(placeID) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.VITE_GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "photos",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch place details");
  const data = await response.json();
  return data.photos?.[0];
}

async function getPlacePhoto(placeName, maxHeightPx = 200, maxWidthPx = 200) {
  const placeID = await getPlaceID(placeName);
  const photoPath = await getPlacePhotoAdr(placeID);

  const response = await fetch(
    `https://places.googleapis.com/v1/${photoPath.name}/media?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
  );
  if (!response.ok) throw new Error("Failed to fetch photo");
  const buffer = await response.buffer();
  return buffer.toString("base64");
}
//#endregion

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
    res.status(500).json({ error: "Itinerary generation failed" });
  }
});

// Fetch banner image for a place
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
