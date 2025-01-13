import React, { useState, useEffect } from "react";
import BookingCard from "../components/BookingCard";
import { fetchBookings } from "../../../../utility/Api";
import NoBookings from "./NoBooking";
import Loader from "../../../../components/loader";
import Pagination from "./Pagination";
import Select from "react-select"; // Import react-select

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TabsWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("Active"); // Default status
  const itemsPerPage = 10;

  const loadBookings = async (status) => {
    try {
      const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
      const data = await fetchBookings(partner_session_token, status);
      setBookings(data.results);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.message === "No bookings found.") {
        setBookings([]);
        setTotalPages(1);
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

  // Commented out search functionality
  /*
  useEffect(() => {
    if (!loading) {
      const filteredBookings = bookings.filter((booking) => {
        const { package_name, package_cost, user_fullname, booking_status, start_date, end_date, adults, child, total_price, user_address_detail } = booking;
        const city = user_address_detail?.city || '';
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
      setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when search term changes
    }
  }, [searchTerm, bookings, loading]);
  */

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption.value);
    setLoading(true); // Set loading to true when status changes
    setCurrentPage(1); // Reset to first page when status changes
  };

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Closed", label: "Closed" },
    { value: "Objection", label: "Objection" }
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#2f855a' : provided.borderColor, // green-800 for border when focused
      '&:hover': {
        borderColor: '#2f855a' // green-800 for border on hover
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#00936C' : provided.backgroundColor, // Custom green color for selected item
      '&:hover': {
        backgroundColor: state.isSelected ? '#00936C' : '#f0fdf4' // Light green for hover
      },
      color: state.isSelected ? 'white' : provided.color // White text for selected item
    })
  };

  const filteredBookings = bookings.filter((booking) => {
    const { package_name, package_cost, user_fullname, booking_status, start_date, end_date, adults, child, total_price, user_address_detail } = booking;
    const city = user_address_detail?.city || '';
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

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-grow flex flex-col w-[90%] mx-auto">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loader
            type="spinner-cub"
            bgColor="#00936c"
            color="#00936c"
            title=""
            size={30}
          />
        </div>
      ) : (
        <>
          <div className="md:flex pt-10 justify-start">
            <div className="mb-4 w-full md:w-1/4">
              <Select
                value={statusOptions.find(option => option.value === status)}
                onChange={handleStatusChange}
                options={statusOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={customStyles}
              />
            </div>
            {/* Uncomment the code below to enable search functionality */}
            {/* 
            <div className="mb-4 ml-4">
              <input
                type="text"
                placeholder="Search"
                className="px-4 lg:w-[296px] py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            */}
          </div>
          {paginatedBookings.length > 0 ? (
            <>
              <div className="mx-auto rounded-lg pb-10 w-full">
                {paginatedBookings.map((booking) => (
                  <BookingCard key={booking.booking_id} booking={booking} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            !loading && (
              <div className="flex-grow flex justify-center items-center pb-10">
                <NoBookings />
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default TabsWithSearch;
