import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../../../../../../context/BookingContext';
import phone from '../../../../../../assets/booking/phone.svg';
import user from '../../../../../../assets/booking/user.svg';

const HotelCard = ({ location, name, number, note }) => (
  <div className="p-4 bg-white border border-gray-200 rounded shadow-sm w-full sm:w-1/2">
    <p className="text-sm text-gray-500 font-semibold">{location}</p>
    <div className="mt-2 flex items-center text-gray-700">
      <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />
      <p className="text-sm text-gray-500"><strong>Full Name:</strong> {name}</p>
    </div>
    <div className="mt-1 flex items-center text-gray-700">
      <img src={phone} alt="Phone Icon" className="w-4 h-4 mr-2" />
      <p className="text-sm text-gray-500"><strong>Contact: </strong> {number}</p>
    </div>
    <p className="mt-4 font-thin text-gray-500 text-sm">Special Note for customer</p>
    <p className="mt-1 text-gray-600 text-sm">{note}</p>
  </div>
);

const HotelDetails = () => {
  const { booking } = useContext(BookingContext);
  const navigate = useNavigate();

  const hotelDetails = booking.booking_hotel_and_transport_details.filter(detail => detail.detail_for === "Hotel");

  const handleEdit = () => {
    navigate("/package/hotel-arrangement", { state: { isEditing: true } });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared Hotel Details</h2>
        <button
          onClick={handleEdit}
          className="text-white text-xs bg-[#00936C] hover:bg-[#007B54] rounded px-3 py-1.5"
        >
          Edit/Update
        </button>
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
                  note={detail.comment_1 || detail.comment_2 || 'No special note available'}
                />
              )}
              {detail.madinah_name && (
                <HotelCard
                  location="Madinah"
                  name={detail.madinah_name}
                  number={detail.madinah_number}
                  note={detail.comment_1 || detail.comment_2 || 'No special note available'}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-700">No hotel details available</p>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
