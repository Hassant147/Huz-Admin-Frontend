import React, { useContext } from "react";
import { BookingContext } from "../../../../../../context/BookingContext";
import phone from "../../../../../../assets/booking/phone.svg";
import user from "../../../../../../assets/booking/user.svg";

const TransportDetails = () => {
  const { booking } = useContext(BookingContext);
  const transportDetails =
    booking?.booking_hotel_and_transport_details?.length > 0
      ? booking.booking_hotel_and_transport_details.filter(
          (detail) => detail.detail_for === "Transport"
        )
      : [];
  return (
    <div className="space-y-2 pb-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">
          Shared Transport Details
        </h2>
      </div>
      <div className="bg-gray-50 rounded space-y-4">
        {transportDetails.length > 0 ? (
          transportDetails.map((detail, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-semibold">Jeddah</p>
                  <div className="flex items-center space-x-2">
                    <img
                      src={user}
                      alt="User Icon"
                      className="w-5 h-5 text-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      <strong>Full Name:</strong> {detail.jeddah_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={phone}
                      alt="Phone Icon"
                      className="w-5 h-5 text-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      <strong>Contact:</strong> {detail.jeddah_number}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-semibold">Madinah</p>
                  <div className="flex items-center space-x-2">
                    <img
                      src={user}
                      alt="User Icon"
                      className="w-5 h-5 text-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      <strong>Full Name:</strong> {detail.madinah_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={phone}
                      alt="Phone Icon"
                      className="w-5 h-5 text-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      <strong>Contact:</strong> {detail.madinah_number}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 font-thin">
                  Special Note for customer
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {detail.comment_1 || detail.comment_2
                    ? `${detail.comment_1} ${detail.comment_2}`
                    : "No comments available"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className=" rounded-lg w-full max-w-md items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <p className="mt-2 text-sm text-center text-[#121212] font-poppins">
                No Documents uploaded yet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportDetails;
