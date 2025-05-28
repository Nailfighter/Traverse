import React, { useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

import Itinerary from "./Itinerary.jsx";

const ContentCard = () => (
  <div className="w-full h-full">
    <div className="relative w-full h-[25vh]">
      <img
        src="/State College Banner.jpg"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
      <div className="absolute bottom-0 w-full text-white font-bold text-4xl p-4">
        7 Day in State College, PA
        <div className="text-lg font-light flex  mt-2 gap-2">
          <CalendarDaysIcon className="h-6 aspect-square inline" />
          26 May, 2025 - 04 June, 2025
        </div>
      </div>
    </div>
    <div className="px-4 py-4">
      <Itinerary />
    </div>
  </div>
);

export default ContentCard;
