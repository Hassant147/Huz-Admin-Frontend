import React, { createContext, useState, useCallback } from 'react';
import { getBookingDetails } from '../utility/Api';
import { adaptAdminBooking } from '../utility/bookingContractUtils';

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingDocument, setDeletingDocument] = useState(false);

  const userProfile = localStorage.getItem('SignedUp-User-Profile');
  const partner_session_token = userProfile ? JSON.parse(userProfile).partner_session_token : null;

  const fetchBookingDetails = useCallback(async (bookingNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingDetails(partner_session_token, bookingNumber);
      const adaptedBooking = adaptAdminBooking(data);
      setBooking(adaptedBooking);
      setBookingStatus(adaptedBooking.booking_status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [partner_session_token]);

  const refreshBookingDetails = useCallback(async (bookingNumber) => {
    setDeletingDocument(true);
    setError(null);
    try {
      const data = await getBookingDetails(partner_session_token, bookingNumber);
      const adaptedBooking = adaptAdminBooking(data);
      setBooking(adaptedBooking);
      setBookingStatus(adaptedBooking.booking_status);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingDocument(false);
    }
  }, [partner_session_token]);

  return (
    <BookingContext.Provider value={{
      booking, setBooking, bookingStatus, fetchBookingDetails,
      refreshBookingDetails, loading, error, deletingDocument, setDeletingDocument
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export { BookingContext, BookingProvider };
