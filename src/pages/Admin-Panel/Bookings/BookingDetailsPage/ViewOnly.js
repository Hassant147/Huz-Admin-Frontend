import React from "react";

const ViewOnly = ({ booking }) => {
  if (!booking) {
    return null;
  }

  const minimumPaymentStatus = booking.minimum_payment_status || "NOT_SUBMITTED";
  const fullPaymentStatus = booking.full_payment_status || "NOT_SUBMITTED";
  const remainingAmountDue = Number(booking.remaining_amount_due || 0);
  const canEditTravellers = Boolean(booking.client_can_edit_travellers);

  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg space-y-3">
      <div>
        <h2 className="text-lg font-medium text-gray-700">View-only booking</h2>
        <p className="text-sm text-gray-500">
          The booking is visible because minimum payment has been approved, but it is not ready for operator action yet.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Minimum payment</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{minimumPaymentStatus}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Full payment</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{fullPaymentStatus}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Traveler details</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {canEditTravellers ? "Still in progress" : "Locked"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Remaining due</p>
          <p className="mt-1 text-sm font-medium text-slate-700">PKR {remainingAmountDue}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewOnly;
