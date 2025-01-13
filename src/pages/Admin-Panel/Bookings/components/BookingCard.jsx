import React from "react";
import view from "../../../../assets/view.svg";
import { useNavigate } from "react-router-dom";

// Function to determine the color of the status label based on the booking status
const getStatusColor = (status) => {
  switch (status) {
    case "Objection":
      return "bg-[#FDECEA] text-[#F04438] font-semibold"; // Red for rejected
    case "Active":
      return "bg-[#c8eddb] text-[#019267] font-semibold"; // Green for active
    case "Pending":
      return "bg-[#fff0e1] text-[#FF9F43] font-semibold"; // Orange for pending
    case "Completed":
      return "bg-[#f1f1f2] text-[#A8AAAE] font-semibold"; // Blue for completed
    case "Closed":
      return "bg-[#d6eee7] text-[#00936C] font-semibold"; // Grey for closed
    default:
      return "bg-gray-200 text-gray-800 font-semibold"; // Default gray
  }
};

const BookingCard = ({ booking }) => {
  const { user_address_detail } = booking;
  const navigate = useNavigate();

  const handleCardClick = (booking_number) => {
    navigate(`/bookingdetails?booking_number=${booking_number}`);
  };

  return (
    <div className="relative flex flex-col md:flex-row w-full items-center px-6 py-4 bg-white border border-[#dcdcdc] space-x-0 shadow-sm rounded-lg my-2">
      {/* Column 1 */}
      <div className="flex flex-col items-start w-full md:w-1/6">
        <h2 className="font-normal text-gray-600 text-base md:text-sm xl:text-base">
          {booking.package_name}
        </h2>
        <p className="font-thin text-gray-400 text-xs">
          PKR {booking.package_cost} per person
        </p>
      </div>

      {/* Column 2 */}
      <div className="flex items-center w-full md:w-1/6 space-x-3">
        <div className="bg-purple-200 text-purple-800 text-xs rounded-full px-2 py-1 h-10 w-10 flex items-center justify-center">
          {booking.user_fullname.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h3 className="font-normal text-gray-600 text-base md:text-sm xl:text-base">
            {booking.user_fullname}
          </h3>
          <p className="font-thin text-gray-400 text-sm md:text-xs xl:text-sm">
            {user_address_detail ? user_address_detail.city : "Unknown City"}
          </p>
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col justify-between border-t-2 md:border-t-0 md:border-x-2 border-gray-300 pt-4 md:pt-0 md:px-8">
        <p className="font-medium text-gray-600 text-base md:text-sm xl:text-sm 2xl:text-base">
          {new Date(booking.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          , {new Date(booking.start_date).getFullYear()}
          <span className="text-[#00936C] font-medium text-sm"> to</span>
        </p>
        <p className="font-medium text-gray-600 text-base md:text-sm xl:text-sm 2xl:text-base">
          {new Date(booking.end_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          , {new Date(booking.end_date).getFullYear()}
        </p>
      </div>

      {/* Column 4 */}
      <div className="flex flex-col justify-between pl-4 text-[#4B465C] text-sm font-normal opacity-80 border-t-2 md:border-t-0 pt-4 md:pt-0 w-full md:w-1/6">
        <p className="text-gray-500">
          {booking.adults} Adults, {booking.child} children
        </p>
        <p className="font-medium">PKR {booking.total_price}</p>
      </div>

      {/* Column 5 */}
      <div className="hidden lg:flex items-center justify-start pl-8 w-full md:w-1/6">
        <span
          className={`${getStatusColor(booking.booking_status)} px-4 py-1.5 text-sm rounded-md font-semibold text-left`}
        >
          {booking.booking_status}
        </span>
      </div>

      {/* Column 6 */}
      <div className="flex items-center justify-center w-full md:w-1/6">
        <button
          className="border flex items-center justify-center font-normal border-[#00936C] text-[#00936C] w-auto hover:bg-green-50 py-1 px-2 rounded-md text-sm"
          onClick={() => handleCardClick(booking.booking_number)}
        >
          View
          <img src={view} alt="view" className="ml-1" />
        </button>
      </div>

      {/* Status label for mobile view */}
      <div className="absolute top-2 right-2 md:hidden">
        <span
          className={`${getStatusColor(booking.booking_status)} px-4 py-1.5 text-sm rounded-md font-semibold`}
        >
          {booking.booking_status}
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
