import React, { useMemo, useState, useEffect } from "react";
import BookingCard from "../components/BookingCard";
import { fetchBookings } from "../../../../utility/Api";
import NoBookings from "./NoBooking";
import Loader from "../../../../components/loader";
import Pagination from "./Pagination";
import Select from "react-select";
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "Closed", label: "Closed" },
  { value: "Objection", label: "Objection" },
];

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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TabsWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("Active");
  const itemsPerPage = 10;

  const loadBookings = async (nextStatus) => {
    setLoading(true);
    try {
      const partnerSessionToken = getPartnerSessionToken();
      const data = await fetchBookings(partnerSessionToken, nextStatus);
      setBookings(data.results || []);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.message === "No bookings found."
      ) {
        setBookings([]);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(status);
  }, [status]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const {
        package_name,
        package_cost,
        user_fullname,
        booking_status,
        start_date,
        end_date,
        adults,
        child,
        total_price,
        user_address_detail,
      } = booking;
      const city = user_address_detail?.city || "";
      const searchLower = searchTerm.toLowerCase();

      return (
        package_name.toLowerCase().includes(searchLower) ||
        package_cost.toString().toLowerCase().includes(searchLower) ||
        user_fullname.toLowerCase().includes(searchLower) ||
        booking_status.toLowerCase().includes(searchLower) ||
        formatDate(start_date).includes(searchTerm) ||
        formatDate(end_date).includes(searchTerm) ||
        adults.toString().toLowerCase().includes(searchLower) ||
        child.toString().toLowerCase().includes(searchLower) ||
        total_price.toString().toLowerCase().includes(searchLower) ||
        city.toLowerCase().includes(searchLower)
      );
    });
  }, [bookings, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

  const paginatedBookings = useMemo(
    () =>
      filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [currentPage, filteredBookings]
  );

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
                  value={STATUS_OPTIONS.find((option) => option.value === status)}
                  onChange={(selectedOption) => {
                    if (!selectedOption?.value) {
                      return;
                    }
                    setStatus(selectedOption.value);
                    setCurrentPage(1);
                  }}
                  options={STATUS_OPTIONS}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={customStyles}
                />
              </div>
              <div className="w-full md:w-[340px]">
                <input
                  type="text"
                  placeholder="Search by package, traveler, date, city..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </AppCard>

          {paginatedBookings.length > 0 ? (
            <>
              <div className="space-y-3">
                {paginatedBookings.map((booking) => (
                  <BookingCard key={booking.booking_id} booking={booking} />
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
