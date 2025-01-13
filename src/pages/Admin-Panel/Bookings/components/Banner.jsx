import React from "react";
import bannerimg from "../../../../assets/bookingbg.svg";

const Banner = () => {
  return (
    <div
      className="bg-[#bcdfd7]"
      style={{
        backgroundImage: `url(${bannerimg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-[90%] py-5 mx-auto flex items-center">
        <div className="block relative">
          <h1 className="font-medium text-xl text-[#4B465C]">Booking</h1>
          <p className="font-normal text-sm text-[#4B465C]">
            Check your booking with booking status and detail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
