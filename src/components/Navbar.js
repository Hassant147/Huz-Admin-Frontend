import React from "react";
import bannerbg from "../assets/Components/bannerbg.svg";

const Navbar = ({ title, subtitle }) => {
  return (
    <div className="pb-5 bg-gray-50">
      <div
        className="relative bg-[#c9e6df] py-9 overflow-hidden"
        style={{
          backgroundImage: `url(${bannerbg})`,
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // Ensures the background image covers the entire container
        }}
      >
        <div className="w-[90%] mx-auto">
          <h2 className="text-2xl font-medium text-[#4B465C]">{title}</h2>
          <p className="mt-2 text-[#4B465C] font-normal">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
