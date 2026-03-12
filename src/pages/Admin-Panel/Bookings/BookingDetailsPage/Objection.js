import React from 'react';

const Objection = ({booking}) => {
  if (!booking) {
    return null;
  }

  const latestObjection = booking?.booking_objections?.[0];


  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg space-y-3">
      <div>
        <h2 className="text-lg font-medium text-gray-700">Operator objection</h2>
        <p className="text-sm text-gray-500">
          The operator has requested additional clarification or documents before fulfillment can continue.
        </p>
      </div>
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-rose-600">Latest objection</p>
        <p className="mt-1 text-sm font-medium text-rose-700">
          {latestObjection?.remarks_or_reason || booking.partner_remarks || "No objection details available."}
        </p>
      </div>
    </div>
  );
};

export default Objection;
