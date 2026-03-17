import React, { useContext, useState } from 'react';
import { BookingContext } from '../../../../context/BookingContext';
import VisaDetails from './ActiveSatusComponents/UploadVisa/VisaDetails';
import AirlineDetails from './ActiveSatusComponents/AirlineTickets/AirlineDetails';
import TransportDetails from './ActiveSatusComponents/TransportArrangement/TransportDetails';
import HotelDetails from './ActiveSatusComponents/HotelArrangement/HotelDetails';
import { closeBooking, deleteBookingDocument } from '../../../../utility/Api';
import toast from 'react-hot-toast';
import { canManageFulfillmentDetails } from '../bookingWorkflowUtils';

const Completed = ({ booking: bookingProp, mode = '' }) => {
  const { booking: contextBooking, refreshBookingDetails } = useContext(BookingContext);
  const booking = bookingProp || contextBooking;
  const canManageDetails = canManageFulfillmentDetails(booking);
  const [closing, setClosing] = useState(false);
  const { partner_session_token } = JSON.parse(
    localStorage.getItem('SignedUp-User-Profile') || '{}'
  );
  const effectiveMode =
    mode || (booking?.booking_status === 'READY_FOR_TRAVEL' ? 'ready_for_travel' : 'completed');

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

  const handleCloseBooking = async () => {
    if (!booking?.booking_number || !partner_session_token) {
      return;
    }

    setClosing(true);
    try {
      await closeBooking(partner_session_token, booking.booking_number);
      toast.success('Booking marked as completed.');
      await refreshBookingDetails(booking.booking_number);
    } catch (error) {
      console.error('Failed to close booking:', error);
      toast.error(error.message || 'Failed to complete booking.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="space-y-2">
      {effectiveMode === 'ready_for_travel' ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Ready for travel</p>
              <p className="mt-1">
                Fulfillment is complete. This booking can be marked completed only when the backend completion rule allows it.
              </p>
            </div>
            {booking?.actions?.canCompleteBooking ? (
              <button
                type="button"
                onClick={handleCloseBooking}
                disabled={closing}
                className="rounded-md bg-[#00936C] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {closing ? 'Completing...' : 'Mark completed'}
              </button>
            ) : (
              <p className="text-xs text-sky-800">
                Completion is blocked until the backend completion rule passes.
              </p>
            )}
          </div>
        </div>
      ) : !canManageDetails ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This booking is completed. Fulfillment details remain visible here but can no longer be edited.
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
      <TransportDetails booking={booking} canManage={canManageDetails} />
      <HotelDetails booking={booking} canManage={canManageDetails} />
    </div>
  );
};

export default Completed;
