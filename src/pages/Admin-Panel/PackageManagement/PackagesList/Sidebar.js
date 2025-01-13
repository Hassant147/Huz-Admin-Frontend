import React, { useState } from "react";

const Sidebar = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = useState("Hajj");
  const [active, setIsActive] = useState("Hajj");

  const handleFilterChange = (type) => {
    setSelectedType(type);
    onFilterChange(type);
    setIsActive(type);
  };
  return (
    <div className="py-4 bg-[#FBFFFE] rounded-md shadow-md">
      <h2 className="text-[13px] text-[#4B465C] opacity-[80%] font-semibold mb-4 px-4 lg:px-4 xl:px-7">
        Select Package Type
      </h2>
      <ul>
        {["Hajj", "Umrah", "Transport"].map((type) => (
          <div
            key={type}
            className={`text-gray-700 hover:text-green-700 text-xs font-medium px-4 lg:px-4 xl:px-7 py-2 w-full text-left transition-colors duration-200 ${
              selectedType === type ? "bg-[#E6F4F0]" : "hover:bg-gray-50"
            }`}
            onClick={() => handleFilterChange(type)}
          >
            <li className=" flex gap-2 items-center">
              <input
                type="radio"
                id={type}
                name="packageType"
                checked={active === type}
                className={`checkbox appearance-none focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none border rounded-full border-gray-400 cursor-pointer w-4 h-4 ${
                  active === type ? "checked:bg-[#00936c]" : ""
                }`}
              />

              <button>{type} Package</button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
