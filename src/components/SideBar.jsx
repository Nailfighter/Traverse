import React, { useContext, useState } from "react";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";

import TripForm from "./TripForm";
import { AppContext } from "../App";
import { supabase } from "../RouterPage";
import { useNavigate } from "react-router-dom";

const Base64Image = ({ name, base64 }) => {
  return (
    <img
      className="h-full object-cover"
      alt={name}
      src={base64 ? `data:image/jpeg;base64,${base64}` : undefined}
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
            ? `border-3 border-[#2e2e2e] rounded-xl w-full h-full`
            : "w-full h-full"
        }
      >
        <Button
          isIconOnly
          variant="light"
          className="w-full h-full border-3 border-white rounded-xl"
          onPress={onClick}
        >
          <Base64Image name={trip.destination} base64={trip.banner} />
        </Button>
      </div>

      {isHovered && (
        <div className="absolute top-[20%] left-full ml-4 rounded-2xl bg-white border border-gray-300 shadow-lg px-4 p-2 text-[13px] text-gray-900 z-50 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[250px]">
          <div className="font-bold">{trip.destination.split(",")[0]}</div>
        </div>
      )}
    </div>
  );
};

async function handleLogout({ navigate }) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully");
  }
  navigate("/login");
}

const SideBar = () => {
  const navigate = useNavigate();
  const { allUserTrips, currentTrip, setCurrentTrip } = useContext(AppContext);
  const [hoveredTripId, setHoveredTripId] = useState(null);

  return (
    <div className="w-20 h-screen border-r border-bcolor flex flex-col gap-5 p-[10px]">
      <Button isIconOnly variant="light">
        <PaperAirplaneIcon className="rotate-[335deg] w-5 h-5" />
      </Button>
      <TripForm />
      <Button isIconOnly variant="light" className="w-full p-1.5">
        <MagnifyingGlassIcon className="h-full" />
      </Button>

      <Button
        isIconOnly
        variant="light"
        onPress={() => handleLogout({ navigate })}
        className="w-full"
      >
        <img
          src="/My PP.png"
          alt="Profile"
          className="aspect-square h-full rounded-full"
        />
      </Button>

      <div className="border border-gray-300" />

      <div className="grid grid-cols-1 gap-6 w-full">
        {allUserTrips.map((trip, key) => (
          <TripBox
            key={trip.trip_id}
            trip={trip}
            onHover={setHoveredTripId}
            onLeave={() => setHoveredTripId(null)}
            isHovered={hoveredTripId === trip.trip_id}
            isSelected={currentTrip.tripHeader?.trip_id === trip.trip_id}
            onClick={() =>
              setCurrentTrip((prev) => ({
                ...prev,
                tripHeader: allUserTrips[key],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
