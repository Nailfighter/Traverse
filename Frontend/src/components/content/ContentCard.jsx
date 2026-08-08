import React, { use, useContext, useEffect, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

import AddPlaceForm from "./AddPlaceForm.jsx";
import Itinerary from "./Itinerary.jsx";
import { AppContext } from "../../App.jsx";
import { Tabs, Tab, ToastProvider } from "@heroui/react";

const ImageComponent = ({ name, imageData }) => {
  return (
    <img className="w-full h-full object-cover" alt={name} src={imageData} />
  );
};

const DayTabs = ({ fullItinerary, selectedDay, setSelectedDay }) => {
  const { setPlaces } = useContext(AppContext);
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
        tab: "flex-1 justify-center min-w-0 px-1 min-[1600px]:px-3",
        tabContent: "truncate",
      }}
    >
      {days.map((day) => (
        <Tab
          key={day}
          title={
            <>
              <span className="hidden min-[1600px]:inline">Day </span>
              {day}
            </>
          }
        />
      ))}
    </Tabs>
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
  const { currentTrip, selectedDay, setSelectedDay } = useContext(AppContext);
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
    <div className="flex flex-col h-full max-h-full overflow-hidden ">
      <div className="relative flex-grow-0 w-full h-48 sm:h-56 md:h-70">
        <ImageComponent
          name={tripHeader?.destination}
          imageData={tripHeader?.banner || ""}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
        <div className="absolute bottom-0 w-full text-white font-bold text-xl sm:text-2xl md:text-4xl p-3 sm:p-4">
          {`${noOfDays} ${noOfDays > 1 ? "Days" : "Day"} in ${
            tripHeader?.destination
          }`}
          <div className="text-sm sm:text-base md:text-lg font-light flex mt-1 sm:mt-2 gap-2">
            <CalendarDaysIcon className="h-5 sm:h-6 aspect-square inline shrink-0" />
            <span className="truncate">
              {formattedDate(tripHeader?.start_date)} -{" "}
              {formattedDate(tripHeader?.end_date)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 pb-0 h-full overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold shrink-0">
            Itinerary
          </h1>
          <AddPlaceForm dayNumber={selectedDay} />
        </div>
        <DayTabs
          fullItinerary={currentTrip?.itinerary || { 1: [] }}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* <div className="flex flex-col gap-2 px-4 pt-4 pb-4"> */}
          <Itinerary />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
