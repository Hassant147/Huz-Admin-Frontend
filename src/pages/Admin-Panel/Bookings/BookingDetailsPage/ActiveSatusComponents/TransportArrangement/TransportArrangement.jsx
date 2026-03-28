import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminPanelLayout from "../../../../../../components/layout/AdminPanelLayout";
import Sidebar from '../../components/Sidebar';
import TransportArrangementForm from "./TransportArrangementForm";
import useAdminBookingLoader from '../../useAdminBookingLoader';
import { canManageFulfillmentDetails } from '../../../bookingWorkflowUtils';
import FulfillmentEditUnavailable from '../../components/FulfillmentEditUnavailable';

const TransportArrangement = () => {
  const { booking, loading } = useAdminBookingLoader();
  const location = useLocation();
  const isEditing = Boolean(location.state?.isEditing);


  if (loading || !booking) {
    return <div>Loading booking details...</div>; // Or some other loading state
  }

  if (!canManageFulfillmentDetails(booking)) {
    return (
      <AdminPanelLayout
        title="Booking Detail"
        subtitle="Manage transport arrangement details for this booking."
        mainClassName="py-5 bg-[#f6f6f6]"
      >
        <FulfillmentEditUnavailable booking={booking} />
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout
      title="Booking Detail"
      subtitle="Manage transport arrangement details for this booking."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      <div className="pb-10 space-y-10">
        <div className="mt-10 mx-auto flex items-center">
          <div className="block relative">
            <h1 className="font-k2d font-Normal text-2xl text-[#4B465C]">
              Booking detail
            </h1>
            <p className="font-k2d font-light text-sm text-gray-500">
              Manage the traveler-facing transport share for this booking.
            </p>
          </div>
        </div>
        <div className="w-full flex lg:flex-row flex-col mb-10 mx-auto space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="lg:w-[25%]">
            <Sidebar booking={booking} />
          </div>
          <div className="lg:w-2/3 flex-grow">
            <TransportArrangementForm booking={booking} isEditing={isEditing} />
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default TransportArrangement;
