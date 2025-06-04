import React from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import TripForm from "./TripForm";

const RecentTrip = () => {
  return (
    <Button
      isIconOnly
      variant="light"
      className="bg-gray-600 aspect-square w-full"
    />
  );
};

const SideBar = () => {
  return (
    <div className="button-animation w-14 h-screen border-r border-bcolor flex flex-col gap-5 p-[10px]">
      <Button isIconOnly variant="light">
        <PaperAirplaneIcon className="rotate-[335deg] w-5 h-5" />
      </Button>
      <TripForm />
      <Button isIconOnly variant="light">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>

      <Button isIconOnly variant="light">
        <img
          src="/My PP.png"
          alt="Profile"
          className="aspect-square w-8 rounded-full"
        />
      </Button>

      <div className="border border-gray-300" />

      <div className="grid grid-cols-1 gap-5">
        <RecentTrip />
        <RecentTrip />
        <RecentTrip />
      </div>
    </div>
  );
};

export default SideBar;
