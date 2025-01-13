import React from "react";
import active from "../../../../assets/active.svg";
import inactive from "../../../../assets/inactive.svg";
import inprogress from "../../../../assets/inprogress.svg";
import activeBlack from "../../../../assets/activeWhite.svg";
import inactiveBlack from "../../../../assets/deactivateWhite.svg";
import inprogressWhite from "../../../../assets/incompleteWhite.svg";
const StatusBar = ({ selectedStatus, onStatusChange }) => {
  const statuses = [
    {
      name: "Active",
      img: `${selectedStatus === "Active" ? active : activeBlack}`,
    },
    {
      name: "Deactivated",
      img: `${selectedStatus === "Deactivated" ? inactiveBlack : inactive}`,
    },
    {
      name: "In Progress",
      img: `${selectedStatus === "In Progress" ? inprogressWhite : inprogress}`,
    },
  ];

  return (
    <div className="md:flex space-y-2 md:space-y-0 md:space-x-5 mb-4 ">
      {" "}
      {statuses.map((status) => (
        <div
          key={status}
          className={`text-xs font-medium flex gap-2 justify-center items-center border-[1px] border-[#00936C33] rounded-md px-6 py-2 ${
            selectedStatus === status.name
              ? "text-white bg-[#00936c]"
              : "bg-none text-[#4b465c]"
          }`}
          onClick={() => onStatusChange(status.name)}
        >
          <img src={status.img} alt="" className="h-4" />
          <button>{status.name}</button>
        </div>
      ))}
    </div>
  );
};

export default StatusBar;
