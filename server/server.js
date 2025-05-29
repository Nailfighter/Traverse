import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const app = express();
const PORT = process.env.SERVER_PORT || 3002;

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

app.get("/api/itinerary/generate", async (req, res) => {
  try {
    const response = await askGemini(itineraryPrompt);

    const cleaned = response.text.replace(/```(?:json)?/g, "").trim();
    const jsonObject = JSON.parse(cleaned);
    res.json(jsonObject);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate itinerary due to JSON Parsing Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});

const itineraryPrompt = `
Give me a 3-day full day Itinerary of State College, PA. It should not be everyday places and rather exciting placing for traveler. It should be in "$" budget and it is for solo traveler.
The final output needs to be a json file this format.  1: [id:  name:,  description:, start: , end:, image:] following these rules
The 1 is day number. The day number is the key of the object and the value is an array of objects of places.
The name is name of place or point of interest. It should not be phrase like lunch or dinner or breakfast but rather just the name
The description should be something like this language "Cozy bookstore and cafe with local vibes and used books."
The start and end indicate the start time and end time for each event. It should be 12 hr format
The image is null
`;
