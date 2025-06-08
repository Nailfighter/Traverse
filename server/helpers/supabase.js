import jwt from "jsonwebtoken";
import { getPlaceBanner } from "../helpers/googleMaps.js";

import { createClient } from "@supabase/supabase-js";
import e from "express";
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export async function createTrip(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.sub;

    const {
      title,
      destination,
      start_date,
      end_date,
      noOfTravelers,
      budget,
      notes,
    } = req.body;

    const banner = await getPlaceBanner(destination);

    const { data, error } = await supabase
      .from("trips")
      .insert({
        user_id,
        title,
        destination,
        banner: banner.image || null,
        start_date,
        end_date,
        no_of_travelers: noOfTravelers,
        budget,
        notes,
      })
      .select("trip_id")
      .single();

    if (error) {
      return { error: error.message };
    }

    return { trip_id: data.trip_id };
  } catch (err) {
    return { error: err.message };
  }
}

export async function createItinerary(trip_id, generatedItinerary) {
  for (const day in generatedItinerary) {
    const { data: dayData, error: dayError } = await supabase
      .from("days")
      .insert({ trip_id, day_number: Number(day) }) // coerce day_number to number
      .select("day_id")
      .single();

    if (dayError) {
      return { error: dayError.message };
    }

    const day_id = dayData.day_id;

    const places = generatedItinerary[day];
    let orderIndex = 0;

    for (const place of places) {
      const { error: placeError } = await supabase.from("places").insert({
        google_place_id: place.id,
        day_id,
        order_index: orderIndex++,
        name: place.name,
        description: place.description,
        start_time: place.start,
        end_time: place.end,
        image: place.image,
      });

      if (placeError) {
        return { error: placeError.message };
      }
    }
  }

  return { success: true };
}

export async function getTripsByUserId(userId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", userId)
    .order("last_updated", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return data;
}

export async function getTripById(tripId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("trip_id", tripId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
}

export async function getItineraryByTripId(tripId) {
  const { data, error } = await supabase
    .from("days")
    .select("day_id, day_number, places(*)")
    .eq("trip_id", tripId)
    .order("day_number", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  // Transform data into a more usable format
  const itinerary = {};
  data.forEach((day) => {
    itinerary[day.day_number] = day.places.map((place) => ({
      id: place.google_place_id,
      name: place.name,
      description: place.description,
      start: place.start_time,
      end: place.end_time,
      image: place.image,
    }));
  });

  return itinerary;
}
