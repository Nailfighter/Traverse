import fetch from "node-fetch";

export async function getPlaceID(placeName) {
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
  const data = await response.json();
  return data.places?.[0]?.id;
}

export async function getPlacePhotoAdr(placeID) {
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
  const data = await response.json();
  return data.photos?.[0];
}

export async function getPlacePhoto(
  placeName,
  maxHeightPx = 200,
  maxWidthPx = 200
) {
  const placeID = await getPlaceID(placeName);
  const photoPath = await getPlacePhotoAdr(placeID);

  const response = await fetch(
    `https://places.googleapis.com/v1/${photoPath.name}/media?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
  );
  const buffer = await response.buffer();
  return buffer.toString("base64");
}
