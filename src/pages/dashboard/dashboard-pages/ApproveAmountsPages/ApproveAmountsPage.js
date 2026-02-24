import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPaidBookings } from "../../../../utility/Super-Admin-Api";
import { AppButton, AppCard, AppEmptyState, AppSectionHeader } from "../../../../components/ui";
import SearchBar from "./SearchBar";
import errorIcon from "../../../../assets/error.svg";
import SuperAdminModuleShell from "../../components/SuperAdminModuleShell";
import SuperAdminPagination from "../../components/SuperAdminPagination";
import SuperAdminMetricCard from "../../components/SuperAdminMetricCard";
import SuperAdminInfoTile from "../../components/SuperAdminInfoTile";
import usePaginatedRecords from "../../components/usePaginatedRecords";
import Loader from "../../../../components/loader";
import { formatCurrencyPKR, formatDateTime } from "../../components/superAdminFormatters";

const ITEMS_PER_PAGE = 6;

const ApproveAmountsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filteredBookings = useMemo(() => {
    if (!selectedDate) {
      return bookings;
    }

    const selectedDateString = selectedDate.toLocaleDateString();
    return bookings.filter(
      (booking) => new Date(booking.order_time).toLocaleDateString() === selectedDateString
    );
  }, [bookings, selectedDate]);

  const { currentPage, totalPages, currentItems, onPageChange, resetPagination } =
    usePaginatedRecords(filteredBookings, ITEMS_PER_PAGE);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    const { status, data, error: requestError } = await fetchPaidBookings();

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
    loadBookings();
  }, [loadBookings]);

  const clearFilters = useCallback(() => {
    setSelectedDate(null);
    resetPagination();
  }, [resetPagination]);

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);
      resetPagination();
    },
    [resetPagination]
  );

  const totalAmount = useMemo(() => {
    return filteredBookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0);
  }, [filteredBookings]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) {
      return "All dates";
    }
    return selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const hasActiveFilter = Boolean(selectedDate);

  return (
    <SuperAdminModuleShell
      title="Approve Amounts"
      subtitle="Review paid booking requests and move them to detailed action."
      showBackButton={false}
      toolbar={
        <div className="flex flex-wrap items-end gap-2 sm:gap-3">
          <SearchBar selectedDate={selectedDate} onDateChange={handleDateChange} />
          <AppButton
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={!hasActiveFilter}
            className="min-w-[120px]"
          >
            Clear Filter
          </AppButton>
        </div>
      }
    >
      {loading ? (
        <AppCard className="min-h-[320px] flex items-center justify-center">
          <Loader />
        </AppCard>
      ) : error ? (
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Unable to load bookings"
            message={error}
            action={
              <AppButton size="sm" onClick={loadBookings}>
                Retry
              </AppButton>
            }
          />
        </AppCard>
      ) : filteredBookings.length > 0 ? (
        <>
          <div className="app-grid-3">
            <SuperAdminMetricCard
              title="Total Requests"
              value={bookings.length.toLocaleString()}
              hint="Paid booking submissions"
            />
            <SuperAdminMetricCard
              title="Matching Results"
              value={filteredBookings.length.toLocaleString()}
              hint={`Filter: ${selectedDateLabel}`}
            />
            <SuperAdminMetricCard
              title="Total Amount"
              value={formatCurrencyPKR(totalAmount)}
              hint={`${currentItems.length} records on current page`}
            />
          </div>

          <AppCard className="border-slate-200">
            <AppSectionHeader
              title="Paid Booking Requests"
              subtitle={`Showing ${currentItems.length} of ${filteredBookings.length} records`}
            />
          </AppCard>

          <div className="app-content-stack">
            {currentItems.map((booking) => (
              <AppCard key={booking.booking_number} className="border-slate-200">
                <article className="app-content-stack">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-300">
                        Booking {booking.booking_number}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-ink-900">
                        {booking.user_fullName || "Name not provided"}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="app-status-pill">{booking.booking_status || "Paid"}</span>
                      <AppButton
                        size="sm"
                        onClick={() => navigate("/booking-details", { state: { booking } })}
                      >
                        Review
                      </AppButton>
                    </div>
                  </header>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SuperAdminInfoTile label="Raised On" value={formatDateTime(booking.order_time)} />
                    <SuperAdminInfoTile
                      label="Total Amount"
                      value={formatCurrencyPKR(booking.total_price)}
                    />
                    <SuperAdminInfoTile
                      label="Payment Method"
                      value={booking.payment_type || "Not available"}
                    />
                    <SuperAdminInfoTile
                      label="Status"
                      value={booking.booking_status || "Not available"}
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
            title={hasActiveFilter ? "No results for selected date" : "No paid bookings"}
            message={
              hasActiveFilter
                ? "Try another date or clear the filter to view all requests."
                : "Paid booking requests will appear here."
            }
            action={
              hasActiveFilter ? (
                <AppButton size="sm" variant="outline" onClick={clearFilters}>
                  Clear Filter
                </AppButton>
              ) : null
            }
          />
        </AppCard>
      )}
    </SuperAdminModuleShell>
  );
};

export default ApproveAmountsPage;

