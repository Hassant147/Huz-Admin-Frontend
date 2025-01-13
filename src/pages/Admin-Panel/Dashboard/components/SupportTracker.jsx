import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import OpenComplaintsIcon from '../../../../assets/DB/Icon.svg';
import InProgressIcon from '../../../../assets/DB/Icon-1.svg';
import SolvedComplaintsIcon from '../../../../assets/DB/Icon-2.svg';
import { fetchOverallComplaintsCounts } from '../../../../utility/Api';

const SupportTracker = () => {
  const [data, setData] = useState({
    totalTickets: 0,
    openComplaints: 0,
    inProgressComplaints: 0,
    solvedComplaints: 0,
    closeOrCompleted: 0,
  });

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));

    const getOverallComplaintsCounts = async () => {
      try {
        const apiData = await fetchOverallComplaintsCounts(profile.partner_session_token);
        const totalTickets = apiData.Open + apiData.InProgress + apiData.Solved + apiData.Close;
        const closeOrCompleted = Math.round((apiData.Close / totalTickets) * 100);

        setData({
          totalTickets: totalTickets,
          openComplaints: apiData.Open,
          inProgressComplaints: apiData.InProgress,
          solvedComplaints: apiData.Solved,
          closeOrCompleted: closeOrCompleted,
        });
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };

    getOverallComplaintsCounts();
  }, []);

  return (
    <div className="flex items-center h-full px-10 shadow-md rounded-lg bg-white">
      <div className="flex-1">
        <div className="text-2xl font-semibold text-gray-600">
          {data.totalTickets}
          <p className="text-base font-thin text-gray-500">Total Tickets</p>
        </div>
        <div className="mt-6">
          <div className="flex items-start mb-4">
            <img src={OpenComplaintsIcon} alt="Open Complaints" className="mr-2" />
            <div className="flex flex-col">
              <span className="text-lg font-normal text-gray-600">Open Complaints</span>
              <span className="mt-1 font-thin text-gray-500 text-sm">{data.openComplaints}</span>
            </div>
          </div>
          <div className="flex items-start mb-4">
            <img src={InProgressIcon} alt="In Progress Complaints" className="mr-2" />
            <div className="flex flex-col">
              <span className="text-lg font-normal text-gray-600">In Progress Complaints</span>
              <span className="mt-1 font-thin text-gray-500 text-sm">{data.inProgressComplaints}</span>
            </div>
          </div>
          <div className="flex items-start mb-4">
            <img src={SolvedComplaintsIcon} alt="Solved Complaints" className="mr-2" />
            <div className="flex flex-col">
              <span className="text-lg font-normal text-gray-600">Solved Complaints</span>
              <span className="mt-1 font-thin text-gray-500 text-sm">{data.solvedComplaints}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-48 h-48 ml-5">
        <CircularProgressbar
          value={data.closeOrCompleted}
          styles={buildStyles({
            textSize: '16px',
            pathColor: '#00936C',
            textColor: '#333',
            trailColor: '#f3f4f6',
          })}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">{data.closeOrCompleted}%</span>
          <span className="text-xs text-gray-500">Close or Completed</span>
        </div>
      </div>
    </div>
  );
};

export default SupportTracker;
