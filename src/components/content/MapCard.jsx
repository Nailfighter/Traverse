import React from "react";

import { APIProvider, Map,ColorScheme } from "@vis.gl/react-google-maps";

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
        ></Map>
      </div>
    </APIProvider>
  );
};

export default MapCard;
