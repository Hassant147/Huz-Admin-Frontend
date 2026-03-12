import React, { useState, useEffect } from "react";
import BookingCard from "../components/BookingCard";
import { fetchBookings } from "../../../../utility/Api";
import NoBookings from "./NoBooking";
import Loader from "../../../../components/loader";
import Pagination from "./Pagination";
import Select from "react-select";
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";
import { WORKFLOW_OPTIONS } from "../bookingWorkflowUtils";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#2f855a" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 2px rgba(10, 143, 103, 0.12)" : "none",
    "&:hover": {
      borderColor: "#2f855a",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#00936C" : provided.backgroundColor,
    "&:hover": {
      backgroundColor: state.isSelected ? "#00936C" : "#f0fdf4",
    },
    color: state.isSelected ? "white" : provided.color,
  }),
};

const TabsWithSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(WORKFLOW_OPTIONS[0].value);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearchTerm = searchInput.trim();
      if (normalizedSearchTerm === searchTerm) {
        return;
      }

      setCurrentPage(1);
      setSearchTerm(normalizedSearchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchTerm]);

  const loadBookings = async ({ nextStatus, nextPage, nextSearchTerm }) => {
    setLoading(true);
    try {
      const partnerSessionToken = getPartnerSessionToken();
      const data = await fetchBookings(partnerSessionToken, {
        workflowBucket: nextStatus,
        bookingNumber: nextSearchTerm,
        page: nextPage,
        pageSize: itemsPerPage,
      });
      setBookings(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      setBookings([]);
      setTotalCount(0);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings({
      nextStatus: status,
      nextPage: currentPage,
      nextSearchTerm: searchTerm,
    });
  }, [currentPage, searchTerm, status]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="app-content-stack">
      {loading ? (
        <AppCard className="min-h-[340px] flex items-center justify-center">
          <Loader
            type="spinner-cub"
            bgColor="#00936c"
            color="#00936c"
            title=""
            size={30}
          />
        </AppCard>
      ) : (
        <>
          <AppCard>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="w-full md:w-[240px]">
                <Select
                  value={WORKFLOW_OPTIONS.find((option) => option.value === status)}
                  onChange={(selectedOption) => {
                    if (!selectedOption?.value) {
                      return;
                    }
                    setStatus(selectedOption.value);
                    setCurrentPage(1);
                  }}
                  options={WORKFLOW_OPTIONS}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={customStyles}
                />
              </div>
              <div className="w-full md:w-[340px]">
                <input
                  type="text"
                  placeholder="Search by booking number..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                  }}
                />
              </div>
            </div>
          </AppCard>

          {bookings.length > 0 ? (
            <>
              <AppCard className="border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                  <p>
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} bookings
                  </p>
                  <p>Search is matched server-side against booking number.</p>
                </div>
              </AppCard>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.booking_id || booking.booking_number}
                    booking={booking}
                  />
                ))}
              </div>
              {totalPages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </>
          ) : (
            <AppCard>
              <div className="flex min-h-[250px] items-center justify-center">
                <NoBookings />
              </div>
            </AppCard>
          )}
        </>
      )}
    </div>
  );
};

export default TabsWithSearch;
