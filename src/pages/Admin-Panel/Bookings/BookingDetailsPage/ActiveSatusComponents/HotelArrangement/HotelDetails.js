import React from "react";
import { useNavigate } from "react-router-dom";
import { buildAdminBookingSubflowPath } from "../../../bookingRouteUtils";

const HotelDetails = ({ booking, canManage = true }) => {
  const navigate = useNavigate();
  const bookingNumber = booking?.booking_number || "";
  const hotelCards = Array.isArray(booking?.hotel_cards) ? booking.hotel_cards : [];

  const handleEdit = () => {
    navigate(buildAdminBookingSubflowPath(bookingNumber, "hotel-arrangement"), {
      state: { isEditing: true },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared hotel details</h2>
        {canManage ? (
          <button
            onClick={handleEdit}
            className="text-white text-xs bg-[#00936C] hover:bg-[#007B54] rounded px-3 py-1.5"
          >
            Edit/Update
          </button>
        ) : null}
      </div>

      <div className="bg-gray-50 rounded space-y-4 p-3">
        {hotelCards.length > 0 ? (
          hotelCards.map((card) => (
            <div key={card.id} className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {card.cityLabel || "Hotel"}
                  </p>
                  <h3 className="text-base font-semibold text-gray-800">
                    {card.confirmed?.hotelName || card.packageHotel?.hotelName || "Not set"}
                  </h3>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {card.confirmed ? "Operator confirmed" : "Package default"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Package default</p>
                  <p className="mt-2"><strong>Hotel:</strong> {card.packageHotel?.hotelName || "N/A"}</p>
                  <p><strong>Rating:</strong> {card.packageHotel?.rating || "N/A"}</p>
                  <p><strong>Distance:</strong> {card.packageHotel?.distance || "N/A"}</p>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Booking confirmation</p>
                  <p className="mt-2">
                    <strong>Hotel:</strong>{" "}
                    {card.confirmed?.hotelName ||
                      card.packageHotel?.hotelName ||
                      "Using package default"}
                  </p>
                  <p><strong>Contact:</strong> {card.confirmed?.contactName || "Not shared"}</p>
                  <p><strong>Phone:</strong> {card.confirmed?.contactPhone || "Not shared"}</p>
                  <p><strong>Note:</strong> {card.confirmed?.note || "No traveler-facing note shared"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-700">No hotel details available.</p>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
