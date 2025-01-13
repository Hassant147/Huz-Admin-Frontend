import React, { useContext } from 'react';
import { BookingContext } from '../../../../context/BookingContext';
import VisaDetails from './ActiveSatusComponents/UploadVisa/VisaDetails';
import AirlineDetails from './ActiveSatusComponents/AirlineTickets/AirlineDetails';
import TransportDetails from './ActiveSatusComponents/TransportArrangement/TransportDetails';
import HotelDetails from './ActiveSatusComponents/HotelArrangement/HotelDetails';
import { deleteBookingDocument } from '../../../../utility/Api';
import toast from 'react-hot-toast';

const Completed = () => {
  const { booking, refreshBookingDetails } = useContext(BookingContext);
  const { booking_required_documents = [], booking_airline_details = [], transport_details = [], hotel_details = [] } = booking || {};

  const handleDelete = async (documentId, type) => {
    try {
      const props = {
        session_token: booking.user_session_token,
        document_id: documentId,
        booking_number: booking.booking_number,
        partner_session_token: booking.partner_session_token,
      };
      await deleteBookingDocument(props);
      toast.success('Document deleted successfully!');
      await refreshBookingDetails(booking.booking_number); // Update the entire booking state
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document.');
    }
  };

  return (
    <div className="space-y-2">
      <VisaDetails
        booking={booking}
        onDelete={(documentId) => handleDelete(documentId, 'booking_required_documents')}
      />
      <AirlineDetails
        booking={booking}
        onDelete={(documentId) => handleDelete(documentId, 'booking_airline_details')}
      />
      <TransportDetails
        details={transport_details}
        onDelete={(documentId) => handleDelete(documentId, 'transport_details')}
      />
      <HotelDetails
        details={hotel_details}
        onDelete={(documentId) => handleDelete(documentId, 'hotel_details')}
      />
    </div>
  );
};

export default Completed;
