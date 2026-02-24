import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminPanelLayout from "../../../../../../components/layout/AdminPanelLayout";
import UploadVisa from "./UploadVisa";
import Sidebar from '../../components/Sidebar';
import { BookingContext } from '../../../../../../context/BookingContext';

const UploadEvisa = () => {
  const { booking, setBooking, fetchBookingDetails } = useContext(BookingContext);
  const location = useLocation();
  const isEditing = location.state ? location.state.isEditing : false;
  const bookingNumber = localStorage.getItem('bookingNumber'); // Retrieve booking number from local storage

  useEffect(() => {
    // Try to get booking data from local storage
    const storedBooking = localStorage.getItem('booking');

    if (storedBooking) {
      const parsedBooking = JSON.parse(storedBooking);
      setBooking(parsedBooking);
    } else if (bookingNumber) {
      fetchBookingDetails(bookingNumber);
    }
  }, [bookingNumber, fetchBookingDetails, setBooking]);

  if (!booking) {
    return <div>Loading booking details...</div>; // Or some other loading state
  }

  return (
    <AdminPanelLayout
      title="Booking Detail"
      subtitle="Upload and review e-visa documents for this booking."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      <div className="pb-10 space-y-10">
        <div className="mt-10 mx-auto flex items-center">
          <div className="block relative">
            <h1 className="font-k2d font-Normal text-2xl text-[#4B465C]">
              Booking detail
            </h1>
            <p className="font-k2d font-light text-sm text-gray-500">
              Start by telling us your package type by selecting one of the following:
            </p>
          </div>
        </div>
        <div className="w-full flex lg:flex-row flex-col mb-10 mx-auto space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="lg:w-[25%]">
            <Sidebar booking={booking} />
          </div>
          <div className="lg:w-2/3 flex-grow">
            <UploadVisa booking={booking} isEditing={isEditing} />
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default UploadEvisa;
