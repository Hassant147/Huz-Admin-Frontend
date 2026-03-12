import React, { useContext } from 'react';
import { BookingContext } from '../../../../context/BookingContext';
import VisaDetails from './ActiveSatusComponents/UploadVisa/VisaDetails';
import AirlineDetails from './ActiveSatusComponents/AirlineTickets/AirlineDetails';
import TransportDetails from './ActiveSatusComponents/TransportArrangement/TransportDetails';
import HotelDetails from './ActiveSatusComponents/HotelArrangement/HotelDetails';
import { deleteBookingDocument } from '../../../../utility/Api';
import toast from 'react-hot-toast';
import { canManageFulfillmentDetails } from '../bookingWorkflowUtils';

const Completed = () => {
  const { booking, refreshBookingDetails } = useContext(BookingContext);
  const { transport_details = [], hotel_details = [] } = booking || {};
  const canManageDetails = canManageFulfillmentDetails(booking);

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
      {!canManageDetails ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This booking is completed. Fulfillment documents and arrangements are now read-only.
        </div>
      ) : null}
      <VisaDetails
        booking={booking}
        canManage={canManageDetails}
        onDelete={
          canManageDetails
            ? (documentId) => handleDelete(documentId, 'booking_required_documents')
            : undefined
        }
      />
      <AirlineDetails
        booking={booking}
        canManage={canManageDetails}
        onDelete={
          canManageDetails
            ? (documentId) => handleDelete(documentId, 'booking_airline_details')
            : undefined
        }
      />
      <TransportDetails
        details={transport_details}
        canManage={canManageDetails}
      />
      <HotelDetails
        details={hotel_details}
        canManage={canManageDetails}
      />
    </div>
  );
};

export default Completed;
