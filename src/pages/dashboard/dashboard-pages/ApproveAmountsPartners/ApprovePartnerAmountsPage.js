import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPendingPartnerPayments } from "../../../../utility/Super-Admin-Api";
import { AppButton, AppCard, AppEmptyState, AppSectionHeader } from "../../../../components/ui";
import errorIcon from "../../../../assets/error.svg";
import SuperAdminModuleShell from "../../components/SuperAdminModuleShell";
import SuperAdminPagination from "../../components/SuperAdminPagination";
import SuperAdminMetricCard from "../../components/SuperAdminMetricCard";
import SuperAdminInfoTile from "../../components/SuperAdminInfoTile";
import usePaginatedRecords from "../../components/usePaginatedRecords";
import Loader from "../../../../components/loader";
import {
  formatCurrencyPKR,
  formatDate,
  withFallback,
} from "../../components/superAdminFormatters";

const ITEMS_PER_PAGE = 6;

const ApprovePartnerAmountsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { currentPage, totalPages, currentItems, onPageChange } = usePaginatedRecords(
    bookings,
    ITEMS_PER_PAGE
  );

  const loadPartnerPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    const { status, data, error: requestError } = await fetchPendingPartnerPayments();

    if (status === 200 && Array.isArray(data)) {
      setBookings(data);
    } else if (status === 404) {
      setBookings([]);
    } else {
      setBookings([]);
      setError(requestError || "An error occurred while fetching data.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadPartnerPayments();
  }, [loadPartnerPayments]);

  const totalReceivable = useMemo(() => {
    return bookings.reduce((sum, booking) => sum + Number(booking.receivable_amount || 0), 0);
  }, [bookings]);

  const totalPending = useMemo(() => {
    return bookings.reduce((sum, booking) => sum + Number(booking.pending_amount || 0), 0);
  }, [bookings]);

  const totalProcessed = useMemo(() => {
    return bookings.reduce((sum, booking) => sum + Number(booking.processed_amount || 0), 0);
  }, [bookings]);

  return (
    <SuperAdminModuleShell
      title="Partner Amounts"
      subtitle="Review partner receivable and transfer settlement requests."
      showBackButton={false}
    >
      {loading ? (
        <AppCard className="min-h-[320px] flex items-center justify-center">
          <Loader />
        </AppCard>
      ) : error ? (
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Unable to load partner payments"
            message={error}
            action={
              <AppButton size="sm" onClick={loadPartnerPayments}>
                Retry
              </AppButton>
            }
          />
        </AppCard>
      ) : bookings.length > 0 ? (
        <>
          <div className="app-grid-3">
            <SuperAdminMetricCard
              title="Requests"
              value={bookings.length.toLocaleString()}
              hint="Partner transfer records"
            />
            <SuperAdminMetricCard
              title="Total Receivable"
              value={formatCurrencyPKR(totalReceivable)}
              hint={`Pending ${formatCurrencyPKR(totalPending)}`}
            />
            <SuperAdminMetricCard
              title="Processed Amount"
              value={formatCurrencyPKR(totalProcessed)}
              hint={`${currentItems.length} records on current page`}
            />
          </div>

          <AppCard className="border-slate-200">
            <AppSectionHeader
              title="Partner Receivable Requests"
              subtitle={`Showing ${currentItems.length} of ${bookings.length} records`}
            />
          </AppCard>

          <div className="app-content-stack">
            {currentItems.map((booking) => (
              <AppCard
                key={`${booking.partner_session_token}-${booking.booking_number}`}
                className="border-slate-200"
              >
                <article className="app-content-stack">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-300">
                        Booking {booking.booking_number}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-ink-900">
                        {withFallback(booking.partner_name, "Partner")}
                      </h3>
                    </div>

                    <AppButton
                      size="sm"
                      onClick={() =>
                        navigate("/booking-details-for-partners", { state: { booking } })
                      }
                    >
                      Review
                    </AppButton>
                  </header>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SuperAdminInfoTile label="Created On" value={formatDate(booking.create_date)} />
                    <SuperAdminInfoTile
                      label="Receivable"
                      value={formatCurrencyPKR(booking.receivable_amount)}
                    />
                    <SuperAdminInfoTile
                      label="Pending"
                      value={formatCurrencyPKR(booking.pending_amount)}
                    />
                    <SuperAdminInfoTile
                      label="Processed"
                      value={formatCurrencyPKR(booking.processed_amount)}
                    />
                  </div>
                </article>
              </AppCard>
            ))}
          </div>

          <SuperAdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="No partner payment records"
            message="Pending partner payment requests will appear here."
          />
        </AppCard>
      )}
    </SuperAdminModuleShell>
  );
};

export default ApprovePartnerAmountsPage;

