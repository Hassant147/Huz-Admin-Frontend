import React, { useContext } from "react";
import { BookingContext } from "../../../../../../context/BookingContext";
import phone from "../../../../../../assets/booking/phone.svg";
import user from "../../../../../../assets/booking/user.svg";

const HotelCard = ({ location, name, number, note }) => (
  <div className="p-4 bg-white border border-gray-200 rounded shadow-sm w-full sm:w-1/2">
    <p className="text-sm text-gray-500 font-semibold">{location}</p>
    <div className="mt-2 flex items-center text-gray-700">
      <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />
      <p className="text-sm text-gray-500">
        <strong>Full Name:</strong> {name}
      </p>
    </div>
    <div className="mt-1 flex items-center text-gray-700">
      <img src={phone} alt="Phone Icon" className="w-4 h-4 mr-2" />
      <p className="text-sm text-gray-500">
        <strong>Contact: </strong> {number}
      </p>
    </div>
    <p className="mt-4 font-thin text-gray-500 text-sm">
      Special Note for customer
    </p>
    <p className="mt-1 text-gray-600 text-sm">{note}</p>
  </div>
);

const HotelDetails = () => {
  const { booking } = useContext(BookingContext);

  const hotelDetails =
    booking?.booking_hotel_and_transport_details?.length > 0
      ? booking.booking_hotel_and_transport_details.filter(
          (detail) => detail.detail_for === "Hotel"
        )
      : [];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">
          Shared Hotel Details
        </h2>
      </div>
      <div className="bg-gray-50 rounded space-y-4">
        {hotelDetails.length > 0 ? (
          hotelDetails.map((detail, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4">
              {detail.mecca_name && (
                <HotelCard
                  location="Makkah"
                  name={detail.mecca_name}
                  number={detail.mecca_number}
                  note={
                    detail.comment_1 ||
                    detail.comment_2 ||
                    "No special note available"
                  }
                />
              )}
              {detail.madinah_name && (
                <HotelCard
                  location="Madinah"
                  name={detail.madinah_name}
                  number={detail.madinah_number}
                  note={
                    detail.comment_1 ||
                    detail.comment_2 ||
                    "No special note available"
                  }
                />
              )}
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

export default HotelDetails;
