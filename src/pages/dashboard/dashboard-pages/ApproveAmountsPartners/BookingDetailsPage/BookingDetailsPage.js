import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Action from "./Action";
import BookingDetailsComponent from "./BookingDetailsComponent";
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
        title="Partner Booking Details"
        subtitle="Review partner payment transfer request details."
      >
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Booking record not loaded"
            message="Open a booking from partner amounts list to continue."
            action={
              <AppButton size="sm" onClick={() => navigate("/approve-partners-amounts")}>
                Go to Partner Amounts
              </AppButton>
            }
          />
        </AppCard>
      </SuperAdminModuleShell>
    );
  }

  return (
    <SuperAdminModuleShell
      title="Partner Booking Details"
      subtitle="Validate package details and settlement proof before transfer."
    >
      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar booking={booking} />
        <div className="app-content-stack">
          <BookingDetailsComponent booking={booking} />
          <Action booking={booking} />
        </div>
      </div>
    </SuperAdminModuleShell>
  );
};

export default BookingDetailsPage;
