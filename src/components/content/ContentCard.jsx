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
    <div className="px-6 py-4">
      <DayTabs />
      <Itinerary />
    </div>
  </div>
);

const DayTabs = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [];
  for (let i = 1; i <= 7; i++) {
    tabs.push(
      <button
        key={i}
        onClick={() => setActiveTab(i)}
        className={`relative p-2 px-2.5  text-sm hover:text-black transition-colors duration-200 ${
          activeTab === i
            ? "text-black font-semibold "
            : "text-subcolor hover:text-black"
        }`}
      >
        Day {i}
        <div
          className={`absolute left-0 bottom-0 h-0.75 bg-black ${
            activeTab === i ? "w-full" : "w-0"
          }`}
        ></div>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap border-b border-gray-300 mb-4">{tabs}</div>
  );
};

export default ContentCard;
