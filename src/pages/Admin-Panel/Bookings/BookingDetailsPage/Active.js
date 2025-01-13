import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { BookingContext } from '../../../../context/BookingContext';
import bannerimg from "../../../../assets/bookingbg.svg";
import VisaDetails from './ActiveSatusComponents/UploadVisa/VisaDetails';
import AirlineDetails from './ActiveSatusComponents/AirlineTickets/AirlineDetails';
import TransportDetails from './ActiveSatusComponents/TransportArrangement/TransportDetails';
import HotelDetails from './ActiveSatusComponents/HotelArrangement/HotelDetails';

import { deleteBookingDocument } from '../../../../utility/Api';
import toast from 'react-hot-toast';

const Active = () => {
  const { booking, refreshBookingDetails } = useContext(BookingContext);
  const { booking_documents_status, booking_required_documents = [], booking_airline_details = [], transport_details = [], hotel_details = [] } = booking || {};
  const documentStatus = booking_documents_status?.[0] || {};

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const allCompleted = documentStatus.is_visa_completed && documentStatus.is_airline_detail_completed && documentStatus.is_transport_completed && documentStatus.is_hotel_completed;
    if (allCompleted && booking.booking_status !== 'Completed') {
      // Simulate updating status to 'Completed'
      // In a real scenario, this should call an API to update the status in the backend
      const updatedBooking = { ...booking, booking_status: 'Completed' };
      refreshBookingDetails(updatedBooking.booking_number, 'booking_documents_status');
    }
  }, [
    documentStatus.is_visa_completed,
    documentStatus.is_airline_detail_completed,
    documentStatus.is_transport_completed,
    documentStatus.is_hotel_completed,
    booking.booking_status,
    booking.booking_number,
    refreshBookingDetails
  ]);

  useEffect(() => {
    if (booking.booking_status === 'Completed') {
      setCompleted(true);
    }
  }, [booking.booking_status]);

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
      await refreshBookingDetails(booking.booking_number, type);
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document.');
    }
  };

  if (completed) {
    return (
      <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Booking Completed</h2>
        <p className="text-sm text-gray-700">This booking has been completed successfully. No further actions are needed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documentStatus.is_visa_completed ? (
        <VisaDetails
          booking={booking}
          onDelete={(documentId) => handleDelete(documentId, 'booking_required_documents')}
        />
      ) : (
        <div
          className="my-2 p-3 border border-[#DCDCDC] flex justify-between items-center bg-gray-50 rounded"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="text-base font-medium text-gray-500">
              Is eVisa confirmed?
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Let the customer know if their eVisa is confirmed, share eVisa with
              customer.
            </p>
          </div>
          <Link
            to={"/package/upload-evisa"}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Share Details
          </Link>
        </div>
      )}

      {documentStatus.is_airline_detail_completed ? (
        <AirlineDetails
          booking={booking}
          onDelete={(documentId) => handleDelete(documentId, 'booking_required_documents')}
        />
      ) : (
        <div
          className="my-2 p-3 border border-[#DCDCDC] flex justify-between items-center bg-gray-50 rounded"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="text-base font-medium text-gray-500">
              Are airline tickets confirmed?
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Let the customer know if their airline tickets are confirmed, share
              tickets with customer.
            </p>
          </div>
          <Link
            to={"/package/airline-tickets"}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Share Details
          </Link>
        </div>
      )}

      {documentStatus.is_transport_completed ? (
        <TransportDetails
          details={transport_details}
          onDelete={(documentId) => handleDelete(documentId, 'transport_details')}
        />
      ) : (
        <div
          className="my-2 p-3 border border-[#DCDCDC] flex justify-between items-center bg-gray-50 rounded"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="text-base font-medium text-gray-500">
              Is transport booking confirmed?
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Let the customer know if their transport booking is confirmed, share
              details with customer.
            </p>
          </div>
          <Link
            to={"/package/transport-arrangement"}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Share Details
          </Link>
        </div>
      )}

      {documentStatus.is_hotel_completed ? (
        <HotelDetails
          details={hotel_details}
          onDelete={(documentId) => handleDelete(documentId, 'hotel_details')}
        />
      ) : (
        <div
          className="my-2 p-3 border border-[#DCDCDC] flex justify-between items-center bg-gray-50 rounded"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="text-base font-medium text-gray-500">
              Is hotel booking confirmed?
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Let the customer know if their hotel booking is confirmed, share
              details with customer.
            </p>
          </div>
          <Link
            to={"/package/hotel-arrangement"}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Share Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default Active;
