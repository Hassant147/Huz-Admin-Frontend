import React from "react";

const Error = ({ errorLogo, error }) => {
  return (
    <div className="bg-white rounded-md shadow-md flex justify-center items-center h-[120%] xl:h-[150%]">
      <div
        className="text-[#4B465C] px-4 py-3 rounded relative max-w-md mx-auto"
        role="alert"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={errorLogo} alt="" className="h-24" />
        </div>
        <div className="text-sm block text-center">
          <strong className="font-bold ">Oops!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <strong className="text-[#00936c] text-sm md:text-md flex justify-center">
          Start adding now!
        </strong>
      </div>
    </div>
  );
};

export default Error;
