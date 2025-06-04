import React, { useState, useContext } from "react";
import { Button } from "@heroui/react";
import {
  RangeCalendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { today, getLocalTimeZone } from "@internationalized/date";
import { PlacesContext } from "../App.jsx";

function CustomCalendar() {
  return (
    <div className="">
      <RangeCalendar
        aria-label="Date (Uncontrolled)"
        defaultValue={{
          start: today(getLocalTimeZone()).add({ days: 1 }),
          end: today(getLocalTimeZone()).add({ weeks: 1 }),
        }}
      />
    </div>
  );
}

const PeopleInput = ({ setNoOfTravelers, noOfTravelers }) => {
  const increment = () => setNoOfTravelers((c) => Math.min(10, c + 1)); // maximum 10 people
  const decrement = () => setNoOfTravelers((c) => Math.max(1, c - 1)); // minimum 1 person

  return (
    <div className="flex items-center gap-2 border border-bcolor rounded-2xl p-1 py-1  w-fit text-sm font-medium bg-white">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={decrement}
        className="text-xl hover:bg-white"
        radius="full"
      >
        −
      </Button>
      <span className="min-w-[24px] text-center">{noOfTravelers}</span>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={increment}
        className="text-xl"
        radius="full"
      >
        +
      </Button>
    </div>
  );
};

const BudgetInput = () => {
  const [budget, setBudget] = useState(0);
  const budgetOptions = ["$", "$$", "$$$", "$$$$"];

  return (
    <Button
      radius="none"
      className="bg-white rounded-r-full  h-auto text-[12px] font-semibold border border-l-0 border-bcolor hover:bg-gray-200"
      onPress={() => setBudget((prev) => (prev + 1) % budgetOptions.length)}
    >
      {budgetOptions[budget]}
    </Button>
  );
};

const getItinerary = async () => {
  try {
    const response = await fetch("/api/itinerary/generate", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch itinerary:", error);
    return null;
  }
};

const Header = ({ setFullItinerary }) => {
  const [noOfTravelers, setNoOfTravelers] = React.useState(1);
  return (
    <div className="flex h-13 p-[10px] w-auto border-b-1 border-bcolor text-[12px] font-semibold">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            size="sm"
            className="rounded-full p-1.5 px-3 w-auto text-sm font-semibold shrink-0"
          >
            <h1 className="">A Roud Trip to State College</h1>
            <ChevronDownIcon className="h-[80%] " />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">Rename Trip</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            Delete Trip
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div className="flex justify-center flex-1">
        <div className="flex">
          <Popover placement="bottom" backdrop="opaque" showArrow>
            <PopoverTrigger>
              <Button
                radius="none"
                className="bg-white px-3 border rounded-l-full h-auto text-[12px] font-semibold border-bcolor hover:bg-gray-200"
              >
                7 Days
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 pb-1 rounded-[18px] bg-gray-100">
              <CustomCalendar />
            </PopoverContent>
          </Popover>

          <Popover placement="bottom" backdrop="opaque" showArrow>
            <PopoverTrigger>
              <Button
                radius="none"
                className="bg-white px-3 border border-l-0  h-auto text-[12px] font-semibold border-bcolor hover:bg-gray-200"
              >
                {noOfTravelers} {noOfTravelers > 1 ? "People" : "Person"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 rounded-[18px] bg-gray-100">
              <PeopleInput
                setNoOfTravelers={setNoOfTravelers}
                noOfTravelers={noOfTravelers}
              />
            </PopoverContent>
          </Popover>

          <BudgetInput />

          <Button
            radius="none"
            variant="light"
            className="bg-black px-3 h-auto text-[12px] font-semibold rounded-full text-white hover:!bg-[#2e2e2e] ml-4"
            onPress={async () => {
              const itinerary = await getItinerary();
              if (itinerary) {
                setFullItinerary(itinerary);
              } else {
                console.error("Failed to fetch itinerary");
              }
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
