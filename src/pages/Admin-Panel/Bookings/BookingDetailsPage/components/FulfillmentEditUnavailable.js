import React from "react";
import { Link } from "react-router-dom";
import { buildAdminBookingDetailsPath } from "../../bookingRouteUtils";

const formatStatusLabel = (status) =>
  `${status || ""}`
    .trim()
    .replace(/_/g, " ")
    .toLowerCase();

const FulfillmentEditUnavailable = ({ booking }) => {
  const bookingNumber = booking?.booking_number || "";
  const statusLabel = formatStatusLabel(booking?.booking_status);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">
        Fulfillment editing is unavailable
      </h2>
      <p className="mt-2 text-sm text-amber-900">
        {statusLabel
          ? `This booking is currently ${statusLabel}. Only bookings in fulfillment or ready for travel can be edited from this page.`
          : "Only bookings in fulfillment or ready for travel can be edited from this page."}
      </p>
      {bookingNumber ? (
        <Link
          to={buildAdminBookingDetailsPath(bookingNumber)}
          className="mt-4 inline-flex rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-medium text-white hover:bg-[#115e59]"
        >
          Back to booking details
        </Link>
      ) : null}
    </div>
  );
};

export default FulfillmentEditUnavailable;
