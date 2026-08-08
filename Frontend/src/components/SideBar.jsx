import React, { useContext, useState } from "react";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Button, ToastProvider } from "@heroui/react";

import TripForm from "./TripForm";
import { AppContext } from "../App";
import { supabase } from "../RouterPage";

const ImageComponent = ({ name, imageData }) => {
  return (
    <img
      className="h-full w-full object-cover rounded-lg"
      alt={name}
      src={imageData}
    />
  );
};

const TripBox = ({
  trip,
  onHover,
  onLeave,
  isHovered,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className="relative w-full h-full aspect-square cursor-pointer"
      onMouseEnter={() => onHover(trip.trip_id)}
      onMouseLeave={() => onLeave()}
    >
      <div
        className={
          isSelected
            ? `relative border-3 border-[#2e2e2e] rounded-xl w-full h-full button-animation overflow-hidden`
            : "relative w-full h-full button-animation overflow-hidden"
        }
      >
        <button
          variant="light"
          className="w-full h-full border-3 border-white rounded-xl hover:cursor-pointer"
          onClick={onClick}
        >
          <ImageComponent
            name={trip.destination}
            imageData={trip?.banner || ""}
          />
        </button>
        <div className="md:hidden absolute bottom-0 left-0 w-full px-2 py-1.5 rounded-b-xl bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <div className="text-white text-[11px] font-semibold truncate">
            {trip.destination.split(",")[0]}
          </div>
        </div>
      </div>

      {isHovered && (
        <div className="hidden md:block absolute top-[20%] left-full ml-4 rounded-2xl bg-white border border-gray-300 shadow-lg px-4 p-2 text-[13px] text-gray-900 z-50 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[250px]">
          <div className="font-bold">{trip.destination.split(",")[0]}</div>
        </div>
      )}
    </div>
  );
};

const SideBar = () => {
  const {
    allUserTrips,
    currentTrip,
    setCurrentTrip,
    setSelectedDay,
    isMobileNavOpen,
    setIsMobileNavOpen,
  } = useContext(AppContext);
  const [hoveredTripId, setHoveredTripId] = useState(null);

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-screen w-36 md:w-18 bg-white border-r border-bcolor flex flex-col gap-1 p-[10px] overflow-y-auto transition-transform duration-200 ease-out ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-center">
          <PaperAirplaneIcon className="transform translate-x-0.5 rotate-[335deg] h-8 w-8" />
        </div>
        <TripForm />

        <div className="border border-gray-300 mb-5" />

        <div className="grid grid-cols-1 gap-4 w-full">
          {allUserTrips.map((trip, key) => (
            <TripBox
              key={trip.trip_id}
              trip={trip}
              onHover={setHoveredTripId}
              onLeave={() => setHoveredTripId(null)}
              isHovered={hoveredTripId === trip.trip_id}
              isSelected={currentTrip.tripHeader?.trip_id === trip.trip_id}
              onClick={() => {
                setIsMobileNavOpen(false);
                if (currentTrip.tripHeader?.trip_id === trip.trip_id) return;
                setCurrentTrip((prev) => ({
                  tripHeader: allUserTrips[key],
                }));
                setSelectedDay("1");
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
