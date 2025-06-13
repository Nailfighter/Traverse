import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ClockIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";

import { addToast, Button } from "@heroui/react";

import TimeSetter from "./TimeSetter.jsx";

import { AppContext } from "../../App.jsx";
import { handleDetailClick, ExtraInfoContext } from "./Layout.jsx";

const Base64Image = ({ name, base64 }) => {
  return (
    <img
      alt={name}
      className="w-28 aspect-square object-cover rounded-2xl shrink-0"
      src={base64 ? `data:image/jpeg;base64,${base64}` : null}
    />
  );
};

const VisitTime = ({ place, start, end }) => {
  const { accessToken, setSelectedPlace } = useContext(AppContext);
  const { setExtraInfo } = useContext(ExtraInfoContext);
  const [startTime, setStartTime] = useState(start);
  const [endTime, setEndTime] = useState(end);
  const hasUserChangedRef = useRef(false);
  const lastValidationRef = useRef(true);

  useEffect(() => {
    setStartTime(start);
    setEndTime(end);
    hasUserChangedRef.current = false;
  }, [start, end]);

  const isTimeValid = useMemo(() => {
    if (!startTime || !endTime) return true;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return startMinutes < endMinutes;
  }, [startTime, endTime]);

  function timeToMinutes(timeString) {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function handleUpdateTime() {
    if (!isTimeValid) {
      console.warn("Cannot update: End time must be after start time");
      return;
    }

    fetch(`/api/trips/places/${place.place_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_time: startTime,
        end_time: endTime,
      }),
    });
  }

  useEffect(() => {
    if (hasUserChangedRef.current && startTime && endTime) {
      if (isTimeValid) {
        handleUpdateTime();
      } else if (lastValidationRef.current !== isTimeValid) {
        addToast({
          title: "Invalid Time Range",
          description: "End time must be after start time",
          color: "danger",
          timeout: 5000,
        });
      }
      lastValidationRef.current = isTimeValid;
    }
  }, [startTime, endTime, isTimeValid]);

  const handleSetStartTime = (newTime) => {
    setStartTime(newTime);
    hasUserChangedRef.current = true;
  };

  const handleSetEndTime = (newTime) => {
    setEndTime(newTime);
    hasUserChangedRef.current = true;
  };

  return (
    <div className="flex items-center gap-1">
      <ClockIcon
        className={`h-5 aspect-square ${
          !isTimeValid ? "text-red-500" : "text-subcolor"
        }`}
      />
      <TimeSetter
        time={startTime}
        setTime={handleSetStartTime}
        isError={!isTimeValid}
      />
      <span
        className={`text-sm ${!isTimeValid ? "text-red-500" : "text-subcolor"}`}
      >
        -
      </span>
      <TimeSetter
        time={endTime}
        setTime={handleSetEndTime}
        isError={!isTimeValid}
      />
      <Button
        variant="bordered"
        className="flex text-xs text-black font-medium border ml-1 h-8 border-bcolor rounded-full"
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPress={() =>
          handleDetailClick(accessToken, place, setSelectedPlace, setExtraInfo)
        }
      >
        Details
      </Button>
    </div>
  );
};

const PlaceCard = ({ index, place, setPlaces, showTimeInfo }) => {
  const { accessToken, fetchData } = useContext(AppContext);
  const { setExtraInfo } = useContext(ExtraInfoContext);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.place_id });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    showTimeInfo(!isDragging);
  }, [isDragging]);

  const handleDeletePlace = async (placeId, setPlaces) => {
    setPlaces((prevPlaces) => prevPlaces.filter((p) => p.place_id !== placeId));
    try {
      const response = await fetch(`/api/trips/places/${placeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to delete place");
        return;
      }
    } catch (error) {
      console.error("Error deleting place:", error);
    }
    setExtraInfo({
      visible: false,
      placeDetails: null,
    });
    await fetchData();
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? "grabbing" : "",
      }}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-full"
    >
      <div className="flex w-full min-w-0 box-border p-4 border gap-2 border-bcolor rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] justify-between bg-white">
        <div className="flex flex-col justify-between gap-2 min-w-0 w-full">
          <div>
            <h2
              className="text-lg font-semibold select-text"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {place.name}
            </h2>
            <p
              className="text-sm text-gray-600 select-text"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {place.description}
            </p>
          </div>
          <VisitTime start={place.start} end={place.end} place={place} />
        </div>

        <Base64Image name={place.name} base64={place.image} />
      </div>

      <div className="absolute top-[-10px] left-[-10px] rounded-full bg-gray-800 h-6 w-6 text-[12px] font-semibold text-white flex items-center justify-center">
        {index + 1}
      </div>

      {isHovered && (
        <Button
          variant="bordered"
          isIconOnly
          size="sm"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="absolute top-[-14px] right-[-14px] rounded-full bg-bcolor flex items-center justify-center p-2 hover:bg-bcolor border-0"
          onPress={() => handleDeletePlace(place.place_id, setPlaces)}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};

export default PlaceCard;
