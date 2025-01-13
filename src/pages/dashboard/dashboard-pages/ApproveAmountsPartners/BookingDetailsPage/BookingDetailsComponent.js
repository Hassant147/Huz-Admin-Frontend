import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To get state passed from the previous component
import { fetchBookingDetails } from "../../../../../utility/Super-Admin-Api"; // Import your API function
import Loader from "../../../../../components/loader"; // Import the Loader component
import NoContent from "../../../../../components/NoContent"; // Import NoContent component
import PackageDetails from "../../ApproveAmountsPages/BookingDetailsPage/PackageDetails";
import BookingInfo from "../../ApproveAmountsPages/BookingDetailsPage/BookingInfo";
import VisaDetails from "../../ApproveAmountsPages/BookingDetailsPage/VisaDetail/VisaDetail";
import AirlineDetails from "../../ApproveAmountsPages/BookingDetailsPage/AirlineDetail/AirlineDetail";
import TransportDetails from "../../ApproveAmountsPages/BookingDetailsPage/TransportDetail/TransportDetail";
import HotelDetails from "../../ApproveAmountsPages/BookingDetailsPage/HotelDetail/HotelDetail";

const BookingDetailsComponent = () => {
  const location = useLocation();
  const booking = location.state?.booking; // Retrieve the booking object passed from the previous page
  const [bookingDetails, setBookingDetails] = useState(null); // State to store booking details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    if (booking) {
      const fetchDetails = async () => {
        const { partner_session_token, booking_number } = booking;
        const { status, data, error } = await fetchBookingDetails(
          partner_session_token,
          booking_number
        );

        if (status === 200) {
          setBookingDetails(data);
        } else {
          setError(
            error || "An error occurred while fetching booking details."
          );
        }
        setLoading(false);
      };

      fetchDetails();
    } else {
      setLoading(false);
      setError("No booking data available.");
    }
  }, [booking]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!bookingDetails) {
    return <NoContent />;
  }

  return (
    <div className="bg-gray-50">
      <div className="space-y-4">
        <PackageDetails booking={bookingDetails} />
        <BookingInfo booking={bookingDetails} />
        <VisaDetails booking={bookingDetails} />
        <AirlineDetails booking={bookingDetails} />
        {/* <TransportDetails booking={bookingDetails} />
        <HotelDetails booking={bookingDetails} /> */}
      </div>
    </div>
  );
};

export default BookingDetailsComponent;
