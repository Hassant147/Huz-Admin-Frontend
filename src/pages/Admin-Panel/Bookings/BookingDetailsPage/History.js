import React from "react";
import { getBookingDisplayMeta } from "../bookingWorkflowUtils";

const History = ({ booking }) => {
  const statusMeta = getBookingDisplayMeta(booking);

  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg space-y-2">
      <h2 className="text-lg font-medium text-gray-700">Booking history</h2>
      <p className="text-sm text-gray-500">
        This booking is no longer actionable. Review the timeline and stored documents for reference only.
      </p>
      <div className={`${statusMeta.badgeTone} inline-flex rounded-md px-3 py-1 text-sm`}>
        {statusMeta.label}
      </div>
    </div>
  );
};

export default History;
