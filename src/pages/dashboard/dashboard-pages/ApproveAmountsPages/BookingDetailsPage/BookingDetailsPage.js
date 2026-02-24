import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import PackageDetails from "./PackageDetails";
import BookingInfo from "./BookingInfo";
import Action from "./Action/Action";
import TransactionDetails from "./TransactionDetails";
import CompanyDetail from "./CompanyDetail";
import { AppButton, AppCard, AppEmptyState } from "../../../../../components/ui";
import errorIcon from "../../../../../assets/error.svg";
import SuperAdminModuleShell from "../../../components/SuperAdminModuleShell";

const BookingDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <SuperAdminModuleShell
        title="Booking Details"
        subtitle="Review payment evidence and booking detail records."
      >
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Booking record not loaded"
            message="Open a booking from the approve amounts list to continue."
            action={
              <AppButton size="sm" onClick={() => navigate("/approve-amounts")}>
                Go to Approve Amounts
              </AppButton>
            }
          />
        </AppCard>
      </SuperAdminModuleShell>
    );
  }

  return (
    <SuperAdminModuleShell
      title="Booking Details"
      subtitle="Validate booking information, company details, and transaction proofs."
    >
      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar booking={booking} />
        <div className="app-content-stack">
          <PackageDetails booking={booking} />
          <BookingInfo booking={booking} />
          <CompanyDetail booking={booking} />
          <TransactionDetails booking={booking} />
          <Action booking={booking} />
        </div>
      </div>
    </SuperAdminModuleShell>
  );
};

export default BookingDetailsPage;
