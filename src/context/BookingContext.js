import React, { createContext, useState, useCallback } from 'react';
import { getBookingDetails } from '../utility/Api';

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
    try {
      const data = await getBookingDetails(partner_session_token, bookingNumber);
      setBooking(data);
      setBookingStatus(data.booking_status);
      localStorage.setItem('booking', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [partner_session_token]);

  const refreshBookingDetails = useCallback(async (bookingNumber) => {
    setDeletingDocument(true);
    try {
      const data = await getBookingDetails(partner_session_token, bookingNumber);
      setBooking(data); // Update the entire booking state to ensure re-render
      setBookingStatus(data.booking_status);
      localStorage.setItem('booking', JSON.stringify(data));
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
