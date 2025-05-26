import React, { useState, useEffect, use } from "react";

import {
  APIProvider,
  Map,
  ColorScheme,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const MapCard = () => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full">
        <Map
          defaultZoom={16}
          defaultCenter={{ lat: 40.55019758059793, lng: -74.29959699120032 }}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
          // colorScheme = {ColorScheme.DARK}
          disableDefaultUI={true}
        >
          {/* <AdvancedMarker
            position={{ lat: 40.55019758059793, lng: -74.29959699120032 }}
          >
            <Pin background={"blue"} />
          </AdvancedMarker> */}

          {/* <Direction /> */}
        </Map>
      </div>
    </APIProvider>
  );
};

const Direction = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionService, setDirectionService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!map || !routesLibrary) return;
    setDirectionService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [map, routesLibrary]);

  useEffect(() => {
    if (!directionService || !directionsRenderer) return;

    directionService
      .route({
        origin: "2408 Plaza Dr, Woodbridge, NJ 07095",
        destination: "New Brunswick, NJ",
        travelMode: routesLibrary.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });
  }, [directionService, directionsRenderer]);
};

export default MapCard;
