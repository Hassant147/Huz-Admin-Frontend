import React from "react";
import active from "../../../../assets/active.svg";
import inactive from "../../../../assets/inactive.svg";
import inprogress from "../../../../assets/inprogress.svg";
import activeBlack from "../../../../assets/activeWhite.svg";
import inactiveBlack from "../../../../assets/deactivateWhite.svg";
import inprogressWhite from "../../../../assets/incompleteWhite.svg";
import { AppSegmentedControl } from "../../../../components/ui";

const StatusBar = ({ selectedStatus, onStatusChange }) => {
  const statuses = [
    {
      value: "Active",
      label: "Active",
      icon: (
        <img
          src={selectedStatus === "Active" ? active : activeBlack}
          alt=""
          className="h-4 w-4"
        />
      ),
    },
    {
      value: "Deactivated",
      label: "Deactivated",
      icon: (
        <img
          src={selectedStatus === "Deactivated" ? inactiveBlack : inactive}
          alt=""
          className="h-4 w-4"
        />
      ),
    },
    {
      value: "In Progress",
      label: "In Progress",
      icon: (
        <img
          src={selectedStatus === "In Progress" ? inprogressWhite : inprogress}
          alt=""
          className="h-4 w-4"
        />
      ),
    },
  ];

  return (
    <AppSegmentedControl
      items={statuses}
      value={selectedStatus}
      onChange={onStatusChange}
      getLabel={(item) => item.label}
      getValue={(item) => item.value}
      getIcon={(item) => item.icon}
    />
  );
};

export default StatusBar;
