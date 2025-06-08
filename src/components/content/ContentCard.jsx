import React, { useContext, useEffect, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

import Itinerary from "./Itinerary.jsx";
import { AppContext } from "../../App.jsx";

const Base64Image = ({ name, base64 }) => {
  return (
    <img
      className="w-full h-full object-cover"
      alt={name}
      src={base64 ? `data:image/jpeg;base64,${base64}` : null}
    />
  );
};

function formattedDate(date) {
  if (!date) return "No date provided";

  return new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/ (\d{4})$/, ", $1");
}

const ContentCard = () => {
  const { currentTrip } = useContext(AppContext);
  const tripHeader = currentTrip.tripHeader;

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-[25vh]">
        <Base64Image
          name={tripHeader?.title}
          base64={tripHeader?.banner || ""}
          a
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
        <div className="absolute bottom-0 w-full text-white font-bold text-4xl p-4">
          {tripHeader?.title}
          <div className="text-lg font-light flex  mt-2 gap-2">
            <CalendarDaysIcon className="h-6 aspect-square inline" />
            {formattedDate(tripHeader?.start_date)} -{" "}
            {formattedDate(tripHeader?.end_date)}
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <Itinerary />
      </div>
    </div>
  );
};

export default ContentCard;
