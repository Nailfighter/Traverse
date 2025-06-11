import express from "express";
import fetch from "node-fetch";
import { getPlaceDetails } from "../helpers/googleMaps.js";

const router = express.Router();

//! Maybe not needed Get place details by ID from Google Places API
router.get("/:id", async (req, res) => {
  const placeID = req.params.id;
  if (!placeID) return res.status(400).json({ error: "Missing place ID" });

  const placeDetailsResponse = await getPlaceDetails(placeID);
  if (placeDetailsResponse.error) {
    return res.status(500).json({ error: placeDetailsResponse.error });
  }
  res.json(placeDetailsResponse);
});

export default router;
