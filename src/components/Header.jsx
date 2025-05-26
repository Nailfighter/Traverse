import React from "react";

const Header = () => {
  return (
    <div className="flex justify-center h-12 p-[10px] w-full border-b-1 border-bcolor text-[12px] font-semibold">
      <div className="flex">
        <button className="bg-white rounded-l-full px-3   border border-bcolor hover:bg-gray-200">
          State College
        </button>
        <button className="bg-white px-3 border border-l-0 border-bcolor hover:bg-gray-200">
          7 Days
        </button>
        <button className="bg-white px-3 border border-l-0 border-bcolor hover:bg-gray-200">
          2 People
        </button>
        <button className="bg-white px-3 rounded-r-full  border border-l-0 border-bcolor hover:bg-gray-200">
          $$$
        </button>
      </div>
    </div>
  );
};

export default Header;
