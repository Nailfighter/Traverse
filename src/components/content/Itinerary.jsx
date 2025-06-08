import { use, useContext, useState } from "react";
import { Button } from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";

import {
  CarFront,
  Bike,
  TramFront,
  Footprints,
  MapPinPlus,
} from "lucide-react";
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

import { AppContext } from "../../App.jsx";

const TravelTime = ({ time, distance, mode }) => (
  <div className="flex text-[11px] items-center text-subcolor gap-1.5 font-medium w-full">
    <div className="mt-1 grow h-px bg-[radial-gradient(circle,_gray_1px,_transparent_1px)] bg-[length:4px_1px]" />
    {mode === "walk" && (
      <Footprints className="h-5 w-5 text-subcolor shrink-0" />
    )}
    {mode === "bike" && <Bike className="h-5 w-5 text-subcolor shrink-0" />}
    {mode === "transit" && (
      <TramFront className="h-5 w-5 text-subcolor shrink-0" />
    )}
    {mode === "car" && <CarFront className="h-5 w-5 text-subcolor shrink-0" />}
    {time}
    <div className="w-0.5 h-0.5 bg-subcolor rounded-full shrink-0" />
    {distance}
    <div className="mt-1 grow h-px bg-[radial-gradient(circle,_gray_1px,_transparent_1px)] bg-[length:4px_1px]" />
  </div>
);

const DayTabs = ({ fullItinerary, setPlaces }) => {
  const [selected, setSelected] = useState("1");
  const days = Object.keys(fullItinerary); // Dynamic days like ["1", "2", "3", ...]

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={(key) => {
        setSelected(key);
        setPlaces(fullItinerary[Number(key)]);
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
  const { currentTrip } = useContext(AppContext);
  const [places, setPlaces] = useState(currentTrip.itinerary[1] || []);

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

  function handleDeletePlace(placeId) {
    setPlaces((prevPlaces) => prevPlaces.filter((p) => p.id !== placeId));
  }

  return (
    <div className="w-full max-w-full flex flex-col gap-4 pt-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Itinerary</h1>
        <Button
          variant="bordered"
          className="flex items-center text-sm font-medium p-3 border border-bcolor rounded-full "
        >
          <MapPinPlus className="h-5 w-5 mr-1" />
          Add Place
        </Button>
      </div>
      <DayTabs fullItinerary={currentTrip.itinerary} setPlaces={setPlaces} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={places.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4 h-[60vh] w-full max-w-full overflow-y-auto overflow-x-hidden p-4 box-border scrollbar-hide ">
            {places.map((place, index) => (
              <div
                className="flex flex-col gap-4 w-full max-w-full"
                key={place.id}
              >
                <PlaceCard
                  place={place}
                  index={index}
                  showTimeInfo={showTimeInfo}
                  handleDeletePlace={handleDeletePlace}
                />
                {index < places.length - 1 && timeInfo && (
                  <TravelTime time="1 hr 30 min" distance="34 mi" mode="car" />
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
