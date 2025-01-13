import React from "react";
import nobookingerror from "../../../../assets/nobookingerror.svg";

const Error = () => {
  return (
    <div className="bg-white py-20 w-full rounded-md shadow-md">
      <div className="justify-center flex mx-auto  text-center">
        <img src={nobookingerror} alt="" className="size-[150px]" />
      </div>
      <p className="text-center justify-center text-[#4B465C]">
        Oops, You have no bookings yet.{" "}
      </p>
    </div>
  );
};

export default Error;
