import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateItineraryPrompt = (tripDetails) => {
  const budgetOptions = {
    Low: "500 - 1000 USD",
    Medium: "1000 - 2500 USD",
    High: "2500+ USD",
  };

  const notePart = tripDetails.notes
    ? `The person has provided this note with preferences and additional information: "${tripDetails.notes}".`
    : "";

  return `
Give me a ${tripDetails.noOfDays}-day full-day itinerary of ${
    tripDetails.destination
  }. It should include some touristy places, as well as exciting and unique locations for a traveler. Don't be ambigioous. For eg don't be like Broadway Show (Choose a show). Be as specific location so that I can search it on google maps which an issue. It should be actual places or locations — do not include any general activity or tour.

The budget is ${
    budgetOptions[tripDetails.budget]
  } for the whole trip, and it is for ${
    tripDetails.noOfTravelers
  } traveler(s). ${notePart}

The final output needs to be a JSON object in this format:
{
  1: [ { id, name, description, start, end, image } ],
  2: [ ... ],
  ...
}

Guidelines:
- "name": The exact name of a place or point of interest. It should not include any verb or action — strictly use the name of the point of interest.
- The description should be like: "Cozy bookstore and cafe with local vibes and used books.
- "start" and "end": Times in 12-hour format (e.g. "9:00 AM" - "11:30 AM"). Make sure the times are not past 10:00 PM.
- "image": Always set this to null.

Ensure the result is valid JSON with no extra commentary or explanations.
`;
};

export const generatePlacePrompt = (placeName, placeDestination) => {
  return `I need information on ${placeName}, ${placeDestination} as part of itinerary.
The final output needs to be a JSON object in this format:
{ id, name, description, start, end, image }
Guidelines:
"name": ${placeName}
- The description should be like: "Cozy bookstore and cafe with local vibes and used books.
- "start" and "end": Times in 12-hour format (e.g. "9:00 AM" - "11:30 AM") and needs to be from 10:30 PM to 11:30 PM
- "image": Always set this to null.
Ensure the result is valid JSON with no extra commentary or explanations
`;
};

export async function askGemini(prompt) {
  return ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });
}
