import React from "react";
import building from "../../../assets/building.svg";
import building2 from "../../../assets/building2.svg";
import key from "../../../assets/key.svg";
import key1 from "../../../assets/key1.svg";
import location from "../../../assets/map-pin.svg";
import location2 from "../../../assets/map-pin2.svg";

const NavTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:space-x-2">
      <button
        className={`flex items-center text-sm px-4 md:px-6 font-light text-gray-700 py-2 rounded-md mb-2 md:mb-0 ${
          selectedTab === "company" ? "text-white bg-[#00936C]" : ""
        }`}
        onClick={() => setSelectedTab("company")}
      >
        <img
          src={selectedTab === "company" ? building : building2}
          alt="Company"
          className="h-4 w-4 mr-2"
        />
        <span>Company detail</span>
      </button>
      <button
        className={`flex items-center text-sm px-4 md:px-6 font-light text-gray-700 py-2 rounded-md mb-2 md:mb-0 ${
          selectedTab === "address" ? "text-white bg-[#00936C]" : ""
        }`}
        onClick={() => setSelectedTab("address")}
      >
        <img
          src={selectedTab === "address" ? location : location2}
          alt="Address"
          className="h-4 w-4 mr-2"
        />
        <span>Address detail</span>
      </button>
      <button
        className={`flex items-center text-sm px-4 md:px-6 font-light text-gray-700 py-2 rounded-md ${
          selectedTab === "password" ? "text-white bg-[#00936C]" : ""
        }`}
        onClick={() => setSelectedTab("password")}
      >
        <img
          src={selectedTab === "password" ? key1 : key}
          alt="Password"
          className="h-4 w-4 mr-2"
        />
        <span>Change password</span>
      </button>
    </div>
  );
};

export default NavTabs;
