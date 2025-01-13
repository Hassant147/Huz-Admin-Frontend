import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { fetchPaidBookings } from "../../../../utility/Super-Admin-Api"; // Import your API function
import NoContent from "../../../../components/NoContent"; // Import NoContent component
import SearchBar from "./SearchBar"; // Import the SearchBar component
import BackButton from "../../../../components/BackButton";

const ApproveAmountsPage = () => {
  const [bookings, setBookings] = useState([]); // State to store the fetched bookings
  const [filteredBookings, setFilteredBookings] = useState([]); // State for filtered bookings
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      const { status, data, error } = await fetchPaidBookings();

      if (status === 200 && data.length > 0) {
        setBookings(data);
        setFilteredBookings(data); // Initially, show all bookings
      } else if (status === 404) {
        setBookings([]);
        setFilteredBookings([]);
      } else {
        setError(error || "An error occurred while fetching data.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (date) => {
    const filtered = bookings.filter(
      (booking) =>
        new Date(booking.order_time).toLocaleDateString() ===
        date.toLocaleDateString()
    );
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleClearFilter = () => {
    setFilteredBookings(bookings); // Reset to show all bookings
    setCurrentPage(1); // Reset to the first page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle clicking on "Action" button
  const handleActionClick = (booking) => {
    navigate("/booking-details", { state: { booking } });
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[90%] mx-auto">
        <BackButton />
        {/* Search Bar and Clear Filter Button */}
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={handleClearFilter}
            className="text-[#00936C] font-semibold border border-[#00936C] rounded px-4 py-2 hover:bg-[#00936C] hover:text-white"
          >
            Clear Filter
          </button>
        </div>

        {filteredBookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 w-full">
              {currentItems.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row items-center lg:items-start p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full"
                >
                  {/* Partner Details */}
                  <div className="w-full lg:w-[20%] mb-4 lg:mb-0">
                    <p className="text-xs text-gray-500">User name</p>
                    <h2 className="text-sm text-gray-700">
                      {booking.user_fullName || "Name not provided"}
                    </h2>
                  </div>

                  {/* Booking Number */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-x lg:text-center">
                    <p className="text-xs text-gray-500">Booking Number</p>
                    <a href="#" className="text-blue-500 underline">
                      {booking.booking_number}
                    </a>
                  </div>

                  {/* Raised Date */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:text-center">
                    <p className="text-xs text-gray-500">Raised date</p>
                    <p className="text-sm text-gray-700">
                      {new Date(booking.order_time).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Booking Amount */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-x lg:text-center">
                    <p className="text-xs text-gray-500">Booking Amount</p>
                    <p className="text-sm text-gray-700">
                      {booking.total_price}
                    </p>
                  </div>

                  {/* Payment Type */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:text-center">
                    <p className="text-xs text-gray-500">Payment Type</p>
                    <p className="text-sm">{booking.payment_type}</p>
                  </div>
                  {/* Booking Status */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-l lg:text-center">
                    <p className="text-xs text-gray-500">Booking Status</p>
                    <p className="text-sm text-gray-700">
                      {booking.booking_status}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="w-full lg:w-auto text-right lg:text-left lg:flex-1 items-center justify-end space-x-2 lg:space-x-16 lg:flex">
                    <button
                      className="text-[#00936C] font-semibold border border-[#00936C] rounded px-2 lg:px-3 py-1 hover:bg-[#00936C] hover:text-white"
                      onClick={() => handleActionClick(booking)}
                    >
                      Action
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === pageNumber
                        ? "bg-[#00936C] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <NoContent />
        )}
      </div>
    </div>
  );
};

export default ApproveAmountsPage;
