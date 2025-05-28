import React from "react";

import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  
} from "@heroicons/react/24/solid";

const RecentTrip = () => {
  return <button className="bg-gray-600 aspect-square w-full"></button>;
};

const SideBar = () => {
  return (
    <div className="button-animation w-14 h-screen border-r-1 border-bcolor flex flex-col gap-5 p-[10px] ">
      <button>
      </button>
      <button>
        <PlusIcon />
      </button>
      <button>
        <MagnifyingGlassIcon />
      </button>
      <button>
        <img src="/My PP.png" className="aspect-square w-8 rounded-full" />
      </button>
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
