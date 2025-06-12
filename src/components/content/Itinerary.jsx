import { useEffect, useContext, useState } from "react";
import { Button } from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";

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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import PlaceCard from "./PlaceCard.jsx";
import AddPlaceForm from "./AddPlaceForm.jsx";

import { AppContext } from "../../App.jsx";
import TravelTime from "../map/TravelTime.jsx";

const DayTabs = ({ fullItinerary, setPlaces, selectedDay, setSelectedDay }) => {
  const days = Object.keys(fullItinerary);

  return (
    <Tabs
      selectedKey={selectedDay}
      onSelectionChange={(key) => {
        setSelectedDay(key);
        const sortedPlaces = [...(fullItinerary[Number(key)] || [])].sort(
          (a, b) => a.order_index - b.order_index
        );
        setPlaces(sortedPlaces);
      }}
      radius="full"
      variant="solid"
      className="w-full"
      classNames={{
        tabList: "flex w-full gap-1",
        tab: "flex-1 justify-center",
      }}
    >
      {days.map((day) => (
        <Tab key={day} title={`Day ${day}`} />
      ))}
    </Tabs>
  );
};

const Itinerary = () => {
  const { currentTrip, selectedDay, setSelectedDay, routes } =
    useContext(AppContext);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (currentTrip?.itinerary) {
      const sortedPlaces = [...(currentTrip.itinerary[1] || [])].sort(
        (a, b) => a.order_index - b.order_index
      );
      setPlaces(sortedPlaces);
    }
  }, [currentTrip]);

  const [timeInfo, showTimeInfo] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = places.findIndex(
        (place) => place.place_id === active.place_id
      );
      const newIndex = places.findIndex(
        (place) => place.place_id === over.place_id
      );

      const newPlaces = arrayMove(places, oldIndex, newIndex);

      newPlaces.forEach((place, index) => {
        place.order_index = index;
      });

      setPlaces(newPlaces);
    }
  };

  return (
    <div className="w-full  flex flex-col gap-4 pt-1 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Itinerary</h1>
        <AddPlaceForm dayNumber={selectedDay} />
      </div>
      <DayTabs
        fullItinerary={currentTrip?.itinerary || { 1: [] }}
        setPlaces={setPlaces}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={places.map((p) => p.place_id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-grow gap-4 h-full overflow-y-scroll overflow-hidden p-4  scrollbar-hide ">
            {places.map((place, index) => (
              <div className="flex flex-col gap-4 w-full " key={place.place_id}>
                <PlaceCard
                  index={index}
                  place={place}
                  setPlaces={setPlaces}
                  showTimeInfo={showTimeInfo}
                />
                {index < places.length - 1 && timeInfo && (
                  <TravelTime
                    duration={routes[index]?.duration.text || "N/A"}
                    distance={routes[index]?.distance.text || "N/A"}
                    mode="car"
                  />
                )}
              </div>
            ))}
            {places.length === 0 && (
              <div className="text-center text-gray-500">
                No places added for this day
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Itinerary;
