import { useContext, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BookingContext } from "../../../../context/BookingContext";
import { parseAdminBookingNumberFromSearch } from "../bookingRouteUtils";

const useAdminBookingLoader = ({ refreshIfResolved = false } = {}) => {
  const { booking, loading, error, fetchBookingDetails } = useContext(BookingContext);
  const location = useLocation();
  const params = useParams();

  const bookingNumber = useMemo(
    () => params?.bookingNumber || parseAdminBookingNumberFromSearch(location.search),
    [location.search, params?.bookingNumber]
  );

  const resolvedBooking =
    booking && `${booking?.booking_number || ""}` === `${bookingNumber || ""}`
      ? booking
      : null;

  const shouldFetch = Boolean(bookingNumber && (refreshIfResolved || !resolvedBooking));

  useEffect(() => {
    if (shouldFetch) {
      fetchBookingDetails(bookingNumber);
    }
  }, [bookingNumber, fetchBookingDetails, shouldFetch]);

  return {
    booking: resolvedBooking,
    bookingNumber,
    loading: loading || (!resolvedBooking && shouldFetch && !error),
    error,
  };
};

export default useAdminBookingLoader;
