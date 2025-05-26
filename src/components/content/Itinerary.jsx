import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CarFront, MapPinPlus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { time } from "framer-motion";

const initialPlaces = [
  {
    id: 1,
    name: "Nittany Lion Inn",
    description:
      "Description of the place goes here. This place is so good like wow.",
    time: "7:00 PM - 9:00 PM",
    image: "/lion inn.jpg",
  },
  {
    id: 2,
    name: "The Creamery",
    description: "Famous for its ice cream, a must-visit spot.",
    time: "3:00 PM - 5:00 PM",
    image: "/creamer.jpeg",
  },
  {
    id: 3,
    name: "Allan Street Grill",
    description: "A popular spot for burgers and local brews.",
    time: "12:00 PM - 2:00 PM",
    image: "/grill.jpeg",
  },
  {
    id: 4,
    name: "The Arboretum",
    description: "A beautiful garden perfect for a stroll.",
    time: "10:00 AM - 11:30 AM",
    image: "/arboretum.jpg",
  },
  {
    id: 5,
    name: "Old Main",
    description: "The iconic landmark of Penn State University.",
    time: "9:00 AM - 10:00 AM",
    image: "/oldmain.jpg",
  },
  {
    id: 6,
    name: "The HUB",
    description: "The student center with various dining options.",
    time: "11:30 AM - 12:30 PM",
    image: "/hub.jpg",
  }
];

//! Decide if you want to use this grab handle or not
const GrabHandle = () => (
  <div className="grid grid-cols-2 w-2.5 h-5 gap-1 cursor-grab">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="w-1 h-1 bg-subcolor rounded-full shrink-0"></div>
    ))}
  </div>
);

const TravelTime = ({ time, distance }) => (
  <div className="flex text-[11px] items-center text-subcolor gap-1.5 font-medium">
    <div className="mt-1 grow h-px bg-[radial-gradient(circle,_gray_1px,_transparent_1px)] bg-[length:4px_1px]"></div>
    <CarFront className="h-5 w-5 text-subcolor shrink-0" />
    {time}
    <div className="w-0.5 h-0.5 bg-subcolor rounded-full shrink-0"></div>
    {distance}
    <div className="mt-1 grow h-px bg-[radial-gradient(circle,_gray_1px,_transparent_1px)] bg-[length:4px_1px]"></div>
  </div>
);

const PlaceCard = ({ place, index, showTimeInfo }) => {
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
      className="relative flex p-4 border gap-2 border-bcolor rounded-2xl shadow-xs justify-between bg-white"
    >
      <div className="flex flex-col justify-between gap-2 ">
        <div>
          <h2 className="text-lg font-semibold">{place.name}</h2>
          <p className="text-sm text-gray-600">{place.description}</p>
        </div>
        <div>
          <ClockIcon className="h-5 w-5 inline mr-1 text-subcolor" />
          <span className="text-sm text-subcolor">{place.time}</span>
        </div>
      </div>
      <img
        src={place.image}
        alt="Place"
        className="w-28 aspect-square object-cover rounded-2xl"
      />
      <div className="absolute top-[-10px] left-[-10px] rounded-full bg-gray-800 h-6 w-6 text-[12px] font-semibold text-white flex items-center justify-center">
        {index + 1}
      </div>
      {isHovered && (
        <button className="absolute top-[-14px] right-[-14px] rounded-full h-7 w-7 bg-gray-300 flex items-center justify-center p-1.5">
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

const Itinerary = () => {
  const [places, setPlaces] = useState(initialPlaces);
  const [timeInfo, showTimeInfo] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = places.findIndex((place) => place.id === active.id);
      const newIndex = places.findIndex((place) => place.id === over?.id);
      setPlaces(arrayMove(places, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Itinerary</h1>
        <button className="flex text-sm text-black font-medium border p-2 border-bcolor rounded-full">
          <MapPinPlus className="h-5 w-5 mr-1" />
          Add Place
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={places.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {places.map((place, index) => (
              <div className="flex flex-col gap-4" key={place.id}>
                <PlaceCard
                  place={place}
                  index={index}
                  showTimeInfo={showTimeInfo}
                />
                {index < places.length - 1 && timeInfo && (
                  <TravelTime time="1 hr 30 min" distance="34 mi" />
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Itinerary;
