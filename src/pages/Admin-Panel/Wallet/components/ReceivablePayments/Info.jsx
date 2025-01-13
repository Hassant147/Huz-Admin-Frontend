// Info.jsx
import React from "react";

const Info = ({ label, value }) => (
  <div className="flex flex-col px-2 sm:px-4 mb-2 sm:mb-0 w-full md:w-1/2 lg:w-auto">
    <span className="text-[#4B465C] opacity-80 text-xs sm:text-sm md:text-base lg:text-sm whitespace-nowrap">
      {label}
    </span>
    <span className="font-semibold text-[#4B465C] text-sm sm:text-base md:text-lg lg:text-base whitespace-nowrap">
      {value}
    </span>
  </div>
);

export default Info;
