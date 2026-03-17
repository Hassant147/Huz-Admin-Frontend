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
import { buildAdminBookingSubflowPath } from '../bookingRouteUtils';
import FulfillmentEditUnavailable from './components/FulfillmentEditUnavailable';

const Active = () => {
  const { booking, refreshBookingDetails } = useContext(BookingContext);
  const documentStatus = booking?.fulfillment_summary || {};
  const bookingNumber = booking?.booking_number || '';
  const canManageDetails = Boolean(booking?.actions?.canEditFulfillment);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (booking?.booking_status === 'READY_FOR_TRAVEL' || booking?.booking_status === 'COMPLETED') {
      setCompleted(true);
      return;
    }

    setCompleted(false);
  }, [booking?.booking_status]);

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
        <h2 className="text-lg font-medium text-gray-600 mb-4">Fulfillment is finished</h2>
        <p className="text-sm text-gray-700">This booking has already moved past active fulfillment. Use the completed view for final status and read-only records.</p>
      </div>
    );
  }

  if (!canManageDetails) {
    return <FulfillmentEditUnavailable booking={booking} />;
  }

  return (
    <div className="space-y-2">
      {documentStatus.visaCompleted ? (
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
              Share eVisa details
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Upload the traveler-facing visa files once the visa is confirmed for this booking.
            </p>
          </div>
          <Link
            to={buildAdminBookingSubflowPath(bookingNumber, "upload-evisa")}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Open step
          </Link>
        </div>
      )}

      {documentStatus.airlineDetailsCompleted ? (
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
              Share airline details
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Add the flight details and files that the traveler should see for this booking.
            </p>
          </div>
          <Link
            to={buildAdminBookingSubflowPath(bookingNumber, "airline-tickets")}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Open step
          </Link>
        </div>
      )}

      {documentStatus.transportCompleted ? (
        <TransportDetails booking={booking} />
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
              Share transport details
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Add the confirmed transport details or ticket file for this booking.
            </p>
          </div>
          <Link
            to={buildAdminBookingSubflowPath(bookingNumber, "transport-arrangement")}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Open step
          </Link>
        </div>
      )}

      {documentStatus.hotelCompleted ? (
        <HotelDetails booking={booking} />
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
              Share hotel details
            </h2>
            <p className="text-xs font-thin text-gray-500">
              Add the hotel confirmation details that should be visible to the traveler.
            </p>
          </div>
          <Link
            to={buildAdminBookingSubflowPath(bookingNumber, "hotel-arrangement")}
            className="bg-[#00936C] md:text-[15px] text-[10px] justify-center text-center w-full lg:w-[155px] xl:w-[155px] hover:bg-green-900 text-white font-medium py-2 rounded"
          >
            Open step
          </Link>
        </div>
      )}
    </div>
  );
};

export default Active;
