import { useState, useEffect, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ClockIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";

import { Image, Button } from "@heroui/react";

import TimeSetter from "./TimeSetter.jsx";

import { ExtraInfoContext } from "./Layout.jsx";
import MockData from "../../MockData.js";

const intialExtraInfo = MockData.ExtraInfo;

const Base64Image = ({ name, base64 }) => {
  return (
    <img
      alt={name}
      className="w-28 aspect-square object-cover rounded-2xl shrink-0"
      src={base64 ? `data:image/jpeg;base64,${base64}` : null}
    />
  );
};

const VisitTime = ({ placeID, base64, start, end }) => {
  const { setExtraInfo } = useContext(ExtraInfoContext);

  const handleDetailClick = () => {
    fetch(`/api/place/${placeID}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          data.image = base64;
          setExtraInfo({
            visible: true,
            placeDetails: data,
          });
        });
      } else {
        console.error("Failed to fetch place details");
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <ClockIcon className="h-5 aspect-square text-subcolor" />
      <TimeSetter time={start} />
      <span className="text-sm text-subcolor">-</span>
      <TimeSetter time={end} />
      <Button
        variant="bordered"
        className="flex text-xs text-black font-medium border ml-1 h-8 border-bcolor rounded-full"
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPress={handleDetailClick}
      >
        Details
      </Button>
    </div>
  );
};

const PlaceCard = ({ place, index, showTimeInfo, handleDeletePlace }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    showTimeInfo(!isDragging);
  }, [isDragging]);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
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
            <h2 className="text-lg font-semibold">{place.name}</h2>
            <p className="text-sm text-gray-600">{place.description}</p>
          </div>
          <VisitTime
            start={place.start}
            end={place.end}
            placeID={place.id}
            base64={place.image}
          />
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
          onPress={() => handleDeletePlace(place.id)}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};

export default PlaceCard;
