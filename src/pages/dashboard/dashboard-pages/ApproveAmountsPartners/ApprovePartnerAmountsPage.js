import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { fetchPendingPartnerPayments } from "../../../../utility/Super-Admin-Api"; // Import your API function
import NoContent from "../../../../components/NoContent"; // Import NoContent component
import BackButton from "../../../../components/BackButton";

const ApprovePartnerAmountsPage = () => {
  const [bookings, setBookings] = useState([]); // State to store the fetched bookings
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      const { status, data, error } = await fetchPendingPartnerPayments();

      if (status === 200 && data.length > 0) {
        setBookings(data);
      } else if (status === 404) {
        setBookings([]);
      } else {
        setError(error || "An error occurred while fetching data.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
  const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle clicking on "Action" button
  const handleActionClick = (booking) => {
    navigate("/booking-details-for-partners", { state: { booking } });
  };

  // Calculate total pages
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[90%] mx-auto">
        <BackButton />
        {bookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 w-full">
              {currentItems.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row items-center lg:items-start p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full"
                >
                  {/* Partner Details */}
                  <div className="w-full lg:w-[20%] mb-4 lg:mb-0">
                    <p className="text-xs text-gray-500">Partner name</p>
                    <h2 className="text-sm text-gray-700">
                      {booking.partner_name || "Name not provided"}
                    </h2>
                  </div>

                  {/* Booking Number */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-x lg:text-center">
                    <p className="text-xs text-gray-500">Booking Number</p>
                    <a href="#" className="text-blue-500 underline">
                      {booking.booking_number}
                    </a>
                  </div>

                  {/* Created Date */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:text-center">
                    <p className="text-xs text-gray-500">Created date</p>
                    <p className="text-sm text-gray-700">
                      {new Date(booking.create_date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Receivable Amount */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-x lg:text-center">
                    <p className="text-xs text-gray-500">Receivable amount</p>
                    <p className="text-sm text-[#00936C]">
                      PKR {booking.receivable_amount}
                    </p>
                  </div>

                  {/* Pending Amount */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:text-center">
                    <p className="text-xs text-gray-500">Pending amount</p>
                    <p className="text-sm text-gray-700">
                      PKR {booking.pending_amount}
                    </p>
                  </div>

                  {/* Processed Amount */}
                  <div className="w-full lg:w-[15%] mb-4 lg:mb-0 lg:border-l lg:text-center">
                    <p className="text-xs text-gray-500">Processed amount</p>
                    <p className="text-sm text-gray-700">
                      PKR {booking.processed_amount}
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

export default ApprovePartnerAmountsPage;
