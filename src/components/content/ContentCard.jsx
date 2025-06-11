import React, { use, useContext, useEffect, useState } from "react";
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
  const [noOfDays, setNoOfDays] = useState(0);

  useEffect(() => {
    if (tripHeader?.start_date && tripHeader?.end_date) {
      const startDate = new Date(tripHeader.start_date);
      const endDate = new Date(tripHeader.end_date);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNoOfDays(diffDays);
    }
  }, [tripHeader]);

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* <div className="relative flex-grow-0 w-full h-80">
        <Base64Image
          name={tripHeader?.destination}
          base64={tripHeader?.banner || ""}
          a
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
        <div className="absolute bottom-0 w-full text-white font-bold text-4xl p-4">
          {`${noOfDays} ${noOfDays > 1 ? "Days" : "Day"} in ${
            tripHeader?.destination
          }`}
          <div className="text-lg font-light flex  mt-2 gap-2">
            <CalendarDaysIcon className="h-6 aspect-square inline" />
            {formattedDate(tripHeader?.start_date)} -{" "}
            {formattedDate(tripHeader?.end_date)}
          </div>
        </div>
      </div> */}

      {/* Scrollable content area that takes remaining space */}
      <div className="flex-1 overflow-y-auto bg-amber-300">
        <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
          {/* <Itinerary /> */}
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
          <div className="bg-red-400 h-30 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
