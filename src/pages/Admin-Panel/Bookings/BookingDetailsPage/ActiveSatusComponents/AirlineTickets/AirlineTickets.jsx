import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../../../../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../../../../components/NavigationBarForContent";
import Footer from "../../../../../../components/Footers/FooterForLoggedIn";
import Sidebar from '../../components/Sidebar';
import { BookingContext } from '../../../../../../context/BookingContext';
import UploadAirline from "./UploadAirline";

const AirlineTickets = () => {
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

  return (
    <div className="bg-[#f6f6f6]">
      <Header />
      <NavigationBar />
      <div className="pb-10 w-[90%] mx-auto space-y-10">
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
            <UploadAirline booking={booking} isEditing={isEditing} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AirlineTickets;
