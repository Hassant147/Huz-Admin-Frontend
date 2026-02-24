import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import OpenComplaintsIcon from "../../../../assets/DB/Icon.svg";
import InProgressIcon from "../../../../assets/DB/Icon-1.svg";
import SolvedComplaintsIcon from "../../../../assets/DB/Icon-2.svg";
import { fetchOverallComplaintsCounts } from "../../../../utility/Api";
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const SupportTracker = () => {
  const [data, setData] = useState({
    totalTickets: 0,
    openComplaints: 0,
    inProgressComplaints: 0,
    solvedComplaints: 0,
    closeOrCompleted: 0,
  });

  useEffect(() => {
    const getOverallComplaintsCounts = async () => {
      try {
        const apiData = await fetchOverallComplaintsCounts(getPartnerSessionToken());
        const totalTickets = apiData.Open + apiData.InProgress + apiData.Solved + apiData.Close;
        const closeOrCompleted =
          totalTickets > 0 ? Math.round((apiData.Close / totalTickets) * 100) : 0;

        setData({
          totalTickets,
          openComplaints: apiData.Open,
          inProgressComplaints: apiData.InProgress,
          solvedComplaints: apiData.Solved,
          closeOrCompleted,
        });
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };

    getOverallComplaintsCounts();
  }, []);

  return (
    <AppCard className="flex h-full items-center gap-4 border-slate-200">
      <div className="flex-1">
        <div className="text-2xl font-semibold text-gray-600">
          {data.totalTickets}
          <p className="text-base font-normal text-gray-500">Total Tickets</p>
        </div>
        <div className="mt-5 space-y-3">
          <TrackerRow
            icon={OpenComplaintsIcon}
            label="Open Complaints"
            value={data.openComplaints}
          />
          <TrackerRow
            icon={InProgressIcon}
            label="In Progress Complaints"
            value={data.inProgressComplaints}
          />
          <TrackerRow
            icon={SolvedComplaintsIcon}
            label="Solved Complaints"
            value={data.solvedComplaints}
          />
        </div>
      </div>
      <div className="relative h-40 w-40 shrink-0 md:h-44 md:w-44">
        <CircularProgressbar
          value={data.closeOrCompleted}
          styles={buildStyles({
            textSize: "16px",
            pathColor: "#00936C",
            textColor: "#333",
            trailColor: "#f3f4f6",
          })}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">{data.closeOrCompleted}%</span>
          <span className="text-xs text-gray-500">Close or Completed</span>
        </div>
      </div>
    </AppCard>
  );
};

const TrackerRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start">
      <img src={icon} alt={label} className="mr-2" />
      <div className="flex flex-col">
        <span className="text-base font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
    </div>
  );
};

export default SupportTracker;
