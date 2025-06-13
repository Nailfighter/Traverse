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

export async function renameTrip(tripId, title) {
  const { error } = await supabase
    .from("trips")
    .update({ title })
    .eq("trip_id", tripId);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function deleteTrip(tripId) {
  const { error } = await supabase.from("trips").delete().eq("trip_id", tripId);
  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function createItinerary(tripId, generatedItinerary) {
  for (const day in generatedItinerary) {
    const { data: dayData, error: dayError } = await supabase
      .from("days")
      .insert({ trip_id: tripId, day_number: Number(day) }) // coerce day_number to number
      .select("day_id")
      .single();

    if (dayError) {
      return { error: dayError.message };
    }

    const day_id = dayData.day_id;

    const places = generatedItinerary[day];
    let orderIndex = 1;

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
        lat: place.location.lat,
        lng: place.location.lng,
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

  const itinerary = {};
  data.forEach((day) => {
    itinerary[day.day_number] = day.places.map((place) => ({
      place_id: place.place_id,
      google_place_id: place.google_place_id,
      order_index: place.order_index,
      name: place.name,
      description: place.description,
      start: place.start_time,
      end: place.end_time,
      image: place.image,
      location: {
        lat: place.lat,
        lng: place.lng,
      },
    }));
  });

  const { error: tripError } = await supabase
    .from("trips")
    .update({ last_updated: new Date() })
    .eq("trip_id", tripId);
  if (tripError) {
    return { error: tripError.message };
  }

  return itinerary;
}

export async function addPlaceToItinerary(tripId, day_number, placeDetails) {
  const { data: dayData, error: dayError } = await supabase
    .from("days")
    .select("day_id")
    .eq("trip_id", tripId)
    .eq("day_number", day_number)
    .single();

  if (dayError) {
    return { error: dayError.message };
  }

  const day_id = dayData.day_id;
  const { data: existingPlaces, error: existingError } = await supabase
    .from("places")
    .select("order_index")
    .eq("day_id", day_id)
    .order("order_index", { ascending: false });

  if (existingError) {
    return { error: existingError.message };
  }
  const nextOrderIndex =
    existingPlaces.length > 0 ? existingPlaces[0].order_index + 1 : 1;

  const { data, error } = await supabase
    .from("places")
    .insert({
      google_place_id: placeDetails.id,
      day_id,
      order_index: nextOrderIndex,
      name: placeDetails.name,
      description: placeDetails.description,
      start_time: placeDetails.start,
      end_time: placeDetails.end,
      image: placeDetails.image || null,
      lat: placeDetails.location.lat,
      lng: placeDetails.location.lng,
    })
    .select("place_id")
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, place_id: data.place_id };
}

export async function updatePlaceInItinerary(placeId, updatedPlaceDetails) {
  const updateObj = {};
  if (updatedPlaceDetails.start_time !== undefined) {
    updateObj.start_time = updatedPlaceDetails.start_time;
  }
  if (updatedPlaceDetails.end_time !== undefined) {
    updateObj.end_time = updatedPlaceDetails.end_time;
  }
  if (updatedPlaceDetails.order_index !== undefined) {
    updateObj.order_index = updatedPlaceDetails.order_index;
  }
  if (updatedPlaceDetails.extra_details !== undefined) {
    updateObj.extra_details = updatedPlaceDetails.extra_details;
  }

  if (Object.keys(updateObj).length === 0) {
    return { error: "No valid fields to update." };
  }

  const { error } = await supabase
    .from("places")
    .update(updateObj)
    .eq("place_id", placeId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deletePlaceFromItinerary(placeId) {
  const { error } = await supabase
    .from("places")
    .delete()
    .eq("place_id", placeId);
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function getGooglePlaceID(placeId) {
  const { data, error } = await supabase
    .from("places")
    .select("google_place_id")
    .eq("place_id", placeId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return data.google_place_id;
}

export async function getImageByPlaceId(placeId) {
  const { data, error } = await supabase
    .from("places")
    .select("image")
    .eq("place_id", placeId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return data.image;
}

export async function getPlaceExtraDetails(placeId) {
  const { data, error } = await supabase
    .from("places")
    .select("extra_details")
    .eq("place_id", placeId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
}
